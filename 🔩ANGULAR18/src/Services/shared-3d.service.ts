import { Injectable } from '@angular/core';
import {Babylon3dService} from './babylon3d.service';
import {Color3, Vector3} from "babylonjs";


type KV = { [key: string]: any };
@Injectable({
  providedIn: 'root'
})
export class Shared3dService {
  constructor(private BB: Babylon3dService) {
  }


  setLight(intensity: number =0.5, color: Color3 = Color3.Magenta(), negative = false) {
    let trans = !negative ? +100 : -100;
    this.BB._BabyLIGHT("Hem", [trans, trans,trans], intensity, color);
  }

  lightsAndCamera() {
    this.BB._BabyLIGHT("Hem", [0, 0, -2], 0.7, Color3.Gray());
    this.BB._BabyLIGHT("", [0, 4, -15], 0.1, Color3.Blue());
  }

  async createDemo(option: { [key: string]: any } = {}): Promise<any> {
    let canvas3D = this.BB._BabySetUp()
    this.BB.$OPTION = Object.assign(this.BB.$OPTION, option);
    const canvas = await this._BabyDemoScene(canvas3D.id);
    return this.FinishIT(canvas.id);
  }

  colorNameToColor3(colorName: string) {
    let dummyElement = document.createElement('div');
    dummyElement.style.color = colorName;
    document.body.appendChild(dummyElement);
    let computedColor= window.getComputedStyle(dummyElement).color +"";
    document.body.removeChild(dummyElement);
    // @ts-ignore
    let rgbValues = computedColor.match(/\d+/g).map(Number);
    return new BABYLON.Color3(rgbValues[0] / 255, rgbValues[1] / 255, rgbValues[2] / 255);
  }

  _SetRandomName(label: string = "anything") {
    return label + new Date().getTime() * Math.round(Math.random() * 12345 + new Date().getMilliseconds() * Math.random() );
  }
  colorHexToColor3(hex: string){
    return BABYLON.Color3.FromHexString(hex);
  }

  async create3dLabel(_label: string, _width=800, color: string = "orange", _font: KV = {size: 0, name: "Oi_Regular"}, _DSR: Array<number> = [],
              ){
    let canvas3D = this.BB._BabySetUp(_width);
    this.setLight(0.6, this.colorNameToColor3(color));
    const {canvas, textMesh} = await this.BB._BabyLABEL3D(canvas3D.id, _label, _font["name"], _width );
    return this.FinishIT(canvas.id);
  }

  FinishIT(_canvasID: string){
    this.BB._BabyWrapUp(_canvasID);
    return this.BB.$3D_DIRECTOR[_canvasID].canvas;
  }

  async _BabyDemoScene(_canvasID: string) {
    this.lightsAndCamera();
    let box = this.BB._BabyBOX();
    box.position.z = 2.5;
    box.material = this.BB._BabyMATERIAL({opacity: 0.3, color: Color3.Green()});
    const light = this.BB._BabyLIGHT("hem", [0, 48, 55]);
    light.intensity = 0.2;
    const {canvas, textMesh}  = await this.BB._BabyLABEL3D(_canvasID, "[" + this.BB.$OPTION["category"] + "]" );
    textMesh.position.x = 0;
    textMesh.position.y = -1;
    textMesh.position.z = -7
    textMesh.material = this.BB._BabyMATERIAL({opacity: 0.2, color: Color3.Blue()});
    let box1 = this.BB._BabyBOX([30, 2.5, 20]);
    box1.position.x = 0;
    box1.position.y = 8;
    box1.position.z = 6;
    box1.material = box.material;
    this.BB.MESH = box1;
    this.BB.MESH.material = this.BB._BabyMATERIAL({special: true, opacity: 0.9});
    this.BB.MESH.material.diffuseTexture = this.BB._BabyTexture();
    this.BB._BabySetText("title", [-1, 90]);
    this.BB._BabySetText("description");
    this.BB.MESH = this.BB._BabySPHERE({diameter: 10, opacity: 0.1, color: Color3.Magenta(),
      position: {x: 0, y: 6, z: -4  }});
    const randomCount = 4 + (Math.floor(Math.random() * 6));
    const diameter = (15 - randomCount) / 5;
    for (let x = 0; x <= randomCount; x++) {
      let dist = (x * diameter) - 10;
      const rgb1= Math.random()*10;
      const rgb2= Math.random()*10;
      const rgb3= Math.random()*10;
      this.BB.$BabyOBJECTS.push(this.BB._BabySPHERE({
        diameter: diameter,
        color: this.BB._BabyRGB(rgb1, rgb2, rgb3),
        position: {x: -13, y:diameter*2, z: dist}
      }));
      this.BB.$BabyOBJECTS.push(this.BB._BabySPHERE({
        diameter: diameter,
        color: this.BB._BabyRGB(rgb3, rgb1, rgb2),
        position: {x: 13, y:diameter*2, z: dist}
      }));
    }
    this.BB._RevertState(2);
    return canvas;
  }
}
