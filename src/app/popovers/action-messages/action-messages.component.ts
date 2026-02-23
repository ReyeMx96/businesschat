import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-action-messages',
  templateUrl: './action-messages.component.html',
  styleUrls: ['./action-messages.component.scss'],
})
export class ActionMessagesComponent  implements OnInit {

  constructor(private popoverCtrl: PopoverController) { 
    
  }

  accion(tipo: string) {
    this.popoverCtrl.dismiss(tipo);
  }
  ngOnInit() {}

}
