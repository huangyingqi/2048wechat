import * as PIXI from "pixi.js"
export class Button extends PIXI.Sprite{
  constructor(texture: PIXI.Texture, title?: string) {
    super(texture);
    this.interactive = true;
    this.buttonMode = true;
    this.width = this.width;
    this.height = this.height;

    if (title) {
      let style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        dropShadow: true,
        dropShadowAlpha: 0.7,
        dropShadowAngle: 0.1,
        dropShadowBlur: 1,
        dropShadowColor: "0x111111",
        dropShadowDistance: 2,
        fill: ['#ffffff'],
        stroke: '#664620',
        fontSize: 30,
        fontWeight: "lighter",
        lineJoin: "round",
        strokeThickness: 3
      });
      let text = new PIXI.Text(title, style);
      text.x = this.width/4;
      text.y = this.height/4;
      this.addChild(text);
    }
  }
}