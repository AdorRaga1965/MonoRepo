import {Component, Input, signal} from '@angular/core';
import {ClockWidgetComponent} from '../../Widgets/clock-widget/clock-widget.component';
import {Shared3dService} from '../../Services/shared-3d.service';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-babylon-clock',
  standalone: true,
  imports: [
    ClockWidgetComponent,
    ReactiveFormsModule
  ],
  templateUrl: './babylon-clock.component.html',
  styleUrl: './babylon-clock.component.css'
})
export class BabylonClockComponent {
  constructor(private _3d: Shared3dService ) {
  }
@Input() category = "CATEGORY";
@Input() title = "TITLE";
@Input() description = "DESCRIPTION GOES HERE....";


  async ngAfterViewInit() {
    // let canvas = await this._3d.Babylon3D({category: this.category, title: this.title, description: this.description });
    // canvas.id = "canvas" + new Date().getTime() + Math.floor(Math.random() * 1000);
  }


}
