import { Component, HostListener, inject, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { collection, doc, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import { AlertController, LoadingController, MenuController, ModalController, Platform, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { get, getDatabase, off, onValue, ref, remove, update } from 'firebase/database';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { FlowComponent } from './control/flow/flow.component';
import { PushService } from './push.service';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { filter } from 'rxjs';
type Order = {
  Todos: string;
  Nuevo: string;
  'En proceso..': string;
  'Pedido listo para recoger': string;
  Enviado: string;
  Terminado: string;
  Cancelado: string;
};
export interface Restaurant {
  id?: string; // Opcional para el ID
  nombre: string;
  forceClose: boolean;
  direccion: string;
  direccionBs: string;
  banner:string;
  uid:string;
  logo:string;
  telefono: string;
  currentLat:Number,
  currentLng:Number,
  activo:boolean;
  key:string
  // Agrega otros campos según sea necesario
}
interface Marca {
  id: number;
  nombre: string;
  direccion: string;
  idrepa:string;
  telefono: string;
  imgTrans : string;
  correo: string;
  clasificacion: string;
  servicio: string;
  estado: string;
  tfll:string;
  channel:string;
  status:string;
}interface UserData {
  phone?: string;
  uid?: string;
  cred?: string;
  nombre?: string;
  rol? : string;
}
type Pedido = {
  id: string;
  canal: string;
  status: string;
  tiempoPreparacion: string;
  tiempoCompra: string;
  cantidad: string;
  modoEnvio: string;
  cliente: string;
  tiempoFinalizacion: string;
  address: string;
};

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})

export class AppComponent {
  business = ''
  user:any
  menuOptionsCache: any = []
  firstTime = true
  businessDesc = ''
  public menuOptions : any = [


  ];
  
  menuOptionsContactos: any = []
  phoneNumberAdmin = ""
  businessFinal= ""
   menuLength: number = 0;
  uidcheck = true
  optionsArray:any = []
  fechaActual:any
  version = "5.2"
  estaLogueado = false
  arrayNumbers : any = []
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(private messagingService: PushService,private modalCtrl: ModalController,
    private afAuth: AngularFireAuth,public alertController: AlertController, 
    private toastController: ToastController, private afMessaging: AngularFireMessaging,
    private menu: MenuController,private router: Router, private http: HttpClient, 
    private platform: Platform,public loadingController: LoadingController, private authSv: AuthService,
     private zone: NgZone) {
      console.log(this.version)
         
        this.fechaActual = new Date().toLocaleDateString('en-CA').replace(/-/g, '');
   
     // this.openFlowModal() 
      this.updateListComponent()
    if (this.business === null || this.business === 'null')
    {
          setTimeout(() => {
    
        this.zone.run(async () => {
       
          this.business = localStorage.getItem('Business')!
          console.log(this.business)
          for ( var i = 0 ; i < 20;i++){
            this.business = this.business.replace(' ','')
        }
      
          })

            }, 3000);
    }else{
      for ( var i = 0 ; i < 20;i++){
        this.business = this.business.replace(' ','').toLowerCase()
    }
  
    }
    console.log(this.business)
  
         this.afAuth.authState.subscribe(user => {
      if (user) {
             this.estaLogueado = true

      const uid = user.uid;
      this.user = uid;
      console.log(this.user)
      localStorage.setItem('UID', uid);
      const db = getDatabase();
      const businessRef = ref(db, `UsersBusinessChat/${uid}`);
      onValue(businessRef, (snapshot) => {
        const res = snapshot.val();
        const array: string[] = [];
        for (const key in res.Auth) {
          array.push(res.Auth[key].Ph);
        }
        console.log
        this.arrayNumbers = array;

        this.businessFinal = res['SelectedPh'] || "";
        this.phoneNumberAdmin = res['SelectedPh'] || "";
    
        setTimeout(() => {
        this.requestPermission(this.phoneNumberAdmin)
        }, 20000);

        console.log(this.businessFinal)
        console.log(this.phoneNumberAdmin)
        // Aquí puedes llamar tus métodos relacionados si los necesitas:
        // this.getUserMenuEnterprise();
         this.getUserRecents();
       // this.borrarRutaUndefined()

         this.getTags()
      });
    } else {
      this.estaLogueado = false

      if (localStorage.getItem('KeyTemporal') == null) {
        const tempKey = Math.random().toString(36).substring(2, 15) + 
                        Math.random().toString(36).substring(2, 15);
        localStorage.setItem('KeyTemporal', tempKey);
        localStorage.setItem('UID', 'null');
        // Opcional: emitir evento
        // this.events.publishSomeDataCredentials({Logged: false,Next:false,Uid: tempKey,Admin:false});
      } else {
        localStorage.setItem('UID', 'null');
        this.zone.run(() => {
          this.uidcheck = false;
        });
        // Ya hay KeyTemporal
        // this.events.publishSomeDataCredentials({Logged: false,Next:false,Uid: localStorage.getItem('KeyTemporal'),Admin:false});
      }
    }
    });

          this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects;
        console.log('📍 Ruta actual:', this.currentRoute);
        const routeIconMap: { path: string; icon: string }[] = [
          { path: '/stats/', icon: 'stats' },
          { path: '/inventario/', icon: 'inventario' },
          { path: '/pedidos-history/', icon: 'pedidos-history' },
          { path: '/punto-venta/', icon: 'punto-venta' },
          { path: '/adx-pro', icon: 'adx-pro' },
          { path: '/settings/', icon: 'settings' },
          { path: '/tabs/conversations', icon: 'chat' },
          { path: '/panel', icon: 'pedidos' },
          { path: '/login', icon: 'login' },
          { path: '/inicio', icon: 'inicio' },
          { path: '/mision-y-vision', icon: 'mision-y-vision' },
          
          { path: '/precios', icon: 'precios' },
          { path: '/contacto', icon: 'contacto' },
          { path: '/como-funciona', icon: 'como-funciona' },
          { path: '/tabs/panel', icon: 'pedidos' },
          { path: '/clientes', icon: 'clientes' },
          { path: '/adx-media', icon: 'adx-media' },
          { path: '/marketing', icon: 'marketing' },
          { path: '/adx-pro', icon: 'adx-pro' },
          { path: '/solicitar-repa', icon: 'solicitar-repa' },
          { path: '/inventario-punto/', icon: 'inventario-punto' },

          
        ];
        // Buscar coincidencia
        const match = routeIconMap.find(r =>
          this.currentRoute.startsWith(r.path)
        );

  if (match) {
    if(match.path === '/tabs/conversations'  || match.path === '/panel/'   ){
  this.selectedIcon = match.icon;

    }else {
  this.selectedIcon = match.icon;

  this.changeMenuWidth('15%');
  this.conversationsBoolean = false;
  this.sizeMenu = '12';
    }

} else {
  this.selectedIcon = '';
}
      });
  }
