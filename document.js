/*--- GUIDELINES --- 
1. Use div #canvas-svg for svg rendering
    var svg = d3.select("#canvas-svg");
2. 'data' variable contains JSON data
   'config' variable contains data from Properties tab
    Do NOT overwrite these variables
3. To define customizable properties, use capitalized variable names,
    and define them in Properties tab ---*/

var WIDTH = config.width, HEIGHT = config.height;

var barData = [4, 8, 15, 16, 23, 42];

// these are, as before, to make D3's .append() and .selectAll() work
THREE.Object3D.prototype.appendChild = function (c) { this.add(c); return c; };
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

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}


// Use sourceURL to enable debugging in Chrome
//# sourceURL=document.js