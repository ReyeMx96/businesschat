import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, NavParams, ToastController } from '@ionic/angular';
import { getDatabase, ref, onValue, update, get, child, remove } from 'firebase/database';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { HttpClient } from '@angular/common/http';
declare const chrome: any;

export interface Restaurant {
  id?: string; // Opcional para el ID
  nombre: string;
  forceClose: boolean;
  direccion: string;
  direccionBs: string;
  banner:string;
  uid:string;
  logo:string;
  idprint:string;

  telefono: string;
  currentLat:Number,
  currentLng:Number,
  activo:boolean;
  key:string
  // Agrega otros campos según sea necesario
}
@Component({
  selector: 'app-resend-message',
  templateUrl: './resend-message.component.html',
  styleUrls: ['./resend-message.component.scss'],
})
export class ResendMessageComponent  implements OnInit {

 businessFinal: string = '';
  name: string = '';
  menuOptionsCache: any[] = [];
  menuOptionsContactos: any[] = [];
  ph: string = '';
  connect: string = '';
  menuLength: number = 0;
  phoneNumberAdmin: string = '';
  menuOptions: any[] = [];
  arrayNumbers: string[] = [];
  user: string = '';
  arrayTags: any[] = [];
  enableService: boolean = false;
  fechaActual: string = '';
  uid: string = '';

  private db = getDatabase();
  private auth = getAuth();

  constructor(
      private navParams: NavParams,
    private firestore: AngularFirestore,
    private http: HttpClient,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private router: Router,
    private modalController: ModalController,
    private zone: NgZone,
    private toastController: ToastController
  ) {}
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
  private extensionId = '559916'; // <-- reemplaza esto
selectedPhones: string[] = [];

enviarMasivo() {
  console.log("Enviar a:", this.selectedPhones);
  this.modalController.dismiss(this.selectedPhones)
}
closeModal(){
  this.modalController.dismiss()
}
  togglePhone(phone: string) {

  const index = this.selectedPhones.indexOf(phone);

  if (index === -1) {
    // ✅ Agregar número
    this.selectedPhones.push(phone);
  } else {
    // ✅ Quitar número si ya estaba
    this.selectedPhones.splice(index, 1);
  }

  console.log("Numeros seleccionados:", this.selectedPhones);
}


 probarExtension() {
    if (!chrome?.runtime) {
      console.log("chrome.runtime no disponible — ¿no estás en Chrome?");
      return;
    }

    chrome.runtime.sendMessage(
      this.extensionId,
      { action: 'alert' },
      (response: any) => {

        const error = chrome.runtime.lastError;
        if (error) {
          console.log("Error al enviar:", error.message);
        } else {
          console.log("Mensaje enviado a la extensión", response);
        }

      }
    );
  }
isLargeScreen = false
   checkScreenSize() {
    this.isLargeScreen = window.innerWidth >= 1200; // O el tamaño que prefieras
  }

receivedArray: any;