currentRoute:any
 goBsStudio() {
  window.open("https://business-studio.com.mx", "_blank");
}
getOptions() {
    document.getElementById('selectChangeX')?.click();
  }
 async selectOption(event: any) {
    const selectedOption = event.detail.value;
    const refUpdate = ref(this.db, `UsersBusinessChat/${this.user}`);
    await update(refUpdate, { SelectedPh: selectedOption });

    const alert = await this.alertController.create({
      header: 'Cambiaste de número.',
      message: 'Seleccionaste: ' + selectedOption,
      buttons: ['OK'],
    });

    window.location.reload();
    await alert.present();
  }
  goConfig(){
    
    this.router.navigate(['/tabs/control/'+ this.user]);
    this.closeMenu()
 //   localStorage.setItem('ConfigAnswer', JSON.stringify(item) )
}
  selectedIcon: string = ''; // guarda cuál está activo
  playNotificationSound() {
    const audio = new Audio('../../../assets/icon/levelup.mp3'); // Reemplaza con la ruta de tu archivo de sonido
  setTimeout(() => {
    audio.play().catch(error => console.error('Error al reproducir el sonido:', error));
  }, 1900);
  }
  async openFlowModal() {
  const modal = await this.modalCtrl.create({
    component: FlowComponent,
    cssClass: 'flow-modal'
  });

  await modal.present();
}
sizeMenu = "4.8"
conversationsBoolean = true
  selectIcon(icon: string, route: string) {
    if(icon !== 'pedidos' && icon !== 'punto-venta'  && icon !== 'gpt-control' && icon !== 'inventario-punto'  && icon !== 'stats'){
    this.selectedIcon = icon;
    this.router.navigate([route]);
    this.menu.close()
    }
      if(icon === 'inicio'){
          this.changeMenuWidth('55%');
        this.conversationsBoolean = true
        this.sizeMenu = "4.8"
    }
      if(icon === 'como-funciona'){
          this.changeMenuWidth('55%');
        this.conversationsBoolean = true
        this.sizeMenu = "4.8"
    }
      if(icon === 'precios'){
          this.changeMenuWidth('55%');
        this.conversationsBoolean = true
        this.sizeMenu = "4.8"
    }
      if(icon === 'mision-y-vision'){
          this.changeMenuWidth('55%');
        this.conversationsBoolean = true
        this.sizeMenu = "4.8"
    }
      if(icon === 'contacto'){
          this.changeMenuWidth('55%');
        this.conversationsBoolean = true
        this.sizeMenu = "4.8"
    }
    if(icon === 'chat'){
          this.changeMenuWidth('55%');
        this.conversationsBoolean = true
        this.sizeMenu = "4.8"
    }
        if(icon === 'solicitar-repa'){
          this.changeMenuWidth('15%');
        this.conversationsBoolean = false
        this.sizeMenu = "12"
    }

         if(icon === 'inventario-punto'){
          this.changeMenuWidth('15%');
        this.conversationsBoolean = false
        this.sizeMenu = "12"
    }
      if(icon === 'inventario'){
          this.changeMenuWidth('15%');
        this.conversationsBoolean = false
        this.sizeMenu = "12"
    }
        if(icon === 'pedidos' || icon === 'pedidosx'){
          this.changeMenuWidth('55%');
        this.conversationsBoolean = true
        this.sizeMenu = "4.8"
    }
        if(icon === 'pedidosxx'){
          this.changeMenuWidth('15%');
        this.conversationsBoolean = false
        this.sizeMenu = "12"
    }
      if(icon === 'gpt-control'){
          this.changeMenuWidth('15%');
        this.conversationsBoolean = false
        this.sizeMenu = "12"
    }
        if(icon === 'stats'){
          this.changeMenuWidth('15%');
        this.conversationsBoolean = false
        this.sizeMenu = "12"
    }
   
        if(icon === 'settings'){
          this.changeMenuWidth('15%');
        this.conversationsBoolean = false
        this.sizeMenu = "12"
    }

    
    
        if(icon === 'adx-media'){
          this.changeMenuWidth('15%');
        this.conversationsBoolean = false
        this.sizeMenu = "12"
    }
        if(icon === 'adx-pro'){
          this.changeMenuWidth('15%');
        this.conversationsBoolean = false
        this.sizeMenu = "12"
    }

    
       if(icon === 'marketing'){
          this.changeMenuWidth('15%');
        this.conversationsBoolean = false
        this.sizeMenu = "12"
    }
    
  if(icon === 'gpt-control'){
    this.selectedIcon = icon;
    var leti  = ""
  
    this.router.navigate([route + this.businessFinal.toString()]);
    this.menu.close()
  }


  if(icon === 'settings'){
    this.selectedIcon = icon;
    var leti  = ""
    console.log(this.businessFinal)
    if(this.businessFinal.toString() === "5218333861194"){
        leti = "michelotes"
    }
    if(this.businessFinal.toString() === "5218334460818"){
        leti = "toyama"
    }
       if(this.businessFinal.toString() === "5218332367397"){
        leti = "abe-abe-germinal"
    }
    this.router.navigate([route + leti]);
    this.menu.close()
    }

   if(icon === 'pedidos'){
    this.selectedIcon = icon;
    var leti  = ""
    console.log(this.businessFinal)
    if(this.businessFinal.toString() === "5218333861194"){
        leti = "michelotes"
    }
    if(this.businessFinal.toString() === "5218334460818"){
        leti = "toyama"
    }
    if(this.businessFinal.toString() === "5218332367397"){
        leti = "abe-abe-germinal"
    }
    this.router.navigate([route + leti]);
    this.menu.close()
    }
  if(icon === 'stats'){
    this.selectedIcon = icon;
    var leti  = ""
    console.log(this.businessFinal)
    if(this.businessFinal.toString() === "5218333861194"){
        leti = "michelotes"
    }
    if(this.businessFinal.toString() === "5218334460818"){
        leti = "toyama"
    }
  if(this.businessFinal.toString() === "5218333096367"){
        leti = "tortas-lalo"
    }
    this.router.navigate([route + leti]);
    this.menu.close()
    }


      if(icon === 'punto-venta'){
    this.selectedIcon = icon;
    this.changeMenuWidth('15%');
        this.conversationsBoolean = false
        this.sizeMenu = "12"
    var leti  = ""
    console.log(this.businessFinal)
    if(this.businessFinal.toString() === "5218333861194"){
        leti = "michelotes"
    }
    if(this.businessFinal.toString() === "5218334460818"){
        leti = "toyama"
    }
  if(this.businessFinal.toString() === "5218333096367"){
        leti = "tortas-lalo"
    }
    this.router.navigate([route + leti]);
    this.menu.close()
    }

       if(icon === 'inventario-punto'){
    this.selectedIcon = icon;
    this.changeMenuWidth('15%');
        this.conversationsBoolean = false
        this.sizeMenu = "12"
    var leti  = ""
    console.log(this.businessFinal)
    if(this.businessFinal.toString() === "5218333861194"){
        leti = "michelotes"
    }
    if(this.businessFinal.toString() === "5218334460818"){
        leti = "toyama"
    }
      if(this.businessFinal.toString() === "5218333096367"){
        leti = "tortas-lalo"
    }

    this.router.navigate([route + leti + "?args=inventario"]);
    this.menu.close()
    }

  }
