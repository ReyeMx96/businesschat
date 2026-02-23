import { Component, HostListener, Input, OnInit } from '@angular/core';
import { getFirestore,doc, updateDoc, arrayUnion,arrayRemove,collection, addDoc  } from 'firebase/firestore';
import { Router } from '@angular/router';
import { AlertController, ModalController, NavParams, ToastController } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
 interface Item {
  Precio:number;
  Disc: string;
  Tamano:string;
  Sabor:string
}
@Component({
  selector: 'app-modal-toppings',
  templateUrl: './modal-toppings.component.html',
  styleUrls: ['./modal-toppings.component.scss'],
})
export class ModalToppingsComponent implements OnInit {
  userId: string = 'uidUser'; // Reemplaza esto con el ID real del usuario
  uid: string | null = null;
  arrayItem: any = {};
  ingredientCount: { [key: string]: number } = {};

  arrayItemCategoria : any
  arrayItemSubCategoria : any
  arrayItemSubCategoria2:any
  textToppings = ""
  img: string = "";
  addons: any[] = []; // Aquí se almacenarán los addons
  ingredientesSeleccionados: any[] = [];
  precioToppingMasProducto: number = 0;
  @Input() value: any; // Aquí recibes el array u otros datos que pases
  restaurant: string | null = null;
  countAdd: number = 1;
  modal: string = "";
  nombre: string = "";
  desc: string = "";
  currentBusiness: string | null = null;  
  arrayToppingsSelected: any[] = [];
  optionListTamano: any[] = [];
  hasTamanoState: boolean = false;
  hasSabores: boolean = false;
  radiofieldSelected : boolean = false;
 checkfieldSelected : boolean = false;
  
  enableConfirm: boolean = false;
  Ind: string = '';
  phoneUser: string = "";
  optionListsabores: any[] = [];
  textToppingsIncrement = ""
  saborSelected: string = '';
  tamanoSelected: string = '';
  precio: number = 0;
  typeCart: string = "";
  writeNota: boolean = false;
  saborSelectedBoolean: boolean = false;
  tamanoSelectedBoolean: boolean = false;
  // Tamaños del producto
tamanos: any[] = [
  { label: 'Chico', value: 'chico' },
  { label: 'Mediano', value: 'mediano' },
  { label: 'Grande', value: 'grande' },
  { label: 'Litro', value: 'litro' }
];

// Sabores del producto
sabores: any[] = [
  { label: 'Piña', value: 'pina' },
  { label: 'Fresa', value: 'fresa' },
  { label: 'Uva', value: 'uva' },
  { label: 'Mango', value: 'mango' }
];

// Ingredientes extras
ingredientesExtras: any[] = [
  { label: 'Chamoy +$0', value: 'chamoy' },
  { label: 'Gomitas +$0', value: 'gomitas' },
  { label: 'Leche Condensada +$15', value: 'leche-condensada' },
  { label: 'Caramelo +$15', value: 'caramelo' }
];

// Ingredientes opcionales
ingredientesOpcionales: any[] = [
  { label: 'Chamoy', value: 'chamoy' },
  { label: 'Gomitas', value: 'gomitas' },
  { label: 'Leche Condensada', value: 'leche-condensada' },
  { label: 'Caramelo', value: 'caramelo' }
];
// Control de visibilidad de cada acordeón
accordionStatus: any = {
  tamano: true,          // Mostrar la sección de tamaño
  sabor: true,           // Mostrar la sección de sabor
  ingredientes: true,    // Mostrar la sección de ingredientes opcionales
  ingredientesExtras: true // Mostrar la sección de ingredientes extras
};
dismissed = false
  constructor(
    private router: Router,
    private modalController: ModalController,
    private navParams: NavParams,
    private toastCtrl: ToastController,
    private alertController: AlertController,
    private afAuth: AngularFireAuth, 
    private firestore: AngularFirestore,
  ) {}
  showNota(){
    this.writeNota = true
  }

