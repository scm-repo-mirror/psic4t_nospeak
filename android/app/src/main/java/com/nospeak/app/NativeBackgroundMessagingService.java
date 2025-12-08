package com.nospeak.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashSet;
import java.util.Set;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;
import okio.ByteString;

public class NativeBackgroundMessagingService extends Service {


    public static final String ACTION_START = "com.nospeak.app.NATIVE_BG_MSG_START";
    public static final String ACTION_UPDATE = "com.nospeak.app.NATIVE_BG_MSG_UPDATE";

    public static final String EXTRA_MODE = "mode"; // "nsec" or "amber"
    public static final String EXTRA_PUBKEY_HEX = "pubkeyHex";
    public static final String EXTRA_NSEC_HEX = "nsecHex";
    public static final String EXTRA_READ_RELAYS = "readRelays";
    public static final String EXTRA_SUMMARY = "summary";

    private static final String CHANNEL_ID = "nospeak_background_service";
    private static final String CHANNEL_MESSAGES_ID = "nospeak_background_messages";
    private static final int NOTIFICATION_ID = 1001;

    private String currentSummary = "Connected to read relays";

    private OkHttpClient client;
    private final Set<WebSocket> sockets = new HashSet<>();
    private final Set<String> seenEventIds = new HashSet<>();
    private final Set<WebSocket> historyCompleted = new HashSet<>();
    private String currentPubkeyHex;
    private String currentMode = "amber";


    @Override
    public void onCreate() {
        super.onCreate();
        client = new OkHttpClient();
        createNotificationChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null) {
            stopSelf();
            return START_NOT_STICKY;
        }

        String action = intent.getAction();
        if (ACTION_UPDATE.equals(action)) {
            String summary = intent.getStringExtra(EXTRA_SUMMARY);
            if (summary != null) {
                currentSummary = summary;
                Notification notification = buildNotification(currentSummary);
                NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                manager.notify(NOTIFICATION_ID, notification);
            }
            return START_STICKY;
        }

        if (ACTION_START.equals(action) || action == null) {
            String summary = intent.getStringExtra(EXTRA_SUMMARY);
            if (summary != null) {
                currentSummary = summary;
            }

            currentMode = intent.getStringExtra(EXTRA_MODE);
            if (currentMode == null) {
                currentMode = "amber";
            }

            currentPubkeyHex = intent.getStringExtra(EXTRA_PUBKEY_HEX);
            String[] relays = intent.getStringArrayExtra(EXTRA_READ_RELAYS);

            Notification notification = buildNotification(currentSummary);
            startForeground(NOTIFICATION_ID, notification);


            if (currentPubkeyHex != null && relays != null && relays.length > 0) {
                startRelayConnections(relays, currentPubkeyHex);
            }

            return START_STICKY;
        }



        return START_STICKY;
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        for (WebSocket socket : sockets) {
            socket.close(1000, "Service destroyed");
        }
        sockets.clear();
        seenEventIds.clear();
        historyCompleted.clear();
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (manager == null) {
                return;
            }

