import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { get, getDatabase, push, ref, serverTimestamp, set, update } from 'firebase/database';
import { ModalUsersComponent } from '../modals/modal-users/modal-users.component';
import { getDownloadURL, getStorage, uploadBytesResumable, ref as storageRef } from 'firebase/storage';

@Component({
  selector: 'app-marketing',
  templateUrl: './marketing.page.html',
  styleUrls: ['./marketing.page.scss'],
})
export class MarketingPage implements OnInit {

  arrayNumbers:any
  ph:any
  HeightDevice ="500"
  croppedImage:any = ""
  filepath:any
  textoSend = "¡Hola!"
  currentTmp = "img_text"
  uid:any
  imgCropBoolean = false
  slidesIMG:any
  loading: any
  actualTypeSend:any
  type:any
  imgSys:any
  modal : any
  imgSysKeyboard:any
  phoneNumberAdmin:any
  disableBtn = "key"
  mktName = ""
  AccWppId:any
    miArrayRecibido: any= []
  isSelected = false;

  arrayTemplates:any  = [{Tmp: "common"}, {Tmp: "img_text"}, {Tmp: "img_text_btn"}]
  arrayList : any = [

]
  phid:any
  nextId:any
  tkUser:any
  keyProduct:any
  constructor(private zone: NgZone,
    public loadingController: LoadingController,private router: Router,
    private modalController: ModalController,private toastController: ToastController,
    public alertController: AlertController,private http: HttpClient) {
  

   }
   ionViewWillEnter() {
  const db = getDatabase();
  // Genera nueva key bajo 'Users'
  push(ref(db, 'Users'), {})
    .then((snap) => {
      this.keyProduct = snap.key!;
    })
    .catch(err => {
      console.error('Error al generar key:', err);
    });

  const auth = getAuth();
  onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      this.uid = user.uid;
      console.log(this.uid)

      // Una sola lectura de UsersBusinessChat/<uid>
      get(ref(db, `UsersBusinessChat/${this.uid}`))
        .then(snap => {
          const res = snap.val() || {};
          console.log(res);

          const array: any[] = [];
          for (const i in res.Auth || {}) {
            array.push(res.Auth[i]);
          }
          this.arrayNumbers = array;
          this.ph = res.SelectedPh;
          this.phoneNumberAdmin = res.SelectedPh?.toString() || '';

          // Trigger UI update if needed
          document.getElementById('updateComponent')?.click();

          // Busca datos de PhId, Tk y AccWppId
          for (const entry of this.arrayNumbers) {
            if (entry.Ph === this.ph) {
              this.phid = entry.PhId;
              this.tkUser = entry.Tk;
              this.AccWppId = entry.AccWppId;
              break;
            }
          }
        })
        .catch(err => {
          console.error('Error leyendo UsersBusinessChat:', err);
        });
    }
    // Si no hay usuario, no hacemos nada
  });
}
 sendMsgWhatsApp(data: any) {
  this.http.post(
    'https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/sendWppFast',
    data
  ).subscribe(
    response => {
      console.log(response);

      const db = getDatabase();
      const path = `ruta/ListCmpg/${this.uid}/${this.keyProduct}`;

      update(ref(db, path), {
        Id: this.nextId,
        Name: this.mktName,
        Tst: serverTimestamp(),
        Tot: this.arrayList.length
      });

      this.router.navigate(
        ['/campaing-details/' + this.nextId],
        { replaceUrl: true }
      );
    },
    error => {
      console.error(error);
    }
  );
}
 sendMsgWhatsAppImgTextBtn(data: any) {
  this.http.post(
    'https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/sendImgBtnTxtmp',
    data
  ).subscribe(
    response => {
      console.log(response);
      const db = getDatabase();
      const path = `ruta/ListCmpg/${this.uid}/${this.keyProduct}`;
      update(ref(db, path), {
        Id: this.nextId,
        Name: this.mktName,
        Type: this.currentTmp,
        Tst: serverTimestamp(),
        Tot: this.arrayList.length
      });
    },
    error => {
      console.error(error);
    }
  );
}

