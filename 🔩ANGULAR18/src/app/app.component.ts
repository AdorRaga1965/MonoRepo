import {Component, ViewChild} from '@angular/core';
import { RouterLink, RouterOutlet} from '@angular/router';

// import {ClockWidgetComponent} from '../Widgets/clock-widget/clock-widget.component';
import {CommonModule} from '@angular/common';
import {ClockWidgetComponent} from '../Widgets/clock-widget/clock-widget.component';
import {MetricClockComponent} from '../Components/clock/metric-clock/metric-clock.component';
import {VpnComponent} from '../Components/vpn/vpn.component';
import {BabylonClockComponent} from '../Components/babylon-clock/babylon-clock.component';
import {FormsModule} from '@angular/forms';
import {CanvasWidgetComponent} from "../Widgets/canvas-widget/canvas-widget.component";
import {Text3dWidgetComponent} from "../Widgets/text3d-widget/text3d-widget.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, RouterLink, ClockWidgetComponent, MetricClockComponent, VpnComponent, BabylonClockComponent, CanvasWidgetComponent, Text3dWidgetComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild( CanvasWidgetComponent ) demo!: CanvasWidgetComponent;
  constructor( ) {
  }
  title = 'TRIUM-VERITAS';
  category = "I LOVE THIS PROJECT";

  async changeValue() {
    const title: HTMLInputElement = document.getElementById("title") as HTMLInputElement;
    this.demo.title = title.value;
    await this.demo.showDemo( true);

  }

}