            // Clean up any legacy foreground-service channel that may still be marked as badgeable
            // from earlier builds.
            manager.deleteNotificationChannel("nospeak_background_messaging");

            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "nospeak background messaging",
                    NotificationManager.IMPORTANCE_MIN
            );
            channel.setDescription("Keeps nospeak connected to read relays in the background");
            // Do not show app icon badge for the persistent foreground-service notification.
            channel.setShowBadge(false);

            NotificationChannel messagesChannel = new NotificationChannel(
                    CHANNEL_MESSAGES_ID,
                    "nospeak background messages",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            messagesChannel.setDescription("Notifications for new encrypted messages received in background");
            // Allow app icon badges for actual message notifications.
            messagesChannel.setShowBadge(true);

            manager.createNotificationChannel(channel);
            manager.createNotificationChannel(messagesChannel);
        }
    }
 
 
     private void startRelayConnections(String[] relays, String pubkeyHex) {
        for (String relayUrl : relays) {
            if (relayUrl == null || relayUrl.isEmpty()) continue;

            Request request = new Request.Builder()
                    .url(relayUrl)
                    .build();

            WebSocket socket = client.newWebSocket(request, new WebSocketListener() {
                @Override
                public void onOpen(WebSocket webSocket, Response response) {
                    // Subscribe to gift-wrapped messages for this user
                    try {
                        JSONArray filters = new JSONArray();
                        JSONObject filter = new JSONObject();
                        filter.put("kinds", new JSONArray().put(1059));

                        JSONArray pTag = new JSONArray();
                        pTag.put(pubkeyHex);
                        filter.put("#p", pTag);
                        filters.put(filter);

                        JSONArray req = new JSONArray();
                        req.put("REQ");
                        req.put("nospeak-native-bg");
                        req.put(filter);

                        webSocket.send(req.toString());
                    } catch (JSONException e) {
                        // Ignore malformed JSON construction
                    }
                }

                @Override
                public void onMessage(WebSocket webSocket, String text) {
                    handleNostrMessage(webSocket, text);
                }

                @Override
                public void onMessage(WebSocket webSocket, ByteString bytes) {
                    handleNostrMessage(webSocket, bytes.utf8());
                }


                @Override
                public void onFailure(WebSocket webSocket, Throwable t, Response response) {
                    // Let OkHttp/OS handle reconnection behavior via service restart if needed
                }
            });

            sockets.add(socket);
        }
    }

    private void handleNostrMessage(WebSocket socket, String text) {
        try {
            JSONArray arr = new JSONArray(text);
            if (arr.length() < 2) return;

            String type = arr.optString(0, "");

            if ("EOSE".equals(type)) {
                synchronized (historyCompleted) {
                    historyCompleted.add(socket);
                }
                return;
            }

            if (!"EVENT".equals(type) || arr.length() < 3) return;

            JSONObject event = arr.optJSONObject(2);
            if (event == null) return;

            int kind = event.optInt("kind", -1);
            if (kind != 1059) return;

            String id = event.optString("id", null);
            if (id == null) return;

            synchronized (seenEventIds) {
                if (seenEventIds.contains(id)) {
                    return;
                }
                seenEventIds.add(id);
            }

            boolean isHistoryCompleteForSocket;
            synchronized (historyCompleted) {
                isHistoryCompleteForSocket = historyCompleted.contains(socket);
            }

            // Before EOSE, treat events as history and do not notify.
            if (!isHistoryCompleteForSocket) {
                return;
            }

            // For now we do not decrypt; show a generic notification
            showGenericEncryptedMessageNotification();

        } catch (JSONException e) {
            // Ignore malformed messages
        }
    }


    private void showGenericEncryptedMessageNotification() {
        // Only surface background notifications when the app UI is not visible
        if (MainActivity.isAppVisible()) {
            return;
        }

        NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager == null) return;
 
        Intent intent = new Intent(this, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(
                this,
                1,
                intent,
                PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT
        );
 
        String title = "New encrypted message";
        String body = "You received a new message. Open nospeak to read it.";
 
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_MESSAGES_ID)
                .setContentTitle(title)
                .setContentText(body)
                .setSmallIcon(R.drawable.ic_stat_nospeak)
                .setContentIntent(pendingIntent)
                .setAutoCancel(true)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);
 
        int id = (int) (System.currentTimeMillis() & 0x7FFFFFFF);
        manager.notify(id, builder.build());
    }


    private Notification buildNotification(String summary) {
        Intent intent = new Intent(this, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(
                this,
                0,
                intent,
                PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT
        );

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("nospeak background messaging")
                .setContentText(summary)
                .setSmallIcon(R.drawable.ic_stat_nospeak)
                .setContentIntent(pendingIntent)
                .setOngoing(true)
                .setCategory(NotificationCompat.CATEGORY_SERVICE)
                .setPriority(NotificationCompat.PRIORITY_MIN);

        return builder.build();
    }
}
