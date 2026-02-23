import { Component, OnInit, ViewChild, NgZone, HostListener, ElementRef } from '@angular/core';
import { IonContent, MenuController, LoadingController, ActionSheetController, ToastController, ModalController, Platform, AlertController, PopoverController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import 'firebase/storage';

import * as firebase from 'firebase/app';
import { ModalDateComponent } from 'src/app/modals/modal-date/modal-date.component';
import { SearchModalComponent } from 'src/app/modals/search-modal/search-modal.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import 'firebase/storage';
import {
  ImageCroppedEvent,
  ImageCropperComponent,
  
} from 'ngx-image-cropper';
import { PopoverOptionsChatComponent } from 'src/app/popovers/popover-options-chat/popover-options-chat.component';
import { FechaService } from 'src/app/fecha.service';
import { ModalTagsComponent } from 'src/app/modals/modal-tags/modal-tags.component';
import { ModalMenuCreateComponent } from 'src/app/modals/modal-menu-create/modal-menu-create.component';
import { ModalCartComponent } from 'src/app/modals/modal-cart/modal-cart.component';
import { ModalChooseComponent } from 'src/app/modals/modal-choose/modal-choose.component';
import { ModalTextsComponent } from 'src/app/modals/modal-texts/modal-texts.component';
import { ModalFinalizarComponent } from 'src/app/modals/modal-finalizar/modal-finalizar.component';
import { ModalProfileComponent } from 'src/app/modals/modal-profile/modal-profile.component';
import { getDownloadURL, ref as storageRef, getStorage, TaskEvent, uploadBytesResumable } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { get, getDatabase, ref as dbRef, onValue, push, ref, update } from '@angular/fire/database';


@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.page.html',
  styleUrls: ['./chatbot.page.scss'],
})
export class ChatbotPage implements OnInit {
    @ViewChild('cropper') cropper!: ImageCropperComponent;
  @ViewChild('inputFacebook', { static: false }) ionInput!: { setFocus: () => void };
  @ViewChild("content", { read: IonContent, static: false }) myContent!: IonContent;
  @ViewChild('myInput', { static: false }) myInput!: ElementRef;

  loading: any;
  img = 'https://www.pngkey.com/png/detail/115-1150152_default-profile-picture-avatar-png-green.png';
  NameEmpresa = 'Natural 100';
  bodytxt :any = '';
  src = '';
  filepath:any;
  fnc = '';
  payMeth = '';
  cuantoPaga = 0;
  menuLength = 0;
  tag: string | undefined;

  srcSendImg:any
  conversationCache: any[] = [];
  action = '';
  typeFunc = '';
  todo: string[] = ['Tarea 1', 'Tarea 2', 'Tarea 3'];
  ph: any;
  arrayFastAns: any[] = [];
  done: string[] = ['Tarea completada 1', 'Tarea completada 2'];
  imgcache = true;
  processEnable = false;
  tkUser: any;
  arrayProcess: any[] = [];
  costoEnvio: any;
  notaGral = '';
  suc: any;
  matchSelected = '';
  showLoading = false;
  imgSysKeyboard = false;
  imgCropBoolean = false;
  bodySystem = '';
  uidBusiness: any;
  ubicacion: any;
  ind: any;
  imgSys = true;
  descImg = '';
  answerFast = false;
  keyProduct: any;
  utter: any;
  croppedImage: any = '';
  uploadedImg = false;
  sizeInput = "8.7";
  estadisticasLocal: any[] = [];
  tipsterCalif: any;
  isMobileResolution = true
  tipsterTypeBet: any;
  tipsterTeams: any;
  tipsterLastMatchs = 0;
  URLDOCUMENT: any;
  utter2: any;
  tipsterSport: any;
  arraySlider: any[] = [];
  isFeatureEnabled = false;
  tipsterStyle: any;
  teams: any[] = [];
  phoneNumberAdmin = "5218334285513";
  modal: any;
  tipsterMarket: any;
  stepsBot: any[] = [];
  phid: any;
  Lat: number | undefined;
  Lng: number | undefined;

  countAdd = 0;
  audioTrue = false;
  NameReceptor: string | undefined;
  precio = 0;

  stepsAns = [
    [{ Ans: 'Hola' }, { Ans: 'Necesito ayuda' }],
    [{ Ans: 'Si, me interesa' }, { Ans: 'No gracias,en otra ocasión' }],
    [{ Ans: '' }, { Ans: '' }],
    [{ Ans: '' }, { Ans: 'Rechazar Pick' }],
    [{ Ans: 'Si, me interesa' }, { Ans: '¡Si Vamos a darle!' }],
    [{ Ans: 'Si, me interesa' }, { Ans: '¡Si Vamos a darle!' }],
    [{ Ans: 'Si, me interesa' }, { Ans: '¡Si Vamos a darle!' }]
  ];

  currentLoading = 0;
  pickFinal: any;
  tipsterImg: any;
  Ind = '';
  arrayCartWpp: any[] = [];
  fechaActual: any;
  processbolean: boolean | undefined;
  digitalist = false;
  activeMedia = true;
 
  tipsterTypeBetCount: any;
  ImgReceptor: any;
  receiverData: any;
  senderData: any[] = [];
  slidesIMG: any;
  processStepCount = 0;
  hora: any;
  dbase = getDatabase()
  uid: any;
  typePublicacion: string | undefined;
  stepsTypeMsg: any[] = [];
  arraypartidosSelect: any[] = [];
  key: any;
  arrayPartidosHoy: any[] = [];
  arrayNumbers: any[] = [];
  scrollDepthTriggered = false;
  step = 0;
  fecha: any;
  percentaje: any;
  typeStep = '';
  ubicacionSt = "No location";
  typePublish = '';
  actualTypeSend: any;
  uidtipster = '';
  localAproved = false;
  menuPromociones: any[] = [];
  visitaAproved = false;
  discountActive = false;
  conversations: any[] = [];
  minutes = 0;
  seconds = 0;
  zerosystem = '0';
  Descripcion = '';
  answs = [
    { Ans: "¡Hola! Digame su pedido porfavor" },
    { Ans: "Siga los pasos del bot para obtener un descuento en cada uno de sus productos" },
    { Ans: "¡Tenemos promociones!" },
    { Ans: "¡Gracias por su compra!" },
    { Ans: "¡Gracias por su compra!" },
    { Ans: "¡Gracias por su compra!" },
  ];
  Nombre = '';
  showingAns = true;
  bodysys: any;
  handle: any;
  estadisticasVisita: any[] = [];
  statusIntervention = false;
  ligaTipster = '';
  Nothing = true;
  metrycs: any[] = [];
  stepsIA = [
    {
      Step: 0,
      Message: 'Hola, mi nombre es Jorge Garcia y soy un tipster bot profesional, mi especialidad son los picks en la Liga: Brazil Serie A y el mercado que manejo es el de Corners, entonces ¿te gustaria obtener algun pick sobre algun partido?.',
      Answers: ['Si, porfavor.', 'No, gracias']
    },
    {}
  ];
  data: any[] = [];
  tipster: any;
  year: any;
  fechaPartidos: any;
  Img = '';
  widthDevice = 0;
  HeightDevice = 0;
  teamsNBA: any;
  teamsNFL: any;

