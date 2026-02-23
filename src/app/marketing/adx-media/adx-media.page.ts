import { Component, NgZone, OnInit, Type, ViewChild } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { arrayUnion, doc, getFirestore, onSnapshot, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadString } from 'firebase/storage';
import { ImageViewerComponent } from 'src/app/modals/image-viewer/image-viewer.component';
import { environment } from 'src/environments/environment.prod';
import * as fabric from 'fabric';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getDatabase, onValue, ref as refDb } from 'firebase/database';

@Component({
  selector: 'app-adx-media',
  templateUrl: './adx-media.page.html',
  styleUrls: ['./adx-media.page.scss'],
})
export class AdxMediaPage implements OnInit {

templates: any[] = [];
filteredTemplates: any[] = [];
selectedCategory: string = 'ALL';

imageResult: string | null = null;

constructor(private zone: NgZone,private alertCtrl: AlertController, private modalController: ModalController, private loadingCtrl: LoadingController) {}
db = getFirestore();
 private dbRealtime = getDatabase();
phonenumber = '5218333861194';
unsubscribeAdx!: () => void;
selectCategory(category: string) {
  this.selectedCategory = category;
  this.applyFilter();
}
canvas!: any;

async addProduct(imageItem: any) {
  const baseUrl = imageItem;

  const img = await fabric.Image.fromURL(baseUrl, { crossOrigin: 'anonymous' });


  img.scaleX = this.canvas.width! / img.width!;
  img.scaleY = this.canvas.height! / img.height!;
  img.selectable = false;
  img.evented = false;

  this.canvas.backgroundImage = img;
  this.canvas.requestRenderAll();
}
async addProductPNGLOGO() {
  if (!this.canvas) {
    console.error("Canvas no inicializado");
    return;
  }
  var productUrl = "https://firebasestorage.googleapis.com/v0/b/the-business-chat.appspot.com/o/73dobEnTlHSrLpoL6LSJ0x7D7zt2%2F4.png?alt=media&token=836a08cd-bb16-4d9f-93c8-7eb31a44e2d4"

const img = await fabric.Image.fromURL(productUrl, { crossOrigin: 'anonymous' });


  // Forzar cálculo de tamaño
  img.setCoords();

  // Tamaño inicial (40% del canvas)
  const canvasWidth = this.canvas.getWidth();
  const canvasHeight = this.canvas.getHeight();

  const scale = (canvasWidth * 0.4) / img.width!;
  img.scale(scale);

  img.set({
    left: canvasWidth / 2,
    top: canvasHeight / 2,
    originX: 'center',
    originY: 'center',
    selectable: true,
    evented: true,
    hasControls: true,
    hasBorders: true
  });

  this.canvas.add(img);
  this.canvas.setActiveObject(img);
  this.canvas.requestRenderAll();
}
comboNombre: string = '';
comboPrecio: string = '';
comboInstrucciones: string = '';
comboProductos: string = '';
async addPlantilla() {
  const alert = await this.alertCtrl.create({
    header: 'Datos del Combo',
    subHeader: 'Completa la información del combo',
    inputs: [
      {
        name: 'nombre',
        type: 'text',
        placeholder: 'Nombre del combo'
      },
      {
        name: 'precio',
        type: 'text',
        placeholder: 'Precio (ej: $199)'
      },
      {
        name: 'productos',
        type: 'textarea',
        placeholder: 'Productos incluidos'
      },
      {
        name: 'instrucciones',
        type: 'textarea',
        placeholder: 'Instrucciones o descripción'
      }
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Continuar',
        handler: (data) => {

          // Guardar en variables globales
          this.comboNombre = data.nombre;
          this.comboPrecio = data.precio;
          this.comboProductos = data.productos;
          this.comboInstrucciones = data.instrucciones;

          console.log('Combo guardado:', {
            nombre: this.comboNombre,
            precio: this.comboPrecio,
            productos: this.comboProductos,
            instrucciones: this.comboInstrucciones
          });

          // Abrir selector de imagen
          this.plantillaFileInput.nativeElement.value = '';
          this.plantillaFileInput.nativeElement.click();
        }
      }
    ]
  });

