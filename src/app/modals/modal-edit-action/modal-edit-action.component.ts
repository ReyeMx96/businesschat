import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-edit-action',
  templateUrl: './modal-edit-action.component.html',
  styleUrls: ['./modal-edit-action.component.scss'],
})
export class ModalEditActionComponent  implements OnInit {
  @Input() action: any;

  constructor(private modalCtrl: ModalController) {}
  ngOnInit(): void {
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  guardar() {
    this.modalCtrl.dismiss({
      actionEditada: this.action
    });
  }
}