  menuOptions: any = [];

  keytemporal: any;
  arrayUtils: any[] = [];
  HeightDeviceCrop = 0;
  audioPreference = false;
  sendMenuMsg = false;
  funcstions = [
    {
      Name: 'Mostrar redes sociales',
      Cmd: '/redes-sociales',
      Type: 'SOCIAL',
      Txt: '¡Siguenos en nustras redes sociales!',
      Tags: [{ Tg: 'redes' }, { Tg: 'redes sociales' }],
      Twitter: 'https://twitter.com',
      Facebook: 'https://facebook.com',
      Tiktok: 'https://tiktok.com',
      Instagram: 'https://instagram.com',
      Youtube: 'https://youtube.com'
    },
    {
      Name: 'nis productos',
      Cmd: '/productos',
      Type: 'SOCIAL',
      Txt: '¡Siguenos en nustras redes sociales!',
      Tags: [{ Tg: 'redes' }, { Tg: 'redes sociales' }],
      Twitter: 'https://twitter.com',
      Facebook: 'https://facebook.com',
      Tiktok: 'https://tiktok.com',
      Instagram: 'https://instagram.com',
      Youtube: 'https://youtube.com'
    }
  ];

  countHourDeleteSystem = 0;
  type = 'text';
  firstTime = true;
  responseai: any;
  mapUrl: any;
  constructor(private router: Router, private dateService : FechaService,
    private popoverController: PopoverController,private http: HttpClient,private platform : Platform,
    private route: ActivatedRoute,private menu: MenuController,public loadingController: LoadingController,private zone: NgZone,private toastController: ToastController,
     private modalController: ModalController,public alertController: AlertController,
    private actionSheetController: ActionSheetController,
    ) {
      //this.afDB.database.ref('Sports').remove()
      const date = new Date();
    
      platform.ready().then(() => {


        this.widthDevice = platform.width()
      
        if (platform.height() >750){
          this.HeightDevice = platform.height() - 400
          this.HeightDeviceCrop = platform.height() - 450
        } else{
          this.HeightDevice = platform.height() - 200
          this.HeightDeviceCrop = platform.height() - 250
        }

          
        console.log('Width: ' + platform.width());
        console.log('Height: ' + platform.height());
      });


      

      this.countHourDeleteSystem = +date.getHours().toString().replace(':','')*100-300;


      this.year =  date.getUTCFullYear().toString()[2]+date.getUTCFullYear().toString()[3];
      //console.log(this.year)
      const month = date.toLocaleString('en-US', { month: 'short' });
      const dateNum = date.getDate().toString().padStart(2, '0');
      const prettyDate = `${month} ${dateNum}`;
      //console.log(prettyDate.replace('Oct ','10/'));
      this.fechaPartidos  = prettyDate.replace('Feb ','02/').replace('/','-');
      const fecha2  = prettyDate.replace('Nov ','11/');

    this.fechaPartidos = this.fechaPartidos.replace('/','-');



   }
   attach(){

   }
   openImg(url:any){
    localStorage.setItem('url',url)
    this.router.navigate(['/show-img/'+this.uidtipster]);
   }
   async mostrarPopover(ev: any) {
    const modalState = {
      modal : true,
      desc : 'fake state for our modal'
    };
    history.pushState(modalState, "null");
    const popover = await this.popoverController.create({
      component: PopoverOptionsChatComponent,
      event: ev,
      translucent: true // opcional, dependiendo de tus necesidades
    });
    popover.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        // Aquí obtienes la acción tomada en el popover
        console.log("Acción tomada:", dataReturned.data.action);
        
        if(dataReturned.data.action === "CreatePedido"){
          this.crearPedido()
        }
        if(dataReturned.data.action === "Intervenir"){
          this.intervenir()
        }
        if(dataReturned.data.action === "Attach"){
          this.doitpdf()
        }
        if(dataReturned.data.action === "AttachImg"){
          this.doit()
        }
        if(dataReturned.data.action === "ImgMenu"){
          this.sendImgMenu()
      
          return
          this.srcSendImg = "https://firebasestorage.googleapis.com/v0/b/michelotesmx.appspot.com/o/WhatsApp%20Image%202024-05-11%20at%2018.47.17.jpeg?alt=media&token=76240c99-694b-425e-acd4-1927decd1ac5"
    
          var dataClient = {
            Url: this.srcSendImg,
            Phone:this.uidtipster,
            Tk:this.tkUser,
            PhBs:this.phid,
            Ph:this.ph,
            Text: this.descImg
          
            }

          this.sendImgWhatsApp(dataClient)
          this.showToast("Se envió correctamente")
          this.conversations.push({type:"image", interactive:{body:{text:this.srcSendImg}}})
          this.ScrollToBottom()
        }
        if(dataReturned.data.action === "RefBank"){
          // var msg1 = "Michel Alberto Ochoa Santos - BBVA BANCOMER"
          // var msg2 = "4152313953571150"     
           var msg1 = "Estrella Ruiz Gómez - Banorte"
           var msg2 = "5264246816524648"
   

      
            var audio = new Audio('../../../assets/icon/Dew-drops-original.mp3');
            audio.loop = false;
            audio.play();
            this.conversations.push({type:"text", interactive:{body:{text:msg2}}})
            this.conversations.push({type:"text", interactive:{body:{text:msg1}}})
            this.ScrollToBottom()
            var dataClient7 = {
              Text: msg1,
              Phone:this.uidtipster,
              Tk:this.tkUser,
              PhBs:this.phid,
              Ph:this.ph
          
              }
              var dataClient8 = {
                Text: msg2,
                Phone:this.uidtipster,
                Tk:this.tkUser,
                PhBs:this.phid,
                Ph:this.ph
            
                }
              this.bodytxt = ''
              this.sendMsgWhatsApp(dataClient7)
              this.sendMsgWhatsApp(dataClient8)
              this.ScrollToBottom()
          
        }
      }
    });
  
    return await popover.present();
  }
  


  signal(signal:any){

  }
  sendImgMenu(){
    //this.sendImgMenu()
  

      this.srcSendImg = "https://firebasestorage.googleapis.com/v0/b/michelotesmx.appspot.com/o/WhatsApp%20Image%202024-05-11%20at%2018.47.17.jpeg?alt=media&token=76240c99-694b-425e-acd4-1927decd1ac5"

      var dataClient = {
        Url: this.srcSendImg,
        Phone:this.uidtipster,
        Tk:this.tkUser,
        PhBs:this.phid,
        Ph:this.ph,
        Text: this.descImg
      
        }

      this.sendImgWhatsApp(dataClient)
      this.showToast("Se envió correctamente")
      this.conversations.push({type:"image", interactive:{body:{text:this.srcSendImg}}})
      this.ScrollToBottom()
    
  }
 getFastAns() {
  const db = this.dbase;
  const fastAnsRef = ref(db, `ruta/${this.phoneNumberAdmin}/FastAns`);

  get(fastAnsRef)
    .then(snapshot => {
      const res = snapshot.val();
      const array = [];
      for (const i in res) {
        array.push(res[i]);
      }
      if (res === null) {
        // this.showToast('we are null')
      } else {
        // this.showToast('we get information')
      }
      this.arrayFastAns = array;
      console.log(this.arrayFastAns);
    })
    .catch(err => {
      console.log(err);
      // this.onFailAlert('Error', err)
    });
}
  setDiagonal(){
    this.showingAns = false
    this.bodytxt = "/"
  }
  
  toggleFeature() {
    console.log('Feature enabled:', this.isFeatureEnabled);
    this.getMenu()

  }

