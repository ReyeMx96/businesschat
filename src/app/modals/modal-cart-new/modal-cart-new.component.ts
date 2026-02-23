import { Component, inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { collection, deleteDoc, doc, getFirestore, onSnapshot, Unsubscribe, updateDoc } from 'firebase/firestore';
import { ModalTextComponent } from 'src/app/modals/modal-text/modal-text.component';

export interface Restaurant {
  id?: string; // Opcional para el ID
  nombre: string;
  direccion: string;
  direccionBs: string;
  banner:string;
  uid:string;
  logo:string;
  telefono: string;
  currentLat:Number,
  category:string;
  currentLng:Number,
  key:string
  // Agrega otros campos según sea necesario
}
interface CartItem {
  id:string;
  category:string;
  name: string;      // Nombre del producto
  size: string;      // Tamaño del producto (Ej: Grande, Mediano)
  flavor: string;    // Sabor del producto (Ej: Picante, Suave)
  img: string;
  desc: string;
  price: number;     // Precio del producto
  image: string;     // Ruta de la imagen del producto
  quantity: number;  // Cantidad del producto en el carrito
}
@Component({
  selector: 'app-modal-cart-new',
  templateUrl: './modal-cart-new.component.html',
  styleUrls: ['./modal-cart-new.component.scss'],
})
export class ModalCartNewComponent  implements OnInit {
  itemCount : Number = 0
  nombreRestaurant = ""
  notaPedido = ""
  
  precioTotal  = 0
  restaurantdetails: Restaurant | null | undefined = null;
  private unsubscribeFromCart: Unsubscribe | null = null;
  userId: string = 'uidUser'; // Reemplaza esto con el ID real del usuario
  cartItems = [
    { 
      id:"",
      name: 'Taco de Carne Asada', 
      size: 'Grande', 
      flavor: 'Picante', 
      tptxt: "5.99", 
      price: 5.99, 
      desc:"Desc",
      category: "",
      img: "",
      precioUnit:0,
      image: 'assets/taco.png', 
      quantity: 1 
    },
 
  ];
  devMode = ""
  addCutlery = false;
  restaurant:string = ""
  private activatedRoute = inject(ActivatedRoute);
  constructor(  private navParams: NavParams,private routex: ActivatedRoute, private toastCtrl : ToastController  ,private route: Router,private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,private modalCtrl: ModalController) { }
  async loadrestaurante() {
    
  
  // Obtiene el documento del restaurante
  this.firestore.doc<Restaurant>(`restaurantes/${this.restaurant}`)
    .valueChanges({ idField: 'id' })
    .subscribe(data => {
      if (data) {
        this.restaurantdetails = data; // Asigna los datos si existen
        this.nombreRestaurant = data.nombre
  
     

      } else {
        console.warn('No restaurant found with the given ID.');
        this.restaurantdetails = null; // Maneja el caso como desees
      }
    });
  }
  closeModal(){
    this.modalCtrl.dismiss()
    localStorage.setItem('Nota' + this.nombreRestaurant, this.notaPedido);
  }
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      position:"middle",
      color:"primary",
      duration: 2000
    });
    toast.present();
  }
  async showModaltext(title:string) {
    const modal = await this.modalCtrl.create({
      component: ModalTextComponent,
      componentProps : {title:title}
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        console.log(result.data);
        if (result.data.type === "Ingresa la nota general para el pedido"){
  
        
           
        }


        
      }
      else{
        

      }
    });

    await modal.present();
  }
 session:any
 
  ngOnInit() {
 
    this.restaurant = this.navParams.get('neg')
    
    this.loadrestaurante()
    this.devMode =  this.navParams.get('devMode')
    this.phoneNumber =  this.navParams.get('phone')
    
 
          this.getCartItemsAndCountCache();


    this.afAuth.authState.subscribe(user => {
      if (user) {
        // El usuario está logueado
        console.log('Usuario logueado:', user);
        

        this.userId = user.uid
        // Redirigir a la página principal o donde desees
        //this.getCartItemsAndCount()
   // this.getProjects();
    //this.loadCategories();
      } else {
  
       
        // El usuario no está logueado
        console.log('No hay usuario logueado');
      }
    });
  }
  async getCartItemsAndCount() {
    try {
      const firestore = getFirestore();
      const cartRef = collection(firestore, `users/${this.userId}/cart/${this.restaurant}/items`);

      this.unsubscribeFromCart = onSnapshot(cartRef, (cartSnapshot) => {
        const itemCount = cartSnapshot.size;
        this.itemCount = itemCount;
        
        if (itemCount === 0) {
         // this.route.navigate(['/restaurant-products/' + this.restaurant]);
        }

        const cartItems: any[] = [];
        let precioTotal = 0;

        cartSnapshot.forEach(doc => {
          const productData = doc.data();
          const quantity = productData['cantidad'];
          const price = productData['precio'];

          cartItems.push({
            id: doc.id,
            desc: productData['desc'],
            name: productData['nombre'],
            category: productData['category'],
            price: price,
            precioUnit: price / quantity,
            tptxt:productData['tptxt'],
            img: productData['img'],
            quantity: quantity,
          });

          precioTotal += price * quantity;
        });

        this.cartItems = cartItems;
        this.precioTotal = precioTotal;
        console.log(cartItems)
      }, (error) => {
        console.error('Error al escuchar cambios en el carrito:', error);
      });
    } catch (error) {
      console.error('Error al establecer el listener para el carrito:', error);
    }
  }
  phoneNumber:any
  async getCartItemsAndCountCache() {
    try {
      const firestore = getFirestore();
      const cartRef = collection(firestore, `users/${this.phoneNumber}/cart/${this.restaurant}/items`);

      this.unsubscribeFromCart = onSnapshot(cartRef, (cartSnapshot) => {
        const itemCount = cartSnapshot.size;
        this.itemCount = itemCount;
        
        if (itemCount === 0) {
         // this.route.navigate(['/restaurant-products/' + this.restaurant]);
        }

        const cartItems: any[] = [];
        let precioTotal = 0;

        cartSnapshot.forEach(doc => {
          const productData = doc.data();
          const quantity = productData['cantidad'];
          const price = productData['precio'];

          cartItems.push({
            id: doc.id,
            desc: productData['desc'],
            name: productData['nombre'],
            category: productData['category'],
            price: price,
            precioUnit: price / quantity,
            tptxt:productData['tptxt'],
            img: productData['img'],
            quantity: quantity,
          });

          precioTotal += price * quantity;
        });

        this.cartItems = cartItems;
        this.precioTotal = precioTotal;
        console.log(cartItems)
      }, (error) => {
        console.error('Error al escuchar cambios en el carrito:', error);
      });
    } catch (error) {
      console.error('Error al establecer el listener para el carrito:', error);
    }
  }
  // Método ngOnDestroy para detener el listener
  ngOnDestroy() {
    if (this.unsubscribeFromCart) {
      this.unsubscribeFromCart();
    }
  }

  
  getFormattedPrice(price: number): string {
    return price.toFixed(2);
  }
