import { Component, HostListener, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-modal-add',
  templateUrl: './modal-add.component.html',
  styleUrls: ['./modal-add.component.scss'],
})
export class ModalAddComponent  implements OnInit {

  tipoRespuesta = ""
  cmd = ""
  arrayNew = 
    {
    Txt:'¿?',
    Type:'', 
    
    Cmd:'',
    TypeAns:'SHOP',
    Src:'',
    BodyAns:'',
    Status:'PENDIENTE',
     icon:'arrow-forward-circle'
  }

  constructor(private toastController: ToastController,private modalController: ModalController) { 


  }

  ngOnInit() {
    const modalState = {
      modal : true,
      desc : 'fake state for our modal'
    };
    history.pushState(modalState, "null");
  }

closeModal(){
  this.modalController.dismiss('null')

}
  saveModal(){

    if(this.tipoRespuesta === undefined || this.cmd === undefined){
     this.modalController.dismiss('null')

    }else{
      if(this.tipoRespuesta === 'PROCESS'){
        this.arrayNew['Type'] = 'Proceso'
        this.arrayNew['Cmd'] = this.cmd
        
        this.arrayNew['TypeAns'] = this.tipoRespuesta
        this.modalController.dismiss(this.arrayNew)
  
      }else{
        this.arrayNew['Type'] = 'Pregunta'
        this.arrayNew['Cmd'] = this.cmd
  
        this.arrayNew['TypeAns'] = this.tipoRespuesta
        this.modalController.dismiss(this.arrayNew)
  
      }
    }

  
  }

  createRule(){

  }
  async showToast(){

    var message = 'Esta función te permite crear una secuencia de conversación. El cliente responde a los datos que se le solicitan hasta finalizar el proceso. Esta función es recomendable para guiar al cliente para realizar ventas o cualquier otro proceso de tu negocio.'
    const toast = await this.toastController.create({
      message,
      duration: 15000,
      position:'middle',
      color:'success',
      buttons: [
  
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
        //this.router.navigate(['/login'],{ replaceUrl: true });
         toast.dismiss();
            }
        }
      ]
    });
    toast.present();
  }
  async showToastSencilla(){

    var message = 'Esta función te permite crear una pregunta y asignar una respuesta con recursos de varios tipos como imagenes, textos, documentos etc.. etc. La pregunta se agregará al menu de opciones'
    const toast = await this.toastController.create({
      message,
      duration: 15000,
      position:'middle',
      color:'success',
      buttons: [
  
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
        //this.router.navigate(['/login'],{ replaceUrl: true });
         toast.dismiss();
            }
        }
      ]
    });
    toast.present();
  }
  async showToastEtiqueta(){

    var message = 'Es la etiqueta fija para referenciar la respuesta. Cuando el usuario escriba la misma palabra que la etiqueta fija el chatbot enviará el mensaje correspondiente. Por ejemplo: si escribes la palabra menu, el chatbot responderá con el menu de opciones. Las etiquetas fijas no pueden ser iguales a las etiquetas fijas de otras de opciones del menu existente.'
    const toast = await this.toastController.create({
      message,
      duration: 15000,
      position:'middle',
      color:'success',
      buttons: [
  
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
        //this.router.navigate(['/login'],{ replaceUrl: true });
         toast.dismiss();
            }
        }
      ]
    });
    toast.present();
  }

  @HostListener('window:popstate', ['$event'])
  dismissModal() {
    this.modalController.dismiss();
  }

  
}

