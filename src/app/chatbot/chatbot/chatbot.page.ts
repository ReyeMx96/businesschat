import { Component, OnInit, ViewChild, NgZone, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
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
import { getDownloadURL, ref as storageRef, getStorage, TaskEvent, uploadBytesResumable, uploadBytes } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { get, getDatabase, ref as dbRef, onValue, push, ref, update } from '@angular/fire/database';
import { AuthService } from 'src/app/auth.service';
import { collection, getFirestore, onSnapshot, Timestamp, Unsubscribe } from 'firebase/firestore';
import { YourCategoryModel } from 'src/app/restaurantes/restaurant-products/restaurant-products.page';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalToppingsComponent } from 'src/app/modals/modal-toppings/modal-toppings.component';
import { ModalCartNewComponent } from 'src/app/modals/modal-cart-new/modal-cart-new.component';
import { ModalCreateOrderComponent } from 'src/app/modals/modal-create-order/modal-create-order.component';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment.prod';
import { ImageViewerComponent } from 'src/app/modals/image-viewer/image-viewer.component';
import { PressDirective } from 'src/app/directives/press.directive';
import { ActionMessagesComponent } from 'src/app/popovers/action-messages/action-messages.component';
import { ResendMessageComponent } from 'src/app/modals/resend-message/resend-message.component';


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
  private storage = getStorage(initializeApp(environment.firebaseConfig));
 
  tipsterTypeBetCount: any;
  ImgReceptor: any;
  receiverData: any;
  senderData: any[] = [];
  slidesIMG: any;
  processStepCount = 0;
  hora: any;
  dbase = getDatabase()
    categories: YourCategoryModel[] | null = null;
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
  itemCountCategories = 0
  responseai: any;
  mapUrl: any;
  constructor(private cd: ChangeDetectorRef,private openai : AuthService,private router: Router, private dateService : FechaService, private firestore: AngularFirestore,
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



//   setTimeout(async () => {
//   const el = await this.myContent.getScrollElement();
//   el.scrollTop = el.scrollHeight;
// }, 60);

  }
   attach(){

   }
    requestPermisionCamera(){
      this.imgSys = true
    alert("Camera")
  }
  
 async openImg(url: string) {
  const modal = await this.modalController.create({
    component: ImageViewerComponent,
    componentProps: {
      imgUrl: url
    },
    cssClass: 'fullscreen-modal'
  });

  await modal.present();
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
    popover.onDidDismiss().then( async (dataReturned) => {
      if (dataReturned !== null) {
        // Aquí obtienes la acción tomada en el popover
        console.log("Acción tomada:", dataReturned.data.action);
             
        if(dataReturned.data.action === "Stripe"){
          this.enviarDatos()
        }
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
          this.clickInputFile()
        }
                if(dataReturned.data.action === "ImgMenuPromo"){
          this.sendImgMenuPromo()
      

        }
        if(dataReturned.data.action === "ImgPdf"){
          this.sendMenuPdfPromo()
      

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
          var msg1 = ""
          var msg2 = ""
          if(this.phoneNumberAdmin === "5218333861194"){
           msg1 = "Estrella Ruiz Gómez - Banorte"
            msg2 = "5264246816524648"
          }
        if(this.phoneNumberAdmin === "5218334460818"){
           msg1 = "Banregio - Maria Fernanda Rodriguez Ortiz"
            msg2 = "0588 1370 0409 2001 15"
          }
            if(this.phoneNumberAdmin === "5218332367397"){
           msg1 = "Banorte - Gustavo Cabrera Romero"
            msg2 = "0728 1300 2672 1860 25"
          }
           
   

      
            var audio = new Audio('../../../assets/icon/Dew-drops-original.mp3');
            audio.loop = false;
            audio.play();
            this.conversations.push({type:"text", interactive:{body:{text:msg2}}})
            this.conversations.push({type:"text", interactive:{body:{text:msg1}}})
              this.cd.detectChanges();

      requestAnimationFrame(() => {
        this.ScrollToBottom(); // sin animación al cargar
      });
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
              await this.sendMsgWhatsApp(dataClient7)
              setTimeout(async() => {
              await this.sendMsgWhatsApp(dataClient8)
                
              }, 1000);
                this.cd.detectChanges();

      requestAnimationFrame(() => {
        this.ScrollToBottom(); // sin animación al cargar
      });
        }
      }
    });
  
    return await popover.present();
  }
  


  signal(signal:any){

  }
   async sendImgMenuPromo(){
    //this.sendImgMenu()
  

      const item = await this.getMenuItemFromRTDB("Promo");

      if (!item) {
        this.showToast("No hay imágenes Promo configuradas");
        return;
      }

      this.srcSendImg = item['ImgUrl'];   // ✅ URL desde Realtime

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
       this.cd.detectChanges();

      requestAnimationFrame(() => {
        this.ScrollToBottom(); // sin animación al cargar
      });
  }


