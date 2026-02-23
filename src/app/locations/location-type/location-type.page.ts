import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location-type',
  templateUrl: './location-type.page.html',
  styleUrls: ['./location-type.page.scss'],
})
export class LocationTypePage implements OnInit {


  constructor(private router: Router) { 

       const nav = this.router.getCurrentNavigation();
  

  }

  ngOnInit() {
    setTimeout(() => {
      if (window.AndroidApp) {
      
        alert("requestpermisionlocation")

      } else {
       
        console.error('AndroidApp interface not available');
      }
      
    }, 1000);
  }
  async useCurrentLocation() {
   
      
     this.router.navigate(['/getlocation/22.235910/-97.856534']);
   
  }

  chooseManualLocation() {
// alert("requestpermisionlocatiox")

 this.router.navigate(['/search-location']);
    // Redirige al mapa o selector de ubicación manual
    console.log('Seleccionar ubicación manual');
  }
}
