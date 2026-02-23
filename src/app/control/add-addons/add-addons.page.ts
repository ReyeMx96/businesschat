import { Component, inject, NgZone, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { arrayUnion, Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-add-addons',
  templateUrl: './add-addons.page.html',
  styleUrls: ['./add-addons.page.scss'],
})
export class AddAddonsPage implements OnInit {
  indexAddonselected = 0 
  items: Array<{ name: string, Precio: number }> = [
    { name: "", Precio: 0 },
   
  ];
  currentname : string = ""
  currenttype : string = ""
  currentmandatory : string = ""
  currentBusiness : string  = "";
  enableShowToppings = false
  // Reemplaza con el ID de tu restaurante
  minSelections = 0
  searchText: string = '';
addonsCopy: any[] = [];     // Para mostrar en la vista y filtrar
maxMultiple = 0
minMultiple = 0
  maxSelections = 0
  nameComplemento = ""
  namedocument: string = 'yourDocumentName';  // Reemplaza con el nombre de tu documento
  addons: any[] = []; // Aquí se almacenarán los addons
  currentAddon: { arrayToppings: any[]; max: number; nameTopping: string; min: number; type:string, maxMultiple: 0, minMultiple: 0 } = { 
    arrayToppings: [], 
    max: 0,
    nameTopping: "",
    maxMultiple: 0,
    minMultiple: 0,
    min: 0,
    type:""
  };
  
  private activatedRoute = inject(ActivatedRoute);

  constructor(private ngZone: NgZone, private firestore: AngularFirestore,
    private alertController: AlertController,  
     private toastCtrl: ToastController,) { }

  ngOnInit() {
    this.currentBusiness = this.activatedRoute.snapshot.paramMap.get('id') as string;

    this.loadAddons();
  }
  cancelComplementosAddProduct(){

  }
  filtrarAddons() {
    const texto = this.searchText.trim().toLowerCase();
    if (!texto) {
      this.addonsCopy = []; // Esto hará que se muestre la lista original (addons)
    } else {
      this.addonsCopy = this.addons.filter((item: any) =>
        item.nameTopping?.toLowerCase().includes(texto)
      );
    }
  }

  // Método para obtener los addons desde Firebase
  loadAddons() {
    if (this.currentBusiness && this.namedocument) {
      this.firestore.doc(`addons/${this.currentBusiness}`)
        .valueChanges()
        .subscribe((doc: any) => {
          if (doc && doc.arrayAddons) {
            this.addons = doc.arrayAddons;
            for(var i = 0 ; i < this.addons.length;i++){
              this.addons[i]['indexProduct'] = i
            }
            this.addonsCopy = [];
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
  
// Mostrar notificación
async showToast(message: string) {
  const toast = await this.toastCtrl.create({
    message,
    duration: 2000,
    color:"primary",
    position: 'top'
  });
  toast.present();
}

  // Métodos para editar, eliminar o agregar complementos
  removeTopping(index: number, data:any) {
    this.addons.splice(index, 1);
    console.log()
    this.saveCustomizationChanges();

  }
  duplicarAddon(index: number) {
    const addonToDuplicate = this.addons[index] ;
    const firestoreTimestamp = Timestamp.now(); 
    this.addons[index]['id'] =  firestoreTimestamp
     // Obtén el addon a duplicar
    const duplicatedAddon = { ...addonToDuplicate }; // Crea una copia del objeto
    this.addons.push(duplicatedAddon); // Agrega el duplicado al final de la lista
    this.saveCustomizationChanges(); // Guarda los cambios
  }
  
  
  editTopping(index: number) {
    // Lógica para editar el complemento
  }

  addItemComplemento() {
    var array = { nameTopping: 'Nombre del complemento', type: 'single', arrayToppings:[], active:true };
    this.addNewAddon(array)
  }
  
  addNewAddon(newAddon: any) {
    console.log(this.currentBusiness);
    const documentRef = this.firestore.collection(`addons`).doc(this.currentBusiness);
  
    // Primero intentamos obtener el documento
    documentRef.get().toPromise().then((docSnapshot) => {
      if (docSnapshot!.exists) {
        // Si el documento ya existe, lo actualizamos
        documentRef.update({
          arrayAddons: arrayUnion(newAddon)
        }).then(() => {
          console.log('New addon added successfully!');
        }).catch((error: any) => {
          console.error('Error adding new addon:', error);
        });
      } else {
        // Si no existe, creamos el documento y añadimos el array
        documentRef.set({
          arrayAddons: arrayUnion(newAddon)
        }).then(() => {
          console.log('New addon added successfully!');
        }).catch((error: any) => {
          console.error('Error creating new addon:', error);
        });
      }
    }).catch((error: any) => {
      console.error('Error checking document existence:', error);
    });
  }
  
  setCurrentSelectedAddon(data:any, index:number){
this.indexAddonselected = index
this.currentAddon = data
this.minMultiple = data['minMultiple'] || 1
this.maxMultiple = data['maxMultiple'] || 999
this.currentname= data['nameTopping']
this.currenttype= data['type']
this.currentmandatory= data['isMandatory']
this.minSelections= data['min'] || 0
this.maxSelections= data['max'] || 0

console.log(this.currentAddon)
if(data.type.length > 0){
 this.enableShowToppings = true
}
console.log(this.currentAddon)
  }


addItem() {
  // Asegúrate de que `arrayToppings` está inicializado
  if (!this.currentAddon.arrayToppings) {
    this.currentAddon.arrayToppings = [];
  }

  // Añadir el nuevo elemento a `arrayToppings`
  this.currentAddon.arrayToppings.push({ name: "", Precio: 0, active:true });
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
      },
      {
        text: 'Agregar',
        handler: (data) => {
          // Llama al siguiente alert para seleccionar si es obligatorio u opcional
          this.showMandatoryAlert(data.nombreComplemento);
        }
      }
    ]
  });

  await alert.present();
}

async showMandatoryAlert(nombreComplemento: string) {
  const alert = await this.alertController.create({
    header: 'Seleccione si el complemento es obligatorio',
    inputs: [
      {
        name: 'isMandatory',
        type: 'radio',
        label: 'Obligatorio',
        value: true,
        checked: true
      },
      {
        name: 'isMandatory',
        type: 'radio',
        label: 'Opcional',
        value: false
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
      },
      {
        text: 'Continuar',
        handler: (data) => {
          // Llama al alert para seleccionar el tipo de complemento, pasando nombre y obligatoriedad
          this.showTipoComplementoAlert(nombreComplemento, data);
        }
      }
    ]
  });

  await alert.present();
}

async showTipoComplementoAlert(nombreComplemento: string, isMandatory: boolean) {
  const alert = await this.alertController.create({
    header: 'Seleccionar tipo de complemento',
    inputs: [
      {
        name: 'tipoComplemento',
        type: 'radio',
        label: 'Single',
        value: 'single',
        checked: true // Opción seleccionada por defecto
      },
      {
        name: 'tipoComplemento',
        type: 'radio',
        label: 'Multiple',
        value: 'multiple'
      },
      {
        name: 'tipoComplemento',
        type: 'radio',
        label: 'Increment',
        value: 'increment'
      }
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Acción cancelada');
        }
      },
      {
        text: 'Confirmar',
        handler: (data) => {
          const firestoreTimestamp = Timestamp.now(); 
          console.log('Complemento agregado:', nombreComplemento, 'Tipo:', data, 'Obligatorio:', isMandatory);
          var array = {
            nameTopping: nombreComplemento,
            type: data,
            arrayToppings: [],
            id:firestoreTimestamp,
            max:0,
            min:0,
            isMandatory: isMandatory
          };
          this.addNewAddon(array);
        }
      }
    ]
  });