async sendImgsMenuPromo() {

  const item = await this.getMenuItemFromRTDB("PdfMenu");

  if (!item) {
    this.showToast("No hay imágenes Promo configuradas");
    return;
  }

  const imgs: any[] = item["PdfUrl"] || []; // 👈 FIX: evitar error TS

  if (imgs.length === 0) {
    this.showToast("No hay PDF configurado");
    return;
  }

  for (const obj of imgs) {

    const img = obj?.Img; // 👈 seguro

    if (!img) continue;

    const dataClient = {
      Url: img,
      Phone: this.uidtipster,
      Tk: this.tkUser,
      PhBs: this.phid,
      Ph: this.ph,
      Text: this.descImg
    };

    await this.sendImgWhatsApp(dataClient);

    this.conversations.push({
      type: "image",
      interactive: { body: { text: img } }
    });
  }

  this.ScrollToBottom();
  this.showToast("Se enviaron todas las imágenes");
}
async sendMenuPdfPromo() {

  const item = await this.getMenuItemFromRTDB("PdfMenu");

  if (!item) {
    this.showToast("No hay imágenes Promo configuradas");
    return;
  }

  const imgs = item["PdfUrl"]; // 👈 FIX: evitar error TS

 

   
    const dataClient = {
      Url: imgs,
      Phone: this.uidtipster,
      Tk: this.tkUser,
      PhBs: this.phid,
      Ph: this.ph,
      Text: this.descImg
    };

    await this.sendPdfWhatsApp(dataClient);

    this.conversations.push({
      type: "image",
      interactive: { body: { text: imgs } }
    });
  

  this.ScrollToBottom();
  this.showToast("Se enviaron todas las imágenes");
}
  async getMenuItemFromRTDB(type: string) {
  const db = getDatabase();
  const path = `ruta/${this.ph}/Menus`; // 📌 ruta que pediste

  const snapshot = await get(ref(db, path));

  if (!snapshot.exists()) return null;

  let item = null;

  snapshot.forEach((childSnap) => {
    const data = childSnap.val();
    if (data.Type === type) {
      item = data;
    }
  });

  return item;
}

 async sendImgMenu(){
    //this.sendImgMenu()
  
   const item = await this.getMenuItemFromRTDB("Menu");

      if (!item) {
        this.showToast("No hay imágenes Promo configuradas");
        return;
      }

      this.srcSendImg = item['ImgUrl'];
    
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
        this.cd.detectChanges();

      requestAnimationFrame(() => {
        this.ScrollToBottom(); // sin animación al cargar
      });
  }





   getFormattedPrice(price: number): string {
    return price.toFixed(2);
  }
  navigate(productName: string, productId: string | undefined, item:any, arrayCategory:any,) {
    if(item.active === true){

    }else{
      this.showToast('El producto está agotado, intenta mas tarde.')
      return
    }
    // Implementa la lógica para navegar a la página de detalles del producto
    console.log(`Navegando a ${productName} con ID: ${productId}`);
    const arraySubcategory = {nombre:""}
    const arraySubsubCategory  = {nombre:""}

    this.presentModal(item, arrayCategory, arraySubcategory,arraySubsubCategory)

  }

  navigate1(productName: string, productId: string | undefined, item:any, arrayCategory:any, arraySubcategory : any) {
    if(item.active === true){

    }else{
      this.showToast('El producto está agotado, intenta mas tarde.')
      return
    }
    // Implementa la lógica para navegar a la página de detalles del producto
    console.log(`Navegando a ${productName} con ID: ${productId}`);
    const arraySubsubCategory  = {nombre:""}

    this.presentModal(item, arrayCategory, arraySubcategory, arraySubsubCategory)

  }
booleanModal = false
userId = ""
  async presentModal(array: any, arrayCategory:any, arraySubcategory: any, arraySubsubcategory:any) {
    if(this.activeRestaurante === false){
      this.showToast("El restaurante esta cerrado")
      return
    }
    if(this.booleanModal === true){
      return
    }
    this.booleanModal = true
    const modal = await this.modalController.create({
      component: ModalToppingsComponent,
      componentProps: 
      { 
      restaurante: this.restaurantId,
      Item: JSON.parse(JSON.stringify(array)),
      Phone:this.tipster || "",
      ItemCategoria: JSON.parse(JSON.stringify(arrayCategory)),
      ItemSubcategoria: JSON.parse(JSON.stringify(arraySubcategory)),
      ItemSubcategoria2: JSON.parse(JSON.stringify(arraySubsubcategory)),
      business: this.restaurantId,
      Uid:this.userId,

      },
      breakpoints: [0, 0, 0, 1], // 0 = minimizado, 0.5 = mitad, 0.8 = 80%, 1 = pantalla completa
      initialBreakpoint: 1 // Puedes ajustar el valor inicial según prefieras
      // cssClass: 'custom-modal-class'  // Add your custom class here
    });
    this.booleanModal = false

    await modal.present();

    await modal.onDidDismiss().then(() => {
      // Limpiar datos después del cierre del modal
 
    });

  }
  disableanswerFast(){
    this.answerFast = false
    this.showingAns = true
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
    this.answerFast = true
    this.bodytxt = "/"
  }
  
  toggleFeature() {
    console.log('Feature enabled:', this.isFeatureEnabled);
    this.getMenu()

  }
  respuesta = ""
