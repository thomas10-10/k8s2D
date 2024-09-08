import { GameObjects, Scene, Input } from 'phaser';
import CameraController from 'phaser3-rex-plugins/plugins/cameracontroller.js';



import { EventBus } from '../EventBus';

export class Main extends Scene
{
    private zoom: number = 1;
    private zoomSpeed: number = 0.1;
    private minZoom: number = 0.3;
    private maxZoom: number = 2;
    private graphics: Phaser.GameObjects.Graphics;
    private grid: Phaser.GameObjects.Grid;


    private isDragging: boolean = false;
    private previousPointerPosition: { x: number, y: number } = { x: 0, y: 0 };    


    background: GameObjects.Image;
    logo: GameObjects.Image;
    ship: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    waterField: GameObjects.TileSprite;
    private infoText: GameObjects.Text;
    private cameraController: CameraController;
    private container: Phaser.GameObjects.Container;

    constructor ()
    {
        super('Main');
    }

    create ()
    {


        
        
        //this.background = this.add.image(512, 84, 'background');
        //this.add.tileSprite(0, 0, 1900, 3000, "star")
        this.waterField = this.add.tileSprite(-1000, -1000, 8000, 8000, "water").setOrigin(0, 0);
        //this.add.tileSprite(0, 0, 900, 300, "ship").setOrigin(0, 0);

        this.logo = this.add.image(300, 300, 'logo').setDepth(100);
        this.ship = this.add.image(0, 0, 'ship').setDepth(100).setOrigin(0,0);
        this.ship = this.add.image(0, 400, 'ship').setDepth(100).setOrigin(0,0);
        this.ship.preFX.addGlow(0xff0000, 10, 5, true);


        this.title = this.add.text(200, 163, 'kube-1', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 2,
            align: 'center'
        }).setDepth(100);
        this.container = this.add.container(0, 800, [this.add.image(0, 0, 'ship').setDepth(100).setOrigin(0,0), this.title]);
        this.graphics = this.add.graphics();


        this.grid = this.add.grid(
            400, // x
            400, // y
            1600, // width
            1600, // height
            600,  // cellWidth
            600,  // cellHeight
            0x00ff00, // fillColor (vert)
            0.5, // fillAlpha (transparence)
            0xff0000, // outlineFillColor (rouge)
            0.5 // outlineFillAlpha (transparence des lignes)
        );

        // Appliquer une rotation pour obtenir l'effet de losange
        this.grid.setRotation(Math.PI / 4); // Rotation de 45 degrés








        EventBus.emit('current-scene-ready', this);



        //this.input.on('wheel', this.handleWheel, this);


        this.cameraController = new CameraController(this, {
            camera: this.cameras.main,
            minZoom: 0.3,
            maxZoom: 2,
            panScroll: true,
            pinchZoom: true,
            boundsScroll: true,
            mouseWheelZoom: true,
            mouseWheelZoomStep: 0.1,
        });


        //this.input.on('pointerdown', this.startDrag, this);
        //this.input.on('pointerup', this.stopDrag, this);
        //this.input.on('pointermove', this.onDrag, this);
        fixedWidth: 200