  await alert.present();
}

async handlePlantillaUpload(event: any) {
  const file: File = event.target.files[0];
  if (!file) return;

  alert('Subiendo plantilla...');

  const base64 = await this.fileToBase64(file);

  // 🔥 Subir a Firebase Storage
  const storage = getStorage();
  const path = `plantillas/${this.phonenumber}/${Date.now()}.png`;
  const storageRef = ref(storage, path);

  await uploadString(storageRef, base64, 'data_url');

  // 🔥 Obtener URL pública
  const downloadURL = await getDownloadURL(storageRef);

  console.log('URL de la plantilla:', downloadURL);
  alert('Imagen para Plantilla cargada correctamente');

  // 🔥 AQUÍ ya tienes la URL lista
  // Puedes guardarla en Firestore, mandarla a la IA o usarla como fondo
const promptTemplate = `
Eres un diseñador publicitario profesional especializado en anuncios para restaurantes.

Tu tarea es crear una imagen publicitaria profesional tipo plantilla, lista para Facebook Ads y WhatsApp Marketing.

Usa la imagen proporcionada solo como referencia visual de estilo, no como copia exacta.

Crea un diseño nuevo que incluya:

1. Un fondo atractivo relacionado con comida, restaurante o promoción.
2. Un área central vacía y limpia, diseñada específicamente para colocar un producto después.
   - Esta área debe estar bien iluminada
   - Con sombras suaves
   - Con profundidad visual
   - Pensada para que un producto PNG se vea natural

3. Textos publicitarios generados a partir de estos datos del usuario:

   NOMBRE_PROMO: ${this.comboNombre}
   PRECIO: ${this.comboPrecio}
   PRODUCTOS: ${this.comboProductos}
   INSTRUCCIONES: "${this.comboInstrucciones}"

   A partir de esto genera:
   - Un título grande y llamativo usando NOMBRE_PROMO
   - Una frase promocional basada en INSTRUCCIONES
   - Un precio u oferta usando PRECIO
   - Un llamado a la acción (ej: “Ordena ahora”, “Pide por WhatsApp”, “Compra hoy”, etc)

4. El diseño debe verse:
   - Profesional
   - Moderno
   - Publicitario
   - De alta conversión
   - Como un anuncio real de Facebook Ads

5. El producto NO debe aparecer.
   Solo debe quedar el espacio preparado para colocarlo.

6. Estilo visual:
   - Iluminación de estudio
   - Colores atractivos
   - Tipografía clara
   - Estilo premium y comercial

7. Formato final:
   - Cuadrado 1:1
   - Alta resolución
   - Optimizado para Facebook e Instagram
   - Optimizado para WhatsApp Marketing

El resultado debe ser una plantilla publicitaria lista para insertar un producto y empezar a vender.


`;

  await this.enhanceProductImageDallePlantilla(downloadURL, promptTemplate);
}

@ViewChild('plantillaFileInput') plantillaFileInput!: any;


