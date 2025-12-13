<script lang="ts">
    import { connectionStats, showRelayStatusModal } from '$lib/stores/connection';
    import { t } from '$lib/i18n';
    import { isAndroidNative } from '$lib/core/NativeDialogs';

    const isAndroidApp = isAndroidNative();
</script>

<div class={`absolute bottom-0 left-0 right-0 z-20 p-2 border-t border-gray-200/50 dark:border-slate-700/70 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex ${
    isAndroidApp ? 'justify-end' : 'justify-center'
}`}>
    <button 
        onclick={() => showRelayStatusModal.set(true)}
        class={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-full text-xs bg-white/80 dark:bg-slate-800/80 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-100 font-medium shadow-sm border border-gray-200/60 dark:border-slate-600 transition-colors ${
            isAndroidApp ? 'mr-2' : ''
        }`}
    >
        <div class={`w-2 h-2 rounded-full ${$connectionStats.connected > 0 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
        {$t('connection.relaysLabel')} {$connectionStats.connected}/{$connectionStats.total}
    </button>
</div>