getMenu() {
  const db = this.dbase; // Modular
  const menuRef = ref(db, `ruta/${this.phoneNumberAdmin}/Menu`);

  get(menuRef)
    .then(snapshot => {
      const res = snapshot.val();
      const array = [];

      for (const i in res) {
        array.push(res[i]);
      }

      if (res === null) {
        // this.showToast('we are null');
      } else {
        // this.showToast('we get information');
      }

      this.menuPromociones = array;
      this.menuLength = this.menuPromociones.length;

      for (let i = 0; i < this.menuPromociones.length; i++) {
        this.arraySlider.push(this.menuPromociones[i]);

        const item = this.menuPromociones[i];

        if (item['Sabores'] === true) {
          if (item['SaborList'] !== null) {
            if (+item['SaborList'][0]['Precio'] > 0) {
              item['Precio'] = +item['SaborList'][0]['Precio'];

              if (!this.isFeatureEnabled) {
                item['Disc'] = 0;
              }

              if (+item['Disc'] > 0) {
                item['DescFinal'] = item['Precio'] - (item['Precio'] / 100 * +item['Disc']);
              } else {
                item['DescFinal'] = item['Precio'];
              }
            } else if (item['Tamaño'] === true) {
              item['Precio'] = +item['TamañoList'][0]['Precio'];
              item['DescFinal'] = item['Precio'];
            }
          }
        }

        if (item['Tamaño'] === true) {
          if (!this.isFeatureEnabled) {
            item['Disc'] = 0;
          }

          item['Precio'] = +item['TamañoList'][0]['Precio'];

          if (+item['Disc'] > 0) {
            item['DescFinal'] = item['Precio'] - (item['Precio'] / 100 * +item['Disc']);
          } else {
            item['DescFinal'] = item['Precio'];
          }
        }

        if (item['Tamaño'] === false && item['Sabores'] === false) {
          if (!this.isFeatureEnabled) {
            item['Disc'] = 0;
          }

          item['Precio'] = +item['Precio'];

          if (+item['Disc'] > 0) {
            item['DescFinal'] = item['Precio'] - (item['Precio'] / 100 * +item['Disc']);
          } else {
            item['DescFinal'] = item['Precio'] - (item['Precio'] / 100 * +item['Disc']);
          }
        }
      }

      console.log(this.menuPromociones);
    })
    .catch(err => {
      console.error(err);
      // this.onFailAlert('Error', err);
    });
}

  async crearPedido(){
    
    this.showingAns = false
    this.digitalist = true
  

  }

  getDetailsItem(item:any){
    console.log(item)
    this.addToppings(item)
  }
 
  async addToppings(item:any){
  
    this.modal = await this.modalController.create({
     component: ModalChooseComponent,
     cssClass: 'sevenyfive-medium',
     canDismiss:true,
     backdropDismiss:true,

     componentProps: {
      Item: item,
      discounts:this.isFeatureEnabled,
      Uid: this.uid,
      Admin: this.phoneNumberAdmin,
      TypeCart: this.uidtipster
      },


   
   
   });
   await this.modal.present();


   await this.modal.onDidDismiss().then((e:any)=>{

   // this.arrayPartidosHoy = []
    //this.getPartidos()

    
  })

 




  
}
setFastAnswer(ans:any){
  this.bodytxt = ans
this.answerFast=false

}
detectInput(event:any){
  //alert(event.target.value)
  if(event.target.value === ""){
    this.sizeInput = "7.4"
this.answerFast=false
this.showingAns = true

  }else{
    this.sizeInput = "8.9"

  }
  if(event.target.value === "/"){
//    alert("initializing animation")
this.answerFast=true
  }
}
async finalizarPedido(){
  this.arrayUtils = [ ]
  if(this.payMeth === "Transferencia"){

  }else{
    if(this.cuantoPaga === 0 || this.cuantoPaga < this.precio){
      this.showToast('Ingresa la cantidad correcta con la que paga el cliente')
      return
    }
  }

  this.modal = await this.modalController.create({
    component: ModalFinalizarComponent,
    cssClass: 'modal-add',
    canDismiss:true,
    backdropDismiss:true,
     initialBreakpoint:1,
      breakpoints:[0, 0.25, 1, 0.1],
     componentProps: {
       type: this.uidtipster,
       admin: this.phoneNumberAdmin,
        suc: this.suc,
        token: this.tkUser,
        phonenumberid: this.phid,
        costoEnvio: this.costoEnvio,
        notageneral: this.Ind,
        metodoPago: this.payMeth,
        cuantopaga: this.cuantoPaga

   }
  
  });
  await this.modal.present();


  await this.modal.onDidDismiss().then((e:any)=>{
    console.log(e.data)
    if(e.data === "finished"){
      this.digitalist = false

    }else{
      this.digitalist = true

    }


   // this.sendMessage(e.data['Cmd'],e.data['TypeAns'],e.data['Src'],e.data['Pro'])

   
 })
}
setPayMeth(data:any){
  this.payMeth = data
}
hideCreatePedido(){
  this.showingAns = true
  this.digitalist = false
}
  async showCartModal(){
    this.modal = await this.modalController.create({
      component: ModalCartComponent,
      cssClass: 'modal-add',
      canDismiss:true,
      backdropDismiss:true,
       initialBreakpoint:1,
        breakpoints:[0, 0.25, 1, 0.1],
       componentProps: {
         type: this.uidtipster,
         admin: this.phoneNumberAdmin
    
     }
    
    });
    await this.modal.present();
 
 
    await this.modal.onDidDismiss().then((e:any)=>{
      console.log(e.data)
      this.digitalist = true

     // this.sendMessage(e.data['Cmd'],e.data['TypeAns'],e.data['Src'],e.data['Pro'])
 
     
   })
 
  }
  setCuantoPaga(index:any){
    if(index === "Exacto" ){
      this.cuantoPaga = this.precio + this.costoEnvio

    }else{
      this.cuantoPaga = index 

    }
  }
  onPress(event:any,text:any){
    this.showToast('Mensaje copiado correctamente')
    //this.copyMessage(text.interactive.body.text)
    this.shareGral(text.interactive.body.text)
  }
  copyMessage(url:any){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    //this.router.navigate(['/bonos'],{ replaceUrl: true });
  }
  onItemPress(event: Event, message: any) {
    console.log(event)
  }
