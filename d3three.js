D3THREE = function() {
}

D3THREE.prototype.init = function() {
  // standard THREE stuff, straight from examples
  this.renderer = new THREE.WebGLRenderer({alpha: true});
  this.renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( this.renderer.domElement );

  this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
  this.camera.position.z = 800;

  this.controls = new THREE.OrbitControls( this.camera );
	//this.controls.damping = 0.2;
	//this.controls.addEventListener( 'change', render );

  this.scene = new THREE.Scene();

  //var light = new THREE.DirectionalLight( 0xffffff );
  //light.position.set( 0, 0, 1 );
  //this.scene.add( light );

  var light = new THREE.AmbientLight( 0xffffff ); // soft white light
  this.scene.add( light );

  // continue with THREE stuff
  window.addEventListener( 'resize', onWindowResize, false );
}

D3THREE.prototype.animate = function() {
  requestAnimationFrame( d3three.animate );
  //chart3d.rotation.y += 0.01;
  d3three.renderer.render( d3three.scene, d3three.camera );
  //this.controls.update();
}

D3THREE.prototype.render = function(element) {
  element.render(this);
}

d3three = new D3THREE();

D3THREE.Axis = function() {
  this._scale = d3.scale.linear();
  this._orient = "x";
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

D3THREE.Axis.prototype.render = function(dt) {
  var material = new THREE.LineBasicMaterial({
    color: 0xbbbbbb,
    linewidth: 3
  });
  
  var geometry = new THREE.Geometry();
  
  var interval = this._scale.range()[1] / this._scale.ticks().length;
  for (var i = 0; i < this._scale.ticks().length; i++) {
    if (this._orient === "x") {
      // tick
      geometry.vertices.push(new THREE.Vector3(i * interval, 0, 0));
    } else if (this._orient === "y") {
      // tick
      geometry.vertices.push(new THREE.Vector3(0, i * interval, 0));
    } else if (this._orient === "z") {
      // tick
      geometry.vertices.push(new THREE.Vector3(0, 0, i * interval));
    }
    
  }
  
  var line = new THREE.Line(geometry, material);
  
  dt.scene.add(line);
}

d3three.axis = function() {
  return new D3THREE.Axis();
}
