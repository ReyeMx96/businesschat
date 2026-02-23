import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { get, getDatabase, onValue, ref, remove, update } from 'firebase/database';
import { collection, getDocs, getFirestore, limit, onSnapshot, orderBy, query } from 'firebase/firestore';

@Component({
  selector: 'app-conversations-list',
  templateUrl: './conversations-list.page.html',
  styleUrls: ['./conversations-list.page.scss'],
})
export class ConversationsListPage implements OnInit {
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
  private dbFirestore = getFirestore();

  private db = getDatabase();
  private auth = getAuth();

  constructor(
    public loadingController: LoadingController,
    public alertController: AlertController,
    private router: Router,
    private zone: NgZone,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.fechaActual = new Date().toLocaleDateString('en-CA').replace(/-/g, '');
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

getRecentsFirestore() {
  const msgsRef = collection(this.dbFirestore, "Recents", "5218333861194", "messages");

  const q = query(
    msgsRef,
    orderBy("tst", "desc"),
    limit(10)
  );

  // Suscríbete en tiempo real
  onSnapshot(q, (snapshot) => {
    this.menuOptionsCache = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      const date = data['tst']?.toDate ? data['tst'].toDate() : null;

      let timeString = "";
      if (date) {
        const hour = date.getHours().toString().padStart(2, "0");
        const minute = date.getMinutes().toString().padStart(2, "0");
        timeString = `${hour}:${minute}`;
      }

      const dataWithImg = {
        id: doc.id,
        ...data,
        tstlast: timeString,
        img: this.getRandomImage(),
      };

      this.menuOptionsCache.push(dataWithImg);
    });

    console.log('Recents updated from Firestore', this.menuOptionsCache);
    this.menuLength = this.menuOptionsCache.length;
  });
}


  ionViewDidEnter() {
    //this.getRecentsFirestore()
    this.menuLength = 0;
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.user = user.uid;
        localStorage.setItem('UID', user.uid);
        const userRef = ref(this.db, `UsersBusinessChat/${user.uid}`);
        get(userRef).then((snap) => {
          const res = snap.val();
          this.businessFinal = res?.SelectedPh || '';
          this.phoneNumberAdmin = res?.SelectedPh || '';
          console.log(this.businessFinal)
          console.log(this.phoneNumberAdmin)
          this.getRecentsFirestore()
          //this.getUserRecents();
          
          console.log('Recents loaded from Firestore', this.menuOptions);
          //this.getTags();
          this.getTagsFirestore()
        });
      } else {

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
    this.router.navigate(['/chat/' + contact, { replaceUrl: true }]);
  }

getRandomImage(): string {
  const index = Math.floor(Math.random() * 4);
  //console.log('Random image index:', index);
  return `../../../assets/icon/cliente${index}.jpg`;
}
  async getUserRecents() {
    await this.loadingUser();

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

        for (const item of this.menuOptions) {
          item.Contact = item.to;

          const timestampServidor = item.tst;
          const fechaServidor = new Date(timestampServidor);
          const diferenciaTiempo = Date.now() - fechaServidor.getTime();
          const fechaCliente = new Date(Date.now() - diferenciaTiempo);

          const fechaFormateada = `${fechaCliente.getFullYear()}/${('0' + (fechaCliente.getMonth() + 1)).slice(-2)}/${('0' + fechaCliente.getDate()).slice(-2)} ${('0' + fechaCliente.getHours()).slice(-2)}:${('0' + fechaCliente.getMinutes()).slice(-2)}`;

          const [fecha, hora] = fechaFormateada.split(' ');
          item.fecha = fecha.replace(/\//g, '-');
          item.hr = hora;
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
            console.log('Adding item to cache:', item);
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

        setTimeout(() => this.loadingController.dismiss(), 2000);
      });
    });
  }

  async loadingUser() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      message: 'Cargando historial de conversaciones...',
    });
    await loading.present();
  }


async getTagsFirestore() {
  const db = getFirestore();
  console.log(this.businessFinal)
  // 👉 Nueva ruta: Tags/{businessFinal}/list
  const tagsRef = collection(db, "Tags", this.businessFinal.toString(), "list");

  // Ejecuta la consulta para traer todos los documentos
  const snapshot = await getDocs(tagsRef);

  const array: any[] = [];

  snapshot.forEach((doc) => {
    // Si quieres incluir el ID del doc:
    array.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  this.zone.run(() => {
    this.arrayTags = array;
  console.log("Tags from firestore:",this.arrayTags)

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
      header: 'Agregar nuevo contacto',
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
            const numberWithPrefix = '521' + data.numero;
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
    this.getTagsFirestore();

    setTimeout(() => {
      event.target.complete();
    }, 3000);
  }
}
