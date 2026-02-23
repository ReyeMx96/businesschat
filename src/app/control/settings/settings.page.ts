import { Component, input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment.prod';
import { ModalAddComponent } from 'src/app/modals/modal-add/modal-add.component';
import { ModalHashtagsComponent } from './modal-hashtags/modal-hashtags.component';
import { ModalTagsRestauranteComponent } from './modal-tags-restaurante/modal-tags-restaurante.component';
// import { ModalDireccionComponent } from 'src/app/modals/modal-direccion/modal-direccion.component';
// import { ModalTagRestaurantComponent } from 'src/app/modals/modal-tag-restaurant/modal-tag-restaurant.component';
// import { ModalhashtagsComponent } from 'src/app/modals/modalhashtags/modalhashtags.component';
interface Restaurante {
  nombre: string;
  categoria: string;
  desc: string;
  direccion: string;
  telefono: string;
  idprint:string;
  email: string;
  activo: boolean;
  autoaceptar: boolean;
  master: boolean;
  currentLat: number;
  currentLng: number;
  autoaceptartype: string;
  rango: string;
  logo: string;
  banner: string;
}
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
slug = ""
  tags: string[] = [];  // Lista para almacenar las etiquetas
  hashtags: string[] = [];  // Lista para almacenar las etiquetas
  tagInput: string = ''; // Variable para el texto del input

  categorias = [
    { nombre: 'Comida', imagen: '../../../assets/icon/comida.png', icono: 'comida-outline' },
    { nombre: 'Supermercados', imagen: '../../../assets/icon/supermercado.png', icono: 'cart-outline' },
    { nombre: 'Antojos y snacks', imagen: '../../../assets/icon/snacks.png', icono: 'pizza-outline' },
    { nombre: 'Cafe y pan', imagen: '../../../assets/icon/cafeypan.png', icono: 'cafe-outline' },
    { nombre: 'Tiendas especiales', imagen: '../../../assets/icon/especiales.png', icono: 'gift-outline' },
    { nombre: 'Belleza y Cuidado', imagen: '../../../assets/icon/belleza.png', icono: 'heart-outline' },
    { nombre: 'Lifestyle', imagen: '../../../assets/icon/lifestyle.png', icono: 'shirt-outline' },
    { nombre: 'Farmacia', imagen: '../../../assets/icon/farmacia.png', icono: 'medkit-outline' },
    { nombre: 'Consume Local', imagen: '../../../assets/icon/consume_local.png', icono: 'leaf-outline' },
    { nombre: 'Mandaditos', imagen: '../../../assets/icon/mandaditos.png', icono: 'bicycle-outline' }
  
    ];
  private storage = getStorage(initializeApp(environment.firebaseConfig));
  logoPreview: string | null = null;
  bannerPreview: string | null = null;
  isDisabled = true
  restaurante: any = {}; // Objeto para almacenar los datos del restaurante
  docId: string = "";         // ID del restaurante (referencia)
  restauranteForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private firestore: AngularFirestore,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
  ) { }

  // Handler para la selección del archivo
  onFileSelected(event: any, type: 'logo' | 'banner') {
    const file = event.target.files[0];
    if (file) {
      this.uploadImage(file, type);
      this.showPreview(file, type); // Mostrar vista previa
    }
  }

  // Función para mostrar vista previa
  showPreview(file: File, type: 'logo' | 'banner') {
    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'logo') {
        this.logoPreview = reader.result as string;
      } else if (type === 'banner') {
        this.bannerPreview = reader.result as string;
      }
    };
    reader.readAsDataURL(file);
  }


