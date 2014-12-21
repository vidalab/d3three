/*--- GUIDELINES --- 
1. Use div #canvas-svg for svg rendering
    var svg = d3.select("#canvas-svg");
2. 'data' variable contains JSON data
   'config' variable contains data from Properties tab
    Do NOT overwrite these variables
3. To define customizable properties, use capitalized variable names,
    and define them in Properties tab ---*/

var WIDTH = config.width, HEIGHT = config.height;

var svg = d3.select("#canvas-svg")
          .append("svg");

// Use sourceURL to enable debugging in Chrome
//# sourceURL=document.js