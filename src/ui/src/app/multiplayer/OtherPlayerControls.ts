import * as THREE from "three";

export class OtherPlayerControls {
    model: THREE.Group | undefined;
    mixer: THREE.AnimationMixer | undefined;
    animationMap: Map<String, THREE.AnimationAction> = new Map();

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



    constructor(model: THREE.Group, mixer: THREE.AnimationMixer, animationMap: Map<string, THREE.AnimationAction>, currentAction: string) {
        this.model = model;
        this.mixer = mixer;
        this.animationMap = animationMap;
        this.currentAction = currentAction;
        this.animationMap.forEach((value, key) => {
            if (key == currentAction) {
                value.play()
            }
        })
    }


    public switchRunToggle() {
        this.toggleRun = !this.toggleRun;
    }

    public update(dalta: number, arrayObj: any) {

        if (this.model !== undefined && arrayObj.playerList.length > 0) {
            let player = arrayObj.playerList.filter((ao: any) => ao.sessionId === this.model?.name)[0]

            if (player !== undefined) {
                if (this.toggleRun && player.keyPressed == 'w' || player.keyPressed == 'a' || player.keyPressed == 's' || player.keyPressed == 'd') {
                    this.play = 'Run';
                } else if (player.keyPressed == 'w' || player.keyPressed == 'a' || player.keyPressed == 's' || player.keyPressed == 'd') {
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

                this.mixer?.update(dalta);

                if (this.currentAction == 'Run' || this.currentAction == "Walk") {
                    if (this.model !== undefined) {

                        this.model.position.x = player.movement.x
                        this.model.position.z = player.movement.z
                        this.model.position.y = player.movement.y
                        //Rotation
                        this.model.rotation.x = player.rotation.x
                        this.model.rotation.z = player.rotation.z
                        this.model.rotation.y = player.rotation.y

                    }
                }
            }
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