sendMsgWhatsAppImgText(data: any) {
  this.http.post(
    'https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/sendImgTxtmp',
    data
  ).subscribe(
    response => {
      console.log(response);
      const db = getDatabase();
      const path = `ruta/ListCmpg/${this.uid}/${this.keyProduct}`;
      update(ref(db, path), {
        Id: this.nextId,
        Name: this.mktName,
        Tst: serverTimestamp(),
        Tot: this.arrayList.length
      });
    },
    error => {
      console.error(error);
    }
  );
}
  sendMsgsMkt(phone:any,text:any){
   
     /* this.afDB.database.ref('ruta/Cmpgs/').child(this.phoneNumberAdmin)
      .child(this.nextId).child(this.keyProduct)
      .update({
          to:phone,
          st:"Pending",
          tst:firebase.database.ServerValue.TIMESTAMP,
          
        })*/
        var dataClient = {
        }
        if(this.currentTmp === "common"){
           dataClient = {
            Text: text,
            Phone:phone,
            Tk:this.tkUser,
            PhBs:this.phid,
            Ph:this.ph,
            Mkt: this.nextId     
            }
          this.sendMsgWhatsApp(dataClient)

        }
        if(this.currentTmp === "img_text"){
           dataClient = {
            Text: text,
            Phone:phone,
            Tk:this.tkUser,
            PhBs:this.phid,
            Ph:this.ph,
            Mkt: this.nextId,
            Tmp: this.currentTmp,
            Img: localStorage.getItem('imgnow')
            }
          this.sendMsgWhatsAppImgText(dataClient)

        }
        if(this.currentTmp === "img_text_btn"){
          dataClient = {
           Text: text,
           Phone:phone,
           Tk:this.tkUser,
           PhBs:this.phid,
           Ph:this.ph,
           Func:"init",
           Mkt: this.nextId,
           Tmp: this.currentTmp,
           Img: localStorage.getItem('imgnow')
           }
         this.sendMsgWhatsAppImgTextBtn(dataClient)

       }
  }

 async newKeyCmpg() {
  const db = getDatabase();
  const pedidosRef = ref(db, 'KeyGenCpmg');

  try {
    const snapshot = await get(pedidosRef);
   const numPedidos = snapshot.size;

    const randomLetterIndex = Math.floor(Math.random() * 26);
    const randomLetter  = String.fromCharCode(65 + randomLetterIndex);
    const randomLetter2 = String.fromCharCode(65 + randomLetterIndex);
    const nextId = randomLetter + randomLetter2 + (numPedidos + 1);

    this.nextId = nextId;

    const objt = { Sp: "st" };
    const newRef = ref(db, `KeyGenCpmg/${nextId}`);
    await set(newRef, objt);

    console.log('Pedido guardado exitosamente con el N° de rastreo: #', nextId);
    return nextId;
  } catch (error) {
    console.error('Error al guardar el pedido:', error);
    return false
  }
}

  showUsersModal(){

  }
  
  hideChatFeatures(type:any){
    this.filepath = localStorage.getItem('img64name')
    this.actualTypeSend = type
    this.imgSys = false
    this.imgSysKeyboard = true
    this.uploadImg()

  }

  async  loadingUser(){
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Cargando datos.. Porfavor espere...',
    });
    await this.loading.present();
  }

 
async uploadImg() {
  this.loadingUser();
  this.type = 'text';

  const element = document.getElementById('imagenProfile2') as HTMLImageElement;
  if (!element) return;

  const outerHTML = element.outerHTML;
  const resultmatch = outerHTML.match(/src="(.*?)"/);

  const db = getDatabase();
  const storage = getStorage();
  const auth = getAuth();

  // Crear nueva clave en 'Users'
  push(ref(db, 'Users'), {})
    .then((snap) => {
      const key = snap.key;
      if (key) {
        localStorage.setItem('KeyProductDynamicLink', key);
        this.keyProduct = key;
      }
    })
    .catch((err) => {
      console.error('Error pushing to Users:', err);
    });
    console.log(resultmatch)
  if (!resultmatch || resultmatch[1].length <= 150 || !resultmatch[1].startsWith('data:image/')) {
    const handle = setInterval(() => {
      this.loading.dismiss();
      this.showToast('Debes seleccionar una imagen primero');
      clearInterval(handle);
    }, 2000);
    return;
  }

  const base64Url = resultmatch[1];
  const base64Data = base64Url.split(',')[1];

  // Convertir base64 a Blob
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/png' });
  const file = new File([blob], 'selectimg.png', { type: 'image/png' });

  // Subir archivo a Firebase Storage
  const fileName = localStorage.getItem('img64name') || 'default.png';
  const uid = localStorage.getItem('UID') || 'unknown';
  const filePath = `/${uid}/${Math.random().toString(36).substring(2)}_${fileName}`;
  localStorage.setItem('filePath', filePath);

  const fileRef = storageRef(storage, filePath);
  const uploadTask = uploadBytesResumable(fileRef, file);

  uploadTask.on('state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log(`Upload is ${progress}% done`);
    },
    (error) => {
      console.error('Upload failed:', error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        localStorage.setItem('imgnow', downloadURL);
        document.getElementById('btnUpload2')?.click();
      });
    }
  );
  setTimeout(() => {
  this.loading.dismiss()
    
  }, 3000);

}

     dismissModal(){
      this.loadingController.dismiss()
     }
     quitar()
{
  this.arrayList = []
}


