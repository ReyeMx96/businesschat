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
import { AuthService } from '../auth.service';
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
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginPage implements OnInit {
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
async openMenu() {
  await this.menu.open();
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


onLoginEmail(){
  this.showEmailOptions = true 
}

  isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }
  async login() {
    if (!this.email || !this.isValidEmail(this.email)) {
  
      this.showToast('Por favor, ingresa un correo electrónico válido.');
      return;
    }
console.log(this.password.length)
    if (this.password.length < 6) {
  
      this.showToast('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    this.presentLoading()

    try {

          console.log('El usuario existe en Firestore, logueando usuario.');
          await this.authSvc.login(this.email, this.password);
          setTimeout(() => {
            location.reload()
          }, 1000);
        
      
 

    } catch (error) {
      console.error('Error en el proceso de autenticación', error);
    }
  }


showEmailOptions = false
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
            VfType: "SMS",
            fechaStart: new Date(),
            idn: fechaStartMillis // Campo adicional para usuarios nuevos
          });
  
          console.log('New user data stored in Firestore successfully');
        } else {
          console.log('User already exists. No data was updated.');
        }
  
        setTimeout(() => {
          this.checkUserType(user.uid)
 
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
checkUserType(userId: any) {
  const userRef = this.firestore.collection('users').doc(userId);

  userRef.get().subscribe(
    async (doc) => {
      if (doc.exists) {
        const userData = doc.data() as UserData; // Especifica el tipo de los datos
        const userType = userData?.lat;
        console.log(userType)

        // Verifica si `type` es null o undefined
        if (userType === null && userData?.rol === 'client' || userType === undefined && userData?.rol === 'client') {
    
         // this.router.navigate(['/location-type'], { replaceUrl: true });
        } else {
          if(userData?.rol === 'client'){
            this.router.navigate(['/tabs/conversations/'], { replaceUrl: true });

          }else{
            this.router.navigate(['/login'], { replaceUrl: true });
            
          }
        }
      } else {

        console.error(`El documento con ID ${userId} no existe.`);
        try {
          const fechaStartMillis = Date.now(); // Timestamp único en milisegundos
          const user = await this.afAuth.currentUser;
          const userName = user?.displayName || "Usuario sin nombre"; // Valor por defecto si no tiene nombre

          await userRef.set({
            uid: userId,
            nombre: userName,
            phone: "",
            rol: "admin",
            fechaStart: new Date(),
            idn: fechaStartMillis // Campo adicional para usuarios nuevos
          });

          console.log('Documento creado exitosamente.');
          this.router.navigate(['/tabs/conversations'], { replaceUrl: true });
        } catch (error) {
          console.error('Error al crear el documento:', error);
        }
      }
    },
    (error) => {
      console.error('Error al obtener el documento:', error);
      this.router.navigate(['/tabs/conversations'], { replaceUrl: true });
    }
  );
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
userPhone:any
  ngOnInit() {
  this.onLoginEmail()

    // Inicialización de Firebase Auth y Database
    this.auth = getAuth();
    this.db = getDatabase();
  

    // Empujar estado falso para modales
    const modalState = {
      modal: true,
      desc: 'fake state for our modal'
    };
    history.pushState(modalState, "null");
  
    // Configurar Recaptcha (agrega en tu HTML un contenedor con id="recaptcha-container")


    // Actualiza swiper si existe (suponiendo que tu componente Swiper tiene el método updateSwiper)
    setTimeout(() => {
      if (this.swiper) {
        this.swiper.updateSwiper({});
      }
    }, 1500);
  
    // Configura onAuthStateChanged para detectar si hay sesión activa
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        const uid = user.uid;
        this.sendTokenToAndroid(uid);
        // Leer datos del usuario desde la base de datos
        const userRef = ref(this.db, `UsersBusinessChat/${uid}`);
        
        get(userRef).then((snapshot) => {
          const res = snapshot.val();
          console.log(res);
          
          setTimeout(() => {
            //this.router.navigate([`/tabs/conversations/${localStorage.getItem('UID')}`], { replaceUrl: true });
            this.router.navigate([`/tabs/conversations`], { replaceUrl: true });
            this.showToast('Ya tienes una sesión activa');
          }, 1000);
        });
      } else {

         this.route.queryParams.subscribe(params => {
    const phoneParam = params['userPhone'];

    if (phoneParam) {
      this.userPhone = phoneParam;

      console.log('Número del usuario:', this.userPhone);

      // Llamar al método solo si existen los parámetros
      this.generateToken(this.userPhone);
    } else {
      console.log('No hay parámetros en la URL, no se hace nada');
    }
  });


        setTimeout(() => {
          this.showBackdropSesion = false;
          this.authMode = "phone";
        }, 1000);
      }
    });
  }
async generateToken(phone:any){
   
     const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
    });
    await loading.present();
      try {
        const response = await fetch('https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/generateTokenBsStudio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone }),
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
      this.sendTokenToAndroid(data.uid);

      this.checkUserType(data.uid)
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
async sendTokenToAndroid(token: string) {
  console.log(token)
  if (window.AndroidApp) {
    token = await this.getCustomToken(token)  

    console.log(token)
   
    window.AndroidApp.sendTokenToNative2(token);

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
      this.showToast('Iniciando sesión...');
      this.showToast(uid || '');
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

  registerData(array: any, uid: string) {
    console.log('registrando datos');
    const userRef = ref(this.db, 'UsersBusinessChat/' + uid);
    get(userRef).then((snapshot) => {
      const res = snapshot.val();
      console.log(res);
      if (res === null) {
        this.authSvc.registerUser(array, uid)
          .then(() => { })
          .catch((err) => {
            console.log(err);
          });
        setTimeout(() => {
          this.router.navigate(['/numbers/'], { replaceUrl: true });
        }, 1000);
      } else {
        setTimeout(() => {
          // this.router.navigate([`/tabs/control/${localStorage.getItem('UID')}`], { replaceUrl: true });
          this.router.navigate([`/tabs/conversations`], { replaceUrl: true });
        }, 1000);
      }
    }).catch((err) => {
      console.error(err);
    });
  }

  async onLoginGoogle() {
    try {
      const user = await this.authSvc.loginGoogle();
      if (user) {
        console.log(user);
        console.log(user.displayName);
        console.log(user.email);
        console.log(user.uid);
        this.uid = user.uid;
        const array = {
          Name: user.displayName,
          Email: user.email,
          Credits: 0,
          Img: 'https://www.transparentpng.com/thumb/user/gray-user-profile-icon-png-fP8Q1P.png',
          Verify: user.emailVerified,
          Admin: false,
          RegDate: this.fecha,
          VfEmail: false,
          VfType: 'Google',
          VfPhone: false
        };
        const userRef = ref(this.db, 'UsersBusinessChat/' + this.uid);
        get(userRef).then((snapshot) => {
          const res = snapshot.val();
          console.log(res);
          if (res === null) {
            this.authSvc.registerUser(array, this.uid)
              .then(() => {
                setTimeout(() => {
                  //this.router.navigate([`/tabs/control/${this.uid}`], { replaceUrl: true });
                  this.router.navigate([`/tabs/conversations`], { replaceUrl: true });
                  this.showToast('Ya tienes una sesión activa');
                }, 1000);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }).catch((err) => {
          alert(err);
        });
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
