import { Component, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonContent, LoadingController, ModalController, NavParams, ToastController } from '@ionic/angular';
import { getFirestore,doc, updateDoc, arrayUnion,arrayRemove,collection,setDoc, addDoc ,getDocs,onSnapshot, Unsubscribe, deleteDoc, Timestamp, getDoc } from 'firebase/firestore';
import { get } from 'scriptjs';
import { ModalConfirmOrderComponent } from 'src/app/modals/modal-confirm-order/modal-confirm-order.component';
import { ModalTextComponent } from 'src/app/modals/modal-text/modal-text.component';
import { ModalmapComponent } from 'src/app/modals/modalmap/modalmap.component';
import { environment } from 'src/environments/environment.prod';
import { Location } from '@angular/common';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { ModalBuyComponent } from 'src/app/modals/modal-buy/modal-buy.component';
import { GetInfoComponent } from 'src/app/modals/get-info/get-info.component';
import { ModalDireccionesComponent } from 'src/app/modals/modal-direcciones/modal-direcciones.component';
import { ModalimgComponent } from 'src/app/modals/modalimg/modalimg.component';

declare var google: any;
interface Marca {
    id?: string;
    nombre?: string;
    direccion?: string;
    telefono?: string;
    costoEnvio?: any;
    currentLat?: number; // Hacerlo opcional
    currentLng?: number; // Hacerlo opcional
    correo?: string;
    distance?: number;
    clasificacion?: string;
    servicio?: string;
    estado?: string;
    distancia?: string;
    email?: string;
    
    key?: string;
    activo?: boolean;
    deliveryCost?: string;
    deliveryTime?: string;
    image?: string;
    banner?: string;
  }
  
interface Restaurant2 {
    id?: string;
    currentLat?: number | undefined;
    currentLng?: number | undefined;
    distance?: number; // Campo opcional para la distancia
    costoEnvio?: any; // Campo opcional para la distancia
    
  }
export interface Restaurant {
    id?: string; // Opcional para el ID
    nombre: string;
    direccion: string;
    prepaTime: number;
    subsidio: number;
    tarifa:string;
    direccionBs: string;
    banner:string;
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
  export interface UserData {
    id?: string; // Opcional para el ID
    nombre: string;
    direccion: string;
    autoaceptartype: string;
    autoaceptar: boolean;
    gen: string;
    fnac:string;
    phone: string;
    lat:string;
    currentLat:number;
    currentLng:number;
    logo:string;
    lng:string;
    // Agrega otros campos según sea necesario
  }
@Component({
  selector: 'app-modal-create-order',
  templateUrl: './modal-create-order.component.html',
  styleUrls: ['./modal-create-order.component.scss'],
})
export class ModalCreateOrderComponent  implements OnInit {
  itemCount : Number = 0
    rangoRestaurante : number | undefined = 0
    @ViewChild('content', { static: false }) content!: IonContent;
    productosTotales = 0
    comisionRestaurante = 0
    logoUrl : any = ""
    showAlertx = true
    prepaTime = 0
    nombreDireccion = ""
    firstTimeName = false
    referenciaDireccion = ""
    genero = ""
    tfll = 0
  typePay : string = "Efectivo"
  tk = environment.tkBsChat;
  restaurantes: Marca[] = [
  
    // Agrega más marcas según sea necesario
  ];
  private storage = getStorage(initializeApp(environment.firebaseConfig));
      restaurant:string = ""
    userId: string = 'uidUser'; 
    private unsubscribeFromCart: Unsubscribe | null = null;
  repartidores = [
    { nombre: 'Juan Pérez', estado: 'En camino', lat: 22.2426, lng: -97.8695 }, // Ejemplo: Plaza de Armas
];
logoFile: File | null = null;
bannerFile: File | null = null;
nombreRestaurant : string = ""
logo : string = ""
banner : string = ""
status2 : string = ""
emailClient = ""
direccionBs : string= ""
booleanModal = false
autorizeMaps = false
birthday = ""
idnUser = 0
firstTimePhone = false
autoaceptar = false
autoaceptartype = ""
protectDouble = false
exists : any
entrega = {
  direccion: 'Avenida De prueba 123, Mexico',
  telefono: '+52 833 450 2378',
  instrucciones: 'Dejar en la puerta',
  tiempoEspera: '15-30 minutos',
  cupon: 'No aplicado',
  typePay: "Efectivo"
};
mapsKey = environment.mapsKey
tkMichelotes = environment.tokenMichelotes
costoEnvio = 0
distancia : number | undefined = 0
phoneRest = ""
requiredWidth = 0
typeHouse = ""
descuentoNew = 0
requiredHeight = 0
printID = ""
logoBs = ""
notaPedido = ""
logoPreview: string | null = null; // Para la vista previa del logo
bannerPreview: string | null = null; // Para la vista previa del banner
uidBs = ""
precioTotal: number = 0;  // Initialize with 0
currentLatUser : number | undefined = 0;
currentLngUser : number | undefined = 0;
currentLatBs: number | undefined;
currentLngBs : number | undefined = 0;
cartItems = [
    { 
      name: 'Taco de Carne Asada', 
      size: 'Grande', 
      flavor: 'Picante',
      category: "",
      price: 5.99, 
      image: 'assets/taco.png', 
      quantity: 1 ,
      tptxt:""
    },

  ];
productos = [
  {
    nombre: 'Pizza Margarita',
    descripcion: 'Pizza con salsa de tomate y queso mozzarella.',
    precio: 8.00,
    imagen: 'https://via.placeholder.com/50'
  },
  {
    nombre: 'Ensalada César',
    descripcion: 'Ensalada con lechuga, pollo y aderezo César.',
    precio: 5.00,
    imagen: 'https://via.placeholder.com/50'
  },
  {
    nombre: 'Refresco',
    descripcion: 'Refresco de cola de 500ml.',
    precio: 1.50,
    imagen: 'https://via.placeholder.com/50'
  }
];
platformConfig: any = {};  // Puede ser un objeto vacío inicialmente

restaurante ="Nombre del restaurante"
nameClient =""
phoneUser =""
direccion = ""
subtotal = 12.00;
restaurantdetails: Restaurant | null | undefined = null;
latRest: Number = 0
lngRest : Number = 0
devMode=""
tarifaServicio = 1.20;
tkToyama = environment.tokenToyama
precioFinal : number = 0
private activatedRoute = inject(ActivatedRoute);

  constructor(private navParams: NavParams, private location: Location,private router: Router,private ngZone: NgZone,
    private toastCtrl: ToastController,private alertCtrl: AlertController,  private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,private route: Router,private afAuth: AngularFireAuth, private firestore: AngularFirestore) { 

  
    }
    async showToast(message: string) {
 
      const toast = await this.toastCtrl.create({
        message,
        position:"middle",
        color:"primary",
        duration: 3000
      });
      toast.present();
    }
    onTypePayChange(selectedValue: string) {
      console.log('Método de pago seleccionado :', selectedValue);
      if(selectedValue === 'Efectivo'){

      }
      if(selectedValue === 'Transferencia'){
        this.descuentoNew = this.precioTotal;
      }else{
        this.descuentoNew = this.precioTotal;
     
      }
      this.getTotal()
      // Puedes realizar otras acciones basadas en el valor seleccionado
      setTimeout(() => {
      this.scrollToBottom()
        
      }, 1000);
    }
    async loadConfig() {
      const configDoc = this.firestore.collection('config').doc('platformConfig');
      configDoc.valueChanges().subscribe((config: any) => {
        if (config) {
          // Si el objeto config existe, lo asignamos directamente
          this.platformConfig = config;
          if(this.platformConfig.tarifalluvia === true){
            this.tfll = this.platformConfig.costoCondicionesClimaticas

          }
          console.log(this.platformConfig)
     
        }
      });
    }
phoneNumber :any
session :any