async addProductPNG(image:any) {
  if (!this.canvas) {
    console.error("Canvas no inicializado");
    return;
  }
 
  var productUrl = image

const img = await fabric.Image.fromURL(productUrl, { crossOrigin: 'anonymous' });


  // Forzar cálculo de tamaño
  img.setCoords();

  // Tamaño inicial (40% del canvas)
  const canvasWidth = this.canvas.getWidth();
  const canvasHeight = this.canvas.getHeight();

  const scale = (canvasWidth * 0.4) / img.width!;
  img.scale(scale);

  img.set({
    left: canvasWidth / 2,
    top: canvasHeight / 2,
    originX: 'center',
    originY: 'center',
    selectable: true,
    evented: true,
    hasControls: true,
    hasBorders: true
  });

  this.canvas.add(img);
  this.canvas.setActiveObject(img);
  this.canvas.requestRenderAll();
   setTimeout(() => {
  // this.addProductPNGLOGO()
  // this.addProductPNG2()
  
    
  }, 3000);
}
async addProductPNG2() {
  if (!this.canvas) {
    console.error("Canvas no inicializado");
    return;
  }
 
  var productUrl = "https://firebasestorage.googleapis.com/v0/b/the-business-chat.appspot.com/o/73dobEnTlHSrLpoL6LSJ0x7D7zt2%2F1%20(2).png?alt=media&token=e09e6069-6be8-4609-844a-801886ea29fa"

const img = await fabric.Image.fromURL(productUrl, { crossOrigin: 'anonymous' });


  // Forzar cálculo de tamaño
  img.setCoords();

  // Tamaño inicial (40% del canvas)
  const canvasWidth = this.canvas.getWidth();
  const canvasHeight = this.canvas.getHeight();

  const scale = (canvasWidth * 0.4) / img.width!;
  img.scale(scale);

  img.set({
    left: canvasWidth / 2,
    top: canvasHeight / 2,
    originX: 'center',
    originY: 'center',
    selectable: true,
    evented: true,
    hasControls: true,
    hasBorders: true
  });

  this.canvas.add(img);
  this.canvas.setActiveObject(img);
  this.canvas.requestRenderAll();
   setTimeout(() => {
  this.addProductPNGLOGO()
  
    
  }, 2000);
}
centerProduct() {
  const obj = this.canvas.getActiveObject();
  if (!obj) return;

  obj.set({
    left: this.canvas.width! / 2,
    top: this.canvas.height! / 2,
    originX: 'center',
    originY: 'center'
  });

  this.canvas.renderAll();
}

bottomRight() {
  const obj = this.canvas.getActiveObject();
  if (!obj) return;

  obj.set({
    left: this.canvas.width! - 50,
    top: this.canvas.height! - 50,
    originX: 'right',
    originY: 'bottom'
  });

  this.canvas.renderAll();
}
async exportImage() {
  try {
    const dataUrl = this.canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1
    });

    // 🔥 Subir a Firebase Storage
    const storage = getStorage();
    const path = `adxmedia/${this.phonenumber}/final_${Date.now()}.png`;
    const fileRef = ref(storage, path);

    await uploadString(fileRef, dataUrl, 'data_url');

    // 🔥 Obtener URL pública
    const downloadURL = await getDownloadURL(fileRef);

    // 🔥 Guardar en Firestore
    const refDoc = doc(this.db, 'adxmedia', this.phonenumber);

    const newItem = {
      image: downloadURL,
      title: 'Creativa Final',
      desc: 'Generada en Editor',
      categoria: 'Creativa',
      createdAt: Timestamp.now(),
      type: 'final'
    };

    await updateDoc(refDoc, {
      images: arrayUnion(newItem)
    });

    // 🔥 También descargar localmente
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `adxmedia_${Date.now()}.png`;
    link.click();

    alert('Imagen guardada en Firebase y descargada ✅');
    console.log("Imagen final guardada:", downloadURL);

  } catch (error) {
    console.error("Error guardando imagen:", error);
    alert('Error al guardar imagen ❌');
  }
}




listenAdxMedia() {
  const ref = doc(this.db, 'adxmedia', this.phonenumber.toString());

  this.unsubscribeAdx = onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      const data: any = snap.data();
      this.templates = data.images || [];
      console.log('Realtime adxmedia:', this.templates);
      this.applyFilter();
    } else {
      // si no existe lo creamos
      setDoc(ref, { images: [] });
    }
  });
}
toolsArray:any
listenMedia() {
  const ref = doc(this.db, 'media-history', this.whatsappNumber.toString());

  this.unsubscribeAdx = onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      const data: any = snap.data();
      this.toolsArray = data.tools || [];
      console.log('Realtime tools:', this.toolsArray);
    } else {
      setDoc(ref, { tools: [] });
    }
  });
}
uid:any
arrayNumbers:any
ph:any
name:any
connect : any
enableService = false
  private auth = getAuth();
