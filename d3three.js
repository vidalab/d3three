D3THREE = function() {
  this.labelGroup = new THREE.Object3D();
}

D3THREE.prototype.init = function() {
  // standard THREE stuff, straight from examples
  this.renderer = new THREE.WebGLRenderer({alpha: false});
  this.renderer.setSize( window.innerWidth, window.innerHeight );
  document.getElementById('canvas-svg').appendChild( this.renderer.domElement );

  this.camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1000 );
  this.camera.position.z = 800;

  this.controls = new THREE.OrbitControls( this.camera );

  this.scene = new THREE.Scene();

  var light = new THREE.AmbientLight( 0xbbbbb ); // soft white light
  this.scene.add( light );
    
  this.scene.add(this.labelGroup);

  // continue with THREE stuff
  window.addEventListener( 'resize', onWindowResize, false );
}

D3THREE.prototype.animate = function() {
  requestAnimationFrame( d3three.animate );
  d3three.renderer.render( d3three.scene, d3three.camera );
  d3three.controls.update();
  
  d3three.labelGroup.children.forEach(function(l){
    l.rotation.setFromRotationMatrix(d3three.camera.matrix, "YXZ");
    l.rotation.x = 0;
    l.rotation.z = 0;
  });
}

D3THREE.prototype.render = function(element) {
  element.render(this);
}

d3three = new D3THREE();

D3THREE.Axis = function() {
  this._scale = d3.scale.linear();
  this._orient = "x";
  this._tickFormat = function(d) { return d };
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

D3THREE.Axis.prototype.render = function(dt) {
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
    
    if (this._orient === "x") {
      // tick
      geometry.vertices.push(new THREE.Vector3(i * interval, 0, 0));
      
      tickMarGeometry.vertices.push(new THREE.Vector3(i * interval, 0, 0));
      tickMarGeometry.vertices.push(new THREE.Vector3(i * interval, -10, 0));
      var tickLine = new THREE.Line(tickMarGeometry, tickMaterial);
      dt.scene.add(tickLine);
      
      words.position.set(i * interval, -20, 0);
    } else if (this._orient === "y") {
      // tick
      geometry.vertices.push(new THREE.Vector3(0, i * interval, 0));

      tickMarGeometry.vertices.push(new THREE.Vector3(0, i * interval, 0));
      tickMarGeometry.vertices.push(new THREE.Vector3(-10, i * interval, 0));
      var tickLine = new THREE.Line(tickMarGeometry, tickMaterial);
      dt.scene.add(tickLine);
      
      words.position.set(-20, i * interval, 0);
    } else if (this._orient === "z") {
      // tick
      geometry.vertices.push(new THREE.Vector3(0, 0, i * interval));
      
      tickMarGeometry.vertices.push(new THREE.Vector3(0, 0, i * interval));
      tickMarGeometry.vertices.push(new THREE.Vector3(0, -10, i * interval));
      var tickLine = new THREE.Line(tickMarGeometry, tickMaterial);
      dt.scene.add(tickLine);
      
      words.position.set(0, -20, i * interval);
    }
    
    dt.labelGroup.add(words);
  }
  
  var line = new THREE.Line(geometry, material);
  
  dt.scene.add(line);
}

d3three.axis = function() {
  return new D3THREE.Axis();
}
