import { Component, OnInit } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-popover-options-chat',
  templateUrl: './popover-options-chat.component.html',
  styleUrls: ['./popover-options-chat.component.scss'],
})
export class PopoverOptionsChatComponent  implements OnInit {

  umberAdmin:any
  uidtipster:any
  constructor(private toastController: ToastController,
     private popoverController : PopoverController) { }

  ngOnInit() {}
  async showToast(message:any){
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position:'middle',
      color:'danger',
      buttons: [
  
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
          
       toast.dismiss();
            }
        }
      ]
    });
    toast.present();
  }
  async onClickAction(action: string) {
    // Cierra el popover y pasa la acción seleccionada
    await this.popoverController.dismiss({ action });
  }
 
}
