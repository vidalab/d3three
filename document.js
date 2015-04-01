//var d3three = new D3THREE();

d3three.init('canvas-scatter');
d3three.animate();

var x = d3.time.scale()
          .range([0, config.x]);

var y = d3.scale.ordinal()
          .rangeBands([0, config.y]);

var z = d3.scale.linear()
          .range([0, config.z]);

var xAxis = d3three.axis()
                .scale(x)
                .orient("z")
                .tickFormat(d3.time.format("%m-%d-%y"));
var yAxis = d3three.axis()
                .scale(y)
                .orient("x");
var zAxis = d3three.axis()
                .scale(z)
                .orient("y");

x.domain(d3.extent(data, function(d) { return d3.time.format("%m/%d/%y").parse(d.Date); }));

var yDomain = Object.keys(data[0]);
yDomain.splice(yDomain.indexOf('Date'), 1);
y.domain(yDomain);

var maxZ = -Number.MAX_VALUE, minZ = Number.MAX_VALUE;
data.forEach(function(d) {
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

d3three.render(xAxis);
d3three.render(yAxis);
d3three.render(zAxis);

// convert data to 3D x, y, z
var threeData = []
data.forEach(function(d) {
  for (var i = 0; i < Object.keys(d).length; i++) {
    if (Object.keys(d)[i] !== 'Date') {
      threeData.push({
        x: d3.time.format('%m/%d/%y').parse(d['Date']),
        y: Object.keys(d)[i],
        z: +d[Object.keys(d)[i]]});
    }
  }
});

var scatter = new D3THREE.Scatter();
d3three.render(scatter, threeData);

var surface = new D3THREE.Surface();
d3three.render(surface, threeData);

// Use sourceURL to enable debugging in Chrome
//# sourceURL=document.js