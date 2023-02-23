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
        //code
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-10,0,0),
            new THREE.Vector3(-5,5,0),            
            new THREE.Vector3(0,0,0),            
            new THREE.Vector3(5,-5,0),            
            new THREE.Vector3(10,0,0),            

        ])
        
        const points = curve.getPoint(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const material = new THREE.LineBasicMaterial({color:0Xff0000});

        const curveObject = new THREE.Line(geometry, material)
        this.scene.add(curveObject);

    }

    setupCamera = () => {

        this.camera = new THREE.PerspectiveCamera(50, (this.WNDSIZE.width/this.WNDSIZE.height), 0.1, 1000);
        this.camera.position.set(0,50,500);
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
        this.WNDSIZE.width = this.mount.clientWidth;
        this.WNDSIZE.height = this.mount.clientHeight;

        this.camera.aspect = this.WNDSIZE.width / this.WNDSIZE.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( this.WNDSIZE.width, this.WNDSIZE.height );
    }


    update = () => {

        // this.cube.rotation.x += 0.01;
        // this.cube.rotation.y += 0.01;
        // this.cube.rotation.z += 0.01;

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
