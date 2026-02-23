import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { environment } from 'src/environments/environment.prod';
import { get } from 'scriptjs';
@Component({
  selector: 'app-choose-payment-methods',
  templateUrl: './choose-payment-methods.page.html',
  styleUrls: ['./choose-payment-methods.page.scss'],
})
export class ChoosePaymentMethodsPage implements OnInit {
  instrucciones: any;
  email: string = '';
  monto: number = 160; // ejemplo por defecto

  // Inicializar Firebase y Functions
  private app = initializeApp(environment.firebaseConfig);
  private functions = getFunctions(this.app);

  constructor(private toastCtrl: ToastController,private http: HttpClient) {}

  ngOnInit(): void {}


  customerId : any
savedCards = [
  { brand: 'Visa', last4: '4242', exp_month: '12', exp_year: '25' },
  { brand: 'Mastercard', last4: '5555', exp_month: '08', exp_year: '24' },
];
  stripe: any;
  card: any;
  cardExpiry: any;
  cardCvc: any;
  cardError: string = '';
  showAddCard = false;
selectedCard: number | null = null;
selectedAlternative: 'efectivo' | 'transferencia' | null = null;
clientSecret = ""
selectCard(index: number) {
  this.selectedCard = index;
  this.selectedAlternative = null;
}

//  ngAfterViewInit() {
//     this.loadStripe().then(() => {
//       this.stripe = (window as any).Stripe('pk_live_51S8xDBI3MRF4tWwBanlRJKfEdvijKLgszKAJVAnP2LzY3lqQbSm36MEqa4Ar91gEoeEfM1sBt6PCopQuvtqdiWBC00LsxMQHvC');

//       const elements = this.stripe.elements();
//       const style = {
//       base: {
//         color: '#000',
//         fontSize: '16px',
//         fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
//         '::placeholder': { color: '#747474ff' },
//       },
//       invalid: {
//         color: '#ff3860',
//       },
//     };

//     this.card = elements.create('card', { style });
//     this.card.mount('#card-element');
    
//     this.cardExpiry = elements.create('cardExpiry', { style });
//     this.cardExpiry.mount('#card-expiry');

//     this.cardCvc = elements.create('cardCvc', { style });
//     this.cardCvc.mount('#card-cvc');

//     }).catch(err => console.error(err));
//   }
cardNumber:any
 ngAfterViewInit() {
  this.loadStripe().then(() => {
    this.stripe = (window as any).Stripe('TU_PUBLIC_KEY');
    const elements = this.stripe.elements();

    const style = {
      base: {
        color: '#000',
        fontSize: '19px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        '::placeholder': { color: '#747474ff' },
      },
      invalid: { color: '#ff3860' },
    };

    // NO crees 'card' completo
    this.cardNumber = elements.create('cardNumber', { style });
    this.cardNumber.mount('#card-number');

    this.cardExpiry = elements.create('cardExpiry', { style });
    this.cardExpiry.mount('#card-expiry');

    this.cardCvc = elements.create('cardCvc', { style });
    this.cardCvc.mount('#card-cvc');

  }).catch(err => console.error(err));
}

 loadStripe() {
    return new Promise<void>((resolve, reject) => {
      if ((window as any).Stripe) {
        resolve(); // ya cargado
        return;
      }

      get('https://js.stripe.com/v3/', () => {
        if ((window as any).Stripe) {
          resolve();
        } else {
          reject('Stripe.js no se cargó correctamente');
        }
      });
    });
  }

  async openAddCard() {
    await this.loadStripe();
    this.stripe = (window as any).Stripe('TU_PUBLIC_KEY');

    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount('#card-element');
  }

  // async submitCard(clientSecret: string) {
  //   const { setupIntent, error } = await this.stripe.confirmCardSetup(clientSecret, {
  //     payment_method: { card: this.card },
  //   });

  //   if (error) {
  //     console.error(error.message);
  //   } else {
  //     console.log('Tarjeta guardada con éxito', setupIntent.payment_method);
  //   }
  // }
  closeAddCard() {
    this.showAddCard = false;
  }
async submitCard() {
  const { setupIntent, error } = await this.stripe.confirmCardSetup(this.clientSecret, {
    payment_method: { card: this.card }
  });

  if (error) {
    this.cardError = error.message;
  } else {
    console.log('Tarjeta guardada:', setupIntent.payment_method);
  }
}

selectAlternative(type: 'efectivo' | 'transferencia') {
  this.selectedAlternative = type;
  this.selectedCard = null;
}

async crearClienteStripe(email: string, uid: string) {
  const createCustomer = httpsCallable(this.functions, 'createStripeCustomer');
  const result: any = await createCustomer({ email, uid});
  const customerId = result.data.customerId;

  // Guardarlo en Firestore/Realtime DB para usarlo después
  console.log("Customer ID:", customerId);
  this.customerId = customerId
  return customerId;
}
 async iniciarTransferencia() {
  try {
    // 1️⃣ Crear PaymentIntent
    const createBankTransfer = httpsCallable(this.functions, 'createBankTransfer');
    const paymentIntent: any = await createBankTransfer({
      amount: 1000, // $160 MXN en centavos
      currency: 'mxn',
      customerId: this.customerId, // ⚡ tu ID real de cliente
    });
    console.log(paymentIntent);
    // 2️⃣ Obtener instrucciones SPEI con reintentos si es necesario
    const getBankTransferInstructions = httpsCallable(this.functions, 'getBankTransferInstructions');
    let instrucciones: any = null;
    const maxRetries = 1;       // número máximo de reintentos
    const delayMs = 4000;       // espera 2 segundos entre intentos
    console.log(paymentIntent.data)
    for (let i = 0; i < maxRetries; i++) {
      const res: any = await getBankTransferInstructions({ paymentIntentId: paymentIntent.data.id });
      instrucciones = res.data.instructions;
      console.log(res)

      if (instrucciones) break; // si ya existen las instrucciones, salimos del loop
      await new Promise(r => setTimeout(r, delayMs));
    }
    console.log(instrucciones)
    // 3️⃣ Validar si se obtuvieron instrucciones
    if (!instrucciones) {
      const toast = await this.toastCtrl.create({
        message: 'Las instrucciones SPEI aún no están listas, intenta de nuevo en unos segundos.',
        duration: 4000,
        color: 'warning',
      });
      toast.present();
      return;
    }

    // 4️⃣ Guardar instrucciones y mostrar mensaje
    this.instrucciones = instrucciones;
    const toast = await this.toastCtrl.create({
      message: 'Instrucciones SPEI generadas ✅',
      duration: 3000,
      color: 'success',
    });
    toast.present();

  } catch (error: any) {
    console.log(error);
    const toast = await this.toastCtrl.create({
      message: 'Error: ' + error.message,
      duration: 4000,
      color: 'danger',
    });
    toast.present();
  }
}

}
