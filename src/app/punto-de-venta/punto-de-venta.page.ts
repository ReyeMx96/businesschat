import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActionSheetController, AlertController, MenuController, ModalController, NavController, ToastController } from '@ionic/angular';
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  Unsubscribe,
  updateDoc,
} from 'firebase/firestore';
import { YourCategoryModel } from 'src/app/restaurantes/restaurant-products/restaurant-products.page';
import { ModalCreateComponent } from '../punto-de-venta/modal-create/modal-create.component';
import { ModalTextComponent } from '../modals/modal-text/modal-text.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalCartNewComponent } from '../modals/modal-cart-new/modal-cart-new.component';
import { ModalToppingsComponent } from '../modals/modal-toppings/modal-toppings.component';
import { get, getDatabase, ref } from '@angular/fire/database';
import { ModalCreateOrderComponent } from '../modals/modal-create-order/modal-create-order.component';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { AngularFireAuth } from '@angular/fire/compat/auth';
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

@Component({
  selector: 'app-punto-de-venta',
  templateUrl: './punto-de-venta.page.html',
  styleUrls: ['./punto-de-venta.page.scss'],

})
export class PuntoDeVentaPage implements OnInit, OnDestroy {
  products: any[] = [];
  filtered: any[] = [];
  filterText = '';
  unitFilter: 'all' | 'UNIDAD' | 'GRAMOS' | 'MILILITROS' = 'all';
  pageSize = 8;
  pageIndex = 0;

  firestore = getFirestore();
  private unsub: (() => void) | null = null;
  defaultImage = 'https://via.placeholder.com/250x250.png?text=No+Image';
isComandaVisible = false
  constructor(private afAuth: AngularFireAuth,private routex: Router,private navCtrl: NavController,private route: ActivatedRoute,private firestore2: AngularFirestore ,private actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController,
  private toastCtrl: ToastController,private modalCtrl: ModalController, private menuCtrl : MenuController) {}
async addStock(product: any) {
  const unit = product.unitType || 'UNIDAD';

  const alert = await this.alertCtrl.create({
    header: `Agregar stock (${unit})`,
    message: `Indica la cantidad de ${unit.toLowerCase()}s que deseas agregar al producto "${product.name}".`,
    inputs: [
      {
        name: 'quantity',
        type: 'number',
        placeholder: `Cantidad en ${unit.toLowerCase()}s`,
        min: 1
      }
    ],
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Agregar',
        handler: async (data) => {
          const qty = parseFloat(data.quantity);

          if (isNaN(qty) || qty <= 0) {
            this.showToast('Por favor ingresa un valor válido.', 'warning');
            return;
          }

          const newStock = Number(product.stock) + qty;

          try {
            // Actualizamos el documento en Firestore
            await updateDoc(doc(this.firestore, 'products', product.id), {
              stock: newStock
            });

            // Refrescamos en UI
            product.stock = newStock;
            this.showToast(`Se agregaron ${qty} ${unit.toLowerCase()}s al producto.`, 'success');
          } catch (err) {
            console.error('Error al actualizar stock:', err);
            this.showToast('Ocurrió un error al actualizar el stock.', 'danger');
          }
        }
      }
    ],
    mode: 'ios',
    backdropDismiss: false,
    cssClass: 'alert-glass'
  });

  await alert.present();
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
        this.routex.navigate(['/restaurant-products/'+ this.restaurantId])

      }

    }, 400);
  }
}

// Método para actualizar la cantidad del producto en Firestore
async updateProductQuantityInDB(product: CartItem) {
  try {
    // Obtener la instancia de Firestore
    const firestore = getFirestore();
      var productRef : any

    if(this.usuarioLogueado === true){
      productRef = doc(firestore, `users/${this.userId}/cart/${this.restaurantId}/items`, product.id);

    }else{
   
    }
    // Referencia al documento del producto en la colección 'cart'

    // Actualizar la cantidad en Firestore
    await updateDoc(productRef, {
      cantidad: product.quantity
    });

    console.log('Cantidad actualizada en Firestore:', product.quantity);
  } catch (error) {
    console.error('Error al actualizar la cantidad en Firestore:', error);
  }
}
 usuarioLogueado = false
