function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Sheets Helpers')
    .addItem('Image Uploader', 'openImageUploader')
    .addItem('Image Uploader Sidebar', 'openImageUploaderSidebar')
    .addSeparator()
    .addItem('Open Selected Links', 'openSelectedLinks')
    .addToUi();
}

