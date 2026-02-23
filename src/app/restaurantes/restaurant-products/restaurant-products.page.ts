import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { getFirestore,doc, updateDoc, arrayUnion,arrayRemove,collection, addDoc ,getDocs,onSnapshot, Unsubscribe, Timestamp, setDoc, serverTimestamp } from 'firebase/firestore';
import { IonContent, MenuController, ModalController, ToastController } from '@ionic/angular';
import { ModalToppingsComponent } from 'src/app/modals/modal-toppings/modal-toppings.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ModalLoginComponent } from 'src/app/modals/modal-login/modal-login.component';
export interface Restaurant {
  id?: string; // Opcional para el ID
  nombre: string;
  direccion: string;
  banner:string;
  forceClose: boolean;
  activo: boolean;
  prepaTime: number;
  Hashtags?: string[];
  logo:string;
  telefono: string;
  [key: `${string}Apertura`]: string; // Permitir propiedades dinámicas para horarios de apertura
  [key: `${string}Cierre`]: string;  
  key : string;
  descuentos:any;
  promo:any;
  currentLat:number | undefined;
  currentLng:number | undefined;
  // Agrega otros campos según sea necesario
}
interface Restaurant2 {
  id?: string;
  currentLat?: number | undefined;
  currentLng?: number | undefined;
  distance?: number; // Campo opcional para la distancia
  costoEnvio?: number; // Campo opcional para la distancia
  
}
interface Marca {
  id?: string;
  nombre?: string;
  direccion?: string;
  telefono?: string;
  
  costoEnvio?: number;
  currentLat?: number; // Hacerlo opcional
  currentLng?: number; // Hacerlo opcional
  correo?: string;
  distance?: number;
  clasificacion?: string;
  servicio?: string;
  estado?: string;
  distancia?: string;
  email?: string;
  key?: string;
  activo?: boolean;
  deliveryCost?: string;
  deliveryTime?: string;
  image?: string;
  banner?: string;
}

interface UserData {
  lat:string;
  lng:string;
  direccion?: string; // Marca como opcional si puede no estar presente
  // Agrega otros campos según sea necesario
}
export interface YourProductModel {
  imageLowRes:string;
  id?: string; // Opcional para el ID del producto
  nombre: string;
  Precio:string;
  active:boolean;
  destacado:boolean;
  exclusivo:boolean;
  Nombre: string;
  Disc: number;
  DescFinal:string;
  Img: string;
  desc:string;
dias:any;
  precio: number; // O cualquier otro campo que necesites
}
interface PlatformConfig {
  horario: string;
  zonaHoraria: string;
  codigoPais: string;
  costoPorKmRemota: number,
  costoPorKmEstandar: number,
  distanciaBase: number,
  platformActive:boolean;
  tarifaBase: 0,
  costoNegocioAltoRiesgo:number,
  distanciaPedido: number,
  divisa: string;
  transferencia: boolean;
  tarifalluvia:boolean;
  habilitarCostoCondicionesClimaticas: boolean,
  efectivo: boolean;
  costoCondicionesClimaticas:string;
  pagoEnLinea: boolean;
  formatoTiempo: string;
  formatoFecha: string;
  opcionesPago: []
}
export interface YourCategoryModel {
  id?: string; // Opcional para el ID
  name: string;
  DescFinal:string;
  Img: string;
  desc:string;
  Precio:string;
  Nombre: string;
  show:boolean;
  exclusivo:boolean;
  promo:boolean;
  active:boolean;
  Disc: number;
  subcategorias:any;
  descripcion?: string; // Agrega otros campos según sea necesario
  products?: YourProductModel[]; // Agrega aquí la propiedad products
}
@Component({
  selector: 'app-restaurant-products',
  templateUrl: './restaurant-products.page.html',
  styleUrls: ['./restaurant-products.page.scss'],
})
export class RestaurantProductsPage implements OnInit {
  restaurantId: string = "";
  modal : any
  segmentValueSub : string = ""
  indexSubcategory = 0
  promo = false
  segmentValueSubBoolean = false
  itemCountCategories : Number = 0
  private unsubscribeFromCart: Unsubscribe | null = null;
  currentLatUser : number | undefined = 0;
  currentLngUser : number | undefined = 0;
  currentLatBs: number | undefined;
  currentLngBs : number | undefined = 0;
  @ViewChildren('subcategoryRow', { read: ElementRef }) subcategoryRows!: QueryList<ElementRef>;
  @ViewChildren('productRow', { read: ElementRef }) productRows!: QueryList<ElementRef>;
  @ViewChildren('h3Element') h3Elements!: QueryList<ElementRef>;
  forceClose = true
  currentHashtags : any
  businessactive = true
  activePromo = false
  prepaTime = 0
  activeExclusivo = false
  activeDestacado = false
  private observer!: IntersectionObserver;
  restaurantes: Marca[] = [
  
    // Agrega más marcas según sea necesario
  ];
  cartItemsCache : any = []
  precioTotal :Number = 0
  devMode = "A domicilio"
  arrayPromos:number = 0;
  subcategories : any = []
  cartItems = [
    { 
      name: 'Taco de Carne Asada', 
      size: 'Grande', 
      flavor: 'Picante', 
      price: 5.99, 
      image: 'assets/taco.png', 
      quantity: 1 
    },
    { 
      name: 'Burrito de Pollo', 
      size: 'Mediano', 
      flavor: 'Suave', 
      price: 7.99, 
      image: 'assets/burrito.png', 
      quantity: 1 
    }
  ];
  costoEnvio : number | undefined = 0
  distancia : number | undefined = 0
  segmentValue: string = '';
  public scrollTop = 0; // Controla el scroll actual
  identificadorRestaurant : string = ""
  @ViewChild('contentRef') contentRef!: IonContent;

