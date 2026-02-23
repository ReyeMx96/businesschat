import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { get } from 'scriptjs';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.page.html',
  styleUrls: ['./add-card.page.scss'],
})
export class AddCardPage implements OnInit {

  constructor() { }
  stripe: any;
  card: any;
  cardExpiry: any;
  cardCvc: any;
  cardError: string = '';
  showAddCard = false;
selectedCard: number | null = null;
selectedAlternative: 'efectivo' | 'transferencia' | null = null;
cardNumber:any

private pk_live_key = environment.stripe_pk_key
uid= "acRis398fsmsj378f"
clientSecret:any
  ngOnInit() {
    setTimeout(() => {
      
      this.crearClienteStripe("valentin_s101@hotmail.com", this.uid)

      setTimeout( async() => {
          const callable = httpsCallable(this.functions, 'createSetupIntent');
          const result: any = await callable({ customerId: this.customerId });
          this.clientSecret = result.data.clientSecret; // 🔹 aquí guardas el client_secret
      }, 3000);
    }, 7000);
  }

async submitCard() {
  // confirmar setupIntent con el client_secret
  const { setupIntent, error } = await this.stripe.confirmCardSetup(
    this.clientSecret, // 🔹 NO pk_live, sino el client_secret devuelto por tu función createSetupIntent
    {
      payment_method: {
        card: this.cardNumber, // 🔹 tu elemento montado (#card-number)
      },
    }
  );

  if (error) {
    this.cardError = error.message;
    return;
  }

  console.log('Tarjeta guardada en Stripe:', setupIntent.payment_method);

  const paymentMethodId = setupIntent.payment_method;

  // llamar a la función saveCard en tu backend
  const callable = httpsCallable(this.functions, 'saveCard');
  const result: any = await callable({
    paymentMethod: paymentMethodId,
    customerId: this.customerId,
    uid: this.uid, // 👈 uid del usuario logueado
  });

  console.log('Respuesta backend:', result.data);

  if (result.data.success) {
    // Aquí puedes mostrar un toast o redirigir
    console.log('Tarjeta guardada en Firestore:', result.data.card);
    alert("Tarjeta guardada en Firestore:")
    this.charge(100)
  }
}

async charge(amount: number) {
  try {
    const callable = httpsCallable(this.functions, 'chargeCustomer');
    const result: any = await callable({
      customerId: this.customerId,
      amount: amount * 100,
    });

    if (result.data.success) {
      const pi = result.data.paymentIntent;
      alert(`✅ Pago exitoso\nMonto: $${pi.amount / 100} ${pi.currency.toUpperCase()}\nStatus: ${pi.status}`);
      console.log('Pago exitoso:', pi);
    }
  } catch (e: any) {
    // aquí recibes el error lanzado en el backend
    console.error("Error en el pago:", e);
    alert(`❌ Error en el pago: ${e.message || 'Error desconocido'}`);
  }
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
    private app = initializeApp(environment.firebaseConfig);
  
    private functions = getFunctions(this.app);
    customerId:any

  async crearClienteStripe(email: string, uid: string) {
    const createCustomer = httpsCallable(this.functions, 'createStripeCustomer');
    const result: any = await createCustomer({ email, uid});
    const customerId = result.data.customerId;
  
    // Guardarlo en Firestore/Realtime DB para usarlo después
    console.log("Customer ID:", customerId);
    this.customerId = customerId
    return customerId;
  }
 ngAfterViewInit() {
  this.loadStripe().then(() => {
    this.stripe = (window as any).Stripe(this.pk_live_key);
    const elements = this.stripe.elements();

    const style = {
      base: {
        color: '#000',
        fontSize: '16px',
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
}
