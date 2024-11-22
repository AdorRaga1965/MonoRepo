import {Injectable, signal} from '@angular/core';
import * as BABYLON from 'babylonjs';
import { MeshBuilder, StandardMaterial, Color3, Vector3 } from "babylonjs";
import earcut from 'earcut';
import Mesh = BABYLON.Mesh;
import Vector4 = BABYLON.Vector4;
import Color4 = BABYLON.Color4;
type KV = { [key: string]: any }

@Injectable({
  providedIn: 'root'
})

export class Babylon3dService {
  constructor() {
  }
  $3D: KV = {};
  $OPTION: KV = {
    category: "CATEGORY",
    title: "TITLE",
    description: "DESCRIPTION"
  };

  MESH: any;
  $FONTDATA: KV = {};
  $FONTSLOADED: string[] = [];

  $BabyOBJECTS: Array<any> = [];
  _BabyLastY = 120;
  ___drawingPlane: any;

  _SetRandomName(label: string = "anything") {
    return label + new Date().getTime() * Math.round(Math.random() * 12345 + new Date().getMilliseconds() * Math.random() );
  }

  _SetXYZ(x = 0, y = 0, z = 0) {
    return new Vector3(x, y, z);
  }

  _BabyLIGHT(style: string = "Hem", target = [0, 0, 0], intensity: number = 0.5, color = Color3.Blue(),) {
    const name = this._SetRandomName("light");
    this.$3D["light"] = (style === "Hem" ? new BABYLON.HemisphericLight(name, this._SetXYZ(target[0], target[1], target[2]), this.$3D["scene"])
            : new BABYLON.DirectionalLight(name, this._SetXYZ(target[0], target[1], target[2]), this.$3D["scene"])
    );
    this.$3D["light"].intensity = intensity;
    this.$3D["light"].groundColor = color;
    return this.$3D["light"];
  }

  _BabyCAMERA(type = "free", options: KV = {}) {
    let camera;
    const name = this._SetRandomName('camera');
    if (type === "free") {
      options = {x: options['x'] || 0, y: options['y'] || 0, z: options['z'] || 0};
      camera = new BABYLON.FreeCamera(name, this._SetXYZ(options['x'], options['y'], options['z']), this.$3D["scene"]);
    } else if (type === "arc") {
      options = {
        alpha: options['alpha'] || 0,
        beta:   options['beta'] || 0,
        radius: options['radius'] || 10,
        target: options['target'] || this._SetXYZ(0, 0, 0),
        ...options
      };
      camera = new BABYLON.ArcRotateCamera(name, options['alpha'], options['beta'],
          options['radius'], options['target'],
          this.$3D["scene"]);
    }
    camera!.attachControl(this.canvas, true);
    this.$3D["camera"] = camera;
    return camera;
  }