// Método para eliminar el producto del carrito en Firestore
async removeFromCart(product: CartItem) {
  try {
    // Obtener la instancia de Firestore
    const firestore = getFirestore();
    var productRef : any

    if(this.usuarioLogueado === true){
      productRef = doc(firestore, `users/${this.userId}/cart/${this.restaurantId}/items`, product.id);

    }else{
    
    }
    // Referencia al documento del producto en la colección 'cart'

    // Eliminar el documento de Firestore
    await deleteDoc(productRef);

    console.log('Producto eliminado del carrito:', product.id);
  } catch (error) {
    console.error('Error al eliminar el producto del carrito:', error);
  }
}
  itemCount : Number = 0
   private unsubscribeFromCart: Unsubscribe | null = null;
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
    precioTotal  = 0
  async getCartItemsAndCount() {
    try {
      const firestore = getFirestore();
      const cartRef = collection(firestore, `users/${this.userId}/cart/${this.restaurantId}/items`);

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
payMeth = '';
setPayMeth(data:any){
  this.payMeth = data
}


uidtipster:any
tipster:any
ubicacion:any
phoneNumberAdmin:any
 getFormattedPrice(price: number): string {
    return price.toFixed(2);
  }
   navigate(productName: string, productId: string | undefined, item:any, arrayCategory:any,) {
    if(item.active === true){

    }else{
      this.showToast('El producto está agotado, intenta mas tarde.')
      return
    }
    // Implementa la lógica para navegar a la página de detalles del producto
    console.log(`Navegando a ${productName} con ID: ${productId}`);
    const arraySubcategory = {nombre:""}
    const arraySubsubCategory  = {nombre:""}

    this.presentModal(item, arrayCategory, arraySubcategory,arraySubsubCategory)

  }
searchTerm: string = '';
originalCategories: any[] = [];
  booleanModal = false
  userId=""
  async presentModal(array: any, arrayCategory:any, arraySubcategory: any, arraySubsubcategory:any) {
    if(this.activeRestaurante === false){
      this.showToast("El restaurante esta cerrado")
      return
    }
    if(this.booleanModal === true){
      return
    }
    this.booleanModal = true
    const modal = await this.modalCtrl.create({
      component: ModalToppingsComponent,
      componentProps: 
      { 
      restaurante: this.restaurantId,
      Item: JSON.parse(JSON.stringify(array)),
      Phone:this.tipster || "",
      ItemCategoria: JSON.parse(JSON.stringify(arrayCategory)),
      ItemSubcategoria: JSON.parse(JSON.stringify(arraySubcategory)),
      ItemSubcategoria2: JSON.parse(JSON.stringify(arraySubsubcategory)),
      business: this.restaurantId,
      Uid:this.userId,
      isLogin: this.usuarioLogueado

      },
      breakpoints: [0, 0, 0, 1], // 0 = minimizado, 0.5 = mitad, 0.8 = 80%, 1 = pantalla completa
      initialBreakpoint: 1 // Puedes ajustar el valor inicial según prefieras
      // cssClass: 'custom-modal-class'  // Add your custom class here
    });
    this.booleanModal = false

    await modal.present();

    await modal.onDidDismiss().then(() => {
      // Limpiar datos después del cierre del modal
 
    });

  }

  tkUser = ""
  phid = ""
    arrayUtils: any[] = [];

     orderItems = [
    { name: 'Simple T-Shirt', price: 100, qty: 1 },
    { name: 'Shirt 12 pack', price: 1000, qty: 1 },
    { name: 'Air Jordan Blue Sky', price: 880, qty: 1 },
  ];

  products2 = [
    { name: 'Lazer Blue Nike', price: 880, image: 'assets/img/shoe1.png' },
    { name: 'Whi Nversion', price: 1200, image: 'assets/img/shoe2.png' },
    { name: 'Nike Varor', price: 900, image: 'assets/img/shoe3.png' },
    { name: 'Pizza Pepperoni', price: 120, image: 'assets/img/pizza1.png' },
    { name: 'Ensalada', price: 80, image: 'assets/img/salad.png' },
  ];

  get subtotal() {
    return this.orderItems.reduce((acc, i) => acc + i.price * i.qty, 0);
  }

  addToOrder(product: any) {
    this.orderItems.push({ ...product, qty: 1 });
  }

  removeItem(item: any) {
    this.orderItems = this.orderItems.filter(i => i !== item);
  }

async finalizarPedido(){
  this.arrayUtils = [ ]
  if(this.payMeth === "Transferencia"){

  }else{
    if(this.cuantoPaga === 0 || this.cuantoPaga < this.precio){
      this.showToast('Ingresa la cantidad correcta con la que paga el cliente')
      return
    }
  }

  this.modal = await this.modalCtrl.create({
    component: ModalCreateOrderComponent,
    cssClass: 'modal-add',
    canDismiss:true,
    backdropDismiss:true,
     initialBreakpoint:1,
      breakpoints:[0, 0.25, 1, 0.1],
     componentProps: {
       type: this.uidtipster,
       admin: this.phoneNumberAdmin,
        suc: this.suc,
        token: this.tkUser,
        phonenumberid: this.phid,
        costoEnvio: this.costoEnvio,
        notageneral: this.Ind,
        neg: this.restaurantId,
        metodoPago: this.payMeth.replace("Pago En ", ""),
        cuantopaga: this.cuantoPaga,
        devMode:"A domicilio",
        phone: this.tipster,

   }
  
  });
  await this.modal.present();


  await this.modal.onDidDismiss().then((e:any)=>{
    console.log(e.data)
    if(e.data === "finished"){
      this.digitalist = false

    }else{
      this.digitalist = true

    }


   // this.sendMessage(e.data['Cmd'],e.data['TypeAns'],e.data['Src'],e.data['Pro'])

   
 })
}

  hideCreatePedido(){
  this.showingAns = true
  this.digitalist = false
}

   toggleFeature() {
    console.log('Feature enabled:', this.isFeatureEnabled);
    this.getMenu()

  }
   menuLength = 0;
    dbase = getDatabase()
  isFeatureEnabled:any
    arraySlider: any[] = [];
    menuPromociones: any[] = [];
  getMenu() {
    const db = this.dbase; // Modular
    const menuRef = ref(db, `ruta/${this.phoneNumberAdmin}/Menu`);
  
    get(menuRef)
      .then(snapshot => {
        const res = snapshot.val();
        const array = [];
  
        for (const i in res) {
          array.push(res[i]);
        }
  
        if (res === null) {
          // this.showToast('we are null');
        } else {
          // this.showToast('we get information');
        }
  
        this.menuPromociones = array;
        this.menuLength = this.menuPromociones.length;
  
        for (let i = 0; i < this.menuPromociones.length; i++) {
          this.arraySlider.push(this.menuPromociones[i]);
  
          const item = this.menuPromociones[i];
  
          if (item['Sabores'] === true) {
            if (item['SaborList'] !== null) {
              if (+item['SaborList'][0]['Precio'] > 0) {
                item['Precio'] = +item['SaborList'][0]['Precio'];
  
                if (!this.isFeatureEnabled) {
                  item['Disc'] = 0;
                }
  
                if (+item['Disc'] > 0) {
                  item['DescFinal'] = item['Precio'] - (item['Precio'] / 100 * +item['Disc']);
                } else {
                  item['DescFinal'] = item['Precio'];
                }
              } else if (item['Tamaño'] === true) {
                item['Precio'] = +item['TamañoList'][0]['Precio'];
                item['DescFinal'] = item['Precio'];
              }
            }
          }
  
          if (item['Tamaño'] === true) {
            if (!this.isFeatureEnabled) {
              item['Disc'] = 0;
            }
  
            item['Precio'] = +item['TamañoList'][0]['Precio'];
  
            if (+item['Disc'] > 0) {
              item['DescFinal'] = item['Precio'] - (item['Precio'] / 100 * +item['Disc']);
            } else {
              item['DescFinal'] = item['Precio'];
            }
          }
  
          if (item['Tamaño'] === false && item['Sabores'] === false) {
            if (!this.isFeatureEnabled) {
              item['Disc'] = 0;
            }
  
            item['Precio'] = +item['Precio'];
  
            if (+item['Disc'] > 0) {
              item['DescFinal'] = item['Precio'] - (item['Precio'] / 100 * +item['Disc']);
            } else {
              item['DescFinal'] = item['Precio'] - (item['Precio'] / 100 * +item['Disc']);
            }
          }
        }
  
        console.log(this.menuPromociones);
      })
      .catch(err => {
        console.error(err);
        // this.onFailAlert('Error', err);
      });
  }
  navigate1(productName: string, productId: string | undefined, item:any, arrayCategory:any, arraySubcategory : any) {
    if(item.active === true){

    }else{
      this.showToast('El producto está agotado, intenta mas tarde.')
      return
    }
    // Implementa la lógica para navegar a la página de detalles del producto
    console.log(`Navegando a ${productName} con ID: ${productId}`);
    const arraySubsubCategory  = {nombre:""}

    this.presentModal(item, arrayCategory, arraySubcategory, arraySubsubCategory)

  }
 async showCartModal(){
    this.modal = await this.modalCtrl.create({
      component: ModalCartNewComponent,
      cssClass: 'modal-add',
      canDismiss:true,
      backdropDismiss:true,
       initialBreakpoint:1,
        breakpoints:[0, 0, 1, 0.1],
       componentProps: {
         type: this.uidtipster,
         neg:this.restaurantId,
         admin: this.phoneNumberAdmin,
         phone: this.tipster,
         devMode:"A domicilio",
         direccion:this.ubicacion,
         costoEnvio: this.costoEnvio,
         typePay: this.payMeth,
         
     }
    
    });
    await this.modal.present();
 
 
    await this.modal.onDidDismiss().then((e:any)=>{
      console.log(e.data)
      if(this.digitalist === true){

      }else{
      this.crearPedido()

      }

     // this.sendMessage(e.data['Cmd'],e.data['TypeAns'],e.data['Src'],e.data['Pro'])
 
     
   })
 
  }
  precio = 0
  setCuantoPaga(index:any){
    if(index === "Exacto" ){
      this.cuantoPaga = this.precio + this.costoEnvio

    }else{
      this.cuantoPaga = index 

    }
  }

  restaurantdetails: Restaurant | null | undefined = null;
async openActions(p: any) {
  const actionSheet = await this.actionSheetCtrl.create({
    header: `Acciones para ${p.name}`,
    cssClass: 'custom-action-sheet',
    buttons: [
      {
        text: 'Editar',
        icon: 'create-outline',
        handler: () => this.openModal(p),
      },
      {
        text: 'Agregar stock',
        icon: 'add-circle-outline',
        handler: () => this.addStock(p),
      },
      {
        text: 'Eliminar',
        icon: 'trash-outline',
        role: 'destructive',
        handler: () => this.deleteProduct(p.id),
      },
      {
        text: 'Cancelar',
        icon: 'close-outline',
        role: 'cancel',
      },
    ],
  });

  await actionSheet.present();
}
async showToast(message: string, color: string = 'primary') {
  const toast = await this.toastCtrl.create({
    message,
    duration: 2000,
    color,
    position: 'bottom'
  });
  await toast.present();
}

  ngOnInit() {

  // URL RAW (encodeada)
  const rawUrl = this.routex.url;
  console.log("RAW:", rawUrl);

  // Decodifica (%3F → ?, %3D → =)
  const decodedUrl = decodeURIComponent(rawUrl);
  console.log("Decoded:", decodedUrl);

  let args = null;

  if (decodedUrl.includes("?args=")) {
    args = decodedUrl.split("?args=")[1];
  }

  console.log("Args recibido:", args);
   if("inventario" === args){
    setTimeout(() => {
    this.showInventario()
    
    }, 1000);  

    }


    this.loadProducts();
      this.loadrestaurante()
        this.restaurantId = this.route.snapshot.paramMap.get('business')!.toString().toLowerCase();
    setTimeout(() => {
        this.crearPedido()
    }, 2000);
  this.afAuth.authState.subscribe(user => {
      if (user) {
        // El usuario está logueado
        console.log('Usuario logueado:', user);
        

        this.userId = user.uid
        // Redirigir a la página principal o donde desees
        this.getCartItemsAndCount()
        this.usuarioLogueado = true
   // this.getProjects();
    //this.loadCategories();
      } else {
        this.usuarioLogueado = false
  
        // El usuario no está logueado
        console.log('No hay usuario logueado');
      }
    });

  }
  nombreRestaurant = ""
  async loadrestaurante() {
    
  
  // Obtiene el documento del restaurante
  this.firestore2.doc<Restaurant>(`restaurantes/${this.restaurantId}`)
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
  ngOnDestroy() {
    if (this.unsub) this.unsub();
  }

  // 🔹 Cargar productos en tiempo real
  loadProducts() {
    const q = query(collection(this.firestore, 'products'), orderBy('createdAt', 'desc'));
    this.unsub = onSnapshot(q, (snap) => {
      const arr: any[] = [];
      snap.forEach((d) => arr.push({ id: d.id, ...(d.data() as DocumentData) }));
      this.products = arr;
      this.applyFilter();
    });
  }

  // 🔹 Filtros
  applyFilter() {
    const text = this.filterText.toLowerCase().trim();
    this.filtered = this.products.filter((p) => {
      const matchesText =
        !text ||
        (p.name || '').toLowerCase().includes(text) ||
        (p.category || '').toLowerCase().includes(text) ||
        (p.sku || '').toLowerCase().includes(text);
      const matchesUnit = this.unitFilter === 'all' || p.unitType === this.unitFilter;
      return matchesText && matchesUnit;
    });
    this.pageIndex = 0;
  }

  changeUnitFilter(ev: any) {
    this.unitFilter = ev.detail.value;
    this.applyFilter();
  }

  pagedProducts() {
    const start = this.pageIndex * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }
  totalPages() {
    return Math.ceil(this.filtered.length / this.pageSize);
  }
  nextPage() {
    if (this.pageIndex + 1 < this.totalPages()) this.pageIndex++;
  }
  prevPage() {
    if (this.pageIndex > 0) this.pageIndex--;
  }

  // 🔹 Abrir modal programáticamente
  async openModal(product: any = null) {
    const modal = await this.modalCtrl.create({
    component: ModalCreateComponent,
    cssClass: 'side-modal',
    componentProps: { editingProduct: product || null },
    breakpoints: [0, 1],
    initialBreakpoint: 1,
    showBackdrop: true,
    backdropDismiss: true
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role === 'saved' && data) {
      console.log('Producto guardado/actualizado:', data);
      // ya se actualiza solo gracias al listener
    }
  }

   getDiaActualDesdeFirestore(timestamp: Timestamp): string {
      const fecha = timestamp.toDate(); // Convierte el timestamp a Date
      const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      return diasSemana[fecha.getDay()];
    }
     getHoraActualDesdeFirestore(timestamp: Timestamp): string {
      const fecha = timestamp.toDate(); // Convertir Firestore Timestamp a Date
      return fecha.toTimeString().slice(0, 5); // Formato "HH:mm"
    }
    
    restaurantId = ""
      itemCountCategories = 0
      categories: YourCategoryModel[] | null = null;
isPosVisible = true
isInventarioVisible = false
      showPos(){
      this.isPosVisible = true
        this.isInventarioVisible = false

      }

   showInventario(){
      this.isPosVisible = false

        this.isInventarioVisible = true
      }
        
      showComanda() {
         this.isPosVisible = false

        this.isInventarioVisible = false
        
  const texto = this.restaurantId; // tu string dinámico
  this.navCtrl.navigateForward(`/comanda/${texto}`);
}
         showProductos(){
        
      }
segmentValue = ""

 async loadCategorias() {
    console.log(this.restaurantId);
    const timestampFirestore = Timestamp.now();
    console.log(this.getDiaActualDesdeFirestore(timestampFirestore)); // Ejemplo: "Miércoles"
    var currentDay = this.getDiaActualDesdeFirestore(timestampFirestore)
    var currentHora = this.getHoraActualDesdeFirestore(timestampFirestore)
    // Obtiene la colección de categorías del restaurante
    this.firestore2.collection<YourCategoryModel>(`businesses/${this.restaurantId}/categories`)
      .valueChanges({ idField: 'id' })
      .subscribe((data:any) => {
        if (data && data.length) {
          console.log('Categories:', data);

          setTimeout(() => {
            this.itemCountCategories = 1;

              }, 100);

          this.categories = data; // Asigna los datos si existen
          this.originalCategories = JSON.parse(JSON.stringify(this.categories));
            for (const category of this.categories!) {
          console.log('Category:', category);

          // Productos de la categoría principal
          if (category.products && Array.isArray(category.products)) {
            for (const product of category.products) {
              this.checkProductFlagsAndSchedule(product, category, currentDay, currentHora);
            }
          }

          // Productos de las subcategorías
          if (category.subcategorias && Array.isArray(category.subcategorias)) {
            for (const sub of category.subcategorias) {
              console.log('Subcategoria:', sub);

              if (sub.products && Array.isArray(sub.products)) {
                for (const product of sub.products) {
                  this.checkProductFlagsAndSchedule(product, category, currentDay, currentHora);
                }
              }
            }
          }
        }

          
     console.log(this.categories)
        } else {
        setTimeout(() => {
          this.itemCountCategories = 0;
              
            }, 1000);
          console.warn('No categories found for the given restaurant.');
          this.categories = null; // Maneja el caso como desees
        }
      });
  }
  onSegmentChange(event: any) {
    const selectedCategory = event.detail.value;
  
    const selectedIndex = this.categories?.findIndex(category => category.name === selectedCategory) ?? -1;
  
 
  }

    showingAns = true;
  // 🔹 Eliminar producto
  async deleteProduct(id: string) {
    if (!confirm('¿Eliminar este producto?')) return;
    await deleteDoc(doc(this.firestore, 'products', id));
  }
      digitalist = false;

filterProducts(event?: any) {
  const term = this.searchTerm.trim().toLowerCase();

  if (!term) {
    // Si no hay texto, restaura las categorías originales
    this.categories = JSON.parse(JSON.stringify(this.originalCategories));
    return;
  }

  // 🔍 Filtrar productos y subniveles
  this.categories = this.originalCategories.map(cat => {
    const filteredCat = { ...cat };

    filteredCat.products = cat.products.filter((p:any) =>
      p.nombre.toLowerCase().includes(term)
    );

    // Subcategorías
    if (cat.subcategorias) {
      filteredCat.subcategorias = cat.subcategorias
        .map((sub:any) => ({
          ...sub,
          products: sub.products.filter((p:any) =>
            p.nombre.toLowerCase().includes(term)
          ),
          subcategorias: sub.subcategorias
            ? sub.subcategorias.map((subsub:any) => ({
                ...subsub,
                products: subsub.products.filter((p:any) =>
                  p.nombre.toLowerCase().includes(term)
                )
              }))
            : []
        }))
        .filter((sub:any) => sub.products.length > 0 || sub.subcategorias.length > 0);
    }

    return filteredCat;
  }).filter(cat =>
    cat.products.length > 0 || (cat.subcategorias && cat.subcategorias.length > 0)
  );
}

    async crearPedido(){


    this.loadCategorias()
    setTimeout(() => {
    this.showingAns = false
    this.digitalist = true
    }, 1000);

  

  }
activeExclusivo = false
activeRestaurante = true
activePromo = false
activeDestacado = false
private convertToMinutes(hora: string): number {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}
private checkProductFlagsAndSchedule(product: any, category: any, currentDay: string, currentHora: string) {
  // 1. Si no existe dias → producto activo
  if (!product.dias || !Array.isArray(product.dias) || product.dias.length === 0) {
    product.active = true;
    return;
  }

  // 2. Buscar el día actual
  const diaActual = product.dias.find((dia: any) => dia.name === currentDay);

  // Si no existe el día → inactivo
  if (!diaActual) {
    product.active = false;
    return;
  }

  // 3. Si está deshabilitado → inactivo
  if (!diaActual.selected) {
    product.active = false;
    return;
  }

  // 4. Si no hay horario → activo
  if (!diaActual.startTime || !diaActual.endTime) {
    product.active = true;
    return;
  }

  // 5. Comparar horarios
  const horaActualMin = this.convertToMinutes(currentHora);
  const horaInicioMin = this.convertToMinutes(diaActual.startTime);
  const horaFinMin = this.convertToMinutes(diaActual.endTime);

  if (horaActualMin >= horaInicioMin && horaActualMin <= horaFinMin) {
    product.active = true;
  } else {
    product.active = false;
  }

    if (product.Disc > 0) {
    this.activePromo = true;
    category.show = true;
  }
  if (product.exclusivo === true) {
    this.activeExclusivo = true;
    category.show = true;
  }
  if (product.destacado === true) {
    this.activeDestacado = true;
    category.show = true;
  }
}
 notaGral = '';
  suc: any;
  modal: any;
  cuantoPaga = 0
  Ind:any;
  costoEnvio = 0
async textComponent(type:any){

  this.modal = await this.modalCtrl.create({
    component: ModalTextComponent,

    cssClass: 'modal-middle',
    canDismiss:true,
    backdropDismiss:true,
     initialBreakpoint:1,
      breakpoints:[0, 0.1, 0.1, 0.1],
     componentProps: {
       Type: type,
  
   }
  
  });
  await this.modal.present();


  await this.modal.onDidDismiss().then((e:any)=>{
    console.log(e.data)
    if(e.data.Type === "Cuanto paga"){
      this.cuantoPaga = e.data.Text
    }
    if(e.data.Type === "Agregar una nota"){
 
    this.Ind = e.data.Text

    }


   // this.sendMessage(e.data['Cmd'],e.data['TypeAns'],e.data['Src'],e.data['Pro'])

   
 })

}
}
