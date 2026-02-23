import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { AlertController, AlertInput, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { getFirestore, doc, getDoc, updateDoc, onSnapshot, Firestore, collection, setDoc } from 'firebase/firestore';
import { map } from 'rxjs';
import firebase from 'firebase/compat/app';
import { ModalimgComponent } from '../modals/modalimg/modalimg.component';
import { environment } from 'src/environments/environment.prod';

interface UserData {
  phone?: string;
  uid?: string;
  cred?: string;
  nombre?: string;
  rol? : string;
}
interface User {
  projects: any[]; // Cambia `any` por el tipo adecuado si lo conoces
  // Puedes agregar otros campos según sea necesario
}
export interface Restaurant {
    id?: string; // Opcional para el ID
    nombre: string;
    direccion: string;
    prepaTime: number;
    tarifa:string;
    bankNumber:string;
    direccionBs: string;
    banner:string;
    subsidio:any;
    uid:string;
    idprint:string;
    logo:string;
    telefono: string;
    currentLat:Number,
    currentLng:Number,
    rango?:number | undefined;
    key:string
    // Agrega otros campos según sea necesario
  }
@Component({
  selector: 'app-comanda',
  templateUrl: './comanda.page.html',
  styleUrls: ['./comanda.page.scss'],
})
export class ComandaPage implements OnInit {
  pedido: any;
  pedidoId = "";
  subtotal = 0
  
  currentLinkWppRepa = ""
  arrayPedido: any;

   rol : string | null = ""
  userId = ""
  isLoading: boolean = false;
  currentLinkWpp = ""
  public appPages = []
  currentBusiness = ""
  currentLinkWppCliente = ""
  marcaArray!: any[];
  pedidoSeleccionado: any;
  printID = ""
  acceptByName: string = '';

  constructor(
    private modal : ModalController,
    private alertCtrl: AlertController,
   private firestore: AngularFirestore,
    private route: ActivatedRoute,
    private toastCtrl : ToastController,
     private afAuth: AngularFireAuth,
    private loadingCtrl: LoadingController
  ) {

    this.afAuth.authState.subscribe(user => {
      if (user) {
        // El usuario está logueado
        console.log('Usuario logueado:', user);
        this.userId = user.uid
     
        this.getUserData()
  
      } else {
        // El usuario no está logueado
        let uniqueString = localStorage.getItem('uniqueString');

   

    
       console.log('No hay usuario logueado');
      }
    });

  }
// formatTextoToppings(texto: string): string {
//   return texto.replace(/\|/g, '<br>');
// }
formatTextoToppings(texto: string): string[] {
  if (!texto) return [];

  return texto
    .split('|')
    .map(t => t.trim())
    .filter(t => t.length > 0);
}

    async aceptarPedidoTransferencia(pedidoId: string, uid:string, nameRest: string,
       realRest: string, uidBs: string, cliente:string, autoacctype: string, arrayPedido:any) {
      try {
        // Obtener la instancia de Firestore
        const firestore = getFirestore();
        console.log(autoacctype)
    
        // Referencia al documento del pedido que deseas actualizar
        const pedidoRef = doc(firestore, `pedidos/${realRest}/today`, pedidoId);
        const pedidoRefAll = doc(firestore, `pedidos/all/today`, pedidoId);
        const pedidoRef2 = doc(firestore, `users/${uid}/pedidos`, pedidoId);
   

        // Actualizar el campo "status" a "Aceptado"
        if(autoacctype === ''){
          await updateDoc(pedidoRefAll, {
            status: 'Nuevo'
          });
          await updateDoc(pedidoRef, {
            status: 'Nuevo'
          });
           // Actualizar el campo "status" a "Aceptado"
           await updateDoc(pedidoRef2, {
            status: 'Nuevo'
          });
        }else{
          await updateDoc(pedidoRefAll, {
            status: autoacctype
          });
          await updateDoc(pedidoRef, {
            status: autoacctype
          });
           // Actualizar el campo "status" a "Aceptado"
           await updateDoc(pedidoRef2, {
            status: autoacctype
          });
        }
        this.sendNotification(uidBs," Tienes un nuevo pedido", "Pedido de " + cliente  )
        
        this.sendNotification(uid, "Transferencia validada", "Tu transferencia fue validada con exito " )
  
        const impresionesRef = collection(firestore, `/impresiones/${arrayPedido.idprint}/pedidos`);
        const impresionesOrderDocRef = doc(impresionesRef, pedidoId);
        arrayPedido.status = 'Nuevo'

        await setDoc(impresionesOrderDocRef, { ...arrayPedido });
    this.pedidoReczonUpdateStatus(arrayPedido)
        console.log(this.pedidoSeleccionado)
      //  this.pedidoSeleccionado['status'] = "Aceptado"
        console.log(`Pedido ${pedidoId} ha sido aceptado.`);
      } catch (error) {
        console.error('Error al aceptar el pedido:', error);
      }
    }

    pedidoReczonUpdateStatus(data:any) {
    // URL de tu función sendNotifPush (ajusta esta URL a tu proyecto)
    const url = 'https://us-central1-reczon-delivery.cloudfunctions.net/api/updateStatePedidoTransf';
  
    // Datos que se enviarán en la solicitud
    const pedidoData = data
  
    // Enviar la solicitud POST al backend (Firebase Functions)
    fetch(url, {
      method: 'POST',                  // Método de la solicitud
      headers: {
        'Content-Type': 'application/json',  // Indica que el cuerpo es JSON
      },
      body: JSON.stringify(pedidoData),      // Convertir los datos a formato JSON
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        return response.json();        // Parsear la respuesta a JSON
      })
      .then(data => {
        console.log('Respuesta recibida:', data);  // Manejar la respuesta del servidor
      })
      .catch(error => {
        console.error('Error al llamar a la función:', error);  // Manejar errores
      });
  }

    pedidoReczonUpdateStatusCancelar(data:any) {
    // URL de tu función sendNotifPush (ajusta esta URL a tu proyecto)
    const url = 'https://us-central1-reczon-delivery.cloudfunctions.net/api/updateStatePedidoCancel';
  
    // Datos que se enviarán en la solicitud
    const pedidoData = data
  
    // Enviar la solicitud POST al backend (Firebase Functions)
    fetch(url, {
      method: 'POST',                  // Método de la solicitud
      headers: {
        'Content-Type': 'application/json',  // Indica que el cuerpo es JSON
      },
      body: JSON.stringify(pedidoData),      // Convertir los datos a formato JSON
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        return response.json();        // Parsear la respuesta a JSON
      })
      .then(data => {
        console.log('Respuesta recibida:', data);  // Manejar la respuesta del servidor
      })
      .catch(error => {
        console.error('Error al llamar a la función:', error);  // Manejar errores
      });
  }


getUserData() {
  this.firestore.collection('users').doc(this.userId).valueChanges().subscribe(userData => {
    const data = userData as UserData; // Casting el tipo a UserData
    if (data) {
      // Asignar los valores de forma segura, con valores por defecto si no existen
 
      this.rol  = data.rol ?? null;
      const nombre = data.nombre ?? 'No Name';

      // Asignar los valores que existen a las variables del componente

      console.log('Name:', nombre);
    } else {
      console.warn('No se pudieron obtener datos del usuario:', userData);
    }
  });
}
  async ngOnInit() {

    this.pedidoId = this.route.snapshot.paramMap.get('array') || '';
console.log(this.pedidoId)
    await this.loadPedido();
  }

  async mostrarAlertaCancelacion(pedidoId: string, uid: string, nameRest: string, realRest: string, id: string, array:any) {
    const alert = await this.alertCtrl.create({
      header: 'Motivo de cancelación',
      inputs: [
     
        {
          name: 'motivo',
          type: 'radio',
          label: 'Cliente no localizable',
          value: 'Cliente no localizable'
        },
        {
          name: 'motivo',
          type: 'radio',
          label: 'El restaurante no tiene el producto',
          value: 'El restaurante no tiene el producto'
        },
        {
          name: 'motivo',
          type: 'radio',
          label: 'Cliente solicitó cancelación',
          value: 'Cliente solicitó cancelación'
        },
        {
          name: 'motivo',
          type: 'radio',
          label: 'Otro',
          value: 'Otro'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancelado por el usuario');
          }
        },
        {
          text: 'Confirmar',
          handler: async (data) => {
            if (data) {
              console.log('Motivo seleccionado:', data);
              if (data === 'Otro') {
                // Mostrar otra alerta para escribir motivo personalizado
                const otroAlert = await this.alertCtrl.create({
                  header: 'Escribe el motivo',
                  inputs: [
                    {
                      name: 'motivoPersonalizado',
                      type: 'text',
                      placeholder: 'Motivo de cancelación'
                    }
                  ],
                  buttons: [
                    {
                      text: 'Cancelar',
                      role: 'cancel',
                      handler: () => {
                        console.log('Cancelado motivo personalizado');
                      }
                    },
                    {
                      text: 'Aceptar',
                      handler: (otroData) => {
                        if (otroData.motivoPersonalizado && otroData.motivoPersonalizado.trim() !== '') {
                          console.log('Motivo personalizado:', otroData.motivoPersonalizado);
                          this.cancelarPedido(pedidoId, uid, nameRest, realRest, id, otroData.motivoPersonalizado,array);
                        } else {
                          this.showToast('Debes escribir un motivo');
                        }
                      }
                    }
                  ]
                });
  
                await otroAlert.present();
  
              } else {
                this.cancelarPedido(pedidoId, uid, nameRest, realRest, id, data,array);
              }
            } else {
              console.log('No se seleccionó motivo');
              this.showToast('No se seleccionó motivo');
            }
          }
        }
      ]
    });
  
    await alert.present();
  }
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      position:"middle",
      color:"dark",
      duration: 2000
    });
    toast.present();
  }
  
  async cancelarPedido(pedidoId: string, uid:string, nameRest: string, realRest: string, id:string, motivo:string, array:any) {
    try {
      // Obtener la instancia de Firestore
      const firestore = getFirestore();
  
      // Referencia al documento del pedido que deseas actualizar
      const pedidoRef = doc(firestore, `pedidos/${this.currentBusiness}/today`, pedidoId);
      const pedidoRefAll = doc(firestore, `pedidos/all/today`, pedidoId);

      const pedidoRef2 = doc(firestore, `users/${uid}/pedidos`, pedidoId);
      this.sendNotification(uid, "Pedido Cancelado", "Tu pedido ha sido cancelado por: " + nameRest + ". Una enorme disculpa, Te esperamos de nuevo"  )
      const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();

      await updateDoc(pedidoRefAll, {
        status: 'Cancelado',
        cancelTime: serverTimestamp,
        motivo:motivo,

        cancelBy:this.userId,
      });
      // Actualizar el campo "status" a "Aceptado"
      await updateDoc(pedidoRef, {
        status: 'Cancelado',
        motivo:motivo,

        cancelTime: serverTimestamp,
        cancelBy:this.userId,
      });
       // Actualizar el campo "status" a "Aceptado"
       await updateDoc(pedidoRef2, {
        status: 'Cancelado',
        cancelTime: serverTimestamp,
        cancelBy: this.userId,
        motivo:motivo,

      });
      this.pedido['status'] = "Cancelado"

      if(id === undefined || id === null){

      }else{
        const repartidoresRefAll = doc(firestore, `repartidores/${id}`);
      
        // Actualiza el campo `active` a `false`
        await updateDoc(repartidoresRefAll, {
          active: true,
        });
      }
  this.pedidoReczonUpdateStatusCancelar(array)


      console.log(`Pedido ${pedidoId} ha sido cancelado.`);
    } catch (error) {
      console.error('Error al aceptar el pedido:', error);
    }
  }
    tkMichelotes = environment.tokenMichelotes
    tkToyama = environment.tokenToyama
    tk = environment.tkBsChat
  actualizarStatusPedido(idPedido: string, nuevoStatus: string, uidUser:string) {
     // Simular el proceso de 1 segundo
     this.isLoading = true;

     setTimeout(() => {
      // Aquí pondrías la lógica real para actualizar el estado del pedido
      this.pedido.status = nuevoStatus

      // Finaliza el spinner y habilita el botón
      this.isLoading = false;
    }, 1700);

    const firestore = getFirestore();
    const pedidoRefAll = doc(firestore, `pedidos/all/today`, idPedido);
    
    const pedidoRef = doc(firestore, `pedidos/${this.currentBusiness}/today`, idPedido);
    const pedidoRef2 = doc(firestore, `users/${uidUser}/pedidos`, idPedido);
    
    var bodyTxt  = ""
    if(nuevoStatus === "En preparacion"){
bodyTxt = "Tu pedido esta en preparación."
var dataClient6 = {}
      if(this.phoneRest === "5218333861194"){
    dataClient6 = {
        Text: "Tu pedido ya está en proceso de preparación🧑‍🍳 elaboramos los productos con mucho esmero para que disfrutes tu momento más sabroso 😋 🌽🍓",
        Pay:"Efectivo",
        Ph: "5218333861194",
        Tk:this.tkMichelotes,
        Phone:this.pedido.phone,
        PhBs: "331199676738389",
      }
      }
      if(this.phoneRest === "5218334460818"){
        dataClient6 = {
        Text: "Tu pedido ya está en proceso de preparación🧑‍🍳😋",
        Pay:"Efectivo",
        Ph: "5218334460818",
        Tk:this.tk,
        Phone:this.pedido.phone,
        PhBs: "861393147061358",
      }
      }
     if(this.phoneRest === "5218332367397"){
        dataClient6 = {
        Text: "Tu pedido ya está en proceso de preparación🧑‍🍳😋",
        Pay:"Efectivo",
        Ph: "5218332367397",
        Tk:this.tk,
        Phone:this.pedido.phone,
        PhBs: "969119026283394",
      }
      }
     this.sendMsgWhatsapp(dataClient6)

    }
    if(nuevoStatus === "Listo para recoger"){
      bodyTxt = "Tu pedido esta listo para recoger."
    
    //   var dataClient6 = {
    //     Text: "Tu pedido está en camino. Te recomendamos estar al pendiente. El repartidor te llamará y/o te mandará mensaje cuando esté por llegar. ¿Listo para recibir los snacks más deliciosos? 🤩",
    //     Pay:"Efectivo",
    //     Ph: "5218333861194",
    //     Tk:this.tkMichelotes,
    //     Phone:this.pedido.phone,
    //     PhBs: "331199676738389",
    //   }
    //  this.sendMsgWhatsapp(dataClient6)

          }
    this.sendNotification(uidUser, "Pedido " + nuevoStatus, bodyTxt  )

    updateDoc(pedidoRefAll, { status: nuevoStatus })
    .then(() => {
      console.log('Estado del pedido actualizado con éxito');
      this.pedido['status'] = nuevoStatus

    })
    .catch((error) => {
      console.error('Error al actualizar el estado del pedido:', error);
    });
    // Actualiza el campo status en el documento de Firestore
    updateDoc(pedidoRef, { status: nuevoStatus })
      .then(() => {
        console.log('Estado del pedido actualizado con éxito');
      this.pedido['status'] = nuevoStatus

      })
      .catch((error) => {
        console.error('Error al actualizar el estado del pedido:', error);
      });

         // Actualiza el campo status en el documento de Firestore
    updateDoc(pedidoRef2, { status: nuevoStatus })
    .then(() => {
      console.log('Estado del pedido actualizado con éxito');
    })
    .catch((error) => {
      console.error('Error al actualizar el estado del pedido:', error);
    });

  }

   sendMsgWhatsapp(datax:any){
    // URL de tu función sendNotifPush
  const url = 'https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/sendWppFast';
  
  // Datos que se enviarán en la solicitud
  const data = datax
  
  // Enviar la solicitud POST al backend
  fetch(url, {
    method: 'POST',                  // Método de la solicitud
    headers: {
      'Content-Type': 'application/json',  // Indica que el cuerpo es JSON
    },
    body: JSON.stringify(data),      // Convertir los datos a formato JSON
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
      return response.json();        // Parsear la respuesta a JSON
    })
    .then(data => {
      console.log('Respuesta recibida:', data);  // Manejar la respuesta del servidor
    })
    .catch(error => {
      console.error('Error al llamar a la función:', error);  // Manejar errores
    });
  
  }
  goToWppCliente() {
    // Construir la URL para el restaurante
    const urlRepa = `https://api.whatsapp.com/send?phone=${this.pedido.phone.trim()}&text=Hola cliente `;
    this.currentLinkWppCliente = urlRepa;
    alert(urlRepa)
  }
  goToWppSoyJuan() {
    // Construir la URL de WhatsApp
    const phone = "+528331202443"; // Número de teléfono
    const text = "¡Hola!, Necesito soporte";
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`;
    this.currentLinkWpp = url
    alert(url)
  }
  goToWppRepa() {
    // Construir la URL para el restaurante
   
    const urlRepa = `https://api.whatsapp.com/send?phone=+52${this.pedido.CelRepa.trim()}&text=Hola repartidor`;
    this.currentLinkWppRepa = urlRepa;
    alert(this.currentLinkWppRepa)
  }
  getStatusColor(status: string): string {
    switch (status) {
      case 'Nuevo':
        return 'rgb(255 232 181)'; // Color para 'Nuevo'
      case 'Aceptado':
        return 'rgb(149 255 153)'; // Color para 'Aceptado'
      case 'En preparacion':
        return 'rgb(126 227 245)'; // Color para 'En preparación'
      case 'Recoger en tienda':
        return 'rgb(255 134 194)'; // Color para 'Recoger en tienda'
      case 'Listo para recoger':
        return 'rgb(225 127 255)'; // Color para 'Listo para recoger'
      case 'En camino':
        return 'rgb(171 199 255)'; // Color para 'En camino'
      case 'Entregado':
        return 'rgb(117 157 253)'; // Color para 'Entregado'
      case 'Cancelado':
        return 'rgb(255 100 100)'; // Color para 'Cancelado'
      default:
        return '#000000'; // Color por defecto
    }
}