arrayTags : any = []
getColor(name: string): string {
  const colors = [
    "#F87171", // rojo
    "#FBBF24", // amarillo
    "#34D399", // verde
    "#60A5FA", // azul
    "#A78BFA", // morado
    "#F472B6", // rosa
    "#FACC15"  // dorado
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colors.length);
  return colors[index];
}
  async getTags() {

      const db = getDatabase();
     const tagsRef = ref(db, `ruta/${this.businessFinal}/Tags`);
     const snap = await get(tagsRef);
     const res = snap.val();
     const array: any[] = [];
 
     for (const key in res) {
       array.push(res[key]);
     }
 
     this.zone.run(() => {
       this.arrayTags = array;
     });
   }
  closeMenu(){
    this.menu.close()
  }
    async loadingUser() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      duration: 5000,
      message: 'Cargando historial de conversaciones...',
    });
    await loading.present();
  }
async removeGreen(p: any) {
  try {
    const db = getDatabase();
    const recentRef = ref(db, `ruta/Recents/${this.businessFinal}/${p.Contact}`);

    await update(recentRef, {
      last: "owner"   // ← quita el verde
    });

    // También puedes actualizar la UI local sin esperar el refresh
    p.last = "owner";

  } catch (e) {
    console.error("Error al quitar verde:", e);
  }
}
trackByContact(index: number, item: any) {
  return item.Contact || item.to;
}
  recentsRef:any
  async getUserRecents() {
    //  await this.loadingUser();
    if (this.recentsRef) {
          off(this.recentsRef); // 🔥 mata el listener anterior
        }
          // ✅ CREAR NUEVO REF
        this.recentsRef = ref(this.db, `ruta/Recents/${this.businessFinal}`);
    
    onValue(this.recentsRef, async (snap) => {
      const res = snap.val();
      const array: any[] = [];

      this.menuLength = 0;
      for (const i in res) {
        array.push(res[i]);
      }

      this.zone.run(async () => {
        this.menuOptions = array;
        this.menuOptionsCache = [];
       this.menuOptions = this.menuOptions.filter((item:any) => item?.to);

        console.log(this.menuOptions)

      //  this.playNotificationSound()
   for (const item of this.menuOptions) {
   
  item.Contact = item.to;

  const timestampServidor = item.tst;
  const fechaServidor = new Date(timestampServidor);
  const diferenciaTiempo = Date.now() - fechaServidor.getTime();
  const fechaCliente = new Date(Date.now() - diferenciaTiempo);

  const fechaFormateada = `${fechaCliente.getFullYear()}/${('0' + (fechaCliente.getMonth() + 1)).slice(-2)}/${('0' + fechaCliente.getDate()).slice(-2)} ${('0' + fechaCliente.getHours()).slice(-2)}:${('0' + fechaCliente.getMinutes()).slice(-2)}`;
  const [fecha, hora] = fechaFormateada.split(' ');

  item.fecha = fecha.replace(/\//g, '-');

  // ------------- NUEVA LÓGICA DE "ayer" y "día de la semana" -------------
  const hoy = new Date();
  const f = fechaCliente;

  // Quitar horas para comparar solo fechas
  const hoySinHora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const fechaSinHora = new Date(f.getFullYear(), f.getMonth(), f.getDate());

  const diffDias = (hoySinHora.getTime() - fechaSinHora.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDias < 1) {
    // mismo día → mostrar hora normal
    item.hr = hora;
  } else if (diffDias < 2) {
    // ayer
    item.hr = "ayer";
  } else {
    // más de 1 día → mostrar día de la semana
    const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    item.hr = diasSemana[f.getDay()];
  }
  // ------------------------------------------------------------------------
}

        this.menuOptions.sort((a:any, b:any) => b.tst - a.tst);
        this.menuLength = array.length;

        await Promise.all(
          this.menuOptions.map(async (item:any) => {
            if (!localStorage.getItem(item.to)) {
              const nombre = await this.getUserContacts(item.to);
              item.Nombre = nombre;
              localStorage.setItem(item.to, nombre);
            } else {
              item.Nombre = localStorage.getItem(item.to);
            }
          })
        );


        for (let item of this.menuOptions) {
          if (!item.Tag) {
            item.Tag = 'No tag';
          }
        }

        for (let i = 0; i < this.menuOptions.length; i++) {
          if (i < 350) {
            this.menuOptionsCache.push(this.menuOptions[i]);
          }
        }

        setTimeout(() => {
          for (let i = 350; i < this.menuOptions.length; i++) {
            const recentCacheRef = ref(this.db, `ruta/RecentsCache/${this.businessFinal}/${this.menuOptions[i].Contact}`);
            const recentRef = ref(this.db, `ruta/Recents/${this.businessFinal}/${this.menuOptions[i].Contact}`);

            update(recentCacheRef, this.menuOptions[i]);
            remove(recentRef);
          }
        }, 5000);

     //   setTimeout(() => this.loadingController.dismiss(), 2000);
      });
    });
  }

  async restoreRecentsFromCache() {
  const db = getDatabase();

  const cacheRef = ref(db, `ruta/RecentsCache/${this.businessFinal}`);

  onValue(cacheRef, async (snap) => {
    const cacheData = snap.val();
    if (!cacheData) return;

    for (const key in cacheData) {
      const item = cacheData[key];

      const recentRef = ref(
        db,
        `ruta/Recents/${this.businessFinal}/${item.Contact}`
      );

      // Copiar a Recents
      await update(recentRef, item);
    }

    console.log('✅ Recents restaurados desde cache');
  }, { onlyOnce: true });
}

// getUserRecents() {
//   const db = getDatabase();
//   const recentsRef = ref(db, `ruta/Recents/${this.businessFinal}`);
//   const oldMenuOptions = [...this.menuOptions]; // Almacena el estado anterior del array

//   console.log(this.businessFinal);

//   onValue(recentsRef, (snapshot) => {
//     const res = snapshot.val();
//     const array: any[] = [];
//     for (const i in res) {
//       array.push(res[i]);
//     }

//     this.zone.run(() => {
//       if (this.firstTime === true) {
//         this.firstTime = false;
//       } else {
//         this.showToast('Tienes un nuevo mensaje');
//         const audio = new Audio('../../../assets/icon/sound.mp3');
//         audio.loop = false;
//         audio.play();
//       }

//       console.log(this.menuOptions);
//       this.optionsArray = Object.keys(res);
//       this.menuOptions = array;

//       // Aquí podrías comparar array con oldMenuOptions si necesitas detectar diferencias
//       // Resto del código...
//     });
//   });
// }
  db = getDatabase();
  async getUserContacts(numb: string): Promise<string> {
 

    const contactRef = ref(this.db, `ruta/Contactos/${this.businessFinal}/${numb}`);
    const snap = await get(contactRef);
    const res = snap.val();
    return res?.Name || 'No registrado';
  }
getUserMenuEnterprise() {
  const db = getDatabase();
  const dbRef = ref(db, `ruta/Contactos/${this.businessFinal}`);

  console.log(this.businessFinal);

  onValue(dbRef, (snapshot) => {
    const res = snapshot.val();
    const array : any = [];

    for (const i in res) {
      array.push(res[i]);
    }

    this.zone.run(() => {
      console.log(this.menuOptions);
      this.optionsArray = Object.keys(res);
      this.menuOptions = array;

      for (let i = 0; i < this.menuOptions.length; i++) {
        this.menuOptions[i]['Contact'] = this.optionsArray[i];
      }

      console.log(this.menuOptions);
    });
  });
}

async addContact() {
  const alert = await this.alertController.create({
    header: 'Agregar nuevo contacto',
    inputs: [
      {
        name: 'nombre',
        type: 'text',
        placeholder: 'Nombre'
      },
      {
        name: 'numero',
        type: 'number',
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

          // Añadimos a la lista local
          this.menuOptions.push({ Contact: '521' + data.numero });

          // Actualizamos en Realtime Database usando la API modular
          const db = getDatabase();
          const contactPath = `ruta/Contactos/${this.phoneNumberAdmin}/521${data.numero}`;
          const contactRef = ref(db, contactPath);

          try {
            await update(contactRef, {
              Nombre: data.nombre,
              Phone: '521' + data.numero
            });
            this.showToast('Contacto agregado con éxito');
          } catch (err) {
            console.error('Error al agregar contacto:', err);
            this.showToast('Error al agregar el contacto');
          }
        }
      }
    ]
  });

  await alert.present();
}
  async sendPushDirect() {

    const token = 'dulIIzmDpLmth0inv_HhJH:APA91bFCnpUnhLruAv5vWiU3IFH_gPIsi1K7JPedgRIVV-9AJ7IEqblJuEWPYQhzKUsYq1PoKjE0NfNF2Muwq5Kbyo7LP8yaq31wI0JhCnPZGdLThmiWroA'; // tu token
    const title = '¡Hola!';
    const body = 'Este es un mensaje de prueba sin servicios';
fetch("https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/sendPushNotificationx", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    token: token,
    title: "Hola",
    body: "Mensaje de prueba"
  })
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));


  }