  booleanModal = false
  nombreRestaurant : string = ""
  logo : string = ""
  banner : string = ""
  usuarioLogueado = true
  activeRestaurante = false
  restaurant: Restaurant | null | undefined = null;
  categories: YourCategoryModel[] | null = null;
  userId: string = 'uidUser'; // Reemplaza esto con el ID real del usuario
  // Array de productos
  direccion = ""
  
  products = [
    {
      id: 1,
      name: "Pizza Margarita Margarita Margarita Margarita Margarita  Margarita" ,
      image: "https://via.placeholder.com/100",
      price: "$10.00",
      desc:"Contiene ingredientes etc etc etc ingringredientes etc etc etc ingr ingredientes etc etc etc ingr ingredientes etc etc etc ingringredientes etc etc etc ingr ingredientes etc etc etc ingredientes descripcion esta es la decripcion de ingredientes"
    },
    {
      id: 2,
      name: "Pasta Boloñesa",
      image: "https://via.placeholder.com/100",
      price: "$12.00",
      desc:"Contiene ingredientes etc etc etc ingredientes descripcion esta es la decripcion de ingredientes"

    },
    {
      id: 3,
      name: "Ensalada César",
      image: "https://via.placeholder.com/100",
      
      price: "$8.00",
      desc:"Contiene ingredientes etc etc etc ingredientes descripcion esta es la decripcion de ingredientes"

    },
    {
      id: 4,
      name: "Tiramisu",
      image: "https://via.placeholder.com/100",
      price: "$6.00",
      desc:"Contiene ingredientes etc etc etc ingredientes descripcion esta es la decripcion de ingredientes"

    },
  ];
  platformConfig: PlatformConfig = {
    horario: '',
    zonaHoraria: '',
    transferencia: false,
    efectivo: false,
    tarifalluvia:false,
    pagoEnLinea: false,
    codigoPais: '',
    distanciaPedido: 0,
    platformActive: false,
    costoPorKmRemota : 0,
    divisa: '',
    costoPorKmEstandar:0,
    distanciaBase: 0,
    costoNegocioAltoRiesgo: 0,
    tarifaBase: 0,
    habilitarCostoCondicionesClimaticas: false,
    costoCondicionesClimaticas : "",
  opcionesPago: [],

    formatoTiempo: '24 horas',
    formatoFecha: 'dd/MM/yyyy'
  };
  itemCount : Number = 0
  showBack = false
  constructor( private menuCtrl: MenuController,private afAuth: AngularFireAuth, private firestore: AngularFirestore,private route: ActivatedRoute,
    private router: Router,private modalCtrl:ModalController,private toastCtrl : ToastController) {

      setTimeout(() => {
      this.showBack = true
      }, 1300);

     }

     disableMenu() {
      this.menuCtrl.enable(false);
    }
  
    // Activar el menú
    enableMenu() {
      this.menuCtrl.enable(true);
    }
  async showToast(message: string) {
  const toast = await this.toastCtrl.create({
    message,
    position: "top",
    duration: 2000,
    cssClass: 'toast-white-text'
  });
  toast.present();
}


