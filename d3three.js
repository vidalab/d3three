var chartOffset = -200;

// Override default functions for d3
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

var d3threes = [];
D3THREE = function(singleton) {
  this.labelGroup = new THREE.Object3D();
  this.maxY = 0;
  
  if (!singleton) {
    d3threes.push(this);
  }
}

D3THREE.prototype.init = function(divId) {
  // standard THREE stuff, straight from examples
  this.renderer = new THREE.WebGLRenderer({antialias: true, alpha : true});
  this.renderer.shadowMapEnabled = true;
  this.renderer.shadowMapType = THREE.PCFSoftShadow;
  this.renderer.shadowMapSoft = true;
  this.renderer.shadowCameraNear = 1000;
  this.renderer.shadowCameraFar = 10000;
  this.renderer.shadowCameraFov = 50;
  this.renderer.shadowMapBias = 0.0039;
  this.renderer.shadowMapDarkness = 0.25;
  this.renderer.shadowMapWidth = 10000;
  this.renderer.shadowMapHeight = 10000;
  this.renderer.physicallyBasedShading = true;
  
  var width = document.getElementById(divId).offsetWidth,
      height = document.getElementById(divId).offsetHeight;
  
  this.renderer.setSize( width, height );
  
  document.getElementById(divId).appendChild( this.renderer.domElement );

  this.camera = new THREE.PerspectiveCamera( 30, width / height, 1, 100000 );
  this.camera.position.z = -1000;
  this.camera.position.x = -800;
  this.camera.position.y = 600;

  this.controls = new THREE.OrbitControls( this.camera );

  this.scene = new THREE.Scene();

  var light = new THREE.AmbientLight( 0xbbbbb ); // soft white light
  this.scene.add( light );
    
  this.scene.add(this.labelGroup);

  var self = this;
  var onWindowResize = function() {
    self.camera.aspect = width / height;
    self.camera.updateProjectionMatrix();

    self.renderer.setSize( width, height );
  }
  
  window.addEventListener( 'resize', onWindowResize, false );
}

D3THREE.prototype.animate = function() {
  requestAnimationFrame( d3three.animate );
  
  for (var i = 0; i < d3threes.length; i++) {
    var dt = d3threes[i];
    dt.renderer.render( dt.scene, dt.camera );
    dt.controls.update();
  
    dt.labelGroup.children.forEach(function(l){
      l.rotation.setFromRotationMatrix(dt.camera.matrix, "YXZ");
      l.rotation.x = 0;
      l.rotation.z = 0;
    });
  }
}

D3THREE.prototype.render = function(element, data) {
  element.render(data);
}

d3three = new D3THREE(true);

D3THREE.Axis = function(dt) {
  this._scale = d3.scale.linear();
  this._orient = "x";
  this._tickFormat = function(d) { return d };
  this._dt = dt;
}

D3THREE.Axis.prototype.orient = function(o) {
  if (o) {
    this._orient = o;
  }
  return this;
}

D3THREE.Axis.prototype.scale = function(s) {
  if (s) {
    this._scale = s;
  }
  return this;
}

D3THREE.Axis.prototype.tickFormat = function(f) {
  if (f) {
    this._tickFormat = f;
  }
  return this;
}

D3THREE.Axis.prototype.interval = function() {
  var interval;
  if (typeof(this._scale.rangeBand) === 'function') {
    // ordinal scale
    interval = this._scale.range()[1];
  } else {
    interval = this._scale.range()[1] / this._scale.ticks().length;
  }
  return interval;
}

D3THREE.Axis.prototype.render = function() {
  var material = new THREE.LineBasicMaterial({
    color: 0xbbbbbb,
    linewidth: 2
  });
  
  var tickMaterial = new THREE.LineBasicMaterial({
    color: 0xbbbbbb,
    linewidth: 1
  });
  
  var geometry = new THREE.Geometry();
  
  var interval, ticks;
  if (typeof(this._scale.rangeBand) === 'function') {
    // ordinal scale
    interval = this._scale.range()[1];
    ticks = this._scale.domain();
  } else {
    interval = this._scale.range()[1] / this._scale.ticks().length;
    ticks = this._scale.ticks();
  }
  for (var i = 0; i < ticks.length; i++) {
    var tickMarGeometry = new THREE.Geometry();
    
    var shape = new THREE.TextGeometry(this._tickFormat(ticks[i]),
      {
        size: 5,
        height: 1,
        curveSegments: 20
      });
    var wrapper = new THREE.MeshBasicMaterial({color: 0xbbbbbb});
    var words = new THREE.Mesh(shape, wrapper);
    
    if (this._orient === "y") {
      // tick
      geometry.vertices.push(new THREE.Vector3(i * interval, chartOffset, 0));
      
      tickMarGeometry.vertices.push(new THREE.Vector3(i * interval, chartOffset, 0));
      tickMarGeometry.vertices.push(new THREE.Vector3(i * interval, -10 + chartOffset, 0));
      var tickLine = new THREE.Line(tickMarGeometry, tickMaterial);
      this._dt.scene.add(tickLine);
      
      if (i * interval > this._dt.maxY) {
        this._dt.maxY = i * interval;
      }
      
      words.position.set(i * interval, -20 + chartOffset, 0);
    } else if (this._orient === "z") {
      // tick
      geometry.vertices.push(new THREE.Vector3(0 + this._dt.maxY, i * interval + chartOffset, 0));

      tickMarGeometry.vertices.push(new THREE.Vector3(0 + this._dt.maxY, i * interval + chartOffset, 0));
      tickMarGeometry.vertices.push(new THREE.Vector3(10 + this._dt.maxY, i * interval + chartOffset, 0));
      var tickLine = new THREE.Line(tickMarGeometry, tickMaterial);
      this._dt.scene.add(tickLine);
      
      words.position.set(20 + this._dt.maxY, i * interval + chartOffset, 0);
    } else if (this._orient === "x") {
      // tick
      geometry.vertices.push(new THREE.Vector3(0, chartOffset, i * interval));
      
      tickMarGeometry.vertices.push(new THREE.Vector3(0, 0 + chartOffset, i * interval));
      tickMarGeometry.vertices.push(new THREE.Vector3(0, -10 + chartOffset, i * interval));
      var tickLine = new THREE.Line(tickMarGeometry, tickMaterial);
      this._dt.scene.add(tickLine);
      
      words.position.set(0, -20 + chartOffset, i * interval);
    }
    
    this._dt.labelGroup.add(words);
  }
  
  var line = new THREE.Line(geometry, material);
  
  this._dt.scene.add(line);
}

d3three.axis = function(dt) {
  return new D3THREE.Axis(dt);
}

// Scatter plot
D3THREE.Scatter = function(dt) {
  this._dt = dt;
}

D3THREE.Scatter.prototype.onDocumentMouseMove = function(e) {
}

D3THREE.Scatter.prototype.render = function(data) {
  var geometry = new THREE.SphereGeometry( 5, 32, 32 );
  var material = new THREE.MeshLambertMaterial( {
      color: 0x4682B4, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );

  var chart3d = new THREE.Object3D();
  this._dt.scene.add(chart3d);

  d3.select(chart3d)
        .selectAll()
        .data(data)
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
}

// Surface plot
D3THREE.Surface = function(dt) {
  this._dt = dt;
}

D3THREE.Surface.prototype.render = function(threeData) {
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

  var mesh = new THREE.Mesh( geometry, material );
  this._dt.scene.add(mesh);
}