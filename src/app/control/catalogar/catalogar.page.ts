import { ChangeDetectorRef, Component, ElementRef, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, Timestamp, updateDoc } from 'firebase/firestore';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { ModalComplementosComponent } from 'src/app/modals/modal-complementos/modal-complementos.component';
import { ModalCreateProductComponent } from 'src/app/modals/modal-create-product/modal-create-product.component';
import { ActionProductsComponent } from 'src/app/popovers/action-products/action-products.component';
import { EditProductComponent } from 'src/app/popovers/edit-product/edit-product.component';
interface Product {
  nombre: string;
  precio: string;
  Disc: number;
  desc: string;
  imageHD?: string;
  imageLowRes?: string;
  fechaCreacion: Date;
  products:any;
}

interface CategoryData {
  id: string; // Suponiendo que tienes un id para la categoría
  name: string; // O el campo que uses para el nombre de la categoría
  products?: Product[]; // Agrega esta línea para definir los productos
  subcategorias?: any[]; // O el tipo que uses para las subcategorías
}
interface Topping {
  nameTopping: string;
  type: string;
  precio?: number; // Si el precio es opcional
}
interface Category {
  name: string;
  products?: Product[]; // Puedes definir una interfaz para el producto si es necesario
}

interface Product {
  nombre: string;
  precio: string;
  categoria: string;
  imageHD?: string;
  imageLowRes?: string;
  fechaCreacion: Date;
}
@Component({
  selector: 'app-catalogar',
  templateUrl: './catalogar.page.html',
  styleUrls: ['./catalogar.page.scss'],
})
export class CatalogarPage implements OnInit {

  logoFile: File | null = null;
  bannerFile: File | null = null;
  @ViewChild('sliderRow', { static: false }) sliderRow!: ElementRef<HTMLDivElement>;

  showTooltipText = ""
  indexSubcategoria1 = 0
  logoPreview: string | null = null; // Para la vista previa del logo
  bannerPreview: string | null = null; 
  newCategory: string = '';
  selectedCategoryProduct:any = null
  selectedCategory1: any = null;
  selectedCategory2 : any = null
  indexSubcategoria2 = 0
  selectedProduct: any = null;
  popoverOpen = false;
  
  productoIndex = 0
  showTooltip: boolean = false;
  tooltipPosition: { clientX: number; clientY: number } | null = null;
  indexSegment1 = ""
  indexSegment2 = ""
  indexSegment3 = ""
  sizeProducts = 0
  sizeCategories = 3
  sizeDetails = 0
  sizeComplementosCreate = 0
  sizeComplementosList = 0
  typeComplemento: string = ""; // Variable para almacenar el tipo de complemento
  sizeSubcategoria = 0
  sizeSubcategoria2 = 0
  currentIdDoc = ""
  selectedCategory3 : any = null
  projectName:string = ""
  categories: any[] = [];
  customizationForm: FormGroup;
  items: Array<{ name: string, Precio: number, active: true }> = [
    { name: "", Precio: 0, active:true },
   
  ];
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  currentBusiness : string  = "";
  loading: any;
  complemento = ""
  suggestedToppings: any[] = [];
  addonsArray: any[] = [];
  sizeSubcategoria3 = 0
  productAction = ""
  tooltipPositionY = 0
  tooltipPositionX = 0
  showCategoriaCards = true
  userId: string = 'uidUser'; // Reemplaza esto con el ID real del usuario
  projects: any[] = []; // Almacenará los proyectos obtenidos
  selectedProject: any; // Almacenará el proyecto seleccionado
  showToppingCards = false
  showProductosCards = true
  private activatedRoute = inject(ActivatedRoute);

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private alertController: AlertController,
    private popoverController: PopoverController,
    private firestore: AngularFirestore,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private afAuth: AngularFireAuth, 
    private storage: AngularFireStorage ,private ngZone: NgZone,
private cdr: ChangeDetectorRef

  ) {
    this.customizationForm = this.fb.group({
      customisation_name: ['', [Validators.required, Validators.maxLength(30)]],
      language: ['english', Validators.required],
      customisation_type: ['', Validators.required],
      customisation_subtype: ['', [Validators.required, Validators.maxLength(90)]],
      price: ['', [Validators.required, Validators.min(0)]],
    });
  }


 
 @ViewChild('sliderRowEl', { read: ElementRef }) sliderRowEl!: ElementRef;

scrollRight() {
  if (!this.sliderRowEl) return;

  const el = this.sliderRowEl.nativeElement;

  if (el.scrollBy) {
    el.scrollBy({ left: 200, behavior: 'smooth' });
  } else {
    el.scrollLeft += 200;
  }
}

  
  
  onProjectChange(event: any) {
    const selectedId = event.detail.value; // Obtener el ID del proyecto seleccionado
   
    console.log('Proyecto seleccionado:', selectedId.name);
    this.currentBusiness = selectedId.name
    this.loadCategories()
    // Aquí puedes manejar la lógica que quieras realizar con el proyecto seleccionado
    // Por ejemplo, redirigir a otra página o cargar más información sobre el proyecto
  }
  ngOnInit() {
    this.currentBusiness = this.activatedRoute.snapshot.paramMap.get('id') as string;

    this.afAuth.authState.subscribe(user => {
      if (user) {
        // El usuario está logueado
        console.log('Usuario logueado:', user);
        this.userId = user.uid
        this.loadCategories()

        // Redirigir a la página principal o donde desees
 
    //this.loadCategories();
      } else {
    
        // El usuario no está logueado
        console.log('No hay usuario logueado');
      }
    });
  }
  doReorder(event: any) {
    this.presentLoading("Reordenando")
    const fromIndex = event.detail.from; // Índice de origen
    const toIndex = event.detail.to; // Índice de destino
  
    // Intercambia los elementos en el arreglo local
    const temp = this.categories[fromIndex]; // Almacena temporalmente el elemento de origen
    this.categories[fromIndex] = this.categories[toIndex]; // Reemplaza el elemento de origen por el de destino
    this.categories[toIndex] = temp; // Coloca el elemento original en la nueva posición
  
    event.detail.complete(); // Completa el evento de reordenamiento
  
    // Llama a la función para actualizar el orden en Firestore
    this.updateCategoriesOrder(fromIndex, toIndex);

  }
  async updateCategoriesOrder(fromIndex: number, toIndex: number) {
    const categoriesRef = this.firestore.collection(`businesses/${this.currentBusiness}/categories`);
    
    const categoryFromId = this.categories[fromIndex].id; // ID del documento en la posición de origen
    const categoryToId = this.categories[toIndex].id; // ID del documento en la posición de destino
  
    try {
      const categoryFromDoc = await categoriesRef.doc(categoryFromId).ref.get(); // Obtén el documento del origen
      const categoryToDoc = await categoriesRef.doc(categoryToId).ref.get(); // Obtén el documento del destino
  
      // Asegúrate de que los documentos existan y sean objetos
      const fromData = categoryFromDoc.exists ? categoryFromDoc.data() : null;
      const toData = categoryToDoc.exists ? categoryToDoc.data() : null;
  
      if (fromData && toData) {
        // Intercambia los datos
        await categoriesRef.doc(categoryFromId).set({ ...toData }, { merge: true }); // Actualiza el documento de origen
        await categoriesRef.doc(categoryToId).set({ ...fromData }, { merge: true }); // Actualiza el documento de destino
  
        console.log('Categories swapped successfully in Firestore!');
        this.loading.dismiss();
      } else {
        console.error('One of the documents does not exist.');
      }
    } catch (error) {
      console.error('Error swapping categories:', error);
    }
  }
  
  
  async selectComplementModal(){
 
    const modal = await this.modalCtrl.create({
      component: ModalComplementosComponent,
      componentProps : {id:this.currentBusiness},
      cssClass : "custom-modal",
 
      animated:true,
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        console.log(result.data);
        this.addonsArray = result.data;
    
        // Asegúrate de que this.selectedProduct.addons esté inicializado como un array
        if (!this.selectedProduct.addons) {
          this.selectedProduct.addons = [];
        }
    
        // Agrega los elementos de this.addonsArray uno por uno si es un array
        if (Array.isArray(this.addonsArray)) {
          this.addonsArray.forEach(addon => {
            this.selectedProduct.addons.push(addon);
          });
        } else {
          // Si result.data no es un array, simplemente haz push
          this.selectedProduct.addons.push(this.addonsArray);
        }
    
        console.log('Addons actualizados:', this.selectedProduct.addons);
      } else {
        console.log("No hay datos de addons");
      }
    });
    

    await modal.present();
  

  }
  async loadCategories() {
    console.log(this.currentBusiness)
    // Asegúrate de que currentBusiness está definido y tiene el ID correcto del negocio actual
    this.firestore.collection('businesses/'+this.currentBusiness + '/categories')
    .valueChanges({ idField: 'id' })
    .subscribe(data => {
      console.log('Categories:', data);
      this.ngZone.run(() =>{
        this.categories = data
this.showToast('Actualizado correctamente')
      })
    });

    setTimeout(() => {
    this.getAllToppings();
      
    }, 2000);
    console.log(this.categories)

  }
  
  async getAllToppings() {
    try {
      const categoriesSnapshot = await getDocs(collection(this.firestore.firestore, `businesses/${this.currentBusiness}/categories`));
      
      let allToppings: Topping[] = []; // Aquí almacenaremos todos los complementos
  
      // Recorrer cada categoría
      for (const categoryDoc of categoriesSnapshot.docs) {
        const categoryData = categoryDoc.data();
        const products = categoryData['products'] || [];
  
        // Recorrer cada producto en la categoría
        for (const product of products) {
          if (product.toppings && Array.isArray(product.toppings)) {
            allToppings = allToppings.concat(product.toppings);
          }
        }
      }
  
      console.log('Todos los complementos:', allToppings);
  
   
      this.ngZone.run(() => {
        this.suggestedToppings = allToppings
//        this.suggestedToppings = this.getSuggestedToppings(allToppings);
      })
      console.log(this.suggestedToppings)
    } catch (error) {
      console.error('Error al obtener complementos:', error);
    }
  }
  
  getSuggestedToppings(allToppings: Topping[]): Topping[] {
    const toppingCounts = new Map<string, number>();
  
    // Concatenar 'nameTopping' y 'type' con un delimitador claro
    allToppings.forEach(topping => {
      const key = `${topping.nameTopping}|${topping.type}`;
      if (toppingCounts.has(key)) {
        toppingCounts.set(key, toppingCounts.get(key)! + 1);
      } else {
        toppingCounts.set(key, 1);
      }
    });
  
    const suggestedToppings: Topping[] = [];
    toppingCounts.forEach((count, key) => {
      if (count > 1) {
        // Separar 'nameTopping' y 'type' usando el delimitador '|'
        const [nameTopping, type] = key.split('|');
        suggestedToppings.push({ nameTopping, type });
      }
    });
  
    return suggestedToppings;
  }
  
  
  

  async presentLoading(message: string) {
    this.loading = await this.loadingCtrl.create({ message });
    await this.loading.present();
  }

  // Alert to create a new category
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Nueva Categoría',
      inputs: [
        { name: 'categoria', type: 'text', placeholder: 'Nombre de la categoría' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        { text: 'Aceptar', handler: async (data: any) => this.createCategory(data.categoria) }
      ]
    });
    await alert.present();
  }

