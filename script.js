(function(){

// set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// set the z axis to be up like we're used to (in graphics, y is up and z is into the screen)
camera.up.set(0, 0, 1);
camera.position.set(5.6, -8.2, 6.7);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.querySelector("main").appendChild( renderer.domElement );

const controls = new THREE.OrbitControls(camera, renderer.domElement);

// lighting
const light = new THREE.AmbientLight( 0x404040 );

scene.add(light);

const lights = [];
lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

lights[ 0 ].position.set( 0, 200, 0 );
lights[ 1 ].position.set( 100, 200, 100 );
lights[ 2 ].position.set( - 100, - 200, - 100 );

scene.add( lights[ 0 ] );
scene.add( lights[ 1 ] );
scene.add( lights[ 2 ] );

// axes helper
scene.add(new THREE.AxesHelper(5));

// the meshes below are created within their own "scope" created by the {} blocks
// to access them outside (for animation), we store references to them on this object
const meshes = {};

const majorRadius = 4, minorRadius = 1;

// disk with ring geometry
{
  const geometry = new THREE.CircleGeometry( 1, 32 );
  const material = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide, color: 0x1A69B5 } );
  const circle = new THREE.Mesh( geometry, material );

  // circle.position.set(0, 7, 4);
  
  scene.add( circle );
}


/*
curve.getPoint = t => {
  const [x, y, z] = torus(majorRadius, minorRadius, t * 2 * Math.PI, 5 * t * 2 * Math.PI);
  return new THREE.Vector3(x, y, z);
};
*/

/*
  curve.getPoint = t => {
    const [x, y, z] = torus(majorRadius, minorRadius, t * 2 * Math.PI, 5 * t * 2 * Math.PI);
    return new THREE.Vector3(x, y, z);
  };
  */

const radius = 1;
const xScale = 0.5;
const xShift = 0.25;
const yScale = 0.5;
const yShift = 0.25;
// everything that needs radius
{
  // ring on disk
  const circleCurve = new THREE.Curve();  
  circleCurve.getPoint = t => {
    const [x, y, z] = [radius * Math.cos(t * 2 * Math.PI), radius * Math.sin(t * 2 * Math.PI), 0];
    return new THREE.Vector3(x, y, z);
  };

  const circleGeometry = new THREE.TubeBufferGeometry(circleCurve, 150, 0.05, 20);
  const circleMaterial = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
  const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);
  scene.add(circleMesh);

  // circleMesh.position.set(0, 7, 4);
  meshes.coil = circleMesh;

  //~~~~~~~~~~~~~~~~~~~~~~~~~~
  // graph the image of circle
  //~~~~~~~~~~~~~~~~~~~~~~~~~~

  const imageCurve = new THREE.Curve();
  
  imageCurve.getPoint = t => {
    const [x, y, z] = torus(majorRadius, fRadius(radius, t * 2 * Math.PI), t * 2 * Math.PI, fTheta(radius, t * 2 * Math.PI) );
    return new THREE.Vector3(x, y, z);
  };

  const imageGeometry = new THREE.TubeBufferGeometry(imageCurve, 150, 0.05, 20);
  const imageMaterial = new THREE.MeshPhongMaterial({color: 0x1A69B5});
  const imageMesh = new THREE.Mesh(imageGeometry, imageMaterial);
  scene.add(imageMesh);

  meshes.coil = imageMesh;

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // graph the image of identiy
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const idCurve = new THREE.Curve();
  
  idCurve.getPoint = t => {
    const [x, y, z] = torus(majorRadius, radius, t * 2 * Math.PI,  t * 2 * Math.PI );
    return new THREE.Vector3(x, y, z);
  };

  const idGeometry = new THREE.TubeBufferGeometry(idCurve, 150, 0.05, 20);
  const idMaterial = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
  const idMesh = new THREE.Mesh(idGeometry, idMaterial);
  scene.add(idMesh);

  meshes.ident = idMesh;

  //~~~~~~~~~~~~~~~~~~~
  // update with slider
  //~~~~~~~~~~~~~~~~~~~

  const input = document.querySelector("input")
  input.addEventListener("input",e=>{
    const radius = parseFloat(input.value);
    //console.log(val);
    const imageCurve = new THREE.Curve();

    // circle preimage
    circleCurve.getPoint = t => {
      const [x, y, z] = [radius * Math.cos(t * 2 * Math.PI), radius * Math.sin(t * 2 * Math.PI), 0];
      return new THREE.Vector3(x, y, z);
    };
    circleMesh.geometry = new THREE.TubeBufferGeometry(circleCurve, 150, 0.05, 20);

    // image of map
    imageCurve.getPoint = t => {
      const [x, y, z] = torus(majorRadius, fRadius(radius, t * 2 * Math.PI), t * 2 * Math.PI, fTheta(radius, t * 2 * Math.PI) );
      return new THREE.Vector3(x, y, z);
    };
    imageMesh.geometry = new THREE.TubeBufferGeometry(imageCurve, 150, 0.05, 20);
    
    // identity map
    idCurve.getPoint = t => {
      const [x, y, z] = torus(majorRadius, radius, t * 2 * Math.PI,  t * 2 * Math.PI );
      return new THREE.Vector3(x, y, z);
    };
    idMesh.geometry = new THREE.TubeBufferGeometry(idCurve, 150, 0.05, 20);
  })
}
// torus
{
  /*
    the braces make geometry, material, sphere only visible within this block
    if you need to reassign a variable you can use "let" instead of "const", but
    it's good practice to use "const" by default
  */
  const texture = new THREE.Texture;
  const geometry = new THREE.TorusBufferGeometry(majorRadius, minorRadius, 16, 32);
  const material = new THREE.MeshPhongMaterial( { color: 0x1BBB68, side: THREE.DoubleSide, opacity: 0.5, transparent:true } );
  // How to add opacity? Could use mesh to demonstrate. 
  const mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  // store a reference to the torus so we can access it in other blocks
   meshes.torus = mesh;
}