enviarPrompt(prompt: string): Promise<any> {
  return new Promise((resolve, reject) => {
    this.openai.getDataFromOpenAI(prompt).subscribe(
      (res: any) => {
        try {
          this.respuesta = res.choices[0].message.content;
          let cleanResponse = this.respuesta.replace(/[\u200B-\u200D\uFEFF]/g, '');
          cleanResponse = cleanResponse.replace(/'/g, '"');

          // const jsonResponse = JSON.parse(cleanResponse);
          // this.showToast('Se generó correctamente la predicción con Inteligencia Artificial');

          resolve(cleanResponse); // ✅ devolvemos el resultado
        } catch (error) {
          console.error("Error al convertir la respuesta a JSON:", error);
          reject(error); // ❌ devolvemos el error
        }
      },
      (error) => {
        console.error('Error de OpenAI:', error);
        this.respuesta = 'Hubo un error al procesar la solicitud.';
        this.showToast(this.respuesta);
        reject(error);
      }
    );
  });
}

async actionIA(message: any) {
  console.log(message.interactive.body.text);

  if (!message.interactive.body.text.trim()) {
    this.showToast('Campo vacío, escriba un mensaje');
    return;
  }

  const respuesta = await this.enviarPrompt(message.interactive.body.text);

  this.conversations.push({
    type: "text",
    interactive: { body: { text: JSON.stringify(respuesta) } }
  });
  this.setArray('myArrayKey' + this.uidtipster, this.conversations);
     this.cd.detectChanges();

      requestAnimationFrame(() => {
        this.ScrollToBottom(); // sin animación al cargar
      });
  const dataClient = {
    Text: respuesta,
    Phone: this.uidtipster,
    Tk: this.tkUser,
    PhBs: this.phid,
    Ph: this.ph
  };

  this.bodytxt = '';
  this.sendMsgWhatsApp(dataClient);
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
formatTextoToppings(texto: string): string {
  return texto.replace(/\|/g, '<br>');
}
  async crearPedido(){
    
    this.loadCategorias()
    setTimeout(() => {
    this.showingAns = false
    this.digitalist = true
    }, 1000);

  

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
this.showingAns = true
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
    component: ModalCreateOrderComponent,
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
        neg: this.restaurantId,
        metodoPago: this.payMeth.replace("Pago En ", ""),
        cuantopaga: this.cuantoPaga,
        devMode:"A domicilio",
        phone: this.tipster,

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
      component: ModalCartNewComponent,
      cssClass: 'modal-add',
      canDismiss:true,
      backdropDismiss:true,
       initialBreakpoint:1,
        breakpoints:[0, 0, 1, 0.1],
       componentProps: {
         type: this.uidtipster,
         neg:this.restaurantId,
         admin: this.phoneNumberAdmin,
         phone: this.tipster,
         devMode:"A domicilio",
         direccion:this.ubicacion,
         costoEnvio: this.costoEnvio,
         typePay: this.payMeth,
         
     }
    
    });
    await this.modal.present();
 
 
    await this.modal.onDidDismiss().then((e:any)=>{
      console.log(e.data)
      if(this.digitalist === true){

      }else{
      this.crearPedido()

      }

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
  activeBubble: any = null;
selectAppPress(event:any, array:any) {
  const isDesktop = window.innerWidth >= 1024; // ajusta el número si quieres

  if (isDesktop) {
    console.log("Estamos en DESKTOP");
    this.onPress(event, array)
    // 👉 acciones para desktop aquí
  } else {
    console.log("Estamos en CELULAR");
    // 👉 acciones para móvil aquí
  }
}

 async onPress(ev:any, text:any) {
  this.activeBubble = text.tst; // ✅ MARCA MENSAJE ACTIVO

  const popover = await this.popoverController.create({
    component: ActionMessagesComponent,
    event: ev,
    translucent: true,
    cssClass: 'message-popover'
  });

  await popover.present();

  const { data } = await popover.onDidDismiss();
  this.activeBubble = null; // ✅ RESETEA CUANDO SE CIERRA

  if (data === 'copiar') {
    this.copyMessage(text.interactive.body.text)
  }

  if (data === 'reenviar') {
    this.modalResend(text);

  }

  if (data === 'eliminar') {
    //this.eliminarMensaje(text);
  }
}
async modalResend(array: any) {

  const modal = await this.modalController.create({
    component: ResendMessageComponent,
    cssClass: 'resend-modal',
    componentProps: {
      dataArray: array
    }
  });

  await modal.present();

  // ✅ ESPERAMOS A QUE EL MODAL ENVÍE EL ARRAY DE NÚMEROS
  const { data } = await modal.onDidDismiss();

  if (!data || !Array.isArray(data)) {
    console.log("❌ Modal cerrado sin datos");
    return;
  }

  console.log("✅ ARRAY RECIBIDO DESDE MODAL:", data);

  // ✅ ENVIAR MENSAJE A CADA NÚMERO
  for (const numero of data) {


      var dataClient = {}
    if(array.type === 'text'){
           dataClient = {
      Text: array.interactive.body.text,   // mensaje original
      Phone: numero,               // ← SI ESTO ES TU ID GENERAL
      Tk: this.tkUser,
      PhBs: this.phid,
      Ph: this.ph,
    };
    this.sendMsgWhatsApp(dataClient);
    console.log("📤 Enviando mensaje a:", numero, dataClient);

    }
       if(array.type === 'document'){
         dataClient = {
  Url: array.interactive.body.text,
  Phone:numero,
  Tk:this.tkUser,
  PhBs:this.phid,
  Ph:this.ph,
  Text: this.descImg,
  FPth: localStorage.getItem('filePath') || "Documento Adjunto"

  }

this.sendPdfWhatsApp(dataClient)
  
    }
       if(array.type === 'image'){
 dataClient = {
  Url: array.interactive.body.text,
  Phone:numero,
  Tk:this.tkUser,
  PhBs:this.phid,
  Ph:this.ph,
  Text: this.descImg || ""

  }
this.sendImgWhatsApp(dataClient)

    console.log("📤 Enviando mensaje a:", numero, dataClient);

    }
  }

  // Limpiar input
  this.bodytxt = '';
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
    this.showToast("Mensaje copiado")
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

onChatScroll(e: Event) {
  const el = e.target as HTMLElement;

  this.scrollDepthTriggered =
    el.scrollHeight - el.scrollTop - el.clientHeight > 150;
}
 closeanswerFast(){
    this.answerFast = false;
   
  

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


    // ----------------------------------------------------------
    // 🔥🔥🔥 NUEVO BLOQUE: FORMATO INTELIGENTE DE FECHA
    // ----------------------------------------------------------

    const elements = document.querySelectorAll('.speech-wrapper');

    let closestMsg = null;
    let minDiff = Infinity;

    elements.forEach((el: any) => {
      const rect = el.getBoundingClientRect();
      if (rect.top >= 0) {
        const diff = rect.top;
        if (diff < minDiff) {
          minDiff = diff;
          closestMsg = el;
        }
      }
    });

    if (closestMsg) {
      const msgIndex = Array.from(elements).indexOf(closestMsg);
      if (this.conversations[msgIndex]) {

        const msg = this.conversations[msgIndex];
        const fecha = msg.fecha || '';   // formato YYYY-MM-DD
        const hora = msg.tst || '';      // formato HH:mm

        // Convertimos fecha a objeto Date
        const msgDate = new Date(`${fecha} ${hora}`);
        const today = new Date();

        // Quitamos horas para comparar días
        const d1 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const d2 = new Date(msgDate.getFullYear(), msgDate.getMonth(), msgDate.getDate());

        const diffTime = d1.getTime() - d2.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        let finalLabel = '';

        if (diffDays === 0) {
          finalLabel = `Hoy, ${hora}`;
        } else if (diffDays === 1) {
          finalLabel = `Ayer, ${hora}`;
        } else if (diffDays <= 7) {
          // Nombre del día
          const days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
          finalLabel = `${days[msgDate.getDay()]}, ${hora}`;
        } else {
          // Fecha normal
          finalLabel = `${fecha} ${hora}`;
        }

        this.topDate = finalLabel;
        console.log(this.topDate);
      }
    }

    // ------------------------------------------------------------
    // 🔥 FIN DEL AGREGADO — TODO LO DEMÁS ESTÁ 100% IGUAL
    // ------------------------------------------------------------
}


  topDate: string = '';
lastScrollUpdate = 0;

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
authUnsub: any;
ngOnDestroy() {
  if (this.authUnsub) {
    this.authUnsub(); // 🔥 mata el listener
  }
if (this.dataUnsub) {
    this.dataUnsub(); // 🔥 mata el onValue
  }
}
  ngOnInit() {
   
    this.checkScreenSize()
    const screenWidth = window.innerWidth;

    this.isMobileResolution = screenWidth <= 768; // Umbrdal típico para móviles
  
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

  chatReady = false;

dataUnsub:any
    getdata(uid: any, uid2: any) {
  const db = this.dbase;  // Modular API
  const path = `ruta/${this.phoneNumberAdmin}/${this.uidtipster}`;
  const dataRef = ref(db, path);

this.dataUnsub = onValue(dataRef, snapshot => {
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
            totalShowCache = 15;
          } else if (totalMetric > 1599) {
            totalShowCache = 15;
          } else if (totalMetric > 1349) {
            totalShowCache = 15;
          } else if (totalMetric > 949) {
            totalShowCache = 15;
          } else if (totalMetric > 449) {
            totalShowCache = 15;
          } else if (totalMetric > 249) {
            totalShowCache = 15;
          } else {
            totalShowCache = 15;
          }
       break;
        }
      }

      for (let i = 0; i < this.conversationCache.length; i++) {
        this.conversations.push(this.conversationCache[i]);
        if (i === totalShowCache) break;
      }
   
      this.conversations = this.conversations.reverse();
      this.chatReady = true;

 requestAnimationFrame(async () => {
  const el = await this.content.getScrollElement();
  el.scrollTop = el.scrollHeight;
  
});

      this.setArray('myArrayKey' + this.uidtipster, this.conversations);
    });
  });
}
  ionViewDidEnter() {

    this.uidtipster = this.route.snapshot.paramMap.get('business')!.toLowerCase();

 const auth = getAuth();
const db = this.dbase;

    this.authUnsub  = onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    const userRef = dbRef(db, `UsersBusinessChat/${uid}`);

    get(userRef).then(async(snapshot) => {
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
      await this.getLocationUser();



      localStorage.setItem('Business', this.uidtipster);
      localStorage.setItem('SystemReceiveDataUser', this.uidtipster);
      this.uid = localStorage.getItem('UID');

      document.getElementById('updateComponent')?.click();

      this.Nombre = localStorage.getItem('NameOpenChatSystem')!;
   
      this.Img = localStorage.getItem('ImgOpenChatSystem')!;

      if (this.uid === null || this.uid === 'null') {
        if (
          localStorage.getItem('myArrayKey' + this.uidtipster) === null
        ) {
          this.getdata(this.keytemporal, this.uidtipster);
          console.log("1571")

        } else {
         
          console.log("1574")
            this.getdata(this.keytemporal, this.uidtipster);
       
        }
      } else {
        if (
          localStorage.getItem('myArrayKey' + this.uidtipster) === null
        ) {
          this.getdata(this.uid, this.uidtipster);
        } else {
 

            this.getdata(this.uid, this.uidtipster);
         
        }
      }
      this.getFastAns();
      setTimeout(() => {
      this.getCartWpp();
        
      }, 3000);

      console.log('weeeeeeeeeeeeeeeeeeeeeeeeee');

      const recentRef = dbRef(db, `ruta/Recents/${this.phoneNumberAdmin}/${this.uidtipster}`);
      get(recentRef).then((snap) => {
        const recentRes = snap.val();
        console.log(recentRes)
        this.tag = recentRes.Tag;
        console.log(recentRes.Tag);
      });

      this.getInterventionStatus();


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
  trackByMessage(index: number, msg: any) {
  return msg.tst || msg.id;
}


  navConver(){
    this.router.navigate(['/tabs/conversations'],{ replaceUrl: true });
  }
 private unsubscribeFromCart: Unsubscribe | null = null;
 itemCount = 0
 cartItems:any = []
getCartWpp() {
  try {
    // Obtener la instancia de Firestore
    const firestore = getFirestore();
 
    // Referencia a la subcolección "items" dentro de "cart" del restaurante del usuario actual
    const cartRef = collection(firestore, `users/${this.tipster}/cart/${this.restaurantId}/items`);

    // Establecer un listener para obtener los documentos en tiempo real
    this.unsubscribeFromCart = onSnapshot(cartRef, (cartSnapshot) => {
      // Contar cuántos documentos hay en la subcolección
      const itemCount = cartSnapshot.size;
      setTimeout(() => {
      this.itemCount = itemCount;
      }, 1000);

      // Crear un array temporal para almacenar los productos del carrito
      const cartItems: any[] = [];
      let precioTotal = 0; // Inicializar la variable para el total del precio
      let productosTotales = 0; // Inicializar la variable para el total del precio

      // Recorrer los documentos de la subcolección y extraer la información del producto
      cartSnapshot.forEach(doc => {
        const productData = doc.data();
        const quantity = productData['cantidad'];
        const price = productData['precio'];
        const tptxt = productData['tptxt'];

        cartItems.push({
          id: doc.id,
          name: productData['nombre'],
          price: price,
          category:productData['category'],
          quantity: quantity,
          tptxt: tptxt,
        });

        // Sumar el precio total por la cantidad de cada producto
        precioTotal += price * quantity;
        productosTotales += quantity;
      });

      // Asignar los productos al array que usa *ngFor
      this.arrayCartWpp = cartItems;
      // Asignar el total del precio
      this.precio = precioTotal;

      // Log para depuración
      console.log('Número de elementos en el carrito:', itemCount);
      console.log('Total del precio del carrito:', precioTotal);
    }, (error) => {
      console.error('Error al escuchar cambios en el carrito:', error);
    });
  } catch (error) {
    console.error('Error al establecer el listener para el carrito:', error);
  }

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


@ViewChild('chatScroll') chatScroll!: ElementRef<HTMLDivElement>;
@ViewChild('chatContent', { static: false }) chatContent!: IonContent;

@ViewChild('content', { static: false }) content!: IonContent;
  @ViewChild('bottom') bottom!: ElementRef;

  

ScrollToBottom() {
 
  if (this.bottom) {
    this.bottom.nativeElement.scrollIntoView({ behavior: 'auto' });
  }


    setTimeout(() => {
      this.myContent.scrollToBottom(0);
   }, 500);
   setTimeout(() => {
    this.myContent.scrollToBottom(0);
 }, 1000);
 setTimeout(() => {
  this.myContent.scrollToBottom(0);
}, 1500);
  

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
 async enviarDatos() {
  const alert = await this.alertController.create({
    header: 'Ingresar precio',
    message: '¿Cuánto deseas pagar? (MXN)',
    inputs: [
      {
        name: 'precio',
        type: 'number',
        placeholder: 'Ej. 100',
      },
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
      },
      {
        text: 'Aceptar',
        handler: (data:any) => {
          const precio = Number(data.precio);

          if (!precio || precio <= 0) {
            console.error('Precio inválido');
            return; // evita que se cierre el alert
          }

          const body = {
            uid: this.uid,
            monto: precio * 100, // Stripe trabaja en centavos
            creditos: 1,
            vencimiento: 30,
          };

          console.log(body);

          this.http.post('https://us-central1-the-business-chat.cloudfunctions.net/enlaceDinamicoPrecio', body)
            .subscribe((response: any) => {
              this.bodytxt = response['url'];
              // window.location.href = response['url']; // redirigir si quieres
            }, error => {
              console.error(error);
            });
        },
      },
    ],
  });

  await alert.present();
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
  
  window.AndroidApp.downloadImage(url);

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

  isLargeScreen = false
    checkScreenSize() {
    this.isLargeScreen = window.innerWidth >= 1100; // O el tamaño que prefieras
  }


sendMessagex() {
 
  try {
    // Validación de campo vacío
    if (!this.bodytxt || this.bodytxt.trim() === '') {
      this.showToast('Campo vacío, escriba un mensaje');
      return;
    }

    // Intentar reproducir sonido
    try {
      const audio = new Audio('../../../assets/icon/Dew-drops-original.mp3');
      audio.loop = false;
      audio.play();
    } catch (e) {
      alert(e)
      console.warn('No se pudo reproducir el audio', e);
    }

    // Agregar mensaje a la conversación local
    this.conversations.push({
      type: "text",
      interactive: { body: { text: this.bodytxt } }
    });

    this.setArray('myArrayKey' + this.uidtipster, this.conversations);
    this.ScrollToBottom();

    // Datos a enviar
    const dataClient = {
      Text: this.bodytxt,
      Phone: this.uidtipster,
      Tk: this.tkUser,
      PhBs: this.phid,
      Ph: this.ph
    };

    console.log("📤 Enviando mensaje:", dataClient);

    // Limpiar input
    this.bodytxt = '';

    // Enviar al backend
    this.sendMsgWhatsApp(dataClient);
  } catch (error: any) {
    console.error("❌ Error en sendMessageWpp:", error);
    alert("Ocurrió un error al enviar el mensaje: " + (error.message || error));
  }
}
sendMessageWpp(event:any) {
    event.preventDefault();
  event.stopPropagation();

  try {
    // Validación de campo vacío
    if (!this.bodytxt || this.bodytxt.trim() === '') {
      this.showToast('Campo vacío, escriba un mensaje');
      return;
    }

    // Intentar reproducir sonido
    try {
      const audio = new Audio('../../../assets/icon/Dew-drops-original.mp3');
      audio.loop = false;
      audio.play();
    } catch (e) {
      alert(e)
      console.warn('No se pudo reproducir el audio', e);
    }

    // Agregar mensaje a la conversación local
    this.conversations.push({
      type: "text",
      interactive: { body: { text: this.bodytxt } }
    });

    this.setArray('myArrayKey' + this.uidtipster, this.conversations);
    this.ScrollToBottom();

    // Datos a enviar
    const dataClient = {
      Text: this.bodytxt,
      Phone: this.uidtipster,
      Tk: this.tkUser,
      PhBs: this.phid,
      Ph: this.ph
    };

    console.log("📤 Enviando mensaje:", dataClient);

    // Limpiar input
    this.bodytxt = '';

    // Enviar al backend
    this.sendMsgWhatsApp(dataClient);
  } catch (error: any) {
    console.error("❌ Error en sendMessageWpp:", error);
    alert("Ocurrió un error al enviar el mensaje: " + (error.message || error));
  }
}
bannerFile: File | null = null;
logoFile: File | null = null;
async onFileSelected(event: any, type: 'logo' | 'banner') {
  const file = event.target.files[0];
 
  if (!file) return;
this.actualTypeSend = "img"
  this.imgSys = false
    this.imgSysKeyboard = true
document.getElementById('backgroundCrop')!.style.display = 'block'   
  
  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
 

    // Si la resolución es correcta, guarda el archivo y crea la vista previa
    if (type === 'logo') {
      this.logoFile = file;
      this.createImagePreview(file, 'logo');
    } else if (type === 'banner') {
      this.bannerFile = file;
      this.createImagePreview(file, 'banner');
    }
  };
}
logoPreview: string | null = null; // Para la vista previa del logo
bannerPreview: string | null = null; 
  clickInputFile(){
    document.getElementById("inputFile")?.click()
  }
private createImagePreview(file: File, type: 'logo' | 'banner') {

  const reader = new FileReader();
  reader.onload = () => {
    if (type === 'logo') {
      this.logoPreview = reader.result as string;
     
    } else if (type === 'banner') {
      this.bannerPreview = reader.result as string;
    }
  };
  reader.readAsDataURL(file);

     

}
logoUrl:any
  async uploadImage(file: File, type: 'logo' | 'banner'): Promise<string> {
    const storageRefx = storageRef(this.storage, `chatimgs/${type}_${Date.now()}_${file.name}`);
    
    // Subir el archivo
    await uploadBytes(storageRefx, file);
    
    // Obtener la URL de descarga
    const downloadURL = await getDownloadURL(storageRefx);
    return downloadURL;
  }
  
async uploadImg() {
  this.logoUrl = this.logoFile ? await this.uploadImage(this.logoFile, 'logo') : null;
  localStorage.setItem('imgnow', this.logoUrl!);
  await this.sendImg()
  return
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

sendPdfPromo(url:any){

  this.srcSendImg = url
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

onArrowClick(message: any) {
  console.log("Click en la flecha", message);
  // Aquí haces lo que quieras:
  // abrir menú
  // mostrar popover
  // reenviar mensaje
}


downloadDoc(url:any){
    this.URLDOCUMENT = url
  
    console.log(url)
    location.href = this.URLDOCUMENT;

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
    color:'dark',
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
 sendFlow() {
    const data = {
      PhId: this.phid,
      Phone: this.uidtipster,
      Receptor: this.ph,
      Tk: this.tkUser,
      flow: "762276739692696",
      arrayProduct: {
        name: "Nombre del producto",
        desc: "Descripción del producto",
        precio: "$120",
        img: "https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_960_720.jpg",
        dir: "Calle 123, Col. Centro",
        subtotal: "$120",
        envio: "$35",
        total: "$155",
        idflow: "ID_GENERADO" // puedes dejar fijo o generar dinámicamente
      },
      cartItems: [
        {
          id: "ITEM_ID",
          name: "Platano frito",
          category: "Postres",
          price: 35,
          quantity: 1,
          tptxt: "(1) Con todo",
          comision: 10,
          direccionBs: "zona norte",
          distancia: 5
        }
      ],
      packages: [
        {
          id: "1",
          title: "Tropical Beach Vacation",
          description: "Enjoy 7 nights...",
          total: 155,
          "alt-text": "beach vacation"
        }
      ],
      uid: "USER_ID"
    };

    this.http.post('https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/sendWppFlowServer', data)
      .subscribe({
        next: (res) => console.log('Flow enviado:', res),
        error: (err) => console.error('Error enviando flow:', err)
      });
  }
   sendFlowReczon() {
    const data = {
      PhId: this.phid,
      Phone: this.uidtipster,
      Receptor: this.ph,
      Tk: this.tkUser,
      flow: "922973976729490",
      arrayProduct: {
        name: "Nombre del producto",
        desc: "Descripción del producto",
        precio: "$120",
        img: "https://firebasestorage.googleapis.com/v0/b/the-business-chat.appspot.com/o/73dobEnTlHSrLpoL6LSJ0x7D7zt2%2F93efb4de-cfb3-4bc3-944d-eace32cd0d06%20(1).png?alt=media&token=b305e88e-6f20-4411-a967-6f7a46375ef4",
        dir: "Calle 123, Col. Centro",
        subtotal: "$120",
        envio: "$35",
        total: "$155",
        idflow: "ID_GENERADO" // puedes dejar fijo o generar dinámicamente
      },
      uid: this.uid
    };

    this.http.post('https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/sendWppFlowServer', data)
      .subscribe({
        next: (res) => console.log('Flow enviado:', res),
        error: (err) => console.error('Error enviando flow:', err)
      });
  }
  getLocationUser(){
    const monto = this.uidtipster; // El monto que deseas enviar
    const admin = this.phoneNumberAdmin;
    
    const data = {
      monto,
      admin
    };
    console.log(data)
    this.http.post('https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/getLocationUser', data)
    .subscribe((response:any) => {
      //console.log(this.locations)
      console.log(response)
      console.log(response[0])
      this.Lat = response[1]
      this.Lng = response[0]
      this.ubicacion = response[2]
      this.ind = response[3] || ""
      this.costoEnvio = response[4]
      this.suc = response[5]
      this.restaurantId = response[6] || ""
      console.log(this.restaurantId)
      if(this.restaurantId === ""){
        if(this.suc.includes("Madero")){
         this.restaurantId = "michelotes-madero"
        }
        if(this.suc.includes("Norte")){
          this.restaurantId = "michelotes"
        }
        if(this.suc.includes("Toyama")){
          this.restaurantId = "toyama"
        }
      }
    
      return response

    }, error => {
      console.error(error);
    });

  }
sendMsgWhatsApp(data: any) {
  this.http.post(
    'https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/sendWppFast',
    data
  ).subscribe({
    next: (response) => {
      console.log(response);
    },
    error: (err) => {
      console.error(err);

      // Si la API devuelve un mensaje en err.error
      if (err.error && err.error.message) {
        alert("Error: " + err.error.message);
      } else if (err.message) {
        alert("Error: " + err.message);
      } else {
        alert("Ocurrió un error inesperado, revisa la consola.");
      }
    }
  });
}


 getDiaActualDesdeFirestore(timestamp: Timestamp): string {
    const fecha = timestamp.toDate(); // Convierte el timestamp a Date
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return diasSemana[fecha.getDay()];
  }
   getHoraActualDesdeFirestore(timestamp: Timestamp): string {
    const fecha = timestamp.toDate(); // Convertir Firestore Timestamp a Date
    return fecha.toTimeString().slice(0, 5); // Formato "HH:mm"
  }
restaurantId = ""
  async loadCategorias() {
    console.log(this.restaurantId);
    const timestampFirestore = Timestamp.now();
    console.log(this.getDiaActualDesdeFirestore(timestampFirestore)); // Ejemplo: "Miércoles"
    var currentDay = this.getDiaActualDesdeFirestore(timestampFirestore)
    var currentHora = this.getHoraActualDesdeFirestore(timestampFirestore)
    // Obtiene la colección de categorías del restaurante
   
    this.firestore.collection<YourCategoryModel>(`businesses/${this.restaurantId}/categories`)
      .valueChanges({ idField: 'id' })
      .subscribe(data => {
        if (data && data.length) {
          console.log('Categories:', data);

          setTimeout(() => {
            this.itemCountCategories = 1;

              }, 100);

          this.categories = data; // Asigna los datos si existen
                
            for (const category of this.categories!) {
          console.log('Category:', category);

          // Productos de la categoría principal
          if (category.products && Array.isArray(category.products)) {
            for (const product of category.products) {
              this.checkProductFlagsAndSchedule(product, category, currentDay, currentHora);
            }
          }

          // Productos de las subcategorías
          if (category.subcategorias && Array.isArray(category.subcategorias)) {
            for (const sub of category.subcategorias) {
              console.log('Subcategoria:', sub);

              if (sub.products && Array.isArray(sub.products)) {
                for (const product of sub.products) {
                  this.checkProductFlagsAndSchedule(product, category, currentDay, currentHora);
                }
              }
            }
          }
        }

          
     console.log(this.categories)
        } else {
        setTimeout(() => {
          this.itemCountCategories = 0;
              
            }, 1000);
          console.warn('No categories found for the given restaurant.');
          this.categories = null; // Maneja el caso como desees
        }
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
activeExclusivo = false
activeRestaurante = true
activePromo = false
activeDestacado = false
private checkProductFlagsAndSchedule(product: any, category: any, currentDay: string, currentHora: string) {
  // 1. Si no existe dias → producto activo
  if (!product.dias || !Array.isArray(product.dias) || product.dias.length === 0) {
    product.active = true;
    return;
  }

  // 2. Buscar el día actual
  const diaActual = product.dias.find((dia: any) => dia.name === currentDay);

  // Si no existe el día → inactivo
  if (!diaActual) {
    product.active = false;
    return;
  }

  // 3. Si está deshabilitado → inactivo
  if (!diaActual.selected) {
    product.active = false;
    return;
  }

  // 4. Si no hay horario → activo
  if (!diaActual.startTime || !diaActual.endTime) {
    product.active = true;
    return;
  }

  // 5. Comparar horarios
  const horaActualMin = this.convertToMinutes(currentHora);
  const horaInicioMin = this.convertToMinutes(diaActual.startTime);
  const horaFinMin = this.convertToMinutes(diaActual.endTime);

  if (horaActualMin >= horaInicioMin && horaActualMin <= horaFinMin) {
    product.active = true;
  } else {
    product.active = false;
  }

    if (product.Disc > 0) {
    this.activePromo = true;
    category.show = true;
  }
  if (product.exclusivo === true) {
    this.activeExclusivo = true;
    category.show = true;
  }
  if (product.destacado === true) {
    this.activeDestacado = true;
    category.show = true;
  }
}
private convertToMinutes(hora: string): number {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
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




