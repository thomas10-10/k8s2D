import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { Main } from './scenes/Main';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import CameraControllerPlugin from 'phaser3-rex-plugins/plugins/cameracontroller-plugin.js';


//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    pixelArt: true,
    width: 2025,
    height: 1668,
    parent: 'game-container',
    backgroundColor: '#028af8',
    plugins: {
        global: [{
            key: 'rexCameraController',
            plugin: CameraControllerPlugin,
            start: true
        },
        // ...
        ]
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Main,
        MainGame,
        GameOver
    ],
    scale: {
        // Or set parent divId here
        //parent: divId,

        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,

        // Or put game size here
        // width: 1024,
        // height: 768,

        // Minimum size
        min: {
            width: 200,
            height: 100
        },
        // Or set minimum size like these
        // minWidth: 800,
        // minHeight: 600,

        // Maximum size
        max: {
            width: 4600,
            height: 4200
        },
        // Or set maximum size like these
        // maxWidth: 600,
        // maxHeight: 1200,

        zoom: 1,  // Size of game canvas = game size * zoom
    },
    autoRound: false


};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
