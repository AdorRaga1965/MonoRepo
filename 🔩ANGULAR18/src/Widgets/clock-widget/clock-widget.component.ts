import {Component, Input} from '@angular/core';
import {ClockService} from '../../Services/clock.service';

type KV = {
  [key: string]: any; };

type ClockInfo = {
  canvas:any, skin:any, ctx: any};

@Component({
  selector: 'widget-clock',
  standalone: true,
  imports: [],
  templateUrl: "clock-widget.component.html",
  styleUrl: './clock-widget.component.css'
})
export class ClockWidgetComponent {
  @Input() SKIN:  KV = {
      "hourColor":  "navy",
      "digitColor": "violet",
      "tickColor":  "indigo",
      "tickWidth":  20,
      "isUpright":  false,
      "isMetric" : false,
  };
  @Input() diameter:number = 800;
  @Input() isMetric  = false ;
  constructor(private clockService: ClockService) {  }

  ngAfterViewInit() {
    const container = document.getElementById("clock_container")!;
    container.style.width =   this.diameter + "px";
    container.style.height =  this.diameter + "px";
    if(this.isMetric) {
      this.SKIN["isMetric"] = true;
      this.SKIN["hourColor"]=  "red";
      this.SKIN["tickColor"] =  "maroon";
      this.SKIN["clockFace"] =  "ready.png";
      this.SKIN["digitColor"] =  "red";
      // this.SKIN["isUpright"] =  true;
    }
    else {
      this.SKIN["clockFace"] =  "navy";
    }
    let diameter = container.offsetWidth;
    let CANVAS = document.createElement("canvas");
    CANVAS.id = "canvasInstance" + new Date().getTime()  + Math.random()*1000;
    CANVAS.width = diameter;
    CANVAS.height = diameter;
    let CTX = CANVAS.getContext("2d");
    if (!CTX) return;
    container.id="container" + new Date().getTime() + Math.random()*1000;
    let clockInfo : ClockInfo = { canvas: CANVAS, skin:this.SKIN, ctx: CTX}
    this.clockService.init(clockInfo);
    container.appendChild(CANVAS);

  }


}

