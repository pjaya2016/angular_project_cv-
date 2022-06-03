import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { CharacterControls } from './CharacterControls';
import { OtherPlayerControls } from './OtherPlayerControls';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-multiplayer',
  templateUrl: './multiplayer.component.html',
  styleUrls: ['./multiplayer.component.css']
})
export class MultiplayerComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  @Input()
  public size: number = 200;


  private renderer!: THREE.WebGLRenderer;

  private scene!: THREE.Scene;

  private camera!: THREE.PerspectiveCamera;

  private clock = new THREE.Clock();



  private socket;
  // Create a new StompClient object with the WebSocket endpoint

  name: string = '';

  player: any = {
    userName: '',
    movement: {
      z: 0,
      x: 0,
      y: 0
    }, rotation: {
      z: 0,
      x: 0,
      y: 0
    },
    keyPressed: null,
    mixerUpdateDelta: 0.0
  };
  controls: OrbitControls | undefined;
  lastAction: any;
  characterControls!: CharacterControls;
  gltflLoader = new GLTFLoader();
  playerCreated: boolean = false;
  otherPlayerCreatedId: any = [];
  otherPlayersControls: Array<OtherPlayerControls> = [];
  objArray: any;


  constructor() {
    this.socket = new SockJS(environment.apiUrl + '/stomp');
  }


  createPlane() {
    const geometry = new THREE.PlaneGeometry(50, 50, 10, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide, wireframe: true });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotateX(Math.PI / 2)
    this.scene.add(plane);
  }


  loader(sessionId: string) {
    this.gltflLoader.load('../../assets/animations/Soldier.glb', (gltf) => {
      const model = gltf.scene;
      model.traverse(function (object: any) {
        if (object.isMesh) object.castShadow = true;
      })
      model.name = sessionId;
      this.scene.add(model)

      const gltfAnimation: THREE.AnimationClip[] = gltf.animations;
      const mixer = new THREE.AnimationMixer(model);
      const animationsMap: Map<string, THREE.AnimationAction> = new Map();
      gltfAnimation.filter(a => a.name !== 'TPose').forEach((a: THREE.AnimationClip) => {
        animationsMap.set(a.name, mixer.clipAction(a));
      })
      if (this.controls !== undefined)
        this.characterControls = new CharacterControls(model, mixer, animationsMap, this.controls, this.camera, 'Idle');
    })
  }

  loaderOtherPlayers(sessionId: string) {
    this.gltflLoader.load('../../assets/animations/Soldier.glb', (gltf) => {
      const model = gltf.scene;
      model.traverse(function (object: any) {
        if (object.isMesh) object.castShadow = true;
      })
      model.name = sessionId;
      this.scene.add(model)

      const gltfAnimation: THREE.AnimationClip[] = gltf.animations;
      const mixer = new THREE.AnimationMixer(model);
      const animationsMap: Map<string, THREE.AnimationAction> = new Map();
      gltfAnimation.filter(a => a.name !== 'TPose').forEach((a: THREE.AnimationClip) => {
        animationsMap.set(a.name, mixer.clipAction(a));
      })
      if (this.controls !== undefined)
        this.otherPlayersControls.push(new OtherPlayerControls(model, mixer, animationsMap, 'Idle'));
    })
  }

  ngAfterViewInit(): void {
    document.addEventListener('keypress', this.logKey.bind(this));
    document.addEventListener('resize', this.onWindowResize, false)
    this.createScene()
    this.startRenderingLoop()
    this.createPlane();
  }

  logKey(event: any) {
    if (this.playerCreated) {
      this.player.keyPressed = event['key']
      if (event['key'] === 'w' || event['key'] === 'W') {
        this.characterControls.directionPressed("w")

      } else if (event['key'] === 's' || event['key'] === 'S') {

        this.characterControls.directionPressed("s")
      } else if (event['key'] === 'a' || event['key'] === 'A') {

        this.characterControls.directionPressed("a")
      } else if (event['key'] === 'd' || event['key'] === 'D') {
        this.characterControls.directionPressed("d")
      } else {
        this.characterControls.directionPressed("n/a")
      }
    }
  }

  mychange() {
    if (this.name.length > 3) {
      this.player.userName = this.name;
      this.sendMessage(this.player)
    } else {
      //Throw Error
    }
  }

  ngOnInit(): void {

    let client = Stomp.over(this.socket);
    client.debug = () => { };
    // Start the STOMP communications, provide a callback for when the CONNECT frame arrives.
    client.connect({}, () => {
      // Subscribe to "/topic/messages". Whenever a message arrives add the text in a list-item element in the unordered list.
      client.subscribe("/topic/messages", (payload: any) => {
        this.objArray = JSON.parse(payload.body)
        //Add current player in the session
        if (!this.playerCreated) {
          if (this.objArray.player['userName'] === this.name) {
            this.loader(this.name);
            this.player = this.objArray.player
            this.playerCreated = true;
          }
        }

        //Adds other players
        for (let i = 0; i < this.objArray.playerList.length; i++) {
          if (
            this.objArray.playerList[i]['userName'] !== this.name
          ) {

            if (this.scene.getObjectByName(this.objArray.playerList[i]['sessionId']) === undefined) {
              this.loaderOtherPlayers(this.objArray.playerList[i]['sessionId'])
            }
          }
        }


      });

      client.subscribe("/topic/disconnect", (payload: any) => {
        this.removeEntity(payload.body)
      });

    });
  }

  public sendMessage(obj: any) {
    if (this.name.length > 0) {
      let client = Stomp.over(this.socket);
      client.debug = () => { };
      client.send('/app/chat', {}, JSON.stringify(obj));
    }
  }


  private createScene() {
    /**
     * Scene
     */
    this.scene = new THREE.Scene;
    this.scene.background = new THREE.Color(0x000000);

    /**
     * Camera
     */
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      75,
      aspectRatio,
      0.1, 1000
    )
    this.camera.position.z = 4;

    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.enableDamping = true
    this.controls.target.set(0, 1, 0)

    const light = new THREE.PointLight()
    light.position.set(0.8, 1.4, 1.0)
    this.scene.add(light)

    const ambientLight = new THREE.AmbientLight()
    this.scene.add(ambientLight)

  }

  private getAspectRatio() {
    return window.innerWidth / window.innerHeight
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }



  private startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    let component: MultiplayerComponent = this;
    (function render() {
      requestAnimationFrame(render);
      if (component.controls !== undefined) {
        component.controls.update();
      }

      let mixerUpdateDelta = component.clock.getDelta();
      if (component.characterControls !== undefined) {
        component.characterControls.update(mixerUpdateDelta)
        component.player.movement = (component.scene.getObjectByName(component.name)?.position);
        let rotate = (component.scene.getObjectByName(component.name)?.rotation);
        component.player.rotation = {
          x: rotate?.x,
          y: rotate?.y,
          z: rotate?.z
        }
        component.player.userName = component.name;
        component.player.mixerUpdateDelta = mixerUpdateDelta;
        component.sendMessage(component.player);
      }

      component.otherPlayersControls.forEach(opc => {
        opc.update(mixerUpdateDelta, component.objArray)
      })

      component.renderer.render(component.scene, component.camera);
    })()
  }

  removeEntity(sessionId: string) {
    let selectedObject = this.scene.getObjectByName(sessionId);
    if (selectedObject !== undefined) this.scene.remove(selectedObject);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.render(this.scene, this.camera);
  }

}
