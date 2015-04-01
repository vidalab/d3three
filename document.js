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

var geometry = new THREE.SphereGeometry( 5, 32, 32 );
var material = new THREE.MeshLambertMaterial( {
    color: 0x4682B4, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );

var chart3d = new THREE.Object3D();
d3three.scene.add(chart3d);

d3.select(chart3d)
      .selectAll()
      .data(threeData)
  .enter().append( function() { return new THREE.Mesh( geometry, material ); } )
      .attr("position.z", function(d) {
        return x(d.x);
      })
      .attr("position.x", function(d) {
        return y(d.y);
      })
      .attr("position.y", function(d) {
        return z(d.z) + chartOffset;
      });

/* custom surface */
function distance (v1, v2)
{
  var dx = v1.x - v2.x;
  var dy = v1.y - v2.y;
  var dz = v1.z - v2.z;

  return Math.sqrt(dx*dx+dz*dz);
}

var vertices = [];
var holes = [];
var triangles, mesh;
var geometry = new THREE.Geometry();
var material = new THREE.MeshBasicMaterial({color: 0x4682B4});

for (var i = 0; i < threeData.length; i++) {
  vertices.push(new THREE.Vector3(y(threeData[i].y),
    z(threeData[i].z) + chartOffset, x(threeData[i].x)));
}

geometry.vertices = vertices;

for (var i = 0; i < vertices.length; i++) {
  // find three closest vertices to generate surface
  var v1, v2, v3;
  var distances = [];
  
  // find vertices in same y or y + 1 row
  var minY = Number.MAX_VALUE;
  for (var j = i + 1; j < vertices.length; j++) {
    if (i !== j && vertices[j].x > vertices[i].x) {
      if (vertices[j].x < minY) {
        minY = vertices[j].x;
      }
    }
  }
  
  var rowVertices = [], row2Vertices = [];
  for (var j = i + 1; j < vertices.length; j++) {
    if (i !== j && (vertices[j].x === vertices[i].x)) {
      rowVertices.push({index: j, v: vertices[j]});
    }
    if (i !== j && (vertices[j].x === minY)) {
      row2Vertices.push({index: j, v: vertices[j]});
    }
  }
  
  if (rowVertices.length >= 1 && row2Vertices.length >= 2) {
    // find smallest x
    rowVertices.sort(function(a, b) {
      if (a.v.z < b.v.z) {
        return -1;
      } else if (a.v.z === b.v.z) {
        return 0;
      } else {
        return 1;
      }
    });
    
    v1 = rowVertices[0].index;
    
    row2Vertices.sort(function(a, b) {
      if (a.v.z < b.v.z) {
        return -1;
      } else if (a.v.z === b.v.z) {
        return 0;
      } else {
        return 1;
      }
    });
    
    v2 = row2Vertices[0].index;
    v3 = row2Vertices[1].index;
    
    var fv = [i, v1, v2, v3];
    fv = fv.sort(function(a, b) {
      if (a < b) return -1;
      else if (a === b) return 0;
      else return 1;
    });
    
    geometry.faces.push( new THREE.Face3(fv[1], fv[0], fv[3]));
    geometry.faces.push( new THREE.Face3(fv[0], fv[2], fv[3]));
  }
}

mesh = new THREE.Mesh( geometry, material );
d3three.scene.add(mesh);

// Use sourceURL to enable debugging in Chrome
//# sourceURL=document.js