// Create new category in Firestore
async createCategory(name: string) {
  if (name.trim()) {
    await this.presentLoading('Guardando categoría...');
    try {
      const newCategoryRef = await this.firestore
        .collection(`businesses/${this.currentBusiness}/categories`)
        .add({ 
          name, 
          products: [], 
          subcategorias: [], 
          active: true,
          createdAt: new Date() // Agregar marca de tiempo
        });

      // Crear el objeto de la nueva categoría incluyendo el ID
      const newCategory = {
        id: newCategoryRef.id, // Obtener el ID del documento
        name,
        products: [],
        subcategorias: [],
        active: true,
        createdAt: new Date()
      };

      // Agrega la nueva categoría al inicio de this.categories
      this.categories.push(newCategory);
      this.showToast('Categoría creada correctamente');
      
    } catch (error) {
      this.showToast('Error al crear la categoría');
      console.log(error);
    } finally {
      this.loading.dismiss();
    }
  }
}



async activarCategory(state: boolean) {
  if (this.currentIdDoc) {  // Verifica si el nombre no está vacío y si el ID del documento está disponible
    await this.presentLoading('Actualizando categoría...');
    try {
      const categoryDocRef = this.firestore
        .collection(`businesses/${this.currentBusiness}/categories`)
        .doc(this.currentIdDoc); // Usamos el ID del documento almacenado en `this.idocument`

      // Actualiza el nombre de la categoría
      await categoryDocRef.update({ 
        active: state // Actualizamos solo el campo de nombre
      });

      // Mostrar mensaje de éxito
      this.showToast('Categoría actualizada correctamente');
      
      // Recargar las categorías después de la actualización
      this.loadCategories();
    } catch (error) {
      this.showToast('Error al actualizar la categoría');
      console.log(error);
    } finally {
      this.loading.dismiss();
    }
  } else {
    this.showToast('El nombre no puede estar vacío o el ID del documento es inválido');
  }
}

async editCategory(name: string) {
  if (name.trim() && this.currentIdDoc) {  // Verifica si el nombre no está vacío y si el ID del documento está disponible
    await this.presentLoading('Actualizando categoría...');
    try {
      const categoryDocRef = this.firestore
        .collection(`businesses/${this.currentBusiness}/categories`)
        .doc(this.currentIdDoc); // Usamos el ID del documento almacenado en `this.idocument`

      // Actualiza el nombre de la categoría
      await categoryDocRef.update({ 
        name: name // Actualizamos solo el campo de nombre
      });

      // Mostrar mensaje de éxito
      this.showToast('Categoría actualizada correctamente');
      
      // Recargar las categorías después de la actualización
      this.loadCategories();
    } catch (error) {
      this.showToast('Error al actualizar la categoría');
      console.log(error);
    } finally {
      this.loading.dismiss();
    }
  } else {
    this.showToast('El nombre no puede estar vacío o el ID del documento es inválido');
  }
}


async enableSubCategory1(state: boolean, indexSubcategoria: number) {
  console.log(state)
  console.log(indexSubcategoria)
  if (this.currentIdDoc && indexSubcategoria >= 0) {
    await this.presentLoading('Actualizando subcategoría...');
    try {
      const categoryDocRef = this.firestore
        .collection(`businesses/${this.currentBusiness}/categories`)
        .doc(this.currentIdDoc);

      // Obtener el documento y forzar el tipado
      const docSnapshot = await categoryDocRef.get().toPromise();
      
      if (docSnapshot!.exists) {
        // Tipamos los datos como CategoryData
        const data = docSnapshot!.data() as CategoryData;

        // Asegurarse de que las subcategorias existan
        const subcategorias = data.subcategorias || [];
        console.log(subcategorias)
        console.log(this.selectedCategoryProduct)
        // Verificar si el índice es válido
        if (indexSubcategoria >= 0 && indexSubcategoria < subcategorias.length) {
          // Actualizar el campo 'name' de la subcategoría en la posición 'indexSubcategoria'
          subcategorias[indexSubcategoria].active = state;
          this.selectedCategoryProduct['subcategorias'][this.indexSubcategoria1].active = state
          // Actualizar el documento con el array modificado
          await categoryDocRef.update({
            subcategorias: subcategorias
          });

          this.showToast('Subcategoría actualizada correctamente');
 
        } else {
          this.showToast('Índice de subcategoría no válido');
        }
      } else {
        this.showToast('Documento no encontrado');
      }
    } catch (error) {
      this.showToast('Error al actualizar la subcategoría');
      console.log(error);
    } finally {
      this.loading.dismiss();
    }
  } else {
    this.showToast('El nombre no puede estar vacío, el ID del documento es inválido o el índice es inválido');
  }
}
async enableSubCategory2(state: boolean, indexSubcategoria: number) {
  console.log(state)
  console.log(indexSubcategoria)
  if (this.currentIdDoc && indexSubcategoria >= 0) {
    await this.presentLoading('Actualizando subcategoría...');
    try {
      const categoryDocRef = this.firestore
        .collection(`businesses/${this.currentBusiness}/categories`)
        .doc(this.currentIdDoc);

      // Obtener el documento y forzar el tipado
      const docSnapshot = await categoryDocRef.get().toPromise();
      
      if (docSnapshot!.exists) {
        // Tipamos los datos como CategoryData
        const data = docSnapshot!.data() as CategoryData;

        console.log(data)
        // Asegurarse de que las subcategorias existan
        const subcategorias = data.subcategorias!|| [];
        console.log(subcategorias)
        console.log(this.selectedCategoryProduct)
        // Verificar si el índice es válido
  
          // Actualizar el campo 'name' de la subcategoría en la posición 'indexSubcategoria'
          subcategorias[this.indexSubcategoria1]['subcategorias'][this.indexSubcategoria2].active = state;
          
          this.selectedCategoryProduct['subcategorias'][this.indexSubcategoria1]['subcategorias'][this.indexSubcategoria2].active = state
          // Actualizar el documento con el array modificado
          await categoryDocRef.update({
            subcategorias: subcategorias
          });

          this.showToast('Subcategoría actualizada correctamente');
 
        
      } else {
        this.showToast('Documento no encontrado');
      }
    } catch (error) {
      this.showToast('Error al actualizar la subcategoría');
      console.log(error);
    } finally {
      this.loading.dismiss();
    }
  } else {
    this.showToast('El nombre no puede estar vacío, el ID del documento es inválido o el índice es inválido');
  }
}
async editSubCategory1(name: string, indexSubcategoria: number) {

  if (name.trim() && this.currentIdDoc && indexSubcategoria >= 0) {
    await this.presentLoading('Actualizando subcategoría...');
    try {
      const categoryDocRef = this.firestore
        .collection(`businesses/${this.currentBusiness}/categories`)
        .doc(this.currentIdDoc);

      // Obtener el documento y forzar el tipado
      const docSnapshot = await categoryDocRef.get().toPromise();
      
      if (docSnapshot!.exists) {
        // Tipamos los datos como CategoryData
        const data = docSnapshot!.data() as CategoryData;

        // Asegurarse de que las subcategorias existan
        const subcategorias = data.subcategorias || [];

        // Verificar si el índice es válido
        if (indexSubcategoria >= 0 && indexSubcategoria < subcategorias.length) {
          // Actualizar el campo 'name' de la subcategoría en la posición 'indexSubcategoria'
          subcategorias[indexSubcategoria].nombre = name;
          this.selectedCategoryProduct['subcategorias'][this.indexSubcategoria1].nombre = name
          // Actualizar el documento con el array modificado
          await categoryDocRef.update({
            subcategorias: subcategorias
          });

          this.showToast('Subcategoría actualizada correctamente');
 
        } else {
          this.showToast('Índice de subcategoría no válido');
        }
      } else {
        this.showToast('Documento no encontrado');
      }
    } catch (error) {
      this.showToast('Error al actualizar la subcategoría');
      console.log(error);
    } finally {
      this.loading.dismiss();
    }
  } else {
    this.showToast('El nombre no puede estar vacío, el ID del documento es inválido o el índice es inválido');
  }
}
async editSubCategory2(name: string, indexSubcategoria: number) {
  if (name.trim() && this.currentIdDoc && indexSubcategoria >= 0) {
    await this.presentLoading('Actualizando subcategoría...');
    try {
      const categoryDocRef = this.firestore
        .collection(`businesses/${this.currentBusiness}/categories`)
        .doc(this.currentIdDoc);

      // Obtener el documento y forzar el tipado
      const docSnapshot = await categoryDocRef.get().toPromise();
      
      if (docSnapshot!.exists) {
        // Tipamos los datos como CategoryData
        const data = docSnapshot!.data() as CategoryData;

        // Asegurarse de que las subcategorias existan
        const subcategorias = data.subcategorias || [];

        // Verificar si el índice es válido
        if (indexSubcategoria >= 0 && indexSubcategoria < subcategorias.length) {
          // Actualizar el campo 'name' de la subcategoría en la posición 'indexSubcategoria'
          subcategorias[indexSubcategoria]['subcategorias'][this.indexSubcategoria2].nombre = name;

          // Actualizar el documento con el array modificado
          await categoryDocRef.update({
            subcategorias: subcategorias
          });
          this.selectedCategory2['subcategorias'][this.indexSubcategoria2].nombre = name
          this.showToast('Subcategoría actualizada correctamente');
     
        } else {
          this.showToast('Índice de subcategoría no válido');
        }
      } else {
        this.showToast('Documento no encontrado');
      }
    } catch (error) {
      this.showToast('Error al actualizar la subcategoría');
      console.log(error);
    } finally {
      this.loading.dismiss();
    }
  } else {
    this.showToast('El nombre no puede estar vacío, el ID del documento es inválido o el índice es inválido');
  }
}

