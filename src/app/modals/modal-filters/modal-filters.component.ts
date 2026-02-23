import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal-filters',
  templateUrl: './modal-filters.component.html',
  styleUrls: ['./modal-filters.component.scss'],
})
export class ModalFiltersComponent  implements OnInit {

  arrayVariables:any = []
  arrayVariablesDesc:any = []
  constructor(private zone: NgZone,public navParams: NavParams, private modalController: ModalController) { }
  selectedFilter(item:any){
    this.modalController.dismiss(item)
  }
  ngOnInit() {
    const modalState = {
      modal : true,
      desc : 'fake state for our modal'
    };
    history.pushState(modalState, "null");
    this.zone.run(() => {
   
      this.arrayVariables = this.navParams.get('Array')
      this.arrayVariablesDesc = this.navParams.get('ArrayDesc')
      //console.log(this.arrayVariablesDesc)
      for(var xi = 0; xi < this.arrayVariablesDesc.length;xi++){
        //console.log(this.arrayVariablesDesc[xi])
        for(var i = 0; i < this.arrayVariables.length;i++){
      
        if(this.arrayVariables[i]['Name'] === this.arrayVariablesDesc[xi]['Name']){
         this.arrayVariables[i]['Desc'] = this.arrayVariablesDesc[xi]['Desc'] 
          
            }
      }
     
    }
      console.log(this.arrayVariables)

    })
  }
  @HostListener('window:popstate', ['$event'])
  dismissModal() {
    this.modalController.dismiss();
  }
}

