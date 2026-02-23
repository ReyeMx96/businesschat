import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { arrayUnion } from 'firebase/firestore';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-location-confirm-data',
  templateUrl: './location-confirm-data.page.html',
  styleUrls: ['./location-confirm-data.page.scss'],
})
export class LocationConfirmDataPage implements OnInit {
  lat = 22.2543;
  lng = -97.8685;
  userId = ""

  mapsKey = environment.mapsKey
  staticMapUrl: string | undefined;
  codigoPostal = '89512';
  usuarioLogueado = false
  ubicacion = {
    nombre: '',
    numero: '',
    referencias: '',
    tipo: ''
  };
  programa:any = []
  
  constructor(private toastController:ToastController, private afAuth: AngularFireAuth,private alertController: AlertController, private router: Router,
    private firestore: AngularFirestore) {


  }
  ionViewWillEnter() {

}
  ngOnInit(): void {
    
  this.programa = {};  // o this.direccionData = {}, como quieras llamarlo


  console.log("Datos de localStorage:", this.programa);


  setInterval(() => {

  this.programa['type'] = "casa";
  this.programa['codigopostal'] = localStorage.getItem('getLocationCP') || '';
  this.programa['calle'] = localStorage.getItem('getLocationCalle') || '';
  this.programa['colonia'] = localStorage.getItem('getLocationColonia') || '';
  this.programa['ciudad'] = localStorage.getItem('getLocationCiudad') || '';
  this.programa['direccion'] = localStorage.getItem('getLocationDireccion') || '';
  this.programa['origin'] = localStorage.getItem('getLocationOrigin') || '';
  this.programa['lat'] = localStorage.getItem('getLocationLat') || '';
  this.programa['lng'] = localStorage.getItem('getLocationLng') || '';
  this.programa['numero'] = localStorage.getItem('getLocationNumero') || '';
  

    console.log("checking");
  this.generarMapaEstatico();

  }, 2000);

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
  fallo = false
generarMapaEstatico() {
  if (!this.programa['lat'] || !this.programa['lng']) {
    console.warn('⚠️ Coordenadas inválidas.');
    alert("fallo")
    this.fallo = true;
    return;
  }

  const apiKey = this.mapsKey;
  this.staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${this.programa['lat']},${this.programa['lng']}&zoom=17&size=600x300&markers=color:red%7C${this.programa['lat']},${this.programa['lng']}&key=${apiKey}`;
}

  editarUbicacion() {
    // Aquí puedes abrir un modal con mapa interactivo si quieres permitir mover el marcador
    console.log('Editar marcador presionado');
    const cacheLat = localStorage.getItem("getLocationLat")
    const cacheLng = localStorage.getItem("getLocationLng")
    this.router.navigate(['/getlocation/'+ cacheLat + "/" +  cacheLng], {
      
    });
  }
  setNumber(event:any){
    localStorage.setItem('getLocationNumero', this.programa['numero'])
  this.programa['direccion']  = this.programa['calle'] + " " + this.programa['numero'] + ", " + this.programa['colonia'] + ", " + this.programa['ciudad'] + "."
    localStorage.setItem('getLocationDireccion', this.programa['direccion'])

  }
  async showToast(message:string){
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position:'top',
      color:'primary',
      buttons: [
  
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
        //this.router.navigate(['/login'],{ replaceUrl: true });
         toast.dismiss();
            }
        }
      ]
    });
    toast.present();
  }
  origin : any = ""
  async guardarDireccion() {

    if(!this.programa['ref']){
    
      this.showToast("Porfavor rellena los siguientes datos: Referencia del domicilio")
      return
    }


     if(!this.programa['type']){
    
      this.showToast("Porfavor rellena los siguientes datos: Tipo de edificio ")
      return
    }
    if(!this.programa['numero']){
      this.showToast("Porfavor coloca el numero del domicilio")
      return
    }
    if(!this.programa['nombre']){

      this.showToast("Porfavor colocar un nombre para la ubicación")
      return
    }

    console.log('Guardando dirección:', this.ubicacion);
    // Aquí puedes guardar a Firebase u otro backend
    const alert = await this.alertController.create({

      header: 'Confirmar la dirección'  ,
      message:  this.programa['calle'] + " " + this.programa['numero'] + ", " + this.programa['colonia'] + ", " + this.programa['ciudad'] + ".",
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Aceptar',
          handler: async () => {
            console.log(localStorage.getItem('originNav'))
            if(localStorage.getItem('originNav')!.includes('/marketplace') ){
             if(this.usuarioLogueado === true){
              await this.updateUserLocation();

            }else{
              await this.updateUserLocationCache();

            }

            this.router.navigate(['/tabs/marketplace'],{ replaceUrl: true });
            setTimeout(() => {
            window.location.reload()
              
            }, 4000);
            }
            if(localStorage.getItem('originNav')!.includes('/terminar-pedido')){
             if(this.usuarioLogueado === true){
              await this.updateUserLocation();

            }else{
              await this.updateUserLocationCache();

            }

            this.router.navigate([localStorage.getItem('originNav')!],{ replaceUrl: true });
            }

           if(localStorage.getItem('originNav')! === 'Mandaditos'){
            this.updateUserLocationMandaditos()
            this.router.navigate(['/mandaditos'],{ replaceUrl: true });

           }
          }
        }
      ]
    });
  
    await alert.present();
  }


   async updateUserLocationMandaditos() {
      try {
        const userRef = this.firestore.doc(`users/${this.userId}`);
        
        // Actualizar los campos en Firestore
        await userRef.update({
          arrayLocations: arrayUnion({
            lat: this.programa['lat'],
            lng: this.programa['lng'],
            type:this.programa['type'],
            nombre:this.programa['nombre'],
            cp:this.programa['codigopostal'],
            direccion:this.programa['direccion'],
            ref:this.programa['ref'],
            numero:this.programa['numero'],
            timestamp: new Date().toISOString(), // Agrega un registro de tiempo
          }),
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
          lat: this.programa['lat'],
          lng: this.programa['lng'],
          nameLocation:this.programa['nombre'],
          direccion: this.programa['direccion'],
          ref:this.programa['ref'],
          type:this.programa['type'],
          arrayLocations: arrayUnion({
            lat: this.programa['lat'],
            lng: this.programa['lng'],
            type:this.programa['type'],
            nombre:this.programa['nombre'],
            cp:this.programa['codigopostal'],
            direccion:this.programa['direccion'],
            ref:this.programa['ref'],
            numero:this.programa['numero'],
            timestamp: new Date().toISOString(), // Agrega un registro de tiempo
          }),
        });
    
        console.log('Ubicación del usuario actualizada correctamente.');
      } catch (error) {
        console.error('Error al actualizar la ubicación del usuario:', error);
      }
    }
    async updateUserLocationCache() {
      const array = {
        lat: this.programa['lat'],
        lng: this.programa['lng'],
        type: this.programa['type'],
        nombre: this.programa['nombre'],
        direccion: this.programa['direccion'],
        ref:this.programa['ref'],
        numero:this.programa['numero'],
        cp:this.programa['codigopostal'],
        timestamp: new Date().toISOString(), // Registro de tiempo
      };
    
      // Convertir a JSON y guardar en localStorage
      localStorage.setItem('userLocationCache', JSON.stringify(array));
      console.log('Ubicación guardada en caché:', array);
    }


}
