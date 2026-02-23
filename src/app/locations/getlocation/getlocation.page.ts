import { Component, ElementRef, HostListener, inject, NgZone, OnInit, ViewChild } from '@angular/core';

import { AlertController, IonContent, ModalController, NavParams, Platform, ToastController } from '@ionic/angular';
declare var google: any
import { get } from 'scriptjs';
import * as firebase from 'firebase/app';

import 'firebase/auth';
import { environment } from '../../../environments/environment.prod';

import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { arrayUnion } from 'firebase/firestore';
interface UserData {
  type?: string; // El campo 'type' es opcional
  // Agrega otros campos si es necesario
}
@Component({
  selector: 'app-getlocation',
  templateUrl: './getlocation.page.html',
  styleUrls: ['./getlocation.page.scss'],
})
export class GetlocationPage implements OnInit {
  @ViewChild('map', { static: false }) mapRef: ElementRef | undefined;
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  latitudTampico =   22.230566
  longitudTampico = -97.856203
  currentLat : any
  serverHour = ""
  currentLng : any
  errorTiempoReal = false
  direccion =""
  colonia=""
  iconMarker = "https://cdn-icons-png.flaticon.com/512/249/249680.png"
  programa:any = []
  referencia = ""
  ciudad = ""
  vivienda = ""
  houseTypes = [
    { name: 'Casa', icon: 'home-outline' },
    { name: 'Departamento', icon: 'business-outline' },
    { name: 'Oficina', icon: 'bag-remove-outline' },
    { name: 'Hotel', icon: 'bed-outline' },
    { name: 'Otro', icon: 'location-outline' }
  ];
  currentTypeHouse: string = '';
  isDireccionDisabled: boolean = false;
  pais = ""
  cacheNavigation =""
  estado = ""
  dataOrigin : any = []
  numero = ""
  userId = ""
  codigopostal= ""
  calle=""
  mapMarkerDraggable:any
  mapsKey = environment.mapsKey
  private activatedRoute = inject(ActivatedRoute);
  map : any;
  uid = ""
  phone = ""
  title = ""
  tiempoReal = false
  botNumber:any
  clientNumber:any
  usuarioLogueado = false
  constructor(private firestore: AngularFirestore,private modalController: ModalController,private platform:  Platform,private zone : NgZone,private router: Router,
    private toastController:ToastController,private afAuth: AngularFireAuth, private alertController : AlertController,
     ) { 
  
     // alert("requestpermisionlocation")
       
    get(`https://maps.googleapis.com/maps/api/js?key=`+ this.mapsKey+`&libraries=places`, () => {
      setTimeout(() => {

          console.log("La web app está corriendo en un navegador.");
          if (window.AndroidApp) {

        
            alert("requestpermisionlocation")
    
        
          } else {
            console.error('AndroidApp interface not available');
          }
       const nav = this.router.getCurrentNavigation();
 
 
        this.currentLat = this.activatedRoute.snapshot.paramMap.get('lat') as string || this.latitudTampico;
        this.currentLng = this.activatedRoute.snapshot.paramMap.get('lng') as string || this.longitudTampico;

        this.botNumber = this.activatedRoute.snapshot.paramMap.get('botNumber') as string

        this.clientNumber = this.activatedRoute.snapshot.paramMap.get('clientNumber') as string

          setTimeout(() => {
          this.getLocation()
            
          }, 1000);
            
       
 
      }, 300);
      //      get(`https://maps.googleapis.com/maps/api/js?key=AIzaSyClzbvzJI0_4Q_1z5Pr0PCI9IdmYuwpMmo&libraries=places`, () => {
            });
  }
  
  detectDevice() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Definir umbrales comunes para diferenciar dispositivos
    const isMobile = width <= 767; // Comúnmente usado para teléfonos
    const isTablet = width > 767 && width <= 1024; // Comúnmente usado para tablets
    const isDesktop = width > 1024; // Para dispositivos de escritorio