requestPermission(bot:any){
  this.messagingService.requestPermission(bot).subscribe(async token => {
    console.log(token)
    this.listenForMEssagesx()

  },

  async (err) => {
    console.log(err)
 // await alert.present()
  }
  )
} 
// async requestPermission() {
//   this.messagingService.requestPermission().subscribe(
//     async (token:any) => {
//       console.log(token);
//       const db = getDatabase();
//       const uid = localStorage.getItem('UID') || '';
//       const userRef = ref(db, `UsersBusinessChat/${uid}`);

//       try {
//         await update(userRef, { Token: token });
//         alert('Token agregado con éxito');
//       } catch (err) {
//         console.error('Error al guardar token:', err);
//         // Opcional: mostrar alerta de error
//       }
//     },
//     (err:any) => {
//       console.error('Error solicitando permiso:', err);
//       // Opcional: mostrar alerta de error
//     }
//   );
// }


//  listenForMEssages(){
//   this.afMessaging.onMessage((payload:any) => {
//     console.log('[firebase-messaging-sw.js class messaging onmesssage] Received background message ', payload);

//     const notificationTitle = "Foreground";
//     const notificationOptions = {
//       body: payload.notification.body,
//       icon: payload.notification.icon,
//       click_action:payload.notification.click_action
      
