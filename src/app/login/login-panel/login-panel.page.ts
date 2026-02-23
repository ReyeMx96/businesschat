import { Component, HostListener, NgZone, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, MenuController, NavController, ModalController, ToastController, IonInput } from '@ionic/angular';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserCredential } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
// Importar funciones modulares de Firebase
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged, ConfirmationResult } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';

// Si usas métodos de tu AuthService, éstos deben estar adaptados a la API modular también.
import { AuthService } from '../../auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { take } from 'rxjs';
// IMPORTANTE: elimina import * as firebase from 'firebase/app'; y sus referencias compat
interface UserData {
  lat?:string;
  rol:string;
  type?: string; // El campo 'type' es opcional
  // Agrega otros campos si es necesario
}
@Component({
  selector: 'app-login-panel',
  templateUrl: './login-panel.page.html',
  styleUrls: ['./login-panel.page.scss'],
})
export class LoginPanelPage implements OnInit {

  precio = 50;
  errorTxt = ""
  showButtonsSms = false

  nextTxt = 'Siguiente';
  showRegistrarse = false;
  activeIndexSwiper = 0;
  // Suponiendo que tienes un componente Swiper, asegúrate de tener su referencia
  @ViewChild('swiper') swiper: any;
  plan = 'COMPRADOR';
  @ViewChild('oneinput', { static: false }) oneinput!: IonInput;
  @ViewChild('twoinput', { static: false }) twoinput!: IonInput;
  @ViewChild('threeinput', { static: false }) threeinput!: IonInput;
  @ViewChild('fourinput', { static: false }) fourinput!: IonInput;
  @ViewChild('fiveinput', { static: false }) fiveinput!: IonInput;
  @ViewChild('sixinput', { static: false }) sixinput!: IonInput;
  db:any
  hideNumbers = false;
  uid = '';
  phoneNumber: string = "";
  recaptchaVerifier: any =  RecaptchaVerifier;
  confirmationResult: any;
  showBackdropSesion = true;
  logginapear = true;
  promocode = '';
  one = '';
  promodisable = false;
  showPhoneInput = false
  method = 'register';
  two = '';
  three = '';
  otpCode:any
  authMode = '';
  four = "";
  uidx:any
  five = "";
  showConfirmInput = false;
  showCaptchaText = false;
  captchaError = false; // Restablece el error si estaba presente
  name = "";
  
  email: any;
  password : any = "";
  six = '';
  showCaptcha =true
  codeSpace = true;
  fecha = '';
auth:any
  numberForm:any =  FormGroup;

  // Declarar variables para auth y database (API modular)

  constructor(
    private http: HttpClient,
    public alertController: AlertController,
    public navCtrl: NavController,
    private toastController: ToastController,
    private loadingCtrl: LoadingController,
    public modalController: ModalController,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private menu: MenuController,
    private afAuth: AngularFireAuth,
    private authSvc: AuthService,
    private zone: NgZone,
    private router: Router,
    private firestore: AngularFirestore,
    public loadingController: LoadingController,
   
  ) {
    // Obtener la promo del parámetro de ruta
    this.promocode = this.route.snapshot.paramMap.get('promocode')?.toString() || '';
    if (this.promocode === 'auth') {
      // ...
    } else {
      this.zone.run(() => {
        this.method = 'register';
        this.promocode = this.promocode.toUpperCase();
        this.promodisable = true;
      });
    }

  }

  ionViewWillEnter() {
    // Leer datos de localStorage si existen
    if (localStorage.getItem('loginemail')) {
      this.email = localStorage.getItem('loginemail');
    }
    if (localStorage.getItem('loginpass')) {
      this.password = localStorage.getItem('loginpass');
    }
  }


    sendCode() {

    if (this.phoneNumber.length >= 10) {
      // Cumple la condición
    } else {
      alert("Debe tener 10 digitos o más")
      return
      // No cumple la condición
    }
    this.presentLoading();
    this.showPhoneInput = false;
    this.showCaptchaText = true;

    this.auth = getAuth();
    this.auth.languageCode = 'es-MX'; // Para español de México

    window.recaptchaVerifier = new RecaptchaVerifier(
      this.auth,
      'recaptcha-container',
      {
        size: 'normal',
        callback: (response: unknown) => {
          // CAPTCHA resuelto correctamente
          console.log("CAPTCHA resuelto:", response);
          this.showConfirmInput = true;
          this.showCaptchaText = false;
          this.captchaError = false; // Restablece el error si estaba presente
        },
        'expired-callback': () => {
          console.log('CAPTCHA expirado');
          this.captchaError = true; // Muestra el error
        }
      }
    );

    const phoneNumber = "+52" + this.phoneNumber;
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(this.auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        this.confirmationResult = confirmationResult;
        console.log("SMS enviado");
        window.confirmationResult = confirmationResult;
        this.showCaptcha = false;
      })
      .catch((error) => {
        console.error("Error al enviar el SMS:", error);
        this.captchaError = true; // Muestra el error si falla el envío
      });
  }


  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...', // Puedes personalizar el mensaje
      duration: 1000,
            // Tiempo que estará visible en ms (opcional)
    });
    await loading.present();
  
    // Opcional: Manejar el cierre del loading
    const { role, data } = await loading.onDidDismiss();
    console.log('Loading cerrado');
  }
