function openImageUploader() {
    var html = HtmlService.createTemplateFromFile('image-uploader')
        .evaluate().setSandboxMode(HtmlService.SandboxMode.NATIVE)
        .setWidth(540)
        .setHeight(540 * 5);

    SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
        .showModalDialog(html, 'Image Uploader');

}

function openImageUploaderSidebar() {
    var html = HtmlService.createTemplateFromFile('image-uploader')
        .evaluate()
        .setTitle('Image Uploader')
        .setWidth(540)
        .setHeight(540 * 5);

    SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
        .showSidebar(html);
}


//==========A1 notations==========
function getSelectedCellNames() {

    var ranges = [];
    var sel = SpreadsheetApp.getActive().getSelection().getActiveRangeList().getRanges();
    for (var i = 0; i < sel.length; i++) {
        ranges.push(sel[i].getA1Notation())
    }
    // Logger.log(ranges);
    // Logger.log(getUniqueCells(ranges));
    return getUniqueCells(ranges);
}

function getUniqueCells(inputArray) {
    var uniqueCells = [];

    inputArray.forEach(function(value) {
        var range = value.split(':');

        if (range.length === 1) {
            // Single cell
            uniqueCells.push(range[0]);
        } else {
            // Range of cells
            var startCell = parseA1Notation(range[0]);
            var endCell = parseA1Notation(range[1]);

            for (var row = startCell.row; row <= endCell.row; row++) {
                for (var col = startCell.col; col <= endCell.col; col++) {
                    uniqueCells.push(generateA1Notation(row, col));
                }
            }
        }
    });

    return uniqueCells;
}

function parseA1Notation(a1Notation) {
    var matches = a1Notation.match(/([A-Z]+)(\d+)/);
    var colString = matches[1];
    var row = parseInt(matches[2], 10);

    var col = 0;
    for (var i = 0; i < colString.length; i++) {
        col += (colString.charCodeAt(i) - 65 + 1) * Math.pow(26, colString.length - i - 1);
    }

    return {
        row: row,
        col: col
    };
}

function generateA1Notation(row, col) {
    var colString = '';
    while (col > 0) {
        var remainder = (col - 1) % 26;
        colString = String.fromCharCode(65 + remainder) + colString;
        col = Math.floor((col - remainder) / 26);
    }

    return colString + row;
}

//==========Files==========
function updateCellWithImage(fileBlob, cellNotation) {
    // var dummyImageBlob = Utilities.newBlob("Dummy Image", "image/jpeg", "dummy.jpg");
    // fileBlob = dummyImageBlob
    if (fileBlob != null) {
        var imageFile = DriveApp.createFile(Utilities.newBlob(...fileBlob));
        // Set the access to anyone with the link
        imageFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

        var imageUrl = imageFile.getDownloadUrl();
        var image = SpreadsheetApp
            .newCellImage()
            .setSourceUrl(imageUrl)
            .setAltTextTitle("")
            .setAltTextDescription("")
            .toBuilder()
            .build();

        // Set the value of the specified cell with the image
        var sheet = SpreadsheetApp.getActiveSheet();
        var range = sheet.getRange(cellNotation);
        range.setValue(image);
        // console.log(cellNotation);

        // DriveApp.getFileById(imageFile.getId()).setTrashed(true); // Set the file's trashed attribute to true (moves it to the trash folder)
        deleteDriveItem(imageFile.getId()); // Permanently delete the file from Google Drive using the Drive REST API as an advanced service.
    }
}

function deleteDriveItem(fileId) {
    var file = Drive.Files.get(fileId);
    if (file.mimeType === MimeType.FOLDER) {
        // Possibly ask for confirmation before deleting this folder.
    }
    Drive.Files.remove(file.id); // "remove" in Apps Script client library, "delete" elsewhere
}

//==========Helpers==========

function include(filename) {

    return HtmlService.createHtmlOutputFromFile(filename).getContent();

}