addHashTag(tag: string) {
  console.log(tag)
  console.log(this.tags)
  this.hashtags.push(tag.trim()); // Agrega la etiqueta si no está presente
  
}
addTag(tag: string) {
  console.log(tag)
  console.log(this.tags)
  this.tags.push(tag.trim()); // Agrega la etiqueta si no está presente
  
}

  async openEtiquetasModal() {
    const modal = await this.modalCtrl.create({
      component: ModalTagsRestauranteComponent, // Tu componente modal
      cssClass: 'custom-modal',
      componentProps: {

        // Datos opcionales que quieres pasar al modal
        existingTags: this.tags,
      },
    });

    // Mostrar el modal
    await modal.present();

    // Esperar hasta que el modal se cierre y obtener datos de retorno
    const { data } = await modal.onWillDismiss();
    if (data) {
      console.log('Datos recibidos del modal:', data);
    //  this.tags.push(data); // Agrega la etiqueta a la lista
      this.addTag(data)
      this.restauranteForm.patchValue({ Tags: this.tags });
    }
  
}
async openHashtagsModal() {
  const modal = await this.modalCtrl.create({
    component: ModalHashtagsComponent, // Tu componente modal
    cssClass: 'custom-modal',
    componentProps: {

      // Datos opcionales que quieres pasar al modal
      existingHashTags: this.hashtags,
    },
  });

  // Mostrar el modal
  await modal.present();

  // Esperar hasta que el modal se cierre y obtener datos de retorno
  const { data } = await modal.onWillDismiss();
  if (data) {
    console.log('Datos recibidos del modal:', data);
  //  this.tags.push(data); // Agrega la etiqueta a la lista
    this.addHashTag(data)
    this.restauranteForm.patchValue({ Hashtags: this.hashtags });
  }

}
  onToggleChange(event:any) {
    if (this.restauranteForm.valid) {
      //this.guardarFormulario(); // Guardar el formulario automáticamente
      document.getElementById("keyer")?.click()
    }
  }
  // Subir imagen y actualizar la URL en el formulario
  async uploadImage(file: File, type: 'logo' | 'banner') {
    const loading = await this.loadingCtrl.create({
      message: `Subiendo ${type}...`,
    });
    await loading.present();

    try {
      const storageRef = ref(this.storage, `restaurantes/${type}_${Date.now()}_${file.name}`);
      
      // Subir archivo a Firebase Storage
      await uploadBytes(storageRef, file);
      
      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(storageRef);
      
      // Actualizar formulario con la URL
      if (type === 'logo') {
        this.restauranteForm.controls['logo'].setValue(downloadURL);
      } else if (type === 'banner') {
        this.restauranteForm.controls['banner'].setValue(downloadURL);
      }
      
      // Mostrar mensaje de éxito
      this.showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} subido con éxito.`);
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      this.showToast('Error al subir la imagen.');
    } finally {
      await loading.dismiss();
    }
  }



  keyerClick(){
    document.getElementById('keyer')?.click()
  }
  removeTag(tag: string) {
    const tags = this.restauranteForm.get('Tags')?.value;
    const index = tags.indexOf(tag);
    if (index !== -1) {
      tags.splice(index, 1);
      this.restauranteForm.get('Tags')?.setValue(tags);
    }
  }
  removehashTag(tag: string) {
    const tags = this.restauranteForm.get('Hashtags')?.value;
    const index = tags.indexOf(tag);
    if (index !== -1) {
      tags.splice(index, 1);
      this.restauranteForm.get('Hashtags')?.setValue(tags);
    }
  }
  ngOnInit() {
    this.docId = this.route.snapshot.paramMap.get('id')!;
    this.restauranteForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      categoria: ['', Validators.required],
      desc: ['', Validators.required],
      direccion: ['', Validators.required],
      Tags: [] ,
      idprint: "",
      comeDesde:[0],
      comeDesdeActivo: [false],
      restExclusivo: [false],
      comboExclusivo: [false],
      excServicio: [false],
    
      Hashtags: [] ,
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      activo: [false],
      master: [false],
      autoaceptar: [false],
      autoaceptartype: [''],
      currentLat: [''],
      currentLng: [''],
      rango: ['5'],
      logo: [''],
      banner: [''],
      tarifa: [''],
      prepaTime: [''],
      lunesApertura: ['08:00'],
      lunesCierre: ['22:00'],
      martesApertura: ['08:00'],
      martesCierre: ['22:00'],
      miercolesApertura: ['08:00'],
      miercolesCierre: ['22:00'],
      juevesApertura: ['08:00'],
      juevesCierre: ['22:00'],
      viernesApertura: ['08:00'],
      viernesCierre: ['22:00'],
      sabadoApertura: ['08:00'],
      sabadoCierre: ['22:00'],
      domingoApertura: ['08:00'],
      domingoCierre: ['22:00'],
      lunesApertura2: ['08:00'],
      lunesCierre2: ['22:00'],
      martesApertura2: ['08:00'],
      martesCierre2: ['22:00'],
      miercolesApertura2: ['08:00'],
      miercolesCierre2: ['22:00'],
      juevesApertura2: ['08:00'],
      juevesCierre2: ['22:00'],
      viernesApertura2: ['08:00'],
      viernesCierre2: ['22:00'],
      sabadoApertura2: ['08:00'],
      sabadoCierre2: ['22:00'],
      domingoApertura2: ['08:00'],
      domingoCierre2: ['22:00'],
    });
 
    
  
  
    this.loadRestaurante();

  }

  async openDirectionModal() {
    return
    const modal = await this.modalCtrl.create({
      //component: ModalDireccionComponent,
      component: ModalAddComponent,
      cssClass: 'custom-modal-maps',

    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        console.log(result.data);
        this.restauranteForm.controls['direccion'].setValue(result.data.direccion);
    //    this.direccion = result.data.direccion

      }else{
        alert("No se seleccionó ningun dato")
      }
    });

    await modal.present();
  }
  async loadRestaurante() {
    try {
      const docSnapshot = await this.firestore
        .collection('restaurantes')
        .doc(this.docId)
        .get()
        .toPromise();

      if (!docSnapshot || !docSnapshot.exists) {
        this.showToast('El restaurante no existe o no se pudo cargar.');
        return;
      }

      // Usar patchValue para llenar el formulario
      const restauranteData = docSnapshot.data() as any;
      this.slug = restauranteData.key
      this.tags = restauranteData.Tags || []
      this.hashtags = restauranteData.Hashtags || []
      console.log(restauranteData.Tags)
      console.log(restauranteData.Hashtags)
      this.restauranteForm.patchValue({
        nombre: restauranteData.nombre || '',
        categoria: restauranteData.categoria || '',
        desc: restauranteData.desc || '',
        direccion: restauranteData.direccion || '',
        telefono: restauranteData.telefono || '',
        Hashtags: restauranteData.Hashtags || [],
        Tags: restauranteData.Tags || [],
        idprint:  restauranteData.idprint || '',
        email: restauranteData.email || '',
        comeDesde: restauranteData.comeDesde || 0,
        comeDesdeActivo: restauranteData.comeDesdeActivo || false,
        restExclusivo: restauranteData.restExclusivo || false,
        comboExclusivo: restauranteData.comboExclusivo || false,
        excServicio: restauranteData.excServicio || false,
        
        tagstxt: restauranteData.tagstxt || [],
        activo: restauranteData.activo || false,
        autoaceptar: restauranteData.autoaceptar || false,
        autoaceptartype: restauranteData.autoaceptartype || false,
        master: restauranteData.master || false,
        currentLat: restauranteData.currentLat || '',
        currentLng: restauranteData.currentLng || '',
        rango: restauranteData.rango || '5',
        logo: restauranteData.logo || '',
        banner: restauranteData.banner || '',
        tarifa: restauranteData.tarifa || '',
        prepaTime: +restauranteData.prepaTime || 30,
        lunesApertura: restauranteData.lunesApertura || '',
        lunesCierre: restauranteData.lunesCierre || '',
        martesApertura: restauranteData.martesApertura || '',
        martesCierre: restauranteData.martesCierre || '',
        miercolesApertura: restauranteData.miercolesApertura || '',
        miercolesCierre: restauranteData.miercolesCierre || '',
        juevesApertura: restauranteData.juevesApertura || '',
        juevesCierre: restauranteData.juevesCierre || '',
        viernesApertura: restauranteData.viernesApertura || '',
        viernesCierre: restauranteData.viernesCierre || '',
        sabadoApertura: restauranteData.sabadoApertura || '',
        sabadoCierre: restauranteData.sabadoCierre || '',
        domingoApertura: restauranteData.domingoApertura || '',
        domingoCierre: restauranteData.domingoCierre || '',
        lunesApertura2: restauranteData.lunesApertura2 || '',
        lunesCierre2: restauranteData.lunesCierre2 || '',
        martesApertura2: restauranteData.martesApertura2 || '',
        martesCierre2: restauranteData.martesCierre2 || '',
        miercolesApertura2: restauranteData.miercolesApertura2 || '',
        miercolesCierre2: restauranteData.miercolesCierre2 || '',
        juevesApertura2: restauranteData.juevesApertura2 || '',
        juevesCierre2: restauranteData.juevesCierre2 || '',
        viernesApertura2: restauranteData.viernesApertura2 || '',
        viernesCierre2: restauranteData.viernesCierre2 || '',
        sabadoApertura2: restauranteData.sabadoApertura2 || '',
        sabadoCierre2: restauranteData.sabadoCierre2 || '',
        domingoApertura2: restauranteData.domingoApertura2 || '',
        domingoCierre2: restauranteData.domingoCierre2 || '',

      });
    } catch (error) {
      console.log(error);
      this.showToast('Error al cargar los datos del restaurante.');
    }
  }
  
  

  async updateRestaurante() {
    if (this.restauranteForm.valid) {
      await this.firestore.collection('restaurantes').doc(this.docId).update(this.restauranteForm.value);
      this.showToast('Restaurante actualizado correctamente.');
    }
  }

  cancelEdit() {
    this.loadRestaurante(); // Volver a cargar los datos originales
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color:"primary"
    });
    toast.present();
  }
}