//  async sendCode() {
//   this.phoneNumber = this.phoneNumber.replace(/\D/g, '');

//   if (this.phoneNumber.length < 10) {
//     alert("Debe tener 10 dígitos o más");
//     return;
//   }

//   this.presentLoading();
//   this.showPhoneInput = false;
//   this.showCaptchaText = true;

//   this.auth = getAuth();
//   this.auth.languageCode = 'es-MX';

//   if (!window.recaptchaVerifier) {
//     window.recaptchaVerifier = new RecaptchaVerifier(
//       this.auth,
//       'recaptcha-container',
//       {
//         size: 'normal',
//         callback: (response: unknown) => {
//           console.log("CAPTCHA resuelto:", response);
//           this.showConfirmInput = true;
//           this.showCaptchaText = false;
//           this.captchaError = false;
//         },
//         'expired-callback': () => {
//           console.log('CAPTCHA expirado');
//           this.captchaError = true;
//         }
//       }
//     );

//     await window.recaptchaVerifier.render(); // Espera a que se renderice
//   }

//   const phoneNumber = "+52" + this.phoneNumber;
//   const appVerifier = window.recaptchaVerifier;

//   signInWithPhoneNumber(this.auth, phoneNumber, appVerifier)
//     .then((confirmationResult) => {
//       this.confirmationResult = confirmationResult;
//       window.confirmationResult = confirmationResult;
//       this.showCaptcha = false;
//       console.log("SMS enviado");
//     })
//     .catch((error) => {
//       console.error("Error al enviar el SMS:", error);
//       this.captchaError = true;
//     });
// }
  authCode() {
    this.presentLoading();
    const code = this.otpCode;
  
    this.confirmationResult.confirm(code).then(async (result: UserCredential) => {
      // Usuario autenticado exitosamente
      const user = result.user;
      console.log('User signed in:', user);
  
      try {
        const userDocRef = this.firestore.collection('users').doc(user.uid);
        const userDocSnapshot = await userDocRef.get().toPromise();
  
        if (!userDocSnapshot!.exists) {
          // Usuario nuevo: crear documento en Firestore
          const fechaStartMillis = Date.now(); // Timestamp único en milisegundos
  
          await userDocRef.set({
            uid: user.uid,
            phone: user.phoneNumber,
            rol: "client",
            fechaStart: new Date(),
            VfType: "SMS",
            idn: fechaStartMillis // Campo adicional para usuarios nuevos
          });
  
          console.log('New user data stored in Firestore successfully');
        } else {
          console.log('User already exists. No data was updated.');
        }
  
        // Obtener el token de ID después de iniciar sesión
        const idToken = await user.getIdToken();
  
        // Enviar el token al WebView o aplicación web
          //  this.sendTokenToAndroid(user.uid);
  
        // Navegar al marketplace
        setTimeout(() => {
          this.checkUserType(user.uid)
          //this.golocation() 
          
       //   this.route.navigate(['/tabs/marketplace/'], { replaceUrl: true });

        }, 1000);
  
      } catch (error) {
        console.error('Error checking or storing user data in Firestore:', error);
      }
  
    }).catch((error: FirebaseError) => {
      console.log('Error during sign in:', error);
      this.captchaError = true;
      this.errorTxt = error.toString();
      this.otpCode = "";
      // Mostrar un mensaje de error al usuario si es necesario
    });
  }


