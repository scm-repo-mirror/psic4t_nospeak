package com.nospeak.app;

import android.view.SoundEffectConstants;
import android.webkit.WebView;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AndroidTapSound")
public class AndroidTapSoundPlugin extends Plugin {

    @PluginMethod
    public void tap(PluginCall call) {
        try {
            if (getActivity() != null) {
                getActivity().runOnUiThread(() -> {
                    WebView webView = getBridge() != null ? getBridge().getWebView() : null;
                    if (webView != null) {
                        webView.playSoundEffect(SoundEffectConstants.CLICK);
                    }
                });
            }
        } catch (Exception ignored) {
            // Best-effort: avoid breaking UX if sound fails
        }

        call.resolve();
    }
}
