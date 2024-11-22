import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Shared3dService} from "../../Services/shared-3d.service";

@Component({
  selector: 'widget-text3d',
  standalone: true,
  imports: [],
  templateUrl: './text3d-widget.component.html',
  styleUrl: './text3d-widget.component.css'
})

export class Text3dWidgetComponent implements AfterViewInit {
  @Input() width = 800;
  @Input() label: string = "LABEL GOES HERE";
  @Input() color: string = "orange";
  constructor(private _Shared3D: Shared3dService) {}

  async ngAfterViewInit() {
    const container = document.getElementById("text3d_container")!;
    container.id="container" + new Date().getTime() + Math.random()*1000;
    const CANVAS = await this._Shared3D.create3dLabel(this.label, this.width, this.color);
    container.appendChild(CANVAS);
   }
}