restaurantId=""
async checkUserType(userId: string) {
  const userRef = this.firestore.collection('users').doc(userId);

  userRef.get().subscribe(async (doc) => {
    if (doc.exists) {
      const userData: any = doc.data();
      const userType = userData?.rol;

      // 🔹 Traemos la lista de restaurantes
      const restaurants: any[] = userData?.['list-restaurants'] || [];

      if (restaurants.length > 0 && userType === 'client') {
        // Mostrar alert con opciones
        const alert = await this.alertCtrl.create({
          header: 'Selecciona un restaurante',
          inputs: restaurants.map((rest: any) => ({
            type: 'radio',
            label: rest.name || rest.id, // si tienes nombre
            value: rest.id,              // el id del restaurante
          })),
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Aceptar',
              handler: (selectedId) => {
                if (selectedId) {
                  this.restaurantId = selectedId; // Guardamos la selección
                  this.router.navigate([`/panel/${this.restaurantId}`], { replaceUrl: true });
                }
              }
            }
          ]
        });

        await alert.present();
      } else {
        // ⚡ lógica por defecto si no hay restaurantes o no es client
        if (userType === 'client') {
          this.router.navigate([`/panel/${this.restaurantId}`], { replaceUrl: true });
        } else {
          this.router.navigate(['/login-panel'], { replaceUrl: true });
        }
      }
    } else {
      // Crear el documento si no existe
      try {
        const fechaStartMillis = Date.now();
        const user = await this.afAuth.currentUser;
        const userName = user?.displayName || "Usuario sin nombre";

        await userRef.set({
          uid: userId,
          nombre: userName,
          phone: "S/N",
          rol: "restaurant",
          fechaStart: new Date(),
          idn: fechaStartMillis,
          "list-restaurants": [] // inicializa vacío
        });

        this.router.navigate(['/waiting-panel'], { replaceUrl: true });
      } catch (error) {
        console.error('Error al crear el documento:', error);
      }
    }
  });
}


// async sendTokenToAndroid(token: string) {
//   console.log(token)
//   if (window.AndroidApp) {
//     token = await this.getCustomToken(token)  

//     console.log(token)
   
//     window.AndroidApp.sendTokenToNative(token);

//   } else {
//     console.error('AndroidApp interface not available');
//   }
// }


  ngOnInit() {
    // Inicialización de Firebase Auth
    this.auth = getAuth();

    // Desactivar menú lateral
    this.menu.enable(false);

    // Empujar estado falso para modales
    const modalState = { modal: true, desc: 'fake state for our modal' };
    history.pushState(modalState, "null");

    // Actualiza swiper si existe
    setTimeout(() => {
      if (this.swiper) this.swiper.updateSwiper({});
    }, 1500);

    // Detectar sesión activa
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        const uid = user.uid;
        this.sendTokenToAndroid(uid);

        try {
          const userRef = this.firestore.collection('users').doc(uid);
          const docSnap = await userRef.get().toPromise();

          if (!docSnap!.exists) {
            // Crear usuario nuevo
            const fechaStartMillis = Date.now();
            const newUser = {
              uid: uid,
              Name: user.displayName || "Usuario",
              Email: user.email || "",
              Credits: 0,
              Img: 'https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png',
              Verify: user.emailVerified,
              Admin: false,
              VfType: 'Google',
              rol: 'client',
              fechaStart: new Date(),
              idn: fechaStartMillis,
              "list-restaurants": [] // inicializamos vacío
            };
            await userRef.set(newUser);

            this.router.navigate(['/waiting-panel'], { replaceUrl: true });

          } else {
            // Usuario existente
            const res: any = docSnap!.data();
            const restaurants: any[] = res?.['list-restaurants'] || [];

            if (restaurants.length > 0) {
              // Mostrar alert para seleccionar restaurante
              const alert = await this.alertCtrl.create({
                header: 'Selecciona un restaurante',
                inputs: restaurants.map((rest: any) => ({
                  type: 'radio',
                  label: rest.name || rest.id,
                  value: rest.id
                })),
                buttons: [
                  { text: 'Cancelar', role: 'cancel' },
                  { 
                    text: 'Aceptar', 
                    handler: (selectedId) => {
                      if (selectedId) {
                        this.restaurantId = selectedId;
                        this.router.navigate([`/panel/${this.restaurantId}`], { replaceUrl: true });
                        this.showToast('Ya tienes una sesión activa');
                      }
                    }
                  }
                ]
              });
              await alert.present();

            } else {
              // Si no tiene restaurantes asignados
              this.router.navigate(['/waiting-panel'], { replaceUrl: true });
            }
          }

        } catch (error) {
          console.error('Error al leer usuario en Firestore:', error);
        }

      } else {
        // No hay sesión activa
        setTimeout(() => {
          this.showBackdropSesion = false;
          this.authMode = "phone";
        }, 1000);
      }
    });
  }



