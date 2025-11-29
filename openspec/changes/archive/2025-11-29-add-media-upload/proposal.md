# Change: Add Media Upload Support

## Why
Users need to share images and videos in chat conversations to enable richer communication beyond text-only messages.

## What Changes
- Add media upload button replacing user profile picture in message input area
- Create dropdown menu for selecting file type (Image/Video)
- Implement file upload with UUID naming in `user_media` folder
- Serve uploaded files from static directory
- Insert file URLs into message input for user to complete message
- **BREAKING**: Remove user profile picture from message input area

## Impact
- Affected specs: messaging (new media capability)
- Affected code: ChatView.svelte, new MediaUpload component, static file serving
