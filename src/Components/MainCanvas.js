import React, { Component } from 'react';
import * as THREE from "three";

import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';

class CanvasHome extends Component {
    
    constructor(props) {
        super(props);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.cube = null;
        this.light = null;
        this.frameId = null;
        this.controls = null;

        this.WNDSIZE = { width:0, height: 0};

        this.state = {
            applyGlass : false
        }
    }
    


    componentDidMount() {
        // CREATE SCENE
        this.initialize();
    }

    componentWillUnmount() {
        // Stop render loop
        this.stop();
    }

    initialize = () => {
        this.scene = new THREE.Scene();

        /* Window Size [ Set Up Render onto our canvas] */ 
        this.WNDSIZE.width = this.mount.clientWidth;
        this.WNDSIZE.height = this.mount.clientHeight;

        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, preserveDrawingBuffer: true});
        this.renderer.setClearColor("#e7e7e7", 1);
        this.renderer.setSize(this.WNDSIZE.width, this.WNDSIZE.height);
        this.mount.appendChild(this.renderer.domElement);

        // GeometrySetUp. [ Usually do setup & scene related code here!!]

        this.light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);


        this.scene.add(this.light);

        this.draw();

        this.setupCamera();
        this.renderScene();

        console.log("Initialized");

        // Start Animation
        this.start();

        /* Handle Resize */
        window.addEventListener("resize", this.resizeWindow)

    }

    draw = () =>{

        
        const points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(1, 1, 0),
            new THREE.Vector3(2, 3, 0),
            new THREE.Vector3(5, 1, 0),
            new THREE.Vector3(7, 8, 0)
          ];
      
          const curve = new THREE.CatmullRomCurve3( points );
          const curvePoints = curve.getPoints( 50 );

          
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
        const lineMaterial = new THREE.LineBasicMaterial( { color: 0x000000, linewidth:5} );
        const line = new THREE.Line( lineGeometry, lineMaterial );
        
        this.scene.add(line);

          const tubeGeometry = new THREE.TubeGeometry(
            curve,
            20,
            0.5,    // radius of the tube
            4,      // number of segments
            false   // closed or not
          );
      
          const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
          const mesh = new THREE.Mesh(tubeGeometry, material);
      
          this.scene.add(mesh);
      
        // Using ExtrudeGeometry
        // const shape = new THREE.Shape(curvePoints);
        // const extrudeSettings = {
        //   steps: 30,
        //   depth: 2,
        //   bevelEnabled: false,
          
        // };
        // const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        // const material = new THREE.MeshBasicMaterial({ color: 0xf00ff00, wireframe:true });
        // const mesh = new THREE.Mesh(geometry, material);
    
        // this.scene.add(mesh);
    
    }

    setupCamera = () => {

        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.z = 15;
        this.camera.lookAt(this.scene.position);

        /* Orbit Cotrols */
        this.controls = new TrackballControls( this.camera, this.renderer.domElement );
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.8;
        this.controls.noZoom = false;
        this.controls.noPan = false;
        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.3;
    }

    start = () => {
        // if already initalized then leave it be
        if(!this.frameId) {
            this.frameId = requestAnimationFrame(this.update);
        }
    }

    stop = () => {
        cancelAnimationFrame(this.frameId);
    };

    resizeWindow = () => {
        /* Window Size */
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;
    
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    
        this.renderer.setSize( width, height );
    }


    update = () => {


        this.controls.update();
        this.renderScene();

        this.frameId = window.requestAnimationFrame(this.update);
        
    }

    renderScene = () => {
        let { renderer, scene, camera, } = this;
        if(renderer) {
            renderer.render(scene, camera);
        }
    }

    render() {
        return (
            <div className="canvasContainer">
                <div ref={ref => (this.mount = ref)} className="canvasContainer__maincanvas"/>
            </div>
        )
    }
}

export default CanvasHome;
