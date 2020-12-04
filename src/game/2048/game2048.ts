import * as PIXI from "pixi.js";
import { Scene } from './scene';
import { Board , Direction} from "./board";
import { Button } from "./myui";

class Game2048 extends Scene{
  private _header: PIXI.Container;    // 头部区域
  private _boarder: Board;            // 棋盘
  private _body: PIXI.Container;      // 主体区域。主要是识别用户手势。
  private _col: number;
  private _row: number;
  private _curLevel: number = 1;
  private _curScore: number;
  private _state = 0;
  private _style: PIXI.TextStyle;
  private _levelText: PIXI.Text;
  private _bestText: PIXI.Text;
  private _currentText: PIXI.Text;
  private _bestScore: number;
  private _congratulationText: PIXI.Text;
  private _resultBest: PIXI.Text;
  private _resultScore: PIXI.Text;
  private _startPos: PIXI.Point;

  constructor(app: PIXI.Application) {
    super(app);
    this._row = this.getConfig(this._curLevel).row;
    this._col = this.getConfig(this._curLevel).col;
    let best = localStorage.getItem("2048bestScore");
    this._bestScore = best ? parseInt(best) : 0;

    let border = Math.floor(this.app.screen.width / 20);
    this.initHeader(border);
    this.initBody(border);
    this.initResult();
  }

  initHeader(border: number) {
    this._header = new PIXI.Container();

    this._header.x = border;
    this._header.y = border;
    let widthH = this.app.screen.width - 2 * border;
    let heightH = this.app.screen.height / 6;
    this._header.width = widthH;
    this._header.height = heightH;  

    const graphicsH = new PIXI.Graphics();
    graphicsH.lineStyle(4, 0xffffff, 1);
    graphicsH.beginFill(0xcc6633);
    graphicsH.drawRect(0, 0, widthH, heightH);
    graphicsH.endFill();

    this._header.addChild(graphicsH);
    this._curScore = 0; 
    this.drawHeader();

    let play = new Button(PIXI.Texture.from("fastgame"));

    play.x = this.app.screen.width / 2 + 10;
    play.y = 5;
    if (this.app.screen.width < 640) {
      play.scale.set(0.25);
    }
    this.onPlay = this.onPlay.bind(this);
    play.on('pointerdown', this.onPlay); 
    this._header.addChild(play);

    this.containner.addChild(this.header);
  }

  initBody(border: number) {
    this._body = new PIXI.Container();
    this._body.x = 0;
    this._body.y = border + this.header.height;  // 偏移出头部区域
    this._body.width = this.app.screen.width;
    this._body.height = this.app.screen.height - (2 * border + this.header.height);

    this.drawBoarder();

    this.containner.addChild(this._body);
    const graphicsB = new PIXI.Graphics();
    graphicsB.beginFill(0x888888);
    graphicsB.drawRect(0, 20,
      this.app.screen.width,
      this.app.screen.height - (2 * border + this.header.height));
    graphicsB.endFill();
    this._body.addChild(graphicsB);

    this._body.addChild(this.boarder.board);
    this._body.interactive = true;
    this._body.buttonMode = true;
    this._body.on("pointerdown", (event: PIXI.InteractionEvent) => {
      this.onSelStart(event.data.getLocalPosition(this._body));
    });
    this._body.on("pointerup", (event: PIXI.InteractionEvent) => {
      this.onSelEnd(event.data.getLocalPosition(this._body));
    });  
  }

  initResult() {
    let height = 300;
    let width = 270;
    let left = 20;
    let top = 100;
    let x = 40;
    let y = 110; 
    let span = 40;

    const graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0x262626, 1);
    graphics.beginFill(0x663300, 0.9);
    graphics.drawRoundedRect(left, top, width, height, 16);
    graphics.endFill();

    this.resultContainner.addChild(graphics);
    this.resultContainner.x = x;
    this.resultContainner.y = y;
    this.resultContainner.visible = false;
    this._congratulationText = new PIXI.Text("Congratulation", this._style);
    this.resultContainner.addChild(this._congratulationText);
    this._congratulationText.x = x;
    this._congratulationText.y = y + span;

    this._resultBest = new PIXI.Text("Best: "+this._bestScore, this._style);
    this.resultContainner.addChild(this._resultBest);
    this._resultBest.x = x;
    this._resultBest.y = y + span * 2;