    if (isMobile) {
        console.log("El dispositivo es un teléfono.");
        return 'phone';
    } else if (isTablet) {
        console.log("El dispositivo es una tablet.");
        return 'tablet';
    } else if (isDesktop) {
        console.log("El dispositivo es una computadora de escritorio.");
        return 'desktop';
    }
    else{
      return 'none'
    }
}
getIconName(type: string): string {
  switch (type) {
    case 'Casa':
      return 'home';
    case 'Edificio':
      return 'business';
    case 'Hotel':
      return 'bed';
    case 'Otro':
      return 'help-circle';
    default:
      return 'home';
  }
}

  async sendTokenToAndroid(token: string) {
    console.log(token)
    if (window.AndroidApp) {
      
      console.log(token)
     
      window.AndroidApp.sendRequestToNative(token);
  
    } else {
     
      console.error('AndroidApp interface not available');
    }
  }
  closeModal(){
    this.modalController.dismiss()
  }
  ionViewWillEnter(){
  
  }
 phoneRest:any
 phoneUser:any
  ngOnInit() {
    const modalState = { modal: true, desc: 'fake state for our modal' };
    history.pushState(modalState, "null");
    const nav = this.router.getCurrentNavigation();
    this.dataOrigin = localStorage.getItem('originNav')
   

  
  this.currentLat = this.activatedRoute.snapshot.paramMap.get('lat') as string;
  this.currentLng = this.activatedRoute.snapshot.paramMap.get('lng') as string;
  this.restaurante = this.activatedRoute.snapshot.paramMap.get('restaurante') as string;
  this.type = this.activatedRoute.snapshot.paramMap.get('type') as string;
  this.phoneRest = this.activatedRoute.snapshot.paramMap.get('botNumber') as string;
  this.phoneUser = this.activatedRoute.snapshot.paramMap.get('clientNumber') as string;
  this.session = this.activatedRoute.snapshot.paramMap.get('session') as string;

    this.afAuth.authState.subscribe(user => {
      if (user) {
        // El usuario está logueado
       //this.loadRestaurantes()

        console.log('Usuario logueado:', user);
        this.userId = user.uid
        this.usuarioLogueado = true
   

        // Redirigir a la página principal o donde desees
   // this.getProjects();
    //this.loadCategories();
      } else {
        this.usuarioLogueado = false
        // El usuario no está logueado
        console.log('No hay usuario logueado');
   
      }
    });
    
   
  }
  
  goBack(){
       this.router.navigate(
      ['/terminar-pedido/'
      + this.restaurante + "/" 
      + this.type + "/" + this.session]);
  }
  ionViewDidEnter(){
  


  }
  detectDeviceType() {
    var type = ""
    if (this.platform.is('desktop')) {
      type = "desktop"
        console.log('La aplicación se está ejecutando en una PC');
        // Aquí puedes realizar las acciones específicas para la versión de escritorio
    } else if (this.platform.is('mobile')) {
        console.log('La aplicación se está ejecutando en un dispositivo móvil');
        // Aquí puedes realizar las acciones específicas para dispositivos móviles
    } else if (this.platform.is('tablet')) {
        console.log('La aplicación se está ejecutando en una tablet');
        // Aquí puedes realizar las acciones específicas para tablets
    } else {
        console.log('No se pudo detectar el tipo de dispositivo');
    }
    return type
}


 isRunningInAndroidApp() {
  const userAgent = navigator.userAgent || navigator.vendor;
  return userAgent.includes("wv") || userAgent.includes("Android");
}
selectType(type: string) {
  this.vivienda = type
  this.currentTypeHouse = type;
  this.showToast("Seleccionaste " + type + " como tu tipo de vivienda." )
}

getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.tiempoReal = true
        this.showToast("Obteniendo ubicación en tiempo real");
        this.currentLat = position.coords.latitude;
        this.currentLng = position.coords.longitude;
        this.showMap(this.currentLat, this.currentLng);
        this.reverseGeocode(this.currentLat, this.currentLng);
      },
      (err) => {
        console.error(err);
        this.errorTiempoReal = true
        this.showToast("No se pudo obtener la ubicación. Cargando mapa por defecto.");

        // Fallback a ubicación por defecto (Tampico)
        this.showMap(this.currentLat, this.currentLng);
        this.reverseGeocode(this.currentLat, this.currentLng);
      }
    );
  } else {
    // API no soportada
    this.errorTiempoReal = true
    this.showToast("Cargando mapa por defecto (API no soportada)");
    const cacheLat = localStorage.getItem("getLocationLat")
    const cacheLng = localStorage.getItem("getLocationLng")
    this.showMap(this.currentLat, this.currentLng);
    this.reverseGeocode(this.currentLat, this.currentLng);
  }

  setTimeout(() => {
    if(this.tiempoReal === false){
      if(this.errorTiempoReal === false){
        this.showToast("No se pudo obtener la ubicación. Cargando mapa por defecto.");
        this.errorTiempoReal = true
        const cacheLat = localStorage.getItem("getLocationLat")
        const cacheLng = localStorage.getItem("getLocationLng")
        // Fallback a ubicación por defecto (Tampico)
        this.showMap(this.currentLat, this.currentLng );
     //   this.reverseGeocode(this.latitudTampico, this.longitudTampico);
      }
     
    }
   
  }, 2000);
}

