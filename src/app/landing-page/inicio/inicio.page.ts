import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

 isMobile: boolean = false;

  constructor(private platform: Platform) {}
imprimir() {

  const ticketHTML = `
    <html>
      <body style="font-family: monospace; width: 58mm;">
        <center><h3>RESTAURANTE MASTER</h3></center>
        <hr/>
        <p>1x Hamburguesa  $80</p>
        <p>1x Refresco      $30</p>
        <hr/>
        <b>Total: $110</b>
        <br/><br/>
        <center>Gracias por su compra</center>
      </body>
    </html>
  `;

  (window as any).electronAPI.imprimirTicket(ticketHTML);
}
  ngOnInit() {
    this.checkIfMobile();

    // Detectar cambios si rota pantalla
    this.platform.resize.subscribe(() => {
      this.checkIfMobile();
    });
  }
 checkIfMobile() {
    this.isMobile = this.platform.width() < 768;
  }
}