  closeModal(){
    this.modalCtrl.dismiss()
  }
  
ngOnInit() {

     this.restaurant = this.navParams.get('neg')
    this.devMode =  this.navParams.get('devMode')
    this.phoneNumber =  this.navParams.get('phone')
    this.numberBusiness =  this.navParams.get('admin')
    this.typePay =  this.navParams.get('metodoPago')
    if(this.typePay.includes("Pago")){
      this.typePay = "Efectivo"
    }
    this.costoEnvio =  +this.navParams.get('costoEnvio')
    this.loadrestaurante()
   
         this.loadUserData()
        this.loadLocation()
          this.getCartItemsAndCountCache();
     this.loadrestauranteCache()

 

  this.loadConfig();

}

  copiarTexto(text: string) {
    this.showToast("Copiado con exito")

  
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          console.log('Texto copiado al portapapeles');
        })
        .catch(err => {
          console.error('Error al copiar el texto: ', err);
        });
    } else {
      // Alternativa: Usar un textarea temporal
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      console.log('Texto copiado usando método alternativo');
    }
  }
  loadMap() {
    // Estilos para el mapa en escala de grises
    const mapStyle = [
        {
            "elementType": "geometry",
            "stylers": [{ "color": "#f5f5f5" }]
        },
        {
            "elementType": "labels.icon",
            "stylers": [{ "visibility": "off" }]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#616161" }]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [{ "color": "#f5f5f5" }]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#bdbdbd" }]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{ "color": "#eeeeee" }]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#757575" }]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [{ "color": "#e5e5e5" }]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#9e9e9e" }]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [{ "color": "#ffffff" }]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#757575" }]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [{ "color": "#dadada" }]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#616161" }]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#9e9e9e" }]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [{ "color": "#e5e5e5" }]
        },
        {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [{ "color": "#eeeeee" }]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{ "color": "#c9c9c9" }]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#9e9e9e" }]
        }
    ];

    // Inicialización del mapa con el estilo gris y sin controles
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: { lat: this.currentLatUser, lng: this.currentLngUser }, // Plaza de Armas, coordenadas
        styles: mapStyle,
        disableDefaultUI: true,  // Deshabilitar controles
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
    });

    // Marcador en la ubicación especificada
    const marker = new google.maps.Marker({
        position: { lat: this.currentLatUser, lng: this.currentLngUser },
        map: map,
        title: 'Juan Pérez',
        icon: {
            url: 'https://cdn.icon-icons.com/icons2/907/PNG/512/map-marker_icon-icons.com_70445.png', // Ruta a tu imagen de moto
            scaledSize: new google.maps.Size(30, 30) // Tamaño del icono
        }
    });
}
getTotal() {
  var descuentoNew = 0;
  var tfs = 0
  if (this.typePay === 'Transferencia') {
    // Lógica adicional para 'Efectivo' si es necesario
  tfs = this.precioTotal * 0.05; // 5% de this.precioTotal

  } else {
    // Lógica adicional para otros tipos de pago
  }

  const costoEnvio = this.costoEnvio ?? 0;  // Usa 0 si costoEnvio es undefined

  return this.precioTotal + costoEnvio + this.tfll;
}
  subsidio = 0
  async loadrestauranteCache() {
    console.log(this.restaurant);
    
    this.autorizeMaps = false
  
  // Obtiene el documento del restaurante
  this.firestore.doc<Restaurant>(`restaurantes/${this.restaurant}`)
    .valueChanges({ idField: 'id' })
    .subscribe(data => {
      if (data) {
       // console.log('Restaurant data:', data);
        this.restaurantdetails = data; // Asigna los datos si existen
        this.nombreRestaurant = data.nombre
        this.prepaTime = 0;

        this.comisionRestaurante = +data.tarifa || 0
        this.printID = data.idprint || 'unknowkn'
           this.subsidio = data.subsidio || 0;
        this.direccionBs = data.direccion
        this.uidBs = data.uid
        this.rangoRestaurante = data.rango
        if(this.rangoRestaurante! <= 15){
          this.autorizeMaps = true
        }
      
        this.restaurant = data.key
        this.banner = data.banner
        this.logo = data.logo
        //this.latRest = data.currentLat
        //this.lngRest = data.currentLng
        get(`https://maps.googleapis.com/maps/api/js?key=`+ this.mapsKey+`&libraries=places`, () => {
          setTimeout(async () => {
            // Verificar duplicados antes de agregar restaurante
        const exists = this.restaurantes.some(
          (restaurant) => restaurant.nombre === this.nombreRestaurant
        );
        if (!exists) {
          this.restaurantes.push({
            nombre: this.nombreRestaurant,
            currentLat: this.currentLatBs ?? 0,
            currentLng: this.currentLngBs ?? 0,
          });
        }

        // Calcular distancias

        console.log(this.autorizeMaps)
        console.log(this.restaurantes)
        try {
          if(this.autorizeMaps === true){
         
          const restaurantsWithDistances = await this.calcularDistancias(
            this.currentLatUser,
            this.currentLngUser,
            this.restaurantes
          );

          // Actualizar restaurantes
          this.restaurantes = restaurantsWithDistances;

          // Buscar restaurante
          const restaurantEncontrado = this.restaurantes.find(
            (restaurant) => restaurant.nombre === this.nombreRestaurant
          );

          if (restaurantEncontrado) {
            this.distancia = restaurantEncontrado.distance;
           // this.costoEnvio = restaurantEncontrado.costoEnvio;
            //console.log('Costo de envío actualizado:', this.costoEnvio);
            console.log('Distancia de envío actualizado:', this.distancia);
          } else {
            console.log('No se encontró un restaurante con ese nombre.');
          }
        }else {
          this.presentLocationAlert()
        }


        } catch (distError) {
          console.error('Error al calcular distancias:', distError);
          alert("Error al calcular la distancia")
          location.reload()
        }
          }, 500);
          //      get(`https://maps.googleapis.com/maps/api/js?key=AIzaSyClzbvzJI0_4Q_1z5Pr0PCI9IdmYuwpMmo&libraries=places`, () => {
                });

      } else {
        console.warn('No restaurant found with the given ID.');
        this.restaurantdetails = null; // Maneja el caso como desees
      }
    });
  }
  
