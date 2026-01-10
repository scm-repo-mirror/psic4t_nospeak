import { get } from 'svelte/store';
import { t } from '$lib/i18n';

/**
 * Returns a user-friendly, localized label for a media attachment based on its MIME type.
 * Used in contact list previews and notifications.
 */
export function getMediaPreviewLabel(fileType: string): string {
    // Voice messages (webm/opus or m4a)
    if (
        fileType === "audio/webm" ||
        fileType === "audio/ogg" ||
        fileType === "audio/mp4" ||
        fileType === "audio/x-m4a" ||
        fileType.includes("opus")
    ) {
        return `🎤 ${get(t)("contacts.mediaPreview.voiceMessage")}`;
    }
    // Images
    if (fileType.startsWith("image/")) {
        return `📷 ${get(t)("contacts.mediaPreview.image")}`;
    }
    // Videos
    if (fileType.startsWith("video/")) {
        return `🎬 ${get(t)("contacts.mediaPreview.video")}`;
    }
    // Other audio (music files)
    if (fileType.startsWith("audio/")) {
        return `🎵 ${get(t)("contacts.mediaPreview.audio")}`;
    }
    // Generic file
    return `📎 ${get(t)("contacts.mediaPreview.file")}`;
}
