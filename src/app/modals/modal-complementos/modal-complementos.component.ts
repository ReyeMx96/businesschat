import { Component, inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, NavParams, ToastController } from '@ionic/angular';
import { arrayUnion } from 'firebase/firestore';

@Component({
  selector: 'app-modal-complementos',
  templateUrl: './modal-complementos.component.html',
  styleUrls: ['./modal-complementos.component.scss'],
})
export class ModalComplementosComponent implements OnInit {
  indexAddonselected = 0;
  items: Array<{ name: string; Precio: number }> = [{ name: "", Precio: 0 }];
  currentBusiness: string = "";
  enableShowToppings = false;
  addonsOriginal: any[] = []; // Mantiene el array sin filtrar

  addons: any[] = [];
  currentAddon: { arrayToppings: any[] } = { arrayToppings: [] };
  private activatedRoute = inject(ActivatedRoute);

  constructor(
    private navParams: NavParams,
    private firestore: AngularFirestore,
    private alertController: AlertController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.currentBusiness = this.navParams.get('id');

    this.loadAddons();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  loadAddons() {
    if (this.currentBusiness) {
      this.firestore.doc(`addons/${this.currentBusiness}`)
        .valueChanges()
        .subscribe((doc: any) => {
          if (doc && doc.arrayAddons) {
            this.addons = doc.arrayAddons;
            this.addonsOriginal = [...doc.arrayAddons]; // copia para referencia

          } else {
            console.log('No addons found or field "arrayAddons" missing.');
          }
        }, (error: any) => {
          console.error('Error fetching addons:', error);
        });
    } else {
      console.error('Missing restaurantID or namedocument.');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color: "primary",
      position: 'top',
    });
    toast.present();
  }

  removeTopping(index: number) {
    this.addons.splice(index, 1);
  }

  editTopping(index: number) {
    // Lógica para editar el complemento
  }

  addItemComplemento() {
    var array = { nameTopping: 'Nombre del complemento', type: 'single', arrayToppings: [] };
    this.addNewAddon(array);
  }

  addNewAddon(newAddon: any) {
    const documentRef = this.firestore.collection(`addons`).doc(this.currentBusiness);
    documentRef.update({
      arrayAddons: arrayUnion(newAddon)
    }).then(() => {
      console.log('New addon added successfully!');
    }).catch((error: any) => {
      console.error('Error adding new addon:', error);
    });
  }
  filterAddons(event: any) {
    const query = event.target.value.toLowerCase();
    if (query.trim() === '') {
      this.addons = [...this.addonsOriginal];
      return;
    }
  
    this.addons = this.addonsOriginal.filter(addon =>
      addon.nameTopping.toLowerCase().includes(query)
    );
  }
  
  setCurrentSelectedAddon(data: any, _index: number) {
    const realIndex = this.addonsOriginal.findIndex(a => a === data);
    this.indexAddonselected = realIndex;
    this.currentAddon = data;
    this.modalCtrl.dismiss(this.currentAddon);
    this.enableShowToppings = data.type.length > 0;
    console.log(this.currentAddon);
  }
  

  addItem() {
    if (!this.currentAddon.arrayToppings) {
      this.currentAddon.arrayToppings = [];
    }
    this.currentAddon.arrayToppings.push({ name: "", Precio: 0 });
  }

  async addComplemento() {
    const alert = await this.alertController.create({
      header: 'Agregar Complemento',
      inputs: [
        {
          name: 'nombreComplemento',
          type: 'text',
          placeholder: 'Nombre del complemento'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Acción cancelada');
          }
        }, {
          text: 'Agregar',
          handler: (data) => {
            this.showTipoComplementoAlert(data.nombreComplemento);
          }
        }
      ]
    });

    await alert.present();
  }

  async showTipoComplementoAlert(nombreComplemento: string) {
    const alert = await this.alertController.create({
      header: 'Seleccionar tipo de complemento',
      inputs: [
        { name: 'tipoComplemento', type: 'radio', label: 'Single', value: 'single', checked: true },
        { name: 'tipoComplemento', type: 'radio', label: 'Multiple', value: 'multiple' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary', handler: () => console.log('Acción cancelada') },
        {
          text: 'Confirmar',
          handler: (data) => {
            var array = { nameTopping: nombreComplemento, type: data, arrayToppings: [] };
            this.addNewAddon(array);
          }
        }
      ]
    });

    await alert.present();
  }

  updateItem(index: number, field: string, event: any) {
    if (this.currentAddon.arrayToppings && this.currentAddon.arrayToppings[index]) {
      this.currentAddon.arrayToppings[index][field] = event.detail.value;
    }
  }

  doReorder(event: any) {
    const itemToMove = this.addons.splice(event.detail.from, 1)[0];
    this.addons.splice(event.detail.to, 0, itemToMove);
    event.detail.complete();
  }

  saveCustomizationChanges() {
    const documentRef = this.firestore.collection(`addons`).doc(this.currentBusiness);
    documentRef.update({ arrayAddons: this.addons }).then(() => {
      console.log('Changes saved successfully to arrayAddons!');
      this.showToast('Orden actualizado');
    }).catch((error: any) => {
      console.error('Error saving changes to arrayAddons:', error);
    });
  }
}