  actualizarPrecio(event: any, item: any, index: number) {
    console.log(item);
    this.arrayItem['addons'][index]['unlocked'] = true;
    this.radiofieldSelected = true;
    const ingrediente = event.detail.value;
  
    // Asegurar que addons[index] tiene su propio objeto de conteo de ingredientes
    if (!this.arrayItem['addons'][index]['ingredientCount']) {
      this.arrayItem['addons'][index]['ingredientCount'] = {};
    }
  
    const previousTopping = this.arrayItem['addons'][index]['selectedTopping'];
    if (previousTopping) {
      this.arrayItem['addons'][index]['ingredientCount'][previousTopping.name]--;
      if (this.arrayItem['addons'][index]['ingredientCount'][previousTopping.name] <= 0) {
        delete this.arrayItem['addons'][index]['ingredientCount'][previousTopping.name];
      }
    }
  
    this.arrayItem['addons'][index]['selectedTopping'] = ingrediente;
    this.arrayItem['addons'][index]['ingredientCount'][ingrediente.name] =
      (this.arrayItem['addons'][index]['ingredientCount'][ingrediente.name] || 0) + 1;
  
    this.textToppings = this.generarTextoToppings();
  
    if (previousTopping) {
      this.precioToppingMasProducto -= +previousTopping.Precio;
    }
    this.precioToppingMasProducto += +ingrediente.Precio;
  
    console.log('Precio total:', this.precioToppingMasProducto);
    console.log('Toppings seleccionados:', this.textToppings);
  }

actualizarPrecioCheck(event: any, item: any, index: number, ingrediente: any) {
  const checked = event.detail.checked;
  const max = +(ingrediente?.maxMultiple ?? 100);
  const min = +(ingrediente?.minMultiple ?? 0);
  const isMandatory = ingrediente?.isMandatory ?? false;

  // Asegurar estructura
  if (!this.arrayItem['addons'][index]['ingredientCount']) {
    this.arrayItem['addons'][index]['ingredientCount'] = {};
  }

  const ingredientCount: { [key: string]: number } = this.arrayItem['addons'][index]['ingredientCount'];
  const seleccionadosActuales = Object.values(ingredientCount).reduce((a, b) => a + b, 0);

  // 🚫 Si intenta seleccionar y ya alcanzó el máximo, cancelar
  if (checked && seleccionadosActuales >= max) {
    event.target.checked = false;
    this.presentarAlerta(`Solo puedes elegir hasta ${max} opciones.`);
    return;
  }

  // Lógica de check/uncheck
  if (checked) {
    this.ingredientesSeleccionados.push(item);
    this.precioToppingMasProducto += +item.Precio;
    this.arrayItem['addons'][index]['ingredientCount'][item.name] =
      (this.arrayItem['addons'][index]['ingredientCount'][item.name] || 0) + 1;
  } else {
    const itemIndex = this.ingredientesSeleccionados.findIndex(i => i.id === item.id);
    if (itemIndex > -1) {
      this.ingredientesSeleccionados.splice(itemIndex, 1);
      this.precioToppingMasProducto -= +item.Precio;
    }

    if (this.arrayItem['addons'][index]['ingredientCount'][item.name] > 0) {
      this.arrayItem['addons'][index]['ingredientCount'][item.name]--;
      if (this.arrayItem['addons'][index]['ingredientCount'][item.name] <= 0) {
        delete this.arrayItem['addons'][index]['ingredientCount'][item.name];
      }
    }
  }

  // ✅ Verificación final para desbloquear según regla
  if (isMandatory) {
    const actualizados = checked ? seleccionadosActuales + 1 : seleccionadosActuales - 1;

    if (actualizados >= min && actualizados <= max) {
      this.arrayItem['addons'][index]['unlocked'] = true;
      console.log("196");
    } else {
      this.arrayItem['addons'][index]['unlocked'] = false;
      console.log("199");
    }
  } else {
    console.log("206");
    this.arrayItem['addons'][index]['unlocked'] = true;
  }

  this.checkfieldSelected = true;
  this.textToppings = this.generarTextoToppings();
  console.log('Precio total:', this.precioToppingMasProducto);
  console.log('Toppings seleccionados:', this.textToppings);
}

private generarTextoToppings(): string {
  return this.arrayItem['addons']
    .map((addon: { ingredientCount?: Record<string, number>, nameTopping?: string }) => {
      if (addon.ingredientCount) {
        const nameAddon = addon.nameTopping ?? '';
        const ingredientes = Object.keys(addon.ingredientCount)
          .map(ingredient => `(${addon.ingredientCount![ingredient]}) ${ingredient}`)
          .join(", ");
        return `${nameAddon}: ${ingredientes}`; // 👈 añadimos el nombre del grupo
      }
      return '';
    })
    .filter((text: string) => text !== '')
    .join(" | ");
}

async presentarAlerta(mensaje: string) {
  const alert = await this.alertController.create({
    header: 'Límite alcanzado',
    message: mensaje,
    buttons: ['OK'],
  });

  await alert.present();
}


  
  // actualizarPrecioCheck(event: any, item: any, index: number, ingrediente:any) {
  //   console.log(+ingrediente.maxMultiple)
  //   const checked = event.detail.checked;
  //   this.checkfieldSelected = true;
  //   this.arrayItem['addons'][index]['unlocked'] = true;
  