  ngOnInit() {
    const modalState = { modal: true, desc: 'fake state for our modal' };
    history.pushState(modalState, "null");
    this.receivedArray = this.navParams.get('dataArray');
console.log("ARRAY RECIBIDO EN MODAL:", this.receivedArray);

    this.fechaActual = new Date().toLocaleDateString('en-CA').replace(/-/g, '');
    this.checkScreenSize()
    onAuthStateChanged(this.auth, (user: User | null) => {
      if (user) {
        this.uid = user.uid;
        const userRef = ref(this.db, `UsersBusinessChat/${this.uid}`);
        onValue(userRef, (snap) => {
          const res = snap.val();
          if (!res?.Auth) {
            this.enableService = false;
          } else {
            this.enableService = true;
            const array: string[] = [];
            for (const key in res.Auth) {
              array.push(res.Auth[key].Ph);
            }
            this.zone.run(() => {
              this.arrayNumbers = array;
              this.ph = res.SelectedPh || '';
              this.name = res.Name || '';
           
              this.connect = res.Connect || '';
            });
          }
        });
      }
    });
  }
restaurantdetails:any
phoneRest:any
 async loadrestauranteCache() {
 alert(this.businessFinal)
  // Obtiene el documento del restaurante
  this.firestore.doc<Restaurant>(`restaurantes/${this.businessFinal}`)
    .valueChanges({ idField: 'id' })
    .subscribe(data => {
      if (data) {
       // console.log('Restaurant data:', data);
        this.restaurantdetails = data; // Asigna los datos si existen
        this.phoneRest = data.telefono


      } else {
        console.warn('No restaurant found with the given ID.');
      }
    });
  }
    playNotificationSound() {
    const audio = new Audio('../../../assets/icon/levelup.mp3'); // Reemplaza con la ruta de tu archivo de sonido
  setTimeout(() => {
    audio.play().catch(error => console.error('Error al reproducir el sonido:', error));
    
  }, 1900);
  }
  ionViewDidEnter() {
    this.menuLength = 0;
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.user = user.uid;
        localStorage.setItem('UID', user.uid);
        const userRef = ref(this.db, `UsersBusinessChat/${user.uid}`);
        get(userRef).then((snap) => {
          const res = snap.val();
          this.businessFinal = res?.SelectedPh || '';
       
        console.log(this.businessFinal)
          this.phoneNumberAdmin = res?.SelectedPh || '';
          this.getUserRecents();
          this.getTags();
        });
      } else {
        if (!localStorage.getItem('KeyTemporal')) {
          localStorage.setItem('KeyTemporal', Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2));
        }
        localStorage.setItem('UID', 'null');
      }
    });
  }

  async selectOption(event: any) {
    const selectedOption = event.detail.value;
    const refUpdate = ref(this.db, `UsersBusinessChat/${this.uid}`);
    await update(refUpdate, { SelectedPh: selectedOption });

    const alert = await this.alertController.create({
      header: 'Cambiaste de número.',
      message: 'Seleccionaste: ' + selectedOption,
      buttons: ['OK'],
    });

    window.location.reload();
    await alert.present();
  }

  async getUserContacts(numb: string): Promise<string> {
    const contactRef = ref(this.db, `ruta/Contactos/${this.businessFinal}/${numb}`);
    const snap = await get(contactRef);
    const res = snap.val();
    return res?.Name || 'No registrado';
  }

  async getUserTags(numb: string): Promise<string> {
    const tagRef = ref(this.db, `ruta/Contactos/${this.businessFinal}/${numb}`);
    const snap = await get(tagRef);
    const res = snap.val();
    return res?.Tag || 'No tag';
  }

  goChat(contact: string) {
    this.router.navigate(['/p/' + contact, { replaceUrl: true }]);
  }

getRandomImage(): string {
  const index = Math.floor(Math.random() * 4);
  return `../../../assets/icon/cliente${index}.jpg`;
}
  functions = getFunctions();
  deviceId = "ebd7b601a28511ca7ekrja"; // tu garage

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
API = "https:/us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk"; // cámbiala
openGarage() {
  this.http.post(`${this.API}/turnOnLight`, {
    deviceId: "ebd7b601a28511ca7ekrja" // cambia al tuyo
  }).subscribe(res => {
    console.log("Garage abierto:", res);
  });
}


closeGarage() {
  this.http.post(`${this.API}/turnOffLight`, {
    deviceId: "ebd7b601a28511ca7ekrja"
  }).subscribe(res => {
    console.log("Garage cerrado:", res);
  });
}


