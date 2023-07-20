# Sheets Helpers - Image Uploader

Quickly add images from either upload or clipboard, with support for batch uploading.

## Usage Guide

1. Select a range or any number of cells (they don't have to be in a straight range: for example, selecting 2 separate cells A2 + C3 is fine).
2. Go to the 'Sheets Helpers' menu bar and choose 'Image Uploader' or 'Image Uploader Sidebar' (preferred).
3. The cells you selected will show up in Image Uploader. Try uploading some images and click 'Insert All'.
4. To reset the table with the currently selected cells, click 'Refresh'.

Pro Tip: You can batch upload images by dragging them into the 'Choose Files' input at the top. This method is the fastest.

## How It Works

- The script fetches the currently selected cells' A1 notations via Apps Script and displays them on the table.
- When you click the 'Insert All' button, the script uploads the images to the user's Google Drive, inserts them back into the cells, and then deletes the images from Google Drive.

**Note:** There are two methods to delete files from Google Drive, implemented in lines 112-113 in Uploader.gs:
- For the default (permanent delete) method `deleteDriveItem()` to work, you'll need to enable the Drive REST API.
- Alternatively, the `setTrashed()` method will move the temp files to your Google Drive's Trash, which will subsequently be deleted after 30 days.

Choose whichever method you prefer, and just comment out the one you don't want to use while keeping the other.

**Lines 112-113 in Uploader.gs:**
```javascript
// DriveApp.getFileById(imageFile.getId()).setTrashed(true); // Set the file's trashed attribute to true (moves it to the trash folder)
deleteDriveItem(imageFile.getId()); // Permanently delete the file from Google Drive using the Drive REST API as an advanced service.