loadPedido() {
  this.loadingCtrl.create({
    message: 'Cargando pedido...',
  }).then(loading => {
    loading.present();

    try {
      const firestore = getFirestore();
      const pedidoRef = doc(firestore, 'pedidos/all/today', this.pedidoId);

      // Escuchar cambios en tiempo real
      onSnapshot(pedidoRef, (pedidoSnap) => {
        if (pedidoSnap.exists()) {
          this.pedido = pedidoSnap.data();
          console.log(this.pedido);
          if (this.pedido.acceptBy) {
          this.obtenerNombreDeUsuario(this.pedido.acceptBy);
          }
          
          this.currentBusiness = this.pedido['idBs'];
          this.loadrestauranteCache()
          this.arrayPedido = this.pedido|| [];
          this.printID = this.pedido['idprint'];
          this.subtotal = this.pedido['total'] - this.pedido['envio'] - this.pedido['tfs'];
        } else {
          console.error('Pedido no encontrado');
        }
      });
    } catch (error) {
      console.error('Error al obtener el pedido:', error);
    } finally {
      loading.dismiss();
    }
  });
}


restaurantdetails:any
phoneRest:any
 async loadrestauranteCache() {
 
  // Obtiene el documento del restaurante
  this.firestore.doc<Restaurant>(`restaurantes/${this.currentBusiness}`)
    .valueChanges({ idField: 'id' })
    .subscribe(data => {
      if (data) {
       // console.log('Restaurant data:', data);
        this.restaurantdetails = data; // Asigna los datos si existen
        this.phoneRest = data.telefono
        this.subsidio = data.subsidio || 0;


      } else {
        console.warn('No restaurant found with the given ID.');
      }
    });
  }

