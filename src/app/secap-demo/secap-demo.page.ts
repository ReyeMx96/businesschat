import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Firebase modular
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-secap-demo',
  templateUrl: './secap-demo.page.html',
  styleUrls: ['./secap-demo.page.scss'],
})
export class SecapDemoPage implements OnInit {
  form: FormGroup;
  results: any[] = [];
  loadingResults = false;

  private db = getFirestore();
  private storage = getStorage();

  constructor(
     private menuCtrl: MenuController,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.form = this.fb.group({
      studentId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
    this.executeImg()
      
    }, 1000);
  }

  async search() {
    if (!this.form.valid) {
      this.presentAlert('Ingresa matrícula para buscar');
      return;
    }

    const studentId = this.form.value.studentId.toString().trim();
    this.loadingResults = true;

    try {
      const col = collection(this.db, 'certificados');
      const q = query(col, where('studentId', '==', studentId));
      const querySnapshot = await getDocs(q);
      const items: any[] = [];
      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        // ya contiene fileUrl, fileName, etc
        items.push({
          id: doc.id,
          studentName: data['studentName'],
          course: data['course'],
          issuedDate: data['issuedDate'],
          fileName: data['fileName'],
          fileUrl: data['fileUrl']
        });
      }
      this.results = items;
    } catch (err: any) {
      console.error('Error al consultar certificados:', err);
      this.presentAlert('Error al buscar: ' + (err.message || err));
    } finally {
      this.loadingResults = false;
    }
  }
  apiKey = environment.mapsKey
ionViewWillEnter() {
    // Desactiva el menú al entrar
    this.menuCtrl.enable(false);
  }
  async download(fileUrl: string) {
    // simplemente abrimos el URL en nueva pestaña
    window.open(fileUrl, '_blank');
  }
async enhanceProductImageDalle(imageUrl: string) {
  // Descargar la imagen desde la URL
  const imageResp = await fetch(imageUrl);
  const imageBlob = await imageResp.blob();

  // Convertir a PNG usando canvas (por si no es PNG)
  const img = await createImageBitmap(imageBlob);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);

  const pngBlob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Error al convertir a PNG"));
    }, "image/png")
  );

  const imageFile = new File([pngBlob!], "image.png", { type: "image/png" });

  // Prompt potente para mejorar imagen
const prompt = `
Mejorar la imagen del producto manteniéndolo exactamente igual.
Producto centrado en la imagen, ocupando un espacio proporcionalmente más pequeño para resaltar su detalle sin abarcar demasiado, explicitamente mas pequeño.
Incrementar nitidez, colores vibrantes y realistas, iluminación profesional, sombras suaves y reflejos sutiles.
Estilo de fotografía de catálogo premium, publicidad profesional o redes sociales.
Ignorar cualquier logo o marca de fondo, enfocarse únicamente en el producto.
Optimizar composición equilibrada con fondo limpio en colores pastel suaves para resaltar el producto y con textura relacionada a algo con el producto.
Incluir el precio del producto: $99 dentro de un círculo elegante con fondo blanco y letra negra en estilo bold, ubicado abajo a la derecha de manera muy visible pero estética.
Debajo del producto, agregar el nombre del producto: "Fresas con crema", de manera clara y armoniosa con una letra bold con mucho diseño y sombra de color blanco con bordes semi grises.
Resultado de alta resolución, listo para impresión o publicación digital, manteniendo el estilo profesional y llamativo de sesión fotográfica de producto.
`;




  // FormData para la petición
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("prompt", prompt);
  formData.append("n", "1");
  formData.append("size", "1024x1024");
  formData.append("model", "gpt-image-1"); // especificar DALL·E

  // Llamada a OpenAI Edits
  const response = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: { Authorization: `Bearer ${this.apiKey}` }, // ¡sin Content-Type!
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error API OpenAI DALL·E:", errorText);
    throw new Error(errorText);
  }

    const result = await response.json();
    const b64 = result.data[0].b64_json;

    // Convertir base64 a data URL
    this.imageResult = `data:image/png;base64,${b64}`;
}



// Uso en tu código
async executeImg() {
  const newImageUrl = await this.enhanceProductImageDalle(
    "https://firebasestorage.googleapis.com/v0/b/the-business-chat.appspot.com/o/8sUJpDeiS4T9GtKnkjbe7s9NpJE2%2FCaptura%20de%20pantalla%202025-09-12%20025046.png?alt=media&token=178751d3-4f4f-4596-9ab0-7e065c611609"
  );
 console.log("Imagen mejorada:", newImageUrl);
}






  imageResult: string | null = null;


  async presentAlert(message: string) {
    const a = await this.alertCtrl.create({ header: 'Aviso', message, buttons: ['OK'] });
    await a.present();
  }
}