async sendTokenToAndroid(token: string) {
  console.log(token)
  if (window.AndroidApp) {
    token = await this.getCustomToken(token)  

    console.log(token)
   
    window.AndroidApp.sendTokenToNative(token);

  } else {
    console.error('AndroidApp interface not available');
  }
}

async getCustomToken(uid: string) {
  console.log('UID to send:', uid); // Agregar esta línea para depuración
  try {
    const response = await fetch('https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/generateToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid }),
    });

    if (!response.ok) {
      throw new Error('Error al obtener el token');
    }

    const data = await response.json();
    return data.token; // Devuelve el token
  } catch (error) {
    console.error('Error al obtener el token personalizado:', error);
  }
}
showSms(){
  this.showButtonsSms = true
}
onLoginGoogleApp(){
   alert("logingoogle")

}
 async logxwuid() {
      var uid = localStorage.getItem("uidkx")
      
      this.uidx = uid;
     const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
    });
    await loading.present();
      console.log('UID to send:', uid); // Agregar esta línea para depuración
      try {
        const response = await fetch('https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/generateToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid }),
        });
    
        if (!response.ok) {
          alert("rror al obtener el token")
  
          throw new Error('Error al obtener el token');
        }
    
        const data = await response.json();
          const user = await this.afAuth.authState.pipe(take(1)).toPromise();
            
            if (user) {
              await loading.dismiss();
            } else {
            
              console.log('No hay usuario logueado');
     try {
      await this.afAuth.signInWithCustomToken(data.token);
      this.checkUserType(this.uidx)
      await loading.dismiss();

  } catch (error) {
      console.error("Error al iniciar sesión con el token:", error);
      alert("Error al iniciar sesión. Por favor, intenta de nuevo.");
      alert(error);
  }
        
            }
    
  
      } catch (error) {
        alert(error)
        
        console.error('Error al obtener el token personalizado:', error);
      }
    }
  onChangeSelectToolbar(event: any) {
    if (event.target.value === 'intro') {
      this.method = 'intro';
      this.authMode = '';
      this.showBackdropSesion = true;
    } else if (event.target.value === 'login') {
      this.method = 'login';
      this.authMode = 'mail';
      this.showBackdropSesion = false;
    } else if (event.target.value === 'register') {
      this.method = 'register';
      this.authMode = 'mail';
      this.showBackdropSesion = false;
    }
  }

  detectLast(event: any) {
    console.log(event.detail.value);
    if (event.detail.value.length === 6) {
      const code = event.detail.value;
      this.confirmationResult.confirm(code)
        .then((result: any) => {
          const randomkey = Math.floor(Math.random() * 99999) + 2;
          console.log(result.user);
          console.log(result.user.uid);
          console.log(result);
          const array = {
            Name: 'Enterprise: #' + randomkey.toString(),
            Phone: this.phoneNumber,
            AccType: 'Free Account',
            Admin: false,
            Img: 'https://i.pinimg.com/originals/e2/7c/87/e27c8735da98ec6ccdcf12e258b26475.png',
            Verify: true,
            RegDate: this.fecha,
            VfPhone: true
          };
          this.registerData(array, result.user.uid);
        }).catch((err:any) => {
          this.one = "";
          this.onFailAlert('Error de confirmación', err.message);
        });
    }
  }

  registerNow() {
    this.method = 'register';
    this.authMode = 'mail';
    this.showBackdropSesion = false;
  }

  swiperSlideChanged(event: any) {
    this.zone.run(() => {
      console.log(event);
      this.activeIndexSwiper = +event.activeIndex;
      if (this.activeIndexSwiper === 4) {
        this.nextTxt = 'Registrarse';
        this.showRegistrarse = true;
      } else {
        this.nextTxt = 'Siguiente';
        this.showRegistrarse = false;
      }
      this.logginapear = this.activeIndexSwiper === 0;
    });
  }

  loginAppear() {
    this.showBackdropSesion = false;
    this.method = 'login';
    this.authMode = 'mail';
  }

  nextSlide() {
    this.swiper.swiperRef.slideNext(500);
  }

  backSlide() {
    this.swiper.swiperRef.slidePrev(500);
  }

  // Método de login con teléfono usando API modular
  signIn() {
    const auth = getAuth(); // modular auth instance
    const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = '+52' + this.phoneNumber;
    console.log(phoneNumberString);
  
    signInWithPhoneNumber(auth, phoneNumberString, appVerifier)
      .then(async (confirmationResult: ConfirmationResult) => {
        this.zone.run(() => {
          console.log(confirmationResult);
          this.confirmationResult = confirmationResult;
          this.codeSpace = false;
          this.hideNumbers = true;
        });
  
        const handle = setInterval(() => {
          // this.two.setFocus();
          clearInterval(handle);
        }, 1000);
      })
      .catch((error) => {
        console.error('SMS not sent', error);
        // this.onFailAlert(error);
      });
  }


