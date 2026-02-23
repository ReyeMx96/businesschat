import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modalimg',
  templateUrl: './modalimg.component.html',
  styleUrls: ['./modalimg.component.scss'],
})
export class ModalimgComponent  implements OnInit {
img = ""
  constructor(private navParams: NavParams, private modalController : ModalController) { }

  ngOnInit() {
    this.img = this.navParams.get('img')
  }
  closeModal(){
    this.modalController.dismiss()
  }
}
