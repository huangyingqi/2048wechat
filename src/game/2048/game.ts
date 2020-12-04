import './libs/index.js';
import * as PIXI from "pixi.js-legacy";
import Game2048 from './game2048';
import { Scene } from "./scene";
import { Config } from "./config";
import { install } from '@pixi/unsafe-eval';

//Create the renderer
class Game{
  static _gGame: Game;
  _app: PIXI.Application;
  loadder: PIXI.Loader;
  _scene: Scene;
  _width: number;
  _height: number;
  _sprites: {};
  private _config: Config;

  private constructor() {
    if (IS_WX) {
      const sysInfo = wx.getSystemInfoSync()
      let pixelRatio = sysInfo.pixelRatio;

      install(PIXI);
      this._width = sysInfo.windowWidth; // 640
      this._height = sysInfo.windowHeight; // 1136
      console.log("wechat:",pixelRatio, "width:", this._width, "height:", this._height);
      this._config = new Config(this._width, this._height);
      this.loadder = PIXI.Loader.shared;
      this._app = new PIXI.Application({
        width: this._width,
        height: this._height,
        resolution: pixelRatio,
        view: canvas,
        backgroundColor: 0xc0c0c0
      });

      this._app.renderer.view.style.position = "relative";//"absolute";
      this._app.renderer.view.style.display = "block";
      this._app.renderer.resize(this._width, this._height);
      this.loadRes();
      
    } 

  }

  static getInstance() {
    if (!Game._gGame) {
      Game._gGame = new Game(); 
    }
    return Game._gGame
  }

  get config() : Config{
    return this._config;
  }

  private preLoad() {
    return new Promise(resolve => {
      this.loadder.baseUrl = "assets";
      this.loadder.add("fastgame", "2048/images/btn_fast_game.png")
        .load(resolve);
    });
  }

  private loadRes(): void {
    console.log('loadRes');
    this.preLoad().then(() => {
      console.log("loadRes ok!");
      this.initGame();
      this._app.ticker.add(
        this.gameLoop.bind(this));
    });
  }

  gameLoop() {
    this._scene?.gameTimer(); 
  }

  get app() {
    return this._app;
  }

  initGame(): Scene {
    this._scene = new Game2048(this._app);
    return this._scene;
  }

  gameFinished(): void {
    this._scene.gameFinished();
  }

}

Game.getInstance();

export default Game;