whatsappNumber:any
ngOnInit() {

       onAuthStateChanged(this.auth, (user: User | null) => {
            if (user) {
              this.uid = user.uid;
              
              const userRef = refDb(this.dbRealtime, `UsersBusinessChat/${this.uid}`);
              onValue(userRef, (snap) => {
                const res = snap.val();
                if (!res?.Auth) {
                  this.enableService = false;
                } else {
                  this.enableService = true;
                  const array: string[] = [];
                  for (const key in res.Auth) {
                    array.push(res.Auth[key].Ph);
                  }
                  this.zone.run(() => {
                    this.arrayNumbers = array;
                    this.ph = res.SelectedPh || '';
                    this.whatsappNumber = res.SelectedPh || '';
                    this.phonenumber = res.SelectedPh || '';

                     this.listenAdxMedia()
                    this.listenMedia()
                    this.listenPlantillas()
                    this.name = res.Name || '';
                    this.connect = res.Connect || '';
                  });
                }
              });
            }
          });


}
plantillas:any
listenPlantillas(){
    const ref = doc(this.db, 'adx-plantillas', this.whatsappNumber.toString());

  this.unsubscribeAdx = onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      const data: any = snap.data();
      this.plantillas = data.images || [];
      console.log('Realtime tools:', this.plantillas);
    } else {
      setDoc(ref, { tools: [] });
    }
  });
}
async executeImg() {
  alert("Generando imagen, esto puede tardar unos segundos...");
   const prompt = `
  Generar una nueva versión creativa de este anuncio basada exactamente en la imagen original.
Mantener IDENTIDAD del producto: mismo producto, misma forma, mismo texto, mismo precio y misma información visible.
NO modificar el contenido, solo el ESTILO VISUAL.
NO AGREGUES LOGOS DE PRODUCTOS NI LOGOS DEL NEGOCIO.

Crear una variación del diseño cambiando:

esquema de colores del fondo (paleta romántica: rojos, rosas, morados, tonos cálidos)

iluminación (luz suave, cálida, estilo romántico)

ambiente visual (temática Amor y Amistad / San Valentín)

textura del fondo (gradientes suaves, bokeh, corazones sutiles, luces difusas)

estilo gráfico (romántico, premium, publicitario, moderno)

El producto debe permanecer centrado y reconocible.
No eliminar ni alterar logos, marca, nombre del producto ni precio.

Aplicar estilo de fotografía publicitaria profesional para redes sociales.
Alta nitidez, colores realistas, iluminación de estudio.

Incluir elementos visuales sutiles de Amor y Amistad: corazones, luces cálidas, ambiente romántico, sensación de regalo o detalle especial, sin tapar ni modificar el producto.

Generar una versión visual diferente a la original pero claramente basada en ella.
Formato cuadrado 1:1 optimizado para Facebook e Instagram Ads.
Resolución alta.
  `;
  const newImageUrl = await this.enhanceProductImageDalle(
    "https://firebasestorage.googleapis.com/v0/b/the-business-chat.appspot.com/o/73dobEnTlHSrLpoL6LSJ0x7D7zt2%2FWhatsApp%20Image%202026-01-23%20at%2003.08.10.jpeg?alt=media&token=a5e8a356-5813-4c5b-92f6-0fccef67f98c",
    prompt
  );
  console.log("Imagen mejorada:", newImageUrl);
}
ngOnDestroy() {
  if (this.unsubscribeAdx) this.unsubscribeAdx();
}
applyFilter() {
  if (this.selectedCategory === 'ALL' || this.selectCategory === null || this.selectCategory === undefined) {
    this.filteredTemplates = this.templates;
  
  } else {
    this.filteredTemplates = this.templates.filter(
      item => item.categoria === this.selectedCategory
    );
  }
}
ngAfterViewInit() {
  this.canvas = new fabric.Canvas('canvas', {
    width: 800,
    height: 800,
    backgroundColor: '#ffffff'
  });
}

