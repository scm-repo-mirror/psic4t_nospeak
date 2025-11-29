<script lang="ts">
    let { content } = $props<{ content: string }>();

    const urlRegex = /(https?:\/\/[^\s]+)/g;

    function isImage(url: string) {
        try {
            const u = new URL(url);
            return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(u.pathname);
        } catch {
            return false;
        }
    }

    function isVideo(url: string) {
        try {
            const u = new URL(url);
            return /\.(mp4|webm|mov|ogg)$/i.test(u.pathname);
        } catch {
            return false;
        }
    }
    
    let parts = $derived(content.split(urlRegex));
    
    // Check if the content is a single emoji
    // Emoji regex to match a single emoji character (including composite ones)
    const singleEmojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)$/u;
    let isSingleEmoji = $derived(singleEmojiRegex.test(content.trim()));
</script>

<div class={`whitespace-pre-wrap break-words ${isSingleEmoji ? 'text-4xl' : ''}`}>
    {#each parts as part}
        {#if part.match(/^https?:\/\//)}
            {#if isImage(part)}
                <a href={part} target="_blank" rel="noopener noreferrer" class="block my-1">
                    <img src={part} alt="Attachment" class="max-w-full rounded max-h-[300px] object-contain" loading="lazy" />
                </a>
            {:else if isVideo(part)}
                <!-- svelte-ignore a11y_media_has_caption -->
                <div class="my-1">
                    <video controls src={part} class="max-w-full rounded max-h-[300px]" preload="metadata"></video>
                </div>
            {:else}
                <a href={part} target="_blank" rel="noopener noreferrer" class="underline hover:opacity-80 break-all">{part}</a>
            {/if}
        {:else}
            <span>{part}</span>
        {/if}
    {/each}
</div>
