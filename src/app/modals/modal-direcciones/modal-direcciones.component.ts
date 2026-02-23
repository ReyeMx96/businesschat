import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { getFirestore, collection, onSnapshot, addDoc, doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { ModalmapComponent } from '../modalmap/modalmap.component';
import { environment } from 'src/environments/environment.prod';
import { get } from 'scriptjs';
declare var google: any
@Component({
  selector: 'app-modal-direcciones',
  templateUrl: './modal-direcciones.component.html',
  styleUrls: ['./modal-direcciones.component.scss'],
})
export class ModalDireccionesComponent  implements OnInit {

  userId = ""
  filteredDirecciones: any[] = []; 
   searchQuery: string = ''; 
   direccion = ""
   currentLat = 0
   origin = ""
   currentLng = 0
   enableLocation = true
   typeHouse = ""
   currentLatAmante  = 0
   currentLngAmante  = 0
   direccionAmante = ""
   referenciaAmante = ""
   referencia = ""
   mapMarkerDraggable:any
   mapsKey = environment.mapsKey
  latitudTampico =   22.23297316172514
  longitudTampico = -97.854961346833

  serverHour = ""
  private timeoutId: any;
  colonia=""
  ciudad = ""
  pais = ""
  estado = ""
  numero = ""
  codigopostal= ""
  calle=""
   unsubscribeFromDirecciones: any;
   loadedApi = false
  constructor(private zone : NgZone,private navParams: NavParams, private firestore: AngularFirestore,
    private modalController: ModalController,private toastController: ToastController, 
    private router: Router) {
      get(`https://maps.googleapis.com/maps/api/js?key=`+ this.mapsKey+`&libraries=places`, () => {

        this.loadedApi = true
    this.startLocationDetection()

      })  

     }
     startLocationDetection() {
      
      this.timeoutId = setTimeout(() => {
        if(this.loadedApi === true){
         


            this.getLocation()
      
          
  

        }
      
      }, 2000); // 1 segundo de espera antes de llamar getLocation()
    }
obtenerUbicacion(){
       if(this.loadedApi === true){
          if (window.AndroidApp) {

        
            alert("requestpermisionlocation")

        
          } else {
            console.error('AndroidApp interface not available');
          }


            this.getLocation()
      
          
  

        }
}
    async showModalMap() {
   
          localStorage.setItem("originNav",this.origin)
             this.router.navigate(['/location-type'],);
      this.modalController.dismiss()

      return
      const modal = await this.modalController.create({
        component: ModalmapComponent,
        componentProps: { 
          Uid: this.userId
        },
          // Clase para estilos personalizados
      // El modal se abrirá al 80% de la altura de la pantalla
      });
  
    // Presentar el modal
    await modal.present();
  
    // Escuchar los datos devueltos por el modal
    const { data } = await modal.onDidDismiss();
    
    if (data && data.direccion && data.lat && data.lng) {
      console.log('Datos seleccionados desde el modal:', data);
      this.direccion = data.direccion;
      this.currentLat = data.lat;
      this.currentLng = data.lng;
      this.typeHouse = data.type;
      this.updateUserLocation();
    } else {
      console.log('El modal fue cerrado sin seleccionar datos.');
      // Opcional: puedes manejar la lógica cuando el modal se cierra sin datos aquí.
    }
  }

  async updateUserLocation() {
    try {
      const userRef = this.firestore.doc(`users/${this.userId}`);
      
      // Actualizar los campos en Firestore
      await userRef.update({
        lat: this.currentLat,
        lng: this.currentLng,
        direccion: this.direccion,
        type:this.typeHouse,
        ref:this.referencia,
  
      });
      this.showToast('Ubicación del usuario actualizada correctamente.')
      console.log('Ubicación del usuario actualizada correctamente.');
    } catch (error) {
      console.error('Error al actualizar la ubicación del usuario:', error);
    }
  }
  ngOnInit() {
    this.userId = this.navParams.get('Uid');
    this.origin = this.navParams.get('origin') || "/tabs/marketplace";
    this.subscribeToDirecciones()
    const modalState = { modal: true, desc: 'fake state for our modal' };
    history.pushState(modalState, "null");

    
    
  }
  getLocation() {   
 
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Detener el timeout cuando se detecta la ubicación
        
        this.currentLatAmante = position.coords.latitude;
        this.currentLngAmante = position.coords.longitude;
        const geocoder = new google.maps.Geocoder();
        const latlngDraggable = {
          lat: this.currentLatAmante,
          lng: this.currentLngAmante,
        };

        geocoder.geocode({ location: latlngDraggable }, (results: any, status: any) => {
          if (status === "OK") {
            if (results[0]) {
              console.log('formated address');
              this.direccionAmante = results[0].formatted_address;

              this.numero = results[0].address_components[0]['long_name'];
              if (this.numero === "S/N") {
                this.numero = "";
              }
              this.calle = results[0].address_components[1]['long_name'];
              this.colonia = results[0].address_components[2]['long_name'];
              this.ciudad = results[0].address_components[3]['long_name'];
              this.estado = results[0].address_components[4]['long_name'];
              this.pais = results[0].address_components[5]['long_name'];
              this.codigopostal = results[0].address_components[6]['long_name'];
            } else {
              window.alert("No results found");
            }
          } else {
            window.alert("Geocoder failed due to: " + status);
          }
        });

        this.enableLocation = true;
      }, (err) => {
        console.log(err);
        this.enableLocation = false;
      });
    //  this.showToast('ubicacion asignada')

      clearTimeout(this.timeoutId);
    } else {
      this.showToast("La ubicación no está encendida");
      this.enableLocation = false;
    }
  }
  // Método para mostrar un mensaje tipo Toast en la aplicación
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
  selectLocation(item:any){
    this.modalController.dismiss(item)
  }

  selectLocationAmante(){
    if(this.direccionAmante === ""){
      
      return
    }
    var item  = {
      direccion:this.direccionAmante,
      lat: this.currentLatAmante,
      lng: this.currentLngAmante,
      type: "Otro"
    }
    this.modalController.dismiss(item)
  }
  
  getIcon(type: string): string {
    switch (type?.toLowerCase()) {
      case 'casa':
        return 'home-outline';
      case 'oficina':
        return 'business-outline';
        case 'trabajo':
          return 'bed-outline';
          case 'otro':
            return 'location-outline';
      default:
        return 'location-outline'; // Ícono genérico
    }
  }
  subscribeToDirecciones() {
    try {
      // Obtener la instancia de Firestore
      const firestore = getFirestore();
  
      // Referencia al documento del usuario actual
      const userRef = doc(firestore, `users/${this.userId}`);
  
      // Escuchar los cambios en tiempo real
      onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          // Obtener el arrayLocations del documento
          const data = docSnap.data();
          this.direccion = data['direccion'];
          this.referencia = data['ref'];
          const direcciones = data['arrayLocations'] || []; // Si no existe, retorna un array vacío
  
          // Invertir el orden de las direcciones
          this.filteredDirecciones = direcciones.reverse();
  
          // Log para depuración
          console.log('Direcciones actualizadas (invertidas):', this.filteredDirecciones);
        } else {
          console.log('No se encontró el documento del usuario.');
        }
      });
    } catch (error) {
      console.error('Error al suscribirse a las direcciones:', error);
    }
  }
  
  deleteDireccion(direccionToDelete: any): void {
    try {
      // Obtener la instancia de Firestore
      const firestore = getFirestore();
  
      // Referencia al documento del usuario actual
      const userRef = doc(firestore, `users/${this.userId}`);
  
      // Eliminar la dirección del array en Firestore
      updateDoc(userRef, {
        arrayLocations: arrayRemove(direccionToDelete)
      }).then(() => {
        console.log('Dirección eliminada con éxito:', direccionToDelete);
      }).catch((error) => {
        console.error('Error al eliminar la dirección:', error);
      });
    } catch (error) {
      console.error('Error en deleteDireccion:', error);
    }
  }

  closeModal() {
    this.modalController.dismiss({
      'dismissed': true,
      'someData': 'example data' // puedes pasar datos al cerrar el modal
    });
  }
  @HostListener('window:popstate', ['$event'])
  dismissModal() {
    this.modalController.dismiss();
  
  }
}

