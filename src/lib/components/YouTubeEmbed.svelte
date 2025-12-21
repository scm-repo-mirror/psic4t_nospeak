<script lang="ts">
    let { videoId } = $props<{ videoId: string }>();

    const embedUrl = $derived(`https://www.youtube-nocookie.com/embed/${videoId}`);
</script>

<div class="mt-1 mb-0 w-full overflow-hidden rounded-xl border border-gray-200/50 dark:border-slate-700/50">
    <div class="relative w-full" style="padding-top: 56.25%;">
        <iframe
            class="absolute inset-0 h-full w-full"
            src={embedUrl}
            title="YouTube video player"
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
        ></iframe>
    </div>
</div>
