$(document).ready(function() {
  // read manifest
  $.get('manifest.json', function(manifest) {
    window.config = manifest.properties;
    
    // load HTML and append to body canvas
    var document_html = manifest.html[0],
        document_css = manifest.stylesheet[0],
        document_js = manifest.javascript[0],
        document_data = manifest.data[0]
      
    $.get(document_html, function(html) {
      $('#canvas').append(html);
      
      $.get(document_data, function(data) {
        // load CSS
        var css = $('<link rel="stylesheet" type="text/css" href="' + document_css + '" />');
        $('body').append(css);
      
        // load Javascript
        var script = $('<script type="text/javascript" src="' + document_js +'"></script>');
        $('body').append(script);
      })
    });
  });
  
});