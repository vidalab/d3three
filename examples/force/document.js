var yieldData = window.data["yields.tsv"];

var scatter = new D3THREE();

scatter.init('canvas-scatter');

var x = d3.time.scale()
          .range([0, config.x]);

var y = d3.scale.ordinal()
          .rangeBands([0, config.y]);

var z = d3.scale.linear()
          .range([0, config.z]);

var xAxis = d3three.axis(scatter)
                .scale(x)
                .orient("x")
                .tickFormat(d3.time.format("%m-%d-%y"));
var yAxis = d3three.axis(scatter)
                .scale(y)
                .orient("y");
var zAxis = d3three.axis(scatter)
                .scale(z)
                .orient("z");

x.domain(d3.extent(yieldData, function(d) { return d3.time.format("%m/%d/%y").parse(d.Date); }));

var yDomain = Object.keys(yieldData[0]);
yDomain.splice(yDomain.indexOf('Date'), 1);
y.domain(yDomain);

var maxZ = -Number.MAX_VALUE, minZ = Number.MAX_VALUE;
yieldData.forEach(function(d) {
  for (var i = 0; i < Object.keys(d).length; i++) {
    if (Object.keys(d)[i] !== 'Date') {
      if (+d[Object.keys(d)[i]] > maxZ) {
        maxZ = d[Object.keys(d)[i]];
      }
      
      if (+d[Object.keys(d)[i]] < minZ) {
        minZ = d[Object.keys(d)[i]];
      }
    }
  }
});

z.domain([minZ, maxZ]);

scatter.render(xAxis);
scatter.render(yAxis);
scatter.render(zAxis);

// convert yieldData to 3D x, y, z
var threeData = []
yieldData.forEach(function(d) {
  for (var i = 0; i < Object.keys(d).length; i++) {
    if (Object.keys(d)[i] !== 'Date') {
      threeData.push({
        x: d3.time.format('%m/%d/%y').parse(d['Date']),
        y: Object.keys(d)[i],
        z: +d[Object.keys(d)[i]]});
    }
  }
});

var scatterChart = new D3THREE.Scatter(scatter);
scatter.render(scatterChart, threeData);

var surface = new D3THREE();
surface.init('canvas-surface');

var xAxis = d3three.axis(surface)
                .scale(x)
                .orient("x")
                .tickFormat(d3.time.format("%m-%d-%y"));
var yAxis = d3three.axis(surface)
                .scale(y)
                .orient("y");
var zAxis = d3three.axis(surface)
                .scale(z)
                .orient("z");

var surfaceChart = new D3THREE.Surface(surface);
surface.render(xAxis);
surface.render(yAxis);
surface.render(zAxis);
surface.render(surfaceChart, threeData);

var bar = new D3THREE();
bar.init('canvas-bar');

var xAxis = d3three.axis(bar)
                .scale(x)
                .orient("x")
                .tickFormat(d3.time.format("%m-%d-%y"));
var yAxis = d3three.axis(bar)
                .scale(y)
                .orient("y");
var zAxis = d3three.axis(bar)
                .scale(z)
                .orient("z");

var barChart = new D3THREE.Bar(bar);
bar.render(xAxis);
bar.render(yAxis);
bar.render(zAxis);
bar.render(barChart, threeData);

var forceTHREE = new D3THREE();
forceTHREE.init('canvas-force');
var forceViz = new D3THREE.Force(forceTHREE);
forceTHREE.render(forceViz, window.data["force_data.json"]);

// call animate loop
d3three.animate();

// Use sourceURL to enable debugging in Chrome
//# sourceURL=document.js