    async getCartItemsAndCountCache() {
      try {
        // Obtener la instancia de Firestore
        const firestore = getFirestore();
      
        // Referencia a la subcolección "items" dentro de "cart" del restaurante del usuario actual
        const cartRef = collection(firestore, `users/${this.phoneNumber}/cart/${this.restaurantId}/items`);
      
        // Escuchar cambios en tiempo real en la subcolección "items"
        onSnapshot(cartRef, (cartSnapshot) => {
          // Contar cuántos documentos hay en la subcolección
          const itemCount = cartSnapshot.size;
          this.itemCount = itemCount
          // Crear un array temporal para almacenar los productos del carrito
          const cartItems: any[] = [];
          let precioTotal = 0; // Inicializar la variable para el total del precio
      
          // Recorrer los documentos de la subcolección y extraer la información del producto
          cartSnapshot.forEach(doc => {
            const productData = doc.data();
            const quantity = productData['cantidad'];
            const price = productData['precio'];
  
            cartItems.push({
              id: doc.id,
              nombre: productData['nombre'],
              name: productData['nombre'],
              category: productData['category'],
              precio: price,
              price: price,
              img: productData['img'],
              fechaAgregado : productData['fechaAgregado'],
              tptxt : productData['tptxt'],
              quantity: quantity,
              cantidad: quantity,
            });
            // Sumar el precio total por la cantidad de cada producto
            precioTotal += price * quantity;
          });
      
          // Asignar los productos al array que usa *ngFor
          this.cartItemsCache = cartItems;
      
          // Asignar el total del precio
          this.precioTotal = precioTotal;
      
          // Mostrar en consola el estado actual
          console.log('Número de elementos en el carrito:', itemCount);
          console.log('Total del precio del carrito:', precioTotal);
        });
      } catch (error) {
        console.error('Error al obtener los elementos del carrito:', error);
      }
    }
  async getCartItemsAndCount() {
    try {
      // Obtener la instancia de Firestore
      const firestore = getFirestore();
    
      // Referencia a la subcolección "items" dentro de "cart" del restaurante del usuario actual
      const cartRef = collection(firestore, `users/${this.userId}/cart/${this.restaurantId}/items`);
    
      // Escuchar cambios en tiempo real en la subcolección "items"
      onSnapshot(cartRef, (cartSnapshot) => {
        // Contar cuántos documentos hay en la subcolección
        const itemCount = cartSnapshot.size;
        this.itemCount = itemCount
        // Crear un array temporal para almacenar los productos del carrito
        const cartItems: any[] = [];
        let precioTotal = 0; // Inicializar la variable para el total del precio
    
        // Recorrer los documentos de la subcolección y extraer la información del producto
        cartSnapshot.forEach(doc => {
          const productData = doc.data();
          const quantity = productData['cantidad'];
          const price = productData['precio'];

          cartItems.push({
            id: doc.id,
            name: productData['nombre'],
            price: price,
            quantity: quantity,
          });
          // Sumar el precio total por la cantidad de cada producto
          precioTotal += price * quantity;
        });
    
        // Asignar los productos al array que usa *ngFor
        this.cartItems = cartItems;
    
        // Asignar el total del precio
        this.precioTotal = precioTotal;
    
        // Mostrar en consola el estado actual
        console.log('Número de elementos en el carrito:', itemCount);
        console.log('Total del precio del carrito:', precioTotal);
      });
    } catch (error) {
      console.error('Error al obtener los elementos del carrito:', error);
    }
  }

  searchQuery = ""
  getFormattedPrice(price: number): string {
    return price.toFixed(2);
  }
  segmentChanged(event: any) {
    const selectedValue = event.detail.value;
    console.log('Segmento seleccionado:', selectedValue);
    this.devMode = selectedValue
    // Puedes hacer lo que desees con el valor seleccionado aquí
  }

  session:any
  phoneNumber:any
 ngOnInit() {
  this.route.params.subscribe(params => {
    this.restaurantId = params['id'];
    this.session = this.route.snapshot.queryParamMap.get('token');
this.migrarAddonsUrbanWings()

    console.log('Restaurant ID:', this.restaurantId);
    console.log('Session token:', this.session);


  });


    this.menuCtrl.enable(false)
    this.afAuth.authState.subscribe(async user  => {
      if (user) {
        // El usuario está logueado
        console.log('Usuario logueado:', user);
        this.userId = user.uid
        this.loadConfig()
        await this.getCartItemsAndCount()
        await this.loadrestaurante()
        await this.loadCategorias()
        this.usuarioLogueado = true
      
        // Redirigir a la página principal o donde desees
   // this.getProjects();
    //this.loadCategories();
      } else {
        console.log(this.session)
        console.log("No hay usuario logueado, verificando token temporal")
      if (this.session !== null) {
      // Referencia al doc de tokenTemporal
        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")

      const tokenDocRef = this.firestore.collection('tokenTemporal').doc(this.session);
      tokenDocRef.get().subscribe(doc => {
        if (!doc.exists) {
          console.log('Token no existe o inválido');
          // Aquí podrías redirigir o mostrar mensaje de error
          return;
        }

        const data: any = doc.data();
        this.phoneNumber = data.phone;
        const tokenTimestamp: any = data.tst.toDate(); // convertir Firestore Timestamp a JS Date
        const now = new Date();
        const diffMinutes = (now.getTime() - tokenTimestamp.getTime()) / (1000 * 60);

        if (diffMinutes > 30) {
          console.log('Token expirado');
          // Aquí podrías redirigir o mostrar mensaje de token expirado
        } else {
          console.log('Token válido, puedes continuar');
          this.showToast('Token válido, puedes continuar');
          // Cargar los datos del restaurante o permitir acceso
        }

          this.userId = this.phoneNumber;
        this.getCartItemsAndCountCache()
        
        this.loadrestaurante()
        this.loadCategorias()
        this.usuarioLogueado = false
    
        // El usuario no está logueado
        console.log('No hay usuario logueado');
      });
    } else {
    let uid = localStorage.getItem('uidUrl');
      console.log("No hay sessioxxxxxxxxxxxxxxxxxxxxxn")
    if (!uid) {
      // Si no existe, generamos uno nuevo
      const generar25Digitos = (): string => {
        const digits = new Uint8Array(25);
        let result = '';
        while (result.length < 25) {
          crypto.getRandomValues(digits);
          for (let i = 0; i < digits.length && result.length < 25; i++) {
            const v = digits[i];
            if (v < 250) {
              result += (v % 10).toString();
            }
          }
        }
        return result;
      };
      uid = generar25Digitos();
      localStorage.setItem('uidUrl', uid);
      this.userId = uid
      this.phoneNumber = uid
        this.getCartItemsAndCountCache()
        
        this.loadrestaurante()
        this.loadCategorias()
        this.usuarioLogueado = false
      console.log('UID generado nuevo:', uid);
    } else {
      console.log('UID recuperado del localStorage:', uid);
      this.userId = uid
      this.phoneNumber = uid


        this.getCartItemsAndCountCache()
        
        this.loadrestaurante()
        this.loadCategorias()
        this.usuarioLogueado = false

    }
    }

      
      }
    });
    // Obtén el valor del parámetro 'id' de la ruta
  
  }


