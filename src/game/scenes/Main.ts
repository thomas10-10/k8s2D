import { GameObjects, Scene, Input } from 'phaser';
import CameraController from 'phaser3-rex-plugins/plugins/cameracontroller.js';



import { EventBus } from '../EventBus';

export class Main extends Scene
{
    private zoom: number = 1;
    private zoomSpeed: number = 0.1;
    private minZoom: number = 0.3;
    private maxZoom: number = 10;
    private graphics: Phaser.GameObjects.Graphics;
    private grid: Phaser.GameObjects.Grid;


    private isDragging: boolean = false;
    private previousPointerPosition: { x: number, y: number } = { x: 0, y: 0 };   
    private intersectionPoints: Phaser.Math.Vector2[] = []; 


    background: GameObjects.Image;
    logo: GameObjects.Image;
    ship: GameObjects.Image;
    title: GameObjects.Text;
    title2: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    waterField: GameObjects.TileSprite;
    private infoText: GameObjects.Text;
    private cameraController: CameraController;
    private container: Phaser.GameObjects.Container;
    private container2: Phaser.GameObjects.Container;
    private container3: Phaser.GameObjects.Container;
    private container4: Phaser.GameObjects.Container;
    private container5: Phaser.GameObjects.Container;

    private containers: Phaser.GameObjects.Container[] = [];
    private titles: Phaser.GameObjects.Text[] = [];


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
        //this.ship = this.add.image(0, 0, 'ship').setDepth(100).setOrigin(0,0);
        this.ship = this.add.image(0, 400, 'ship').setDepth(100).setOrigin(0,0);
        this.ship.preFX.addGlow(0xff0000, 10, 5, true);