//     };  
//     //this.presentToastWithOptions(payload)
//   var n = new Notification(notificationTitle,notificationOptions);
 
//    n.onclick = function(event) {
//     event.preventDefault(); // Evita que el navegador enfoque la pestaña del Notification
//     window.open(payload.notification.click_action, '_blank');
//   }
//   setTimeout(n.close.bind(n), 5000);
//   });
// }

audio = new Audio('../../../assets/icon/livechat.mp3');
audioReady = false;

@HostListener('window:pointerdown')
unlockAudio() {
  console.log('Intentando desbloquear audio...');
  if (this.audioReady) return;

  this.audio.loop = false;
  this.audio.volume = 1;

  this.audio.play().then(() => {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.audioReady = true;
    console.log('🔊 Audio desbloqueado');
  }).catch(err => {
    console.warn('No se pudo desbloquear audio:', err);
  });
}

listenForMEssagesx() {
  this.afMessaging.onMessage((payload: any) => {

    console.log('Mensaje recibido en foreground:', payload);

    if (!this.audioReady) return;

    // 🔊 REUTILIZA el audio desbloqueado
    this.audio.currentTime = 0;
    console.log('Reproduciendo sonido de notificación');
    this.audio.play().catch(e =>
      console.log('Error reproduciendo audio:', e)
    );
  });
}