async loadrestaurante() {
    console.log(this.restaurant);
    
    this.autorizeMaps = false
  
  // Obtiene el documento del restaurante
  this.firestore.doc<Restaurant>(`restaurantes/${this.restaurant}`)
    .valueChanges({ idField: 'id' })
    .subscribe(data => {
      if (data) {
       // console.log('Restaurant data:', data);
        this.restaurantdetails = data; // Asigna los datos si existen
        this.nombreRestaurant = data.nombre
        this.prepaTime = 0;

        this.comisionRestaurante = +data.tarifa || 0
        this.printID = data.idprint || 'unknowkn'
        this.direccionBs = data.direccion
        this.uidBs = data.uid
        this.rangoRestaurante = data.rango
        if(this.rangoRestaurante! <= 15){
          this.autorizeMaps = true
        }
      
        this.restaurant = data.key
        this.banner = data.banner
        this.logo = data.logo
        //this.latRest = data.currentLat
        //this.lngRest = data.currentLng
        get(`https://maps.googleapis.com/maps/api/js?key=`+ this.mapsKey+`&libraries=places`, () => {
          setTimeout(async () => {
            await this.getUserData();

          }, 1000);
          //      get(`https://maps.googleapis.com/maps/api/js?key=AIzaSyClzbvzJI0_4Q_1z5Pr0PCI9IdmYuwpMmo&libraries=places`, () => {
                });

      } else {
        console.warn('No restaurant found with the given ID.');
        this.restaurantdetails = null; // Maneja el caso como desees
      }
    });
  }
  async loadUserData() {
    //console.log(this.restaurant);
  // Obtiene el documento del restaurante
  this.firestore.doc<UserData>(`restaurantes/${this.restaurant}`)
    .valueChanges({ idField: 'id' })
    .subscribe(data => {
      if (data) {
        //console.log('Restaurant data:', data);
        this.nombreRestaurant = data.nombre
        this.logoBs = data.logo
        this.phoneRest = data.phone || ""
        this.direccionBs = data.direccion
        this.autoaceptar = data.autoaceptar || false
        this.autoaceptartype = data.autoaceptartype || ''
    
   
        this.currentLatBs = data.currentLat
        this.currentLngBs = data.currentLng


      } else {
        console.warn('No restaurant found with the given ID.');
        this.restaurantdetails = null; // Maneja el caso como desees
      }
    });
  }
  // Función para formatear la fecha
  formatDate(date: Date) {
    const day = date.getDate();
    const monthNames = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    
    // Obtener horas y minutos en formato 24 horas
    const hours = String(date.getHours()).padStart(2, '0'); 
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    // Formato final "15 septiembre 2024 17:45"
    return `${day} ${month} ${year} ${hours}:${minutes}`;
  }
  async confirmarOrden() {
    this.finalizarPedido()
    return
    var pedido = { 
        nombreRestaurante:this.nombreRestaurant,
        devMode: this.devMode,
        direccion: this.direccion,
        total: this.getTotal(),
        typePay: this.typePay,
        products: this.cartItems,
    }
    const modal = await this.modalCtrl.create({
      component: ModalConfirmOrderComponent,
      componentProps: {pedido: pedido }  // Pasamos los datos del pedido al modal
    });

    await modal.present();

    // Recibir los datos cuando el modal se cierra
    const { data } = await modal.onWillDismiss();
    if (data.confirmed) {
      console.log('Orden confirmada:', data.pedido);
      this.finalizarPedido()
    } else {
      console.log('Orden cancelada');
    }
  }
  clickInputFile(){
    document.getElementById("inputFile")?.click()
  }
  async finalizarPedido() {
    this.protectDouble = true;
    
  

    if(this.precioTotal < 20){
      this.protectDouble = false
      this.showToast("La compra minima es de 20")
            return
          }else{
      
          }
if(this.typePay=== 'Efectivo'){
  if(this.precioTotal > 1500){
         this.protectDouble = false
    this.showToast("El monto de compra maxima en efectivo es de $1500.00 MXN, superando ese monto debes elegir otro metodo de pago.")

                return
              }else{
          
              }
}
     

    if(this.nameClient === "" || this.nameClient === 'Usuario sin nombre'){
      this.protectDouble = false

      this.showAlert('nombre', "")
      return
    }else{

    }
    if(this.costoEnvio === 0){
      this.protectDouble = false
      this.showToast("Debes ingresar una ubicacion valida")
      this.showGetLocation()
            return
          }else{
      
          }
          if(this.phoneUser === "" || this.phoneUser === undefined || this.phoneUser === null){
            this.showToast("Debes ingresar tu numero de celular para continuar")
            this.protectDouble = false
            this.showAlert('phone', this.phoneUser)
                  return
                }else{
            
                }
    try {
      this.presentLoading()
      // Obtener la instancia de Firestore
      const firestore = getFirestore();
      // Referencias a las colecciones donde se guardarán los pedidos
      const userOrderRef = collection(firestore, `users/${this.userId}/pedidos`);
      const pedidosRef = collection(firestore, `/pedidos/all/today`);
      const impresionesRef = collection(firestore, `/impresiones/${this.printID}/pedidos`);
      const clientesRef = collection(firestore, `/clientes/${this.restaurant}/today`);
      const restaurantOrderRef = collection(firestore, `pedidos/${this.restaurant}/today`);
  // Llamada al método para obtener los dos códigos
      const pedidoId = await this.generateUniqueId('restaurantes');
        
      console.log(pedidoId)
      const [code1, code2] = this.generateTwoCodes();
      // Datos del pedido que se van a enviar

      if(this.typePay ==="Efectivo" ){
        if(this.autoaceptar === true){
          this.status2 = this.autoaceptartype
        }else{
          this.status2 = "Nuevo"
          this.autoaceptartype = ""

        }

      }else if(this.typePay ==="Transferencia" ){
        this.status2 = "Pendiente"
        if(this.autoaceptar === true){
          
        }else{
          this.autoaceptartype = ""
        }
  
        this.logoUrl = this.logoFile ? await this.uploadImage(this.logoFile, 'logo') : null;

      }
      if(this.uidBs === null || this.uidBs === undefined){
        this.uidBs = "No token"
      }
      if(localStorage.getItem('Nota'+ this.nombreRestaurant) === null || localStorage.getItem('Nota'+ this.nombreRestaurant) === undefined){
        this.notaPedido= ""
      }else{
        this.notaPedido = localStorage.getItem('Nota'+ this.nombreRestaurant) || ""

      }
      localStorage.setItem('Nota'+this.nombreRestaurant,"")
      this.pedidoIdn = pedidoId
      const pedidoData = {
        codeTienda: code1,
        codeCliente: code2,
        items: this.cartItems, // Los productos en el carrito
        total: this.precioTotal, // Precio total del carrito
        fecha: this.formatDate(new Date()), // Fecha con formato personalizado
        latCliente: this.currentLatUser,
        lngCliente: this.currentLngUser,
        cliente: this.nameClient,
        devMode: this.devMode,
        imgTrans: this.logoUrl,
        comision:this.comisionRestaurante,
        direccion: this.direccion,
        direccionBs: this.direccionBs,
        prepaTime: 0,
        tst: Timestamp.now(),
        idn:pedidoId,  
        uidBs:this.uidBs,
        autoacctype: this.autoaceptartype,
        uid:this.userId,
        envio:this.costoEnvio+ 10,
        phone: this.phoneUser,
        notaPedido: this.notaPedido,
        refSt:this.referenciaDireccion,
        typeHouse:this.typeHouse,
        nameDir:this.referenciaDireccion,
        km:this.distancia,
        logoBs: this.logoBs,
        nameRest: this.nombreRestaurant,
        latBs: this.currentLatBs,
        idBs: this.restaurant,
        lngBs: this.currentLngBs,
        idprint: this.printID,
       // gen: this.genero,
        birthday:this.birthday,
        channel: "BUSINESS CHAT",
        tfll: this.tfll,
        typePay: this.typePay,
        tfs: this.typePay === 'Efectivo' ? 0 : (this.precioTotal ? this.precioTotal * 0.05 : 0).toFixed(2),
        status: this.status2, // Estado del pedido
      };
      console.log(pedidoData)
      // Agregar el pedido a la referencia del usuario y obtener el ID generado
      const userOrderDocRef = await addDoc(userOrderRef, pedidoData);
      const userOrderId = userOrderDocRef.id; // Aquí obtienes el ID generado

      const pedidoDataUser = {
        idn: this.idnUser,
        nombre:this.nameClient,
        phone:this.phoneUser,
        uid:this.userId,
        email:this.emailClient || ""
      }
      console.log(pedidoDataUser)

      // Crear el documento en la referencia del restaurante usando el mismo ID
      if(this.typePay === 'Transferencia'){
  var dataClient5 = {
        Text: "¡Hola! un cliente acaba de realizar una transferencia con total de : $" + this.precioTotal.toString() + ", revisa la transferencia en tu app del banco.",
        Pay:"Efectivo",
        Ph: "5218334285513",
        Tk:this.tk,
        Phone:"5218338446568",
        PhBs: "217475241449410",
      }

            var dataClient5 = {
        Text: "¡Hola! un cliente acaba de realizar una transferencia con total de : $" + this.precioTotal.toString() + ", revisa la transferencia en tu app del banco.",
        Pay:"Efectivo",
        Ph: "5218334285513",
        Tk:this.tk,
        Phone:"5218333000460",
        PhBs: "217475241449410",
      }


      this.sendMsgWhatsapp(dataClient5)

      }else{

        const impresionesOrderDocRef = doc(impresionesRef, userOrderId);
        await setDoc(impresionesOrderDocRef, { ...pedidoData });
      }



      const clientOrderDocRef = doc(clientesRef, this.userId);
      await setDoc(clientOrderDocRef, { ...pedidoDataUser, uid: this.userId });

      const restaurantOrderDocRef = doc(restaurantOrderRef, userOrderId);
      await setDoc(restaurantOrderDocRef, { ...pedidoData, id: userOrderId });
      
      const restaurantOrderDocRef2 = doc(pedidosRef, userOrderId);
      await setDoc(restaurantOrderDocRef2, { ...pedidoData, id: userOrderId });
      console.log('Pedido finalizado y guardado en ambas referencias.');
      this.deleteCartItems(this.userId,this.restaurant)
      // Redirigir a la página de información del pedido con el ID generado
      //this.showModalAnimation()
      this.modalCtrl.dismiss()
      this.router.navigateByUrl(`/pedido-info/${userOrderId}`, { replaceUrl: true });

      // this.router.navigate([`/pedido-info/${userOrderId}`], { replaceUrl: true }).then(() => {
      //   // Clear all previous history entries after navigation
      //   this.location.replaceState(`/pedido-info/${userOrderId}`);
      // });
      this.sendNotification(this.userId,"Tu pedido se envió ala tienda.", "Gracias por tu compra. " + this.nameClient  )
      if(this.uidBs === "No token"){

      }else{
        if(this.status2 === 'Pendiente'){
          this.sendNotification(this.userId,"Validando transferencia.", "Tu transferencia está en validación por Soy Juan" + this.nameClient  )

        }else{
        this.sendNotificationCall(this.uidBs," Tienes un nuevo pedido", "Pedido de " + this.nameClient  )

        }
   

      }

       const orderMessage = this.generateOrderMessage();
    console.log(this.phoneRest);
    console.log(orderMessage);
    console.log(this.tkMichelotes);
    console.log(this.phoneUser);
      var dataClient6 = {}
      if(this.numberBusiness === '5218333861194'){
        dataClient6 = {
        Text: orderMessage,
        Pay:"Efectivo",
        Ph: "5218333861194",
        Tk:this.tkMichelotes,
        Phone:this.phoneUser,
        PhBs: "331199676738389",
      }
      } 
      if(this.numberBusiness === '5218334460818'){
         dataClient6 = {
        Text: orderMessage,
        Pay:"Efectivo",
        Ph: "5218334460818",
        Tk:this.tk,
        Phone:this.phoneUser,
        PhBs: "861393147061358",
      }
      
      }
        if(this.numberBusiness === '5218332367397'){
         dataClient6 = {
        Text: orderMessage,
        Pay:"Efectivo",
        Ph: "5218332367397",
        Tk:this.tk,
        Phone:this.phoneUser,
        PhBs: "969119026283394",
      }
      }
      //this.enviarPedido(code1, code2, userOrderId)
      this.sendMsgWhatsapp(dataClient6)


      // var dataClient = {
      //   Text: "¡Hola! El cliente: "+ this.nameClient +" ha realizado un pedido con ID:"+ pedidoId + " al comercio: " + this.nombreRestaurant + ", revisa su seguimiento.",

      //   Pay:this.typePay,
      //   Ph: "5218334285513",
      //   Tk:"EAAMZB5AaN4h0BOzs4PcMw8gqzSGeZAOD83ZBgBtiQP84zIUCqlKQXHT0iuOHsTSjv9JBZBgITb81ZCUPuzcDC1An5PMJeNCUopqZB0T8Go027EPOXhKb0Uqlslhhf7YWMsPXZBARb79rpbGlkSsHS2ezZAa2kiOS01stUnmut8jv32YZCLnVdCmKTFhiKrqmUECBt",
      //   Phone:"5218331202443",
      //   PhBs: "217475241449410",
      // }
      var dataClient2 = {
        Text: "¡Hola! El cliente: "+ this.nameClient +" ha realizado un pedido con ID:"+ pedidoId + " al comercio: " + this.nombreRestaurant + ", revisa su seguimiento.",

        Pay:"Efectivo",
        Ph: "5218334285513",
        Tk:this.tk,
        Phone:"5218334502378",
        PhBs: "217475241449410",
      }
   
   
      var dataClient5 = {
        Text: "¡Hola! un cliente acaba de realizar un pedido al comercio: " + this.nombreRestaurant + ", revisa su seguimiento.",
        Pay:"Efectivo",
        Ph: "5218334285513",
        Tk:this.tk,
        Phone:"5218338446568",
        PhBs: "217475241449410",
      }
   
  const textoPedido = this.armarTextoPedido(pedidoData);
        var dataClient555 = {
        Text: textoPedido,
        Pay:"Efectivo",
        Ph: "5218333861194",
        Tk:this.tkMichelotes,
        Phone:"5218331071714",
        PhBs: "331199676738389",
      }

      //this.enviarPedido(code1, code2, userOrderId)

      this.sendMsgWhatsapp(dataClient555)
      this.sendMsgWhatsapp(dataClient2)
     
      setTimeout(() => {
      this.sendMsgWhatsapp(dataClient5)
        
      }, 1000);
    } catch (error) {
      alert(error)
      console.error('Error al finalizar el pedido:', error);
    }
  }
  totalPagar = 0