//obtiene data asyncrona
setArray(key: string, array: any[]): void {
  const jsonString = JSON.stringify(array);
  localStorage.setItem(key, jsonString);
}
getArray(key: string): any[] {
  const jsonString = localStorage.getItem(key);
  return jsonString ? JSON.parse(jsonString) : [];
}
  getdata(uid: any, uid2: any) {
  const db = this.dbase;  // Modular API
  const path = `ruta/${this.phoneNumberAdmin}/${this.uidtipster}`;
  const dataRef = ref(db, path);

  onValue(dataRef, snapshot => {
    const res = snapshot.val();
    const array: any[] = [];

    if (!res) return;

    this.zone.run(() => {
      for (const key in res) {
        array.push(res[key]);
      }

      this.conversationCache = array;

      if (this.firstTime === true) {
        if (localStorage.getItem('myArrayKey' + this.uidtipster) === null) {
          // handle initial load if needed
        }
      } else {
        this.audioTrue = true;
        const lastMsg = this.conversationCache[this.conversationCache.length - 1];
        if (lastMsg?.to === this.phoneNumberAdmin && (lastMsg.st === undefined || lastMsg.st === null)) {
          const audio = new Audio('../../../assets/icon/Popcorn-iPhone.mp3');
          audio.loop = false;
          audio.play();
          this.audioTrue = false;
        }
      }

      this.firstTime = false;

      // Date Formatting Logic
      for (let i = 0; i < this.conversationCache.length; i++) {
        const timestampServidor = this.conversationCache[i]['tst'];
        const fechaServidor = new Date(timestampServidor);
        const diferenciaTiempo = Date.now() - fechaServidor.getTime();
        const fechaCliente = new Date(Date.now() - diferenciaTiempo);
        const fechaFormateada = `${fechaCliente.getFullYear()}/${
          ('0' + (fechaCliente.getMonth() + 1)).slice(-2)}/${
          ('0' + fechaCliente.getDate()).slice(-2)} ${
          ('0' + fechaCliente.getHours()).slice(-2)}:${
          ('0' + fechaCliente.getMinutes()).slice(-2)}`;

        const partes = fechaFormateada.split(" ");
        this.conversationCache[i]['tstcache'] = timestampServidor;
        this.conversationCache[i]['fecha'] = partes[0].replace(/\//g, "-");
        this.conversationCache[i]['tst'] = partes[1];
      }

      this.conversations = [];
      this.metrycs = [];

      this.conversationCache = this.conversationCache.reverse();

      let totalShowCache = 10;
      let totalMetric = 0;

      for (let i = 0; i < this.conversationCache.length; i++) {
        totalMetric += this.conversationCache[i]['interactive']?.['body']?.['text']?.length || 0;

        if (i === 5) {
          if (totalMetric > 2099) {
            totalShowCache = 6;
          } else if (totalMetric > 1599) {
            totalShowCache = 7;
          } else if (totalMetric > 1349) {
            totalShowCache = 8;
          } else if (totalMetric > 949) {
            totalShowCache = 9;
          } else if (totalMetric > 449) {
            totalShowCache = 10;
          } else if (totalMetric > 249) {
            totalShowCache = 10;
          } else {
            totalShowCache = 11;
          }
          break;
        }
      }

      for (let i = 0; i < this.conversationCache.length; i++) {
        this.conversations.push(this.conversationCache[i]);
        if (i === totalShowCache) break;
      }

      this.conversations = this.conversations.reverse();

      this.ScrollToBottom();
      this.setArray('myArrayKey' + this.uidtipster, this.conversations);
    });
  });
}
 
  ngAfterViewInit() {
    // Desplázate hacia abajo después de que la vista haya sido inicializada
 
    this.myContent.scrollToBottom(0);
  }
  async logScrolling(event:any) {
    // Solo envía el evento una vez
    // console.log(event)
  
    if (event.target.localName != "ion-content") {
      // No estoy seguro si esto es necesario, solo estoy siendo cauteloso
      return;
    }
  
    // Almacena el valor actual de currentY
    const currentY = event.detail.currentY;
    //console.log(currentY)
    if (currentY === 0) {
      console.log(this.conversationCache);
      this.zone.run(async () => {
        this.conversations = [];
        for (var i = 0; i < this.conversationCache.length; i++) {
          //console.log(this.conversationCache[i])
          console.log(i);
          this.conversations.push(this.conversationCache[i]);
          if (this.currentLoading === 0) {
            if (i === 30) {
              const scrollElement = await event.target.getScrollElement();
              // console.log({scrollElement});
              const scrollHeight = scrollElement.scrollHeight - scrollElement.clientHeight;
              console.log({scrollHeight});
              scrollElement.scrollTop = scrollHeight /1.4 ;
              this.currentLoading = 30;
              break;
            }
          }
  
          if (this.currentLoading === 30) {
            if (i === 60) {
              const scrollElement = await event.target.getScrollElement();
              // console.log({scrollElement});
              const scrollHeight = scrollElement.scrollHeight - scrollElement.clientHeight;
              // console.log({scrollHeight});
              scrollElement.scrollTop = scrollHeight / 1.8 ;
              this.currentLoading = 60;
              break;
            }
          }
        }
        this.conversations = this.conversations.reverse();
        console.log(this.conversations);

      });
        
   
    }
  
    const scrollElement = await event.target.getScrollElement();
    // console.log({scrollElement});
    const scrollHeight = scrollElement.scrollHeight - scrollElement.clientHeight;
    // console.log({scrollHeight});
    //scrollElement.scrollTop = scrollHeight / 2;
    const currentScrollDepth = scrollElement.scrollTop;
    // console.log({currentScrollDepth});
  
    const targetPercent = 99;
  
    let triggerDepth = ((scrollHeight / 100) * targetPercent);
    // console.log({triggerDepth});
    // console.log('777')
  
    if (currentScrollDepth > triggerDepth) {
      this.scrollDepthTriggered = false;
    } else {
      this.scrollDepthTriggered = true;
      // console.log('555555555555')
    }
  }
  
  allowDrop(event: DragEvent) {
    event.preventDefault();
  }
  drop(event: CdkDragDrop<string[]>) {
    
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }
 getUserDetails(uid: string, type: string) {
  console.log(this.uidtipster);
  const db = this.dbase;
  const dbRef = ref(db, `ruta/Contactos/${this.phoneNumberAdmin}/${this.uidtipster}`);

  get(dbRef).then((snapshot) => {
    if (type === 'Receiver') {
      const res = snapshot.val();
      console.log(res);

      if (res === null || res.Name === "" || res.Name === undefined) {
        this.addContact();
      } else {
        this.receiverData = res;
        this.NameReceptor = this.receiverData.Name;
        this.uidBusiness = this.receiverData.Num;
        console.log(this.receiverData);
      }
    } else {
      const res = snapshot.val();
      this.senderData = res;
      res.Name = this.NameReceptor;
      res.ImgTh = this.ImgReceptor;
      console.log(this.senderData);
    }
  }).catch((err) => {
    console.error(err);
  });
}

getUserMenuEnterprise() {
  const db = this.dbase;
  const dbRef = ref(db, `EnterprisesBusinessChat/${this.uidtipster}/Menu`);

  get(dbRef).then((snapshot) => {
    const res = snapshot.val();
    const array :any = [];

    for (const i in res) {
      array.push(res[i]);
    }

    this.zone.run(() => {
      this.menuOptions = array;
      console.log(this.menuOptions);
    });
  }).catch((err) => {
    console.error(err);
  });
}
async viewProfile(){


    this.modal = await this.modalController.create({
      component: ModalProfileComponent,
      cssClass: 'modal-add',
      canDismiss:true,
      backdropDismiss:true,
       initialBreakpoint:1,
        breakpoints:[0, 0.25, 1, 0.1],
       componentProps: {
        ubicacion: this.ubicacion,
         type: this.uidtipster,
         chat:this.conversations,
         admin: this.phoneNumberAdmin,
          suc: this.suc,
          lat:this.Lat,
          lng: this.Lng,
          token: this.tkUser,
          phonenumberid: this.phid,
          costoEnvio: this.costoEnvio,
          notageneral: this.Ind,
          metodoPago: this.payMeth,
          tag:this.tag,
          cuantopaga: this.cuantoPaga,
        name: this.NameReceptor,
     }
    
    });
    await this.modal.present();
  
  
    await this.modal.onDidDismiss().then((e:any)=>{
      console.log(e.data)
  
  
  
     // this.sendMessage(e.data['Cmd'],e.data['TypeAns'],e.data['Src'],e.data['Pro'])
  
     
   })
  
}

  ionViewWillEnter() {

    this.uidtipster = this.route.snapshot.paramMap.get('business')!.toLowerCase();

 const auth = getAuth();
const db = this.dbase;

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    const userRef = dbRef(db, `UsersBusinessChat/${uid}`);

    get(userRef).then((snapshot) => {
      const res = snapshot.val();
      console.log(res);

      const array = [];
      for (const i in res['Auth']) {
        array.push(res['Auth'][i]);
      }

      this.arrayNumbers = array;
      this.ph = res['SelectedPh'];
      this.phoneNumberAdmin = res['SelectedPh'].toString();

      this.getMenu();
      this.getCartWpp();
      this.getLocationUser();
      this.getFastAns();

      console.log('weeeeeeeeeeeeeeeeeeeeeeeeee');

      const recentRef = dbRef(db, `ruta/Recents/${this.phoneNumberAdmin}/${this.uidtipster}`);
      get(recentRef).then((snap) => {
        const recentRes = snap.val();
        this.tag = recentRes.Tag;
        console.log(recentRes.Tag);
      });

      this.getInterventionStatus();

      localStorage.setItem('Business', this.uidtipster);
      localStorage.setItem('SystemReceiveDataUser', this.uidtipster);
      this.uid = localStorage.getItem('UID');

      document.getElementById('updateComponent')?.click();

      this.Nombre = localStorage.getItem('NameOpenChatSystem')!;
      this.Nothing = false;
      this.Img = localStorage.getItem('ImgOpenChatSystem')!;

      if (this.uid === null || this.uid === 'null') {
        if (
          localStorage.getItem('myArrayKey' + this.uidtipster) === null
        ) {
          this.getdata(this.keytemporal, this.uidtipster);
        } else {
          this.conversations = this.getArray('myArrayKey' + this.uidtipster);
          this.ScrollToBottom();

          setTimeout(() => {
            this.getdata(this.keytemporal, this.uidtipster);
          }, 1000);
        }
      } else {
        if (
          localStorage.getItem('myArrayKey' + this.uidtipster) === null
        ) {
          this.getdata(this.uid, this.uidtipster);
        } else {
          const arrayConversations = this.getArray('myArrayKey' + this.uidtipster);

          for (let i = 0; i < arrayConversations.length; i++) {
            this.conversations.push(arrayConversations[i]);
            if (i === 10) break;
          }

          this.ScrollToBottom();

          setTimeout(() => {
            this.getdata(this.uid, this.uidtipster);
          }, 1000);
        }
      }

      this.getUserDetails(this.uidtipster, 'Receiver');

      console.log(this.arrayNumbers);
      for (let i = 0; i < this.arrayNumbers.length; i++) {
        if (this.ph === this.arrayNumbers[i]['Ph']) {
          this.phid = this.arrayNumbers[i]['PhId'];
          this.tkUser = this.arrayNumbers[i]['Tk'];
        }
      }
    });
  } else {
    // Usuario no autenticado
  }
});


    
   

    
  }
  navConver(){
    this.router.navigate(['/tabs/conversations'],{ replaceUrl: true });
  }

