function openSelectedLinks() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var range = sheet.getActiveRange();
  var data = range.getValues();

  openTabs(data);
}


function openTabs(urls) {
  if(!Array.isArray(urls))
    urls = [urls];

  var html = 
    "<script>" + 
      urls.map(function(url) {
        return "window.open('" + url + "');";
      })
      .join('') +
      "google.script.host.close();" + 
    "</script>"; 

  var userInterface = HtmlService.createHtmlOutput(html)
  .setWidth( 90 )
  .setHeight( 1 );

  SpreadsheetApp.getUi().showModalDialog(userInterface, 'Opening...');
}
