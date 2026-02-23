import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { get, getDatabase, onValue, ref, remove } from 'firebase/database';

@Component({
  selector: 'app-campaing-details',
  templateUrl: './campaing-details.page.html',
  styleUrls: ['./campaing-details.page.scss'],
})
export class CampaingDetailsPage implements OnInit {
  details:any = []
  detailsRes:any = []
  idCampaing:any = []
  efect = 0
  enviados = 0
  entregados =  0
  businessFinal = ""
  user:any
  reads = 0
  menuLength = 0
  constructor(private toastController: ToastController,
    private zone: NgZone,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.idCampaing = this.route.snapshot.paramMap.get('id')!.toUpperCase();

   const auth = getAuth();
const db = getDatabase();

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const uid = user.uid;
    this.user = uid;
    console.log(this.user);
    localStorage.setItem('UID', uid);
    
    try {
      const userBusinessRef = ref(db, `UsersBusinessChat/${uid}`);
      const snapshot = await get(userBusinessRef);

      if (snapshot.exists()) {
        const res = snapshot.val();
        const array = [];

        for (const i in res) {
          array.push(res[i]);
        }

        this.businessFinal = res['SelectedPh'];
        console.log(this.businessFinal);
        console.log(this.idCampaing);
        this.getCampaing(this.idCampaing);
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error getting user business data:', error);
    }

  } else {
    console.log('user no logueado');
    // this.router.navigate(['/login']);
  }
});



  }
async getCampaing(id: any) {
  const db = getDatabase(); // asegúrate de que tu app esté inicializada
  const rutaRef = ref(db, `ruta/Cmpgs/${this.businessFinal}/${id}`);

  onValue(rutaRef, async (snap) => {
    const res = snap.val();
    const array : any = [];

    for (const i in res) {
      array.push(res[i]);
    }

    this.zone.run(async () => {
      this.details = array;
      console.log(this.details);

      for (let i = 0; i < this.details.length; i++) {
        const timestampServidor = this.details[i]['tst'];
        const fechaServidor = new Date(timestampServidor);
        const diferenciaTiempo = Date.now() - fechaServidor.getTime();
        const fechaCliente = new Date(Date.now() - diferenciaTiempo);

        const fechaFormateada = fechaCliente.getFullYear() + '/' +
          ('0' + (fechaCliente.getMonth() + 1)).slice(-2) + '/' +
          ('0' + fechaCliente.getDate()).slice(-2) + ' ' +
          ('0' + fechaCliente.getHours()).slice(-2) + ':' +
          ('0' + fechaCliente.getMinutes()).slice(-2);

        const partes = fechaFormateada.split(" ");

        this.details[i]['tst'] = partes[1];
        this.details[i]['date'] = partes[0].replace("/", "-").replace("/", "-");
      }

      this.enviados = 0;
      this.entregados = 0;
      this.reads = 0;

      for (let i = 0; i < this.details.length; i++) {
        const nombre = await this.getUserContacts(this.details[i]['to']);
        this.details[i]['name'] = nombre;

        if (this.details[i]['st'] === "delivered") {
          this.entregados++;
        }
        if (this.details[i]['st'] === "sent") {
          this.enviados++;
        }
        if (this.details[i]['st'] === "read") {
          this.reads++;
        }
      }

      this.efect = (this.reads / this.details.length) * 100;
      this.menuLength = this.details.length;
    });
  });
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

delete() {
  const db = getDatabase();

  for (let i = 0; i < this.details.length; i++) {
    if (this.details[i]['st'] === "sent") {
      const contactoRef = ref(db, `ruta/Contactos/${this.businessFinal}/${this.details[i]['to']}`);
      remove(contactoRef)
        .then(() => {
          console.log(`Contacto ${this.details[i]['to']} eliminado`);
        })
        .catch((error) => {
          console.error('Error al eliminar contacto:', error);
        });
    }
  }

  this.showToast('Se eliminaron de la lista de contactos');
}
async getUserContacts(numb: any): Promise<string> {
  const db = getDatabase();
  const contactoRef = ref(db, `ruta/Contactos/${this.businessFinal}/${numb}`);

  try {
    const snap = await get(contactoRef);
    const res = snap.val();

    if (res === null || res.Name === undefined || res.Name === "") {
      return 'No registrado';
    } else {
      return res.Name;
    }
  } catch (error) {
    console.error('Error al obtener contacto:', error);
    return 'No registrado';
  }
}
}