  canvas = document.createElement("canvas");
  _BabySetUp(width: number = 1200) {
    Object.assign(this.$3D,  {}) ;
    this.$3D["boardWidth"] = width;
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.$3D["boardWidth"];
    this.canvas.height = window.devicePixelRatio * this.canvas.width * 6/9;
    const canvasID = this._SetRandomName("canvasBabylon");
    this.canvas.id =canvasID;
    this.$3D["engine"] = new BABYLON.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true }, true);
    this.$3D["engine"].setHardwareScalingLevel(1 / window.devicePixelRatio);
    this.$3D["scene"] = new BABYLON.Scene(this.$3D["engine"]);
    this.$3D["scene"].antialiasing = true;
    this._BabyCAMERA("arc", { alpha: Math.PI / 2, beta: Math.PI / 4, radius: 30, target: this._SetXYZ(0, 3.5, 8)});
    this.$3D["camera"].setPosition(new Vector3(0, 20, -25)); // Camera positioning
    this.$3D_DIRECTOR[canvasID] =
        { canvas: this.canvas,
          engine: this.$3D["engine"],
          scene:  this.$3D["scene"] };
    return this.canvas;
  }

  $3D_DIRECTOR: KV = {};
  _BabyWrapUp(_canvasID: string) {
    const engineer = this.$3D_DIRECTOR[_canvasID];
    engineer["scene"].clearColor = new Color4(0, 0, 0, 0);
    engineer["engine"].runRenderLoop(() => {
    engineer["scene"].render();
    });
    document.addEventListener('resize', () => {
      engineer["scene"].resize();
    });
  }

  _RevertState(seconds = 6) {
    const {alpha, beta} = this.$3D["camera"];
    let radius = this.$3D["camera"].radius
    let lastUserInputTime = Date.now();
    this.$3D["scene"].onBeforeRenderObservable.add(() => {
      const currentTime = Date.now();
      const timeSinceLastInput = currentTime - lastUserInputTime;
      if (timeSinceLastInput > 1000 * seconds) { // 5 seconds in milliseconds
        this.$3D["camera"].alpha = alpha;
        this.$3D["camera"].beta = beta;   // Re
        this.$3D["camera"].radius = radius;// set the X-axis rotation
      }
    });
    this.canvas.addEventListener('mousemove', () => {
      lastUserInputTime = Date.now();
    });
    this._BabyFinalize();
  }

  _BabySPHERE(option: any = {diameter: 0, color: "", position: {}}): Promise<any> {
    this.$3D["sphere"] = BABYLON.MeshBuilder.CreateSphere(this._SetRandomName("sphere"), {
      segments: option.segments || 64,
      diameter: option["diameter"] || 4,
    }, this.$3D["scene"]);
    const material = new BABYLON.StandardMaterial("sphereMaterial", this.$3D["scene"]);
    const texture = this._BabyTexture();
    // material.diffuseTexture = texture;
    material.diffuseColor = option["color"]; //new Color3(1,1,1);//Color3.Red();
    this.$3D["sphere"].material = material;
    this.$3D["sphere"].position.x = option.position.x || 0;
    this.$3D["sphere"].position.y = option.position.y || option.diameter / 2;  // Default to half the diameter if no y position is provided
    this.$3D["sphere"].position.z = option.position.z || 0;
    texture.update()
    return this.$3D["sphere"];
  }

  _BabyRGB(r = 5, g = 5, b = 5) {
    return new Color3(r / 10, g / 10, b / 10);
  }

  _BabyBOX(WDH = [0, 0, 0], XYZR = [0, 0, 0, 0]) {
    let box = BABYLON.MeshBuilder.CreateBox(this._SetRandomName("box"),
        {width: WDH[0] || 30, depth: WDH[1] || 20, height: WDH[2] || 2}, this.$3D["scene"]);
    box.position.x = XYZR[0] || 0;
    box.position.y = XYZR[1] || 0;
    box.position.z = XYZR[2] || 0;
    box.rotation.y = XYZR[3] || 0;
    return box;
  }

  _BabySetText(style: string = "description", XY: Array<number> = [], option: KV = {}) {
    let defSize = 46;
    let defColor = "white";
    if (style === "category") {
      defSize = 100;
      defColor = "magenta"
    }
    if (style === "title") {
      defSize = 80;
      defColor = "gold"
    }
    let _size = option["size"] || defSize;
    let _color = option["color"] || defColor;
    let _name = option["name"] || "times";
    return  this._BabyLABEL(this.$OPTION[style], [XY[0] || -1, XY[1] || this._BabyLastY], {
      size: _size,
      color: _color,
      name: _name
    }).canvas;
  }

  _BabyFinalize() {
    this.$3D["scene"].onBeforeRenderObservable.add(() => {
      for (let x = 0; x < this.$BabyOBJECTS.length; x++) {
        this._AnimateSphere(this.$BabyOBJECTS[x]);
      }
    });
  }

  _AnimateSphere(object: BABYLON.Mesh) {
    object.position.y += (Math.random() - 0.5) * 0.2;
    object.position.y = Math.max(0.5, Math.min(1.5, object.position.y));
  }

  _BabyLABEL(text: string, XY = [0, 0], fontAssignment = { size: 32, name: "arial", color: "orange" }): any {
    const texture = this.MESH.material.diffuseTexture;
    const context =  texture.getContext();
    context.font = `${fontAssignment.size}px bold ${fontAssignment.name}`;
    context.fillStyle = fontAssignment.color;
    const textWidth = context.measureText(text).width;
    const lineHeight = fontAssignment.size * 1.3;
    let yPosition = XY[1];
    let widestWidth = 0;
    const xPosition = XY[0] < 0 ? (this.$3D["boardWidth"] - textWidth) / 2 : XY[0];
    if (textWidth <= this.$3D["boardWidth"]) {
      context.fillText(text, xPosition, yPosition);
      this._BabyLastY = yPosition + lineHeight;
    } else {
      // Handle multi-line text
      const lines = [];
      let currentLine = "";
      const words = text.split(" ");
      widestWidth = textWidth;
      words.forEach(word => {
        const wordWidth = context.measureText(currentLine + " " + word).width;
        if (wordWidth + 50 > this.$3D["boardWidth"]) {
          lines.push(currentLine);
          currentLine = word + " ";
        } else {
          currentLine += word + " ";
        }
      });
      if (currentLine.trim() !== "") {
        lines.push(currentLine);
      }
      lines.forEach((line, index) => {
        const lineWidth = context.measureText(line).width;
        let lineXPosition = XY[0] < 0 && index === 0 ? (this.$3D["boardWidth"] - lineWidth) / 2 : 50 + (index === 0 ? XY[0] : XY[0]);
        context.fillText(line, lineXPosition, yPosition);
        yPosition += lineHeight;
        if (lineWidth > widestWidth) widestWidth = lineWidth;
      });
      this._BabyLastY = yPosition;
    }
    texture.update();
    return texture;
  }

  _BabyTexture(){
    return  new BABYLON.DynamicTexture(
        this._SetRandomName("DynamicTexture"),
        { width: this.$3D["boardWidth"], height: this.$3D["boardWidth"] },
        this.$3D["scene"],
        true,
        BABYLON.Texture.TRILINEAR_SAMPLINGMODE
    );
  }

  _BabyMATERIAL(option: any = {}) {
    const texture = new BABYLON.DynamicTexture(
        this._SetRandomName("DynamicTexture"),
        { width: this.$3D["boardWidth"], height: this.$3D["boardWidth"] },
        this.$3D["scene"],
        true,
        BABYLON.Texture.TRILINEAR_SAMPLINGMODE
    );
    const material = new BABYLON.StandardMaterial(this._SetRandomName("Material"), this.$3D["scene"]);
    const color = option.color || new BABYLON.Color3(0, 0, 1); // Default to blue if color is not specified
    material.diffuseTexture = texture;
    texture.hasAlpha = false;
    if (option.opacity) {
      material.ambientColor = color;// new Color3(0,0,0);
      material.diffuseColor = color;
      material.diffuseTexture = null;
      texture.hasAlpha = true;
      material.alpha = option.opacity === 1 ? 0.95 : option.opacity;
      if(option["special"]) {
        material.diffuseColor =  new Color3(1,1,1);
        material.diffuseTexture = texture;
        texture.hasAlpha = false;
      }
    }
    texture.update();
    if(option["special"]) material.diffuseTexture =  texture  ;
    return material;
  }

  async _BabyLABEL3D(_canvasID: string, _label = "this is a test", _fontName: string ="Danfo_Regular", _width=800): Promise<any> {
    const canvas= this.$3D_DIRECTOR[_canvasID].canvas
    if (this.$FONTSLOADED.indexOf(_fontName) < 0) {
      let response: any ;
     try {
       response = await fetch(`http://ragaware.net/font/${_fontName}.json`);
     }
     catch {
       response = await fetch(`http://ragaware.net/font/Danfo_Regular.json`);
     }
      this.$FONTDATA[_fontName] = await response.json();
      this.$FONTSLOADED.push(_fontName);
    }
    const fontData = this.$FONTDATA[_fontName];
    if (!fontData) {
      console.error(`Font data for ${_fontName} is not defined`);
      return;
    }
    const textMesh =  BABYLON.MeshBuilder.CreateText(
        this._SetRandomName("text3d"),
        _label, fontData,
        {
          depth: 0.3, size: 1, resolution: 32,
          faceUV: [
            new BABYLON.Vector4(0, 0, 1, 1),
            new BABYLON.Vector4(0, 0, 0.5, 0.5),
            new BABYLON.Vector4(0, 0, 0.5, 0.5)
          ]
        }, this.$3D["scene"], earcut
    )!;
    if(! (_label.includes("[") && _label.includes("]") ) )
    {
        textMesh.rotation.x = 45*Math.PI/180;
        textMesh.refreshBoundingInfo();
        const boundingInfo = textMesh.getBoundingInfo();
        const boundingBox = boundingInfo.boundingBox;
        const w = boundingBox.maximumWorld.x - boundingBox.minimumWorld.x;
        const h = boundingBox.maximumWorld.y - boundingBox.minimumWorld.y;
        textMesh.position.y =-h/2;
        this.flatCam(w,h);
        const ratio = w/h;
        canvas.width = _width +10 ;
        canvas.height = _width / ratio;
        canvas.style.backgroundColor = "transparent";
    }
    this.$3D_DIRECTOR[_canvasID]["canvas"] = canvas;
    return {canvas, textMesh};
  }


  flatCam( width:number=0, height:number=0) {
    const camera = new BABYLON.FreeCamera('Camera', new BABYLON.Vector3(-0.2, -0.2, -200),
        this.$3D["scene"]);
    camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    camera.orthoLeft = -width / 2;
    camera.orthoRight = width / 2;
    camera.orthoTop = height / 2;
    camera.orthoBottom = -height / 2;
    this.$3D["scene"].activeCamera = camera;
    return camera;
  }




}



