import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { get } from 'scriptjs';
import { environment } from 'src/environments/environment.prod';
declare var google: any

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.page.html',
  styleUrls: ['./search-location.page.scss'],
})
export class SearchLocationPage implements OnInit {
  sugerencias: any[] = [];
  mapsKey = environment.mapsKey
    currentLat: number = 22.243808979785292 ; // Valor por defecto: CDMX
    currentLng: number = -97.85552063787412;
  @ViewChild('placesContainer', { static: true }) placesContainer!: ElementRef;

  searchQuery = ""
  constructor(private toastController: ToastController, private router: Router) {
        
   }

  ngOnInit() {
      get(`https://maps.googleapis.com/maps/api/js?key=`+ this.mapsKey+`&libraries=places`, () => {
          setTimeout(() => {
    
              console.log("La web app está corriendo en un navegador.");
              if (window.AndroidApp) {
    
            
            
            
              } else {
                console.error('AndroidApp interface not available');
              }
         
     
          }, 500);
          //      get(`https://maps.googleapis.com/maps/api/js?key=AIzaSyClzbvzJI0_4Q_1z5Pr0PCI9IdmYuwpMmo&libraries=places`, () => {
                });
  }
  loadGoogleSuggestions(event: any) {
    const inputValue = event.target.value;

    if (!inputValue) {
      this.sugerencias = [];
      return;
    }

    const service = new google.maps.places.AutocompleteService();

    const options: any = {
      input: inputValue,
      types: ['address'],
    };

    // Solo aplicamos location/radius si tenemos coordenadas
    if (this.currentLat && this.currentLng) {
      options.location = new google.maps.LatLng(this.currentLat, this.currentLng);
      options.radius = 15000; // 50km
    }

    service.getPlacePredictions(options, (predictions: any, status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
        this.sugerencias = predictions;
      } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        this.sugerencias = [];
        this.showToast('No se encontraron coincidencias');
      } else {
        this.sugerencias = [];
        console.error('Autocomplete error:', status);
      }
    });
  }

  selectSuggestion(sug: any) {
    const placesService = new google.maps.places.PlacesService(this.placesContainer.nativeElement);
    placesService.getDetails({ placeId: sug.place_id }, (place: any, status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        const location = place.geometry.location;
        this.currentLat = location.lat();
        this.currentLng = location.lng();

        // Obtener componentes de dirección
        const getComponent = (type: string) => {
          const comp = place.address_components.find((c: any) => c.types.includes(type));
          return comp ? comp.long_name : '';
        };

        const direccion = {
          codigopostal: getComponent('postal_code'),
          calle: getComponent('route'),
          colonia: getComponent('sublocality') || getComponent('neighborhood'),
          ciudad: getComponent('locality') || getComponent('administrative_area_level_2'),
          lat: this.currentLat,
          lng: this.currentLng,
          direccion: place.formatted_address,
          origin: 'search-location'
        };

  
         
             // Guarda TODO en localStorage
          localStorage.setItem('getLocationLat', this.currentLat.toString());
          localStorage.setItem('getLocationLng', this.currentLng.toString());
          localStorage.setItem('getLocationCP', direccion.codigopostal);
          localStorage.setItem('getLocationCalle', getComponent('route'));
          localStorage.setItem('getLocationColonia', place.address_components[1].long_name,);
          localStorage.setItem('getLocationCiudad', direccion.ciudad);
          localStorage.setItem('getLocationDireccion', direccion.direccion);
          const test = localStorage.getItem('getLocationOrigin')!
          localStorage.setItem('getLocationOrigin', test);

          this.router.navigate(['/location-confirm-data']);
        this.sugerencias = [];
        this.searchQuery = '';
      } else {
        this.showToast("Algo salió mal al obtener detalles. Intenta de nuevo.");
      }
    });
  }

//   selectSuggestion(sug: any) {
//     console.log(sug)
//     const placesService = new google.maps.places.PlacesService(this.placesContainer.nativeElement);
//     placesService.getDetails({ placeId: sug.place_id }, (place: any, status: any) => {
//       console.log(place)
//       console.log(status)
//       if (status === google.maps.places.PlacesServiceStatus.OK && place) {
//         const location = place.geometry.location;
//         this.currentLat = location.lat();
//         this.currentLng = location.lng();
//         console.log(location.lat())
//         console.log(location.lng())
  
//         // Limpiar
//         var array = {codigopostal: place.address_components[5].long_name ,calle:place.address_components[0].long_name, colonia:place.address_components[1].long_name, ciudad:place.address_components[2].long_name, 
//           lat:this.currentLat, lng: this.currentLng, direccion: place.formatted_address, origin:"search-location"}
//           console.log(array)
//             this.router.navigate(['/location-confirm-data'], {
//           state: { data: array }
//         });
//         this.sugerencias = [];
//         this.searchQuery = '';
//       }else{
//         this.showToast("")
//       }
//     });
//   }
  
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
}
