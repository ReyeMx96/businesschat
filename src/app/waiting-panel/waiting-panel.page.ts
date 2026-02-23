import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-waiting-panel',
  templateUrl: './waiting-panel.page.html',
  styleUrls: ['./waiting-panel.page.scss'],
})
export class WaitingPanelPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
openWhatsapp() {
  const phone = '+528334285513';
  const url = `https://wa.me/${phone.replace(/\D/g,'')}`;
  window.open(url, '_blank');
}

}
