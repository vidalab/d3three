$(document).ready(function() {
  // read manifest
  $.get('manifest.json', function(manifest) {
    window.config = {};
    var properties = manifest.properties;
    properties.forEach(function(p) {
      window.config[p.name] = p.value;
    });
    
    // load HTML and append to body canvas
    var document_html = manifest.html[0],
        document_css = manifest.stylesheet[0],
        document_data = manifest.data[0]
      
    $.get(document_html, function(html) {
      $('#canvas').append(html);
      
      function run() {
        // load CSS
        var css = $('<link rel="stylesheet" type="text/css" href="' + document_css + '" />');
        $('body').append(css);

        // load Javascript
        for (var i = 0; i < manifest.javascript.length; i++) {
          var js = manifest.javascript[i]
          var script = $('<script type="text/javascript" src="' + js +'"></script>');
          $('body').append(script);
        }
      }
      
      if (document_data.indexOf('.json') !== -1) {
        $.get(document_data, function(data) {
          window.data = data;
          run();
        })
      } else if (document_data.indexOf('.csv') !== -1) {
        d3.csv(document_data, function(data) {
          window.data = data;
          run();
        });
      } else if (document_data.indexOf('.tsv') !== -1) {
        d3.tsv(document_data, function(data) {
          window.data = data;
          run();
        });
      }
    });
  });
  
});
