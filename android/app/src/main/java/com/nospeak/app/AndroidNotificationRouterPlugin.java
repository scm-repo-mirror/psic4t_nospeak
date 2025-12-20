package com.nospeak.app;

import android.content.Intent;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AndroidNotificationRouter")
public class AndroidNotificationRouterPlugin extends Plugin {

    private static final String EXTRA_ROUTE_KIND = "nospeak_route_kind";
    private static final String EXTRA_ROUTE_PARTNER_PUBKEY_HEX = "nospeak_partner_pubkey_hex";

    @PluginMethod
    public void getInitialRoute(PluginCall call) {
        Intent intent = getActivity().getIntent();
        JSObject payload = extractRoutePayload(intent);
        if (payload == null) {
            call.resolve();
            return;
        }

        // Clear the intent so we do not process the same tap twice.
        getActivity().setIntent(new Intent(getContext(), getActivity().getClass()));
        call.resolve(payload);
    }

    @Override
    protected void handleOnNewIntent(Intent intent) {
        super.handleOnNewIntent(intent);
        JSObject payload = extractRoutePayload(intent);
        if (payload != null) {
            notifyListeners("routeReceived", payload, true);
        }
    }

    private JSObject extractRoutePayload(Intent intent) {
        if (intent == null) {
            return null;
        }

        String kind = intent.getStringExtra(EXTRA_ROUTE_KIND);
        String partnerPubkeyHex = intent.getStringExtra(EXTRA_ROUTE_PARTNER_PUBKEY_HEX);
        if (kind == null || kind.isEmpty() || partnerPubkeyHex == null || partnerPubkeyHex.isEmpty()) {
            return null;
        }

        JSObject payload = new JSObject();
        payload.put("kind", kind);
        payload.put("partnerPubkeyHex", partnerPubkeyHex);
        return payload;
    }
}
