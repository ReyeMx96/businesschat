import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, MenuController, ModalController, Platform, ToastController } from '@ionic/angular';
import { AuthService } from '../../app/auth.service';
// import { MessagingService } from '../messaging.service';

import { getDatabase, ref as dbRef, onValue, update } from 'firebase/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-control',
  templateUrl: './control.page.html',
  styleUrls: ['./control.page.scss'],
})
export class ControlPage implements OnInit {
  uid!: string | null;
  ph!: string;
  business!: string | null;
  enableService = false;
  connect =  false;
  arrayNumbers!: string[];
  name!: string;

  constructor(
    //private messagingService: MessagingService,
    private platform: Platform,
    private alertController: AlertController,
    private toastController: ToastController,
    private zone: NgZone,
    private menu: MenuController,
    private route: ActivatedRoute,
    private router: Router,
       private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private modalController: ModalController,
    private authsv: AuthService
  ) {}

  ionViewDidEnter() {
    // opcional: lógica de view enter
  }
async activarBusinessPanel() {
  try {
    const user = await this.afAuth.currentUser;
    if (!user) {
      console.error("No hay usuario autenticado");
      return;
    }

    const uid = user.uid;
    const userDoc = await this.firestore.collection("users").doc(uid).get().toPromise();

    if (!userDoc || !userDoc.exists) {
      console.error("Usuario no encontrado en Firestore");
      return;
    }

    const userData: any = userDoc.data();

    // 🔹 Paso 1: Pedir PIN al usuario
    const pinAlert = await this.alertController.create({
      header: "Verificación de PIN",
      inputs: [
        {
          name: "pin",
          type: "password",
          placeholder: "Ingresa tu PIN"
        }
      ],
      buttons: [
        { text: "Cancelar", role: "cancel" },
        {
          text: "Aceptar",
          handler: async (data) => {
            const inputPin = data.pin;
            const storedPin = userData?.pin;

            if (inputPin.toString() === storedPin.toString()) {
              console.log("PIN correcto ✅");

              const restaurants: any[] = userData?.listRestaurants || [];

              if (restaurants.length >= 1) {
                // 🔹 Paso 2: Mostrar alert para elegir restaurantId
                const alert = await this.alertController.create({
                  header: "Selecciona un restaurante",
                  inputs: restaurants.map((rest: any) => ({
                    type: "radio",
                    label: rest.name || rest.id,
                    value: rest.id
                  })),
                  buttons: [
                    { text: "Cancelar", role: "cancel" },
                    {
                      text: "Aceptar",
                      handler: (selectedId) => {
                        if (selectedId) {
                          // Guardar en localStorage
                          localStorage.setItem("idpanel", selectedId);
                          // Navegar al panel
                          this.router.navigate([`/panel/${selectedId}`], { replaceUrl: true });
                          setTimeout(() => {
                            window.location.reload();
                          }, 4000);
                        }
                      }
                    }
                  ]
                });
                await alert.present();
              } else {
                console.warn("No hay restaurantes asignados a este usuario");
              }
            } else {
              console.error("PIN incorrecto ❌");
              const wrongAlert = await this.alertController.create({
                header: "Error",
                message: "El PIN ingresado es incorrecto.",
                buttons: ["OK"]
              });
              await wrongAlert.present();
            }
          }
        }
      ]
    });

    await pinAlert.present();

  } catch (err) {
    console.error("Error en activarBusinessPanel:", err);
  }
}

  async selectOption(event: any) {
    const selectedOption = event.detail.value;
    const db = getDatabase();
    await update(dbRef(db, `UsersBusinessChat/${this.uid}`), {
      SelectedPh: selectedOption
    });
    const alert = await this.alertController.create({
      header: 'Opción seleccionada',
      message: 'Seleccionaste: ' + selectedOption,
      buttons: ['OK']
    });
    await alert.present();
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 5000,
      position: 'middle',
      color: 'success',
      buttons: [{
        text: 'OK',
        role: 'cancel',
        handler: () => toast.dismiss()
      }]
    });
    toast.present();
  }

  goConversations() {
    if (this.enableService) {
      this.router.navigate(['/tabs/conversations'], { replaceUrl: true });
    } else {
      this.showToast('No tienes numeros disponibles');
    }
  }

  ngOnInit() {
    if (this.platform.is('mobile')) {
      this.menu.enable(false);
    }
    this.uid = this.route.snapshot.paramMap.get('uid');
    this.business = localStorage.getItem('Business');

    const db = getDatabase();
    onValue(dbRef(db, `UsersBusinessChat/${this.uid}`), (snapshot) => {
      const res = snapshot.val() || {};
      const authArray: string[] = [];

      if (!res.Auth) {
        this.enableService = false;
      } else {
        this.enableService = true;
        for (const key in res.Auth) {
          authArray.push(res.Auth[key].Ph);
        }
        this.zone.run(() => {
          this.arrayNumbers = authArray;
          this.ph = res.SelectedPh;
          this.name = res.Name;
          this.connect = res.Connect;
        });
      }
    });

    document.getElementById('updateComponent')?.click();
  }

  logout() {
    this.authsv.logout();
    localStorage.setItem('UID', 'null');
    localStorage.setItem('Business', 'null');
    window.location.reload();
  }

  async toastNoAvailable(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'danger',
      buttons: [{
        text: 'Ok',
        role: 'cancel',
        handler: () => toast.dismiss()
      }]
    });
    toast.present();
  }

  requestPermission() {
    // this.messagingService.requestPermission().subscribe(
    //   async (token:any) => {
    //     console.log(token);
    //     const db = getDatabase();
    //     const uid = localStorage.getItem('UID') || '';
    //     await update(dbRef(db, `Users/${uid}`), { Token: token });
    //     alert('Token agregado con éxito');
    //   },
    //   (err:any) => {
    //     console.error(err);
    //   }
    // );
  }
}
