THREE.Object3D.prototype.appendChild = function (c) {
  this.add(c);
  return c;
};
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

/*var barData = [4, 8, 15, 16, 23, 42];

var geometry = new THREE.CubeGeometry( 20, 20, 20 );
var material = new THREE.MeshLambertMaterial( {
    color: 0x4682B4, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );

var chart3d = new THREE.Object3D();
d3three.scene.add(chart3d);

d3.select(chart3d)
      .selectAll()
      .data(barData)
  .enter().append( function() { return new THREE.Mesh( geometry, material ); } )
      .attr("position.x", function(d, i) { return 30 * i; })
      .attr("position.y", function(d, i) { return d; })
      .attr("scale.y", function(d, i) { return d / 10; });*/

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

var geometry = new THREE.SphereGeometry( 5, 32, 32 );
var material = new THREE.MeshLambertMaterial( {
    color: 0x4682B4, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );

var chart3d = new THREE.Object3D();
d3three.scene.add(chart3d);

d3.select(chart3d)
      .selectAll()
      .data(threeData)
  .enter().append( function() { return new THREE.Mesh( geometry, material ); } )
      .attr("position.x", function(d) {
        return x(d.x);
      })
      .attr("position.z", function(d) {
        return z(d.z);
      })
      .attr("position.y", function(d) {
        return y(d.y);
      })

function onWindowResize() {
  d3three.camera.aspect = window.innerWidth / window.innerHeight;
  d3three.camera.updateProjectionMatrix();

  d3three.renderer.setSize( window.innerWidth, window.innerHeight );
}


// Use sourceURL to enable debugging in Chrome
//# sourceURL=document.js