import { Component, inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AlertController, ModalController, Platform, ToastController ,  AlertInput, LoadingController, ActionSheetController} from '@ionic/angular';
import { getFirestore,doc, updateDoc, arrayUnion,arrayRemove,collection, addDoc ,getDocs,onSnapshot, setDoc, query, where, Timestamp } from 'firebase/firestore';
import { ModalRepartidoresComponent } from 'src/app/modals/modal-repartidores/modal-repartidores.component';
import { ModalimgComponent } from 'src/app/modals/modalimg/modalimg.component';
// Definir un tipo específico para las propiedades del objeto
import firebase from 'firebase/compat/app';
import { environment } from 'src/environments/environment.prod';
import { take } from 'rxjs';


type Order = {
  Todos: string;
  Nuevo: string;
  idprint:string;

  'En proceso..': string;
  'Pedido listo para recoger': string;
  Enviado: string;
  Terminado: string;
  Cancelado: string;
};
export interface Restaurant {
  id?: string; // Opcional para el ID
  nombre: string;
  forceClose: boolean;
  direccion: string;
  direccionBs: string;
  banner:string;
  uid:string;
  logo:string;
  idprint:string;

  telefono: string;
  currentLat:Number,
  currentLng:Number,
  activo:boolean;
  key:string
  // Agrega otros campos según sea necesario
}
interface Marca {
  id: number;
  nombre: string;
  direccion: string;
  idrepa:string;
  telefono: string;
  idprint:string;
  imgTrans : string;
  correo: string;
  clasificacion: string;
  servicio: string;
  estado: string;
  tfll:string;
  channel:string;
  status:string;
}interface UserData {
  phone?: string;
  uid?: string;
  idprint:string;
  lat:any;
  cred?: string;
  nombre?: string;
  rol? : string;
}
type Pedido = {
  id: string;
  canal: string;
  status: string;
  tiempoPreparacion: string;
  tiempoCompra: string;
  cantidad: string;
  modoEnvio: string;
  cliente: string;
  idprint:string;

  tiempoFinalizacion: string;
  address: string;
};
@Component({
  selector: 'app-panel',
  templateUrl: './panel.page.html',
  styleUrls: ['./panel.page.scss'],
})
export class PanelPage implements OnInit {

  // Encabezados de la tabla
  tokenMichelotes = environment.tokenMichelotes
  filteredPedidos: any[] = [];
  isHovered: boolean[] = [];
  isTempBackgroundActive: boolean = false;
  pedidosTotalCountRestaurante = 0
  selectedSegment: string = 'todos';
  private intervalId: any;
  rol : string | null = ""
  currentBusiness : string = ""
  sound = new Audio('../../../assets/icon/notif.mp3'); // Cargar el archivo de sonido
  soundDone = new Audio('../../../assets/icon/notifDone.mp3'); // Cargar el archivo de sonido
  previousPedidosCount = 0; // Inicializar el número de pedidos previos
  pedidosDelDia: any[] = [];
  projects: any[] = [];
  isLargeScreen: boolean = false;
  totalPagar : any
  repaName = ""
  itemCount = 0
  isPlaying = false;

  totalCobrarCliente = 0
  pedidoSeleccionado: any;
  remainingTime: string = '';
  timer: any;
  selectedRepartidor: any;
  // Filtros
  filtros = {
    terminado: false,
    nuevo: false,
    enviado: false,
    cancelado: false
  };
  private activatedRoute = inject(ActivatedRoute);
  repaCel = ""
  selectedStatus = "todos"
  pedidosNuevosCount = 0
  // Array con los datos de las órdenes
  orders = [
    {
      id: '001',
      status: 'Nuevo',
      merchantName: 'Restaurant A',
      orderTime: '10:00 AM',
      deliveryTime: '10:30 AM',
      client: 'Juan Perez',
      amount: 15.00
    },
    {
      id: '002',
      status: 'Enviado',
      merchantName: 'Restaurant B',
      orderTime: '11:00 AM',
      deliveryTime: '11:30 AM',
      client: 'Ana Lopez',
      amount: 20.00
    },
    {
      id: '003',
      status: 'Cancelado',
      merchantName: 'Restaurant C',
      orderTime: '12:00 PM',
      deliveryTime: '12:30 PM',
      client: 'Carlos Gomez',
      amount: 25.00
    },
    {
      id: '004',
      status: 'Terminado',
      merchantName: 'Restaurant D',
      orderTime: '01:00 PM',
      deliveryTime: '01:30 PM',
      client: 'Maria Diaz',
      amount: 30.00
    }
    // Agregar más datos según sea necesario
  ];
  pedidosCanceladosCount = 0;
  pedidosNuevoCount = 0;
  pedidosAceptadoCount = 0;
  pedidosPendienteCount  = 0
  pedidosPreparacionCount = 0;
  pedidosListoCount = 0;
  pedidosEnCaminoCount = 0;
  pedidosTerminadoCount = 0;
  pedidosTodosTotalCountRestaurante  = 0
  pedidosTotalCount = 0;
  // Lista filtrada
  marcas = [
    {
      id: 1,
      channel: 'Business Chat', // Canal de venta
      status: 'Nuevo', // Status
      idrepa:"",
      nombre: 'Restaurante A', // Merchant Name
      orderTime: '10:30 AM', // Order Time
      deliveryTime: '11:30 AM', // Delivery Time
      cliente: 'Juan Perez', // Cliente
      amount: '$30.00', // Amount
      address: '123 Calle Principal', // Address
      deliveryMode: 'Envío a domicilio', // Delivery Mode
      paymentMethod: 'Tarjeta de crédito', // Payment Method
      timePreparation: '15 minutos', // Time Preparation
    },
    
    // Agrega más pedidos aquí si lo necesitas
  ];
  repaId = ""
  nombreRestaurante = ""
  pedidosFiltrados: any[] = [];
  sortDirection: { [key: string]: 'asc' | 'desc' } = {}; // Controlar la dirección de orden