reverseGeocode(lat: number, lng: number) {
  const geocoder = new google.maps.Geocoder();
  const latlngDraggable = { lat, lng };

  geocoder.geocode({ location: latlngDraggable }, (results: any, status: any) => {
    if (status === "OK") {
      this.zone.run(() => {
        if (results[0]) {
          const components = results[0].address_components;

          this.numero = components[0]?.long_name || "";
          if (this.numero !== "S/N") this.numero = "";

          this.calle = components[1]?.long_name || "";
          this.colonia = components[2]?.long_name || "";
          this.ciudad = components[3]?.long_name || "";
          this.estado = components[4]?.long_name || "";
          this.pais = components[5]?.long_name || "";
          this.codigopostal = components[6]?.long_name || "";
          this.direccion = `${this.calle}, ${this.colonia}, ${this.ciudad}`;
        } else {
          window.alert("No se encontraron resultados");
        }
      });
    } else {
      window.alert("Geocoder falló por: " + status);
    }
  });
}



  showMap(lat:any,lng:any){
 
    const location = new google.maps.LatLng(lat,lng);
    const options = {
    center: location,
    zoom:16,
    disableDefaultUI:false,
    draggable: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_RIGHT
    },
    zoomControl: true, // Mostrar solo los controles de zoom
    mapTypeControl: false, // Desactivar el control de tipo de mapa
    scaleControl: false, // Desactivar el control de escala
    streetViewControl: false, // Desactivar el control de Street View
    rotateControl: false, // Desactivar el control de rotación
    fullscreenControl: false, // Desactivar el control de pantalla completa
    mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain", "Dark"]
    }
    var iconSize = new google.maps.Size(70, 70); // Cambia 50, 50 al tamaño deseado

    var customIcon = {
      url: this.iconMarker,
      scaledSize: iconSize // Aplica el tamaño deseado
    };
    if (this.mapRef) {
      this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    }
    let position = new google.maps.LatLng(lat,lng);
    this.mapMarkerDraggable = new google.maps.Marker({
   position:position,
   latitude:lat,
   title: '',
   longitude: lng,
    
   animation: google.maps.Animation.DROP,
   draggable:true,
   icon: customIcon
   });
   
 //  markers[0].setMap(this.map)
 // Crear el círculo
var circle = new google.maps.Circle({
  map: this.map,
  center: position,
  radius: 30, // Radio de 30px
  strokeColor: "#FF0000", // Color del borde del círculo
  strokeOpacity: 0.8, // Opacidad del borde del círculo
  strokeWeight: 2, // Grosor del borde del círculo
  fillColor: "#FF0000", // Color de relleno del círculo
  fillOpacity: 0.35 // Opacidad del relleno del círculo
});

// Enlazar el círculo al marcador
circle.bindTo('center', this.mapMarkerDraggable, 'position');
 this.mapMarkerDraggable.setMap(this.map)
 const geocoder = new google.maps.Geocoder();
let dragThrottleTimeout: any;

google.maps.event.addListener(this.mapMarkerDraggable, 'drag', (marker: any) => {
  const latLng = marker.latLng;

  // Si ya hay un timeout corriendo, no hacemos nada
  if (dragThrottleTimeout) return;

  dragThrottleTimeout = setTimeout(() => {
    //this.map.panTo(latLng);
    dragThrottleTimeout = null;
  }, 200); // mueve cada 50ms, puedes ajustar a 100ms para aún más suavidad
});

