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
    width: window.innerWidth,
    height: window.innerHeight,
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



        zoom: 1,  // Size of game canvas = game size * zoom
    },
    autoRound: false


};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