  originalCategories:any = []
filterItems(event: any) {
  const query: any = event.target.value?.toLowerCase();

  if (!query || query.trim() === '') {
    // Si está vacío, restaurar todo
    this.categories = JSON.parse(JSON.stringify(this.originalCategories));
    return;
  }

  // Filtrar categorías y productos
  this.categories = this.originalCategories
    .map((cat: any) => {
      const filteredProducts: any[] = (cat.products || []).filter((prod: any) =>
        prod?.nombre?.toLowerCase().includes(query)
      );

      // Filtrar subcategorías también
      const filteredSubcats: any[] = (cat.subcategorias || [])
        .map((sub: any) => ({
          ...sub,
          products: (sub.products || []).filter((prod: any) =>
            prod?.nombre?.toLowerCase().includes(query)
          )
        }))
        .filter((sub: any) => sub.products.length > 0);

      if (filteredProducts.length > 0 || filteredSubcats.length > 0) {
        return {
          ...cat,
          products: filteredProducts,
          subcategorias: filteredSubcats
        };
      }
      return null;
    })
    .filter((cat: any) => cat !== null);
}

  async loadConfig() {
    const configDoc = this.firestore.collection('config').doc('platformConfig');
    configDoc.valueChanges().subscribe((config: any) => {
      if (config) {
        // Si el objeto config existe, lo asignamos directamente
        this.platformConfig = config;
   
   
      }
    });
  }
  goToCart(){
    if(this.activeRestaurante === true){

    }else{
      this.showToast('El restaurante está cerrado en este momento.')
      return

    }
    this.afAuth.authState.subscribe(async user  => {
      if (user) {
        // El usuario está logueado
        console.log('Usuario logueado:', user);
        this.userId = user.uid

        this.usuarioLogueado = true

        this.router.navigate(['/carrito/' + this.restaurantId + "/" + this.devMode + "/" + this.session]);


      }else{

        this.router.navigate(['/carrito/' + this.restaurantId + "/" + this.devMode + "/" + this.session]);
    
      
        
      }
  });
  
  }
  async showModalLogin() {

    if(this.booleanModal === true){
      return
    }
    this.booleanModal = true
    const modal = await this.modalCtrl.create({
      component: ModalLoginComponent,
      componentProps: { 
        Uid: this.userId
      },
      cssClass: 'custom-login-class'  // Add your custom class here
    });
  
    // Presentar el modal
    await modal.present();
  
    // Escuchar los datos devueltos por el modal
    const { data } = await modal.onDidDismiss();
    console.log(data)
    if (data) {
      console.log(data)
      this.afAuth.authState.subscribe(async user  => {
        if (user) {
          // El usuario está logueado
          console.log('Usuario logueado:', user);
          this.userId = user.uid
  
          this.usuarioLogueado = true

          for(var i =0 ; i < this.cartItemsCache.length; i++){
            this.addToCart(this.cartItemsCache[i])
          }
      this.showToast('Agregados al carrito exitosamente')

        }
    });

    
  
  
    } else {
      this.showToast("No Logueado")
  
      console.log('El modal fue cerrado sin seleccionar datos.');
      // Opcional: puedes manejar la lógica cuando el modal se cierra sin datos aquí.
    }
    this.booleanModal = false
  
  }
  async addToCart(product:any) {
  
   
      try {
        // Obtener la instancia de Firestore
        const firestore = getFirestore();
  
        // Referencia correcta: coleccion 'cart' dentro de 'users', y luego subcoleccion 'items' bajo el documento del restaurante
        const restaurantOrderRef = collection(firestore, `users/${this.userId}/cart/${this.restaurantId}/items`);
        
        // Datos del pedido que se van a enviar
        const pedidoData = product;
    
        // Agregar el pedido a la referencia del restaurante (subcolección 'items')
    
        await addDoc(restaurantOrderRef, pedidoData);
    
        this.showToast('Producto agregado al carrito');
        console.log('Producto agregado al carrito correctamente.');
      } catch (error) {
        console.error('Error al agregar al carrito:', error);
        this.showToast('Error al agregar al carrito');
      }
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
  navigate2(productName: string, 
    productId: string | undefined, item:any,
     arrayCategory:any,
    arraySubsubcategory:any) {
    if(item.active === true){

    }else{
      this.showToast('El producto está agotado, intenta mas tarde.')
      return
    }
    // Implementa la lógica para navegar a la página de detalles del producto
    console.log(`Navegando a ${productName} con ID: ${productId}`);
    const arraySubcategory  = {nombre:""}

    this.presentModal(item, arrayCategory,arraySubcategory,arraySubsubcategory)

  }
  async loadPromociones() {
    console.log(this.restaurantId);
    
  
  // Obtiene el documento del restaurante
  this.firestore.doc<Restaurant>(`promociones/${this.restaurantId}`)
    .valueChanges({ idField: 'id' })
    .subscribe(data => {
      if (data) {
        console.log('Restaurant data:', data);
     //   this.restaurant = data; // Asigna los datos si existen
         // Asigna los datos si existen
       if(data.descuentos){
        this.arrayPromos = 1

       }else{
        this.arrayPromos = 0

       }
   
      } else {
        console.warn('No restaurant found with the given ID.');
        this.restaurant = null; // Maneja el caso como desees
      }
    });
  }
  apertura: any
  cierre :any
  async loadrestaurante() {
    console.log(this.restaurantId);
    
  
  // Obtiene el documento del restaurante
  this.firestore.doc<Restaurant>(`restaurantes/${this.restaurantId}`)
    .valueChanges({ idField: 'id' })
    .subscribe(data => {

      if (data) {
  
        this.restaurant = data; // Asigna los datos si existen
        console.log('Restaurant data:', data);
         // Asigna los datos si existen
         this.nombreRestaurant = data.nombre;
         this.forceClose = data.forceClose;
         console.log(this.forceClose)
         console.log("this.forceClose")
         this.businessactive = data.activo;
         this.prepaTime = (+data.prepaTime + 16) || 35;
         this.identificadorRestaurant = data.key;
        this.currentLatBs = data.currentLat;
        this.currentLngBs = data.currentLng;
        this.currentHashtags = data.Hashtags
        this.promo = data.promo
     
        this.getUserData()

        this.banner = data.banner
        this.logo = data.logo
        

          const currentDay = new Date().toLocaleString('es-ES', { weekday: 'long' }).toLowerCase().replace("é", "e").replace("á", "a");
          const currentTime = new Date().toTimeString().slice(0, 5); // Formato HH:MM

          // Verifica si cada restaurante está en horario de servicio
   
            const apertura = data[`${currentDay}Apertura`] || 0;
            const cierre = data[`${currentDay}Cierre`] || 0;
            this.apertura = apertura
            this.cierre = cierre
        console.log(`Horario de apertura para ${apertura}: ${cierre}`);
            if (apertura === 0 || cierre === 0) {
              this.activeRestaurante = false;
         
              console.log("Horario no definido para este día, restaurante cerrado.");
            } else {
              const currentTimeFinal = currentTime.replace(":", "");
   
              const apertura1 = apertura.replace(":", "");

              const cierre1 = cierre.replace(":", "");

              if (+currentTimeFinal >= +apertura1 && +currentTimeFinal <= +cierre1) {
                console.log("currentTimeFinal está dentro del rango.");
              //  restaurant.cerrado = true;
              if(this.forceClose === false || this.businessactive === false){
                this.activeRestaurante = false
                console.log("restaurante abierto 806");

              }else{
                this.activeRestaurante = true
                console.log("restaurante abierto 809");
              }
            
              } else {
                console.log("currentTimeFinal está fuera del rango.");
                
                this.activeRestaurante = false

              }
              if(this.platformConfig.platformActive === true){
                console.log(this.platformConfig.platformActive)
              }else{
            

              }
            }
    

      

      } else {
        console.warn('No restaurant found with the given ID.');
        this.restaurant = null; // Maneja el caso como desees
      }
    });
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
  goMarketplace() {
    this.router.navigate(['/tabs/marketplace'], { replaceUrl: true });
  }
  async loadCategorias() {
    console.log(this.restaurantId);
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    //this.loadPromociones()
    const timestampFirestore = Timestamp.now();
    console.log(this.getDiaActualDesdeFirestore(timestampFirestore)); // Ejemplo: "Miércoles"
    var currentDay = this.getDiaActualDesdeFirestore(timestampFirestore)
    var currentHora = this.getHoraActualDesdeFirestore(timestampFirestore)
    // Obtiene la colección de categorías del restaurante
    this.firestore.collection<YourCategoryModel>(`businesses/${this.restaurantId}/categories`)
      .valueChanges({ idField: 'id' })
      .subscribe(data => {
        if (data && data.length) {
          console.log('productos:', data);

          setTimeout(() => {
            this.itemCountCategories = 1;

              }, 100);

          this.categories = data; // Asigna los datos si existen
          //const textoMenu = this.generateMenuText();
          //console.log("MENÚ COMPLETO:\n\n" + textoMenu);

                this.originalCategories = JSON.parse(JSON.stringify(data));
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

          
     
        } else {
        setTimeout(() => {
          this.itemCountCategories = 0;
              
            }, 1000);
          console.warn('No categories found for the given restaurant.');
          this.categories = null; // Maneja el caso como desees
        }
      });
      console.log("categories:", this.categories);
  }
async migrarAddonsUrbanWings() {
  try {

    const data = {
      arrayAddons: [
        {
          indexProduct: 0,
          isMandatory: true,
          max: 0,
          min: "2",
          nameTopping: "¿Qué salsas gustas para tus boneless?",
          type: "increment",
          arrayToppings: this.getSalsas(),
          id: new Date()
        },
        {
          indexProduct: 1,
          isMandatory: true,
          max: 0,
          min: "2",
          nameTopping: "¿Qué salsas gustas para tus Alitas?",
          type: "increment",
          arrayToppings: this.getSalsas(),
          id: new Date()
        },
        {
          indexProduct: 2,
          isMandatory: true,
          max: 0,
          min: "1",
          nameTopping: "¿Qué salsa te gustaria para tus boneless?",
          type: "increment",
          arrayToppings: this.getSalsas(),
          id: new Date()
        },
        {
          indexProduct: 3,
          isMandatory: true,
          max: 0,
          min: "1",
          nameTopping: "¿Qué salsa te gustaria para tus Alitas?",
          type: "increment",
          arrayToppings: this.getSalsas(),
          id: new Date()
        },
        {
          indexProduct: 4,
          isMandatory: true,
          max: 0,
          min: 0,
          nameTopping: "¿Qué salsa prefieres para tu pechuga?",
          type: "single",
          arrayToppings: [
            { name: "Dulce secreto", Precio: 0, active: true },
            { name: "Buffalo", Precio: 0, active: true }
          ],
          id: new Date()
        },
        {
          indexProduct: 5,
          isMandatory: true,
          max: 0,
          maxMultiple: "2",
          min: 0,
          nameTopping: "¿Qué salsas gustas para tus boneless?",
          type: "multiple",
          arrayToppings: this.getSalsas(),
          id: new Date()
        },
        {
          indexProduct: 6,
          isMandatory: true,
          max: 0,
          min: "1",
          nameTopping: "¿Qué salsa te gustaria para tus corn ribs?",
          type: "increment",
          arrayToppings: this.getSalsas(),
          id: new Date()
        }
      ]
    };

    await this.firestore
      .doc(`addons/urban-wings`)
      .set(data);

    console.log("✅ Addons migrados correctamente");

  } catch (error) {
    console.error("❌ Error migrando addons:", error);
  }
}

getSalsas() {
  return [
    { name: "Buffalo Hot", Precio: 0, active: true },
    { name: "Cajun", Precio: 0, active: true },
    { name: "Mango Habanero", Precio: 0, active: true },
    { name: "Suicida", Precio: 0, active: true },
    { name: "Cayene", Precio: 0, active: true },
    { name: "Buffalo", Precio: 0, active: true },
    { name: "Buffalo Ajo", Precio: 0, active: true },
    { name: "Buffalo Ranch", Precio: 0, active: true },
    { name: "BBQ", Precio: 0, active: true },
    { name: "BBQ Mango", Precio: 0, active: true },
    { name: "Lemon Pepper", Precio: 0, active: true },
    { name: "Garlic Parmesano", Precio: 0, active: true },
    { name: "Chipotle", Precio: 0, active: true },
    { name: "Dulce Secreto", Precio: 0, active: true },
    { name: "Teriyaki", Precio: 0, active: true },
    { name: "Sticky Wings", Precio: 0, active: true }
  ];
}


 generateMenuText() {
  let texto = '';

  const processProducts = (products: any, categoryName: string, subcategoryName: string) => {
    if (!products) return;

    for (const product of products) {
      const nombre = product.nombre || product.desc || "Sin nombre";
      const precio = product.precio !== undefined ? product.precio : "N/A";
      const desc = product.desc || "Sin descripción";

      // Formato: Categoria | Subcategoria | Producto | Precio | Descripcion
      texto += `${categoryName}${subcategoryName ? " → " + subcategoryName : ""} | ${nombre} | ${precio} | ${desc}\n`;
    }
  };

  const processSubcategories = (subcats: any, categoryName: string) => {
    if (!subcats) return;

    for (const sub of subcats) {
      if (sub.products) {
        processProducts(sub.products, categoryName, sub.nombre);
      }

      // Recursividad para sub-subcategorías
      if (sub.subcategorias && sub.subcategorias.length > 0) {
        processSubcategories(sub.subcategorias, `${categoryName} → ${sub.nombre}`);
      }
    }
  };

  for (const category of this.categories!) {
    // Productos directos de la categoría
    if (category.products) {
      processProducts(category.products, category.name, "");
    }

    // Subcategorías
    if (category.subcategorias) {
      processSubcategories(category.subcategorias, category.name);
    }
  }

  return texto.trim();
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

private checkProductFlagsAndSchedule2(product: any, category: any, currentDay: string, currentHora: string) {
  if (product.dias && Array.isArray(product.dias)) {
    let isActiveToday = false;

    for (const dia of product.dias) {
      if (dia.name === currentDay) {

        if(dia.selected === true){
          console.log("784")

        }else{
          
          console.log("785")
        }
        if (!dia.selected || !dia.startTime || !dia.endTime) {
          isActiveToday = true;
          product.active = true
          break;
        }

        // Convertir a minutos para comparar correctamente
        const horaActualMin = this.convertToMinutes(currentHora);
        const horaInicioMin = this.convertToMinutes(dia.startTime);
        const horaFinMin = this.convertToMinutes(dia.endTime);

        if (horaActualMin >= horaInicioMin && horaActualMin <= horaFinMin) {
          isActiveToday = true;
          product.active = true

          break;
        } else {
          product.active = false

          console.log("Fuera de horario");
        }
      }
    }
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

// Convertir "HH:mm" a minutos
private convertToMinutes(hora: string): number {
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}


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
      restaurante: JSON.parse(JSON.stringify(this.identificadorRestaurant)),
      Item: JSON.parse(JSON.stringify(array)),
      Phone:this.phoneNumber || "",
      ItemCategoria: JSON.parse(JSON.stringify(arrayCategory)),
      ItemSubcategoria: JSON.parse(JSON.stringify(arraySubcategory)),
      ItemSubcategoria2: JSON.parse(JSON.stringify(arraySubsubcategory)),
      business: this.identificadorRestaurant,
      Uid:this.userId,
      isLogin: this.usuarioLogueado,
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
  goBack() {
    // Desplazar suavemente al inicio del ion-content
    this.contentRef.scrollToPoint(0, 0, 500); // Desplazarse a la parte superior en 500ms
  }
  goLocation() {
    if (this.currentLatBs && this.currentLngBs) {
      const url = `https://www.google.com/maps/search/?api=1&query=${this.currentLatBs},${this.currentLngBs}`;
  
      window.location.href = url
      //window.open(url, '_system');  // '_system' abre en el navegador o en la app de Google Maps
    } else {
      console.log('Coordenadas no disponibles');
    }
  }
  // Método que se ejecuta al seleccionar una pestaña del segmento
  onSegmentChange(event: any) {
    const selectedCategory = event.detail.value;
  
    const selectedIndex = this.categories?.findIndex(category => category.name === selectedCategory) ?? -1;
  
    if (selectedIndex !== -1) {
      const selectedRow = this.productRows.get(selectedIndex)?.nativeElement; // Usar get() para obtener el elemento
      if (selectedRow) {
        const offsetTop = selectedRow.offsetTop - 150;
  
        // Desplazar suavemente hasta el producto seleccionado
        this.contentRef.scrollToPoint(0, offsetTop + 10, 500); // 500ms para un desplazamiento suave
      }
    }
  }
  onSegmentChangeSub(event: any) {
    const selectedCategory = event.detail.value;
  
    const selectedIndex = this.categories?.findIndex(category => category.name === selectedCategory) ?? -1;
  
    if (selectedIndex !== -1) {
      const selectedRow = this.productRows.get(selectedIndex)?.nativeElement; // Usar get() para obtener el elemento
      if (selectedRow) {
        const offsetTop = selectedRow.offsetTop - 150;
  
        // Desplazar suavemente hasta el producto seleccionado
        this.contentRef.scrollToPoint(0, offsetTop + 10, 500); // 500ms para un desplazamiento suave
      }
    }
  }
  onScroll(event: any) {
    this.scrollTop = event.detail.scrollTop + 200;
    let firstVisibleProduct = null;
    this.segmentValueSubBoolean = false;
  
    this.scrollTop = event.detail.scrollTop;

   
    // Check which main category is visible and update accordingly
    this.productRows.forEach((row, index) => {
        const offsetTop = row.nativeElement.offsetTop;
        const offsetHeight = row.nativeElement.offsetHeight;
      
        if (offsetTop <= this.scrollTop && (offsetTop + offsetHeight) > this.scrollTop) {
            firstVisibleProduct = this.categories?.[index]?.name;
         
            this.segmentValue = firstVisibleProduct!;
          
            if (this.categories?.[index]?.subcategorias.length > 0) {
                this.subcategories = this.categories?.[index]?.subcategorias;
               // console.log(this.segmentValue)
              //  this.segmentValueSub = this.categories?.[index]?.subcategorias[this.indexSubcategory]?.nombre;
              //  console.log(this.categories?.[index])
                //for(var i = 0; i < this.categories?.[index]?subcategorias[])
            //    console.log(this.segmentValueSub,"wew")
             //   console.log(this.categories?.[index]?.subcategorias[this.indexSubcategory]?.nombre)
             //   console.log("Current subcategory name:", this.segmentValueSub);
                //console.log("Current subcategories name:", this.subcategories);
                this.segmentValueSubBoolean = true;
            } else {
                this.segmentValueSubBoolean = false;
            }
        }
    });
}

ngAfterViewInit() {
  setTimeout(() => {
  this.initIntersectionObserver();
    
  }, 2000);
}
ngOnDestroy() {
  // Desconecta el observador para evitar fugas de memoria
  if (this.observer) {
    this.observer.disconnect();
  }
}
initIntersectionObserver() {
  console.log("721")
  this.observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
      //  console.log("725")
        if (entry.isIntersecting) {
          const textContent = entry.target.textContent?.trim(); // Elimina espacios en blanco
  if (textContent) {
    this.segmentValueSub = textContent;
  //  console.log(`Assigned to segmentValueSub: ${this.segmentValueSub}`);
  } else {
    console.error("textContent is empty or undefined");
  }
        } else {
         // console.log(`Element not visible: ${entry.target.textContent}`);
        }
      });
    },
    {
      root: null, // Usa el viewport por defecto
      threshold: 0.1, // Se activa cuando el 10% del elemento es visible
    }
  );

  // Observa cada elemento <h3>
  this.h3Elements.forEach((h3) => {
    this.observer.observe(h3.nativeElement);
    console.log("741")
  });
}
getUserData() {
  try {
    // Obtén la referencia al documento del usuario
    console.log(this.userId)
    const userRef = this.firestore.doc(`users/${this.userId}`);
    
    // Escucha los cambios en tiempo real
    userRef.valueChanges().subscribe((datax: any) => {
      if (datax) {
        console.log('User data:', datax);

        // Si la dirección está indefinida, manejar la lógica de obtener la ubicación
        if (datax['direccion'] === undefined) {
          // Aquí deberías manejar la lógica de obtener la ubicación
          console.log('Dirección indefinida, solicita la ubicación del usuario.');
          // Ejemplo: this.showGetLocation();
          return; // Detén la ejecución si no hay dirección
        }

        // Asignar los datos obtenidos a las variables locales
        this.direccion = datax['direccion'];
        this.currentLatUser = +datax['lat'];
        this.currentLngUser = +datax['lng'];

        // Primero añade el restaurante actual a la lista de restaurantes
        this.restaurantes.push({
          nombre: this.nombreRestaurant,
          currentLat: this.currentLatBs ?? 0,  // Usa el valor predeterminado si es undefined
          currentLng: this.currentLngBs ?? 0   // Usa el valor predeterminado si es undefined
        });

        // Luego, calcula las distancias para todos los restaurantes
        const restaurantsWithDistances = this.calcularDistancias(
          this.currentLatUser,
          this.currentLngUser,
          this.restaurantes
        );

        // Actualiza la lista de restaurantes con las distancias calculadas
        this.restaurantes = restaurantsWithDistances;

        // Busca el restaurante específico por nombre
        const restaurantEncontrado = this.restaurantes.find(restaurant => restaurant.nombre === this.nombreRestaurant);

        // Si se encuentra el restaurante, muestra los datos
        if (restaurantEncontrado) {

          // Asignar la distancia y costo de envío a las variables
          const distancia = restaurantEncontrado.distance;
          const costoEnvio = restaurantEncontrado.costoEnvio;

          this.distancia = distancia;
          this.costoEnvio = costoEnvio;

        } else {
          console.log('No se encontró un restaurante con ese nombre.');
        }

      } else {
        console.log('El documento no existe.');
      }
    }, (error) => {
      console.error('Error al escuchar cambios en el documento:', error);
    });
  } catch (error) {
    console.error('Error en gesrData:', error);
  }
}

  

  haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return parseFloat((R * c).toFixed(1)); // Devuelve la distancia en kilómetros con un decimal
  }
  