  await alert.present();
}
onInputChangeSelectionsMax(event: any) {
  const inputValue = event.target.value;

  console.log('Valor ingresado:', inputValue);
  this.maxSelections = inputValue; // Guardar el valor en la variable si es necesario
  this.currentAddon.max = this.maxSelections

}
onInputChangeSelectionsMin(event: any) {
  const inputValue = event.target.value;

  console.log('Valor ingresado:', inputValue);
  this.minSelections = inputValue; // Guardar el valor en la variable si es necesario
  this.currentAddon.min = this.minSelections

}

onInputChange(event: any) {
  const inputValue = event.target.value;
  console.log('Valor ingresado:', inputValue);
  this.currentname = inputValue; // Guardar el valor en la variable si es necesario
  
  this.currentAddon.nameTopping = this.currentname
}

saveChangeMinMultiple(event:any){
  this.currentAddon.minMultiple = event.target.value
  this.saveCustomizationChanges()
}

saveChangeMaxMultiple(event:any){
  this.currentAddon.maxMultiple = event.target.value
  this.saveCustomizationChanges()
}
saveCurrent(event:any){
  this.currentAddon.type = event.target.value
  this.saveCustomizationChanges()
}
saveCustomizationChanges() {
  // Verificar si algún campo está vacío
  const hasEmptyFields = this.currentAddon.arrayToppings.some(item => 
    !item.name || item.Precio === null || item.Precio === undefined || item.Precio === ""
  );

  if (hasEmptyFields) {
    this.showToast('Por favor completa todos los campos.');
    return; // Salir si hay campos vacíos
  }
  console.log(this.addons)
  console.log(this.currentAddon)
  this.searchText = ""
  // Actualizar solo `arrayToppings` del addon seleccionado
  this.addons[this.indexAddonselected] = { ...this.currentAddon }; 

  // Guardar en Firestore
  const documentRef = this.firestore.collection(`addons`).doc(this.currentBusiness);

  documentRef
    .update({ arrayAddons: this.addons })
    .then(() => {
      this.showToast('Actualizado correctamente.');
    })
    .catch((error: any) => {
      console.error('Error al guardar en Firestore:', error);
    });
}


updateItem(index: number, field: string, event: any) {
  this.ngZone.run(() => {
    // Asegúrate de que `arrayToppings` existe
    this.showToast('itemprecio' + event.detail.value);
    
    if (this.currentAddon.arrayToppings && this.currentAddon.arrayToppings[index]) {
      this.currentAddon.arrayToppings[index][field] = event.detail.value;
    }
  });
}
  deleteItem(index: number) {
    // Asegúrate de que `arrayToppings` existe y que el índice es válido
    if (this.currentAddon.arrayToppings && this.currentAddon.arrayToppings[index]) {
      this.currentAddon.arrayToppings.splice(index, 1);
    }
  }
  
  // Método para alternar el estado activo de un item en el índice especificado
  toggleItemStatus(index: number, event: any) {
    // Asegúrate de que `arrayToppings` existe y que el índice es válido
    if (this.currentAddon.arrayToppings && this.currentAddon.arrayToppings[index]) {
      this.currentAddon.arrayToppings[index].active = event.detail.checked;
    }
  }
  copyItem(index: number) {
    // Obtener el elemento en el índice dado y hacer una copia profunda
    const itemToCopy = { ...this.currentAddon.arrayToppings[index] };
  
    // Asegurarse de que la copia sea un nuevo objeto y no una referencia
    this.currentAddon.arrayToppings.push(itemToCopy);
  }
  

  
  
}