doReorderProducts(event: any) {
  const movedItem = this.selectedCategoryProduct.products.splice(event.detail.from, 1)[0]; // Elimina el ítem de la posición original
  this.selectedCategoryProduct.products.splice(event.detail.to, 0, movedItem); // Inserta el ítem en la nueva posición
  event.detail.complete(); // Completa el evento de reordenamiento

  if(this.sizeSubcategoria2 > 0 && this.sizeSubcategoria3 === 0){
   
    //this.productAction = "level3"
    this.updateProductsOrder3();


  }


  if(this.sizeSubcategoria > 0 && this.sizeSubcategoria2 === 0){
   
   // this.productAction = "level2"
    this.updateProductsOrder2();


  }


  if(this.sizeSubcategoria === 0 && this.sizeCategories > 0){
   
    //this.productAction = "level1"
  this.updateProductsOrder();


  }
  // Llama a la función para actualizar el orden en Firestore
}
async updateProductsOrder2() {

    if (this.currentIdDoc && this.indexSubcategoria1 >= 0) {
      await this.presentLoading('Actualizando subcategoría...');
      try {
        const categoryDocRef = this.firestore
          .collection(`businesses/${this.currentBusiness}/categories`)
          .doc(this.currentIdDoc);
  
        // Obtener el documento y forzar el tipado
        const docSnapshot = await categoryDocRef.get().toPromise();
        
        if (docSnapshot!.exists) {
          // Tipamos los datos como CategoryData
          const data = docSnapshot!.data() as CategoryData;
  
          // Asegurarse de que las subcategorias existan
          const subcategorias = data.subcategorias || [];
  
          // Verificar si el índice es válido
          if (this.indexSubcategoria1 >= 0 && this.indexSubcategoria1 < subcategorias.length) {
            // Actualizar el campo 'name' de la subcategoría en la posición 'indexSubcategoria'
            console.log(subcategorias)
            console.log(this.selectedCategoryProduct)
          
  
            subcategorias[this.indexSubcategoria1].products =  this.selectedCategoryProduct.products;
  
            console.log(subcategorias)
  
    //        this.selectedCategoryProduct['subcategorias'][this.indexSubcategoria1].subcategorias = this.selectedCategory1.subcategorias
            // Actualizar el documento con el array modificado
            await categoryDocRef.update({
  
              subcategorias: subcategorias
            });
  
            this.showToast('Subcategoría actualizada correctamente');
   
          } else {
            this.showToast('Índice de subcategoría no válido');
          }
        } else {
          this.showToast('Documento no encontrado');
        }
      } catch (error) {
        this.showToast('Error al actualizar la subcategoría');
        console.log(error);
      } finally {
        this.loading.dismiss();
      }
    } else {
      this.showToast('El nombre no puede estar vacío, el ID del documento es inválido o el índice es inválido');
    }
  
}
onMouseEnter(event: MouseEvent, text: string) {
  const rect = (event.target as HTMLElement).getBoundingClientRect();
  this.tooltipPositionX = rect.left + rect.width / 2; // Centrar el tooltip horizontalmente
  this.tooltipPositionY = rect.top - 10; // Mostrar el tooltip encima del texto
  this.showTooltipText = text
  this.showTooltip = true;
}
onMouseLeave() {
  this.showTooltip = false;
}
async updateProductsOrder3() {

  if (this.currentIdDoc && this.indexSubcategoria1 >= 0) {
    await this.presentLoading('Actualizando subcategoría...');
    try {
      const categoryDocRef = this.firestore
        .collection(`businesses/${this.currentBusiness}/categories`)
        .doc(this.currentIdDoc);

      // Obtener el documento y forzar el tipado
      const docSnapshot = await categoryDocRef.get().toPromise();
      
      if (docSnapshot!.exists) {
        // Tipamos los datos como CategoryData
        const data = docSnapshot!.data() as CategoryData;

        // Asegurarse de que las subcategorias existan
        const subcategorias = data.subcategorias || [];

        // Verificar si el índice es válido
        if (this.indexSubcategoria1 >= 0 && this.indexSubcategoria1 < subcategorias.length) {
          // Actualizar el campo 'name' de la subcategoría en la posición 'indexSubcategoria'
          console.log(subcategorias)
          console.log(this.selectedCategoryProduct)
        

          subcategorias[this.indexSubcategoria1].subcategorias[this.indexSubcategoria2].products =  this.selectedCategoryProduct.products;

          console.log(subcategorias)

  //        this.selectedCategoryProduct['subcategorias'][this.indexSubcategoria1].subcategorias = this.selectedCategory1.subcategorias
          // Actualizar el documento con el array modificado
          await categoryDocRef.update({

            subcategorias: subcategorias
          });

          this.showToast('Subcategoría actualizada correctamente');
 
        } else {
          this.showToast('Índice de subcategoría no válido');
        }
      } else {
        this.showToast('Documento no encontrado');
      }
    } catch (error) {
      this.showToast('Error al actualizar la subcategoría');
      console.log(error);
    } finally {
      this.loading.dismiss();
    }
  } else {
    this.showToast('El nombre no puede estar vacío, el ID del documento es inválido o el índice es inválido');
  }

}
doReorderSubcategoria1(event: any) {
  // Reordena el array 'selectedCategory1.subcategorias'
  const movedItem = this.selectedCategory1.subcategorias.splice(event.detail.from, 1)[0]; // Elimina el ítem de la posición original
  this.selectedCategory1.subcategorias.splice(event.detail.to, 0, movedItem); // Inserta el ítem en la nueva posición
  event.detail.complete(); // Completa el evento de reordenamiento

  // Actualiza el orden en Firestore
  this.updateSubcategoriesOrder(this.indexSubcategoria1);
}

async updateSubcategoriesOrder(indexSubcategoria: number) {

  console.log(indexSubcategoria)
  if (this.currentIdDoc && indexSubcategoria >= 0) {
    await this.presentLoading('Actualizando subcategoría...');
    try {
      const categoryDocRef = this.firestore
        .collection(`businesses/${this.currentBusiness}/categories`)
        .doc(this.currentIdDoc);

      // Obtener el documento y forzar el tipado
      const docSnapshot = await categoryDocRef.get().toPromise();
      
      if (docSnapshot!.exists) {
        // Tipamos los datos como CategoryData
        const data = docSnapshot!.data() as CategoryData;

        // Asegurarse de que las subcategorias existan
        const subcategorias = data.subcategorias || [];

        // Verificar si el índice es válido
        if (indexSubcategoria >= 0 && indexSubcategoria < subcategorias.length) {
          // Actualizar el campo 'name' de la subcategoría en la posición 'indexSubcategoria'
          console.log(subcategorias)
          console.log(this.selectedCategory1.subcategorias)
        

//          subcategorias[indexSubcategoria].subcategorias = this.selectedCategory1.subcategorias;
  //        this.selectedCategoryProduct['subcategorias'][this.indexSubcategoria1].subcategorias = this.selectedCategory1.subcategorias
          // Actualizar el documento con el array modificado
          await categoryDocRef.update({
            subcategorias: this.selectedCategory1.subcategorias
          });

          this.showToast('Subcategoría actualizada correctamente');
 
        } else {
          this.showToast('Índice de subcategoría no válido');
        }
      } else {
        this.showToast('Documento no encontrado');
      }
    } catch (error) {
      this.showToast('Error al actualizar la subcategoría');
      console.log(error);
    } finally {
      this.loading.dismiss();
    }
  } else {
    this.showToast('El nombre no puede estar vacío, el ID del documento es inválido o el índice es inválido');
  }
}

doReorderSubcategoria2(event: any) {
  const movedItem = this.selectedCategory2.subcategorias.splice(event.detail.from, 1)[0]; // Elimina el ítem de la posición original
  this.selectedCategory2.subcategorias.splice(event.detail.to, 0, movedItem); // Inserta el ítem en la nueva posición
  event.detail.complete(); // Completa el evento de reordenamiento

  // Actualiza el orden en Firestore
  this.updateSubcategoriesOrder2(this.indexSubcategoria1);
}

async updateSubcategoriesOrder2(indexSubcategoria: number) {

  console.log(indexSubcategoria)
  if (this.currentIdDoc && indexSubcategoria >= 0) {
    await this.presentLoading('Actualizando subcategoría...');
    try {
      const categoryDocRef = this.firestore
        .collection(`businesses/${this.currentBusiness}/categories`)
        .doc(this.currentIdDoc);

      // Obtener el documento y forzar el tipado
      const docSnapshot = await categoryDocRef.get().toPromise();
      
      if (docSnapshot!.exists) {
        // Tipamos los datos como CategoryData
        const data = docSnapshot!.data() as CategoryData;

        // Asegurarse de que las subcategorias existan
        const subcategorias = data.subcategorias || [];

        // Verificar si el índice es válido
        if (indexSubcategoria >= 0 && indexSubcategoria < subcategorias.length) {
          // Actualizar el campo 'name' de la subcategoría en la posición 'indexSubcategoria'
          console.log(subcategorias)
          console.log(this.selectedCategory2.subcategorias)
        

          subcategorias[indexSubcategoria].subcategorias[this.indexSubcategoria2].subcategorias =  this.selectedCategory2.subcategorias;

          console.log(subcategorias)

  //        this.selectedCategoryProduct['subcategorias'][this.indexSubcategoria1].subcategorias = this.selectedCategory1.subcategorias
          // Actualizar el documento con el array modificado
          await categoryDocRef.update({

            subcategorias: subcategorias
          });

          this.showToast('Subcategoría actualizada correctamente');
 
        } else {
          this.showToast('Índice de subcategoría no válido');
        }
      } else {
        this.showToast('Documento no encontrado');
      }
    } catch (error) {
      this.showToast('Error al actualizar la subcategoría');
      console.log(error);
    } finally {
      this.loading.dismiss();
    }
  } else {
    this.showToast('El nombre no puede estar vacío, el ID del documento es inválido o el índice es inválido');
  }
}


async updateProductsOrder() {
  const categoryRef = this.firestore.collection(`businesses/${this.currentBusiness}/categories`).doc(this.selectedCategoryProduct.id);

  // Asumiendo que la propiedad 'products' almacena el array de productos
  await categoryRef.update({
    products: this.selectedCategoryProduct.products // Actualiza el documento con el nuevo orden de productos
  });
this.loading.dismiss()
  console.log('Products order updated successfully in Firestore!');
}

onTypeComplementoChange(event: any) {
  this.typeComplemento = event.detail.value; // Asigna el valor seleccionado a typeComplemento
  console.log('Tipo de complemento seleccionado:', this.typeComplemento);
}

  // Select a category
  selectCategory(category: any) {
    console.log(category)
    this.sizeSubcategoria2 = 0
    this.sizeProducts = 0
    this.sizeComplementosCreate = 0
    this.sizeSubcategoria = 0
    this.sizeComplementosList = 0
    this.sizeDetails = 0
    this.currentIdDoc = category.id
    if(category.subcategorias === undefined){
      this.sizeSubcategoria = 0
      if(category.products === undefined){
             
      }else{
        if(category.products.length === 0){
          this.sizeProducts = 0
       
        }else{
          this.sizeProducts = 3

        }
      }
    }else{
      if(category.subcategorias.length === 0){
        this.sizeSubcategoria = 0

        if(category.products === undefined){

        }else{
          if(category.products.length === 0){

          }else{
              this.sizeProducts = 3

          }
        }

      }else{
        this.sizeSubcategoria = 3

      }

    }

    this.selectedCategoryProduct = category;
    this.selectedCategory1 = category;
    setTimeout(() => {
     this.scrollRight()
      
    }, 500);

  }

  // Select a product
  selectProduct(product: any, id: number) {
    this.productoIndex = id
    this.selectedProduct = product;
    this.selectedProduct['id'] = id
    this.sizeDetails = 3.5
this.sizeComplementosList = 3
    console.log(this.selectedProduct)

  }
  selectSubcategory(product: any, id: number) {
    setTimeout(() => {
     this.scrollRight()
      
    }, 500);
    console.log(product)
    this.indexSubcategoria1 = id
    this.sizeDetails = 0

    if(product.products === undefined){
      console.log("982")
      if(product.subcategorias === undefined){
          this.sizeSubcategoria2 = 0
            
      }else{
        if(product.subcategorias.length > 0){
          this.sizeSubcategoria2 = 3
          this.selectedCategory2 = product
        }else{
          this.sizeSubcategoria2 = 0
          this.selectedCategory2 = product
        }
   

      }

    }else{
      if(product.products.length === 0){
        console.log("1000")

 
        if(product.subcategorias === undefined){
        
        }else{
          if(product.subcategorias.length === 0){

          }else{
        this.selectedCategory2 = product

        this.sizeSubcategoria2 = 3
        this.sizeProducts = 0
          }
        }

      }else {
      console.log("1017")

        this.sizeSubcategoria2 = 0
        this.sizeProducts = 3
        this.selectedCategoryProduct = product

      }
    }

   this.sizeCategories = 3

console.log(this.selectedCategory2)
  }

