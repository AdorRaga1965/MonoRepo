import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Shared3dService} from "../../Services/shared-3d.service";

@Component({
  selector: 'widget-canvas',
  standalone: true,
  imports: [],
  templateUrl: './canvas-widget.component.html',
  styleUrl: './canvas-widget.component.css'
})
export class CanvasWidgetComponent implements AfterViewInit {
  @Input() category= "This is Category";
  @Input() title= "Blowing with No Wind";
  @Input() description= "Description here.";
  constructor(private _Shared3D: Shared3dService) {}

  async ngAfterViewInit() {
    await this.showDemo();
  }

  container_id = "";
  async showDemo(update: boolean= false){
    const option = {
      category:     this.category,
      title:        this.title,
      description:  this.description
    };
    const CANVAS = await this._Shared3D.createDemo(option);
    if(!update) {
      const container = document.getElementById("demo_container")!;
      container.id = "container" + new Date().getTime() + Math.random() * 1000;
      this.container_id = container.id
      container.appendChild(CANVAS);
    }
    else {
      const cont = document.getElementById((this.container_id))!
      cont.firstChild!.remove();
      cont.appendChild(CANVAS);
    }
  }
}