// Incrementar la cantidad del producto y actualizar en Firestore
increaseQuantity(product: CartItem) {
  product.quantity++;

  // Actualizar en Firestore
  this.updateProductQuantityInDB(product);
}

// Disminuir la cantidad del producto y actualizar en Firestore
async decreaseQuantity(product: CartItem) {
  if (product.quantity > 1) {
    product.quantity--;
    
    // Actualizar la cantidad en Firestore
    await this.updateProductQuantityInDB(product);
  } else if (product.quantity === 1) {
    // Si la cantidad es 1, eliminar el producto de la referencia en Firestore
    await this.removeFromCart(product);
    setTimeout(() => {
      if (this.itemCount === 0){
        this.route.navigate(['/restaurant-products/'+ this.restaurant])

      }

    }, 400);
  }
}

// Método para actualizar la cantidad del producto en Firestore
async updateProductQuantityInDB(product: CartItem) {
  try {
    // Obtener la instancia de Firestore
    const firestore = getFirestore();

    // Referencia al documento del producto en la colección 'cart'
    const productRef = doc(firestore, `users/${this.userId}/cart/${this.restaurant}/items`, product.id);

    // Actualizar la cantidad en Firestore
    await updateDoc(productRef, {
      cantidad: product.quantity
    });

    console.log('Cantidad actualizada en Firestore:', product.quantity);
  } catch (error) {
    console.error('Error al actualizar la cantidad en Firestore:', error);
  }
}

// Método para eliminar el producto del carrito en Firestore
async removeFromCart(product: CartItem) {
  try {
    // Obtener la instancia de Firestore
    const firestore = getFirestore();

    // Referencia al documento del producto en la colección 'cart'
    const productRef = doc(firestore, `users/${this.phoneNumber}/cart/${this.restaurant}/items`, product.id);

    // Eliminar el documento de Firestore
    await deleteDoc(productRef);

    console.log('Producto eliminado del carrito:', product.id);
  } catch (error) {
    console.error('Error al eliminar el producto del carrito:', error);
  }
}


  // Acción al hacer clic en Agregar más artículos
  addMoreItems() {
    // Lógica para agregar más artículos
    this.route.navigate(['/restaurant-products/'+ this.restaurant])

    console.log('Agregar más artículos');
  }
  getInputNota(event:any){
    localStorage.setItem('Nota' + this.nombreRestaurant, this.notaPedido);
  }
goFinish() {
  try {
    localStorage.setItem('Nota' + this.nombreRestaurant, this.notaPedido);
    this.route.navigate([
      '/terminar-pedido/' + this.restaurant + '/' + this.devMode  + "/" + this.session
    ]);
  } catch (error) {
    alert(error)
    console.error('Error al intentar finalizar el pedido:', error);
    // Aquí podrías mostrar una alerta al usuario si quieres
    // Ejemplo: this.alertCtrl.create({ ... });
  }
}

}