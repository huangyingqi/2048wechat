import * as PIXI from "pixi.js"
import Game from './game';
import { Board } from './board';

interface BlockInfo{
  title: number,
  row: number,
  col: number,
  width: number,
  height: number,
  totolCol: number
}
interface FontInfo{
  dropShadowBlur: number,
  dropShadowDistance: number,
  fontSize: number,
  strokeThickness: number
}

export class Block extends PIXI.Sprite{
  private _num: number;
  private _container: PIXI.Container;
  private _row: number;
  private _col: number;
  private _curBoard: Board;
  private _numText: PIXI.Text;
  private _totalCol = 4;
  private _textStyle: PIXI.TextStyle[] = [];
  constructor(borard: Board, info: BlockInfo, texture?: PIXI.Texture, ) {
    super(texture)
    this._num = info.title;
    this._curBoard = borard;
    this._container = new PIXI.Container();
    this._row = info.row;
    this._col = info.col;
    this._width = info.width;
    this._height = info.height;
    this._totalCol = info.totolCol;
    for (let i = 0; i < 4; i++){
      let fontSize = Game.getInstance().config.blockFontSize[i];
      let textStyle = new PIXI.TextStyle({
        fontFamily: 'Arial',
        dropShadow: true,
        dropShadowAlpha: 0.7,
        dropShadowAngle: 1.1,
        dropShadowBlur: 1,
        dropShadowColor: "0x111111",
        dropShadowDistance: 2,
        fill: ['#ffffff'],
        stroke: '#664620',
        fontSize: fontSize,
        fontWeight: "bolder",
        lineJoin: "round",
        strokeThickness: Math.floor(fontSize/5)
      });
      this._textStyle.push(textStyle);
    }

    this.drawSelf(info.row, info.col);
    this.interactive = false;
    this.buttonMode = false;

  }

  enableBlock() {
    this.interactive = true;
    this.buttonMode = true;
  }

  get block() {
    return this._container;
  }

  set row(rowNum: number) {
    this._row = rowNum;
  }

  set col(colNum: number) {
    this._col = colNum;
  }

  moveLeft() : void{
    this._col -= 1;
    this.x -= this._width;
  }

  moveRight(): void{
    this._col += 1;
    this.x += this._width;    
  }

  moveUp(): void{
    this._row -= 1;
    this.y -= this._height;
  }

  moveDown(): void{
    this._row += 1;
    this.y += this._height;
  }

  getFontWeight(): FontInfo{
    if (this._width > 100) {
      switch (this._totalCol) {
        case 5: {
          return {
            dropShadowBlur: 1,
            dropShadowDistance: 2,
            fontSize: 50,
            strokeThickness: 10
          };
        }
        case 4: {
          return {
            dropShadowBlur: 1,
            dropShadowDistance: 2,
            fontSize: 70,
            strokeThickness: 15
          };
        }
        default: {
          return {
            dropShadowBlur: 1,
            dropShadowDistance: 2,
            fontSize: 70,
            strokeThickness: 15
          };
        }
      }
        
    } else {
      switch (this._totalCol) {
        case 5: {
          return {
            dropShadowBlur: 1,
            dropShadowDistance: 2,
            fontSize: 20,
            strokeThickness: 5
          };
        }
        case 4: {
          return {
            dropShadowBlur: 1,
            dropShadowDistance: 2,
            fontSize: 35,
            strokeThickness: 8
          };
        }
        default: {
          return {
            dropShadowBlur: 1,
            dropShadowDistance: 2,
            fontSize: 35,
            strokeThickness: 8
          };
        }
      }
        
    }
  }

  getTextPosition(width: number): { x: number, y: number }{
    switch (this._totalCol) {
      case 5:
        {
          let x = this._num > 9 ? width / 6 : width / 5;
          let y = width / 5;
          return { x, y };

        }
      case 4:
        {
          let x = this._num > 99 ? width / 5 : width / 4;
          let y = Math.floor(width/6);
          return { x, y };
        }
      default:
        {
          let x = this._num > 9 ? width / 5 : width / 4;
          let y = Math.floor(width/6);
          return { x, y };
        }
        
    }
  }

  drawSelf(x:number, y: number): void{
    const graphics = new PIXI.Graphics();
    let boarder = 6;
    let width = this._width - boarder;
    let height = this._height - boarder;
 
    
    graphics.lineStyle(boarder, 0xaaaaaa, 2);
    if (this._num > 1000) {
      graphics.beginFill(0xee8899);
    }else if (this._num > 100)
      graphics.beginFill(0xee6666);
    else
      graphics.beginFill(0x996633);
    graphics.drawRect(boarder/2, boarder/2, width, height);
    graphics.endFill();

    this._container.addChild(graphics);
    let style = this._textStyle[0];
    let left = this.getTextPosition(width).x;
    let top = this.getTextPosition(width).y;
    if (this._num > 1000){
      style = this._textStyle[3];
      top += 10;
    } else if (this._num > 100) {
      style = this._textStyle[2];

      top += 5;
    } else if (this._num > 10) {
      style = this._textStyle[1];

      top += 2;
    }
    

    this._numText = new PIXI.Text(this._num.toString(), style);
    this._numText.x = left; 
    this._numText.y = top;//width/5;
    
    this._container.addChild(this._numText);
    this.addChild(this._container);
  }

  get blockName() {
    return this._num;
  }

  disableBlock() {
    this.interactive = true;
    this.buttonMode = true;
  }

  getNumber(): number{
    return this._num;
  }

  setNumber(num: number) {
    this._num = num;

    this._numText.text = this._num.toString();
    this._numText.style = this._textStyle[0];
  
    console.log("setNumber:", num, ":", this._numText.style.fontSize);
    if (this._num > 1000) {
      this._numText.x = Game.getInstance().config.blockLeft[3];
      this._numText.y = 20;
      this._numText.style.fontSize = 15;
      this._numText.style = this._textStyle[3];
    } else if (this._num >= 100){
      this._numText.x = Game.getInstance().config.blockLeft[2];
      this._numText.style = this._textStyle[2];
      this._numText.y = 10;
      this._numText.style.fontSize = 20;
    } else if (this._num >= 10) {
      this._numText.x = Game.getInstance().config.blockLeft[1];
      this._numText.style = this._textStyle[1];
      this._numText.style.fontSize = 25;
      this._numText.y = 5;
      
    }
  }
}