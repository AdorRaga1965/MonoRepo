import {Injectable} from '@angular/core';

type KV = {
  [key: string]: any;
};
type ClockInfo = { canvas: any, skin:any, ctx: any};


@Injectable({
  providedIn: 'root',
})
export class ClockService {
  constructor() {
  }
  private radians = Math.PI / 180;
  private isMetric = false;
  private interval: any;//🤡
  private diameter = 0;
  private radius = 0;
  private timeElement: KV = { "h": 0, "m":0, "s": 0, "ms":0}
  private CANVAS: any;
  private SKIN: KV = {};
  private CTXobject: KV  = {};
  private SKINobject: KV  = {};
  private CANVASobject: KV = {};
  private idArray: Array<string> = [];
  private CTX: any;

  public init(clockInfo : ClockInfo) {
    if (clockInfo) {
          clearInterval(this.interval);
          this.CANVAS = clockInfo["canvas"];
          const id: string =this.CANVAS.id;
          this.CANVASobject[id] = this.CANVAS;
          this.CTXobject[id] = this.CANVAS.getContext("2d");
          this.SKINobject[id]= clockInfo["skin"];
          this.idArray.push(id);
          this.interval = setInterval(() => {this.draw();}, 250);
          return id;
    }
    else
    {
          alert('Canvas not supported!');
          return; // Early return if canvas not supported
    }
  }

  public setCanvasValue(key: string, value: string) {
        this.SKIN[key] = value.toString();
  }

  private draw(): void {
    for(let x=0; x<this.idArray.length; x++)
    {
      const id = this.idArray[x];
      this.CTX = this.CTXobject[id];
      if (this.CTX) {
        this.SKIN = this.SKINobject[id];
        this.diameter =  this.CANVASobject[id].width;
        this.radius = this.diameter / 2;
        const currentTime = new Date();
        let hours = currentTime.getHours();
        let minutes = currentTime.getMinutes();
        let seconds = currentTime.getSeconds();
        let ms = currentTime.getMilliseconds();

        if (this.SKIN["isMetric"]) {
              const numSeconds = (ms / 1000) + seconds + (minutes * 60) + (hours * 3600);
              const metricNumSeconds = (numSeconds * 100000 / 86400 ) + "";
              const metricFormat = metricNumSeconds.split(".");
              let metricNumSecondsText = metricFormat[0];
              let numDigits: number = metricNumSecondsText.length;
              if (numDigits===4)  metricNumSecondsText = "00" + metricNumSecondsText;
              if (numDigits===5)  metricNumSecondsText = "0" + metricNumSecondsText;
              hours =   parseInt(metricNumSecondsText.substr(0, 2));
              minutes = parseInt(metricNumSecondsText.substr(2, 2));
              seconds = parseInt(metricNumSecondsText.substr(4, 2));
        }
        this.timeElement = { "h": hours, "m": minutes, "s": seconds, "ms": ms };

        this.clearCanvas();
        this.CTX.save();
        this.drawClock();
        this.CTX.restore();
      }
    }

  }

  private clearCanvas(): void {
    if (!this.CTX) return;
    this.CTX.clearRect(0, 0, this.diameter, this.diameter);
  }



  private getRequiredAngle(handType: string): number {
    const hours=    this.timeElement["h"];
    const minutes=  this.timeElement["m"];
    const seconds=  this.timeElement["s"];
    const hx: Array<number>=       !this.SKIN["isMetric"] ? [30,60, 3600] : [36,100,10000];
    const mx: Array<number>=       !this.SKIN["isMetric"] ? [60,6] : [100,3.6];
    const sx: number =             !this.SKIN["isMetric"] ? 6 : 3.6;
    if(handType==="h")  return hx[0] * ( hours + minutes / hx[1] + seconds / hx[2]);
    if(handType==="m")  return (minutes + seconds / mx[0])* mx[1];
    if(handType==="s")  return seconds * sx;
    return 0;
 }

  handLength:   any = {"h": 50, "m": 70, "s": 95};
  handWidth:    any = {"h": 18, "m": 10, "s": 1 };
  handOpacity:  any = {"h": 0.5, "m": 0.7, "s": 1};

  private rotateAndDraw(handType: string): void {
       if (this.CTX) {
        const angle = this.getRequiredAngle(handType)  * this.radians;
        this.CTX.lineWidth = this.handWidth[handType];
        this.CTX.rotate(angle);
        this.CTX.strokeStyle = "red";
        this.CTX.beginPath();
        this.CTX.globalAlpha = this.handOpacity[handType];
        this.CTX.lineTo(0, -this.radius * this.handLength[handType] / 100);
        this.CTX.lineTo(0, 0);
        this.CTX.stroke();
        this.CTX.rotate(-angle);
    }
  }

  private drawClock() {
    if (this.CTX) {
        this.CTX.translate(this.radius, this.radius);
        this.drawFace();
        this.drawNumbers();
        this.drawTicks();
        this.rotateAndDraw("h");
        this.rotateAndDraw("m");
        this.rotateAndDraw("s");
        this.showDigital(
            this.rectify(this.timeElement["h"]) + ":"
            + this.rectify(this.timeElement["m"]) + ":"
            + this.rectify(this.timeElement["s"]));
    }
  }