google.maps.event.addListener(this.mapMarkerDraggable, 'dragend', (marker: any) => {
  this.calle = ""; 
  this.colonia = ""; 
  this.ciudad = ""; 
  this.codigopostal = "";
  this.estado = "";
  this.pais = "";
  this.numero = "";
  this.direccion = "";

  var latLng = marker.latLng;

  const latlngDraggable = {
    lat: latLng.lat(),
    lng: latLng.lng(),
  };

  // Centrar el mapa en la nueva ubicación
  this.map.setCenter(latLng);
  console.log(latLng.lat());
  console.log(latLng.lng());

  this.currentLat = latLng.lat();
  this.currentLng = latLng.lng();

geocoder.geocode({ location: latlngDraggable }, (results: any, status: any) => {
  if (status === "OK") {
    if (results[0]) {
   const result = results[0];

            // Validación por tipo
      const tipos = result.types || [];
      const esDireccionReal = tipos.includes("street_address") || tipos.includes("premise") || tipos.includes("route");

      if (!esDireccionReal) {
        console.warn("Ubicación no válida (no es una dirección real)");
        this.limpiarDireccion();
        this.showToast("Selecciona una dirección válida en zona urbana.");
        return;
      }

      const components = results[0].address_components;

      // Validaciones seguras por índice
      this.numero         = components[0]?.long_name || "";
      this.calle          = components[1]?.long_name || "";
      this.colonia        = components[2]?.long_name || "";
      this.ciudad         = components[3]?.long_name || "";
      this.estado         = components[4]?.long_name || "";
      this.pais           = components[5]?.long_name || "";
      this.codigopostal   = components[6]?.long_name || "";
      console.log(this.calle)
      console.log(this.colonia)
      // Si falta calle o colonia, se considera ubicación no válida
      if (this.calle === "" && this.colonia === "") {
        console.warn("Ubicación sin calle o colonia. Posible zona no urbana.");
        this.limpiarDireccion();
        return;
      }

      // Si el número no es válido
      if (this.numero !== "S/N") {
        this.numero = "";  // según tu lógica original
      }

      // Construir dirección
      this.direccion = `${this.calle}, ${this.colonia}, ${this.ciudad}`;

      // Actualizar título del marcador
      this.mapMarkerDraggable.title = results[0].formatted_address;

    } else {
      this.limpiarDireccion();
      window.alert("No se encontraron resultados");
    }
  } else {
    this.limpiarDireccion();
    window.alert("Geocoder falló por: " + status);
  }
});


});

// Método para limpiar si hay fallo o sin resultados


  }
  limpiarDireccion() {
  this.calle = "";
  this.colonia = "";
  this.ciudad = "";
  this.codigopostal = "";
  this.estado = "";

  this.pais = "";
  this.numero = "";
  this.direccion = "";
}

ngOnDestroy() {
  console.log('[ngOnDestroy] Limpiando mapa y listeners');

 

  // Si tienes listeners globales (como window) o intervalos, límpialos aquí
  // Ejemplo:
  // if (this.miIntervalo) {
  //   clearInterval(this.miIntervalo);
  //   this.miIntervalo = null;
  // }


}

restaurante = ""
type = ""
session = ""
 async saveLocation() {
  if (this.direccion === "") {
    this.showToast("Debes colocar una ubicación válida.");
    return;
  }

  this.direccion = this.calle + ', ' + this.colonia + ', ' + this.ciudad + ", " +  this.codigopostal;

  const array = {
    codigopostal: this.codigopostal,
    calle: this.calle,
    colonia: this.colonia,
    ciudad: this.ciudad,
    lat: this.currentLat,
    lng: this.currentLng,
    direccion: this.direccion,
    origin: this.dataOrigin
  };

  try {
await this.firestore
  .collection('Locations')
  .doc(this.phoneRest)
  .collection(this.phoneUser.toString().replace("+", ""))
  .doc('0')
  .set({
    lat: this.currentLat,
    lng: this.currentLng,
    address: this.direccion,
    colonia: this.colonia,
    loc_ind: ""
  }, { merge: true });


    console.log(array);

    // Navega
    this.router.navigate([
      '/terminar-pedido/' + this.restaurante + '/' + this.type + '/' + this.session
    ], {
      state: { data: array }
    });
    setTimeout(() => {
    document.getElementById("getLocation")?.click()
    }, 2000);

  } catch (error) {
    console.error('Error al guardar ubicación:', error);
    this.showErrorAlert('Ocurrió un error al guardar la ubicación. Intenta nuevamente.' + error);
  }
}



async showErrorAlert(message: string) {
  const alert = await this.alertController.create({
    header: 'Error',
    message,
    buttons: ['OK'],
    cssClass: 'custom-alert'
  });
  await alert.present();
}

  scrollToBottom() {
    this.content.scrollToBottom(1500); // 500ms de duración en el scroll
  }
 async showToast(message: string) {
  const toast = await this.toastController.create({
    message,
    duration: 3000,
    position: 'middle',
    cssClass: 'white-text-toast', // 👈 clase personalizada
    buttons: [
      {
        text: 'OK',
        role: 'cancel',
        handler: () => {
          toast.dismiss();
        },
      },
    ],
  });
  await toast.present();
}


 
  async showAlert() {
    const alert = await this.alertController.create({
      header: 'Acción no permitida',
      message: 'No puedes regresar desde esta pantalla.',
      buttons: ['Entendido'],
    });
    await alert.present();
  }
     @HostListener('window:popstate', ['$event'])
      dismissModal() {
      
       
      }
}