getCartWpp() {
  const db = this.dbase;
  const cartRef = dbRef(db, `ruta/${this.phoneNumberAdmin}/CartWpp/${this.uidtipster}`);

  onValue(cartRef, (snapshot) => {
    const res = snapshot.val();
    const array = [];

    for (const i in res) {
      array.push(res[i]);
    }

    this.arrayCartWpp = array;
    this.precio = 0;

    this.zone.run(() => {
      for (let i = 0; i < this.arrayCartWpp.length; i++) {
        this.precio += +this.arrayCartWpp[i]['Precio'];
      }
    });

    console.log(this.arrayCartWpp);
  });
}

blur(event:any){
   this.activeMedia = true;


    console.log(event);

}

  focusInput(event:any){
     console.log(event);
     this.activeMedia = false;
    }
    cropImage() {
      this.imgSysKeyboard = true
      this.cropper.crop();
      this.img = "";
      this.uploadedImg = true
    }


queryTeamsAndBet(team1:any,team2:any){
  console.log(team1);
  console.log(team2);
}

  ngOnInit() {
    const screenWidth = window.innerWidth;

    this.isMobileResolution = screenWidth <= 768; // Umbral típico para móviles
  
    this.fechaActual = this.dateService.getDateMexico().replace("/","").replace("/","")
    
    this.menu.enable(true)
    this.tipster = this.route.snapshot.paramMap.get('business')!.toString().toLowerCase();
    this.keytemporal = localStorage.getItem('KeyTemporal')


    if(localStorage.getItem('audioPreference') === null){
      this.audioPreference = false
    }else if(localStorage.getItem('audioPreference') === 'false'){
      this.audioPreference = false

    }else if(localStorage.getItem('audioPreference') === 'true'){
      this.audioPreference = true
      
    }
    
  /*  this.afDB.database.ref('ruta').child(this.phoneNumberAdmin).once('value', snap => {
      const res = snap.val();
  //    let array = []
    //  console.log(array)


      this.arrayPartidosHoy = res;
      console.log(this.arrayPartidosHoy);
    });*/
  }


  ScrollToBottom(){
    setTimeout(() => {
      this.myContent.scrollToBottom(300);
   }, 10);
   setTimeout(() => {
    this.myContent.scrollToBottom(300);
 }, 200);
 setTimeout(() => {
  this.myContent.scrollToBottom(300);
}, 1000);
  }

  async searchComponent(){

    this.modal = await this.modalController.create({
      component: SearchModalComponent,
      cssClass: 'modal-add',
      canDismiss:true,
      backdropDismiss:true,
       initialBreakpoint:1,
        breakpoints:[0, 0.25, 1, 0.1],
       componentProps: {
         Business: this.NameReceptor,
         Array: this.conversations
    
     }
    
    });
    await this.modal.present();
 
 
    await this.modal.onDidDismiss().then((e:any)=>{
      console.log(e.data)


this.checkerWords(e.data['Cmd'],e.data['Type'])
     // this.sendMessage(e.data['Cmd'],e.data['TypeAns'],e.data['Src'],e.data['Pro'])
 
     
   })
 
  }


  async selectDate(){

    this.modal = await this.modalController.create({
      component: ModalDateComponent,
      cssClass: 'date-medium',
      canDismiss:true,
      backdropDismiss:true,
       initialBreakpoint:0.99,
        breakpoints:[0, 0.25, 1, 0.1],
       componentProps: {
         Key: 'item.Key',
    
     }
    
    });
    await this.modal.present();
 
 
    await this.modal.onDidDismiss().then((e:any)=>{
      console.log(e.data)
     // this.fechaServer = e.data.toString()
 
      //this.fecha =e.data.toString()
    // this.arrayPartidosHoy = []
     //this.getPartidos()
 
     
   })
   
  }
  loadImageFailed(){

  }

