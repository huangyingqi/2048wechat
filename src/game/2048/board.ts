import {Container, Graphics, Point}  from "pixi.js"
import { Block } from "./block"

interface BlockMaps{
  [key:number]: Block
};

interface BoardInfo{
  x: number;  // x坐标
  y: number;  // y坐标
  width: number; // 宽度
  height: number; 
  row: number;  // 行数
  col: number;  // 列数
  blockW: number;
  blockH: number;
};

export enum Direction{
  UP,
  DOWN,
  LEFT,
  RIGHT
};


export class Board{
  private _board: Container;
  private _bWidth: number;
  private _hBlock: number;
  private _blocks: BlockMaps={};
  private _maxValue: number;
  private _col: number;
  private _row: number;
  private _direction: Direction = Direction.DOWN;
  private _isFull: boolean;
  private _score: number;

  constructor(info: BoardInfo) {
    this._board = new Container();
    this._board.x = info.x;
    this._board.y = info.y;

    this._board.width = info.width;
    this._board.height = info.height;
    this._bWidth = 10;
    this._hBlock = info.blockW;
    this._row = info.row;
    this._col = info.col;
    this._score = 0;

    this._maxValue = 0;
    this.drawBackground(info.width, info.height);

    this.initGame();
    this._isFull = false;
  }

  moveDirection(direct: Direction, addNew :boolean) {
    this._direction = direct;
    for (let i = 0; i < 3; i++)
    this.moveBlocks();    // 循环3次保证相互间干扰消失。
  if(addNew)
    this.addNewOne();
  }

  private joinToBlock(from:number, to: number) {
    let value = this._blocks[from].getNumber();
    if (this._blocks[to].getNumber() == value) {
      // this._blocks[num].moveDown();
      let x = this._blocks[to].x;
      let y = this._blocks[to].y;
      this._blocks[from].visible = false;
      this._board.removeChild(this._blocks[from]);
      this._blocks[to].visible = false;
      this._board.removeChild(this._blocks[to]);

      value *= 2;
      let row = Math.floor(to / 4);
      let col = Math.floor(to % 4);
      this._blocks[to] = new Block(this, {
        title: value,
        row: row,
        col: col,
        width: this._hBlock,
        height: this._hBlock,
        totolCol: 4
      });
      this._blocks[to].anchor.set(0.5);
      this._blocks[to].x =x;
      this._blocks[to].y = y;
      this._board.addChild(this._blocks[to]);
      this._score += value;
      if(value > this._maxValue)
        this._maxValue = value;
      
      if (this._maxValue >= 2048) {
        console.log("游戏可以结束了")
      }

      this._blocks[from].visible = false;
      this._board.removeChild(this._blocks[from]);
      this._blocks[from] = null;
    }
  }

  private moveBlocks() {
    // 所有方块向对应方向移动。
    if (this._direction == Direction.DOWN) {
      for (let i = this._row-1; i >= 0; i --){
        for (let j = 0; j < this._col; j++){
          let num = i * this._row + j;
          if (this._blocks[num]) {
            if (i < (this._row - 1)) {
              if (!this._blocks[num + 4]) {
                this._blocks[num].moveDown();
                this._blocks[num + 4] = this._blocks[num];
                this._blocks[num] = null;
              } else {
                // 如果下面的块数字和本块相等则变倍。否则不动
                this.joinToBlock(num, num + 4);

              }
            }
          }
        }
      }    
    }

    if (this._direction == Direction.RIGHT) {
      for (let i = 0; i < this._row; i++) {
        for (let j = this._col - 1; j >= 0; j--) {
          let num = i * this._row + j;
          if(this._blocks[num])
            if (j < (this._col - 1)) {
              if (!this._blocks[num + 1]) {
                this._blocks[num].moveRight();
                this._blocks[num + 1] = this._blocks[num];
                this._blocks[num] = null;
              } else {
                this.joinToBlock(num, num + 1);
              }
            }
        }
      }
    }


    if (this._direction == Direction.LEFT) {
      for (let i = 0; i < this._row; i++) {
        for (let j = 0; j < this._col; j++) {
          let num = i * this._row + j;
          if (this._blocks[num]) {
            if (j > 0) {
              if (!this._blocks[num - 1]) {
                this._blocks[num].moveLeft();
                this._blocks[num - 1] = this._blocks[num];
                this._blocks[num] = null;
              } else {
                this.joinToBlock(num, num - 1);
              }
            
            }            
          }

        }
      }
    }

    if (this._direction == Direction.UP) {
      for (let i = 0; i < this._row; i++){
        for (let j = 0; j < this._col; j++){
          let num = i * this._row + j;
          if (this._blocks[num]) {         
            if (i > 0) {
              if (!this._blocks[num - 4]) {
                this._blocks[num].moveUp();
                this._blocks[num - 4] = this._blocks[num];
                this._blocks[num] = null;
              } else {
                this.joinToBlock(num, num - 4);
              } 
            }
          }
        }
      }      
    }


  }
  