sendCommand() {
  const commands = [
    { code: "switch_1", value: true }
  ];

  this.http.post(`${this.API}/sendTuyaCommand`, {
    deviceId: "4235401524a160127d1d",
    commands
  }).subscribe(res => {
    console.log("Comando enviado:", res);
  });
}


  // ==== INFO ====
  getStatus() {
    httpsCallable(this.functions, "getDeviceStatus")({ deviceId: this.deviceId })
      .then(r => console.log("Status", r))
      .catch(console.error);
  }

  getFunctions() {
    httpsCallable(this.functions, "getDeviceFunctions")({ deviceId: this.deviceId })
      .then(r => console.log("Functions", r))
      .catch(console.error);
  }

  getDeviceInfo() {
    httpsCallable(this.functions, "getDeviceInfo")({ deviceId: this.deviceId })
      .then(r => console.log("Info", r))
      .catch(console.error);
  }

  getAllDevices() {
    httpsCallable(this.functions, "getAllDevices")({})
      .then(r => console.log("Devices", r))
      .catch(console.error);
  }

  // ==== MANAGEMENT ====
  removeDevice() {
    httpsCallable(this.functions, "removeDevice")({ deviceId: this.deviceId })
      .then(r => console.log("Removed", r))
      .catch(console.error);
  }

  rebootDevice() {
    httpsCallable(this.functions, "rebootDevice")({ deviceId: this.deviceId })
      .then(r => console.log("Reboot OK", r))
      .catch(console.error);
  }
   @HostListener('window:popstate', ['$event'])
    dismissModal() {
      this.modalController.dismiss();
    }
  async getUserRecents() {
    //await this.loadingUser();

    const recentsRef = ref(this.db, `ruta/Recents/${this.businessFinal}`);
    onValue(recentsRef, async (snap) => {
      const res = snap.val();
      const array: any[] = [];
      this.menuLength = 0;
      for (const i in res) {
        array.push(res[i]);
      }

      this.zone.run(async () => {
        this.menuOptions = array;
        this.menuOptionsCache = [];

        // for (const item of this.menuOptions) {
        //   item.Contact = item.to;

        //   const timestampServidor = item.tst;
        //   const fechaServidor = new Date(timestampServidor);
        //   const diferenciaTiempo = Date.now() - fechaServidor.getTime();
        //   const fechaCliente = new Date(Date.now() - diferenciaTiempo);

        //   const fechaFormateada = `${fechaCliente.getFullYear()}/${('0' + (fechaCliente.getMonth() + 1)).slice(-2)}/${('0' + fechaCliente.getDate()).slice(-2)} ${('0' + fechaCliente.getHours()).slice(-2)}:${('0' + fechaCliente.getMinutes()).slice(-2)}`;

        //   const [fecha, hora] = fechaFormateada.split(' ');
        //   item.fecha = fecha.replace(/\//g, '-');
        //   item.hr = hora;
        // }
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

        this.menuOptions.sort((a, b) => b.tst - a.tst);
        this.menuLength = array.length;

        for (let item of this.menuOptions) {
          try {
            if (!localStorage.getItem(item.to)) {
              const nombre = await this.getUserContacts(item.to);
              item.Nombre = nombre;
              localStorage.setItem(item.to, nombre);
            } else {
              item.Nombre = localStorage.getItem(item.to) || 'No registrado';
            }
          } catch (error) {
            console.error(error);
          }
        }

        for (let item of this.menuOptions) {
          if (!item.Tag) {
            item.Tag = 'No tag';
          }
        }

        for (let i = 0; i < this.menuOptions.length; i++) {
          if (i < 50) {
            //this.menuOptionsCache.push(this.menuOptions[i]);
            const item = {
              ...this.menuOptions[i],
              img: this.getRandomImage()
            };
            this.menuOptionsCache.push(item);
          } 
        }

        setTimeout(() => {
          for (let i = 50; i < this.menuOptions.length; i++) {
            const recentCacheRef = ref(this.db, `ruta/RecentsCache/${this.businessFinal}/${this.menuOptions[i].Contact}`);
            const recentRef = ref(this.db, `ruta/Recents/${this.businessFinal}/${this.menuOptions[i].Contact}`);

            update(recentCacheRef, this.menuOptions[i]);
            remove(recentRef);
          }
        }, 5000);

        //setTimeout(() => this.loadingController.dismiss(), 2000);
      });
   //   this.playNotificationSound()

    });
  }
  searchSort(event:any){
 
 
    }
  async loadingUser() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      message: 'Cargando historial de conversaciones...',
    });
    await loading.present();
  }

  async getTags() {
    const tagsRef = ref(this.db, `ruta/${this.businessFinal}/Tags`);
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

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'middle',
      color: 'danger',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => toast.dismiss(),
        },
      ],
    });

    toast.present();
  }

  async addContact() {
    const alert = await this.alertController.create({
      header: 'Agregar nuevo contacto a 10 digitos',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre',
        },
        {
          name: 'numero',
          type: 'number',
          placeholder: 'Número a 10 dígitos',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Aceptar',
          handler: (data) => {
            const numberWithPrefix = '521' + data.numero.toString().trim();
            this.menuOptions.push({ Contact: numberWithPrefix });
            const contactRef = ref(this.db, `ruta/Contactos/${this.phoneNumberAdmin}/${numberWithPrefix}`);
            update(contactRef, {
              Name: data.nombre,
              Num: numberWithPrefix,
            });
            
            this.router.navigate(['/p/' + numberWithPrefix, { replaceUrl: true }]);
          },
        },
      ],
    });

    await alert.present();
  }

  getOptions() {
    document.getElementById('selectChange')?.click();
  }

  doRefresh(event: any) {
    this.getUserRecents();
    this.getTags();

    setTimeout(() => {
      event.target.complete();
    }, 3000);
  }
}

