import { Component } from '@angular/core';

@Component({
  selector: 'app-vpn',
  standalone: true,
  imports: [],
  templateUrl: './vpn.component.html',
  styleUrl: './vpn.component.css'
})
export class VpnComponent {
  result:any = {};

  async submitRequest(){
    const name = (document.querySelector("#name") as HTMLInputElement).value;
    const email =  (document.querySelector("#email") as HTMLInputElement).value;
    alert(email + " " + name);
    const response = await fetch("http://localhost/vpn", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email })
    });
    alert(response.ok);
    if (response.ok) {
      this.result = await response.json();
    } else {
      alert('Error processing request');
    }
  }
}