renderer.setAnimationLoop(time => {
  // time is in milliseconds, divide by 1000 to get something reasonable
  time /= 1000;

  // Radius gets smaller? For demonstration purposes only

  // animate the geometry
  // meshes.torus.geometry = new THREE.TorusBufferGeometry(majorRadius, minorRadius, 16, 32, (time / 8 % 1) * 2 * Math.PI);

  // always include these lines
  controls.update();
  renderer.render( scene, camera );
});

function fRadius(r, theta) {
  return Math.sqrt( Math.pow( r * Math.cos(theta) * xScale + xShift , 2) + Math.pow( r * Math.sin(theta) * yScale + yShift,2));
}

function fTheta(r, theta) {
  return Math.atan2 ( (r * Math.sin(theta) * yScale + yShift), (r * Math.cos(theta) * xScale + xShift) );
}

function torus(R, r, theta, phi) {
  return [
    (R + r * Math.cos(phi)) * Math.cos(theta),
    (R + r * Math.cos(phi)) * Math.sin(theta),
    r * Math.sin(phi)
  ];
}


/* Old Code That Might be useful later:

  // parametric geometry

{
  const geometry = new THREE.ParametricBufferGeometry((u, v, dest) => {
    // u, v are parameters in [0, 1], convert them to [-pi, pi]
    const s = -Math.PI + u * 2 * Math.PI,
          t = -Math.PI + v * 2 * Math.PI;

    const x = s * Math.cos(t),
          y = t * Math.sin(s),
          z = t;
    dest.set(x, y, z);
  }, 20, 20);
  const material = new THREE.MeshPhongMaterial( { color: 0xAE81FF, side: THREE.DoubleSide } );
  const mesh = new THREE.Mesh( geometry, material );
  mesh.position.set(6, 6, 0);
  scene.add( mesh );
}
  // sphere geometry
{
  // either SphereGeometry or SphereBufferGeometry would work; the *BufferGeometry
  // classes are somewhat faster, according to the docs, but it likely won't make a difference
  // for simple scenes
  const geometry = new THREE.SphereBufferGeometry(1, 16, 16);
  const material = new THREE.MeshPhongMaterial({color: 0xFF3333, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

{
  const idCurve = new THREE.Curve();

  
  idCurve.getPoint = t => {
    const [x, y, z] = torus(majorRadius, radius, t * 2 * Math.PI,  t * 2 * Math.PI );
    return new THREE.Vector3(x, y, z);
  };

  const idGeometry = new THREE.TubeBufferGeometry(idCurve, 150, 0.05, 20);
  const idMaterial = new THREE.MeshPhongMaterial({color: 0xFFFFFF});
  const idMesh = new THREE.Mesh(idGeometry, idMaterial);
  scene.add(idMesh);

  meshes.ident = idMesh;
}
*/


})();
