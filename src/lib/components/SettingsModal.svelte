<script lang="ts">
    import { notificationService } from '$lib/core/NotificationService';
    
    let { isOpen = false, close = () => {} } = $props<{ isOpen: boolean; close: () => void }>();
    
    let notificationsEnabled = $state(false);
    let isSupported = $state(false);
    let isLoaded = $state(false);

    // Load settings from localStorage
    $effect(() => {
        if (isOpen && !isLoaded) {
            isSupported = notificationService.isSupported();
            const saved = localStorage.getItem('nospeak-settings');
            if (saved) {
                const settings = JSON.parse(saved);
                notificationsEnabled = settings.notificationsEnabled || false;
            }
            isLoaded = true;
        }
    });

    // Save settings to localStorage when notificationsEnabled changes (after initial load)
    $effect(() => {
        if (isLoaded && isOpen) {
            const saved = localStorage.getItem('nospeak-settings');
            const existingSettings = saved ? JSON.parse(saved) : {};
            const settings = {
                ...existingSettings,
                notificationsEnabled
            };
            localStorage.setItem('nospeak-settings', JSON.stringify(settings));
        }
    });

    // Save settings to localStorage when notificationsEnabled changes
    $effect(() => {
        // Only save if the modal is open (to avoid saving during initial load)
        if (isOpen) {
            const saved = localStorage.getItem('nospeak-settings');
            const existingSettings = saved ? JSON.parse(saved) : {};
            const settings = {
                ...existingSettings,
                notificationsEnabled
            };
            localStorage.setItem('nospeak-settings', JSON.stringify(settings));
        }
    });

    async function toggleNotifications() {
        if (!notificationsEnabled) {
            // Request permission
            const granted = await notificationService.requestPermission();
            if (granted) {
                notificationsEnabled = true;
            }
        } else {
            notificationsEnabled = false;
        }
    }

    function handleOverlayClick(e: MouseEvent) {
        if (e.target === e.currentTarget) {
            close();
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            close();
        }
    }
</script>

{#if isOpen}
    <div 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onclick={handleOverlayClick}
        onkeydown={handleKeydown}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        tabindex="-1"
    >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 id="settings-title" class="text-xl font-bold dark:text-white">Settings</h2>
                    <button 
                        onclick={close}
                        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        aria-label="Close settings"
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <label for="notifications-toggle" class="font-medium dark:text-white">Browser Notifications</label>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                {isSupported ? 'Get notified when you receive new messages' : 'Browser notifications not supported in this browser'}
                            </p>
                        </div>
                        {#if isSupported}
                            <button
                                id="notifications-toggle"
                                onclick={toggleNotifications}
                                class={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    notificationsEnabled 
                                        ? 'bg-blue-500' 
                                        : 'bg-gray-200 dark:bg-gray-600'
                                }`}
                                aria-label={notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
                            >
                                <span
                                    class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                ></span>
                            </button>
                        {:else}
                            <span class="text-sm text-gray-400 dark:text-gray-500">Not supported</span>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}