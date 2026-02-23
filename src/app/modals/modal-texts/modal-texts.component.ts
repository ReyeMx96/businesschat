import { Component, HostListener, NgZone, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal-texts',
  templateUrl: './modal-texts.component.html',
  styleUrls: ['./modal-texts.component.scss'],
})
export class ModalTextsComponent  implements OnInit {
@ViewChild('twoinput', { static: false }) twoinput?: { setFocus: () => void };

  src:any
  type:any
  obj:any
  constructor(
    public navParams: NavParams,
    private zone : NgZone, 
    private modalController: ModalController) { }

  ngOnInit() {
    const modalState = {
      modal : true,
      desc : 'fake state for our modal'
    };
    history.pushState(modalState, "null");
    this.zone.run(() => {
      this.type = this.navParams.get('Type')
      this.obj = this.navParams.get('Obj')
    
      })

      var handle = setInterval(() => {
        this.zone.run(() => {

       
     this.twoinput!.setFocus();
   })

  clearInterval(handle);
 }, 500);


  }

  closeModal(){
    this.modalController.dismiss()
  }
  saveModal(){
 
    var arr = {Text:this.src,Obj:this.obj, Type:this.type}
    this.modalController.dismiss(arr)

  }
  @HostListener('window:popstate', ['$event'])
  dismissModal() {
    this.modalController.dismiss();
  }

}