sendMessage(msg: any, type: any, src: any, processBoolean: any) {
  console.log(processBoolean);
  if (processBoolean === 'Proceso') {
    this.processbolean = true;
    this.typePublish = this.action;
  } else {
    this.processbolean = false;
  }

  this.getFecha();

  this.src = src;
  console.log(src, 'src');
  this.fecha = this.fechaPartidos + '-2023';

  this.bodySystem = msg;
  this.typePublish = type;

  const db = this.dbase;

  // Primero creamos el nodo bajo 'Users' con push()
  const usersRef = ref(db, 'Users');
  push(usersRef, {}).then((snap) => {
    const key = snap.key;

    console.log(this.uid);
    console.log(this.uidtipster);

    if (this.uid === null || this.uid === 'null') {
      this.uid = this.keytemporal;
    }

    if (this.audioPreference === true) {
      this.utter = new SpeechSynthesisUtterance();

      this.utter.lang = 'es-ES';
      this.utter.text = this.bodySystem;
      this.utter.volume = 0.5;

      // event after text has been spoken
      this.utter.onend = function () { };

      // speak
      window.speechSynthesis.speak(this.utter);
    }

    console.log(this.action);
    console.log(this.typePublish, 'typepublish');

    if (this.fnc === 'CLOSE') {
      this.processEnable = false;
    }

    // Ahora hacemos update en la ruta con los datos
    const updateRef = ref(db, `ruta/${this.phoneNumberAdmin}/${this.uidtipster}/${key}`);

    update(updateRef, {
      Msg: this.bodySystem,
      Me: false,
      Ref: key,
      Day: this.fecha,
      Hour: this.hora,
      TypeRS: this.typePublish,
      Src: this.src,
      Pro: this.processEnable
    }).then(() => {
      this.conversations.push({
        Msg: this.bodySystem,
        Me: false,
        Ref: key,
        Day: this.fecha,
        Hour: this.hora,
        Src: this.src,
        TypeRS: this.typePublish,
        Pro: this.processEnable
      });
    });

  }).catch((err) => {
    console.log(err);
  });
}



sendMessageBot(msg: any, type: any, src: any) {
  console.log(msg);

  this.getFecha();
  this.srcSendImg = src;
  this.fecha = this.fechaPartidos + '-2023';
  console.log(this.fecha);

  this.bodySystem = msg;
  this.bodysys = msg;

  if (this.processEnable === true) {
    this.processbolean = true;
    this.typePublish = this.action;
  } else {
    this.processbolean = false;
  }

  const db = this.dbase;

  // Primero, se hace un push vacío para obtener la key
  push(dbRef(db, 'Users'), {}).then((snap) => {
    const key = snap.key!;
    console.log(this.uid);
    console.log(this.uidtipster);

    if (this.uid === null || this.uid === 'null') {
      this.uid = this.keytemporal;
    }

    console.log(this.typePublish);

    const chatRef = dbRef(db, `ChatWizard/${this.uid}/${this.tipster}/${key}`);

    update(chatRef, {
      Msg: this.bodysys,
      Me: true,
      Src: this.srcSendImg,
      Ref: key,
      Day: this.fecha,
      Hour: this.hora,
      TypeRS: this.typePublish,
      Pro: this.processEnable
    }).then(() => {
      this.conversations.push({
        Msg: this.bodysys,
        Me: true,
        Ref: key,
        Day: this.fecha,
        Hour: this.hora,
        Src: this.srcSendImg,
        TypeRS: this.typePublish,
        Pro: this.processEnable
      });

      this.ScrollToBottom();
    });

    console.log(this.conversations);

  }).catch((err) => {
    console.log(err);
  });
}



async getProcessSteps(str: any) {
  console.log(str);

  const db = this.dbase;
  const pathRef = dbRef(db, `News/Procesos/${this.uidBusiness}/${str}`);

  try {
    const snap = await get(pathRef);
    const res = snap.val();
    const array: any[] = [];

    for (const i in res) {
      array.push(res[i]);
    }

    this.arrayProcess = array;
    console.log(array);
  } catch (err) {
    console.error('Error fetching process steps:', err);
  }
}

getInterventionStatus() {
  const db = this.dbase;
  const pathRef = dbRef(db, `ruta/Intervencion/${this.phoneNumberAdmin}/${this.tipster}`);

  onValue(pathRef, (snap) => {
    const res = snap.val();
    const array: any[] = [];

    this.zone.run(() => {
      for (const i in res) {
        array.push(res[i]);
      }

      if (array.length === 0) {
        const defaultRef = dbRef(db, `ruta/Intervencion/${this.phoneNumberAdmin}/${this.tipster}/0`);
        update(defaultRef, { Status: false }).then(() => {
          // this.showToast('La conversación se intervino con exito, ahora puedes enviar mensajes sin que el bot responda')
        });

        this.statusIntervention = false;
      } else {
        this.statusIntervention = array[0]['Status'];
      }
    });
  });
}




getCmd(cmd:any){
  this.bodytxt = cmd
}


goDoc(url:any){
  window.open(url, '_blank');
}
intervenir() {
  const kenio = !this.statusIntervention;

  const db = this.dbase;
  update(ref(db, `ruta/Intervencion/${this.phoneNumberAdmin}/${this.uidtipster}/0`), {
    Status: kenio
  }).then(() => {
    this.showToast('La conversación se intervino con exito, ahora puedes enviar mensajes sin que el bot responda');
  });
}

sendMessageWpp() {
  if (this.bodytxt === '') {
    this.showToast('Campo vacio, escriba un mensaje');
    return;
  }
  const audio = new Audio('../../../assets/icon/Dew-drops-original.mp3');
  audio.loop = false;
  audio.play();

  this.conversations.push({ type: "text", interactive: { body: { text: this.bodytxt } } });
  this.setArray('myArrayKey' + this.uidtipster, this.conversations);

  this.ScrollToBottom();

  const dataClient = {
    Text: this.bodytxt,
    Phone: this.uidtipster,
    Tk: this.tkUser,
    PhBs: this.phid,
    Ph: this.ph
  };

  this.bodytxt = '';

  this.sendMsgWhatsApp(dataClient);
}


