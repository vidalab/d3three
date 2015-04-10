var forceTHREE = new D3THREE();
forceTHREE.init('canvas-force');
var forceViz = new D3THREE.Force(forceTHREE);

var threeData = window.data["force_data.json"];

var color = d3.scale.category20();

var spheres = [], three_links = [];
// Define the 3d force
var force = d3.layout.force3d()
    .nodes(sort_data=[])
    .links(links=[])
    .size([50, 50])
    .gravity(0.3)
    .charge(-400)

var DISTANCE = 1;

for (var i = 0; i < threeData.nodes.length; i++) {
  sort_data.push({x:threeData.nodes.x + DISTANCE,y:threeData.nodes.y + DISTANCE,z:0})

  // set up the sphere vars
  var radius = 5,
      segments = 16,
      rings = 16;

  // create the sphere's material
  var nodeColor = +color(threeData.nodes[i].group).replace("#", "0x");
  var sphereMaterial = new THREE.MeshBasicMaterial({ color: nodeColor });

  var sphere = new THREE.Mesh(
    new THREE.SphereGeometry(
      radius,
      segments,
      rings),
    sphereMaterial);

  spheres.push(sphere);

  // add the sphere to the scene
  forceViz._dt.scene.add(sphere);
}

for (var i = 0; i < threeData.links.length; i++) {
  links.push({target:sort_data[threeData.links[i].target],source:sort_data[threeData.links[i].source]});

  var material = new THREE.LineBasicMaterial({ color: forceViz._config.linkColor,
                linewidth: forceViz._config.linkWidth}); 
  var geometry = new THREE.Geometry();

  geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
  geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
  var line = new THREE.Line( geometry, material );
  line.userData = { source: threeData.links[i].source,
                    target: threeData.links[i].target };
  three_links.push(line);
  forceViz._dt.scene.add(line);

  force.start();
}

// set up the axes
var x = d3.scale.linear().domain([0, 350]).range([0, 10]),
    y = d3.scale.linear().domain([0, 350]).range([0, 10]),
    z = d3.scale.linear().domain([0, 350]).range([0, 10]);

var self = forceViz;
force.on("tick", function(e) {
  for (var i = 0; i < sort_data.length; i++) {
    spheres[i].position.set(x(sort_data[i].x) * 40 - 40, y(sort_data[i].y) * 40 - 40,z(sort_data[i].z) * 40 - 40);
  
    for (var j = 0; j < three_links.length; j++) {
      var line = three_links[j];
      var vi = -1;
      if (line.userData.source === i) {
        vi = 0;
      }
      if (line.userData.target === i) {
        vi = 1;
      }
    
      if (vi >= 0) {
        line.geometry.vertices[vi].x = x(sort_data[i].x) * 40 - 40;
        line.geometry.vertices[vi].y = y(sort_data[i].y) * 40 - 40;
        line.geometry.vertices[vi].z = y(sort_data[i].z) * 40 - 40;
        line.geometry.verticesNeedUpdate = true;
      }
    }
  }
});

// call animate loop
d3three.animate();

// Use sourceURL to enable debugging in Chrome
//# sourceURL=document.js