    this._resultScore = new PIXI.Text("Score: "+this._bestScore, this._style);
    this.resultContainner.addChild(this._resultScore);
    this._resultScore.x = x;
    this._resultScore.y = y + span * 3;

  }

  getConfig(level:number): {row:number, col:number, width: number, height:number, hBlock: number} {
    let nameLevel = 'level' + level;
    let mWidth = Math.floor(this.app.screen.width * 4 / 5);
    let width = this.app.screen.width > 640? 640: mWidth;
    return { row: 4, col: 4, width: width, height: width, hBlock: Math.floor(width/4) };
  }

  getBestScore(): number{
    return this._bestScore;
  }

  get header() {
    return this._header;
  }

  get boarder(): Board {
    return this._boarder;
  }

  private drawHeader(): void{
    let fontSize = 20;
    let span = 55;
    this._style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      dropShadow: true,
      dropShadowAlpha: 0.6,
      dropShadowAngle: 1.1,
      dropShadowBlur: 1,
      dropShadowColor: "0x111111",
      dropShadowDistance: 2,
      fill: ['#ffffff'],
      stroke: '#664620',
      fontSize: fontSize,
      fontWeight: "lighter",
      lineJoin: "round",
      strokeThickness: 8
    });
  
    let lText = '2048';
    this._levelText = new PIXI.Text(lText, this._style);
    this._levelText.x = 10;
    this._levelText.y = 10;

    this._bestText = new PIXI.Text('Best: '+this.getBestScore(), this._style);
    this._bestText.x = 10;
    this._bestText.y = 10 + span;


    this._currentText = new PIXI.Text('Current: '+this._curScore,this._style);
    this._currentText.x = Math.floor(this.header.width / 2);
    this._currentText.y = 10 + span;

    this.header.addChild(this._levelText);
    this.header.addChild(this._bestText);
    this.header.addChild(this._currentText);
  }

  onPlay(): void{
    this._state = 1;
    this._boarder.newGame();
    this._curScore = 0;
    this.resultContainner.visible = false;
    this._body.interactive = true;
    this._body.buttonMode = true;
  }

  private drawBoarder(): Board{
    let gameInfo = this.getConfig(this._curLevel);
    let width = gameInfo.width - (gameInfo.width % 4);
    let height = gameInfo.height-(gameInfo.height % 4);
    let hBlock = gameInfo.hBlock;
    this._boarder = new Board({
      x: Math.floor((this.app.screen.width - width) / 3),
      y: 80,
      width: width,
      height: height,
      row: this._row,
      col: this._col,
      blockW: hBlock,
      blockH: hBlock
    })
    return this._boarder;
  }

  gameTimer(): void{
    if (this._state) {
      let score = this._boarder.getScore();
      if (this._boarder.getMaxValue() == 2048) {
        this.gameFinished();
      }
      if (this._boarder.isFull()) {
        //游戏结束
        console.log("游戏结束");
        this.gameFinished();

      }  
      if (score > this._curScore) {
        this._curScore = score;
        this.updateCount(this._curScore);
      }
      
    }
    
  }

  gameFinished(): void{
    this._state = 0;
    if (this._curScore > this._bestScore) {
      this._bestScore = this._curScore;
      localStorage.setItem('2048bestScore', this._bestScore.toString());

    }
    this._body.interactive = false;
    this._body.buttonMode = false;
    this.boarder.endGame();
    this.showResult();
  }

  showResult(): void{
    this._resultBest.text = "Best: " + this._bestScore;
    this._resultScore.text = "Score: " + this._curScore;
    this.resultContainner.visible = true;
  }

  private updateCount(count: number) {
    this.header.removeChild(this._currentText);
    this._currentText = new PIXI.Text("Current: " + count, this._style);
    this.header.addChild(this._currentText);
    this._currentText.x = Math.floor(this.header.width / 2);
    this._currentText.y = 65;
  }

  private onSelStart(pos: PIXI.Point) : void{
    this._startPos = pos;
  }

  private onSelEnd(pos: PIXI.Point): void{
    let horizen = pos.x - this._startPos.x;
    let vertical = pos.y - this._startPos.y;
    let ha = Math.abs(horizen);
    let va = Math.abs(vertical);
    if (ha > va) {
      // 左右动
      if (horizen > 0) {
        this.boarder.moveDirection(Direction.RIGHT, false);
      } else {
        this.boarder.moveDirection(Direction.LEFT, false);
      }
    } else {
      // 上下动
      if (vertical > -10) {
        this.boarder.moveDirection(Direction.DOWN, true);

      } else {
        this.boarder.moveDirection(Direction.UP, true);
      }
    }
  }
}

export default Game2048;