async uploadImg() {
  this.loadingUser();

  this.type = 'text';

  var we2 = document.getElementById('imagenProfile2')!.outerHTML;
  var resultmatch = we2.match('src="' + '(.*?)">');

  const db = this.dbase;
  try {
    const snap = await push(ref(db, 'Users'), {});
    const key = snap.key!;
    localStorage.setItem('KeyProductDynamicLink', key);
    this.keyProduct = key;
  } catch (err: any) {
    console.error(err);
  }

  if (resultmatch![1].length > 150) {
    var we2 = document.getElementById('imagenProfile2')!.outerHTML;
    var resultmatch = we2.match('src="' + '(.*?)">');

    console.log(localStorage.getItem('img64name'));
    console.log('img64name5');

    var filePath =
      '/' +
      localStorage.getItem('UID') +
      '/' +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      localStorage.getItem('img64name');
    console.log(filePath);
    localStorage.setItem('filePath', localStorage.getItem('img64name')!);

    const storage = getStorage();
    const storageReference = storageRef(storage, filePath);
    const url = resultmatch![1];

    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        var file = new File([blob], 'selectim5g.png', { type: 'image/png' });

        const uploadTask = uploadBytesResumable(storageReference, file);

        uploadTask.on(
          'state_changed' as TaskEvent,
          snapshot => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            var a = progress;
            var b = ~~a;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          },
          error => {
            console.log(error);
            // Handle unsuccessful uploads
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: any) => {
              console.log('File available at', downloadURL);
              localStorage.setItem('imgnow', downloadURL);
              document.getElementById('btnUpload2')!.click();
            });
          }
        );

        console.log(file);
      });
  } else {
    var hendle = setInterval(() => {
      this.loading.dismiss();
      this.showToast('Debes seleccionar una imagen primero');
      clearInterval(hendle);
    }, 2000);
  }
}
async checkerWords(str:any,type:any){
    


  console.log(this.conversations)
 
  if (this.conversations.length === 0){
    this.processEnable = false

  }else{
    this.processEnable = this.conversations[this.conversations.length-1]['Pro']
    console.log(this.conversations[this.conversations.length-1]['Pro'])
     
  }

    console.log(type)

    if(type === 'DisconectProcess'){
      this.processEnable = false
    }


  if(this.processEnable === true && type === 'Pregunta'){
    this.showToast('No puedes utilizar comandos predeterminados durante un proceso. ')
    return
  }


      console.log(this.processEnable)
    if (this.processEnable === true){ 
      console.log('procesoooooooo')
      console.log(str)
      this.processEnable = true
      this.showLoading = true 

       
      this.bodytxt= str
      this.bodysys= str

       this.sendMessageBot(this.bodytxt,this.processEnable,this.srcSendImg)
       this.bodytxt =''

       setTimeout(() => {

        this.processStepCount = this.processStepCount + 1

        console.log(this.arrayProcess)
        //console.log(this.arrayProcess[this.processStepCount])

          this.action = this.arrayProcess[this.processStepCount]['Action']

        this.showLoading = false 
        console.log(this.arrayProcess)
        console.log(this.arrayProcess[this.processStepCount]['BodyAns'],'bodyans answer process')
        console.log(this.arrayProcess[this.processStepCount]['Fnc'],'fnc answer process')
        this.fnc = this.arrayProcess[this.processStepCount]['Fnc']
     /*   this.sendMessage(
          this.arrayProcess[this.processStepCount]['BodyAns'],
        this.arrayProcess[this.processStepCount]['TypeAns'],
        this.arrayProcess[this.processStepCount]['Src'],
        this.arrayProcess[this.processStepCount]['Action']
        
        )*/
        this.ScrollToBottom();



      }, 1000);
    }else
    
    
    if (this.processEnable === false){
  
      this.bodysys= str

      this.bodytxt= str
      console.log(str)
  
      console.log(this.menuOptions[this.menuOptions.length-1]['Type'])
     
      for(var i = 0 ; i < this.menuOptions.length;i ++){
        if (this.menuOptions[i]['Cmd'] === this.bodytxt){
          console.log(this.menuOptions[i]['Src'])
     
              this.sendMessageBot(this.bodytxt,'TXT','')
              this.showLoading = true  
              setTimeout(() => {
                this.showLoading = false         
                if(this.menuOptions[i]['Type'] === 'Proceso')        {
                  this.processEnable = true
                  if( this.processStepCount  === 0){
                    this.getProcessSteps(this.menuOptions[i]['Cmd'])
                    setTimeout(() => {
                    console.log()
                    this.sendMessage(
                      this.arrayProcess[this.processStepCount]['BodyAns'],
                    this.arrayProcess[this.processStepCount]['TypeAns'],
                    this.arrayProcess[this.processStepCount]['Src'],
                    this.arrayProcess[this.processStepCount]['Action']
                    
                    )
                    this.action = this.arrayProcess[this.processStepCount]['Action']
             //     this.S/crollToBottom();
                    
              }, 1000);
                  }
                }else{
                  this.sendMessage(this.menuOptions[i]['BodyAns'],this.menuOptions[i]['TypeAns'],this.menuOptions[i]['Src'],this.menuOptions[i]['Type'])
               //   this.S/crollToBottom();
                }
          
              
  
              }, 1000);
              this.ScrollToBottom();
  
                console.log('kx')
      this.bodytxt = ''
      this.sendMenuMsg = false
      return

      
    }


          
     
      
          

     

      }

      if(this.sendMenuMsg === false){
        this.action = 'TXT'
        this.typePublish = 'TXT'
        this.sendMessage('¡Hola!, Eres asistido por Wizard ChatBot, estas son las preguntas mas frecuentes de nuestros clientes: porfavor elija un comando o haga click en alguno:','CMD TABLE','null','NO')
        this.sendMenuMsg = true
        this.ScrollToBottom()
        this.showToast('No se encontraron resultados, intenta con los comandos predeterminados.')
        this.bodytxt = ''
        }else if (this.sendMenuMsg === true){
          this.showToast('No se encontraron resultados, intenta con los comandos predeterminados.')
          this.bodytxt = ''
    
        }
    }

  

 

    
}

sendPdf(){

  this.srcSendImg = localStorage.getItem('imgnow')
this.closeImgSys()
this.loading.dismiss()

var dataClient = {
  Url: this.srcSendImg,
  Phone:this.uidtipster,
  Tk:this.tkUser,
  PhBs:this.phid,
  Ph:this.ph,
  Text: this.descImg,
  FPth: localStorage.getItem('filePath')

  }

this.sendPdfWhatsApp(dataClient)

}

sendImg(){

  this.srcSendImg = localStorage.getItem('imgnow')
this.closeImgSys()
this.loading.dismiss()

var dataClient = {
  Url: this.srcSendImg,
  Phone:this.uidtipster,
  Tk:this.tkUser,
  PhBs:this.phid,
  Ph:this.ph,
  Text: this.descImg

  }
this.sendImgWhatsApp(dataClient)

}

downloadDoc(url:any){
    this.URLDOCUMENT = url
  
    console.log(url)
    location.href = this.URLDOCUMENT;

}
ngOnDestroy(){

}
enableSound(type:any){
 
    this.zone.run(() =>{
      if(type === 'enable'){
    this.audioPreference = true
    localStorage.setItem('audioPreference','true')

    this.showToast('Se habilitó la lectura de mensajes por voz.')
  }else{
    this.audioPreference = false
    localStorage.setItem('audioPreference','false')

    this.showToast('Se deshabilitó la lectura de mensajes por voz.')

  }
})
}

setDataMessages(key:any){
  console.log(this.uid);
  console.log(this.uidtipster);


}

