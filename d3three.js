D3THREE = function() {
}

D3THREE.prototype.init = function() {
  // standard THREE stuff, straight from examples
  this.renderer = new THREE.WebGLRenderer({alpha: true});
  this.renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( this.renderer.domElement );

  this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
  this.camera.position.z = 400;

  this.controls = new THREE.OrbitControls( this.camera );
	//this.controls.damping = 0.2;
	//this.controls.addEventListener( 'change', render );

  this.scene = new THREE.Scene();

  //var light = new THREE.DirectionalLight( 0xffffff );
  //light.position.set( 0, 0, 1 );
  //this.scene.add( light );

  var light = new THREE.AmbientLight( 0xffffff ); // soft white light
  this.scene.add( light );

  var geometry = new THREE.BoxGeometry( 20, 20, 20 );
  var material = new THREE.MeshLambertMaterial( {
      color: config.color1, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );

  // create container for our 3D chart
  chart3d = new THREE.Object3D();
  chart3d.rotation.x = 0.6;
  this.scene.add( chart3d );

  // use D3 to set up 3D bars
  d3.select( chart3d )
      .selectAll()
      .data(barData)
  .enter().append( function() { return new THREE.Mesh( geometry, material ); } )
      .attr("position.x", function(d, i) { return 30 * i; })
      .attr("position.y", function(d, i) { return d; })
      .attr("scale.y", function(d, i) { return d / 10; })

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
}

D3THREE.Axis.prototype.scale = function(s) {
  if (s) {
    this._scale = s;
  }
  return this;
}

D3THREE.Axis.prototype.render = function(dt) {
  var material = new THREE.LineBasicMaterial({
    color: 0x0000ff
  });
  
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(-100, 0, 0));
  geometry.vertices.push(new THREE.Vector3(0, 100, 0));
  geometry.vertices.push(new THREE.Vector3(100, 0, 0));
  
  var line = new THREE.Line(geometry, material);
  
  dt.scene.add(line);
}

d3three.axis = function() {
  return new D3THREE.Axis();
}