selectSubcategory2(product: any,index:number) {
  this.indexSubcategoria2 = index
  this.sizeDetails = 0
console.log(product)
 if(product.products === undefined){
   if(product.subcategorias === undefined){
    this.sizeSubcategoria3 = 0
   }else{
    if(product.products.length === 0){
    
    }else{
      this.sizeProducts = 3

    }
    
   }
 }else{
   if(product.products.length === 0){

   }else{
     this.sizeSubcategoria3 = 0
     this.sizeProducts = 3
     this.selectedCategoryProduct = product
   }
 }
this.sizeCategories = 3
console.log(this.selectedCategory3)

}


    selectSubcategory3(product: any, id: number) {
console.log(product)
 if(product.products === undefined){
   if(product.subcategorias === undefined){
    this.sizeSubcategoria3 = 3
   // this.selectedCategory3 = product
   }else{
     this.sizeSubcategoria3 = 3
   //  this.selectedCategory3 = product

   }

 }else{
   if(product.products.length === 0){


   }else{
     this.sizeSubcategoria3 = 3
     this.sizeProducts = 3
    // this.selectedCategoryProduct = product

   }
 }



this.sizeCategories = 3

console.log(this.selectedCategory3)

   }
  single(){
    document.getElementById("singleRadio")?.click()

  }
  multi(){
    document.getElementById("multiRadio")?.click()

  }
  editTopping(index: number) {
    // Obtener el complemento seleccionado
    const selectedTopping = this.selectedProduct.toppings[index];
  console.log(selectedTopping)
  this.items = selectedTopping['toppings']
  this.complemento = selectedTopping['nameTopping']
  this.typeComplemento = selectedTopping['type']
  if(this.typeComplemento === 'single'){
    document.getElementById("singleRadio")?.click()

  }else{
document.getElementById("multiRadio")?.click()

  }
    // Forzar la detección de cambios
    this.cdr.detectChanges();
  }
  removeTopping(index: number) {
    // Eliminar el complemento del array 'toppings'
    this.selectedProduct.addons.splice(index, 1);
    console.log(this.selectedProduct.addons)
  
  }
  async saveProductChanges3() {
    try {
   
      // Referencia al documento de la categoría
      console.log(this.selectedProduct);
      console.log(this.currentIdDoc);  // ID de la categoría
      console.log(this.currentBusiness);  // ID del negocio
  
      // Referencia al documento de la categoría que contiene las subcategorías
      const categoryDocRef = doc(this.firestore.firestore, `businesses/${this.currentBusiness}/categories/${this.currentIdDoc}`);
      
      // Obtener el documento de la categoría
      const categoryDoc = await getDoc(categoryDocRef);
      console.log(categoryDoc);
      
      if (categoryDoc.exists()) {
        const categoryData = categoryDoc.data();
        console.log(categoryData);
        
        // Acceder al array de subcategorías
        const subcategorias = categoryData['subcategorias'] || [];
        console.log(subcategorias);
        
        // Verificar si la subcategoría existe
        const subcategory = subcategorias[this.indexSubcategoria1]; // Acceder a la subcategoría por su índice o ID
        console.log(subcategory)
        if (subcategory) {
          const products = subcategory['subcategorias'][this.indexSubcategoria2]['products'] || []; // Acceder a los productos dentro de la subcategoría
          console.log(products);
          
          // Buscar el índice del producto que deseas actualizar
    
            // Actualizar el producto en su índice correcto
            console.log(this.productoIndex)
            products[this.productoIndex] = {
              ...products[this.productoIndex], // Mantener las demás propiedades del producto intactas
              nombre: this.selectedProduct.nombre || "",
              precio: this.selectedProduct.precio || "0",
              desc: this.selectedProduct.desc || "",
              active: this.selectedProduct.active || false,
              Disc: this.selectedProduct.Disc || '0',
              imageLowRes: this.selectedProduct.imageLowRes || '',
              addons:this.selectedProduct.addons || [],
            
         
            };
            
            // Actualizar la subcategoría con los productos modificados
            console.log(products)
            
            console.log(subcategorias)
            console.log(subcategorias[this.indexSubcategoria1]['subcategorias'][this.indexSubcategoria2]['products'])
            subcategorias[this.indexSubcategoria1]['subcategorias'][this.indexSubcategoria2]['products'] = products;
            

            // Guardar el array actualizado en Firestoresubcategories
            await updateDoc(categoryDocRef, { subcategorias });
            console.log('Producto actualizado correctamente dentro de la subcategoría');
            this.showToast('Producto actualizado correctamente dentro de la subcategoría');
          
          
        } else {
          console.error('Subcategoría no encontrada');
        }
      } else {
        console.error('Categoría no encontrada');
      }
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
    }
  }
  async saveProductChanges2() {
    try {
     
      // Referencia al documento de la categoría
      console.log(this.selectedProduct);
      console.log(this.currentIdDoc);  // ID de la categoría
      console.log(this.currentBusiness);  // ID del negocio
  
      // Referencia al documento de la categoría que contiene las subcategorías
      const categoryDocRef = doc(this.firestore.firestore, `businesses/${this.currentBusiness}/categories/${this.currentIdDoc}`);
      
      // Obtener el documento de la categoría
      const categoryDoc = await getDoc(categoryDocRef);
      console.log(categoryDoc);
      
      if (categoryDoc.exists()) {
        const categoryData = categoryDoc.data();
        console.log(categoryData);
        
        // Acceder al array de subcategorías
        const subcategorias = categoryData['subcategorias'] || [];
        console.log(subcategorias);
        console.log(this.indexSubcategoria1);
        
        // Verificar si la subcategoría existe
        const subcategory = subcategorias[this.indexSubcategoria1]; // Acceder a la subcategoría por su índice o ID
        console.log(subcategory)
        if (subcategory) {
          const products = subcategory['products'] || []; // Acceder a los productos dentro de la subcategoría
          console.log(products);
          
          // Buscar el índice del producto que deseas actualizar
       
         console.log(products[0])
         console.log(this.selectedProduct)
            // Actualizar el producto en su índice correcto
            products[this.productoIndex] = {
              ...products[this.productoIndex], // Mantener las demás propiedades del producto intactas
              nombre: this.selectedProduct.nombre || "",
              precio: this.selectedProduct.precio || "0",
              desc: this.selectedProduct.desc || "",
              Disc: this.selectedProduct.Disc || '0',
              imageLowRes: this.selectedProduct.imageLowRes || '',
              addons:this.selectedProduct.addons || [] ,
              active: this.selectedProduct.active || false,
              destacado: this.selectedProduct.destacado || false,
              exclusivo: this.selectedProduct.exclusivo || false
            };
            
            // Actualizar la subcategoría con los productos modificados
            console.log(products)
            console.log(subcategorias)
            
            subcategorias[this.indexSubcategoria1]['products'] = products;
            
            console.log(subcategorias)
            // Guardar el array actualizado en Firestoresubcategories
            await updateDoc(categoryDocRef, { subcategorias });
            console.log('Producto actualizado correctamente dentro de la subcategoría');
            this.showToast('Producto actualizado correctamente dentro de la subcategoría');
        } else {
          console.error('Subcategoría no encontrada');
        }
      } else {
        console.error('Categoría no encontrada');
      }
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
    }
  }
  
  
  async saveCustomizationChanges() {
    this.sizeComplementosCreate = 0
    this.sizeComplementosList = 0
    setTimeout(() => {
    this.sizeComplementosList = 4
      
    }, 2000);
    this.complemento = ""
    this.items = []
    this.typeComplemento = ""
    try {
      const { id: categoryId } = this.selectedCategoryProduct; // Obtener ID de la categoría
      const productId = this.selectedCategoryProduct.id; // Obtener el ID del producto
  
      // Referencia al documento de la categoría
      const categoryDocRef = doc(this.firestore.firestore, `businesses/${this.currentBusiness}/categories/${categoryId}`);
  
      // Obtener el documento de la categoría
      const categoryDoc = await getDoc(categoryDocRef);
      if (categoryDoc.exists()) {
        const categoryData = categoryDoc.data();
        const products = categoryData['products'] || []; // Acceder a la propiedad 'products'
  
        // Verifica si la propiedad toppings ya existe, si no, inicializa como un array
          if (!products[productId].toppings) {
            products[productId].toppings = []; // Inicializa toppings como un array vacío
          }
  
          // Crear un nuevo topping a agregar
          const newTopping = {
            nameTopping: this.complemento,
            type: this.typeComplemento,
            // oblig: this.obligatorio, // Descomenta esto si tienes una propiedad llamada 'oblig'
            toppings: this.items, // Asigna los items actuales
            active:true
          };
  
          // Agrega el nuevo topping al array
          products[productId].toppings.push(newTopping);
  
          // Guardar el array actualizado en Firestore
          await updateDoc(categoryDocRef, { products });
          console.log('Complementos actualizados correctamente');
        
      } else {
        console.error('Categoría no encontrada');
      }
    } catch (error) {
      console.error('Error al actualizar los complementos:', error);
    }
  }
  
  cancelComplementosAddProduct(){
  
    this.sizeComplementosCreate = 0
    this.sizeProducts = 3
    this.sizeCategories = 3
   
  }
  
  showToppingCard(){
this.sizeComplementosCreate = 4
this.sizeCategories = 0
this.sizeProducts = 0
  }
  cancelTopping(){
   
  }
  async addProductThird(position:number) {
    const alert = await this.alertController.create({
      header: 'Nuevo Producto',
      inputs: [
        { name: 'nombre', type: 'text', placeholder: 'Nombre del producto' },
        { name: 'precio', type: 'text', placeholder: 'Precio del producto' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'Aceptar',
          handler: async (data: any) => {
              await this.createProductThird(this.currentIdDoc,data.nombre, data.precio,position,position);
              console.log('sdmksmkdsmk')
            if (data.nombre.trim() && data.precio.trim()) {
            }
            
          }
        }
      ]
    });
    await alert.present();
  }
  async addProductSecond(position:number) {
    const alert = await this.alertController.create({
      header: 'Nuevo Producto',
      inputs: [
        { name: 'nombre', type: 'text', placeholder: 'Nombre del producto' },
        { name: 'precio', type: 'text', placeholder: 'Precio del producto' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'Aceptar',
          handler: async (data: any) => {
              await this.createProductSecond(this.currentIdDoc,data.nombre, data.precio,position,position);
              console.log('add product second')
            if (data.nombre.trim() && data.precio.trim()) {
            }
            
          }
        }
      ]
    });
    await alert.present();
  }
  // Alert to add a new product to the selected category
  async addProduct() {
    const alert = await this.alertController.create({
      header: 'Nuevo Producto',
      inputs: [
        { name: 'nombre', type: 'text', placeholder: 'Nombre del producto' },
        { name: 'precio', type: 'text', placeholder: 'Precio del producto' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'Aceptar',
          handler: async (data: any) => {
             console.log('addproduct')

            if (data.nombre.trim() && data.precio.trim()) {
              await this.createProduct(data.nombrepresentPopover);
            }
          }
        }
      ]
    });
    await alert.present();
    
  }

  // Create new product in Firestore

  // Asumiendo que ya tienes acceso a Firestore como this.firestore
  
  async createProduct(item:any) {
    await this.presentLoading('Guardando producto...');
    try {
      
        // Asumir que tienes la URL de las imágenes o dejarlas vacías si es aplicable
        const imageHDUrl = 'https://st3.depositphotos.com/23594922/31822/v/450/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg';  // Reemplaza esto con la lógica para URL de imagen si es aplicable
        const imageLowResUrl = 'https://st3.depositphotos.com/23594922/31822/v/450/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg';  // Reemplaza esto con la lógica para URL de imagen si es aplicable
        const firestoreTimestamp = Timestamp.now(); 
        // Crear el nuevo objeto producto
        const newProduct = {
            nombre: item.nombreProducto,
            precio: item.precio,
            Disc: item.descuento,
            desc: item.descripcion,
            id:firestoreTimestamp,
            sku: item.sku,
            active:true,
            pcoste: item.precioCoste,
            imageHD: imageHDUrl,  // URL de imagen (opcional)
            imageLowRes: item.fotoProducto,  // URL de imagen en baja resolución (opcional)
            fechaCreacion: new Date()  // Timestamp para la fecha de creación
        };

        // Obtén la instancia de Firestore
        const firestore = getFirestore();

        // Referencia al documento de la categoría
        const categoryRef = doc(firestore, `businesses/${this.currentBusiness}/categories/${this.currentIdDoc}`);

        // Actualizar el documento de la categoría para agregar el nuevo producto al campo array
        await updateDoc(categoryRef, {
            products: arrayUnion(newProduct) // Agregar el nuevo producto al array
        });

        this.showToast('Producto creado correctamente');
        this.loadCategories()
    } catch (error) {
        console.error('Error al crear el producto:', error);
        this.showToast('Error al crear el producto');
    } finally {
        this.loading.dismiss();
    }
}
updateItem(index: number, field: 'name' | 'Precio', event: any) {
  if (field === 'Precio') {
    this.items[index][field] = Number(event.target.value); // Convierte a número para precio
  } else {
    this.items[index][field] = event.target.value; // Asigna el valor como string para tipo
  }
}
removeItem(index: number) {
  this.items.splice(index, 1);
}
addItem() {
  this.items.push({ name: "", Precio: 0 , active:true });
}
  // Delete product from Firestore
  async deleteProduct(product: any) {
    await this.presentLoading('Eliminando producto...');
    try {
        const { id: categoria } = this.selectedCategoryProduct; // Extrae el ID de la categoría seleccionada
        const firestore = getFirestore();
        const categoryRef = doc(firestore, `businesses/${this.currentBusiness}/categories/${categoria}`);

        // Eliminar el producto del array
        await updateDoc(categoryRef, {
            products: arrayRemove(product) // Eliminar el producto del array
        });

        this.showToast('Producto eliminado correctamente');
        this.loadCategories(); // Vuelve a cargar las categorías después de eliminar
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        this.showToast('Error al eliminar el producto');
    } finally {
        this.loading.dismiss();
    }
}
enableEdit(field: string) {
  // Lógica para habilitar la edición de un campo específico
  console.log(`Editando campo: ${field}`);
}


