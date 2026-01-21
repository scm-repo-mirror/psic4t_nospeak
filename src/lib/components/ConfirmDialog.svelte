<script lang="ts">
    import Button from './ui/Button.svelte';

    type ConfirmVariant = 'primary' | 'danger';

    let {
        isOpen = false,
        title = '',
        message = '',
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        confirmVariant = 'primary' as ConfirmVariant,
        onConfirm,
        onCancel
    } = $props<{
        isOpen: boolean;
        title: string;
        message: string;
        confirmText?: string;
        cancelText?: string;
        confirmVariant?: ConfirmVariant;
        onConfirm: () => void;
        onCancel: () => void;
    }>();

    function handleBackdropClick(e: MouseEvent) {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            onCancel();
        }
    }

    $effect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeydown);
            return () => {
                document.removeEventListener('keydown', handleKeydown);
            };
        }
    });
</script>

{#if isOpen}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
        class="fixed inset-0 z-[10000] flex items-center justify-center p-4"
        onclick={handleBackdropClick}
        onkeydown={(e) => { if (e.key === 'Escape') onCancel(); }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        tabindex="-1"
    >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        
        <!-- Dialog -->
        <div class="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 
                id="confirm-dialog-title"
                class="text-lg font-bold text-gray-900 dark:text-white mb-2"
            >
                {title}
            </h3>
            <p class="text-sm text-gray-600 dark:text-slate-400 mb-6">
                {message}
            </p>
            <div class="flex gap-3 justify-end">
                <Button 
                    variant="ghost" 
                    onclick={onCancel}
                >
                    {cancelText}
                </Button>
                <Button 
                    variant={confirmVariant} 
                    onclick={onConfirm}
                >
                    {confirmText}
                </Button>
            </div>
        </div>
    </div>
{/if}
