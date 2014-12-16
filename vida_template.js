$(document).ready(function() {
  // read manifest
  $.get('manifest.json', function(manifest) {
    window.config = manifest.properties;
    
    // load HTML and append to body canvas
    $.get('document.html', function(html) {
      $('#canvas').append(html);
      
      // load CSS
      var css = $('<link rel="stylesheet" type="text/css" href="document.css" />');
      $('body').append(css);
      
      // load Javascript
      var script = $('<script type="text/javascript" src="document.js"></script>');
      $('body').append(script);
    });
  });
  
});