async imprimir() {
  const alert = await this.alertCtrl.create({
    header: 'Confirmar impresión',
    message: '¿Estás seguro de que deseas imprimir este pedido?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Impresión cancelada');
        },
      },
      {
        text: 'Sí, imprimir',
        handler: async () => {
          const firestore = getFirestore();
          const impresionesRef = collection(firestore, `/impresiones/${this.printID}/pedidos`);
          const impresionesOrderDocRef = doc(impresionesRef, this.pedidoId);
          await setDoc(impresionesOrderDocRef, this.arrayPedido);
          console.log('Pedido enviado a impresión');
        },
      },
    ],
  });

  await alert.present();
}
getCantidadTotal(): number {
  if (!this.pedido?.items) return 0;
  return this.pedido.items.reduce((total:any, item:any) => total + item.quantity, 0);
}

async obtenerNombreDeUsuario(uid: string) {
  try {
    const firestore = getFirestore();
    const userRef = doc(firestore, `users/${uid}`);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      this.acceptByName = data['nombre'] || uid; // fallback al UID si no hay nombre
    } else {
      this.acceptByName = uid; // fallback si no existe
    }
  } catch (error) {
    console.error('Error al obtener el nombre del usuario:', error);
    this.acceptByName = uid;
  }
}
getFormattedPrice(price: number): string {
  return price.toFixed(2);
}

  formatDate(date: Date) {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    return new Intl.DateTimeFormat('es-ES', options).format(date);
  }
 
 
  sendNotification(uid:string, title:string, body:string){
    // URL de tu función sendNotifPush
  const url = 'https://us-central1-soyjuan-mx.cloudfunctions.net/api/sendNotifPush';
  
  // Datos que se enviarán en la solicitud
  const data = {
    // Reemplaza con el ID real del pedido
    repartidor: {
      title:title,
      body: body,
      uid: uid,  // Reemplaza con el UID del repartidor
    },
    // Reemplaza con el nombre del restaurante
  };
  
  // Enviar la solicitud POST al backend
  fetch(url, {
    method: 'POST',                  // Método de la solicitud
    headers: {
      'Content-Type': 'application/json',  // Indica que el cuerpo es JSON
    },
    body: JSON.stringify(data),      // Convertir los datos a formato JSON
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
      return response.json();        // Parsear la respuesta a JSON
    })
    .then(data => {
      console.log('Respuesta recibida:', data);  // Manejar la respuesta del servidor
    })
    .catch(error => {
      console.error('Error al llamar a la función:', error);  // Manejar errores
    });
  
  }

