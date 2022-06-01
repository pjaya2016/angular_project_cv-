import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class CharacterControls {

    model: THREE.Group | undefined;
    mixer: THREE.AnimationMixer | undefined;
    animationMap: Map<String, THREE.AnimationAction> = new Map();
    orbitControl: OrbitControls | undefined;
    camera: THREE.Camera | undefined

    //State 
    toggleRun: boolean = true;
    currentAction!: string;

    //Temporary data
    walkDirection = new THREE.Vector3();
    rotateAngle = new THREE.Vector3(0, 1, 0)
    rotateQuarternion: THREE.Quaternion = new THREE.Quaternion;
    cameraTarget = new THREE.Vector3();

    //Constants 
    fadeDuration: number = 0.2;
    runVelocity = 5;
    walkVelocity = 2;
    direction: any;
    play: string = '';

    constructor(model: THREE.Group, mixer: THREE.AnimationMixer, animationMap: Map<string, THREE.AnimationAction>,
        orbitControl: OrbitControls, camera: THREE.Camera, currentAction: string) {
        this.model = model;
        this.mixer = mixer;
        this.animationMap = animationMap;
        this.currentAction = currentAction;
        this.animationMap.forEach((value, key) => {
            if (key == currentAction) {
                value.play()
            }
        })
        this.orbitControl = orbitControl;
        this.camera = camera;
    }


    public switchRunToggle() {
        this.toggleRun = !this.toggleRun;
    }

    public directionPressed(direction: any) {
        console.log(direction)
        this.direction = direction;
    }

    public update(delta: number) {
        if (this.toggleRun && this.direction == 'w' || this.direction == 'a' || this.direction == 's' || this.direction == 'd') {
            this.play = 'Run';
        } else if (this.direction == 'w' || this.direction == 'a' || this.direction == 's' || this.direction == 'd') {
            this.play = 'Walk';
        } else {
            this.play = 'Idle'
        }

        if (this.currentAction !== this.play) {
            const toPlay = this.animationMap.get(this.play)
            const current = this.animationMap.get(this.currentAction)

            current?.fadeOut(this.fadeDuration);
            toPlay?.reset().fadeIn(this.fadeDuration).play()

            this.currentAction = this.play;
        }

        this.mixer?.update(delta);

        if (this.currentAction == 'Run' || this.currentAction == "Walk") {
            if (this.camera !== undefined && this.model !== undefined) {
                let angleYCameraDirection = Math.atan2((this.camera.position.x - this.model.position.x), (this.camera.position.z - this.model.position.z));
                let offset = this.directionOffset(this.direction)

                //rotate model 
                this.rotateQuarternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirection + offset)
                this.model.quaternion.rotateTowards(this.rotateQuarternion, 0.2)

                // calculate direction
                this.camera.getWorldDirection(this.walkDirection)
                this.walkDirection.y = 0
                this.walkDirection.normalize()
                this.walkDirection.applyAxisAngle(this.rotateAngle, offset)

                // run/walk velocity
                const velocity = this.currentAction == 'Run' ? this.runVelocity : this.walkVelocity

                // move model & camera
                const moveX = this.walkDirection.x * velocity * delta
                const moveZ = this.walkDirection.z * velocity * delta
                this.model.position.x += moveX
                this.model.position.z += moveZ
                this.updateCameraTarget(moveX, moveZ)

            }
        }

    }


    private updateCameraTarget(moveX: number, moveZ: number) {
        if (this.camera !== undefined && this.orbitControl !== undefined && this.model !== undefined) {
            // move camera
            this.camera.position.x += moveX
            this.camera.position.z += moveZ

            // update camera target
            this.cameraTarget.x = this.model.position.x
            this.cameraTarget.y = this.model.position.y + 1
            this.cameraTarget.z = this.model.position.z
            this.orbitControl.target = this.cameraTarget
        }
    }

    private directionOffset(keysPressed: any) {
        var directionOffset = 0 // w

        if (keysPressed == 'w') {
            if (keysPressed == 'a') {
                directionOffset = Math.PI / 4 // w+a
            } else if (keysPressed == 'd') {
                directionOffset = - Math.PI / 4 // w+d
            }
        } else if (keysPressed == 's') {
            if (keysPressed == 'a') {
                directionOffset = Math.PI / 4 + Math.PI / 2 // s+a
            } else if (keysPressed == 'd') {
                directionOffset = -Math.PI / 4 - Math.PI / 2 // s+d
            } else {
                directionOffset = Math.PI // s
            }
        } else if (keysPressed == 'a') {
            directionOffset = Math.PI / 2 // a
        } else if (keysPressed == 'd') {
            directionOffset = - Math.PI / 2 // d
        }

        return directionOffset
    }
}