  // Convierte grados a radianes
  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
  
  // Función para calcular distancias y agregarla a cada restaurante
  calcularDistancias(currentLat: number, currentLng: number, restaurants: Restaurant2[]): Restaurant2[] {
    return restaurants.map(restaurant => {
      const lat = restaurant.currentLat !== undefined ? +restaurant.currentLat : 0; // Asignar un valor predeterminado si es undefined
      const lng = restaurant.currentLng !== undefined ? +restaurant.currentLng : 0; // Asignar un valor predeterminado si es undefined
  
 
      const distance = this.haversineDistance(+currentLat, +currentLng, +lat, +lng);
      this.distancia = distance

      // Calcula el costo de envío basado en la distancia
      let costoEnvio = 0;
      if (distance >= 0 && distance <= 2) {
        costoEnvio = 35;
      } else if (distance > 2 && distance <= 3) {
        costoEnvio = 40;
      } else if (distance > 3 && distance <= 4) {
        costoEnvio = 45;
      } else if (distance > 4 && distance <= 5) {
        costoEnvio = 50;
      } else if (distance > 5 && distance <= 6) {
        costoEnvio = 55;
      } else if (distance > 6 && distance <= 7) {
        costoEnvio = 60;
      } else if (distance > 7 && distance <= 8) {
        costoEnvio = 65;
      } else if (distance > 8 && distance <= 9) {
        costoEnvio = 70;
      } else if (distance > 9 && distance <= 10) {
        costoEnvio = 75;
      } else if (distance > 10 && distance <= 11) {
        costoEnvio = 85;
      } else if (distance > 11 && distance <= 12) {
        costoEnvio = 95;
      } else if (distance > 12 && distance <= 13) {
        costoEnvio = 105;
      } else if (distance > 13 && distance <= 14) {
        costoEnvio = 115;
      } else if (distance > 14 && distance <= 15) {
        costoEnvio = 125;
      } else {
        // Puedes manejar tarifas para distancias superiores a 15 Km si es necesario
        costoEnvio = 0; // Si la distancia es mayor a 15 Km, puedes manejarlo como quieras
      }
  
      // Agrega la distancia y el costo de envío al objeto restaurante
      return { ...restaurant, distance: parseFloat(distance.toFixed(1)), costoEnvio };
    });
  }






}
