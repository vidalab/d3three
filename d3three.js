var camera, scene, renderer, chart3d, controls;

D3THREE = function() {
}

D3THREE.prototype.init = function() {
  // standard THREE stuff, straight from examples
  renderer = new THREE.WebGLRenderer({alpha: true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.z = 400;

  controls = new THREE.OrbitControls( camera );
	//controls.damping = 0.2;
	//controls.addEventListener( 'change', render );

  scene = new THREE.Scene();

  //var light = new THREE.DirectionalLight( 0xffffff );
  //light.position.set( 0, 0, 1 );
  //scene.add( light );

  var light = new THREE.AmbientLight( 0xffffff ); // soft white light
  scene.add( light );

  var geometry = new THREE.BoxGeometry( 20, 20, 20 );
  var material = new THREE.MeshLambertMaterial( {
      color: config.color1, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );

  // create container for our 3D chart
  chart3d = new THREE.Object3D();
  chart3d.rotation.x = 0.6;
  scene.add( chart3d );

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
  renderer.render( scene, camera );
  //controls.update();
}

d3three = new D3THREE();

D3THREE.Axis = function() {
  this._scale = d3.scale.linear();
}

D3THREE.Axis.prototype.scale = function(s) {
  if (s) {
    this._scale = s;
  } else {
    return this._scale;
  }
}

D3THREE.Axis.prototype.axis = function() {
  
}

d3three.axis = new D3THREE.Axis();
