/*
 * @Author: tanka 
 * @Date: 2023-12-05 14:49:54
 * @LastEditors: tanka 
 * @LastEditTime: 2023-12-20 11:22:53
 * @FilePath: /small-three/src/main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as THREE from 'three';
import * as dat from 'dat.gui';
import groundPic from './img/gound.png';
import snowPic from './img/snowflake1.png';
// import env1 from './img/env/neg-x.jpg';
// import env1 from './img/kong.jpg';
// import env2 from './img/env/neg-y.jpg';
// import env3 from './img/env/neg-z.jpg';
// import env4 from './img/env/pos-x.jpg';
// import env5 from './img/env/pos-y.jpg';
// import env6 from './img/env/pos-z.jpg';


const clock = new THREE.Clock();
let mouseX = 0, mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
const textureLoader = new THREE.TextureLoader();

let camera: any = null;
let renderer: any = null;


const assignSRGB = ( texture ) => {

  texture.colorSpace = THREE.SRGBColorSpace;

};

const createSnowSprite = () => {
  
  const sprite1 = textureLoader.load( 'textures/sprites/snowflake1.png', (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
  } );
}

const addSprite = (scene: THREE.Scene) => {
  const texture = new THREE.TextureLoader().load(snowPic);
  const spriteMaterial = new THREE.SpriteMaterial({
      map: texture, 
  });
  const group = new THREE.Group();
  for (let i = 0; i < 16; i++) {
      // 精灵模型共享材质
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(0.01, 0.01, 1);
      group.add(sprite);
      // sprite.scale.set(1, 1, 1);
      // 设置精灵模型位置，在长方体空间上上随机分布
      const x = 1000 * (Math.random() - 0.5);
      const y = 600 * Math.random();
      const z = 1000 * (Math.random() - 0.5);
      sprite.position.set(x , y , z )
  }
  scene.add(group)
  return group
}

const resize = () => {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

const addTexture = (scene: THREE.Scene) => {
  const geometry = new THREE.BoxGeometry(100, 100, 100);
  // const geometry = new THREE.CircleGeometry(0.3, 10);
  const texLoader = new THREE.TextureLoader();
  const texture = texLoader.load(groundPic);
  const material = new THREE.MeshLambertMaterial({
      map: texture, //map表示材质的颜色贴图属性
      // color: 0x00ffff,
  });
  const mesh = new THREE.Mesh( geometry, material );
  scene.add(mesh)
  return mesh
}

const createGround = (scene: THREE.Scene) => {
  // 创建地面  
  const planeGeometry = new THREE.PlaneGeometry(100, 100);  
  const textureLoader = new THREE.TextureLoader();  
  const snowTexture = textureLoader.load(groundPic); // 替换为雪地纹理图片的路径  
  const planeMaterial = new THREE.MeshLambertMaterial({ map: snowTexture });  
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);  
  plane.rotation.x = -Math.PI / 2; // 将平面旋转到水平位置  
  // plane.rotation.x = -1.1
  // plane.position.y = -0.3
  // plane.rotation.y = 0.3
  scene.add(plane); 
  return plane
}

const onPointerMove = (event: any) => {
  if ( event.isPrimary === false ) return;
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

const initEventListener = () => {
  document.body.style.touchAction = 'none';
	document.body.addEventListener( 'pointermove', onPointerMove );
  window.addEventListener( 'resize', resize );
}


const init = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  //
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( 0x000000, 0.0008 );
  // 
  // const camera = new THREE.PerspectiveCamera(40, width / height, 0.01, 3000);
  // camera.position.z = 5;
  camera = new THREE.PerspectiveCamera( 75, width / height, 1, 2000 );
  camera.position.z = 1000;
  //
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  for ( let i = 0; i < 10000; i ++ ) {
    const x = Math.random() * 2000 - 1000;
    const y = Math.random() * 20000 - 10000;
    const z = Math.random() * 2000 - 1000;
    vertices.push( x, y, z );
  }
  geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
  // 创建粒子


  const sprite1 = textureLoader.load( snowPic, (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
  } );
  const material = new THREE.PointsMaterial(
    {
      size: 40,
      map: sprite1,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    } );
  // material.color.setHSL(0.90, 0.05, 0.5)
  material.color.setHSL( 0.90, 0.05, 0.5, THREE.SRGBColorSpace );

  const particles = new THREE.Points( geometry, material );
  // particles.rotation.x = Math.random() * 6;
  // particles.rotation.y = Math.random() * 6;
  // particles.rotation.z = Math.random() * 6;
  scene.add(particles)
  // camera.position.set(10, 140, 100);  
  // camera.lookAt(plane.position); 
  // 添加环境光  
  const light = new THREE.AmbientLight(0xffffff, 0.5); // 环境光  
  scene.add(light);
  // 添加平行光  
  // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);  
  // directionalLight.position.set(0, 1, 0);  
  // scene.add(directionalLight);  
  //
  const axesHelper = new THREE.AxesHelper(150);
  scene.add(axesHelper);
  //
  const loader = new THREE.CubeTextureLoader();
  // const texture = loader.load( [
  //   env1,
  //   env2,
  //   env3,
  //   env4,
  //   env5,
  //   env6,
  // ] );
  // const texture = loader.load( [
  //   env1,
  //   env1,
  //   env1,
  //   env1,
  //   env1,
  //   env1,
  // ] );
  // scene.background = texture;
  //
  renderer = new THREE.WebGLRenderer( {
    antialias: true,
    // alpha: true
  } );
  
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( width, height );
  // renderer.setClearColor(0xadd8e6);
  renderer.setAnimationLoop(() => {
    animation({
      renderer,
      scene,
      camera,
      particles
    })
  });
  document.body.appendChild( renderer.domElement );
  //
  const cube = addTexture(scene);
  // cube.position.y = 1;
  const gui = new dat.GUI();
  gui.add(particles.position, 'z', 0, 1000);
  gui.add(particles.position, 'x', 0, 1000);
  gui.add(particles.position, 'y', -1000, 1000);
  gui.add(camera.position, 'z', -1000, 1000);
  // gui.open();
}

init();
initEventListener();


// 
const animation = ({
  renderer,
  scene,
  camera,
  particles
}: any) => {
  const time =  1;
  camera.lookAt( scene.position );
  
  if (particles.position.y < -1000 ) {
    particles.position.y = 0;
    particles.position.x = 0;
    particles.position.z = 0;
  }
  particles.position.y -= 0.5;
  particles.position.z += 0.1
  particles.position.x += 0.1
  // camera.position.x += ( mouseX - camera.position.x ) * 0.05 / 500;
  // camera.position.y += ( - mouseY - camera.position.y ) * 0.05 / 500;
  // camera.lookAt( scene.position );
  
  // camera.lookAt( scene.position );
  renderer.render( scene, camera );
}