async saveImageFirestoreHistory(imageUrl: string) {
  const ref = doc(this.db, 'adx-plantillas', this.phonenumber);

  const newItem = {
    image: imageUrl,
    title: 'Amor y Amistad',
    desc: 'Generada por IA',
    categoria: 'Temporada',
    createdAt: Timestamp.now()
  };

  await updateDoc(ref, {
    images: arrayUnion(newItem)
  });
}

async saveImageFirestoreMedia(imageUrl: string) {
  const ref = doc(this.db, 'adxmedia', this.phonenumber);

  const newItem = {
    image: imageUrl,
    title: 'Amor y Amistad',
    desc: 'Generada por IA',
    categoria: 'Temporada',
    createdAt: Timestamp.now()
  };

  await updateDoc(ref, {
    images: arrayUnion(newItem)
  });
}
extraImages: string[] = []; // máximo 2
async enhanceProductImageDallePlantilla(imageUrl: string, prompt: any) {

  const loading = await this.loadingCtrl.create({
    message: 'Generando diseño con IA...',
    spinner: 'crescent',
    backdropDismiss: false
  });

  await loading.present();

  try {

    console.log(prompt);

    const response = await fetch(
      "https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/enhanceImage",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // imageUrl,
          prompt,
          // extraImages: this.extraImages
        })
      }
    );

    console.log("Respuesta del fetch:", response);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const result = await response.json();
    console.log("Respuesta del backend:", result);

    const b64 = result.data[0].b64_json;
    const dataUrl = `data:image/png;base64,${b64}`;

    const url = await this.uploadBase64ToStorage(dataUrl);
    await this.saveImageFirestoreHistory(url);

    this.imageResult = dataUrl;

    return this.imageResult;

  } catch (err) {

    console.error('Error al generar imagen:', err);
    alert('Error al generar la imagen con IA');

    throw err;

  } finally {
    // 🔥 Esto se ejecuta SIEMPRE aunque falle
    await loading.dismiss();
  }
}


async enhanceProductImageDalle(imageUrl: string, prompt: any) {

  // 🔥 AQUÍ YA NO LLAMAS A OPENAI
  // Llamas a tu backend (Firebase Function)
  console.log(prompt)
  const response = await fetch(
    "https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/enhanceImage",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl,
        prompt,
        extraImages: this.extraImages
      })
    }
  );
  console.log("Respuesta del fetch:", response);
  if (!response.ok) {
    const errorText = await response.text();
    
    throw new Error(errorText);
  }

  const result = await response.json();
  console.log("Respuesta del backend:", result);
  const b64 = result.data[0].b64_json;
  const dataUrl = `data:image/png;base64,${b64}`;
  const url = await this.uploadBase64ToStorage(dataUrl);
  await this.saveImageFirestoreMedia(url);
  this.imageResult = `data:image/png;base64,${b64}`;
  return this.imageResult;
}
blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
@ViewChild('toolFileInput') toolFileInput!: any;
addTool() {
  this.toolFileInput.nativeElement.value = '';
  this.toolFileInput.nativeElement.click();
}

async handleToolUpload(event: any) {
  const file: File = event.target.files[0];
  if (!file) return;

  const base64 = await this.fileToBase64(file);

  // 🔥 subir a Firebase Storage
  const storage = getStorage();
  const path = `tools/${this.phonenumber}/${Date.now()}.png`;
  const storageRef = ref(storage, path);

  await uploadString(storageRef, base64, 'data_url');

  // 🔥 obtener URL pública
  const downloadURL = await getDownloadURL(storageRef);

  // 🔥 guardar en Firestore
  const docRef = doc(this.db, 'media-history', this.phonenumber);

  const tool = {
    image: downloadURL,
    type: 'tool',
    createdAt: Timestamp.now()
  };

  await setDoc(docRef, {
    tools: arrayUnion(tool)
  }, { merge: true });

  alert('Imagen agregada a Herramientas ✅');
}


addExtraImage() {
  if (this.extraImages.length >= 2) {
    alert('Máximo 2 imágenes adicionales');
    return;
  }

  const url = prompt('Pega la URL de la imagen');
  if (url) this.extraImages.push(url);
}


