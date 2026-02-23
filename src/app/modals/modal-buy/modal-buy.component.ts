import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal-buy',
  templateUrl: './modal-buy.component.html',
  styleUrls: ['./modal-buy.component.scss'],
})
export class ModalBuyComponent implements OnInit {

  constructor(private navParams: NavParams,private router: Router, private modalCtrl: ModalController) {}
restaurant:any
url:any
  ngOnInit() {
      this.restaurant = this.navParams.get('restaurant');
      this.url = this.navParams.get('url');
    // Redirección automática después de 2.5s
    setTimeout(() => {
      this.router.navigate(['/buy-finish/'+ this.restaurant]);
      this.modalCtrl.dismiss()
    }, 2500);
  }

  // Detectar clics
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
      this.modalCtrl.dismiss()

    this.router.navigate(['/buy-finish' + this.restaurant]);

  }

  // Detectar teclas
  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
      this.modalCtrl.dismiss()

    this.router.navigate(['/buy-finish' + this.restaurant]);
  }

  // Detectar botón "atrás" del navegador/dispositivo
  @HostListener('window:popstate', ['$event'])
  onPopState(event: Event) {
      this.modalCtrl.dismiss()

    this.router.navigate(['/buy-finish' + this.restaurant]);
  }
}
