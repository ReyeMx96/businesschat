import { Component, HostListener, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FechaService } from 'src/app/fecha.service';

@Component({
  selector: 'app-modal-date',
  templateUrl: './modal-date.component.html',
  styleUrls: ['./modal-date.component.scss'],
})
export class ModalDateComponent  implements OnInit {
 fechaTodaycache:any
  fechaToday:any
  constructor( private dateService: FechaService,private modalController: ModalController) {
    

  }

  closeModal(){
    this.modalController.dismiss()
   }  
   
   saveModal(){
    this.modalController.dismiss(this.fechaToday)

   }

   
   timePickerEvent(event:any){
    console.log(event)
    this.fechaToday = event.target.value.substring(0,10)
   }  
  ngOnInit() {  
    const modalState = {
      modal : true,
      desc : 'fake state for our modal'
    };
    history.pushState(modalState, "null");
    this.fechaTodaycache =  this.dateService.getDateMexico()
    this.fechaToday =    this.dateService.getDateMexico()
    console.log(this.fechaToday)
    console.log(this.fechaToday.substring(0,this.fechaToday.length ))

  }
  @HostListener('window:popstate', ['$event'])
  dismissModal() {
    this.modalController.dismiss();
  }
}