updateListComponent(){
  setTimeout(() => {
    
    this.zone.run(() => {
//   this.getFunctionContext()
    //  this.getUserMenuEnterprise()

      })

        }, 1500);
}

goTo(route:any){
  this.router.navigate(['/'+route ]);
  this.menu.close()

}
getFunctionContext(){

    const monto = "5218334502378"; // El monto que deseas enviar
    const admin = "52183334285513";
    const data = {
      monto,
      admin
  
    
    };

    this.http.post('https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/getLocationUser', data)
    .subscribe(response => {
    
      return response

    }, error => {
      console.error(error);
    });

  
}
sendNotifSafari(){
  if ('Notification' in window && navigator.permissions) {
    Notification.requestPermission().then(function(permission) {
      if (permission === 'granted') {
        alert('permiso concedido')
        // El permiso de notificación ha sido concedido
      } else {
        alert('permiso no concedido')

        // El permiso de notificación no ha sido concedido
      }
    });
  }
}
changeMenuWidth(width: string) {
  const menu = document.querySelector('ion-menu');
  if (menu) {
    (menu as HTMLElement).style.setProperty('--side-min-width', width);
  }
}


async showToast(message:any){
  const toast = await this.toastController.create({
    message,
    duration: 4000,
    position:'top',
    color:'dark',
    buttons: [

      {
        text: 'Ver mensajes',
        role: 'cancel',
        handler: () => {
          this.router.navigate(['/conversations']);
        
     toast.dismiss();
          }
      }
    ]
  });
  toast.present();
}
  logout(){
   this.authSv.logout()
    //this.popCtrl.dismiss()
    localStorage.setItem('UID','null')
    localStorage.setItem('Business',"null")
    window.location.reload()
  }
}
