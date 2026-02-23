import { Component, ElementRef, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getDatabase, onValue, ref as refDb } from 'firebase/database';
import { addDoc, collection, doc, getFirestore, onSnapshot, query, setDoc, Timestamp, where } from 'firebase/firestore';
import { get } from 'scriptjs';

import { ModalDireccionServiceComponent } from 'src/app/modals/modal-direccion-service/modal-direccion-service.component';
import { ModalRestaurantesSelectComponent } from 'src/app/modals/modal-restaurantes-select/modal-restaurantes-select.component';
import { environment } from 'src/environments/environment.prod';
declare var google: any;

interface Restaurant2 {
    id?: string;
    currentLat?: number | undefined;
    currentLng?: number | undefined;
    distance?: number; // Campo opcional para la distancia
    costoEnvio?: any; // Campo opcional para la distancia
    
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

  export interface Restaurant {
    id?: string; // Opcional para el ID
    nombre: string;
    direccion: string;
    prepaTime: number;
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
    // Agrega otros campos según sea necesario.
  }
@Component({
  selector: 'app-solicitar-repa',
  templateUrl: './solicitar-repa.page.html',
  styleUrls: ['./solicitar-repa.page.scss'],
})
export class SolicitarRepaPage implements OnInit {

 nameClient = '';
  protectDouble = false
  phoneUser = '';
  banner= ""
  currentLatBs: any = 0
  direccion = '';
  isCalculating: boolean = false; // Class-level flag
  devMode :any = ""
  currentLat: any = 0
  currentLng : any = 0
  direccionBs: any = ""
  logoBs: any = ""
  autorizeMaps = false
  currentLngBs : any
    prepaTime = 0
    rangoRestaurante: any
  distancia : any
  notaPedido = '';
  searchTerm:any = ""
  clientes = [
  { nombre: 'María López', telefono: '5512345678', direccion: 'Av. Insurgentes 123, CDMX' },
  { nombre: 'Carlos Ramírez', telefono: '5598765432', direccion: 'Col. Del Valle, CDMX' },
  { nombre: 'Laura Méndez', telefono: '5523456789', direccion: 'Santa Fe 456, CDMX' }
];
  idnUser:any = ""
  currentLatUser : number  =  22.23297316172514;
currentLngUser : number = -97.854961346833;
  tfll: any =""
  exists : any
  map:any
  typePay = '';
  nombreRestaurant: any = ""
  status2: any = ""
  uidBs:any = ""
  phoneRest : any
  restaurantes : any = []
  logo = ""
  comisionRestaurante = 0
  precioTotal: number = 0;
  restaurantdetails: Restaurant | null | undefined = null;
  userId: any = "Reczon-User"
  costoEnvio: number = 0;
    latitudTampico =   22.23297316172514
  longitudTampico = -97.854961346833
    @ViewChild('map', { static: false }) mapRef: ElementRef | undefined;
    mapMarkerDraggable:any
  booleanModal = false
printID = ""
  mapsKey = environment.mapsKey
  private activatedRoute = inject(ActivatedRoute);
  emailClient = ""
  restaurant :any = ""
  logoPreview: string | null = null;
  logoFile: File | null = null;
  constructor(private router: Router,
    private zone: NgZone,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController, 
    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore) { }
  async loadRestaurantData(firstTime: any) {
    //console.log(this.restaurant);
  // Obtiene el documento del restaurante
  this.firestore.doc<UserData>(`restaurantes/${this.restaurant}`)
    .valueChanges({ idField: 'id' })
    .subscribe(data => {
      if (data) {
        //console.log('Restaurant data:', data);
        this.nombreRestaurant = data.nombre
        this.logoBs = data.logo
        this.phoneRest = data.phone
        this.direccionBs = data.direccion

   
        this.currentLatBs = data.currentLat
        this.currentLngBs = data.currentLng
        this.loadrestaurante()

      } else {
        console.warn('No restaurant found with the given ID.');
        this.restaurantdetails = null; // Maneja el caso como desees
      }
    });
  }
  uid =""
enableService = false
  private db = getDatabase();
  private auth = getAuth();
  whatsappNumber = ""
  name = ""
arrayNumbers :any
  ngOnInit() {
            get(`https://maps.googleapis.com/maps/api/js?key=`+ this.mapsKey+`&libraries=places`, () => {
            this.showMap(this.currentLatUser, this.currentLngUser,14);
            });
        
  this.restaurant = this.activatedRoute.snapshot.paramMap.get('neg') || '';
  if(this.restaurant === 'all'){
    this.restaurant = "test-store"
  }
  
   onAuthStateChanged(this.auth, (user: User | null) => {
          if (user) {
            this.uid = user.uid;
            const userRef = refDb(this.db, `UsersBusinessChat/${this.uid}`);
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
                  this.whatsappNumber = res.SelectedPh || '';

                  this.buscarRestaurantePorTelefono(this.whatsappNumber)
             

                  this.name = res.Name || '';
                });
              }
            });
          }
        });
  
     
  }