async presentPopoverSubcategoria(ev: Event, item: any, type: string, position:number) {
  console.log(item);
  console.log(item.subcategorias);
  this.indexSubcategoria1 = position
  this.sizeProducts = 0
  this.sizeDetails = 0
  this.sizeDetails = 0
  let subcategoria = true;
  let products = true;
  // Comprobamos si 'subcategorias' y 'products' están definidos
  const hasSubcategorias = Array.isArray(item.subcategorias) && item.subcategorias.length > 0;
  const hasProducts = Array.isArray(item.products) && item.products.length > 0;
  // Condiciones según lo especificado
  if (!hasSubcategorias && hasProducts) {
    // Si 'subcategorias' es undefined o su longitud es 0, y 'products' tiene datos
    products = true;
    subcategoria = false;
    console.log('Products es verdadero y subcategoría es falso.');
  } else if (!hasSubcategorias && !hasProducts) {
    // Si ambos son nulos o tienen longitud 0
    products = true;
    subcategoria = true;
    console.log('No hay productos ni subcategorías, ambas son verdaderas.');
  } else if (hasSubcategorias) {
    // Si 'subcategorias' tiene longitud mayor a 0
    products = false;
    subcategoria = true;
    console.log('Hay subcategorías, productos es falso y subcategoría es verdadero.');
  }
  const popover = await this.popoverController.create({
    component: EditProductComponent,
    event: ev,
    translucent: true,
    componentProps: { item, type, subcategoria, products }
  });
  // Escuchar el evento 'actionPerformed' del popover
  popover.onDidDismiss().then((data) => {
    if (data.data) {
      console.log('Datos recibidos del popover:', data.data);
      if(data.data.action === 'add-product'){
this.openCreateProductModal2(position, {inactive:true}, "create")

      }
      if(data.data.action === 'add-subcategoria'){
        this.addSubcategorySecond(position)

      }
      if(data.data.action === 'delete'){

        this.deleteSubcategoria1()
      }
      if(data.data.action === 'desactivar'){
      
        if(item.active === undefined){
          item.active = true
        }

        if(item.active === true){
          this.enableSubCategory1(false,this.indexSubcategoria1)

        }
        if(item.active === false){
          this.enableSubCategory1(true,this.indexSubcategoria1)

        }
        console.log("1232")
       }
      if(data.data.action === 'edit'){
   
         this.alertEditFieldSubCategory1()
       }
      // Aquí puedes manejar la acción recibida
      // Por ejemplo, puedes actualizar tu lista de productos o subcategorías
    }
  });

  await popover.present();
}
async presentPopoverSubcategoria2(ev: Event, item: any, type: string, position:number) {
  console.log(item);
  console.log(item.subcategoria);
  this.indexSubcategoria2 = position
  this.sizeDetails = 0
  let subcategoria = true;
  let products = true;
  
  // Comprobamos si 'subcategorias' y 'products' están definidos
  const hasSubcategorias = Array.isArray(item.subcategorias) && item.subcategorias.length > 0;
  const hasProducts = Array.isArray(item.products) && item.products.length > 0;
  
  // Condiciones según lo especificado
  if (!hasSubcategorias && hasProducts) {
    // Si 'subcategorias' es undefined o su longitud es 0, y 'products' tiene datos
    products = true;
    subcategoria = false;
    console.log('Products es verdadero y subcategoría es falso.');
  } else if (!hasSubcategorias && !hasProducts) {
    // Si ambos son nulos o tienen longitud 0
    products = true;
    subcategoria = true;
    console.log('No hay productos ni subcategorías, ambas son verdaderas.');
  } else if (hasSubcategorias) {
    // Si 'subcategorias' tiene longitud mayor a 0
    products = false;
    subcategoria = true;
    console.log('Hay subcategorías, productos es falso y subcategoría es verdadero.');
  }

  const popover = await this.popoverController.create({
    component: EditProductComponent,
    event: ev,
    translucent: true,
    componentProps: { item, type, subcategoria, products }
  });

  // Escuchar el evento 'actionPerformed' del popover
  popover.onDidDismiss().then((data) => {
    if (data.data) {
      console.log('Datos recibidos del popover:', data.data);
      if(data.data.action === 'add-product'){

this.openCreateProductModal3(position,{inactive:true},"create")
      }
      if(data.data.action === 'add-subcategoria'){
        this.addSubcategoryThird(position)
      
      }
      if(data.data.action === 'delete'){
        this.deleteSubcategoria2()
      
      }
      if(data.data.action === 'desactivar'){
      
        if(item.active === undefined){
          item.active = true
        }

        if(item.active === true){
          this.enableSubCategory2(false,this.indexSubcategoria1)

        }
        if(item.active === false){
          this.enableSubCategory2(true,this.indexSubcategoria1)

        }
        console.log("1232")
       }
      if(data.data.action === 'edit'){
        this.alertEditFieldSubCategory2()
      
      }
      // Aquí puedes manejar la acción recibida
      // Por ejemplo, puedes actualizar tu lista de productos o subcategorías
    }
  });

  await popover.present();
}
async presentPopoverSubcategoriaFinal(ev: Event, item: any, type: string, position:number) {
  console.log(item);
  console.log(item.subcategoria);
  
  let subcategoria = false;
  let products = true;

 

  const popover = await this.popoverController.create({
    component: EditProductComponent,
    event: ev,
    translucent: true,
    componentProps: { item, type, subcategoria, products }
  });

  // Escuchar el evento 'actionPerformed' del popover
  popover.onDidDismiss().then((data) => {
    if (data.data) {
      console.log('Datos recibidos del popover:', data.data);
      if(data.data.action === 'add-product'){
  //    this.addProductFourth()
  
      }
   
      // Aquí puedes manejar la acción recibida
      // Por ejemplo, puedes actualizar tu lista de productos o subcategorías
    }
  });

  await popover.present();
}

reorderToppings(event: any) {
  const itemToMove = this.selectedProduct.addons.splice(event.detail.from, 1)[0];
  this.selectedProduct.addons.splice(event.detail.to, 0, itemToMove);
  event.detail.complete();
  console.log(this.selectedProduct.addons)
}
deleteProduct1(index:number){
  const categoryDocRef = doc(this.firestore.firestore, `businesses/${this.currentBusiness}/categories/${this.currentIdDoc}`);

  getDoc(categoryDocRef).then((docSnapshot) => {
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      const products = data?.['products'] || [];

      // Verifica si el índice es válido
      if (index >= 0 && index < products.length) {
        // Elimina la subcategoría en la posición currentIndex
        products.splice(index, 1);

        // Actualiza el documento con el array modificado
        updateDoc(categoryDocRef, {
          products: products
        })
        .then(() => {
          console.log('Subcategoría eliminada con éxito');
        })
        .catch((error:any) => {
          console.error('Error al actualizar el documento: ', error);
        });
      } else {
        console.error('Índice no válido');
      }
    } else {
      console.error('Documento no encontrado');
    }
  }).catch((error:any) => {
    console.error('Error al obtener el documento: ', error);
  });
}

deleteProduct2(index:number){
  const categoryDocRef = doc(this.firestore.firestore, `businesses/${this.currentBusiness}/categories/${this.currentIdDoc}`);

  getDoc(categoryDocRef).then((docSnapshot) => {
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      console.log(data);

      // Accedemos a la lista de subcategorías principales
      let products = data?.['subcategorias'] || [];
console.log(products)
      // Accedemos a la subcategoría anidada (suponiendo que está en la posición 0 de subcategorias)
      let subcategoriaAnidada = products[this.indexSubcategoria1]?.products || [];

      console.log(subcategoriaAnidada);

      // Verificamos si el índice es válido
   
        // Eliminamos la subcategoría en la posición `indexSubcategoria2`
        subcategoriaAnidada.splice(index, 1);

        console.log(subcategoriaAnidada)
        console.log(products[this.indexSubcategoria1])

        // Actualizamos el array anidado en su posición original dentro de `subcategorias`
        products[this.indexSubcategoria1].products = subcategoriaAnidada;

        console.log(products)
        // Actualizamos el documento completo con el array modificado
        updateDoc(categoryDocRef, {
          subcategorias: products
        })
        .then(() => {
          console.log('Subcategoría anidada eliminada con éxito');
        })
        .catch((error:any) => {
          console.error('Error al actualizar el documento: ', error);
        });
  
    } else {
      console.error('Documento no encontrado');
    }
  }).catch((error:any) => {
    console.error('Error al obtener el documento: ', error);
  });
}
toggleActive(event: any) {
  
  this.selectedProduct.active = event.detail.checked;
  // Aquí puedes hacer cualquier otra acción, como actualizar el estado en Firestore.
  console.log('Product active status changed to:', this.selectedProduct.active);
if(this.sizeSubcategoria === 0){
  this.saveProductChanges()

}
if(this.sizeSubcategoria > 0){
  this.saveProductChanges2()

}
if(this.sizeSubcategoria2 > 0){
  this.saveProductChanges3()
}
}
toggleActiveDestacado(event: any) {
  
  this.selectedProduct.destacado = event.detail.checked;
  // Aquí puedes hacer cualquier otra acción, como actualizar el estado en Firestore.
  console.log('Product active status changed to:', this.selectedProduct.destacado);
  if(this.selectedProduct.destacado === true){
    this.agregarProductoDestacado(this.selectedProduct)
  }
if(this.sizeSubcategoria === 0){
  this.saveProductChanges()

}
if(this.sizeSubcategoria > 0){
  this.saveProductChanges2()

}
if(this.sizeSubcategoria2 > 0){
  this.saveProductChanges3()
}
}
toggleActiveExclusivo(event: any) {
  
  this.selectedProduct.exclusivo = event.detail.checked;
  // Aquí puedes hacer cualquier otra acción, como actualizar el estado en Firestore.
  console.log('Product active status changed to:', this.selectedProduct.exclusivo);
if(this.sizeSubcategoria === 0){
  this.saveProductChanges()

}
if(this.sizeSubcategoria > 0){
  this.saveProductChanges2()

}
if(this.sizeSubcategoria2 > 0){
  this.saveProductChanges3()
}
}
async presentPopoverProductos(ev: Event, item: any, index: number) {
  console.log(item);


  let subcategoria = true;
  let products = true;
  if(this.sizeSubcategoria2 > 0 && this.sizeSubcategoria3 === 0){
   
    this.productAction = "level3"
  }
  if(this.sizeSubcategoria > 0 && this.sizeSubcategoria2 === 0){
   
    this.productAction = "level2"
  }


  if(this.sizeSubcategoria === 0 && this.sizeCategories > 0){
   
    this.productAction = "level1"

  }


  const popover = await this.popoverController.create({
    component: ActionProductsComponent,
    event: ev,
    translucent: true,
    componentProps: { item, index, subcategoria, products }
  });

  // Escuchar el evento 'actionPerformed' del popover
  popover.onDidDismiss().then((data) => {
    if (data.data) {
      console.log('Datos recibidos del popover:', data.data);
   
      if(data.data.action === 'edit'){
        console.log("1864")
      if(this.productAction === 'level1'){
          console.log("1866")
          this.openCreateProductModal(item, "edit")
      }else if (this.productAction === 'level2'){
        console.log("1868")
      //  this.openCreateProductModal3(index,item)
        this.openCreateProductModal2(index,item, "edit")
//
      }else if (this.productAction === 'level3'){
     

      }
    }
      if(data.data.action === 'delete'){
       // this.deleteProduct()
       // this.deleteCategory()
    
       if(this.productAction === "level1"){
        this.deleteProduct1(index)

       }
       if(this.productAction === "level2"){
        this.deleteProduct2(index)

       }
      }
    }
      // Aquí puedes manejar la acción recibida
      // Por ejemplo, puedes actualizar tu lista de productos o subcategorías
    
  });

  await popover.present();
}