totalCobrarCliente = 0
armarTextoPedido(marca: any): string {
  const lat = marca.latCliente;
  const lng = marca.lngCliente;
  
  const googleMapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
  const total = this.getFormattedPrice(+marca.total);
  const total2 = this.getFormattedPrice(+marca.total - +this.subsidio);
  const envio = this.getFormattedPrice(+marca.envio);
  const tfs = this.getFormattedPrice(+marca.tfs);
  const km = this.getFormattedPrice(+marca.km);

  this.totalCobrarCliente = parseFloat(envio) + parseFloat(total);

  if (marca.typePay === 'Transferencia') {
    this.totalCobrarCliente = 0;
    this.totalPagar = 0;
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

  return texto;
}
  requestPermisionCamera(){
  }
  pedidoIdn:any
generateOrderMessage() {
let message = `Tu pedido ya está en proceso.\nN° de rastreo #${this.pedidoIdn.toString().slice(-5)}\n\n`;

  console.log(this.cartItems)
  this.cartItems.forEach((item: any) => {
    message += `- ${item.quantity} x ${item.name} - $${(item.price * item.quantity).toFixed(2)}\n`;
  });

  message += `\nCosto de envío: $${this.costoEnvio}\n`;
  message += `Metodo de pago: ${this.typePay}\n`;
  message += `Total: $${this.getTotal().toFixed(2)}\n`;
  message += `Tu pedido llegará en un lapso de 35 a 60 minutos.`;
  message += `El repartidor te llamará o te mandará mensaje cuando esté por llegar a tu domicilio.`;

  return message;
}
 
  async showModalAnimation(){
    if(this.booleanModal === true){
      return
    }
    this.booleanModal = true
      const modal = await this.modalCtrl.create({
        component: ModalBuyComponent,
      });
  
      modal.onDidDismiss().then(async (result) => {
     
      });
      this.booleanModal = false
  
      await modal.present();

    
  }
  async showModalDirecciones() {
    if(this.booleanModal === true){
      return
    }
    this.booleanModal = true
    const modal = await this.modalCtrl.create({
      component: ModalDireccionesComponent,
      componentProps: { 
        Uid: this.userId,
        origin: "/terminar-pedido/"+ this.restaurant + "/" + this.devMode
      },
        breakpoints: [0, 1, 1],  // 🔹 Permite deslizar entre 0%, 80% y 100%
    initialBreakpoint: 1 
    });
  
    // Presentar el modal
    await modal.present();
  
    // Escuchar los datos devueltos por el modal
    const { data } = await modal.onDidDismiss();
    if (data && data.direccion && data.lat && data.lng && data.type) {
      console.log('Datos seleccionados desde el modal:', data);
      this.direccion = data.direccion;
      this.currentLatUser = data.lat;
      this.currentLngUser = data.lng;
      this.typeHouse = data.type;
      this.updateUserLocation();
    } else {
      console.log('El modal fue cerrado sin seleccionar datos.');
      // Opcional: puedes manejar la lógica cuando el modal se cierra sin datos aquí.
    }
    this.booleanModal = false

  }
  async generateUniqueId(collection: string): Promise<string> {
    let uniqueId: string;
    let exists: boolean;
    do {
      // Generar un timestamp en milisegundos
      const timestamp = Date.now().toString();
      // Generar un número aleatorio entre 0 y 999 (ajusta el rango según tus necesidades)
  // Cambia 1000 por 909 si deseas un rango específico
      const randomNumTimeout = Math.floor(Math.random() * 4000); // Cambia 1000 por 909 si deseas un rango específico
      // Crear el ID concatenando el timestamp y el número aleatorio
      uniqueId = `${timestamp}`;
      // Verificar si el ID ya existe en la colección
      await setTimeout(async () => {
      const doc = await this.firestore.collection(collection).doc(uniqueId).get().toPromise();
      this.exists = doc!.exists; // Verifica si el documento ya existe
      }, randomNumTimeout);
    } while (this.exists); // Repite si existe
  
    return uniqueId; // Devuelve el ID único
  }
  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...', // Puedes personalizar el mensaje
      duration: 3000,
            // Tiempo que estará visible en ms (opcional)
    });
    await loading.present();
  
    // Opcional: Manejar el cierre del loading
    const { role, data } = await loading.onDidDismiss();
    console.log('Loading cerrado');
  }

