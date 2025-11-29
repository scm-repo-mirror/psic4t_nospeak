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
    class="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
  >
    <span class="text-lg">🖼️</span>
    <span>Image</span>
  </button>
  <button
    type="button"
    onclick={handleVideoClick}
    class="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
  >
    <span class="text-lg">🎥</span>
    <span>Video</span>
  </button>
</div>