async presentPopover(ev: Event, item: any, type: string) {
  console.log(item);

  this.selectCategory(item)

  let subcategoria = true;
  let products = true;
  
  // Comprobamos si 'subcategorias' y 'products' están definidos
  const hasSubcategorias = Array.isArray(item.subcategorias) && item.subcategorias.length > 0;
  const hasProducts = Array.isArray(item.products) && item.products.length > 0;
  
  // Condiciones según lo especificado
  if (!hasSubcategorias && hasProducts) {
    // Si 'subcategorias' es undefined o su longitud es 0, y 'products' tiene datos
    products = true;
    subcategoria = false;
    console.log('Products es verdadero y subcategoría es falso.');
  } else if (!hasSubcategorias && !hasProducts) {
    // Si ambos son nulos o tienen longitud 0
    products = true;
    subcategoria = true;
    console.log('No hay productos ni subcategorías, ambas son verdaderas.');
  } else if (hasSubcategorias) {
    // Si 'subcategorias' tiene longitud mayor a 0
    products = false;
    subcategoria = true;
    console.log('Hay subcategorías, productos es falso y subcategoría es verdadero.');
  }
  
  // Aquí puedes manejar la lógica adicional que necesites
  

  const popover = await this.popoverController.create({
    component: EditProductComponent,
    event: ev,
    translucent: true,
    componentProps: { item, type, subcategoria, products }
  });

  // Escuchar el evento 'actionPerformed' del popover
  popover.onDidDismiss().then((data) => {
    if (data.data) {
      console.log('Datos recibidos del popover:', data.data);
      if(data.data.action === 'add-product'){
//this.addProduct()
this.openCreateProductModal({inactive: true}, "create")
        }
      if(data.data.action === 'add-subcategoria'){
        this.addSubcategory()

      }
      if(data.data.action === 'delete'){
        this.deleteCategory()

      }
      if(data.data.action === 'edit'){
        this.alertEditFieldCategory()

      }
      if(data.data.action === 'desactivar'){
     
        if(item.active === undefined){
          item.active = true
        }
        if(item.active === true){
          this.activarCategory(false)

        }
        if(item.active === false){
          this.activarCategory(true)

        }
      }
      
      // Aquí puedes manejar la acción recibida
      // Por ejemplo, puedes actualizar tu lista de productos o subcategorías
    }
  });

  await popover.present();
}
async alertEditFieldCategory () {
  const alert = await this.alertController.create({
    header: 'Editar categoria',
    inputs: [
      { name: 'categoria', value:  this.selectedCategoryProduct.name, type: 'text', placeholder: 'Escribe aqui..' }
    ],
    buttons: [
      { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
      { text: 'Aceptar', handler: async (data: any) => this.editCategory(data.categoria) }
    ]
  });
  await alert.present();
}
async alertEditFieldSubCategory1 () {
  console.log(this.selectedCategoryProduct)
  console.log(this.selectedCategory2)//caca
  const alert = await this.alertController.create({
    header: 'Editar subcategoria',
    inputs: [
      { name: 'categoria', value:  this.selectedCategoryProduct['subcategorias'][this.indexSubcategoria1].nombre, type: 'text', placeholder: 'Escribe aqui..' }
    ],
    buttons: [
      { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
      { text: 'Aceptar', handler: async (data: any) => this.editSubCategory1(data.categoria, this.indexSubcategoria1) }
    ]
  });
  await alert.present();
}
async alertEditFieldSubCategory2 () {
  console.log(this.selectedCategoryProduct)
  console.log(this.selectedCategory2)

  const alert = await this.alertController.create({
    header: 'Editar subcategoria',
    inputs: [
      { name: 'categoria', value:  this.selectedCategory2['subcategorias'][this.indexSubcategoria2].nombre, type: 'text', placeholder: 'Escribe aqui..' }
    ],
    buttons: [
      { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
      { text: 'Aceptar', handler: async (data: any) => this.editSubCategory2(data.categoria, this.indexSubcategoria1) }
    ]
  });
  await alert.present();
}
deleteCategory(){
  const categoryDocRef = doc(this.firestore.firestore, `businesses/${this.currentBusiness}/categories/${this.currentIdDoc}`);
  this.sizeSubcategoria = 0
this.sizeSubcategoria2 = 0
this.sizeSubcategoria3 = 0
this.sizeProducts = 0
deleteDoc(categoryDocRef)
  .then(() => {
    console.log('Documento eliminado con éxito');
  })
  .catch((error:any) => {
    console.error('Error al eliminar el documento: ', error);
  });
}






deleteSubcategoria1(){
  const categoryDocRef = doc(this.firestore.firestore, `businesses/${this.currentBusiness}/categories/${this.currentIdDoc}`);

  getDoc(categoryDocRef).then((docSnapshot) => {
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      const subcategorias = data?.['subcategorias'] || [];

      // Verifica si el índice es válido
      if (this.indexSubcategoria1 >= 0 && this.indexSubcategoria1 < subcategorias.length) {
        // Elimina la subcategoría en la posición currentIndex
        subcategorias.splice(this.indexSubcategoria1, 1);

        // Actualiza el documento con el array modificado
        updateDoc(categoryDocRef, {
          subcategorias: subcategorias
        })
        .then(() => {
          console.log('Subcategoría eliminada con éxito');
        })
        .catch((error:any) => {
          console.error('Error al actualizar el documento: ', error);
        });
      } else {
        console.error('Índice no válido');
      }
    } else {
      console.error('Documento no encontrado');
    }
  }).catch((error:any) => {
    console.error('Error al obtener el documento: ', error);
  });
}

deleteSubcategoria2(){
  const categoryDocRef = doc(this.firestore.firestore, `businesses/${this.currentBusiness}/categories/${this.currentIdDoc}`);

  getDoc(categoryDocRef).then((docSnapshot) => {
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      console.log(data);

      // Accedemos a la lista de subcategorías principales
      let subcategorias = data?.['subcategorias'] || [];
      console.log(subcategorias)
      console.log(this.indexSubcategoria2)
      // Accedemos a la subcategoría anidada (suponiendo que está en la posición 0 de subcategorias)
      let subcategoriaAnidada = subcategorias[this.indexSubcategoria1]?.subcategorias || [];

      console.log(subcategoriaAnidada);

      // Verificamos si el índice es válido
      if (this.indexSubcategoria2 < subcategoriaAnidada.length) {
        // Eliminamos la subcategoría en la posición `indexSubcategoria2`
        subcategoriaAnidada.splice(this.indexSubcategoria2, 1);

        // Actualizamos el array anidado en su posición original dentro de `subcategorias`
        subcategorias[this.indexSubcategoria2].subcategorias = subcategoriaAnidada;

        // Actualizamos el documento completo con el array modificado
        updateDoc(categoryDocRef, {
          subcategorias: subcategorias
        })
        .then(() => {
          console.log('Subcategoría anidada eliminada con éxito');
        })
        .catch((error:any) => {
          console.error('Error al actualizar el documento: ', error);
        });
      } else {
        console.error('Índice no válido');
      }
    } else {
      console.error('Documento no encontrado');
    }
  }).catch((error:any) => {
    console.error('Error al obtener el documento: ', error);
  });
}




  performAction(action: string, item: any) {
    if (action === 'edit') {
     // this.editProduct(item);
    } else if (action === 'delete') {
     
    }
  }

 

  // Update product in Firestore
  async updateProduct(product: any, name: string, price: string) {
    await this.presentLoading('Actualizando producto...');
    try {
        // Obtén la referencia a Firestore
        const firestore = getFirestore();
        
        // Referencia al documento de la categoría
        const categoryRef = doc(firestore, `businesses/${this.currentBusiness}/categories/${this.selectedCategoryProduct.id}`);

        // Crear el nuevo objeto producto actualizado
        const updatedProduct = {
            ...product,
            nombre: name,  // Actualiza el nombre
            precio: price,  // Actualiza el precio
            fechaActualizacion: new Date() // Timestamp para la fecha de actualización
        };

        // Eliminar el producto antiguo del array
        await updateDoc(categoryRef, {
            products: arrayRemove(product) // Eliminar el producto antiguo
        });

        // Agregar el producto actualizado al array
        await updateDoc(categoryRef, {
            products: arrayUnion(updatedProduct) // Agregar el producto actualizado
        });

        this.showToast('Producto actualizado correctamente');
        this.loadCategories(); // Vuelve a cargar las categorías después de actualizar
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        this.showToast('Error al actualizar el producto');
    } finally {
        this.loading.dismiss();
    }
}



  

 

  // Toast helper
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      color:"primary",
      duration: 2000
    });
    toast.present();
  }

  addOption() {
    // Lógica para agregar una opción
  }

  onSubmit() {
    if (this.customizationForm.valid) {
      console.log(this.customizationForm.value);
      // Lógica para manejar la información del formulario
    }
  }
  triggerFileInput() {
    this.fileInput.nativeElement.click(); // Abre el selector de archivos cuando el usuario hace clic en el icono
  }
  async openCreateProductModal(array:any, type:string) {
    console.log(array)
   
    const modal = await this.modalCtrl.create({
      component: ModalCreateProductComponent,
      cssClass: 'custom-modal-products',
      componentProps: {arrayProduct: array}
    });

    // Escuchar cuando se cierre el modal y obtener los datos
    modal.onDidDismiss().then(async (dataReturned) => {
      console.log(dataReturned)
      if (dataReturned.data) {
        
        if(type === "create"){
          await this.createProduct(dataReturned.data);
          this.sizeProducts = 3
  
      
          console.log('Datos del producto:', dataReturned.data);
          const newProduct = {
            nombre: dataReturned.data.nombreProducto,
            precio: dataReturned.data.precio,
            desc:dataReturned.data.descripcion,
            imageLowRes:dataReturned.data.fotoProducto,
            active: true // puedes configurar otros valores iniciales si es necesario
          };
          // Agrega el producto al principio de la lista
          this.selectedCategoryProduct.products.push(newProduct);
          // Aquí puedes procesar los datos recibidos del modal
      
        }else if (type === "edit"){
         
       this.selectedProduct.nombre  = dataReturned.data.nombreProducto || ""
          this.selectedProduct.precio = dataReturned.data.precio || 0
        this.selectedProduct.desc = dataReturned.data.descripcion || ""
          this.selectedProduct.Disc = dataReturned.data.descuento || 0

        this.selectedProduct.horario1 = dataReturned.data.horario1 || ""
        this.selectedProduct.horario2 = dataReturned.data.horario2 || ""
        this.selectedProduct.dias = dataReturned.data.dias || []

          this.selectedProduct.imageLowRes = dataReturned.data.fotoProducto || ""
          this.saveProductChanges()
        }
        
      }else{

     
      }
    });

    return await modal.present();
  }
  async openCreateProductModal2(positionx:number, array:any, type:string) {
  
    const modal = await this.modalCtrl.create({
      component: ModalCreateProductComponent,
      cssClass: 'custom-modal-products',
        componentProps: {arrayProduct:array}
    });
    // Escuchar cuando se cierre el modal y obtener los datos
    modal.onDidDismiss().then(async (dataReturned) => {
      if (dataReturned.data) {
        if(type === "create"){
          await this.createProductSecond(this.currentIdDoc,dataReturned.data.nombreProducto, dataReturned.data.precio,this.indexSubcategoria1,dataReturned.data);
          this.sizeProducts = 3
          console.log('Datos del producto:', dataReturned.data);
          const newProduct = {
            nombre: dataReturned.data.nombreProducto,
            precio: dataReturned.data.precio,
            desc:dataReturned.data.descripcion,
            imageLowRes:dataReturned.data.fotoProducto,
            active: true // puedes configurar otros valores iniciales si es necesario
          };
          // Agrega el producto al principio de la lista
          this.selectedCategoryProduct.products.push(newProduct);
          // Aquí puedes procesar los datos recibidos del modal
          // Aquí puedes procesar los datos recibidos del modal
      
        }else if (type === "edit"){
         
       this.selectedProduct.nombre  = dataReturned.data.nombreProducto || ""
          this.selectedProduct.precio = dataReturned.data.precio || 0
          this.selectedProduct.desc = dataReturned.data.descripcion || ""
          this.selectedProduct.Disc = dataReturned.data.descuento || 0
        this.selectedProduct.horario1 = dataReturned.data.horario1 || ""
        this.selectedProduct.horario2 = dataReturned.data.horario2 || ""
        this.selectedProduct.dias = dataReturned.data.dias || []
          this.selectedProduct.imageLowRes = dataReturned.data.fotoProducto || ""
          this.saveProductChanges2()
        }

      }else{

      }
    });

    return await modal.present();
  }
  async openCreateProductModal3(position:number, array:any, type:string) {
    const modal = await this.modalCtrl.create({
      component: ModalCreateProductComponent,
      cssClass: 'custom-modal-products',
      componentProps: {arrayProduct: array}
    });

    // Escuchar cuando se cierre el modal y obtener los datos
    modal.onDidDismiss().then(async (dataReturned) => {
      if (dataReturned.data) {
        if(type === "create"){
          await this.createProductThird(this.currentIdDoc,dataReturned.data.nombreProducto, dataReturned.data.precio,position,dataReturned.data);
          this.sizeProducts = 3
  
      
          console.log('Datos del producto:', dataReturned.data);
          const newProduct = {
            nombre: dataReturned.data.nombreProducto,
            precio: dataReturned.data.precio,
            desc:dataReturned.data.descripcion,
            imageLowRes:dataReturned.data.fotoProducto,
            active: true // puedes configurar otros valores iniciales si es necesario
          };
          // Agrega el producto al principio de la lista
          this.selectedCategoryProduct.products.push(newProduct);
          // Aquí puedes procesar los datos recibidos del modal
          // Aquí puedes procesar los datos recibidos del modal
      
        }else if (type === "edit"){
         
       this.selectedProduct.nombre  = dataReturned.data.nombreProducto || ""
          this.selectedProduct.precio = dataReturned.data.precio || 0
        this.selectedProduct.desc = dataReturned.data.descripcion || ""
          this.selectedProduct.Disc = dataReturned.data.descuento || 0
          this.selectedProduct.dias = dataReturned.data.dias || []
          this.selectedProduct.imageLowRes = dataReturned.data.fotoProducto || ""
          this.saveProductChanges3()
        }
        
    
        // Aquí puedes procesar los datos recibidos del modal
      }else{

     
      }
    });

    return await modal.present();
  }
  async onFileSelected(event: any, type: 'logo' | 'banner' | 'imageLowRes') {
    const file = event.target.files[0];
    const requiredWidth = 500;
    const requiredHeight = 500;
  console.log("2137")
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
  
      img.onload = () => {
        const width = img.width;
        const height = img.height;
  
        // Verifica si la resolución es exactamente 512 x 512
        if (width !== requiredWidth || height !== requiredHeight) {
          this.showToast(`La imagen debe tener una resolución de exactamente ${requiredWidth}x${requiredHeight}.`);
          return;
        }
  
        // Si la resolución es correcta, proceder con la vista previa y carga
        const reader = new FileReader();
  
        if (type === 'imageLowRes') {
          this.logoFile = file;
    
          // Vista previa del logo
          reader.onload = () => {
            this.logoPreview = reader.result as string; // Guardar la URL de la imagen
          };
          reader.readAsDataURL(file); // Leer el archivo como URL de datos
    
          // Ejecutar la función para subir la imagen después de seleccionarla
          this.updateImage(event, 'imageLowRes');
          
        } else if (type === 'banner') {
          this.bannerFile = file;
    
          // Vista previa del banner
          reader.onload = () => {
            this.bannerPreview = reader.result as string; // Guardar la URL de la imagen
          };
          reader.readAsDataURL(file); // Leer el archivo como URL de datos
    
          // Ejecutar la función para subir la imagen después de seleccionarla
          this.updateImage(event, 'imageLowRes');
        }
      };
    }
  }
  
  
  // Función para subir imágenes a Firebase Storage
 

  updateImage(event: any, field: 'imageLowRes') {
    console.log('Subiendo imagen...');
  
    const file = event.target.files[0];
    if (file) {
      this.uploadImage(file, field).then(downloadURL => {
        // Actualizar la URL de la imagen en el producto
        this.selectedProduct[field] = downloadURL;
        
        // Guardar los cambios en Firestore
    //    this.saveImageToFirestore(field, downloadURL);
      }).catch(error => {
        console.error('Error al subir la imagen:', error);
      });
    }
  }
  cancelDetailsProduct(){
   this.sizeCategories = 3
   this.sizeComplementosList = 0
   this.sizeProducts = 0
   this.sizeDetails = 0
  }
  cancelDetailsProduct2(){
    this.sizeCategories = 3
    this.sizeComplementosList = 0

    this.sizeDetails = 0
   }
  cancelComplementosProduct(){
    this.sizeComplementosList = 0

  }


  async saveProductChanges() {
   
    try {
      // Referencia al documento de la categoría
      console.log(this.selectedProduct);
      console.log(this.currentIdDoc);
      console.log(this.currentBusiness);
      
      const categoryDocRef = doc(this.firestore.firestore, `businesses/${this.currentBusiness}/categories/${this.currentIdDoc}`);
      
      // Obtener el documento de la categoría
      const categoryDoc = await getDoc(categoryDocRef);
      console.log(categoryDoc);
      
      if (categoryDoc.exists()) {
        const categoryData = categoryDoc.data();
        console.log(categoryData);
        
        const products = categoryData['products'] || []; // Acceder a la propiedad 'products'
        console.log(this.selectedProduct);
        console.log(products);
        
        console.log(this.selectedProduct.addons)
        if(this.selectedProduct.addons){

        }else{
          this.selectedProduct.addons = []

        }
        console.log('Días antes de actualizar:', this.selectedProduct.dias);

          // Actualizar el producto en su índice correcto
          products[this.productoIndex] = {
            ...products[this.productoIndex], // Mantener las demás propiedades del producto intactas
            nombre: this.selectedProduct.nombre || "",
            precio: this.selectedProduct.precio || 0,
            desc: this.selectedProduct.desc || "",
            Disc: this.selectedProduct.Disc || 0,
            active: this.selectedProduct.active || false,
            exclusivo: this.selectedProduct.exclusivo || false,
            destacado: this.selectedProduct.destacado || false,
            imageLowRes: this.selectedProduct.imageLowRes || "",
            dias: this.selectedProduct.dias ? [...this.selectedProduct.dias] : [],

            horario1: this.selectedProduct.horario1 || "",
            horario2: this.selectedProduct.horario2 || "",
            addons:this.selectedProduct.addons || []
          };
          
          // Guardar el array actualizado en Firestore
          await updateDoc(categoryDocRef, { products });
          console.log('Producto actualizado correctamente');
          this.showToast('Producto actualizado correctamente');
   
        
      } else {
        console.error('Categoría no encontrada');
      }
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
    }
  }
  
  
  
    
    

  // Función para subir imágenes a Firebase Storage
  async uploadImage(file: File, type: 'logo' | 'banner' | 'imageLowRes'): Promise<string> {
    const filePath = `restaurantes/${type}_${Date.now()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // Devolver una promesa que resuelve la URL de descarga cuando se complete la subida
    return new Promise<string>((resolve, reject) => {
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(downloadURL => {
            resolve(downloadURL);
          }, error => reject(error));
        })
      ).subscribe();
    });
  }
  async addSubcategorySecond(position:number) {
    const alert = await this.alertController.create({
      header: 'Agregar Subcategoría',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre de la subcategoría [2]'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: async (data) => {
            console.log(data)
            await this.updateCategoryInFirestoreSecond(this.selectedCategory1,data.nombre,position);

            if (this.selectedCategory1 && data.nombre) {
              // Actualizar la estructura en la memoria
            //  this.selectedCategory.subcategorias.push({ nombre: data.nombre, productos: [] });
  
              // También actualizar la base de datos
            }
          }
        }
      ]
    });
  
    await alert.present();
  }
 
  async agregarProductoDestacado(nuevoProducto: any) {
    console.log(nuevoProducto)
    nuevoProducto.order = 999;
    nuevoProducto.key = this.currentBusiness;
    nuevoProducto.destacado = true;
    
    try {
      // Convertir la fecha de creación del nuevo producto a un Timestamp
      const fechaCreacionTimestamp = nuevoProducto.fechaCreacion instanceof Timestamp 
        ? nuevoProducto.fechaCreacion 
        : Timestamp.fromDate(new Date(nuevoProducto.fechaCreacion));
  
      // Verificar si ya existe un producto con los mismos datos y la misma fecha de creación
      const querySnapshot = await this.firestore.collection('productos-destacados')
        .ref
        .where('nombre', '==', nuevoProducto.nombre)
        .where('precio', '==', nuevoProducto.precio)
        .get();
  
      if (!querySnapshot.empty) {
        console.log('El producto ya existe en productos-destacados.');
        return; // Evita agregarlo si ya existe
      }
  
      // Agregar el producto si no existe
      const docRef = await this.firestore.collection('productos-destacados').add(nuevoProducto);
      console.log('Documento agregado con ID:', docRef.id);
  
    } catch (error) {
      console.error('Error al agregar documento:', error);
    }
  }
  
  
  async addSubcategoryThird(position:number) {
    const alert = await this.alertController.create({
      header: 'Agregar Subcategoría',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre de la subcategoría'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: async (data) => {
            console.log(data)
            console.log(this.selectedCategory3)
            console.log(this.selectedCategory2)

            
            await this.updateCategoryInFirestoreThird(this.selectedCategory3,data.nombre,position,position);

            if (this.selectedCategory1 && data.nombre) {
              // Actualizar la estructura en la memoria
            //  this.selectedCategory.subcategorias.push({ nombre: data.nombre, productos: [] });
  
              // También actualizar la base de datos
            }
          }
        }
      ]
    });
  
    await alert.present();
  }
  async addSubcategory() {
    const alert = await this.alertController.create({
      header: 'Agregar Subcategoría',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre de la subcategoría'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: async (data) => {
            console.log(data)
            await this.updateCategoryInFirestore(this.selectedCategoryProduct,data.nombre);

            if (this.selectedCategoryProduct && data.nombre) {
              // Actualizar la estructura en la memoria
            //  this.selectedCategory.subcategorias.push({ nombre: data.nombre, productos: [] });
  
              // También actualizar la base de datos
            }
          }
        }
      ]
    });
  
    await alert.present();
  }
  async updateCategoryInFirestore(category: any, name:string) {
    console.log(category)
    this.sizeSubcategoria = 3
    if (name.trim()) {
      await this.presentLoading('Actualizando categoría...');
      const newProduct = {
        nombre: name,
        active: true // puedes configurar otros valores iniciales si es necesario
      };
      // Agrega el producto al principio de la lista
      this.selectedCategory1.subcategorias.push(newProduct);
      try {
        // Accediendo a la categoría específica y actualizando la subcategoría
        await this.firestore
        .collection(`businesses/${this.currentBusiness}/categories`)
        .doc(this.currentIdDoc)
        .update({ 
          subcategorias: arrayUnion(
            { nombre: name, active:true },
          )
        });
        this.showToast('Subcategoría agregada correctamente');
        this.loadCategories(); // Cargar nuevamente las categorías para reflejar los cambios
      } catch (error) {
        this.showToast('Error al agregar la subcategoría');
        console.log(error);
      } finally {
        this.loading.dismiss();
      }
    }
  }
 
  
  async updateCategoryInFirestoreSecond(category: any, name: string, index: number) {
    console.log(category);

    if (name.trim()) {
      await this.presentLoading('Actualizando subcategoría...');
 
      // Agrega el producto al principio de la lista
      console.log(this.selectedCategory2)
      try {
        // Leer el documento actual para obtener el array de subcategorías
        const categoryDoc = await this.firestore
          .collection(`businesses/${this.currentBusiness}/categories`)
          .doc(category.id)
          .get().toPromise();
  
        if (categoryDoc && categoryDoc.exists) {
          const categoryData = categoryDoc.data() as CategoryData; // Cast the data to the interface
          
          if (categoryData.subcategorias && categoryData.subcategorias.length > index) {
            // Modificamos la subcategoría en la posición dada (index)
            let updatedSubcategories = [...categoryData.subcategorias];
  
            // Verificamos si el campo `subcategorias` ya existe dentro del objeto en la posición `index`
            if (!updatedSubcategories[index].subcategorias) {
              updatedSubcategories[index].subcategorias = []; // Creamos el array si no existe
            }
  
            // Agregamos una nueva subcategoría al array `subcategorias` de este objeto
            updatedSubcategories[index].subcategorias!.push({ nombre: name, active:true });
            console.log("2686")
            // Actualizamos el documento con el array modificado
            await this.firestore
              .collection(`businesses/${this.currentBusiness}/categories`)
              .doc(category.id)
              .update({
                subcategorias: updatedSubcategories, // Reescribimos el array entero,
                products: []
              });
              const newProduct = {
                nombre: name,
                active: true // puedes configurar otros valores iniciales si es necesario
              };
              this.selectedCategory2.subcategorias.push(newProduct);
              this.sizeSubcategoria2 = 3
  
            this.showToast('Subcategoría actualizada correctamente');
            this.loadCategories(); // Cargar nuevamente las categorías para reflejar los cambios
          } else {
            this.showToast('El índice está fuera de rango o no existen subcategorías');
          }
        } else {
          this.showToast('El documento de categoría no existe');
        }
      } catch (error) {
        this.showToast('Error al actualizar la subcategoría');
        console.log(error);
      } finally {
        this.loading.dismiss();
      }
    }
  }

  
  
  async updateCategoryInFirestoreThird(category: any, name: string, index: number, subIndex: number) {
    console.log(category);
 
    if (name.trim()) {
      await this.presentLoading('Actualizando categoría...');
      const newProduct = {
        nombre: name,
        active: true // puedes configurar otros valores iniciales si es necesario
      };
      // Agrega el producto al principio de la lista
      try {
        // Leer el documento actual para obtener el array de subcategorías
        const categoryDoc = await this.firestore
          .collection(`businesses/${this.currentBusiness}/categories`)
          .doc(this.currentIdDoc)
          .get().toPromise();
  
        if (categoryDoc && categoryDoc.exists) {
          const categoryData = categoryDoc.data() as CategoryData; // Cast the data to the interface
  
          if (categoryData.subcategorias && categoryData.subcategorias.length > index) {
            // Modificamos la subcategoría en la posición dada (index)
            let updatedSubcategories = [...categoryData.subcategorias];
  
            // Verificar si el array de subcategorías existe
            if (!updatedSubcategories[index].subcategorias) {
              updatedSubcategories[index].subcategorias = []; // Inicializamos el array si no existe
            }
  
            // Verificar si el array de subcategorías dentro de `subIndex` existe
            if (!updatedSubcategories[index].subcategorias[subIndex]) {
              updatedSubcategories[index].subcategorias[subIndex] = { subcategorias: [] }; // Inicializamos el objeto con un array de subcategorías
            }
  
            // Verificar si el array `subcategorias` dentro de `subIndex` tiene un array anidado de subcategorías
            if (!updatedSubcategories[index].subcategorias[subIndex].subcategorias) {
              updatedSubcategories[index].subcategorias[subIndex].subcategorias = []; // Inicializamos el array anidado
            }
  
            // Ahora hacemos el push dentro del array anidado
            updatedSubcategories[index].subcategorias[subIndex].subcategorias.push({
              nombre: name, // Agregamos una nueva subcategoría al array anidado,
              active:true
            });
  
            // Actualizamos el documento con el array modificado
            await this.firestore
              .collection(`businesses/${this.currentBusiness}/categories`)
              .doc(this.currentIdDoc)
              .update({
                subcategorias: updatedSubcategories // Reescribimos el array entero
              });
              this.selectedCategory3.subcategorias.push(newProduct);
              this.sizeSubcategoria3 = 3
  
            this.showToast('Subcategoría anidada agregada correctamente');
            this.loadCategories(); // Cargar nuevamente las categorías para reflejar los cambios
          } else {
            this.showToast('El índice está fuera de rango o no existen subcategorías');
          }
        } else {
          this.showToast('El documento de categoría no existe');
        }
      } catch (error) {
        this.showToast('Error al actualizar la subcategoría');
        console.log(error);
      } finally {
        this.loading.dismiss();
      }
    }
  }
  
  
  
  
  async createProductSecond(
    categoryId: string, 
    productName: string, 
    newPrice: string, 
    index: number,  // Primer nivel de subcategorías
    item: any  // Segundo nivel de subcategorías
  ) {
    
    if (productName.trim()) {
      await this.presentLoading('Actualizando categoría...');
  
      try {
        // Leer el documento actual para obtener el array de subcategorías
        const categoryDoc = await this.firestore
          .collection(`businesses/${this.currentBusiness}/categories`)
          .doc(categoryId)
          .get().toPromise();
  
        if (categoryDoc && categoryDoc.exists) {
          const categoryData = categoryDoc.data() as CategoryData;
          console.log(categoryData);
  
          // Verificar que la subcategoría del primer nivel existe
          if (categoryData.subcategorias && categoryData.subcategorias.length > index) {
            // Clonar las subcategorías para actualizarlas
            let updatedSubcategories = [...categoryData.subcategorias];
           console.log(updatedSubcategories)
            // Verificamos si el array `subcategorias` en el primer nivel existe
            if (!updatedSubcategories[index].products) {
              updatedSubcategories[index].products = []; // Inicializamos el array si no existe
            }
  
  
            // Verificamos si el array `subcategorias` anidado dentro de la subcategoría existe
            if (!updatedSubcategories[index].products) {
              updatedSubcategories[index].products = []; // Inicializamos el array si no existe
            }
            const firestoreTimestamp = Timestamp.now(); 
            // Ahora añadimos la nueva subcategoría al array `subcategorias` del segundo nivel
            updatedSubcategories[index].products.push({
              nombre: productName,
              precio: newPrice,
              desc:item.descripcion,
              id:firestoreTimestamp,
              Disc:item.descuento,
              imageLowRes:item.fotoProducto,
              pcoste: item.precioCoste,
              sku:item.sku,
              active:true
             // Inicializamos el nuevo array de subcategorías anidado
            });
  
            // Actualizamos el documento con el array modificado
            await this.firestore
              .collection(`businesses/${this.currentBusiness}/categories`)
              .doc(categoryId)
              .update({
                subcategorias: updatedSubcategories // Reescribimos el array entero
              });
  
            this.showToast('Subcategoría y array anidado agregados correctamente');
            this.loadCategories(); // Cargar nuevamente las categorías para reflejar los cambios
          } else {
            this.showToast('El índice está fuera de rango o no existen subcategorías');
          }
        } else {
          this.showToast('El documento de categoría no existe');
        }
      } catch (error) {
        this.showToast('Error al actualizar la subcategoría');
        console.log(error);
      } finally {
        this.loading.dismiss();
      }
    }
  }
  
  
  
  
  

async createProductThird(
  categoryId: string, 
  productName: string, 
  newPrice: string, 
  index: number,  // Primer nivel de subcategorías
  item: any  // Segundo nivel de subcategorías
) {

  if (productName.trim()) {
    await this.presentLoading('Actualizando categoría...');

    try {
      // Leer el documento actual para obtener el array de subcategorías
      const categoryDoc = await this.firestore
        .collection(`businesses/${this.currentBusiness}/categories`)
        .doc(categoryId)
        .get().toPromise();

      if (categoryDoc && categoryDoc.exists) {
        const categoryData = categoryDoc.data() as CategoryData;
        console.log(categoryData);

        // Verificar que la subcategoría del primer nivel existe
        if (categoryData.subcategorias) {
          // Clonar las subcategorías para actualizarlas
          let updatedSubcategories = [...categoryData.subcategorias];
         console.log(updatedSubcategories)
          // Verificamos si el array `subcategorias` en el primer nivel existe
          console.log(index)
          if (!updatedSubcategories[this.indexSubcategoria1].subcategorias) {
            updatedSubcategories[this.indexSubcategoria1].subcategorias = []; // Inicializamos el array si no existe
          }


          // Verificamos si el array `subcategorias` anidado dentro de la subcategoría existe
          if (!updatedSubcategories[this.indexSubcategoria1].subcategorias[this.indexSubcategoria2].products) {
            updatedSubcategories[this.indexSubcategoria1].subcategorias[this.indexSubcategoria2].products = []; // Inicializamos el array si no existe
          }
          const firestoreTimestamp = Timestamp.now(); 
          // Ahora añadimos la nueva subcategoría al array `subcategorias` del segundo nivel
          updatedSubcategories[this.indexSubcategoria1].subcategorias[this.indexSubcategoria2].products.push({
            nombre: productName,
            precio: newPrice,
            desc:item.descripcion,
            Disc:item.descuento,
            id:firestoreTimestamp,
            
            imageLowRes:item.fotoProducto,
            pcoste: item.precioCoste,
            sku:item.sku,
            active:true
           // Inicializamos el nuevo array de subcategorías anidado
          });

          // Actualizamos el documento con el array modificado
          await this.firestore
            .collection(`businesses/${this.currentBusiness}/categories`)
            .doc(categoryId)
            .update({
              subcategorias: updatedSubcategories // Reescribimos el array entero
            });

          this.showToast('Subcategoría y array anidado agregados correctamente');
          this.loadCategories(); // Cargar nuevamente las categorías para reflejar los cambios
        } else {
          this.showToast('El índice está fuera de rango o no existen subcategorías');
        }
      } else {
        this.showToast('El documento de categoría no existe');
      }
    } catch (error) {
      this.showToast('Error al actualizar la subcategoría');
      console.log(error);
    } finally {
      this.loading.dismiss();
    }
  }
}


}
