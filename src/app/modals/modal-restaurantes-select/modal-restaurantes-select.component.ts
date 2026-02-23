import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';

interface Marca {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
  clasificacion: string;
  servicio: string;
  idn:number;
  logo:string;
  estado: string;
  key:string;
  email:string;
  activo:boolean;
  deliveryCost: string;
  deliveryTime: string;
  image:string,
  categoria:string;
  selected?: boolean;
}
@Component({
  selector: 'app-modal-restaurantes-select',
  templateUrl: './modal-restaurantes-select.component.html',
  styleUrls: ['./modal-restaurantes-select.component.scss'],
})
export class ModalRestaurantesSelectComponent  implements OnInit {
  restaurantes: Marca[] = [];
  cacheArray: Marca[] = [];

  constructor(private modalCtrl: ModalController, 
    private firestore: AngularFirestore) {}

  ngOnInit() {
    this.loadRestaurantes();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  loadRestaurantes() {
    this.firestore.collection('restaurantes', ref => ref.orderBy('idn', 'desc'))
      .valueChanges()
      .subscribe((data: any[]) => {
        this.restaurantes = data.map(rest => ({ ...rest, selected: false }));
        this.cacheArray = [...this.restaurantes];
        console.log(this.restaurantes);
      });
  }

  onSearchChange(event: any) {
    const searchTerm = event.target.value?.toLowerCase() || '';
    if (searchTerm.trim() !== '') {
      this.restaurantes = this.cacheArray.filter(restaurant =>
        restaurant.nombre?.toLowerCase().includes(searchTerm)
      );
    } else {
      this.restaurantes = [...this.cacheArray];
    }
  }

  asignarSeleccionados() {
    const seleccionados = this.restaurantes.filter(rest => rest.selected);
    this.modalCtrl.dismiss(seleccionados);
  }
}