  //   if (!this.arrayItem['addons'][index]['ingredientCount']) {
  //     this.arrayItem['addons'][index]['ingredientCount'] = {};
  //   }
  
  //   if (checked) {
  //     this.ingredientesSeleccionados.push(item);
  //     this.precioToppingMasProducto += +item.Precio;
  //     this.arrayItem['addons'][index]['ingredientCount'][item.name] =
  //       (this.arrayItem['addons'][index]['ingredientCount'][item.name] || 0) + 1;
  //   } else {
  //     const itemIndex = this.ingredientesSeleccionados.findIndex(ingrediente => ingrediente.id === item.id);
  //     if (itemIndex > -1) {
  //       this.ingredientesSeleccionados.splice(itemIndex, 1);
  //       this.precioToppingMasProducto -= +item.Precio;
  //     }
  
  //     if (this.arrayItem['addons'][index]['ingredientCount'][item.name] > 0) {
  //       this.arrayItem['addons'][index]['ingredientCount'][item.name]--;
  //       if (this.arrayItem['addons'][index]['ingredientCount'][item.name] <= 0) {
  //         delete this.arrayItem['addons'][index]['ingredientCount'][item.name];
  //       }
  //     }
  //   }
  
  //   this.textToppings = this.generarTextoToppings();
  
  //   console.log('Precio total:', this.precioToppingMasProducto);
  //   console.log('Toppings seleccionados:', this.textToppings);
  // }
  
