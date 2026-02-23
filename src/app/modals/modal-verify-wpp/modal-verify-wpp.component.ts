import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { doc, getDoc, getFirestore, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-modal-verify-wpp',
  templateUrl: './modal-verify-wpp.component.html',
  styleUrls: ['./modal-verify-wpp.component.scss'],
})
export class ModalVerifyWppComponent  implements OnInit {
  @Input() phoneNumber: string | null = null;

  constructor(private http: HttpClient,private modalCtrl: ModalController,private alertCtrl: AlertController) {}
showInputCode = false
codigo:any
telefono :any
  ngOnInit() {}
   async dismiss() {
    const alert = await this.alertCtrl.create({
      header: 'Verificación requerida',
      message: 'Si no verificas tu número de WhatsApp, no podrás continuar con tu pedido.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-cancel'
        },
        {
          text: 'Entendido',
          handler: () => {
            this.modalCtrl.dismiss();
          }
        }
      ],
      cssClass: 'verify-alert'
    });

    await alert.present();
  }

  generarCodigo6Digitos(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
  }


async confirmarCodigo() {
  if (!this.codigo) {
    alert('Por favor ingresa el código recibido 📲');
    return;
  }
  this.loadingConfirmar = true; // 🔥 activar spinner + bloquear botón

  try {
    const db = getFirestore();
    const codigoRef = doc(db, 'codigos', this.codigo);
    const snapshot = await getDoc(codigoRef);

    if (!snapshot.exists()) {
      alert('❌ Código inválido o no encontrado.');
      this.loadingConfirmar = false;
      return;
    }

    const data = snapshot.data();
    const creadoTimestamp = data?.['serverTimestamp'];

    let creado: number | null = null;
    if (creadoTimestamp?.toMillis) {
      creado = creadoTimestamp.toMillis();
    } else if (creadoTimestamp?.toDate) {
      creado = creadoTimestamp.toDate().getTime();
    }

    if (!creado) {
      alert('⚠️ Código sin fecha de creación.');
       this.loadingConfirmar = false;
      return;
    }

    // Doc temporal para obtener hora del servidor
    const tempRef = doc(db, '_serverTime', 'temp');
    await setDoc(tempRef, { t: serverTimestamp() });
    const tempSnap = await getDoc(tempRef);

    const ahoraServerTimestamp = tempSnap.data()?.['t'];

    let ahoraServer: number;
    if (ahoraServerTimestamp) {
      if (ahoraServerTimestamp.toMillis) {
        ahoraServer = ahoraServerTimestamp.toMillis();
      } else if (ahoraServerTimestamp.toDate) {
        ahoraServer = ahoraServerTimestamp.toDate().getTime();
      } else {
        ahoraServer = Date.now();
      }
    } else {
      ahoraServer = Date.now();
    }

    const diferencia = ahoraServer - creado;
    const diezMin = 10 * 60 * 1000;

    if (diferencia > diezMin) {
      alert('⏰ El código ha expirado. Solicita uno nuevo.');
       this.loadingConfirmar = false;
      return;
    }

    // ✅ Código verificado correctamente
    // Ahora creamos sesión en el backend
    try {
      const body = { telefono: this.telefono }; // teléfono verificado
      const resp: any = await this.http
        .post('https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/loginVerificado', body)
        .toPromise();
        const auth = getAuth();

    const userCredential = await signInWithCustomToken(auth, resp.token);

    console.log('Usuario logueado automáticamente:', userCredential.user);

      // Guardar UID y token de sesión en frontend
      localStorage.setItem('uid', resp.uid);
      localStorage.setItem('sessionToken', resp.token);

         this.modalCtrl.dismiss({uid:resp.uid});

      // Aquí puedes redirigir al usuario al dashboard/pedido
      // this.router.navigate(['/dashboard']);

    } catch (error) {
      console.error('Error al crear sesión:', error);
      alert('❌ No se pudo iniciar sesión');
    }

    // Opcional: limpiar doc temporal
    // await deleteDoc(tempRef);

  } catch (error) {
    console.error('Error al verificar el código:', error);
    alert('❌ Error al verificar el código.');
  }
  
  this.loadingConfirmar = false;  // ✅ DESACTIVAR spinner
}


 

  async enviarCodigoLogin() {
    if (!this.telefono || this.telefono.length < 10) {
      alert('Por favor ingresa un número válido 📱');
      return;
    }
    const codigo = this.generarCodigo6Digitos();

    // ⚠️ IMPORTANTE: el número debe ir en formato internacional E.164
    // Ejemplo México: +521 234567890
    const numeroFormateado = "521"+this.telefono;
  this.loadingEnviar = true;   // 🔥 activar bloque + spinner

    const body = {
      Phone: numeroFormateado,
      Text: codigo.toString(),   // Texto opcional
      PhBs: 'TU_PHONE_ID',                 // phoneNumberId de tu WABA
      Ph: 'TU_PHONE_ID',                   // si lo usas igual
      Tk: 'TU_ACCESS_TOKEN',              // token de graph api
      Mkt: 'Gral',
      Img: ''                             // si quieres enviar imagen, si no, vacío
    };

    try {
      const resp = await this.http.post('https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/loginWppRequest', body).toPromise();
      console.log('Respuesta del backend:', resp);
      this.showInputCode = true     
      this.showToast('✅ Código enviado por WhatsApp');
    } catch (error) {
      console.error('❌ Error al enviar el código:', error);
      alert('Error al enviar el código');
    }
      this.loadingEnviar = false;  // ✅ DESACTIVAR spinner
  }
loadingEnviar = false;
loadingConfirmar = false;

async showToast(message: string) {
  const toast = document.createElement('ion-toast');
  toast.message = message;
  toast.duration = 2500;
  toast.color = 'dark';        // ✅ oscuro
  toast.position = 'top';      // puedes usar: "top" | "middle" | "bottom"
  toast.mode = 'ios';
  toast.buttons = [
    {
      icon: 'close',
      role: 'cancel'
    }
  ];

  document.body.appendChild(toast);
  await toast.present();
}

}
