import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { get } from 'scriptjs';
import { environment } from 'src/environments/environment.prod';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

declare var google: any;

@Component({
  selector: 'app-mapa-lluvia',
  templateUrl: './mapa-lluvia.page.html',
  styleUrls: ['./mapa-lluvia.page.scss'],
})
export class MapaLluviaPage implements OnInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  latitudTampico = 22.23297316172514;
  longitudTampico = -97.854961346833;
  map: any;
  apiKey = environment.mapsKey;

  weatherData$!: Observable<any[]>;
  markers: any[] = [];

  constructor(private ngZone: NgZone, private firestore: AngularFirestore) {
    get(`https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`, () => {
    console.log('Google Maps cargado');
    this.loadMap();

  });
}

ngOnInit() {
  // Esperar a que el script esté listo

    setTimeout(() => {
          this.weatherData$ = this.firestore.collection('weather').valueChanges({ idField: 'id' });

    this.weatherData$.subscribe((data) => {
      console.log('Weather en tiempo real:', data);
      this.updateWeatherMarkers(data);
    });
    }, 3000);

  
}

  updateWeatherMarkers(data: any[]) {
    // 🔹 Limpia marcadores anteriores
    this.markers.forEach((m) => m.setMap(null));
    this.markers = [];

    data.forEach((doc) => {
      // 🔹 Extraemos coordenadas
      const lat = doc.location?.lat;
      const lng = doc.location?.lon;

      // 🔹 Extraemos valores de clima
      const values = doc.weather?.data?.values || {};
      const precipitation = values.rainIntensity ?? 0;
      const windSpeed = values.windSpeed ?? 0;
      const cloudCover = values.cloudCover ?? 0; // porcentaje de nubes
      console.log(values)
      console.log(precipitation)
      console.log(windSpeed)
      // 🔹 Elegir ícono según condiciones
      let iconUrl = '';
      if (precipitation > 0) {
        iconUrl = 'https://images.vexels.com/media/users/3/240750/isolated/preview/e0ddbbd2af6ff3c1e17e00e8a95f7acd-icono-de-naturaleza-de-nube-de-lluvia.png'; // lluvia
      } else if (windSpeed > 15) {
        iconUrl = 'https://static.vecteezy.com/system/resources/thumbnails/041/638/725/small/wind-symbol-forcast-wheather-isolate-illustration-gradient-design-free-png.png'; // viento fuerte
      }  else if (cloudCover > 50) {
          iconUrl = 'https://static.vecteezy.com/system/resources/previews/023/258/075/non_2x/weather-icon-cloudy-sky-icon-free-png.png'; // nublado
        }       else {
        iconUrl = 'https://cdn-icons-png.flaticon.com/512/869/869869.png'; // clima normal
      }

      // 🔹 Crear marcador
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map,
        icon: {
          url: iconUrl,
          scaledSize: new google.maps.Size(120, 120),
        },
        opacity: 0.5, // 50% de transparencia
        title: `Lluvia: ${precipitation} mm/h | Viento: ${windSpeed} km/h`,
      });

      this.markers.push(marker);
    });
  }

  loadMap() {
    if (!google || !google.maps) {
      console.error('Google Maps no está cargado.');
      return;
    }

    const mapOptions = {
      center: { lat: this.latitudTampico, lng: this.longitudTampico },
      zoom: 13,
      disableDefaultUI: true,
      gestureHandling: 'greedy',
         styles: [
         {
        featureType: "road",
        elementType: "geometry",
        stylers: [
          { color: "#e4dbd4" } // color rojizo para las calles
        ]
      }
      ,
         {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [{ color: "#fffaf3" }] // terreno/espacios entre calles
      }
      
    ]
    
    };

    this.ngZone.runOutsideAngular(() => {
      this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
    });
  }


}