getFecha(){
  const today = new Date();
  this.hora = today.getHours() + ':' + today.getMinutes();

  return this.hora;
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



async uploadPdf() {
  this.loadingUser();
  this.type = 'text';

  const fileInput = document.getElementById('upload2pdf');
  if (fileInput instanceof HTMLInputElement && fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];

    const filePath = '/' + localStorage.getItem('UID') + '/' +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      file.name;

    console.log(filePath);
    localStorage.setItem('filePath', file.name);

    const storage = getStorage(); // ✅ modular storage
    const storageReference = storageRef(storage, filePath); // ✅ alias avoids conflict with DB

    const uploadTask = uploadBytesResumable(storageReference, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');

        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          localStorage.setItem('imgnow', downloadURL);
          document.getElementById('btnUploadPdf')?.click();
        });
      }
    );
  } else {
    const handle = setInterval(() => {
      this.loading.dismiss();
      this.showToast('Debes seleccionar un archivo primero');
      clearInterval(handle);
    }, 2000);
  }
}


  
  
  doitpdf(){
    
    document.getElementById("upload2pdf")!.click();
  } 
   doit(){
    
    document.getElementById("upload2")!.click();
  } 

  imageLoaded() {
    
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage  = event.base64;
    this.imgCropBoolean = false
    this.imgcache = false
  }

  hideChatFeatures(type:any){
    this.filepath = localStorage.getItem('img64name')
    this.actualTypeSend = type
    this.imgSys = false
    this.imgSysKeyboard = true
    

  }
  closeImgSys(){
    this.imgSys = true
    this.imgSysKeyboard = false
    document.getElementById('backgroundCrop')!.style.display = 'none'   
  }

  @HostListener('window:popstate', ['$event'])
  dismissModal() {
    this.popoverController.dismiss();
    const modalState = {
      modal : true,
      desc : 'fake state for our modal'
    };
    history.pushState(modalState, "null");
  }


 
async tagsComponent() {
  this.modal = await this.modalController.create({
    component: ModalTagsComponent,
    cssClass: 'date-',
    canDismiss: true,
    backdropDismiss: true,
    initialBreakpoint: 0.92,
    breakpoints: [0, 0.25, 1, 0.1],
  });
  await this.modal.present();

  const { data } = await this.modal.onDidDismiss();
  console.log(data);

  if (data !== null && data !== undefined) {
    const array = { Tag: data };
    const db = this.dbase;
    const recentRef = ref(db, `ruta/Recents/${this.phoneNumberAdmin}/${this.uidtipster}`);

    try {
      await update(recentRef, array);
      this.showToast('Se agregó la etiqueta');
    } catch (error) {
      console.error('Error updating tag:', error);
      // Opcional: mostrar alerta o toast de error
    }
  }
}

  cropImg (){
    //this.imgSys = true
    this.imgSysKeyboard = false

    this.imgCropBoolean = true

   

  var we2 = document.getElementById('imagenProfile2')!.outerHTML
   // console.log(document.getElementById('imagenProfile2').outerHTML)
    var resultmatch = we2.match('src="'+'(.*?)">');

    this.img  = resultmatch![1]

  
  

  }
  resetArray(){
    this.slidesIMG = []
  }
  async  loadingUser(){
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Cargando datos.. Porfavor espere...',
    });
    await this.loading.present();
  }

  getLocationUser(){
    const monto = this.uidtipster; // El monto que deseas enviar
    const admin = this.phoneNumberAdmin;
    const data = {
      monto,
      admin
    };
    this.http.post('https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/getLocationUser', data)
    .subscribe((response:any) => {
      //console.log(this.locations)
      console.log(response)
      console.log(response[0])
      this.Lat = response[1]
      this.Lng = response[0]
      this.ubicacion = response[2]
      this.ind = response[3]
      this.costoEnvio = response[4]
      this.suc = response[5]
      
    
      return response

    }, error => {
      console.error(error);
    });

  }
  sendMsgWhatsApp(data:any){

    this.http.post(
      'https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/sendWppFast', data)
    .subscribe(response => {
      console.log(response)
   

    }, error => {
      console.error(error);
    });
  }
  sendImgWhatsApp(data:any){

    this.http.post(
      'https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/sendWppFastImg', data)
    .subscribe(response => {
      console.log(response)
   
    }, error => {
      console.error(error);
    });
  }
   sendPdfWhatsApp(data:any){

    this.http.post(
      'https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/sendWppFastPdf', data)
    .subscribe(response => {
      console.log(response)
   
    }, error => {
      console.error(error);
    });
  }

  sendMsgWhatsAppTemplate(data:any){
    this.http.post(
      'https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/sendWppTemplate', data)
    .subscribe(response => {
      console.log(response)
    }, error => {
      console.error(error);
    });
  }


async addContact() {
  const alert = await this.alertController.create({
    header: 'Agregar contacto',
    inputs: [
      {
        name: 'nombre',
        type: 'text',
        placeholder: 'Nombre'
      },
      {
        disabled: true,
        name: 'numero',
        type: 'number',
        value: this.uidtipster,
        placeholder: 'Número'
      }
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Confirm Cancel');
        }
      },
      {
        text: 'Aceptar',
        handler: async (data) => {
          console.log('Confirm Ok', data);
          this.NameReceptor = data.nombre;
          this.menuOptions.push({ Contact: data.numero });

          const db = this.dbase;
          const contactRef = ref(db, `ruta/Contactos/${this.phoneNumberAdmin}/${data.numero}`);

          try {
            await update(contactRef, {
              Name: data.nombre,
              Num: data.numero
            });
            this.showToast('Se agregó con exito el nombre');
          } catch (error) {
            console.error('Error updating contact:', error);
            // Opcional: mostrar alerta o toast de error
          }
          // Aquí puedes manejar los datos ingresados por el usuario
          // data.nombre y data.numero
        }
      }
    ]
  });

  await alert.present();
}

  shareGralLoc(var1:any,var2:any){

    let newVariable: any;
  
    newVariable = window.navigator;
      
      if (newVariable && newVariable.share) {
        newVariable.share({
          title: '',
          text: '',
          url: "https://www.google.com/maps?q=" + var1 + "," + var2,
        })
          .then(() => console.log('Successful share'))
          .catch((error:any) => 
          
          
          console.log('error',error)
          );
      } else {

      }
  
}

shareGral(var1:any){

  let newVariable: any;

  newVariable = window.navigator;
    
    if (newVariable && newVariable.share) {
      newVariable.share({
        title: '',
        text: '',
        url: var1,
      })
        .then(() => console.log('Successful share'))
        .catch((error:any) => 
        
        
        console.log('error',error)
        );
    } else {
  
    }

}

async textComponent(type:any){

  this.modal = await this.modalController.create({
    component: ModalTextsComponent,

    cssClass: 'modal-middle',
    canDismiss:true,
    backdropDismiss:true,
     initialBreakpoint:1,
      breakpoints:[0, 0.1, 0.1, 0.1],
     componentProps: {
       Type: type,
  
   }
  
  });
  await this.modal.present();


  await this.modal.onDidDismiss().then((e:any)=>{
    console.log(e.data)
    //alert(JSON.stringify(e.data.Text)); 
    if(e.data.Type === "Cuanto paga"){
      this.cuantoPaga = e.data.Text
    }
    if(e.data.Type === "Agregar una nota"){
 
    this.Ind = e.data.Text

    }


   // this.sendMessage(e.data['Cmd'],e.data['TypeAns'],e.data['Src'],e.data['Pro'])

   
 })

}
}