  enableRestaurante = false
  filtro: Partial<Record<keyof Pedido, string>> = {};

  userId: string = 'uidUser'; // Reemplaza esto con el ID real del usuario
  searchTerm  = ""
  constructor(private actionSheetCtrl: ActionSheetController ,private loadingCtrl: LoadingController, private route: ActivatedRoute, private router:  Router,private modal: ModalController,private toastCtrl : ToastController,private alertCtrl: AlertController,private platform: Platform,  private afAuth: AngularFireAuth,private firestore: AngularFirestore,) {

    this.checkScreenSize();
    this.platform.resize.subscribe(() => this.checkScreenSize());
    if(this.isLargeScreen === true){
      this.selectedStatus = "TODOS"
   
    }else{
      this.selectedStatus = "TODOS"
   

    }
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
                          this.cancelarPedido(pedidoId, uid, nameRest, realRest, id, otroData.motivoPersonalizado, array);
                        } else {
                          this.showToast('Debes escribir un motivo');
                        }
                      }
                    }
                  ]
                });
  
                await otroAlert.present();
  
              } else {
                this.cancelarPedido(pedidoId, uid, nameRest, realRest, id, data, array);
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
  


  sortData(key: string) {
    // Alternar la dirección de orden: 'asc' (ascendente) o 'desc' (descendente)
    this.sortDirection[key] = this.sortDirection[key] === 'asc' ? 'desc' : 'asc';
    
    // Ordenar los pedidos
    this.pedidosFiltrados.sort((a, b) => {
      const valueA = a[key].toLowerCase ? a[key].toLowerCase() : a[key];
      const valueB = b[key].toLowerCase ? b[key].toLowerCase() : b[key];

      if (valueA < valueB) {
        return this.sortDirection[key] === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection[key] === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  
  playSound() {
    
    const audio = new Audio('./assets/icon/notif.mp3');
    audio.play().catch((error) => {
      console.error('Error al reproducir el audio:', error);
    });
  }
  
  
  onButtonClick() {
    this.playSound();  // Se ejecuta después de la interacción del usuario
  }
  
  finalizarPedido(pedidoId: string, uid:string, nameRest: string, realRest: string, id:string){
    this.alertCtrl.create({ 
      header: 'Finalizar pedido',
      message: '¿Estás seguro de que deseas marcar este pedido como entregado?',
      buttons: [
        {
          text: 'Cancelar',

          role: 'cancel',

          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {  
          text: 'Finalizar',
          handler: () => {
            // Lógica para finalizar el pedido en firestore aquí usando firebase aqui sin otros metodos
              this.firestore.doc(`pedidos/${this.currentBusiness}/today/${pedidoId}`).update({ status: 'Entregado' }) 
              this.firestore.doc(`pedidos/all/today/${pedidoId}`).update({ status: 'Entregado' }) 
          } 
        }
      ]
    }).then(res => {
      res.present();
    });
        
  }
async obtenerPedidosDelDia() {
  try {
    const firestore = getFirestore();
    const restaurantOrderRef = collection(firestore, `pedidos/${this.currentBusiness}/today`);

    // Calcular la fecha 10 días atrás
    //const fechaLimite = Timestamp.fromDate(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000));
    const fechaLimite = Timestamp.fromDate(new Date(Date.now() - 3 * 60 * 60 * 1000));


    // Crear la consulta con filtro por fecha
    const pedidosQuery = query(restaurantOrderRef, where('tst', '>=', fechaLimite));

    let previousPedidosCount = 0;

    onSnapshot(pedidosQuery, (snapshot) => {
      const pedidos: any[] = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        const items = data['items'] || []; 
        
        const totalQuantity = items.reduce((sum: any, item: any) => sum + (item.quantity || 0), 0);

        console.log(data['status'])
    

        pedidos.push({
          id: doc.id,
          ...data,
          totalQuantity
        });
      });

      pedidos.sort((a, b) => b.idn - a.idn);

      // Reset y conteo de estados
      this.pedidosCanceladosCount = 0;
      this.pedidosNuevoCount = 0;
      this.pedidosAceptadoCount = 0;
      this.pedidosPreparacionCount = 0;
      this.pedidosListoCount = 0;
      this.pedidosEnCaminoCount = 0;
      this.pedidosTerminadoCount = 0;
      this.pedidosPendienteCount = 0;
      this.pedidosTotalCount = pedidos.length;

      pedidos.forEach(pedido => {
        switch (pedido.status) {
          case 'Nuevo':
            this.pedidosNuevoCount++; break;
          case 'Aceptado':
            this.pedidosAceptadoCount++; break;
          case 'Pendiente':
            this.pedidosPendienteCount++; break;
          case 'En preparacion':
            this.pedidosPreparacionCount++; break;
          case 'Listo para recoger':
            this.pedidosListoCount++; break;
          case 'En camino':
            this.pedidosEnCaminoCount++; break;
        }
      });

      this.pedidosTodosTotalCountRestaurante =
        this.pedidosNuevoCount +
        this.pedidosPreparacionCount +
        this.pedidosListoCount +
        this.pedidosEnCaminoCount +
        this.pedidosAceptadoCount;

      pedidos.forEach((pedido, index) => {
        pedido.positionId = pedidos.length - index;
      });

      if (this.pedidosNuevoCount > 0) {
        this.reproducirSonidoNuevoPedido();
      }

      if (this.pedidosPendienteCount > 0 && this.currentBusiness === 'all') {
        this.reproducirSonidoNuevoPedido();
      }

      previousPedidosCount = pedidos.length;
      this.itemCount = previousPedidosCount;

      this.pedidosTotalCountRestaurante =
        this.pedidosPreparacionCount +
        this.pedidosListoCount +
        this.pedidosAceptadoCount;

      this.pedidosDelDia = pedidos;
      this.pedidosFiltrados = pedidos;

      if (this.selectedStatus !== 'todos') {
        this.applyFilter(this.selectedStatus);
      }

      this.pedidosFiltrados = this.pedidosDelDia;

    }, (error) => {
      console.error('Error al obtener los pedidos del día en tiempo real:', error);
    });

  } catch (error) {
    console.error('Error al establecer el listener de pedidos del día:', error);
  }
}

  

  reproducirSonidoNuevoPedido() {
    if (!this.isPlaying) {
        this.isPlaying = true;
        let audio = new Audio('../../../assets/icon/notif.mp3');
        audio.play().then(() => {
            this.isPlaying = false; // Permite volver a reproducir
        }).catch(error => {
            console.error("Error al reproducir sonido:", error);
            this.isPlaying = false;
        });
    }
}
  
  
  // Método para reproducir sonido de notificación
  playNotificationSound() {
    const audio = new Audio('../../../assets/icon/notif.mp3'); // Reemplaza con la ruta de tu archivo de sonido
  setTimeout(() => {
    audio.play().catch(error => console.error('Error al reproducir el sonido:', error));
    
  }, 1900);
  }
  
  
  
  
  
  
  getProjects() {
    this.firestore.collection(`users/${this.userId}/projects`).snapshotChanges().subscribe(data => {
      this.projects = data.map(e => {
        const projectData = e.payload.doc.data();
        // Verificar si projectData es un objeto y contiene el campo 'Name'
        if (projectData && typeof projectData === 'object' && 'Name' in projectData) {
          return {
            id: e.payload.doc.id,
            name: projectData.Name // Obtener el campo 'Name' del documento
          };
        } else {
          console.warn('Invalid project data:', projectData);
          return null; // O puedes manejar el error de otra manera
        }
      }).filter(project => project !== null); // Filtrar proyectos inválidos
  
      // Si solo hay un proyecto, obtener su campo 'Name'
      if (this.projects.length === 1) {
        const singleProject = this.projects[0];
        console.log('Nombre del único proyecto:', singleProject.name);
        // Aquí puedes asignarlo a una variable si lo deseas
        this.currentBusiness = singleProject.name;
     
        //this.loadCategories()
     
        this.obtenerPedidosDelDia()


      }else{
      
          const singleProject = this.projects[0];
          console.log('Nombre del único proyecto:', singleProject.name);
          // Aquí puedes asignarlo a una variable si lo deseas
          this.currentBusiness = singleProject.name;
       
      
       
          this.obtenerPedidosDelDia()
  
  
        
      }
    });
  }
  checkScreenSize() {
    this.isLargeScreen = window.innerWidth >= 5600; // O el tamaño que prefieras
  }

  mostrarDetalles(pedido: any) {
    this.pedidoSeleccionado = pedido;
  }
  async loadrestaurante() {
  
  
  // Obtiene el documento del restaurante
  this.firestore.doc<Restaurant>(`restaurantes/${this.currentBusiness}`)
    .valueChanges({ idField: 'id' })
    .subscribe(data => {
      if (data) {
        console.log('Restaurant data:', data);
        this.enableRestaurante = data.forceClose
        this.nombreRestaurante = data.nombre
        //this.latRest = data.currentLat
  

      } else {
        console.warn('No restaurant found with the given ID.');
      //  this.restaurantdetails = null; // Maneja el caso como desees
      }
    });
  }
  async alertActivar() {
  const alert = await this.alertCtrl.create({
    header: this.enableRestaurante ? 'Restaurante abierto' : 'Restaurante cerrado',
    message: '¿Qué deseas hacer?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Abrir',
        handler: () => {
          this.setForceClose(true);
          this.enableRestaurante = true;
        }
      },
      {
        text: 'Cerrar',
        handler: () => {
          this.setForceClose(false);
          this.enableRestaurante = false;
        }
      }
    ]
  });

  await alert.present();
}

  async setForceClose(force: boolean) {
  if (!this.currentBusiness) {
    console.error('No hay negocio seleccionado');
    return;
  }

  try {
    await this.firestore
      .doc(`restaurantes/${this.currentBusiness}`)
      .update({
        forceClose: force
      });

    console.log('forceClose actualizado a:', force);
  } catch (error) {
    console.error('Error al actualizar forceClose:', error);
  }
}

  //8331833452
  async loadCategories() {
    console.log(this.currentBusiness)
    // Asegúrate de que currentBusiness está definido y tiene el ID correcto del negocio actual
    this.firestore.collection('businesses/'+this.currentBusiness + '/categories')
    .valueChanges({ idField: 'id' })
    .subscribe(data => {
      console.log('Categories:', data);
      this.pedidosDelDia = data
    });
    console.log(this.pedidosDelDia)
  }
  onProjectChange(event: any) {
    const selectedId = event.detail.value; // Obtener el ID del proyecto seleccionado
   
    console.log('Proyecto seleccionado:', selectedId.name);
    this.currentBusiness = selectedId.name
    this.loadCategories()
    // Aquí puedes manejar la lógica que quieras realizar con el proyecto seleccionado
    // Por ejemplo, redirigir a otra página o cargar más información sobre el proyecto
  }
  cambiarStatus(event: any, marca: any) {
    if(marca.CelRepa){

    }else{
      if(event.detail.value === 'En camino'){
        this.showToast('Debes asignar un repartidor antes de cambiar de estado')
        return
      }
    }
    const nuevoStatus = event.detail.value;
   
    console.log(`Nuevo estado seleccionado: ${nuevoStatus}`);

  
    
    // Aquí puedes implementar la lógica para actualizar el campo status en Firestore
    this.actualizarStatusPedido(marca.id, nuevoStatus, marca.uid, marca);

    this.soundDone.play().catch(error => {
      console.error('Error al reproducir el sonido:', error);
    });
  }

  cambiarTiempoPreparacion(event: any, marca: any) {
    const nuevoStatus = event.detail.value;
    console.log(`Nuevo estado seleccionado: ${nuevoStatus}`);

    this.soundDone.play().catch(error => {
      console.error('Error al reproducir el sonido:', error);
    });
   
    // Aquí puedes implementar la lógica para actualizar el campo status en Firestore
    this.actualizarTiempoPreparacionPedido(marca.id, nuevoStatus, marca.uid);
  }
  ionViewWillLeave(){
    // Limpia el temporizador al destruir el componente
    clearInterval(this.timer);
    if (this.intervalId) {
      clearInterval(this.intervalId); // Detener el intervalo cuando se destruya el componente
      console.log('Interval detenido');
    }
  }
  ngOnDestroy() {
    // Limpia el temporizador al destruir el componente
    clearInterval(this.timer);
    if (this.intervalId) {
      clearInterval(this.intervalId); // Detener el intervalo cuando se destruya el componente
      console.log('Interval detenido');
    }
  }


  isPreparationTimeDisabled(fecha: string): boolean {
    const purchaseTime = this.parseDate(fecha);
    const currentTime = new Date();
    const diffInMilliseconds = currentTime.getTime() - purchaseTime.getTime();
    return diffInMilliseconds >= 3 * 60 * 1000;
  }

  parseDate(fecha: string): Date {
    const [day, month, year, time] = fecha.split(" ");
    const monthMap: { [key: string]: number } = {
      "enero": 0,
      "febrero": 1,
      "marzo": 2,
      "abril": 3,
      "mayo": 4,
      "junio": 5,
      "julio": 6,
      "agosto": 7,
      "septiembre": 8,
      "octubre": 9,
      "noviembre": 10,
      "diciembre": 11
    };
  
    const [hours, minutes] = time.split(":").map(Number);
    return new Date(Number(year), monthMap[month], Number(day), hours, minutes);
  }
  actualizarTiempoPreparacionPedido(idPedido: string, nuevoStatus: string, uidUser:string) {
    const firestore = getFirestore();
    const pedidoRef = doc(firestore, `pedidos/${this.currentBusiness}/today`, idPedido);
    const pedidoRef2 = doc(firestore, `users/${uidUser}/pedidos`, idPedido);

    // Actualiza el campo status en el documento de Firestore
    updateDoc(pedidoRef, { time_pre: nuevoStatus })
      .then(() => {
        console.log('Estado del pedido actualizado con éxito');
      })
      .catch((error) => {
        console.error('Error al actualizar el estado del pedido:', error);
      });

         // Actualiza el campo status en el documento de Firestore
    updateDoc(pedidoRef2, { time_pre: nuevoStatus })
    .then(() => {
      console.log('Estado del pedido actualizado con éxito');
    })
    .catch((error) => {
      console.error('Error al actualizar el estado del pedido:', error);
    });
  }
  
  actualizarStatusPedido(idPedido: string, nuevoStatus: string, uidUser:string, array:any) {
   

    const firestore = getFirestore();
    console.log(array)
    const pedidoRefAll = doc(firestore, `pedidos/all/today`, idPedido);
    console.log(nuevoStatus)
    
    const pedidoRef = doc(firestore, `pedidos/${array.idBs}/today`, idPedido);
    const pedidoRef2 = doc(firestore, `users/${uidUser}/pedidos`, idPedido);
    var bodyTxt  = ""
    if(nuevoStatus === "En camino"){
      bodyTxt = array.RepaName + " está en camino con tu pedido."
          }
    if(nuevoStatus === "En preparacion"){
bodyTxt = "Tu pedido está en preparación."
    }
   
  
    if(nuevoStatus === "Listo para recoger"){
      // var dataClient2 = {
      //   Text: "",

      //   Pay:"Efectivo",
      //   Ph: "5218333861194",
      //   Tk:this.tokenMichelotes,
      //   Phone:"5218334502378",
      //   PhBs: "217475241449410",
      // }
      // this.sendMsgWhatsapp(dataClient2)
      bodyTxt = "Tu pedido está listo para recoger."
      }

      updateDoc(pedidoRefAll, { status: nuevoStatus })
    .then(() => {
      console.log('Estado del pedido actualizado con éxito');
    //this.pedidoSeleccionado['status'] = nuevoStatus

    })
    .catch((error) => {
      console.error('Error al actualizar el estado del pedido:', error);
    });
    // Actualiza el campo status en el documento de Firestore
    updateDoc(pedidoRef, { status: nuevoStatus })
      .then(() => {
        console.log('Estado del pedido actualizado con éxito');

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
   // this.pedidoSeleccionado['status'] = nuevoStatus
   if(nuevoStatus === "Entregado"){
    this.isTempBackgroundActive = true;

    // Después de 10 segundos, restaurar el fondo
    setTimeout(() => {
      this.isTempBackgroundActive = false;
    }, 3000); // 10 segundos
    bodyTxt =  array.RepaName + " te ha entregado el pedido. Gracias por confiar en Busines HCat."
  
    const repartidoresRefAll = doc(firestore, `repartidores/${array.idrepa}`);
  
    // Actualiza el campo `active` a `false`
    updateDoc(repartidoresRefAll, {
      active: true,
    });


        }
    this.sendNotification(uidUser, nuevoStatus, bodyTxt  )

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
  
  async presentAlertPrompt(item: any) {
    const alert = await this.alertCtrl.create({
      header: 'Asignar Repartidor',
      inputs: [
        {
          name: 'repaName',
          type: 'text',
          placeholder: 'Nombre del repartidor'
        },
        {
          name: 'repaCel',
          type: 'number',
          placeholder: 'Celular del repartidor'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Asignación cancelada');
          }
        },
        {
          text: 'Asignar',
          handler: (data) => {
            this.repaName = data.repaName; // Asignar el nombre del repartidor a la variable
            this.repaCel = data.repaCel; // Asignar el nombre del repartidor a la variable
            this.repaId = data.idrepa
            console.log('Repartidor asignado:', this.repaName);
           
            this.agregarRepartidor(this.repaName, this.repaCel, item.id);

          }
        }
      ]
    });

    await alert.present();
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
  async openRepartidoresModal(marca:any) {
   
    const modal = await this.modal.create({
      component: ModalRepartidoresComponent,
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        this.selectedRepartidor = result.data; // Capture the selected repartidor
        console.log(result.data)
        this.repaCel = result.data['celular']
        this.repaName = result.data['nombre']
     
        console.log('Repartidor seleccionado:', this.selectedRepartidor);
        return this.asignarRepa(marca, result.data['id'])
      }
    });

    await modal.present(); // Present the modal
  }

  async agregarRepartidor(nombre: string, celular: string, pedidoId: string) {
    const repartidorData = {
      nombre: nombre,
      celular: celular,
      pedidoId: pedidoId, // Se puede incluir el ID del pedido si es necesario
    };

    try {
      const newRepartidorRef = this.firestore.collection('repartidores').doc(); // Crear nueva referencia
      await newRepartidorRef.set(repartidorData); // Guardar los datos en Firestore
      console.log('Repartidor agregado:', repartidorData);
    } catch (error) {
      console.error('Error al agregar el repartidor:', error);
    }
  }
  isMovedToTrash: boolean[] = [];

  moveToTrash(index: number) {
    // Cambia el estado para iniciar la animación de movimiento
    this.isMovedToTrash[index] = true;
  }

  
async asignarRepa(item:any,id:string){
console.log(item)
try {
  // Obtener la instancia de Firestore
  const firestore = getFirestore();

  // Referencia al documento del pedido que deseas actualizar

  const pedidoRef = doc(firestore, `pedidos/${item.idBs}/today`, item.id);
  const pedidoRefAll = doc(firestore, `pedidos/all/today`, item.id);
  const pedidoRef2 = doc(firestore, `users/${item.uid}/pedidos`, item.id);
  // Actualizar el campo "status" a "Aceptado"
  const repartidoresRefAll = doc(firestore, `repartidores/${id}`);
  // Actualiza el campo `active` a `false`
  await updateDoc(repartidoresRefAll, {
    active: false,
  });
  await updateDoc(pedidoRefAll, {
    RepaName: this.repaName,
    CelRepa: this.repaCel,
    idrepa: id,
  });
  await updateDoc(pedidoRef, {
    RepaName: this.repaName,
    CelRepa: this.repaCel,
    idrepa: id,


  });
   // Actualizar el campo "status" a "Aceptado"
   await updateDoc(pedidoRef2, {
    RepaName: this.repaName,
    CelRepa: this.repaCel,
    idrepa: id,


  });
  this.sendNotification(item.uid, "Repartidor Asignado",  this.repaName +  " es el repartidor asignado para tu pedido." )

  console.log(this.pedidoSeleccionado)
//  this.pedidoSeleccionado['status'] = "Aceptado"
  console.log(`Pedido ${item.id} ha sido aceptado.`);
} catch (error) {
  console.error('Error al asignar repartidor el pedido:', error);
}
  }

  onToggleChange(event: any) {

      const activeValue = event.detail.checked; // Este es el valor del toggle, true o false
      if(activeValue === true){
        this.showToast("Activaste la recepción de los pedidos.")

      }else{
        this.showToast("Se pausaron los pedidos.")

      }
      // Actualizar el campo 'active' en la referencia 'restaurantes/userID'
      this.firestore
        .doc(`restaurantes/${this.currentBusiness}`)
        .update({ forceClose: activeValue })
        .then(() => {
          console.log('Campo "active" actualizado correctamente.');
        })
        .catch((error) => {
          console.error('Error al actualizar el campo "active":', error);
        });
    
  }
  showToastAlert(marca:any){
    if(marca.CelRepa){

    }else{
 
      if(marca.status === 'Listo para recoger'){
        this.showToast('Debes asignar un repartidor antes de cambiar de estado')

      }
      
    }
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
      const impresionesRef = collection(firestore, `/impresiones/${arrayPedido.idprint}/pedidos`);
      
      // Actualizar el campo "status" a "Aceptado"
      arrayPedido.status = 'Nuevo'
      const impresionesOrderDocRef = doc(impresionesRef, pedidoId);
      await setDoc(impresionesOrderDocRef, { ...arrayPedido });
      setTimeout(() => {
      this.sendNotification(uidBs," Tienes un nuevo pedido", "Pedido de " + cliente  )
      this.sendNotificationCall(uidBs," Tienes un nuevo pedido", "Pedido de " + cliente  )

      }, 1000);
      
      this.sendNotification(uid, "Transferencia validada", "Tu transferencia fue validada con exito " )

      console.log(this.pedidoSeleccionado)
    //  this.pedidoSeleccionado['status'] = "Aceptado"
      console.log(`Pedido ${pedidoId} ha sido aceptado.`);
    } catch (error) {
      console.error('Error al aceptar el pedido:', error);
    }
  }
async presentTiempoEntregaAlert(pedidoId: string, uid:string, nameRest: string, idBs: string, array:any) {
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
          if (selectedValue === 'default') {
            console.log('🟢 Se mantuvo el tiempo actual.');
            this.aceptarPedido(pedidoId, uid, nameRest, idBs, array , 0);
            return;
          }
          this.aceptarPedido(pedidoId, uid, nameRest, idBs, array, Number(selectedValue));
          console.log('⏱️ Nuevo tiempo seleccionado:', selectedValue);
        }
      }
    ]
  });

  await alert.present();
}
 enCaminoPedidoReczon(data:any, comentario:any) {
    // URL de tu función sendNotifPush (ajusta esta URL a tu proyecto)
    const url = 'https://us-central1-reczon-delivery.cloudfunctions.net/api/updateStatePedidoEnCamino';
    data.comentario = comentario
    data.repaUid = data.RepaUid
  
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

 cancelarPedidoReczon(data:any, comentario:any) {
    // URL de tu función sendNotifPush (ajusta esta URL a tu proyecto)
    const url = 'https://us-central1-reczon-delivery.cloudfunctions.net/api/updateStatePedidoCancel';
    const coordenadas = {
      repaUid: data.RepaUid,
      comentario: comentario,
      pedidoId: data.idn
    }
    data.comentario = comentario
    data.repaUid = data.RepaUid
  
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
  enviarPedido(data:any) {
    // URL de tu función sendNotifPush (ajusta esta URL a tu proyecto)
    const url = 'https://us-central1-reczon-delivery.cloudfunctions.net/api/rczped';
    data.coordenadas = {
      dir: data.nameRest,
      lat: data.latBs,
      lng: data.lngBs
    }
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

async agregarComentario(array: any) {
  const alert = await this.alertCtrl.create({
    header: 'Agregar comentario',
    inputs: [
      {
        name: 'comentario',
        type: 'text',
        placeholder: 'Escribe tu comentario',
      },
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
      },
      {
        text: 'Guardar',
        handler: async (data:any) => {
          const comentario = data.comentario?.trim();
          if (comentario) {
            const firestore = getFirestore();
            const pedidoRefAll = doc(firestore, `pedidos/all/today`, array.id);

            await updateDoc(pedidoRefAll, {
              comentario:comentario,
              commentedBy: this.userId,
            });

            // También puedes actualizar la variable local si es necesario
            array.comentario = comentario;
          }
        },
      },
    ],
  });

  await alert.present();
}
  async aceptarPedido(pedidoId: string, uid:string, nameRest: string, realRest: string, data:any, timeAccept:number = 0) {
    try {
      // Obtener la instancia de Firestore
      const firestore = getFirestore();
  
      // Referencia al documento del pedido que deseas actualizar
      const pedidoRef = doc(firestore, `pedidos/${realRest}/today`, pedidoId);
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
   
           acceptTime: fechaFormateada,
           acceptBy: this.userId,
         });
         await updateDoc(pedidoRef, {
           status: 'Aceptado',
           acceptTst: serverTimestamp,
   
           acceptTime: fechaFormateada,
           acceptBy: this.userId,
         });
          // Actualizar el campo "status" a "Aceptado"
          await updateDoc(pedidoRef2, {
           status: 'Aceptado',
           acceptTime: fechaFormateada,
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
           prepaTime: +timeAccept ,
           acceptBy:  this.userId,
         });
         }

     
 
      this.sendNotification(uid, "Aceptado", "Tu pedido ha sido aceptado por: " + nameRest  )
      this.enviarPedido(data)

      console.log(this.pedidoSeleccionado)
    //  this.pedidoSeleccionado['status'] = "Aceptado"
      console.log(`Pedido ${pedidoId} ha sido aceptado.`);
    } catch (error) {
      console.error('Error al aceptar el pedido:', error);
    }
  }
  async cancelarPedido(pedidoId: string, uid:string, nameRest: string, realRest: string, id:string, motivo:string, data:any) {
    try {
      // Obtener la instancia de Firestore
      const firestore = getFirestore();
  
      // Referencia al documento del pedido que deseas actualizar
      const pedidoRef = doc(firestore, `pedidos/${realRest}/today`, pedidoId);
      const pedidoRefAll = doc(firestore, `pedidos/all/today`, pedidoId);

      const pedidoRef2 = doc(firestore, `users/${uid}/pedidos`, pedidoId);
   
      this.sendNotification(uid, "Pedido Cancelado", "Tu pedido ha sido cancelado por: " + nameRest + ". Una enorme disculpa, Te esperamos de nuevo"  )
      const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp();

      await updateDoc(pedidoRefAll, {
        status: 'Cancelado',
        cancelTime: serverTimestamp,
        motivo:motivo,

        cancelBy: "Administrador:" + this.userId,
      });
      // Actualizar el campo "status" a "Aceptado"
      await updateDoc(pedidoRef, {
        status: 'Cancelado',
        motivo:motivo,

        cancelTime: serverTimestamp,
        cancelBy: "Administrador:" + this.userId,
      });
       // Actualizar el campo "status" a "Aceptado"
       await updateDoc(pedidoRef2, {
        status: 'Cancelado',
        cancelTime: serverTimestamp,
        motivo:motivo,
        cancelBy: "Administrador:" + this.userId,
      });

      this.cancelarPedidoReczon(data, motivo)
      if(id === undefined || id === null){

      }else{
        const repartidoresRefAll = doc(firestore, `repartidores/${id}`);
      
        // Actualiza el campo `active` a `false`
        await updateDoc(repartidoresRefAll, {
          active: true,
        });
      }
   
      console.log(`Pedido ${pedidoId} ha sido aceptado.`);
    } catch (error) {
      console.error('Error al aceptar el pedido:', error);
    }

  }
  userPhone:any
  ngOnInit() {
    this.intervalId = setInterval(() => {
      if (this.pedidosNuevoCount > 0) {
        this.reproducirSonidoNuevoPedido();
      }
    }, 6000);

    this.currentBusiness = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // El usuario está logueado
        console.log('Usuario logueado:', user);
        this.userId = user.uid
        this.getUserData()
       // this.getProjects()
  
      } else {
        // El usuario no está logueado
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
        this.loadrestaurante()

  });

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
        //this.sendTokenToAndroid(data.uid);
  
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
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      position:"middle",
      color:"dark",
      duration: 2000
    });
    toast.present();
  }





  copiarTexto(marca: any, index:number) {
    this.showToast("Copiado con exito")
    this.isHovered[index] = true;
    const lat = marca.latCliente; // Reemplaza con tu latitud
    const lng = marca.lngCliente; // Reemplaza con tu longitud
    
    const googleMapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
    const total = this.getFormattedPrice(+marca.total);
    const total2 = this.getFormattedPrice(+marca.total - 10);
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
      Total gastos de envio: ${+envio + +marca.tfll}
      Total a cobrar cliente: ${+this.totalCobrarCliente + +marca.tfll - 10}
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
 async abrirOpcionesPedido(pedido: any, index: number) {

  const alert = await this.alertCtrl.create({
    header: 'Acciones del pedido',
    mode: 'ios',
    buttons: [
      {
        text: 'Copiar',
        handler: () => {
          this.copiarTexto(pedido, index);
        }
      },
      {
        text: 'Cancelar pedido',
        role: 'destructive',
        handler: () => {
          this.mostrarAlertaCancelacion(
            pedido.id,
            pedido.uid,
            pedido.nameRest,
            pedido.idBs,
            pedido.idrepa,
            pedido
          );
        }
      },
      {
        text: 'Finalizar',
        handler: () => {
          this.finalizarPedido(
            pedido.id,
            pedido.uid,
            pedido.nameRest,
            pedido.idBs,
            pedido.idrepa
          );
        }
      },
      {
        text: 'Cerrar',
        role: 'cancel'
      }
    ]
  });

  await alert.present();
}

  getFormattedPrice(price: number): string {
    return price.toFixed(2);
  }

  sendNotificationCall(uid:string, title:string, body:string){
    // URL de tu función sendNotifPush
  const url = 'https://us-central1-soyjuan-mx.cloudfunctions.net/api/sendNotifPushCall';
  
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
  sendNotification(uid:string, title:string, body:string){
    console.log(uid)
    console.log(title)
    console.log(body)
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

  cuadra(marca: Marca) {
    console.log('Cuadra:', marca);
    // Lógica para la acción 'Cuadra'
  }

  borrar(marca: Marca) {
    console.log('Borrar:', marca);
    // Lógica para la acción 'Borrar'
  }

  editar(marca: Marca) {
    console.log('Editar:', marca);
    // Lógica para la acción 'Editar'
  }

  asignar(marca: Marca) {
    console.log('Asignar:', marca);
    // Lógica para la acción 'Asignar'
  }

  agregarMarca() {
    console.log('Agregar nueva marca');
    // Lógica para agregar una nueva marca
  }
  accion(marca: Marca) {
    // Lógica para realizar una acción con la marca seleccionada
  }
  getStatusColor(status: string): string {
    switch (status) {
      case 'Pendiente':
        return '#d9d9d9';
      case 'Nuevo':
        return '#d9d9d9';
      case 'Aceptado':
        return '#b1a1ed';
      case 'En preparacion':
        return '#ffeb5b';
      case 'Recoger en tienda':
        return 'rgb(255 134 194)';
      case 'Listo para recoger':
        return '#f4a64e';
      case 'En camino':
        return '#38B6FF';
      case 'Entregado':
        return '#9DCD5A';
      case 'Cancelado':
        return '#FC6467';
      default:
        return '#000000'; // Color por defecto
    }
  }


  getUserData() {
    this.firestore.collection('users').doc(this.userId).valueChanges().subscribe(userData => {
      const data = userData as UserData; // Casting el tipo a UserData
      if (data) {
        // Asignar los valores de forma segura, con valores por defecto si no existen
        const phone = data.phone ?? null;
        const uid = data.uid ?? null;
        const cred = data.cred ?? null;
        this.rol  = data.rol ?? null;
        const nombre = data.nombre ?? 'No Name';
  if(this.rol === 'rest-admin' || this.rol === 'admin-restaurant'){
    if(this.currentBusiness === 'all'){
      this.showToast('No tienes credenciales')

    }else{
      this.obtenerPedidosDelDia()
      this.loadrestaurante()
    }
  
  }
  else if (this.rol === 'admin'){
    this.obtenerPedidosDelDia()
      this.loadrestaurante()


  }else{
    this.showToast('No tienes credenciales')
  }
        // Asignar los valores que existen a las variables del componente
  
  
        console.log('Name:', nombre);
      } else {
        console.warn('No se pudieron obtener datos del usuario:', userData);
      }
    });
  }
  segmentChangedAppPartner(event: any) {
    this.selectedStatus = event.detail.value;
    if (this.selectedStatus === 'todos' || this.selectedStatus === 'TODOS') {
      this.pedidosFiltrados = this.pedidosDelDia;
    } else {
      this.pedidosFiltrados = this.pedidosDelDia.filter(pedido => pedido.status === this.selectedStatus);
      console.log(this.pedidosFiltrados)
      
    }
  }
  segmentChanged(event: any) {
    this.selectedStatus = event.detail.value;
    console.log(this.pedidosDelDia)
  
    if (this.selectedStatus === 'todos') {
      this.pedidosFiltrados = this.pedidosDelDia.filter(pedido => pedido.status !== "smck");
    } else {
      this.pedidosFiltrados = this.pedidosDelDia.filter(pedido => pedido.status === this.selectedStatus);
      
    }

    console.log(this.pedidosFiltrados)
  }
  applyFilter(event: string) {
    this.selectedStatus = event;
  
   
      this.pedidosFiltrados = this.pedidosDelDia.filter(pedido => pedido.status === this.selectedStatus);
      
    
  }
  filterPedidos() {
    if (this.selectedSegment === 'todos') {
      this.pedidosDelDia = this.pedidosDelDia;
    } else {
      this.pedidosDelDia = this.pedidosDelDia.filter(pedido => pedido.status === this.selectedSegment);
    }
  }
}


