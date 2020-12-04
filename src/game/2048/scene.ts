import * as PIXI from "pixi.js";

export class Scene{
  private _background: PIXI.Sprite;
  private _containner: PIXI.Container;
  private _resultContainner: PIXI.Container;
  private _app: PIXI.Application;
  constructor(app: PIXI.Application) {
    this._containner = new PIXI.Container();
    this._app = app;

    app.stage.addChild(this._containner);
    this.drawBackGround();
    this._resultContainner = new PIXI.Container();
    app.stage.addChild(this._resultContainner);
    this.draw();
  }

  draw() :void{
  }

  gameTimer(): void{
  }

  gameFinished(): void{
  }

  get app() :PIXI.Application{
    return this._app;
  }

  get containner(): PIXI.Container {
    return this._containner;
  }

  get resultContainner(): PIXI.Container{
    return this._resultContainner;
  }

  drawBackGround(): void{
  }

}