import { Component, HostListener, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-show-full-img',
  templateUrl: './show-full-img.component.html',
  styleUrls: ['./show-full-img.component.scss'],
})
export class ShowFullImgComponent  implements OnInit {
 imgUrl:any
  modal:any
  constructor(private navParams : NavParams,private modalController: ModalController) { }
  closeModal(){
    this.modalController.dismiss()
   }  
   
  ngOnInit() {
    const modalState = {
      modal : true,
      desc : 'fake state for our modal'
    };
    history.pushState(modalState, "null");
    this.imgUrl = this.navParams.get('Img')
  }
  @HostListener('window:popstate', ['$event'])
  dismissModal() {
    this.modalController.dismiss();
  }
}