async presentMetodoPagoAlert() {
  const alert = await this.alertCtrl.create({
    header: 'Método de pago',
    message: '¿Cómo deseas pagar tu pedido?',
    buttons: [
      {
        text: 'Efectivo',
        handler: () => {
          console.log('Pago en efectivo');
          this.typePay = 'Efectivo'
          this.onTypePayChange('Efectivo')
          // Aquí ejecutas lógica si selecciona efectivo
        }
      },
      {
        text: 'Transferencia',
        handler: () => {
          console.log('Pago por transferencia');
          this.typePay = 'Transferencia'

          this.onTypePayChange('Transferencia')

          // Aquí ejecutas lógica si selecciona transferencia
        }
      }
    ],
    backdropDismiss: true,
    cssClass: 'custom-alert-pago'
  });

  await alert.present();
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



   async openModalImg(url:string){
    
        const modal = await this.modalCtrl.create({
          component: ModalimgComponent,
          cssClass: 'custom-modal',
          componentProps: {img:url}
        });
    
        modal.onDidDismiss().then(async (result) => {
     
        });
    
        await modal.present(); // Present the modal
      
    }
  // Método para enviar el pedido a Firebase Functions
enviarPedido(code1:any,code2:any,pedidoId:string) {
  // URL de tu función sendNotifPush (ajusta esta URL a tu proyecto)
  const url = 'https://us-central1-reczon-delivery.cloudfunctions.net/api/rczped';
  
  // Datos que se enviarán en la solicitud
  const pedidoData = {
    codeTienda: code1,
    codeCliente: code2,
    items: this.cartItems, // Los productos en el carrito
    total: this.precioTotal, // Precio total del carrito
    fecha: this.formatDate(new Date()), // Fecha con formato personalizado
    latCliente: this.currentLatUser,
    lngCliente: this.currentLngUser,
    cliente: this.nameClient,
    devMode: this.devMode,
    imgTrans: this.logoUrl,
    direccion: this.direccion,
    coordenadas: {
      dir: this.nombreRestaurant,
      lat: this.currentLatBs,
      lng: this.currentLngBs
    },
    repartidorAsignado:false,
    direccionBs: this.direccionBs,
    idn:pedidoId,  
    refSt:this.referenciaDireccion,
    typeHouse:this.typeHouse,
    nameDir:this.referenciaDireccion,
    tst: Timestamp.now(),
    uidBs:this.uidBs,
    uid:this.userId,
    prepaTime: 0,
    envio:this.costoEnvio + 10,
    comision:this.comisionRestaurante,
    phone: this.phoneUser,
    notaPedido: this.notaPedido,
    km:this.distancia,
    logoBs: this.logoBs,
    nameRest: this.nombreRestaurant,
    latBs: this.currentLatBs,
    idBs: this.restaurant,
    lngBs: this.currentLngBs,
   // gen: this.genero,
    birthday:this.birthday,
    autoacctype:this.autoaceptartype,
    channel: "BUSINESS CHAT",
    tfll: this.tfll,
    typePay: this.typePay,
    tfs: this.typePay === 'Efectivo' ? 0 : (this.precioTotal ? this.precioTotal * 0.05 : 0).toFixed(2),
    status: this.status2, // Estado del pedido
  };

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
  goFinish(){
    this.route.navigate(['/terminar-pedido'])
  }
  

    async deleteCartItems(userId: string, restaurant: string) {
      try {
        const cartRef = this.firestore.collection(`users/${this.phoneNumber}/cart/${restaurant}/items`);
  
        // Fetch all documents within the collection
        const querySnapshot = await cartRef.get().toPromise();
        
        // Loop through and delete each document
        const deletePromises = querySnapshot!.docs.map(doc => cartRef.doc(doc.id).delete());
        
        // Wait for all delete operations to complete
        await Promise.all(deletePromises);
  
        console.log('All items in the cart have been successfully deleted.');
      } catch (error) {
        console.error('Error deleting items from cart:', error);
      }
    }
  

async getCartItemsAndCount() {
  try {
    // Obtener la instancia de Firestore
    const firestore = getFirestore();

    // Referencia a la subcolección "items" dentro de "cart" del restaurante del usuario actual
    const cartRef = collection(firestore, `users/${this.userId}/cart/${this.restaurant}/items`);

    // Establecer un listener para obtener los documentos en tiempo real
    this.unsubscribeFromCart = onSnapshot(cartRef, (cartSnapshot) => {
      // Contar cuántos documentos hay en la subcolección
      const itemCount = cartSnapshot.size;
      setTimeout(() => {
      this.itemCount = itemCount;
        
      }, 1000);

      // Crear un array temporal para almacenar los productos del carrito
      const cartItems: any[] = [];
      let precioTotal = 0; // Inicializar la variable para el total del precio
      let productosTotales = 0; // Inicializar la variable para el total del precio

      // Recorrer los documentos de la subcolección y extraer la información del producto
      cartSnapshot.forEach(doc => {
        const productData = doc.data();
        const quantity = productData['cantidad'];
        const price = productData['precio'];
        const tptxt = productData['tptxt'];

        cartItems.push({
          id: doc.id,
          name: productData['nombre'],
          price: price,
          category:productData['category'],
          quantity: quantity,
          tptxt: tptxt,
        });

        // Sumar el precio total por la cantidad de cada producto
        precioTotal += price * quantity;
        productosTotales += quantity;
      });

      // Asignar los productos al array que usa *ngFor
      this.cartItems = cartItems;
      this.productosTotales = productosTotales
      // Asignar el total del precio
      this.precioTotal = precioTotal;

      // Log para depuración
      console.log('Número de elementos en el carrito:', itemCount);
      console.log('Total del precio del carrito:', precioTotal);
    }, (error) => {
      console.error('Error al escuchar cambios en el carrito:', error);
    });
  } catch (error) {
    console.error('Error al establecer el listener para el carrito:', error);
  }
}
address:any
from:any
lat:any
lng:any
updatedAt:any
name:any
numberBusiness:any
async loadLocation() {
  try {
        // Obtener la instancia de Firestore
    const firestore = getFirestore();

    const docRef = doc(firestore, "Locations", this.numberBusiness, this.phoneNumber, "0");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      // 👇 asignas cada campo a tu componente
      this.direccion = data['address'] || "";
      this.phoneUser = data['from'] || "";
      this.currentLatUser = +data['lat'] || 0;
      this.currentLngUser = +data['lng'] || 0;
      this.nameClient = data['name'] || "";
      this.updatedAt = data['updatedAt']?.toDate ? data['updatedAt'].toDate() : data['updatedAt'];

      console.log("Ubicación cargada:", data);
    } else {
      console.log("No existe el documento en Locations");
    }
  } catch (error) {
    console.error("Error al obtener la ubicación:", error);
  }
}
async getCartItemsAndCountCache() {
  try {
    // Obtener la instancia de Firestore
    const firestore = getFirestore();
 

    // Referencia a la subcolección "items" dentro de "cart" del restaurante del usuario actual
    const cartRef = collection(firestore, `users/${this.phoneNumber}/cart/${this.restaurant}/items`);

    // Establecer un listener para obtener los documentos en tiempo real
    this.unsubscribeFromCart = onSnapshot(cartRef, (cartSnapshot) => {
      // Contar cuántos documentos hay en la subcolección
      const itemCount = cartSnapshot.size;
      setTimeout(() => {
      this.itemCount = 1;
      }, 1000);

      // Crear un array temporal para almacenar los productos del carrito
      const cartItems: any[] = [];
      let precioTotal = 0; // Inicializar la variable para el total del precio
      let productosTotales = 0; // Inicializar la variable para el total del precio

      // Recorrer los documentos de la subcolección y extraer la información del producto
      cartSnapshot.forEach(doc => {
        const productData = doc.data();
        const quantity = productData['cantidad'];
        const price = productData['precio'];
        const tptxt = productData['tptxt'];

        cartItems.push({
          id: doc.id,
          name: productData['nombre'],
          price: price,
          category:productData['category'],
          quantity: quantity,
          tptxt: tptxt,
        });

        // Sumar el precio total por la cantidad de cada producto
        precioTotal += price * quantity;
        productosTotales += quantity;
      });

      // Asignar los productos al array que usa *ngFor
      this.cartItems = cartItems;
      this.productosTotales = productosTotales
      // Asignar el total del precio
      this.precioTotal = precioTotal;

      // Log para depuración
      console.log('Número de elementos en el carrito:', itemCount);
      console.log('Total del precio del carrito:', precioTotal);
    }, (error) => {
      console.error('Error al escuchar cambios en el carrito:', error);
    });
  } catch (error) {
    console.error('Error al establecer el listener para el carrito:', error);
  }
}

async getUserData() {
  try {
    const userRef = this.firestore.doc(`users/${this.userId}`);

    // Escuchar cambios en tiempo real
    userRef.valueChanges().subscribe(async (datax: any) => {
      if (datax) {
        if (datax['direccion'] === undefined) {
          return; // No calcular si falta dirección
        }
        this.phoneUser = datax['phone'] || "";

        if (datax['nombre'] === undefined) {
          this.showModaltext('Ingresa tu nombre');
          return;
        }
        console.log(this.phoneUser)

        // Actualizar variables del usuario
        this.direccion = datax['direccion'];
        this.nombreDireccion = datax['nameLocation'] || '';
        this.typeHouse = datax['type'] || '';
        this.referenciaDireccion = datax['ref'] || '';
        this.nameClient = datax['nombre'] || '';
        this.idnUser = datax['idn'] || '';
        this.genero = datax['gen'] || "";
        this.birthday = datax['fnac'] || "";
        this.currentLatUser = +datax['lat'];
        this.currentLngUser = +datax['lng'];

        // Verificar duplicados antes de agregar restaurante
        const exists = this.restaurantes.some(
          (restaurant) => restaurant.nombre === this.nombreRestaurant
        );
        if (!exists) {
          this.restaurantes.push({
            nombre: this.nombreRestaurant,
            currentLat: this.currentLatBs ?? 0,
            currentLng: this.currentLngBs ?? 0,
          });
        }

        // Calcular distancias
        console.log(this.autorizeMaps)
        try {
          if(this.autorizeMaps === true){
            console.log(this.currentLatUser);
            console.log(this.currentLngUser);
            console.log(this.restaurantes);
          const restaurantsWithDistances = await this.calcularDistancias(
            this.currentLatUser,
            this.currentLngUser,
            this.restaurantes
          );

          // Actualizar restaurantes
          this.restaurantes = restaurantsWithDistances;

          // Buscar restaurante
          const restaurantEncontrado = this.restaurantes.find(
            (restaurant) => restaurant.nombre === this.nombreRestaurant
          );

          if (restaurantEncontrado) {
            this.distancia = restaurantEncontrado.distance;
            this.costoEnvio = restaurantEncontrado.costoEnvio;
            console.log('Costo de envío actualizado:', this.costoEnvio);
            console.log('Distancia de envío actualizado:', this.distancia);
          } else {
            console.log('No se encontró un restaurante con ese nombre.');
          }
        }else {
          this.presentLocationAlert()
        }


        } catch (distError) {
          console.error('Error al calcular distancias:', distError);
          alert("Error al calcular la distancia")
          location.reload()
        }
      } else {
        console.log('No se encontraron datos.');
      }
    });
  } catch (error) {
    console.error('Error al obtener los datos:', error);
  }
}
goBack(){
  this.route.navigate([`/carrito/${this.restaurant}/${this.devMode}`])

}
async presentLocationAlert() {
    const alert = await this.alertCtrl.create({
      header: '¿Como deseas continuar?',
      message: 'Tu ubicación está fuera del rango de entrega.',
      buttons: [
        {
          text: 'Regresar',
          role: 'cancel',
          handler: () => {
            console.log('Usuario eligió regresar');
            this.goBack(); // Método para manejar la acción de regresar
          },
        },
        {
          text: 'Nueva ubicación',
          handler: () => {
            console.log('Usuario eligió nueva ubicación');
            this.showModalDirecciones(); // Método para manejar la acción de elegir nueva ubicación
          },
        },
      ],
    });

    await alert.present();
  }

  async showGetLocation() {
    if(this.booleanModal === true){
      return
    }
    this.booleanModal = true
    const modal = await this.modalCtrl.create({
      component: ModalmapComponent,
      componentProps : {title:"Agregar ubicación"}
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        console.log(result.data);
       
        this.currentLatUser = result.data.lat;
        this.currentLngUser = result.data.lng;
        this.direccion = result.data.direccion;
        await this.updateUserLocation();
      }
      else{
        

      //  await this.updateUserLocation();
      }
    });
    this.booleanModal = false

    await modal.present();

  }

  async showAlert(field: 'nombre' | 'phone', currentValue: string) {
    console.log(field);
    if(field === 'phone' && currentValue === '' || this.firstTimePhone === true){
      this.firstTimePhone = true
    }else if ( field === 'nombre' ){
 

    }else if(field === 'phone' && currentValue !== ''){
      this.firstTimePhone = false
  
    }
    if(field === 'nombre' && currentValue === ''){
      this.firstTimeName = true

    }else if( this.firstTimeName === true){

    }
 
    const alert = await this.alertCtrl.create({
      header: field === 'nombre' ? 'Editar Nombre' : 'Editar Teléfono',
      inputs: [
        {
          name: 'newValue',
          type: field === 'phone' ? 'tel' : 'text',
          value: currentValue,
          placeholder: field === 'nombre' ? 'Ingresa tu nombre' : 'Ingresa tu número a 10 digitos'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (data.newValue.trim() !== '' && this.userId) {
              // Guardar el dato en Firestore
              if (!this.userId) return;

              if (field === 'phone') {
                // Validar que el número tenga exactamente 10 dígitos numéricos
                if (!/^\d{10}$/.test(data.newValue.trim())) {
                  this.showToast('El número de teléfono debe tener exactamente 10 dígitos.');
                  return;
                }
              } else if (field === 'nombre') {
                // Validar que el nombre no supere los 80 caracteres
                if (data.newValue.trim().length > 80) {
                  this.showToast('El nombre no debe tener más de 80 caracteres.');
                  return;
                }
              }
              var value = ""
              if(field === 'nombre'){
                value = data.newValue

              }else{
                value = "+52" + data.newValue
              }
              await this.firestore.collection('users').doc(this.userId).update({
                [field]: value
              });

              // Actualizar la UI
              if (field === 'nombre') {
                this.nameClient = data.newValue;
              } else {
                this.phoneUser = data.newValue;
              }
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async openModal2() {
    if(this.booleanModal === true){
      return
    }
    this.booleanModal = true
    const modal = await this.modalCtrl.create({
      component: GetInfoComponent,
      cssClass : "custom-modal-min",
      breakpoints: [0, 1, 1],  // 🔹 Permite deslizar entre 0%, 80% y 100%
      initialBreakpoint: 1 ,
      backdropDismiss: false, // Para asegurar que el usuario interactúe con el modal
    });

    modal.onDidDismiss().then((result:any) => {
      if(result.data === undefined){
        this.genero = "Omitido"
        this.birthday = "Omitido"
        this.confirmarOrden()

      }else{
        console.log('Datos recopilados:', result);
       // this.genero = result.data.sexo
       this.birthday = result.data.fechaNacimiento
       this.emailClient = result.data.email
       
       // Aquí puedes manejar los datos del sexo y fecha de nacimiento
        this.updateUserGenero()

        this.finalizarPedido()


      }

      
    });
    this.booleanModal = false

    await modal.present();

  }
  async showModaltext(title:string) {
    if(this.booleanModal === true){
      return
    }
    this.booleanModal = true
    const modal = await this.modalCtrl.create({
      component: ModalTextComponent,
         breakpoints: [0, 1, 1],  // 🔹 Permite deslizar entre 0%, 80% y 100%
    initialBreakpoint: 1 ,
      componentProps : {title:title}
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        console.log(result.data);
        if (result.data.type === "Ingresa tu nombre" || result.data.type === "Ingresa tu nombre."){
            this.ngZone.run( ()=> {
                this.nameClient = result.data.text
                this.genero = result.data.sexo
                this.updateUserName(this.nameClient,result.data.sexo, result.data.fecha, result.data.email)
            })
           
        }
        if (result.data.type === "phone"){
            this.ngZone.run( ()=> {

            this.phoneUser = result.data.text
            this.updateUserPhone(this.phoneUser)
        })

        }
      }
      else{
        console.log("120")
        https://maps.googleapis.com/maps/api/js?key=`+ this.mapsKey+`&libraries=places`
        this.route.navigate([`/carrito/${this.restaurant}/${this.devMode}`])
        this.showToast("No pudiste completar los datos necesarios para finalizar el pedido.")
    
      }
    });
    this.booleanModal = false

    await modal.present();

  }
  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
  haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return parseFloat((R * c).toFixed(1)); // Devuelve la distancia en kilómetros con un decimal
  }
  isCalculating: boolean = false; // Class-level flag

  async calcularDistancias(
    currentLat: any,
    currentLng: any,
    restaurants: Restaurant2[]
  ): Promise<Restaurant2[]> {
    // Prevent multiple calculations
    if (this.isCalculating) {
      console.log('Distance calculation already in progress. Skipping.');
      return restaurants; // Return the current list without recalculating
    }
  
    this.isCalculating = true; // Set flag to true before starting
  
    const distanceMatrix = new google.maps.DistanceMatrixService();
    const destinations = restaurants.map(
      (restaurant) => new google.maps.LatLng(restaurant.currentLat, restaurant.currentLng)
    );
  
    return new Promise<Restaurant2[]>((resolve, reject) => {
      distanceMatrix.getDistanceMatrix(
        {
          origins: [new google.maps.LatLng(currentLat, currentLng)],
          destinations: destinations,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response: any, status: any) => {
          this.isCalculating = false; // Reset flag on completion
          if (status === google.maps.DistanceMatrixStatus.OK) {
            const updatedRestaurants = restaurants.map((restaurant, index) => {
              const distanceData = response.rows[0].elements[index];
              const distanceInKm = distanceData.distance.value / 1000;
  
              return {
                ...restaurant,
                distance: parseFloat(distanceInKm.toFixed(1)),
                costoEnvio: this.calcularCostoEnvio(distanceInKm),
              };
            });
  
            resolve(updatedRestaurants);
          } else {
            console.error('Error al calcular la distancia:', status);
            reject(status);
          }
        }
      );
    });
  }
  
  async presentDistanciaAlert(distancia: number) {
    const alert = await this.alertCtrl.create({
      header: 'Distancia fuera de servicio',
      message: `La distancia entre tu casa y el restaurante supera el límite de servicio. Distancia actual para la entrega: ${distancia} km. Prueba con otra sucursal o restaurante.`,
      buttons: [
        {
          text: 'Confirmar',
          handler: () => {
            console.log('Usuario confirmó');
            this.router.navigate(['/tabs/marketplace'])
          }
        }
      ]
    });
  
    await alert.present();
  }

closeAlert() {
  this.showAlertx = false;
}

closeAlert2() {
  this.showAlertx = false;
  this.showModalDirecciones()
}


  calcularCostoEnvio(distancia: number): number {
    console.log(distancia)
    if (distancia >= 15) {
      this.presentDistanciaAlert(distancia);
    }
    if (distancia <= 2) return 35;
  
    // Definir los intervalos de distancia y costo
    const tramos = [
      { limite: 3, costoBase: 35, costoIncremento: 5 },
      { limite: 4, costoBase: 40, costoIncremento: 5 },
      { limite: 5, costoBase: 45, costoIncremento: 5 },
      { limite: 6, costoBase: 50, costoIncremento: 5 },
      { limite: 7, costoBase: 55, costoIncremento: 5 },
      { limite: 8, costoBase: 60, costoIncremento: 5 },
      { limite: 9, costoBase: 65, costoIncremento: 5 },
      { limite: 10, costoBase: 70, costoIncremento: 5 },
      { limite: 11, costoBase: 75, costoIncremento: 10 },
      { limite: 12, costoBase: 85, costoIncremento: 10 },
      { limite: 13, costoBase: 95, costoIncremento: 10 },
      { limite: 14, costoBase: 105, costoIncremento: 10 },
      { limite: 15, costoBase: 115, costoIncremento: 10 },
    ];
  
    for (const tramo of tramos) {
      if (distancia <= tramo.limite) {
        const tramoInicio = tramo.limite - 1; // Inicio del tramo
        const proporción = (distancia - tramoInicio); // Parte decimal de la distancia en el tramo
        return tramo.costoBase + tramo.costoIncremento * proporción;
      }
    }
  
    // Si la distancia supera los 15 km
    return 0;
  }
  
//   async getCartItemsAndCount() {
//     try {
//       // Obtener la instancia de Firestore
//       const firestore = getFirestore();
  
//       // Referencia a la subcolección "cart" del usuario actual
//       const cartRef = collection(firestore, `users/${this.userId}/cart`);
  
//       // Obtener los documentos en la subcolección "cart"
//       const cartSnapshot = await getDocs(cartRef);
  
//       // Contar cuántos documentos hay en la subcolección
//       const itemCount = cartSnapshot.size;
//       this.itemCount = itemCount;
  
//       // Crear un array temporal para almacenar los productos del carrito
//       const cartItems: any[] = [];
//       let precioTotal = 0; // Inicializar la variable para el total del precio
  
//       // Recorrer los documentos de la subcolección y extraer la información del producto
//       cartSnapshot.forEach(doc => {
//         const productData = doc.data();
//         const quantity = productData['cantidad'];
//         const price = productData['precio'];
        
//         cartItems.push({
//           id: doc.id,
//           name: productData['nombre'],
//           price: price,
//           quantity: quantity,
//         });
  
//         // Sumar el precio total por la cantidad de cada producto
//         precioTotal += price * quantity;
//       });
  
//       // Asignar los productos al array que usa *ngFor
//       this.cartItems = cartItems;
  
//       // Asignar el total del precio
//       this.precioTotal = precioTotal;
  
//       // Retornar el número de elementos
//       console.log('Número de elementos en el carrito:', itemCount);
//       console.log('Total del precio del carrito:', precioTotal);
      
//       return itemCount;
//     } catch (error) {
//       console.error('Error al obtener los elementos del carrito:', error);
//       return 0;
//     }
//   }

async onFileSelected(event: any, type: 'logo' | 'banner') {
  const file = event.target.files[0];
 


  
  if (!file) return;

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
 

    // Si la resolución es correcta, guarda el archivo y crea la vista previa
    if (type === 'logo') {
      this.logoFile = file;
      this.createImagePreview(file, 'logo');
    } else if (type === 'banner') {
      this.bannerFile = file;
      this.createImagePreview(file, 'banner');
    }
  };
}
  
getFormattedPrice(price: number): string {
  return price.toFixed(2);
}
private createImagePreview(file: File, type: 'logo' | 'banner') {
  const reader = new FileReader();
  reader.onload = () => {
    if (type === 'logo') {
      this.logoPreview = reader.result as string;
     
    } else if (type === 'banner') {
      this.bannerPreview = reader.result as string;
    }
  };
  reader.readAsDataURL(file);
}
async updateUserGenero() {
  try {
    const userRef = this.firestore.doc(`users/${this.userId}`);
    
    // Actualizar los campos en Firestore
    await userRef.update({
      fnac: this.birthday,
      email:this.emailClient,
    });

    console.log('Ubicación del usuario actualizada correctamente.');
  } catch (error) {
    console.error('Error al actualizar la ubicación del usuario:', error);
  }
}
async updateUserLocation() {
    try {
      const userRef = this.firestore.doc(`users/${this.userId}`);
      
      // Actualizar los campos en Firestore
      await userRef.update({
        lat: this.currentLatUser,
        lng: this.currentLngUser,
        direccion: this.direccion,
      });
  
      console.log('Ubicación del usuario actualizada correctamente.');
    } catch (error) {
      console.error('Error al actualizar la ubicación del usuario:', error);
    }
  }
  async updateUserName(data:string, genero:string, fnac:string, email:string ) {
    try {
      const userRef = this.firestore.doc(`users/${this.userId}`);
      // Actualizar los campos en Firestore
      await userRef.update({
        nombre: data,
        gen: genero,
        fnac: fnac,
        email:email,
      });
  
      console.log('Ubicación del usuario actualizada correctamente.');
    } catch (error) {
      console.error('Error al actualizar la ubicación del usuario:', error);
    }
  }
  async updateUserPhone(data:string) {
    try {
      const userRef = this.firestore.doc(`users/${this.userId}`);
      
      // Actualizar los campos en Firestore
      await userRef.update({
        phone: data,
 
      });
  
      console.log('Ubicación del usuario actualizada correctamente.');
    } catch (error) {
      console.error('Error al actualizar la ubicación del usuario:', error);
    }
  }
  generateTwoCodes(): [number, number] {
    // Genera un número aleatorio de 4 dígitos
    const generateCode = () => Math.floor(1000 + Math.random() * 9000);
  
    // Generar dos códigos
    const code1 = generateCode();
    const code2 = generateCode();
  
    // Devolver los códigos como un array
    return [code1, code2];
  }
  scrollToBottom() {
    this.content.scrollToBottom(300); // 300 es la duración en milisegundos del desplazamiento
  }
  async uploadImage(file: File, type: 'logo' | 'banner'): Promise<string> {
    const storageRef = ref(this.storage, `restaurantes/${type}_${Date.now()}_${file.name}`);
    
    // Subir el archivo
    await uploadBytes(storageRef, file);
    
    // Obtener la URL de descarga
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }
}
