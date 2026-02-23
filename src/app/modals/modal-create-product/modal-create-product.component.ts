import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavParams, ToastController } from '@ionic/angular';
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-modal-create-product',
  templateUrl: './modal-create-product.component.html',
  styleUrls: ['./modal-create-product.component.scss'],
})
export class ModalCreateProductComponent  implements OnInit {
  nombreProducto: string = '';
  descripcion: string = '';
  daysOfWeek = [
    { name: 'Lunes', selected: false, startTime:"", endTime:"" },
    { name: 'Martes', selected: false, startTime:"", endTime:"" },
    { name: 'Miércoles', selected: false, startTime:"", endTime:"" },
    { name: 'Jueves', selected: false, startTime:"", endTime:"" },
    { name: 'Viernes', selected: false, startTime:"", endTime:"" },
    { name: 'Sábado', selected: false, startTime:"", endTime:"" },
    { name: 'Domingo', selected: false, startTime:"", endTime:"" }
  ];

  precio: number | null = null;
  cantidadMaxima: number | null = 0;
  private storage = getStorage(initializeApp(environment.firebaseConfig));
  cantidadMinima: number | null = 1;
  precioCoste: number | null = 0;
  sku: string = '';
  descuento = 0;
  typeSave = ""
  horario1 = ""
  horario2 = ""

  selectedDays: string[] = [];
  errorHorario1 = ""
  errorHorario2 = ""
  sueleElegirseJunto: string = '';
  fotoProducto: string = '';
  arrayProduct : any = []
  inactiveCreateProduct = false
  logoPreview: string | null = null;
  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private alertController: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
  ) {}

  saveProduct(){
      if (this.daysOfWeek.length === 0){
          this.daysOfWeek = []
    
      } else {
      const todosVacios = this.daysOfWeek.every(day => day.startTime === "" && day.endTime === "");

      if (todosVacios) {
          this.daysOfWeek = []
      }
    }


    const productData = {
      nombreProducto: this.nombreProducto,
      descripcion: this.descripcion,
      precio: this.precio,
      cantidadMaxima: this.cantidadMaxima,
      cantidadMinima: this.cantidadMinima,
      precioCoste: this.precioCoste,
      dias: this.daysOfWeek,
      sku: this.sku,
      horario1:this.horario1,
      horario2:this.horario2,
 
      descuento: this.descuento,
      sueleElegirseJunto: this.sueleElegirseJunto,
      fotoProducto: this.fotoProducto,
      typeaction: this.arrayProduct['inactive'],
    };
  
    // Cierra el modal y envía los datos del producto
    this.modalController.dismiss(productData);
  }
  toggleDay(index: number, event:any) {
    console.log(event)
    this.daysOfWeek[index].selected = this.daysOfWeek[index].selected;
 
   // this.updateSelectedDays();
  }

  updateSelectedDays() {
    this.selectedDays = this.daysOfWeek
      .filter(day => day.selected)
      .map(day => day.name);
    console.log('Días seleccionados:', this.selectedDays);
  }
ngOnInit() {
  this.arrayProduct = this.navParams.get('arrayProduct');
  console.log(this.arrayProduct)
  this.inactiveCreateProduct = this.arrayProduct['inactive']
  if(this.inactiveCreateProduct){
    this.typeSave = "create"

  }else{
   
    this.typeSave = "edit"
    this.nombreProducto = this.arrayProduct['nombre'] || ""
    this.descripcion = this.arrayProduct['desc'] || ""
    this.precio =this.arrayProduct['precio'] || 0
    this.fotoProducto = this.arrayProduct['imageLowRes'] || ""
    this.cantidadMaxima = this.arrayProduct['cantidadMaxima'] || 0
    this.horario1 = this.arrayProduct['horario1']
    this.horario2 = this.arrayProduct['horario2']
    if(this.arrayProduct['dias'].length ===  0){

    }else{
    this.daysOfWeek = this.arrayProduct['dias'] 

    }
    // cantidadMaxima: this.cantidadMaxima,
        // cantidadMinima: this.cantidadMinima,
        // precioCoste: this.precioCoste,
        this.sku = this.arrayProduct['sku'] || ""


       
  }

      // descuento: this.descuento,
      // sueleElegirseJunto: this.sueleElegirseJunto,
      // fotoProducto: this.fotoProducto,
}
onFileSelected(event: any, type: 'logo' | 'banner') {
  const requiredWidth = 500;
  const requiredHeight = 500;
  const file = event.target.files[0];

  if (file) {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      const width = img.width;
      const height = img.height;

      if (width !== requiredWidth || height !== requiredHeight) {
        this.showToast(`La imagen debe tener una resolución de exactamente ${requiredWidth}x${requiredHeight}.`);
        return;
      } else {
        // Comprimir y convertir a WebP
        const webpBlob = await this.compressAndConvertToWebP(img);
        const webpFile = new File([webpBlob], file.name.replace(/\.\w+$/, '.webp'), { type: 'image/webp' });

        this.uploadImage(webpFile, type);
        this.showPreview(webpFile, type); // Mostrar vista previa
      }
    };
  }
}