  private rectify(num: number): string {
    return (num < 10 ? "0" + num : num.toString());
  }


  loadedImages: { [file: string]: any }  = {}  ;
  createColorImage(obj: string) {
    let image = new Image();
    image.onload = () => {
      this.loadedImages[obj] = image.src;
      image.src = this.loadedImages[obj];
    };
    if(obj.indexOf(".")>=0) {
      if (!this.loadedImages[obj])
            image.src = "http://ragaware.net/img/" + obj;
      else
            image.src = this.loadedImages[obj];
    }
    else {
            const canvas = document.createElement('canvas');
            canvas.width = 10;
            canvas.height = 10;
            const ctx = canvas.getContext('2d');
            ctx!.fillStyle = obj;
            ctx!.fillRect(0, 0, 10, 10);
            image.src = canvas.toDataURL();
    }
    return image;
  }

  private  drawFace() {
    if (this.CTX) {
      this.CTX.save();
      this.CTX.beginPath();
      let newRadius = this.radius * 0.78;
      this.CTX.ellipse(0, 0, newRadius, newRadius, 0, 0, 2 * Math.PI);
      this.CTX.clip();
      // this.CTX.drawImage( this.createColorImage("silver"), -newRadius, -newRadius, newRadius * 2, newRadius * 2);
      newRadius = this.radius * 0.63;
      this.CTX.beginPath();
      this.CTX.ellipse(0, 0, newRadius, newRadius, 0, 0, 2 * Math.PI);
      this.CTX.clip();
      let img =  this.createColorImage(this.SKIN["isMetric"]  ? this.SKIN["clockFace"] : "indigo");
      this.CTX.drawImage( img, -newRadius, -newRadius, newRadius * 2, newRadius * 2);
      this.CTX.restore();
    }
  }

  private drawNumbers() {
    let ang;
    let num;
    if (this.CTX) {
      this.CTX.beginPath();
      this.CTX.fillStyle = this.SKIN["hourColor"];
      this.CTX.font = this.radius * 0.2 + "px monoton";
      this.CTX.textBaseline = "middle";
      this.CTX.textAlign = "center";
      for (num = (this.SKIN["isMetric"] ? 0 : 1); num < (this.SKIN["isMetric"] ? 10 : 13); num++) {
        ang = num * (this.SKIN["isMetric"] ? 36 : 30) * this.radians;
        this.CTX.rotate(ang);
        this.CTX.translate(0, -this.radius * 0.85);
        if (this.SKIN["isUpright"]) this.CTX!.rotate(-ang);
        this.CTX.fillText(num.toString(), 0, 0);
        if (this.SKIN["isUpright"]) this.CTX!.rotate(ang);
        this.CTX.translate(0, this.radius * 0.85);
        this.CTX.rotate(-ang);
      }
    }
  }

  private showDigital(digital: string) {
    if (this.CTX) {
      this.CTX.beginPath();
      this.CTX.font = this.radius * 0.12 + "px monoton";
      this.CTX.textBaseline = "middle";
      this.CTX.textAlign = "center";
      this.CTX.translate(0, -this.radius * 0.40);
        this.CTX.fillStyle = "black";
        this.CTX.fillText(digital, 0, 0);
        this.CTX.fillStyle = this.SKIN["digitColor"];
        this.CTX.fillText(digital, 4, 5);
    }

  }

  private drawTicks() {
    const start = 0;
    const end = this.SKIN["isMetric"] ? 10 : 12;
        if (this.CTX) {
          this.CTX.strokeStyle = this.SKIN["tickColor"];
                for (let num = start; num < end; num++) {
                  const angle = num * (this.SKIN["isMetric"] ? 36 : 30) * this.radians;
                  this.CTX.globalAlpha = 0.5;
                  this.CTX.lineWidth = this.SKIN["tickWidth"];
                  this.CTX.rotate(angle);
                  this.CTX.beginPath();
                  this.CTX.moveTo(0, -this.radius * 0.75);
                  this.CTX.lineTo(0, -this.radius * 0.65);
                  this.CTX.stroke();
                  this.CTX.rotate(-angle);
                        for (let tiny = 0; tiny < (this.SKIN["isMetric"] ? 10 : 5); tiny++) {
                          const angle2 = (num + tiny / (this.SKIN["isMetric"] ? 10 : 5)) * (this.SKIN["isMetric"] ? 36 : 30) * this.radians;
                          this.CTX.globalAlpha = 1.0;
                          this.CTX.lineWidth = 2;
                          this.CTX.rotate(angle2);
                          this.CTX.beginPath();
                          this.CTX.moveTo(0, -this.radius * 0.75);
                          this.CTX.lineTo(0, -this.radius * 0.70);
                          this.CTX.stroke();
                          this.CTX.rotate(-angle2);
                        }
                }
        }
  }


}
