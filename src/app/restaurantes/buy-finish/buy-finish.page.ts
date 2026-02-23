import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
export interface Restaurant {
    id?: string; // Opcional para el ID
    nombre: string;
    direccion: string;
    prepaTime: number;
    tarifa:string;
    bankNumber:string;
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
@Component({
  selector: 'app-buy-finish',
  templateUrl: './buy-finish.page.html',
  styleUrls: ['./buy-finish.page.scss'],
})
export class BuyFinishPage implements OnInit {
  logo = "https://firebasestorage.googleapis.com/v0/b/the-business-chat.appspot.com/o/8sUJpDeiS4T9GtKnkjbe7s9NpJE2%2Flogo_1742510293393_89842c90-0aab-4bbe-b5df-fa1149e18ccd.webp?alt=media&token=90a21663-7741-4817-a6a9-fd6380ba4ead"
  phoneRest = '5218333861194'; // Teléfono con LADA
  message = 'Gracias!'; // Mensaje predefinido

  constructor(private route: ActivatedRoute,private firestore: AngularFirestore) {
    
  }
restaurant:any
  ngOnInit() {
    // Redirige automático después de 4s
   const id = this.route.snapshot.paramMap.get('id');
   this.restaurant = id
   this.loadrestauranteCache()
  }
 
  nombreRestaurant:any
 async loadrestauranteCache() {
    console.log(this.restaurant);
 
  // Obtiene el documento del restaurante
  this.firestore.doc<Restaurant>(`restaurantes/${this.restaurant}`)
    .valueChanges({ idField: 'id' })
    .subscribe(data => {
      if (data) {
        
       // console.log('Restaurant data:', data);
        this.nombreRestaurant = data.nombre
        this.logo = data.logo
        this.phoneRest = data.telefono
        //this.latRest = data.currentLat
        //this.lngRest = data.currentLng
       

      } else {
        console.warn('No restaurant found with the given ID.');
      }
    });
  }
  openWhatsApp() {
    const url = `https://wa.me/${this.phoneRest}?text=${encodeURIComponent(this.message)}`;
    window.open(url, '_system'); // abre en navegador o en app de WhatsApp
  }
}
