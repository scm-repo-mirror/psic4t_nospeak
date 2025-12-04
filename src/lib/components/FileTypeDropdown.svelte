<script lang="ts">
  let { onFileTypeSelect } = $props<{
    onFileTypeSelect: (type: 'image' | 'video') => void;
  }>();

  function handleImageClick() {
    onFileTypeSelect('image');
  }

  function handleVideoClick() {
    onFileTypeSelect('video');
  }
</script>

<div class="py-1">
    <button
        type="button"
        onclick={handleImageClick}
        class="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200"
    >
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-gray-600 dark:text-gray-300"
        >
            <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
            <circle cx="8" cy="10" r="2" />
            <path d="M21 15l-4-4-6 6" />
        </svg>
        <span>Image</span>
    </button>
    <button
        type="button"
        onclick={handleVideoClick}
        class="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-200"
    >
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-gray-600 dark:text-gray-300"
        >
            <rect x="3" y="6" width="13" height="12" rx="2" ry="2" />
            <polygon points="16 10 21 7 21 17 16 14" />
        </svg>
        <span>Video</span>
    </button>
</div>