        this.title = this.add.text(200, 163, 'kube-1', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 2,
            align: 'center'
        }).setDepth(100);
        this.title2 = this.add.text(200, 163, 'kube-2', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 2,
            align: 'center'
        }).setDepth(100);

        
        this.graphics = this.add.graphics();


        const cellWidth = 1200;
        const cellHeight = 1200;
        const width = 19600;
        const height = 19600;

        this.grid = this.add.grid(
            400, // x
            400, // y
            width, // width
            height, // height
            cellWidth,  // cellWidth
            cellHeight,  // cellHeight
            0x00ff00, // fillColor (vert)
            0.5, // fillAlpha (transparence)
            0xff0000, // outlineFillColor (rouge)
            0.5 // outlineFillAlpha (transparence des lignes)
        );

        // Appliquer une rotation pour obtenir l'effet de losange
        this.grid.setRotation(Math.PI / 4); // Rotation de 45 degrés

        this.calculateIntersectionPoints(cellWidth, cellHeight);

        // Afficher les positions des intersections pour vérification
        this.displayIntersectionPoints();






        EventBus.emit('current-scene-ready', this);



        //this.input.on('wheel', this.handleWheel, this);


        this.cameraController = new CameraController(this, {
            camera: this.cameras.main,
            minZoom: 0.1,
            maxZoom: 100,
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



        //this.container = this.add.container(this.intersectionPoints[0].x, this.intersectionPoints[0].y, [this.add.image(0, 0, 'ship').setDepth(100).setOrigin(0,0), this.title]);

        this.createContainers()


 

        const offsetX = 300; // Ajustez selon vos besoins
        const offsetY = 390; // Ajustez selon vos besoins
    
        // Calculer la zone englobante des ships avec offset
        const bounds = this.calculateBounds(offsetX, offsetY);


        // Définir la taille de la caméra (largeur et hauteur de la fenêtre de jeu)
        const cameraWidth = this.cameras.main.width;
        const cameraHeight = this.cameras.main.height;
    
        // Calculer le facteur de zoom nécessaire pour voir l'ensemble de la zone englobante
        const zoomX = cameraWidth / bounds.width;
        const zoomY = cameraHeight / bounds.height;
        const zoom = Math.min(zoomX, zoomY); // Choisir le plus petit facteur de zoom pour tout afficher
    
        // Ajuster la position de la caméra pour centrer la zone englobante

    
        // Appliquer le zoom à la caméra
        this.cameras.main.setZoom(zoom);
        this.zoom=zoom;
        this.cameras.main.setZoom(this.zoom);
        

        this.cameras.main.setScroll(
            (bounds.left + bounds.width / 2 - cameraWidth / 2) * zoom,
            (bounds.top + bounds.height / 2 - cameraHeight / 2) * zoom
        );





        
    }

    private calculateBounds(offsetX: number, offsetY: number) {
        if (this.containers.length === 0) {
            return { left: 0, top: 0, width: 0, height: 0 };
        }
    
        // Initialiser les limites avec les coordonnées du premier ship
        let left = this.containers[0].x;
        let right = left;
        let top = this.containers[0].y;
        let bottom = top;
    
        // Trouver les limites englobantes
        this.containers.forEach(container => {
            const x = container.x;
            const y = container.y;
            
            // Mise à jour des limites
            if (x < left) left = x;
            if (x > right) right = x;
            if (y < top) top = y;
            if (y > bottom) bottom = y;
        });
    
        // Ajouter l'offset aux limites
        left -= offsetX;
        right += offsetX;
        top -= offsetY;
        bottom += offsetY;
    
        // Calculer la largeur et la hauteur de la zone englobante
        const width = right - left;
        const height = bottom - top;
    
        return { left, top, width, height };
    }


    private createContainers() {
        const titles = ['Title 1', 'Title 2', 'Title 3', 'Title 4', 'Title 5']; // Titres associés aux conteneurs

        for (let i = 0; i < 100 && i < this.intersectionPoints.length; i++) {
            const point = this.intersectionPoints[i];
            const ship = this.add.image(0, 0, 'ship').setDepth(100).setOrigin(0, 0);
            const title = this.add.text(200, 163, "title"+i, {
                font: '16px Arial',

            }).setOrigin(0.5);

            const container = this.add.container(point.x, point.y, [ship, title]);
            this.containers.push(container);
            this.titles.push(title);
        }
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









    private calculateIntersectionPoints(cellWidth: number, cellHeight: number) {
        // Les coordonnées du centre de la grille
        const centerX = this.grid.x;
        const centerY = this.grid.y;
    
        // Calculer les coordonnées des intersections
        for (let x = -Math.floor(this.grid.width / (2 * cellWidth)); x <= Math.floor(this.grid.width / (2 * cellWidth)); x++) {
            for (let y = -Math.floor(this.grid.height / (2 * cellHeight)); y <= Math.floor(this.grid.height / (2 * cellHeight)); y++) {
                // Calculer les coordonnées du centre de chaque cellule
                const offsetX = (x + y) * (cellWidth / 2);
                const offsetY = (y - x) * (cellHeight / 2);
    
                const intersectionX = centerX + offsetX;
                const intersectionY = centerY + offsetY;
    
                this.intersectionPoints.push(new Phaser.Math.Vector2(intersectionX, intersectionY));
            }
        }
    
        // Trier les points du centre vers la périphérie (distance euclidienne du centre)
        this.intersectionPoints.sort((a, b) => {
            const distA = Phaser.Math.Distance.Between(centerX, centerY, a.x, a.y);
            const distB = Phaser.Math.Distance.Between(centerX, centerY, b.x, b.y);
            return distA - distB;
        });
    }



    private displayIntersectionPoints() {
        // Créer des cercles pour afficher les positions des intersections
        this.intersectionPoints.forEach(point => {
            this.add.circle(point.x, point.y, 5, 0x0000ff, 1); // Cercle bleu
        });

        // Afficher les coordonnées dans la console pour vérification
        console.log('Intersection Points:', this.intersectionPoints.map(point => `(${point.x.toFixed(2)}, ${point.y.toFixed(2)})`));
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
