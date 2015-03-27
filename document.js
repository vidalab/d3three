/*--- GUIDELINES --- 
1. Use div #canvas-svg for svg rendering
    var svg = d3.select("#canvas-svg");
2. 'data' variable contains JSON data
   'config' variable contains data from Properties tab
    Do NOT overwrite these variables
3. To define customizable properties, use capitalized variable names,
    and define them in Properties tab ---*/

// these are, as before, to make D3's .append() and .selectAll() work
THREE.Object3D.prototype.appendChild = function (c) { this.add(c); return c; };
THREE.Object3D.prototype.querySelectorAll = function () { return []; };

// this one is to use D3's .attr() on THREE's objects
THREE.Object3D.prototype.setAttribute = function (name, value) {
    var chain = name.split('.');
    var object = this;
    for (var i = 0; i < chain.length - 1; i++) {
        object = object[chain[i]];
    }
    object[chain[chain.length - 1]] = value;
}

d3three.init();
d3three.animate();

var x = d3.time.scale()
          .range([0, config.width]);

//var y = d3.scale.linear()
//          .range([0, config.height]);

var y = d3.scale.ordinal()
          .rangeBands([0, config.height]);

var z = d3.scale.linear()
          .range([0, config.depth]);

var xAxis = d3three.axis()
                .scale(x)
                .orient("x")
                .tickFormat(d3.time.format("%m-%d-%y"));
var yAxis = d3three.axis()
                .scale(y)
                .orient("z");
var zAxis = d3three.axis()
                .scale(z)
                .orient("y");

x.domain(d3.extent(data, function(d) { return d3.time.format("%m/%d/%y").parse(d.Date); }));

var yDomain = Object.keys(data[0]);
yDomain.splice(yDomain.indexOf('Date'), 1);
y.domain(yDomain);

z.domain(d3.extent(data, function(d) { return d["1 Mo"]; }));

d3three.render(xAxis);
d3three.render(yAxis);
d3three.render(zAxis);

function onWindowResize() {
  d3three.camera.aspect = window.innerWidth / window.innerHeight;
  d3three.camera.updateProjectionMatrix();

  d3three.renderer.setSize( window.innerWidth, window.innerHeight );
}


// Use sourceURL to enable debugging in Chrome
//# sourceURL=document.js