  // Método para generar el texto de los toppings correctamente

  
  
  

// Objeto para llevar un registro de la cantidad de cada ingrediente

incrementarCantidad(ingredienteRadio: any, ingredienteItem: any, index: number) {
  if (ingredienteRadio.isBlocked) return; // Si está bloqueado, no hacer nada

  if (ingredienteItem.isMandatory === true) {
    if (ingredienteItem.cantidad >= ingredienteItem.min) {
      this.showToast('Seleccionaste el máximo permitido');
      return;
    }

    // Bloquea el botón temporalmente
    ingredienteRadio.isBlocked = true;

    // Incrementar cantidad y actualizar precio
    ingredienteItem.cantidad = (ingredienteItem.cantidad || 0) + 1;
    ingredienteRadio.cantidad = (ingredienteRadio.cantidad || 0) + 1;
    this.precioToppingMasProducto = +this.precioToppingMasProducto + +ingredienteRadio.Precio;

    // Actualizar el contador del ingrediente seleccionado
    if (this.ingredientCount[ingredienteRadio.name]) {
      this.ingredientCount[ingredienteRadio.name]++;
    } else {
      this.ingredientCount[ingredienteRadio.name] = 1;
    }

    // Actualizar el texto de toppings con la cantidad
    this.textToppingsIncrement = Object.keys(this.ingredientCount)
      .map(ingredient => {
        const count = this.ingredientCount[ingredient];
        return `(${count}) ${ingredient}`;
      })
      .join(", ");

    if (+ingredienteItem.cantidad === +ingredienteItem.min) {
      this.arrayItem['addons'][index]['unlocked'] = true;
    } else {
      this.arrayItem['addons'][index]['unlocked'] = false;
    }

    // Desbloquea el botón después de 300 ms
    setTimeout(() => {
      ingredienteRadio.isBlocked = false;
    }, 300);
  } else {
    if (ingredienteItem.cantidad >= ingredienteItem.max) {
      this.showToast('Seleccionaste el máximo permitido');
      return;
    }

    // Bloquea el botón temporalmente
    ingredienteRadio.isBlocked = true;

    // Incrementar cantidad y actualizar precio
    ingredienteItem.cantidad = (ingredienteItem.cantidad || 0) + 1;
    ingredienteRadio.cantidad = (ingredienteRadio.cantidad || 0) + 1;
    this.precioToppingMasProducto = +this.precioToppingMasProducto + +ingredienteRadio.Precio;

    // Actualizar el contador del ingrediente seleccionado
    if (this.ingredientCount[ingredienteRadio.name]) {
      this.ingredientCount[ingredienteRadio.name]++;
    } else {
      this.ingredientCount[ingredienteRadio.name] = 1;
    }

    // Actualizar el texto de toppings con la cantidad
    this.textToppingsIncrement = Object.keys(this.ingredientCount)
      .map(ingredient => {
        const count = this.ingredientCount[ingredient];
        return `(${count}) ${ingredient}`;
      })
      .join(", ");
   if (+ingredienteItem.cantidad === +ingredienteItem.max) {
      this.arrayItem['addons'][index]['unlocked'] = true;
    } else {
      this.arrayItem['addons'][index]['unlocked'] = false;
    }

    // Desbloquea el botón después de 300 ms
    setTimeout(() => {
      ingredienteRadio.isBlocked = false;
    }, 300);
  }
}

  
decrementarCantidad(ingredienteRadio: any, ingredienteItem: any, index: number) {

  if (ingredienteRadio.isBlocked) return;
  if (ingredienteRadio.cantidad <= 0) return;

  this.arrayItem['addons'][index]['unlocked'] = false;
  ingredienteRadio.isBlocked = true;

  // Decrementar cantidades
  ingredienteItem.cantidad--;
  ingredienteRadio.cantidad--;
  this.precioToppingMasProducto -= +ingredienteRadio.Precio;

  // Actualizar contador
  if (this.ingredientCount[ingredienteRadio.name] > 0) {
    this.ingredientCount[ingredienteRadio.name]--;

    // Eliminar si queda en 0
    if (this.ingredientCount[ingredienteRadio.name] === 0) {
      delete this.ingredientCount[ingredienteRadio.name];
    }
  }

  // Actualizar texto
  this.textToppingsIncrement = Object.keys(this.ingredientCount)
    .map(ingredient => `(${this.ingredientCount[ingredient]}) ${ingredient}`)
    .join(", ");

  setTimeout(() => {
    ingredienteRadio.isBlocked = false;
  }, 500);
}

  
  

  
  addCount(){
    if(this.countAdd === 10){
      
      return
    }
    this.precio = 0
   
     this.countAdd = +this.countAdd + 1
     this.precio = this.precioToppingMasProducto * this.countAdd
   
   }
  removeCount(){
    if(this.countAdd === 1){
      return
    }

   this.countAdd = this.countAdd - 1
   this.precio = this.precioToppingMasProducto * +this.countAdd
 
 }



