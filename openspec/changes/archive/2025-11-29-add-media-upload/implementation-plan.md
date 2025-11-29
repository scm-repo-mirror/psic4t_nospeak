# Media Upload Implementation Plan

## Overview
This plan outlines the implementation of media upload functionality for the nospeak-web chat application, allowing users to share images and videos in their conversations.

## Technical Architecture

### Backend Changes
1. **Static File Serving**
   - Create `static/user_media/` directory for uploaded files
   - Configure Vite to serve files from this directory
   - Files will be accessible via `/user_media/{uuid-filename}`

2. **Upload API Endpoint**
   - Create server-side endpoint for file uploads
   - Validate file types (images: jpg, png, gif, webp; videos: mp4, webm, mov)
   - Implement size limits (e.g., 10MB for images, 50MB for videos)
   - Generate UUID filenames to prevent conflicts
   - Return file URL after successful upload

### Frontend Components

#### 1. MediaUploadButton Component
- Replace user profile picture in message input area
- Icon-based button (📎 or similar)
- Opens FileTypeDropdown on click

#### 2. FileTypeDropdown Component  
- Dropdown menu with "Image" and "Video" options
- Positioned below the upload button
- Closes on selection or outside click

#### 3. File Upload Flow
- File selection dialog filtered by type
- Upload progress indicator
- Error handling for invalid files
- URL insertion into message input on success

### UI Changes to ChatView.svelte
- Remove Avatar component from message input form (lines 397-405)
- Add MediaUploadButton to the left of textarea
- Update form layout to accommodate new button
- Maintain responsive design

### Message Display Updates
- Extend MessageContent component to detect and render media URLs
- Images: Display inline with max-width constraints
- Videos: Display with HTML5 video controls
- Fallback: Display as clickable links for unsupported types

## File Structure
```
src/
├── lib/components/
│   ├── MediaUploadButton.svelte (NEW)
│   ├── FileTypeDropdown.svelte (NEW)
│   ├── ChatView.svelte (MODIFIED)
│   └── MessageContent.svelte (MODIFIED)
├── routes/api/upload/ (NEW)
│   └── +server.ts (NEW)
└── static/
    └── user_media/ (NEW - auto-created)
```

## Implementation Steps
1. Set up backend file serving and upload API
2. Create MediaUploadButton and FileTypeDropdown components
3. Modify ChatView to integrate upload functionality
4. Update MessageContent to render media
5. Polish UI and error handling

## Security Considerations
- File type validation on both client and server
- File size limits to prevent abuse
- UUID filenames to prevent directory traversal
- Consider virus scanning for production

## Performance Considerations
- Lazy loading for images in message history
- Video thumbnails/preview generation
- Compression options for uploaded media
- CDN integration for production scaling

## Note on Testing
Media upload functionality cannot be tested locally without the proper domain name setup for serving files. Testing will need to be done in the production environment where the correct domain URLs are available.