ngOnInit() {
   const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['miArray']) {
      this.miArrayRecibido = nav.extras.state['miArray'];
      console.log(this.miArrayRecibido);
      for(var i = 0 ; i < this.miArrayRecibido.length; i++){
        this.miArrayRecibido[i][0]['Numb'] = this.miArrayRecibido[i][0]['Numb']
        this.miArrayRecibido[i][0]['Name'] = this.miArrayRecibido[i][0]['name']
        this.arrayList.push(this.miArrayRecibido[i][0])

      }
      console.log(this.arrayList)
    }else{  
      console.log("no recibido")

   this.miArrayRecibido = []

    }
    console.log("367")

   this.newKeyCmpg()
      
   

    var dataClient = {
      Tk:this.tkUser,
      AccWppId:this.AccWppId
  
      }
 //this.getTemplates(dataClient)
  }

  setTmp(item:any,i:any){
    this.currentTmp = item.Tmp
    this.showToast('Se seleccionó:' + this.currentTmp)
    
    setTimeout(() => {

      this.zone.run(() =>{
    this.arrayTemplates[i]['isSelected'] = true
      })
    }, 1000);
  }
  doit(){
    
    document.getElementById("upload2")!.click();
  } 
  resetArray(){
    this.slidesIMG = []
  }
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
  async usersComponent(){
    this.modal = await this.modalController.create({
      component: ModalUsersComponent,
      cssClass: 'modal-add',
      canDismiss:true,
      backdropDismiss:true,
       initialBreakpoint:1,
        breakpoints:[0, 0.25, 1, 0.1],
    });
    await this.modal.present();
    await this.modal.onDidDismiss().then((e:any)=>{

      if(e.data === undefined){

      }else{
        console.log(e.data)
        console.log(e.data.length)
        //alert(JSON.stringify(e.data))
        for(var i = 0 ; i < e.data.length;i++){
          this.arrayList.push({ Numb:e.data[i].Num, Name:e.data[i].Name });
    
        }
        this.arrayList = this.removeDuplicates(this.arrayList);
        console.log(this.arrayList)
  
      }
   
   })
 
  }
 removeDuplicates(array: any[]) {
  const seen: { [key: string]: boolean } = {};
  return array.filter((item: any) => {
    return seen.hasOwnProperty(item.Numb) ? false : (seen[item.Numb] = true);
  });
}

deleteItem(index: number) {
  this.arrayList.splice(index, 1);
}


  sendMsgs(){
    if(this.arrayList.length > 100){
      this.showToast('No puedes enviar a mas de 100 contactos.')
      return
    }

    if(this.currentTmp === ""){
      this.showToast('Agrega el tipo de plantilla.')
      return
    }
    if(this.mktName === ""){
      this.showToast('Agrega el nombre de la campaña.')
      return
    }
    if(this.arrayList.length === 0){
      this.showToast('No hay numeros agregados')
      return
    }
    this.disableBtn = "Sin ubicacion"
    this.loadingUser()
    
    for(var i = 0; i < this.arrayList.length;i++){
      alert("Enviando mensaje a: " + this.arrayList[i]['Numb'])
      this.sendMsgsMkt(this.arrayList[i]['Numb'],this.textoSend)
    }

    setTimeout(() => {
      this.loadingController.dismiss()

      this.router.navigate(['/campaing-details/' + this.nextId ],{ replaceUrl: true });

    }, 7000);
    this.showToast('Se enviaron los mensajes a todos los contactos agregados')

  }

  getTemplates(dataClient:any){
 
    this.http.post(
      'https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/getTemplatesList', dataClient)
    .subscribe(response => {
      console.log(response)
   

    }, error => {
      console.error(error);
    });
  }

  async addPhoneNumber() {
    const alert = await this.alertController.create({
      header: 'Agregar número de teléfono',
      inputs: [
        {
          name: 'phoneNumber',
          type: 'tel',
          placeholder: 'Ingrese el número de teléfono'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: (data) => {
            const phoneNumber = data.phoneNumber.trim();
            if (phoneNumber !== '') {
              this.arrayList.push({ Numb: "521" + phoneNumber });
            }
          }
        }
      ]
    });

    await alert.present();
  }
  imgUploaded() {
  this.showToast('Imagen cargada correctamente');
}

  onFileSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e: any) => {
    this.croppedImage = e.target.result;

    // Guardamos base64 en la imagen oculta
    const img = document.getElementById('imagenProfile2') as HTMLImageElement;
    img.src = this.croppedImage;
    console.log("croped")
  this.uploadImg()

  };
  
  reader.readAsDataURL(file);
}

}