async uploadBase64ToStorage(base64: string) {
  const storage = getStorage();
  const fileRef = ref(storage, `adxmedia/${this.phonenumber}/${Date.now()}.png`);

  await uploadString(fileRef, base64, 'data_url');
  const url = await getDownloadURL(fileRef);
  return url;
}

async loadImageSafe(url: string): Promise<any> {
  // Si es base64 lo convertimos a blob
  if (url.startsWith('data:image')) {
    const blob = await fetch(url).then(r => r.blob());
    url = URL.createObjectURL(blob);
  }

  const response = await fetch(url, { mode: 'cors' });
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  return await new Promise((resolve) => {
    fabric.Image.fromURL(
      objectUrl,
      (img:any) => resolve(img),
      { crossOrigin: 'anonymous' }
    );
  });
}


async openPromptAlert(imageUrl: string) {
  const alert = await this.alertCtrl.create({
    header: 'Instrucción IA',
    subHeader: 'Escribe cómo quieres modificar la imagen',
    inputs: [
      {
        name: 'prompt',
        type: 'textarea',
        placeholder: 'Ej: estilo romántico, colores rojos, iluminación premium...'
      }
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Generar',
        handler: async (data:any) => {
          if (!data.prompt) return;
          const loading = await this.loadingCtrl.create({
            message: 'Generando imagen con IA...',
            spinner: 'crescent',
            backdropDismiss: false
          });

          await loading.present();
          console.log("Generando imagen, esto puede tardar unos segundos...");
            try {
            console.log("Generando imagen, esto puede tardar unos segundos...");
            await this.enhanceProductImageDalle(imageUrl, data.prompt);
          } catch (err) {
            console.error(err);
          } finally {
            // ✅ SIEMPRE se cierra
            await loading.dismiss();
          }
        }
      }
    ]
  });

  await alert.present();
}
@ViewChild('extraFileInput') extraFileInput!: any;
pendingBaseImage:any

async changeProducts(imageUrl: string) {
  this.extraImages = []; // reset
  this.pendingBaseImage = imageUrl

    this.extraFileInput.nativeElement.value = '';
    this.extraFileInput.nativeElement.click();

  
}


fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}
async uploadExtraImage(base64: string) {
  const storage = getStorage();
  const fileRef = ref(
    storage,
    `adxmediaextras/${this.phonenumber}/extras/${Date.now()}.png`
  );

  await uploadString(fileRef, base64, 'data_url');
  const url = await getDownloadURL(fileRef);
  return url;
}

// async handleExtraImage(event: any) {
//   if (this.extraImages.length >= 2) {
//     alert('Máximo 2 imágenes adicionales');
//     return;
//   }

//   const file: File = event.target.files[0];
//   if (!file) return;

//   const base64 = await this.fileToBase64(file);
//   const url = await this.uploadExtraImage(base64);

//   this.extraImages.push(url);
//     this.openPromptAlert(this.pendingBaseImage);
  
// }

async handleExtraImage(event: any) {
  const files: File[] = Array.from(event.target.files || []);

  // 👉 Si el usuario NO seleccionó imágenes
  if (!files.length) {
    this.openPromptAlert(this.pendingBaseImage);
    return;
  }

  // 👉 Máximo 2
  if (files.length > 2) {
    alert('Máximo 2 imágenes adicionales');
    return;
  }

  // 👉 Limpio por seguridad
  this.extraImages = [];
  alert('Cargando imágenes adicionales, por favor espera...');
  for (const file of files) {
    const base64 = await this.fileToBase64(file);
    const url = await this.uploadExtraImage(base64);
    this.extraImages.push(url);
  }
  alert('Imágenes adicionales cargadas correctamente.');
  // 🔥 AHORA sí, cuando ya terminó todo
  this.openPromptAlert(this.pendingBaseImage);
}

async openImg(url: string) {
  const modal = await this.modalController.create({
    component: ImageViewerComponent,
    componentProps: {
      imgUrl: url
    },
    cssClass: 'fullscreen-modal'
  });

  await modal.present();
}


}
