# Sheets Helpers - Image Uploader

Quickly add images to Google Sheets from either upload or clipboard, with support for batch uploading.

## Installation Guide
To use the Sheets Helpers - Image Uploader script, follow these steps:

1. Open your Google Sheets document.
2. From the menu bar, go to "Extensions" and choose "Apps Script."
3. A new tab will open with the Apps Script editor. Replace the existing code with the contents of the script "Uploader.gs" and other files from this repository.
4. Save the script by clicking on the floppy disk icon or pressing Ctrl + S (Cmd + S for Mac).
5. Close the Apps Script editor tab and refresh your Google Sheets document. You should now see a new option labeled "Sheets Helpers" in the menu bar.
   
Your Apps Script files should consist of the following files arranged something like this:

![sheets-helper](https://github.com/meap158/sheets-helpers/assets/14327094/adbfd0e3-96d0-4fe0-9d9a-83ea0607c86c)

Watch the demo video to see the script in action:

[<img src="https://github-production-user-asset-6210df.s3.amazonaws.com/14327094/254980913-8590e7d2-2810-44d1-86a1-537c70e8f7f2.png" width="50%">]([https://github.com/meap158/VideoFactory/assets/108891710/b7bd591e-29d6-43c8-8912-8c3fd59a72a2](https://github.com/meap158/sheets-helpers/assets/14327094/df17414b-f65c-4154-bd2d-c6a126dbb875) "Demo: Sheets Helpers")

In this demo video, you can see how to quickly add images using the Sheets Helpers. It demonstrates the steps for selecting cells, opening the Image Uploader, uploading images, and inserting them back into the cells.

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