        this.infoText = this.add.text(10, 10, '', {
            fontFamily: 'Arial',
            fontSize: '16px',
            backgroundColor: '#000000'
        }).setScrollFactor(0);








        
    }

    update(time: number, delta: number) {
        
        // Appliquer l'effet d'autoscroll sur le tileSprite "starField"
        this.waterField.tilePositionY += 0; // Vitesse de défilement vertical (ajuste selon les besoins)
        this.waterField.tilePositionX += 0.2; // Vitesse de défilement horizontal (optionnel)

        this.infoText.setText(
            JSON.stringify(
                this.input.activePointer,
                ["isDown", "downX", "downY", "worldX", "worldY", "x", "y", "velocity"],
                2
            )
        );


    }













    private handleWheel(event: WheelEvent,pointer: Input.Pointer) {
        // Calculer le nouveau zoom
        //this.cameras.main.setOrigin(this.input.mousePointer.x,this.input.mousePointer.y)
        const zoomChange = event.deltaY > 0 ? -this.zoomSpeed : this.zoomSpeed;
        this.zoom = Phaser.Math.Clamp(this.zoom + zoomChange, this.minZoom, this.maxZoom);

        // Appliquer le zoom
        this.cameras.main.setZoom(this.zoom);
        //this.cameras.main.scrollX=this.input.activePointer.worldX
        //this.cameras.main.scrollY=this.input.activePointer.worldY

        //








    }

    private handleWheellll(event: WheelEvent, pointer: Input.Pointer) {
        // Calculer le nouveau zoom
        const zoomChange = event.deltaY > 0 ? -this.zoomSpeed : this.zoomSpeed;
        const newZoom = Phaser.Math.Clamp(this.zoom + zoomChange, this.minZoom, this.maxZoom);

        // Obtenir les coordonnées du curseur dans le monde
        const worldPointBeforeZoom = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

        // Appliquer le zoom
        this.cameras.main.setZoom(newZoom);

        // Obtenir les coordonnées du curseur dans le monde après le zoom
        const worldPointAfterZoom = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

        // Ajuster la position de la caméra pour que le curseur reste au même endroit dans le monde
        this.cameras.main.scrollX += (worldPointBeforeZoom.x - worldPointAfterZoom.x);
        this.cameras.main.scrollY += (worldPointBeforeZoom.y - worldPointAfterZoom.y);

        // Mettre à jour le zoom actuel
        this.zoom = newZoom;

        // Prévenir le comportement par défaut de l'événement de la molette
        //event.preventDefault();
    }

    private handleWheelooo(event: WheelEvent, pointer: Input.Pointer) {
        // Calculer le nouveau zoom
        const zoomChange = event.deltaY > 0 ? -this.zoomSpeed : this.zoomSpeed;
        const newZoom = Phaser.Math.Clamp(this.zoom + zoomChange, this.minZoom, this.maxZoom);

        // Obtenir la position du curseur dans le monde avant le zoom
        const worldPointBeforeZoom = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

        // Appliquer le zoom
        this.cameras.main.setZoom(newZoom);

        // Obtenir la position du curseur dans le monde après le zoom
        const worldPointAfterZoom = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

        // Calculer l'ajustement nécessaire pour la caméra
        const scrollXAdjustment = (worldPointBeforeZoom.x - worldPointAfterZoom.x) * newZoom;
        const scrollYAdjustment = (worldPointBeforeZoom.y - worldPointAfterZoom.y) * newZoom;

        // Ajuster la position de la caméra
        this.cameras.main.scrollX += scrollXAdjustment;
        this.cameras.main.scrollY += scrollYAdjustment;

        // Mettre à jour le zoom actuel
        this.zoom = newZoom;

    }


    private handleWheelOOO(pointer: Input.Pointer, gameObjects: GameObjects.GameObject[], deltaX: number, deltaY: number, deltaZ: number) {
        // Calculer le nouveau zoom
        const zoomChange = deltaY > 0 ? -this.zoomSpeed : this.zoomSpeed;
        const newZoom = Phaser.Math.Clamp(this.cameras.main.zoom + zoomChange, this.minZoom, this.maxZoom);

        // Obtenir la position du curseur dans le monde avant le zoom
        const cursorWorldPositionBeforeZoom = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

        // Appliquer le nouveau zoom
        this.cameras.main.setZoom(newZoom);

        // Obtenir la position du curseur dans le monde après le zoom
        const cursorWorldPositionAfterZoom = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

        // Calculer le décalage nécessaire pour garder la caméra centrée sur le curseur
        const scrollXAdjustment = (cursorWorldPositionBeforeZoom.x - cursorWorldPositionAfterZoom.x) * newZoom;
        const scrollYAdjustment = (cursorWorldPositionBeforeZoom.y - cursorWorldPositionAfterZoom.y) * newZoom;

        // Ajuster la position de la caméra
        this.cameras.main.scrollX += scrollXAdjustment;
        this.cameras.main.scrollY += scrollYAdjustment;

        //pointer.event.preventDefault();
    }



    private handleWheelOld(event: WheelEvent) {
        const zoomChange = event.deltaY > 0 ? -this.zoomSpeed : this.zoomSpeed;
        const newZoom = Phaser.Math.Clamp(this.cameras.main.zoom + zoomChange, this.minZoom, this.maxZoom);

        // Position du curseur dans les coordonnées du monde avant le zoom
        const worldPointBeforeZoom = this.cameras.main.getWorldPoint(this.input.x, this.input.y);

        // Appliquer le nouveau zoom
        this.cameras.main.setZoom(newZoom);

        this.input.on('pointermove', this.onDrag, this);
    } 


    private startDrag(pointer: Input.Pointer) {
        if (pointer.button === 0) { // Vérifie si le clic est le bouton gauche de la souris
            this.isDragging = true;
            this.previousPointerPosition = { x: pointer.x, y: pointer.y };
        }
    }

    private stopDrag(pointer: Input.Pointer) {
        if (pointer.button === 0) { // Vérifie si le clic est le bouton gauche de la souris
            this.isDragging = false;
        }
    }

    private onDrag(pointer: Input.Pointer) {
        if (this.isDragging) {
            // Calculer le déplacement de la souris
            const deltaX = pointer.x - this.previousPointerPosition.x;
            const deltaY = pointer.y - this.previousPointerPosition.y;

            // Déplacer la caméra en fonction du déplacement de la souris
            this.cameras.main.scrollX -= deltaX;
            this.cameras.main.scrollY -= deltaY;

            // Mettre à jour la position précédente
            this.previousPointerPosition = { x: pointer.x, y: pointer.y };
        }
    }    

    
    changeScene ()
    {
        if (this.logoTween)
        {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start('Game');
    }

    moveLogo (vueCallback: ({ x, y }: { x: number, y: number }) => void)
    {
        if (this.logoTween)
        {
            if (this.logoTween.isPlaying())
            {
                this.logoTween.pause();
            }
            else
            {
                this.logoTween.play();
            }
        } 
        else
        {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
                y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (vueCallback)
                    {
                        vueCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y)
                        });
                    }
                }
            });
        }
    }
}