  private drawBackground(width:number, height:number): void{
    const graphics = new Graphics();
    let boarder = this._bWidth;
    let lineWidth = 2;

    graphics.lineStyle(boarder, 0x666666, 3);
    graphics.beginFill(0x663300);
    graphics.drawRect(0, 0, width+boarder, height+boarder);
    graphics.endFill();

    height = this._hBlock;
    boarder /= 2;

    graphics.lineStyle(lineWidth, 0x330000, 3);
    let x = height * this._col + boarder;
    for (let index = 1; index <this._col; index++) {
      let y = height*index+boarder;
      graphics.moveTo(boarder, y);
      graphics.lineTo(x, y);  
    }
    let y = height * this._row+ boarder;
    for (let index = 1; index < this._row; index++) {
      let x = height*index + boarder;
      graphics.moveTo(x, boarder);
      graphics.lineTo(x, y);  
    }
    
    this.board.addChild(graphics);
  }

  get board() : Container{
    return this._board;
  }

  newGame(): void{
    let Row = this._row;
    let Column = this._col;
    this._score = 0;

    for (let i = 0; i < Row * Column; i++) {
      if (this._blocks[i]) {
        this._board.removeChild(this._blocks[i]);
        this._blocks[i] = null;
      }
    }

    this._isFull = false;
    this._maxValue = 0;
    this.addNewOne();

  }

  // 增加新块
  addNewOne(): void {

    if (this._isFull)
      return;
    
    let numNew = this.getBlockNum();
    let bWidth = Math.floor(this._bWidth / 2);  //边框宽度的一半
    let width = this._hBlock;
    let { row: rowEmpty, col: colEmpty } = this.getOneEmpty();
    if (this._isFull) {
      console.log("已经填满！");
      return;
    }
    console.log("isFull", this._isFull);
    if (rowEmpty < 0) {
      console.log('game over');
      return;
    }

    let b = new Block(this, {
      title: numNew,
      row: rowEmpty,
      col: colEmpty,
      width: this._hBlock,
      height: this._hBlock,
      totolCol: 4
    });
    b.anchor.set(0.5);
    b.x = colEmpty * width + bWidth;
    b.y = rowEmpty * width + bWidth;
    
    this._board.addChild(b);
    let num = rowEmpty * 4 + colEmpty;
    this._blocks[num] = b;
  }

  private getBlockNum(): number{
    let rn = Math.random() * 100;
    if (rn < 80) {
      return 2;
    } else if (rn < 90) {
      return 4;
    } else if(rn < 95){
      return 8;
    } else if (rn < 99) {
      return 16;
    } else {
      return 32;
    }

  }

  private getOneEmpty(): { row: number, col: number }{
    for (let i = 0; i < this._row; i++){
      for (let j = 0; j < this._col; j++){
        let cl = Math.floor(Math.random() * 4);
        if (!this._blocks[i*this._row + cl]) {
          return { row: i, col: cl };
        }
      }
    }

    for (let i = 0; i < this._row; i++){
      for (let j = 0; j < this._col; j++){
        if (!this._blocks[i*this._row + j]) {
          return { row: i, col: j };
        }
      }
    }

    // 没有空缺位置了。
    this._isFull = true;
    console.log("没有空余位置了！");
    return { row: -1, col: -1 };
  }

  getBlock(num: number) : Block{
    return this._blocks[num];
  }

  initGame(): void {
    let Row = this._row;
    let Column = this._col;

    for (let i = 0; i < Row; i++) {
      for (let j = 0; j < Column; j++) {
        this._blocks[i * Row + j] = null;
      }
    }
  
  }

  GameFinish(): boolean {
    return true;
  }

  isFull(): boolean{
    return this._isFull;
  }

  endGame(): void{
  }

  getScore(): number{
    return this._score;
  }

  getMaxValue(): number{
    return this._maxValue;
  }
}