async presentTiempoEntregaAlert(pedidoId: string, uid:string, nameRest: string, array:any) {
  const opciones: AlertInput[] = [
    {
      name: 'tiempoEntrega',
      type: 'radio',
      label: 'Default',
      value: 'default',
      checked: true
    },
    ...Array.from({ length: 10 }, (_, i) => {
      const value = 15 + i * 5;
      return {
        name: 'tiempoEntrega',
        type: 'radio',
        label: `${value} minutos`,
        value: value
      } as AlertInput;
    })
  ];

  const alert = await this.alertCtrl.create({
    header: 'Selecciona el tiempo de entrega',
    inputs: opciones,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Aceptar',
        handler: (selectedValue: string | number) => {
          this.showToast("Se seleccionaron" + selectedValue + " minutos")
          if (selectedValue === 'default') {
            console.log('🟢 Se mantuvo el tiempo actual.');
            this.aceptarPedido(pedidoId, uid, nameRest, 20, array);
            return;
          }
          this.aceptarPedido(pedidoId, uid, nameRest, Number(selectedValue), array);
          console.log('⏱️ Nuevo tiempo seleccionado:', selectedValue);
        }
      }
    ]
  });

  await alert.present();
}
totalCobrarCliente = 0
totalPagar = 0
subsidio = 0
  copiarTexto(marca: any) {
    this.showToast("Copiado con exito")
    const lat = marca.latCliente; // Reemplaza con tu latitud
    const lng = marca.lngCliente; // Reemplaza con tu longitud
    
    const googleMapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
    const total = this.getFormattedPrice(+marca.total);
    const total2 = this.getFormattedPrice(+marca.total - +this.subsidio);
    const envio = this.getFormattedPrice(+marca.envio);
    const tfs = this.getFormattedPrice(+marca.tfs);
    const km = this.getFormattedPrice(+marca.km);
    this.totalCobrarCliente = parseFloat(envio) + parseFloat(total)

  if(marca.typePay === 'Transferencia'){
      this.totalCobrarCliente = 0
      this.totalPagar = 0
    }else{
      
    }




    const texto = `
      Nuevo Pedido
      Id: ${marca.idn}
      Método de pago: ${marca.typePay}
      Total a pagar: $${total2}
      Distancia: ${km} km
      Gastos de envío: ${envio}
      Tarifa de lluvia: ${marca.tfll}
      Total gastos de envio: ${+envio + +marca.tfll}
      Total a cobrar cliente: ${+this.totalCobrarCliente + +marca.tfll - +this.subsidio}
      -----------------------------
      Recolección
      Id Recolección Repartidor: ${marca.codeTienda}
      ${marca.nameRest}
      ${marca.direccionBs}
      -----------------------------
      Entrega
      Id Entrega: ${marca.codeCliente}
      ${marca.cliente}
      ${marca.direccion}
      Ref. del domicilio: ${marca.typeHouse} ${marca.refSt}
      Cel. ${marca.phone}
      ${googleMapsLink}
    `;
  
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto)
        .then(() => {
          console.log('Texto copiado al portapapeles');
        })
        .catch(err => {
          console.error('Error al copiar el texto: ', err);
        });
    } else {
      // Alternativa: Usar un textarea temporal
      const textArea = document.createElement('textarea');
      textArea.value = texto;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      console.log('Texto copiado usando método alternativo');
    }
  }
  isLargeScreen = false
    checkScreenSize() {
    this.isLargeScreen = window.innerWidth >= 1100; // O el tamaño que prefieras
  }

  async aceptarPedido(pedidoId: string, uid:string, nameRest: string, timeAccept: number, data:any) {
    try {
      this.isLoading = true;

     
      // Obtener la instancia de Firestore
      const firestore = getFirestore();
  
      // Referencia al documento del pedido que deseas actualizar
      const pedidoRef = doc(firestore, `pedidos/${this.currentBusiness}/today`, pedidoId);
      const pedidoRefAll = doc(firestore, `pedidos/all/today`, pedidoId);
      const pedidoRef2 = doc(firestore, `users/${uid}/pedidos`, pedidoId);
      // Actualizar el campo "status" a "Aceptado"
         const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();
   const fecha = new Date();

const meses = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];
const dia = fecha.getDate();
const mesNombre = meses[fecha.getMonth()];
const año = fecha.getFullYear();
const horas = fecha.getHours().toString().padStart(2, '0');
const minutos = fecha.getMinutes().toString().padStart(2, '0');
const fechaFormateada = `${dia} ${mesNombre} ${año} ${horas}:${minutos}`;
console.log(fechaFormateada);
      if(timeAccept === 0){
          await updateDoc(pedidoRefAll, {
        status: 'Aceptado',
        acceptTst: serverTimestamp,
        prepaTime: +timeAccept,

        acceptTime: fechaFormateada,
        acceptBy: this.userId,
      });
      await updateDoc(pedidoRef, {
        status: 'Aceptado',
        acceptTst: serverTimestamp,
        prepaTime: +timeAccept,

        acceptTime: fechaFormateada,
        acceptBy: this.userId,
      });
       // Actualizar el campo "status" a "Aceptado"
       await updateDoc(pedidoRef2, {
        status: 'Aceptado',
        acceptTime: fechaFormateada,
        prepaTime: +timeAccept,

        acceptTst: serverTimestamp,

        acceptBy:  this.userId,
      });
      }else{
              await updateDoc(pedidoRefAll, {
        status: 'Aceptado',
        prepaTime: +timeAccept,
        acceptTst: serverTimestamp,

        acceptTime: fechaFormateada,
        acceptBy: this.userId,
      });
      await updateDoc(pedidoRef, {
        status: 'Aceptado',
        prepaTime: +timeAccept,
        acceptTst: serverTimestamp,

        acceptTime: fechaFormateada,
        acceptBy: this.userId,
      });
       // Actualizar el campo "status" a "Aceptado"
       await updateDoc(pedidoRef2, {
        status: 'Aceptado',
        acceptTime: fechaFormateada,
        acceptTst: serverTimestamp,
        prepaTime: +timeAccept,
        acceptBy:  this.userId,
      });
      }
  
      this.sendNotification(uid, "Pedido Aceptado", "Tu pedido ha sido aceptado por: " + nameRest  )
 // Simular el proceso de 1 segundo
    if (this.pedido.devMode === "A domicilio"){
      this.enviarPedido(data, timeAccept)

    }else{
      

    }
 setTimeout(() => {
  // Aquí pondrías la lógica real para actualizar el estado del pedido
  this.pedido.status = "Aceptado"

  // Finaliza el spinner y habilita el botón
  this.isLoading = false;
}, 1000);
      console.log(this.pedidoSeleccionado)
    //  this.pedidoSeleccionado['status'] = "Aceptado"
      console.log(`Pedido ${pedidoId} ha sido aceptado.`);
    } catch (error) {
      console.error('Error al aceptar el pedido:', error);
    }
  }
 enviarPedido(data:any, timeAccept:any) {
    // URL de tu función sendNotifPush (ajusta esta URL a tu proyecto)
    const url = 'https://us-central1-reczon-delivery.cloudfunctions.net/api/rczped';
    data.coordenadas = {
      dir: data.nameRest,
      lat: data.latBs,
      lng: data.lngBs
    }
    data.timeAccept = timeAccept

    // Datos que se enviarán en la solicitud
    const pedidoData = data
  
    // Enviar la solicitud POST al backend (Firebase Functions)
    fetch(url, {
      method: 'POST',                  // Método de la solicitud
      headers: {
        'Content-Type': 'application/json',  // Indica que el cuerpo es JSON
      },
      body: JSON.stringify(pedidoData),      // Convertir los datos a formato JSON
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        return response.json();        // Parsear la respuesta a JSON
      })
      .then(data => {
        console.log('Respuesta recibida:', data);  // Manejar la respuesta del servidor
      })
      .catch(error => {
        console.error('Error al llamar a la función:', error);  // Manejar errores
      });
  }


    async openModalImg(url:string){
    
        const modal = await this.modal.create({
          component: ModalimgComponent,
          cssClass: 'custom-modal',
          componentProps: {img:url}
        });
    
        modal.onDidDismiss().then(async (result) => {
     
        });
    
        await modal.present(); // Present the modal
      
    }
  
}