 goToCart(){
  this.modalController.dismiss()
  this.router.navigate(['/carrito'])
 }


 
 async addToCart() {
if(this.arrayItem['addons']){
  for(var i = 0; i < this.arrayItem['addons'].length; i ++){

    if(this.arrayItem['addons'][i]['unlocked'] === true){
    
    }else if(this.arrayItem['addons'][i]['isMandatory'] === true){
      this.showToast("No se puede avanzar debes seleccionar todos los campos requeridos")
      return
    }else{
    
    }
    }
}else{

}

 // this.arrayItem['addons'][index]['unlocked'] = true


  try {
    // Obtener la instancia de Firestore
    const firestore = getFirestore();
    const product = this.arrayItem; // Obtenemos el producto actual
    var restaurantOrderRef :any
    console.log(this.userId)
    console.log(this.uid)
    if(this.isLogin === true){
      console.log("loginkkkkkkkkkkk")

     restaurantOrderRef = collection(firestore, `users/${this.uid}/cart/${this.restaurant}/items`);
    }else{
      console.log("loginxxxxxxxxxxxx")


     restaurantOrderRef = collection(firestore, `users/${this.phoneUser}/cart/${this.restaurant}/items`);

    }
    // Referencia correcta: coleccion 'cart' dentro de 'users', y luego subcoleccion 'items' bajo el documento del restaurante
    
    // Datos del pedido que se van a enviar
    const pedidoData = {
      nombre: product.nombre,   // Suponiendo que 'nombre' es un campo en tu arrayItem
      precio: this.precioToppingMasProducto,   // Precio del producto
      cantidad: this.countAdd,
      category: this.arrayItemCategoria['name'] + " > " + this.arrayItemSubCategoria['nombre'] + " > " + this.arrayItemSubCategoria2['nombre'] ,
      tptxt:this.textToppings + " " + this.textToppingsIncrement,
      img: product.imageLowRes,              // Puedes manejar la cantidad según necesites
      fechaAgregado: new Date(), // Fecha en la que se agrega al carrito
    };

    // Agregar el pedido a la referencia del restaurante (subcolección 'items')
    this.dismissed = true

    await addDoc(restaurantOrderRef, pedidoData);
    this.modalController.dismiss();

    this.showToast('Producto agregado al carrito');
    console.log('Producto agregado al carrito correctamente.');
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    this.showToast('Error al agregar al carrito');
  }
}
  // Método para obtener los addons desde Firebase
  loadAddons() {
    console.log(this.currentBusiness);
    if (this.currentBusiness) {
      this.firestore.doc(`addons/${this.currentBusiness}`)
        .valueChanges()
        .subscribe((doc: any) => {
          if (doc && doc.arrayAddons) {
            this.addons = doc.arrayAddons;
            console.log(this.addons)
  
            // Comparación y actualización de addons en arrayItem['addons']
            for (var i = 0; i < this.addons.length; i++) {
              var timestamp = this.addons[i]['id']
              console.log(this.addons[i])
              const uniqueTimestamp = timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1e6);
              this.addons[i]['id'] = uniqueTimestamp
     
              for (var x = 0; x < this.arrayItem['addons'].length; x++) {
     
                var timestamp = this.arrayItem['addons'][x]['id']
            
                if(timestamp.seconds){
                  const uniqueTimestamp = timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1e6);
                
                this.arrayItem['addons'][x]['id'] = uniqueTimestamp
                console.log(this.addons[i]['id'])
                console.log(uniqueTimestamp)
                if (this.arrayItem['addons'][x]['id'] === this.addons[i]['id']) {
                  this.arrayItem['addons'][x] = this.addons[i];
                  console.log("matching");
                }
                }else{
                      console.log("pasando por else")
                }
            
                //const uniqueTimestamp = timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1e6);
                //console.log(uniqueTimestamp)
            
              }
            }
  
            // Detectar addons faltantes
            const missingAddons = this.arrayItem['addons'].filter(
              (addonItem: any) => !this.addons.some(
                (addon) =>
                  addon.nameTopping === addonItem.nameTopping &&
                  addon.type === addonItem.type
              )
            );
  
            // Eliminar los addons faltantes de this.arrayItem['addons']
            if (missingAddons.length > 0) {
              console.log("Addons encontrados en arrayItem['addons'] pero no en addons:", missingAddons);
  
              this.arrayItem['addons'] = this.arrayItem['addons'].filter(
                (addonItem: any) => this.addons.some(
                  (addon) =>
                    addon.nameTopping === addonItem.nameTopping &&
                    addon.type === addonItem.type
                )
              );
  
              console.log("Array actualizado de addons:", this.arrayItem['addons']);
            } else {
              console.log("Todos los addons en arrayItem['addons'] coinciden con addons.");
            }
  
            console.log(this.addons);
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
  

 // Toast helper
 async showToast(message: string) {
  const toast = await this.toastCtrl.create({
    message,
    position: "middle",
    duration: 2000,
    cssClass: 'toast-white-text'
  });
  toast.present();
}

ionViewDidEnter(){

  

}
isLogin:any
  ngOnInit() {
    this.restaurant = JSON.parse(JSON.stringify(this.navParams.get('restaurante')));
  this.arrayItem = JSON.parse(JSON.stringify(this.navParams.get('Item')));
  console.log(this.arrayItem['addons']);
  this.arrayItemCategoria = JSON.parse(JSON.stringify(this.navParams.get('ItemCategoria')));
  this.arrayItemSubCategoria = JSON.parse(JSON.stringify(this.navParams.get('ItemSubcategoria')));
  this.arrayItemSubCategoria2 = JSON.parse(JSON.stringify(this.navParams.get('ItemSubcategoria2')));
  this.uid = this.navParams.get('Uid')
  this.isLogin = this.navParams.get('isLogin')
  
 
  this.currentBusiness = this.navParams.get('business')
  this.phoneUser = this.navParams.get('Phone')
  console.log(this.currentBusiness)
  console.log(this.uid)
  console.log(this.currentBusiness)
  console.log(this.arrayItemSubCategoria2)
  console.log(this.arrayItemSubCategoria)
  console.log(this.arrayItemCategoria)
  console.log(this.arrayItem)
  console.log(this.restaurant)
  console.log(this.arrayItem['addons'])
    console.log(this.arrayItemCategoria)
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // El usuario está logueado
        console.log('Usuario logueado:', user);
               this.userId =  this.phoneUser

        // Redirigir a la página principal o donde desees
   // this.getProjects();
    //this.loadCategories();
      } else {
        this.userId =  this.phoneUser
        // El usuario no está logueado
        console.log('No hay usuario logueado');
      }
    });
    const modalState = { modal: true, desc: 'fake state for our modal' };
    history.pushState(modalState, "null");
    this.loadAddons()
    // this.typeCart = this.navParams.get('TypeCart');
    // this.hasSabores = this.arrayItem['Sabores'];
    // this.hasTamanoState = this.arrayItem['Tamaño']; 
    const auth = getAuth(); // Usa getAuth() para obtener la instancia de autenticación
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.uid = user.uid;
        //this.getUsers();
      } else {
        setTimeout(() => {
          if (this.typeCart === 'michelotes') {
            this.closeModal();
            this.router.navigate(['/login/auth/'], { replaceUrl: true });
          }
        }, 2000);
      }
    });
    this.precio = +this.arrayItem['precio'];
    this.precioToppingMasProducto = +this.arrayItem['precio']
    // if (this.hasSabores) {
    //   this.optionListsabores = this.arrayItem['SaborList'].map((sabor: any) => ({
    //     ...sabor,
    //     Tamano: sabor['Tamaño']
    //   }));
    // }

    // if (this.hasTamanoState) {
    //   this.optionListTamano = this.arrayItem['TamañoList'].map((tamano: any) => ({
    //     ...tamano,
    //     Tamano: tamano['Tamaño']
    //   }));
    // }

    this.nombre = this.arrayItem['Nombre'];
    this.desc = this.arrayItem['Desc'];
    this.img = this.arrayItem['Img'];
  }

  closeModal(){
    this.modalController.dismiss()
    
   }  
  // Resto de tu código...
 
  @HostListener('window:popstate', ['$event'])
  dismissModal() {
    this.modalController.dismiss();
    this.dismissed = true
  }
}