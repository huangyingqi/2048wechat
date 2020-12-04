export enum WinType{
  WINDOWS = 0,
  IPAD,
  IPHONE,
}

export class Config{
  private _width: number;   // 整体宽
  private _height: number;  // 整体高
  private _types: WinType;  // 类型
  private _headFontSize: number;    // 头部字体大小
  private _headSpan: number;        // 头部行间距
  private _boarderWidth: number;    // 面板宽度
  private _boarderHeight: number;   // 面板高度
  private _blockWidth: number;      // 块宽度
  private _blockFontSize: number[];   // 块字体大小, 0 对应1~9 1 对应10~99 2 对应100~999 3 对应1000 ~9999
  private _blockLeft: number[];       // 块字体左侧偏移量
  private _row: number;             // 行数
  private _col: number;             // 列数
  constructor(width: number, height: number) {
    this._row = 4;
    this._col = 4;
    this._boarderWidth = width;
    this._boarderHeight = height;
    this._blockWidth = Math.floor(width/this._col);
    this._blockFontSize = [70, 60, 50, 40];
    this._blockLeft = [60, 55, 50, 45];
    if (width > 768) {
      this._width = 800;
      this._types = WinType.WINDOWS;
      this._height = 1136;
      this._headFontSize = 40; 
      this._headSpan = 80;
    } else if (width > 420) {
      this._width = 768;
      this._height = 1024;
      this._types = WinType.IPAD;
      this._headFontSize = 30;
      this._headSpan = 65;
      this._blockFontSize = [35, 30, 25, 20];
      this._blockLeft = [30, 25, 20, 15];
    } else {
      this._width = 300;
      this._height = 300;
      this._types = WinType.IPHONE;
      this._headFontSize = 23;
      this._headSpan = 55;
      this._blockFontSize = [35, 30, 25, 20];
      this._blockLeft = [35, 12, 8, 4];
    }  
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get types() {
    return this._types;
  }

  get headerFont() {
    return this._headFontSize;
  }

  get boarderWidth() {
    return this._boarderWidth;
  }

  get boarderHeight() {
    return this._boarderHeight;
  }

  get blockWidth() {
    return this._blockWidth;
  }

  get blockFontSize() {
    return this._blockFontSize;
  }

  get blockLeft() {
    return this._blockLeft;
  }

}