async registerData(array: any, uid: string) {
  console.log('Registrando datos');

  const userRef = this.firestore.collection('UsersBusinessChat').doc(uid);

  try {
    const docSnap = await userRef.get().pipe(take(1)).toPromise();

    if (!docSnap!.exists) {
      // Usuario nuevo: crear documento
      await userRef.set({
        ...array,
        listRestaurants: [] // inicializamos vacío
      });

      setTimeout(() => {
        this.router.navigate(['/numbers/'], { replaceUrl: true });
      }, 1000);

    } else {
      // Usuario existente
      const res: any = docSnap!.data();
      const restaurants: any[] = res?.listRestaurants || [];

      if (restaurants.length > 0) {
        // Mostrar alert para seleccionar restaurante
        const alert = await this.alertCtrl.create({
          header: 'Selecciona un restaurante',
          inputs: restaurants.map((rest: any) => ({
            type: 'radio',
            label: rest.name || rest.id,
            value: rest.id
          })),
          buttons: [
            { text: 'Cancelar', role: 'cancel' },
            {
              text: 'Aceptar',
              handler: (selectedId) => {
                if (selectedId) {
                  this.restaurantId = selectedId;
                  this.router.navigate([`/panel/${this.restaurantId}`], { replaceUrl: true });
                }
              }
            }
          ]
        });

        await alert.present();

      } else {
        // Si no tiene restaurantes asignados
        this.router.navigate([`/panel/${this.restaurantId}`], { replaceUrl: true });
      }
    }

  } catch (err) {
    console.error('Error al registrar datos en Firestore:', err);
  }
}



 async onLoginGoogle() {
  try {
    const user = await this.authSvc.loginGoogle();
    if (user) {
      console.log(user);
      this.uid = user.uid;

      const userRef = this.firestore.collection('users').doc(this.uid);
      const docSnap = await userRef.get().toPromise();

      if (!docSnap!.exists) {
        // 🔹 Usuario nuevo
        const fechaStartMillis = Date.now();
        const array = {
          uid: this.uid,
          Name: user.displayName,
          Email: user.email,
          Credits: 0,
          Img: 'https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png',
          Verify: user.emailVerified,
          Admin: false,
          VfType: 'Google',
          rol: 'client',
          fechaStart: new Date(),
          idn: fechaStartMillis,
          "list-restaurants": [] // inicializa vacío
        };

        await userRef.set(array);
        this.router.navigate(['/waiting-panel'], { replaceUrl: true });

      } else {
        // 🔹 Usuario existente
        const res: any = docSnap!.data();
        const restaurants: any[] = res?.['list-restaurants'] || [];

        if (restaurants.length > 0) {
          // Mostrar alert para seleccionar restaurante
          const alert = await this.alertCtrl.create({
            header: 'Selecciona un restaurante',
            inputs: restaurants.map((rest: any) => ({
              type: 'radio',
              label: rest.name || rest.id, // mostrar nombre si lo tienes
              value: rest.id               // usar id como valor
            })),
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel'
              },
              {
                text: 'Aceptar',
                handler: (selectedId) => {
                  if (selectedId) {
                    this.restaurantId = selectedId;
                    this.router.navigate([`/panel/${this.restaurantId}`], { replaceUrl: true });
                  }
                }
              }
            ]
          });
          await alert.present();

        } else {
          // Si no tiene restaurantes asignados
          this.router.navigate(['/waiting-panel'], { replaceUrl: true });
        }
      }
    }
  } catch (error) {
    console.log('Error->', error);
  }
}

  async loadingUser() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Detectando sesiones activas...',
      duration: 200
    });
    await loading.present();
  }



  private redirectUser(isVerified: boolean): void {
    if (isVerified) {
      console.log('is verified');
    } else {
      console.log('not verified');
    }
  }

  async onFailAlert(type: string, error: any) {
    const alert = await this.alertController.create({
      header: type,
      message: error,
      buttons: ['OK']
    });
    await alert.present();
  }

 

  @HostListener('window:popstate', ['$event'])
  dismissModal() {
    this.showBackdropSesion = true;
    this.method = '';
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 5000,
      position: 'middle',
      color: 'success',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            toast.dismiss();
          }
        }
      ]
    });
    toast.present();
  }
  
  // Otros métodos que puedan existir...
}
