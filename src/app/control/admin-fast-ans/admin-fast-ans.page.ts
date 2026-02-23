import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getDatabase, ref, onValue, push, set, update, remove } from 'firebase/database';

@Component({
  selector: 'app-admin-fast-ans',
  templateUrl: './admin-fast-ans.page.html',
  styleUrls: ['./admin-fast-ans.page.scss'],
})
export class AdminFastAnsPage implements OnInit, OnDestroy {
  private auth = getAuth();

  // Config / estado
  dbase: any;
  phoneNumberAdmin = ''; // <-- asigna aquí o recupera desde tu sesión
  fastAnsPath = '';
  fastAnsList: Array<any> = [];
  displayedFastAns: Array<any> = [];
  filterTxt = '';

  // listener ref holder
  private listenerRef: any;

  private db = getDatabase();
  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private router: Router,
     private zone: NgZone,

  ) {
    // si en tu app asignas phoneNumberAdmin en otro lugar, elimina esta línea
    // this.phoneNumberAdmin = '5218333861194';
  }
connect:any
ph:any
name:any
enableService: boolean = false;
arrayNumbers:any
uid:any
  ngOnInit() {
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
                  this.dbase = getDatabase();
                  this.fastAnsPath = `ruta/${this.ph}/FastAns`;
                  // Si phoneNumberAdmin se asigna después, asegúrate de llamar a listenFastAns() otra vez
                  this.listenFastAns();
                  
                });
              }
            });
          }
        });

  }

  ngOnDestroy() {
    // quitar listener al salir
    try {
      if (this.listenerRef) {
        this.listenerRef.off && this.listenerRef.off();
      }
    } catch (e) {
      // ignore
    }
  }

  // --------------------------
  // Lectura en tiempo real
  // --------------------------
  listenFastAns() {

    const db = this.dbase;
    const p = this.fastAnsPath;
    const refDb = ref(db, p);

    // Guardamos listener para poder quitarlo
    this.listenerRef = refDb;

    onValue(refDb, (snapshot) => {
      const val = snapshot.val();
      const arr: any[] = [];
      if (val) {
        Object.keys(val).forEach((k) => {
          const item = val[k];
          item._id = k;
          arr.push(item);
        });
      }
      // orden natural (opcional). Mantengo tal cual
      this.fastAnsList = arr;
      this.applyFilter();
    }, (err) => {
      console.error('listenFastAns error', err);
    });
  }

  // --------------------------
  // Filtrado / búsqueda
  // --------------------------
  applyFilter() {
    const q = (this.filterTxt || '').toLowerCase().trim();
    if (!q) {
      this.displayedFastAns = [...this.fastAnsList];
      return;
    }
    this.displayedFastAns = this.fastAnsList.filter(i => {
      const cmd = (i.Cmd || '').toLowerCase();
      const src = (i.Src || '').toLowerCase();
      return cmd.includes(q) || src.includes(q);
    });
  }

  trackByFn(index: number, item: any) {
    return item._id || index;
  }

  // --------------------------
  // Crear
  // --------------------------
  async openCreatePrompt() {
    const alert = await this.alertCtrl.create({
      header: 'Crear respuesta rápida',
      inputs: [
        { name: 'Cmd', type: 'text', placeholder: 'Comando / título (ej: Saludo)' },
        { name: 'Src', type: 'textarea', placeholder: 'Texto que se enviará' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Crear',
          handler: async (data) => {
            if (!data.Cmd || !data.Src) {
              this.presentToast('Completa ambos campos', 'warning');
              return false;
            }
            await this.createFastAns(data);
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  async createFastAns(payload: { Cmd: string, Src: string }) {
    const loading = await this.loadingCtrl.create({ message: 'Creando...' });
    await loading.present();
    try {
      const db = this.dbase;
      const fastAnsRef = ref(db, this.fastAnsPath);
      const newRef = push(fastAnsRef);
      const data = {
        Cmd: payload.Cmd,
        Src: payload.Src,
        createdAt: new Date().toISOString()
      };
      await set(newRef, data);
      this.presentToast('Respuesta rápida creada', 'success');
    } catch (err) {
      console.error(err);
      this.presentToast('Error creando respuesta rápida', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  // --------------------------
  // Editar
  // --------------------------
  async openEditPrompt(item: any) {
    const alert = await this.alertCtrl.create({
      header: 'Editar respuesta rápida',
      inputs: [
        { name: 'Cmd', type: 'text', value: item.Cmd || '', placeholder: 'Comando / título' },
        { name: 'Src', type: 'textarea', value: item.Src || '', placeholder: 'Texto que se enviará' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (!data.Cmd || !data.Src) {
              this.presentToast('Completa ambos campos', 'warning');
              return false;
            }
            await this.updateFastAns(item._id, { Cmd: data.Cmd, Src: data.Src });
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  async updateFastAns(id: string, payload: any) {
    const loading = await this.loadingCtrl.create({ message: 'Guardando cambios...' });
    await loading.present();
    try {
      const db = this.dbase;
      const itemRef = ref(db, `${this.fastAnsPath}/${id}`);
      const payloadToSave = {
        ...payload,
        updatedAt: new Date().toISOString()
      };
      await update(itemRef, payloadToSave);
      this.presentToast('Respuesta actualizada', 'success');
    } catch (err) {
      console.error(err);
      this.presentToast('Error actualizando', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  // --------------------------
  // Eliminar
  // --------------------------
  async confirmDelete(item: any) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar',
      message: `Eliminar "${item.Cmd}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.deleteFastAns(item._id);
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteFastAns(id: string) {
    const loading = await this.loadingCtrl.create({ message: 'Eliminando...' });
    await loading.present();
    try {
      const db = this.dbase;
      const itemRef = ref(db, `${this.fastAnsPath}/${id}`);
      await remove(itemRef);
      this.presentToast('Respuesta eliminada', 'success');
    } catch (err) {
      console.error(err);
      this.presentToast('Error eliminando', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  // --------------------------
  // Utilidades UI
  // --------------------------
  async presentToast(msg: string, color: 'success' | 'warning' | 'danger' | 'primary' = 'primary') {
    const t = await this.toastCtrl.create({
      message: msg,
      duration: 1500,
      color
    });
    await t.present();
  }

  async copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text || '');
      this.presentToast('Copiado al portapapeles', 'success');
    } catch (e) {
      this.presentToast('No se pudo copiar', 'warning');
    }
  }
}