goBack(){
  this.router.navigate([`/carrito/${this.restaurant}/${this.devMode}`])

}
getOptions() {
    document.getElementById('selectChangeXX')?.click();
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
            //this.showModalDirecciones(); // Método para manejar la acción de elegir nueva ubicación
          },
        },
      ],
    });

    await alert.present();
  }



  showMap(lat: any, lng: any, zoom:any) {
  const location = new google.maps.LatLng(lat, lng);
  const options = {
    center: location,
    zoom: zoom,
    disableDefaultUI: false,
    draggable: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_RIGHT
    },
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain", "Dark"]
  };

  var iconSize = new google.maps.Size(50, 50);

  var customIcon = {
    url: 'https://www.iconpacks.net/icons/2/free-location-pin-icon-2965-thumb.png',
    scaledSize: iconSize
  };

  if (this.mapRef) {
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
  }

  // 👉 Marcador 1: Restaurante (fijo)
  const restaurantPosition = new google.maps.LatLng(this.currentLatBs, this.currentLngBs);
  const restaurantMarker = new google.maps.Marker({
    position: restaurantPosition,
    title: 'Restaurante',
    icon: {
      url: 'https://firebasestorage.googleapis.com/v0/b/soyjuan-mx.appspot.com/o/tienda%20(1).png?alt=media&token=9234d82a-18c8-4e7e-a76a-c26779b86192', // ícono diferente para restaurante
      scaledSize: new google.maps.Size(40, 40)
    },
    map: this.map
  });

  // 👉 Marcador 2: Usuario (movible)
  const userPosition = new google.maps.LatLng(lat, lng);
  this.mapMarkerDraggable = new google.maps.Marker({
    position: userPosition,
    latitude: lat,
    longitude: lng,
    animation: google.maps.Animation.DROP,
    draggable: true,
    icon: customIcon,
    map: this.map
  });

  // Círculo alrededor del marcador movible
  const circle = new google.maps.Circle({
    map: this.map,
    center: userPosition,
    radius: 30,
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35
  });

  circle.bindTo('center', this.mapMarkerDraggable, 'position');

  // 👉 Línea entre restaurante y usuario
  const path = [restaurantMarker.getPosition(), this.mapMarkerDraggable.getPosition()];
  const polyline = new google.maps.Polyline({
    path: path,
    geodesic: true,
    strokeColor: "#000000",
    strokeOpacity: 0.7,
    strokeWeight: 2,
    map: this.map
  });

  // 👉 Evento al mover el marcador del usuario
  const geocoder = new google.maps.Geocoder();
  google.maps.event.addListener(this.mapMarkerDraggable, 'dragend', (marker: any) => {
    const latLng = marker.latLng;
    const lat = latLng.lat();
    const lng = latLng.lng();

    this.currentLat = lat;
    this.currentLng = lng;
    this.currentLatUser = lat;
    this.currentLngUser = lng;

    this.showToast('Coordenadas actualizadas correctamente');

    // Recalcular la línea entre el nuevo punto y el restaurante
    polyline.setPath([restaurantMarker.getPosition(), latLng]);

    geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          const direccion = results[0].formatted_address;
          console.log('Dirección:', direccion);
          this.showToast('Dirección: ' + direccion);
          this.direccion = direccion;
          this.loadRestaurantData(false);
        } else {
          console.warn('No se encontraron resultados de dirección.');
          this.showToast('No se pudo encontrar la dirección.');
        }
      } else {
        console.error('Geocoder falló debido a:', status);
        this.showToast('Error al obtener la dirección.');
      }
    });
  });
}


  async finalizarPedido() {
    this.protectDouble = true;
    
    if (this.typePay === 'Transferencia'){

      if(this.logoPreview === null || this.logoPreview === 'null'){
      this.showToast("Debes colocar una imagen para la transferencia para poder continuar")
      this.protectDouble = false

      return
        
      }else{
        
      }
  
     }

    if(this.precioTotal < 20){
      this.protectDouble = false
      this.showToast("Error. El total del pedido es de 0. Coloca un precio valido")
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
      this.showToast("Debes ingresar tu nombre para continuar")
      return
    }else{

    }
    if(this.costoEnvio === 0){
      this.protectDouble = false
      this.showToast("Debes ingresar una ubicacion valida")
      //this.showGetLocation()
            return
          }else{
      
          }
          if(this.phoneUser === "" || this.phoneUser === undefined || this.phoneUser === null){
            this.showToast("Debes ingresar tu numero de celular para continuar")
            this.protectDouble = false
     
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
      //const impresionesRef = collection(firestore, `/impresiones/${this.printID}/pedidos`);
      const clientesRef = collection(firestore, `/clientes/${this.restaurant}/today`);
      const restaurantOrderRef = collection(firestore, `pedidos/${this.restaurant}/today`);
  // Llamada al método para obtener los dos códigos
  const pedidoId = await this.generateUniqueId('restaurantes');
   
  console.log(pedidoId)
const [code1, code2] = this.generateTwoCodes();
      // Datos del pedido que se van a enviar

      if(this.typePay ==="Efectivo" ){
    
      }else if(this.typePay ==="Transferencia" ){
        

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
      const pedidoData = {
        codeTienda: code1,
        codeCliente: code2,
        //items: this.cartItems, // Los productos en el carrito
        total: this.precioTotal, // Precio total del carrito
        fecha: this.formatDate(new Date()), // Fecha con formato personalizado
        latCliente: this.currentLatUser,
        lngCliente: this.currentLngUser,
        cliente: this.nameClient,
        devMode: "A domicilio",
        imgTrans: "this.logoUrl",
        comision:10,
        direccion: this.direccion,
        direccionBs: this.direccionBs,
        prepaTime:  30,
        tst: Timestamp.now(),
        idn:pedidoId,  
        uidBs:this.uidBs,
        autoacctype: "this.autoaceptartype",
        uid:this.userId,
        envio:this.costoEnvio,
        phone: this.phoneUser,
        notaPedido: this.notaPedido,
        km:this.distancia,
        logoBs: this.logoBs,
        nameRest: this.nombreRestaurant,
        latBs: this.currentLatBs,
        idBs: this.restaurant,
        lngBs: this.currentLngBs,
        idprint: "this.printID",
       // gen: this.genero,
        birthday:"",
        channel: "Reczon API",
        tfll: this.tfll,
        typePay: this.typePay,
        tfs: 0,
        status: "Nuevo", // Estado del pedido
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

      }else{
    //  this.enviarPedido(code1, code2, userOrderId)

        //const impresionesOrderDocRef = doc(impresionesRef, userOrderId);
        //await setDoc(impresionesOrderDocRef, { ...pedidoData });
      }



      const clientOrderDocRef = doc(clientesRef, this.userId);
      await setDoc(clientOrderDocRef, { ...pedidoDataUser, uid: this.userId });

      const restaurantOrderDocRef = doc(restaurantOrderRef, userOrderId);
      await setDoc(restaurantOrderDocRef, { ...pedidoData, id: userOrderId });
      
      const restaurantOrderDocRef2 = doc(pedidosRef, userOrderId);
      await setDoc(restaurantOrderDocRef2, { ...pedidoData, id: userOrderId });
      console.log('Pedido finalizado y guardado en ambas referencias.');
      // Redirigir a la página de información del pedido con el ID generado
      //this.showModalAnimation()
      //this.router.navigateByUrl(`/pedido-info/${userOrderId}`, { replaceUrl: true });

      // this.router.navigate([`/pedido-info/${userOrderId}`], { replaceUrl: true }).then(() => {
      //   // Clear all previous history entries after navigation
      //   this.location.replaceState(`/pedido-info/${userOrderId}`);
      // });
      if(this.uidBs === "No token"){

      }else{

   

      }
  
      var dataClient2 = {
        Text: "¡Hola! El cliente: "+ this.nameClient +" ha realizado una solicitud de repartidor con ID:"+ pedidoId + " al comercio: " + this.nombreRestaurant + ", revisa su seguimiento.",

        Pay:"Efectivo",
        Ph: "5218334285513",
        Tk:"EAAMZB5AaN4h0BOzs4PcMw8gqzSGeZAOD83ZBgBtiQP84zIUCqlKQXHT0iuOHsTSjv9JBZBgITb81ZCUPuzcDC1An5PMJeNCUopqZB0T8Go027EPOXhKb0Uqlslhhf7YWMsPXZBARb79rpbGlkSsHS2ezZAa2kiOS01stUnmut8jv32YZCLnVdCmKTFhiKrqmUECBt",
        Phone:"5218334502378",
        PhBs: "217475241449410",
      }

      this.sendMsgWhatsapp(dataClient2)

        
    } catch (error) {
      alert(error)
      console.error('Error al finalizar el pedido:', error);
    }
  }
 async modalClientes(){
      if(this.booleanModal === true){
        return
      }
      this.booleanModal = true
        const modal = await this.modalCtrl.create({
          component: ModalRestaurantesSelectComponent,
        });
    
        modal.onDidDismiss().then(async (result) => {
          console.log(result.data[0])
          this.currentLatBs = result.data[0]['currentLat']
          this.currentLngBs = result.data[0]['currentLng']
          this.direccionBs = result.data[0]['direccion'];
          this.nombreRestaurant = result.data[0]['nombre']
          this.restaurantes = []
          this.restaurantes.push({
            nombre: this.nombreRestaurant,
            currentLat: this.currentLatBs ?? 0,
            currentLng: this.currentLngBs ?? 0,
          });
          const restaurantsWithDistances = await this.calcularDistancias(
            this.currentLatUser,
            this.currentLngUser,
            this.restaurantes
          );
          // Actualizar restaurantes
          this.restaurantes = restaurantsWithDistances;

          // Buscar restaurante
          const restaurantEncontrado = this.restaurantes.find(
            (restaurant:any) => restaurant.nombre === this.nombreRestaurant
          );
          console.log(restaurantEncontrado)
          if (restaurantEncontrado) {
            this.distancia = restaurantEncontrado.distance;
            this.costoEnvio = restaurantEncontrado.costoEnvio;
            console.log('Costo de envío actualizado:', this.costoEnvio);
            console.log('Distancia de envío actualizado:', this.distancia);
          } else {
            console.log('No se encontró un restaurante con ese nombre.');
          }
        });
        this.booleanModal = false
    
        await modal.present();
  
      
    
  }
//  async modalDireccionesRecolect(){
//       if(this.booleanModal === true){
//         return
//       }
//       this.booleanModal = true
//         const modal = await this.modalCtrl.create({
//           component: ModalRestaurantesSelectComponent,
//         });
    
//         modal.onDidDismiss().then(async (result) => {
//           console.log(result.data[0])
//           this.currentLatBs = result.data[0]['currentLat']
//           this.currentLngBs = result.data[0]['currentLng']
//           this.direccionBs = result.data[0]['direccion'];
//           this.nombreRestaurant = result.data[0]['nombre']
//           this.restaurant = result.data[0]['key']
//           this.restaurantes = []
//           this.restaurantes.push({
//             nombre: this.nombreRestaurant,
//             currentLat: this.currentLatBs ?? 0,
//             currentLng: this.currentLngBs ?? 0,
//           });
//           const restaurantsWithDistances = await this.calcularDistancias(
//             this.currentLatUser,
//             this.currentLngUser,
//             this.restaurantes
//           );
//           // Actualizar restaurantes
//           this.restaurantes = restaurantsWithDistances;

//           // Buscar restaurante
//           const restaurantEncontrado = this.restaurantes.find(
//             (restaurant:any) => restaurant.nombre === this.nombreRestaurant
//           );
//           console.log(restaurantEncontrado)
//           if (restaurantEncontrado) {
//             this.distancia = restaurantEncontrado.distance;
//             this.costoEnvio = restaurantEncontrado.costoEnvio;
//             console.log('Costo de envío actualizado:', this.costoEnvio);
//             console.log('Distancia de envío actualizado:', this.distancia);
//           } else {
//             console.log('No se encontró un restaurante con ese nombre.');
//           }
//         });
//         this.booleanModal = false
    
//         await modal.present();
  
      
    
//   }
  
  async modalDirecciones(){
      if(this.booleanModal === true){
        return
      }
      this.booleanModal = true
        const modal = await this.modalCtrl.create({
          component: ModalDireccionServiceComponent,
        });
    
        modal.onDidDismiss().then(async (result) => {
          console.log(result.data)
          this.showMap(result.data.lat, result.data.lng, 14);
          this.direccion = result.data.direccion;
          this.restaurantes = []
          this.restaurantes.push({
            nombre: this.nombreRestaurant,
            currentLat: this.currentLatBs ?? 0,
            currentLng: this.currentLngBs ?? 0,
          });
          const restaurantsWithDistances = await this.calcularDistancias(
            this.currentLatUser,
            this.currentLngUser,
            this.restaurantes
          );
          // Actualizar restaurantes
          this.restaurantes = restaurantsWithDistances;

          // Buscar restaurante
          const restaurantEncontrado = this.restaurantes.find(
            (restaurant:any) => restaurant.nombre === this.nombreRestaurant
          );
          console.log(restaurantEncontrado)
          if (restaurantEncontrado) {
            this.distancia = restaurantEncontrado.distance;
            this.costoEnvio = restaurantEncontrado.costoEnvio;
            console.log('Costo de envío actualizado:', this.costoEnvio);
            console.log('Distancia de envío actualizado:', this.distancia);
          } else {
            console.log('No se encontró un restaurante con ese nombre.');
          }
        });
        this.booleanModal = false
    
        await modal.present();
  
      
    
  }


    async calcularDistancias(
    currentLat: number,
    currentLng: number,
    restaurants: Restaurant2[]
  ): Promise<Restaurant2[]> {
    console.log(restaurants)
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
          console.log('response', response)
          if (status === google.maps.DistanceMatrixStatus.OK) {
            const updatedRestaurants = restaurants.map((restaurant, index) => {
              const distanceData = response.rows[0].elements[index];
              console.log(distanceData)
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
          this.prepaTime = +(data.prepaTime ?? 14) + 16;
  
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
        
              setTimeout( async () => {
      
         const exists = this.restaurantes.some(
          (restaurant:any) => restaurant.nombre === this.nombreRestaurant
        );
        
        if (!exists) {
          this.restaurantes.push({
            nombre: this.nombreRestaurant,
            currentLat: this.currentLatBs ?? 0,
            currentLng: this.currentLngBs ?? 0,
          });
        }

              try {
          if(this.autorizeMaps === true){
            console.log(this.currentLatUser)
            console.log(this.currentLngUser)

          const restaurantsWithDistances = await this.calcularDistancias(
            this.currentLatUser,
            this.currentLngUser,
            this.restaurantes
          );

          // Actualizar restaurantes
          this.restaurantes = restaurantsWithDistances;

          // Buscar restaurante
          const restaurantEncontrado = this.restaurantes.find(
            (restaurant:any) => restaurant.nombre === this.nombreRestaurant
          );
          console.log(restaurantEncontrado)
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
      } catch (error) {
        console.error('Error al calcular distancias:', error);
        this.presentLocationAlert();
      }
          }, 1000);

          //      get(`https://maps.googleapis.com/maps/api/js?key=AIzaSyClzbvzJI0_4Q_1z5Pr0PCI9IdmYuwpMmo&libraries=places`, () => {
                });
          // get(`https://maps.googleapis.com/maps/api/js?key=`+ this.mapsKey+`&libraries=places`, () => {
          //   setTimeout(() => {
          //     this.getUserData();
  
          //   }, 500);
          //   //      get(`https://maps.googleapis.com/maps/api/js?key=AIzaSyClzbvzJI0_4Q_1z5Pr0PCI9IdmYuwpMmo&libraries=places`, () => {
          //         });
  
        } else {
          console.warn('No restaurant found with the given ID.');
          this.restaurantdetails = null; // Maneja el caso como desees
        }
      });
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
      // async showGetLocation() {
      //   if(this.booleanModal === true){
      //     return
      //   }
      //   this.booleanModal = true
      //   const modal = await this.modalCtrl.create({
      //     component: ModalmapComponent,
      //     componentProps : {title:"Agregar ubicación"}
      //   });
    
      //   modal.onDidDismiss().then(async (result) => {
      //     if (result.data) {
      //       console.log(result.data);
           
      //       this.currentLatUser = result.data.lat;
      //       this.currentLngUser = result.data.lng;
      //       this.direccion = result.data.direccion;
      //       await this.updateUserLocation();
      //     }
      //     else{
            
    
      //     //  await this.updateUserLocation();
      //     }
      //   });
      //   this.booleanModal = false
    
      //   await modal.present();
    
      // }
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
    generateTwoCodes(): [number, number] {
    // Genera un número aleatorio de 4 dígitos
    const generateCode = () => Math.floor(1000 + Math.random() * 9000);
  
    // Generar dos códigos
    const code1 = generateCode();
    const code2 = generateCode();
  
    // Devolver los códigos como un array
    return [code1, code2];
  }
    // async showModalAnimation(){
    //   if(this.booleanModal === true){
    //     return
    //   }
    //   this.booleanModal = true
    //     const modal = await this.modalCtrl.create({
    //       component: ModalBuyComponent,
    //     });
    
    //     modal.onDidDismiss().then(async (result) => {
       
    //     });
    //     this.booleanModal = false
    
    //     await modal.present();
  
      
    // }
sucursales: Restaurant[] = [];
sucursal: string | null = null;

buscarRestaurantePorTelefono(phone: string) {
  console.log('Buscando restaurante con teléfono:', phone);

  this.firestore.collection<Restaurant>('restaurantes', ref =>
    ref.where('telefono', '==', phone.toString())
  )
  .valueChanges({ idField: 'id' })
  .subscribe(resultados => {

    console.log('Resultados:', resultados);

    if (resultados.length > 0) {
      
      this.sucursales = resultados; // 👈 guardamos en el array
      if(this.sucursales.length === 1){
        this.restaurant = this.sucursales[0].id; // seleccionamos la primera sucursal encontrada
        this.loadRestaurantData(true)
         this.obtenerPedidosDelDia()
        
      }
      console.log('Restaurantes agregados al select:', this.sucursales);

    } else {
      this.sucursales = []; // limpiamos si no hay resultados
      console.log('No se encontró restaurante con ese número');
    }
  });
}
onSucursalChange(event: any) {
  const selectedId = event.detail.value;

  console.log('Sucursal seleccionada manualmente:', selectedId);

  this.restaurant = selectedId;
  this.costoEnvio = 0
  this.precioTotal = 0
  this.loadRestaurantData(false);
   this.obtenerPedidosDelDia()
}
  pedidosTotalCountRestaurante = 0
async obtenerPedidosDelDia() {
  try {
    const firestore = getFirestore();
    const restaurantOrderRef = collection(firestore, `pedidos/${this.restaurant}/today`);

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

      if (this.pedidosPendienteCount > 0 && this.restaurant === 'all') {
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
 itemCount = 0
  pedidosCanceladosCount = 0;
  pedidosNuevoCount = 0;
  pedidosAceptadoCount = 0;
  pedidosPendienteCount  = 0
  pedidosPreparacionCount = 0;
  pedidosListoCount = 0;
  pedidosEnCaminoCount = 0;
    isPlaying = false;

  pedidosTerminadoCount = 0;
  pedidosTodosTotalCountRestaurante  = 0
  pedidosTotalCount = 0;
  selectedStatus = "todos"
  pedidosFiltrados: any[] = [];
    pedidosDelDia: any[] = [];
  applyFilter(event: string) {
    this.selectedStatus = event;
  
   
      this.pedidosFiltrados = this.pedidosDelDia.filter(pedido => pedido.status === this.selectedStatus);
      
    
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
}