async compressAndConvertToWebP(image: HTMLImageElement): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('No se pudo obtener el contexto del canvas');
    }

    ctx.drawImage(image, 0, 0, image.width, image.height);

    // Convertir a WebP con calidad del 0.3 (30%)
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        throw new Error('Error al convertir a WebP');
      }
    }, 'image/webp', 0.9);
  });
}


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
  this.fotoProducto = downloadURL
    
    // Mostrar mensaje de éxito
    this.showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} subido con éxito.`);
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    this.showToast('Error al subir la imagen.');
  } finally {
    await loading.dismiss();
  }
}
showPreview(file: File, type: 'logo' | 'banner') {
  const reader = new FileReader();
  reader.onload = () => {
    if (type === 'logo') {
      this.logoPreview = reader.result as string;
    }
  };
  reader.readAsDataURL(file);
}


async showToast(message: string) {
  const toast = await this.toastCtrl.create({
    message,
    duration: 2000,
    color:"primary"
  });
  toast.present();
}

  // Cerrar el modal y retornar los datos
  submitForm() {
    console.log(this.nombreProducto)
    console.log(this.precio)
    console.log(this.descripcion)
    console.log(this.cantidadMaxima)
    console.log(this.fotoProducto)
 
    // Verifica que todos los campos obligatorios estén completos
    if (
      !this.nombreProducto || 
      !this.descripcion || 
      this.precio == null ||  // Acepta 0, pero no null o undefined
      this.cantidadMaxima == null ||  // Acepta 0, pero no null o undefined
      !this.fotoProducto
    ) {
      this.showAlert('Por favor, completa todos los campos obligatorios.');
      return;
    }
  
    // Si todos los campos obligatorios están completos, crea el objeto de datos del producto
    const productData = {
      nombreProducto: this.nombreProducto,
      descripcion: this.descripcion,
      precio: this.precio,
      cantidadMaxima: this.cantidadMaxima,
      cantidadMinima: this.cantidadMinima,
      horario1:this.horario1,
      horario2:this.horario2,
      precioCoste: this.precioCoste,
      sku: this.sku,
      dias: this.daysOfWeek,
      descuento: this.descuento,
      sueleElegirseJunto: this.sueleElegirseJunto,
      fotoProducto: this.fotoProducto,
    };
  
    // Cierra el modal y envía los datos del producto
    this.modalController.dismiss(productData);
  }
  
  // Método para mostrar una alerta
  async showAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Campos incompletos',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
// ✅ Función adaptada para modificar el horario de cada día correctamente
formatearHorario(event: any, index: number, tipo: 'startTime' | 'endTime') {
  let input = event.target.value.replace(/\D/g, ''); // Remueve cualquier carácter no numérico

  if (input.length >= 2) {
    input = input.substring(0, 2) + ':' + input.substring(2, 4); // Inserta ':'
  }

  if (input.length > 5) {
    input = input.substring(0, 5); // Limita a HH:mm
  }

  // 🔹 Modifica directamente el día correspondiente
  this.daysOfWeek[index][tipo] = input;
  console.log(this.daysOfWeek[index][tipo])

  // Llamar a la validación
  this.validarHorario(index, tipo);
}

validarHorario(index: number, tipo: 'startTime' | 'endTime') {
  const formato24Hrs = /^([01]\d|2[0-3]):([0-5]\d)$/; // Expresión regular para HH:mm (24 horas)

  if (!formato24Hrs.test(this.daysOfWeek[index][tipo])) {
    console.log(`El horario ingresado en ${tipo} para ${this.daysOfWeek[index].name} no es válido.`);
  }
}


  // Cerrar el modal sin retornar datos
  closeModal() {
    this.modalController.dismiss();
  }

}
