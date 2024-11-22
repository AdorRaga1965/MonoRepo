import {ChangeDetectorRef, Component} from '@angular/core';
import {ClockWidgetComponent} from "../../../Widgets/clock-widget/clock-widget.component";
import {ClockService} from '../../../Services/clock.service';
import {CommonModule} from '@angular/common';
import {CanvasWidgetComponent} from '../../../Widgets/canvas-widget/canvas-widget.component';
import {BabylonClockComponent} from '../../babylon-clock/babylon-clock.component';

type KV = {
  [key: string]: any;
};

@Component({
  selector: 'app-metric-clock',
  standalone: true,
  imports: [
    ClockWidgetComponent, CommonModule, CanvasWidgetComponent, BabylonClockComponent
  ],
  templateUrl: './metric-clock.component.html',
})
export class MetricClockComponent {
  count: number = 2;
  constructor(private clockService: ClockService, private cdr: ChangeDetectorRef) {}

  value: Array<string> =[]
  interactiveObject: any ={
    'faceColor':  "color",
    'scale':      "range:1,100,1",
    'hourColor':  "color",
    'digitColor': "color",
    'tickColor':  "color",
    'tickWidth':  "range:1,100,1",
    'rotation':   "range:0,360,1",
    'isMetric':   "boolean"
  };

  objectKeys = Object.keys(this.interactiveObject);
  history = ["History","Archaic", "Present", "Modern", "Eternal"];
  srcHistory : KV ={};

  ngOnInit(){
    this.srcHistory["History"]= "http://board.net/p/r.cc3e616a7cd52a0c90a4909c8e8ac760?showControls=true&showChat=true&showLineNumbers=false&useMonospaceFont=false";
    this.srcHistory["Archaic"]= "htts://ragaware.net/app/clock/archaic/";
    this.srcHistory["Present"]= "http://localhost/app/clock/present/";
    this.srcHistory["Modern"]=  "http://localhost/app/clock/modern/";
    this.srcHistory["Eternal"]= "http://localhost/app/clock/eternal/";
  }


    hideAllFrames(){
      let items = document.querySelectorAll(".tracker");
      for(let x=0; x<items.length; x++ ) {
        items[x].classList.add("hidden");
      }
    }


    // BB = document.getElementById("babylon");
    title: string ="TITLE HERE";
    description: string ="DESCRIPTION";
    category: string="CATEGORY";

    showVersion(version: string){
      this.title = "TITLE FOR " + version;
      this.category = "ADOR IS HERE";
      this.cdr.detectChanges();
      location.reload();
    }


  setInitialKeyValue(key:string, ordinal:number) {
    const valueType= this.interactiveObject[key].split(':')[0];
    let clockInput = document.createElement('input');
    clockInput.id= key+ordinal;
    clockInput.style.width="100px";
    clockInput.style.margin="3px";
    switch (valueType) {
      case 'color':
        clockInput.type="color"
        break;
      case 'range':
        const rangeValues = this.interactiveObject[key].split(':')[1].split(',');
        clockInput.type="range";
        clockInput.className="range";
        clockInput.min="${parseInt(rangeValues[0])}";
        clockInput.max="${parseInt(rangeValues[1])}"
        clockInput.step="${parseInt(rangeValues[2])}"
        break;
      case 'boolean':
        clockInput.type="checkbox";
        clockInput.className="checkbox";
        break;
    }
    // clockInput.addEventListener('change', () => {
    //   this.setProperty(key +ordinal, clockInput.value );
    // });
  }

  setProperty(key: string, value: any) {
    this.clockService.setCanvasValue(key, value);
  }

  colorToHex(colorName: string): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = colorName;
      return ctx.fillStyle;
    }
    return '';
  }


}
