import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { getDatabase, ref, update } from 'firebase/database';
import { lastValueFrom } from 'rxjs';
import { getDownloadURL, getStorage, uploadBytes, ref as storageRef } from 'firebase/storage';

@Component({
  selector: 'app-create-campaign-modal',
  templateUrl: './create-campaign-modal.component.html',
  styleUrls: ['./create-campaign-modal.component.scss'],
})
export class CreateCampaignModalComponent  implements OnInit {


  loading = false;

  campaignForm = this.fb.group({
    mediaType: ['image', Validators.required],
    imageUrl: [''],
    videoUrl: [''],
    gender: ['all', Validators.required],
    agemin: [18, Validators.required],
    agemax: [65, Validators.required],
    numberStock: [1, Validators.required],
    dailyBudget: [4000, Validators.required],
    cities: [''],
    whatsappNumber: ['', Validators.required],
    message: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
      private storage: AngularFireStorage,
    private modalCtrl: ModalController,
    private http: HttpClient,
    private toastCtrl: ToastController
  ) {}
  ngOnInit(): void {

  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
  selectedFile: File | null = null;
uploadedImageUrl: string | null = null;

  onFileSelected(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  this.selectedFile = file;
}

// async uploadImageToFirebase(): Promise<string> {
//   if (!this.selectedFile) {
//     throw new Error('No image selected');
//   }

//   const filePath = `facebook_ads/${Date.now()}_${this.selectedFile.name}`;
//   const fileRef = this.storage.ref(filePath);

//   await this.storage.upload(filePath, this.selectedFile);

//   const downloadURL = await lastValueFrom(fileRef.getDownloadURL());

//   console.log('✅ Image uploaded to Firebase:', downloadURL);

//   return downloadURL;
// }
imageUrl = "https://firebasestorage.googleapis.com/v0/b/the-business-chat.appspot.com/o/facebook_ads%2F1768006675104_WhatsApp%20Image%202026-01-09%20at%2016.58.28.jpeg?alt=media&token=b41c2ee3-f0d5-4611-b22a-834876d469cc";
  async uploadImageToFirebase() {
    if (!this.selectedFile) return;

    try {
      const storage = getStorage();
      const filePath = `anuncios/${Date.now()}_${this.selectedFile.name}`;
      const fileRef = storageRef(storage, filePath);

      const upload = await uploadBytes(fileRef, this.selectedFile);
      this.imageUrl = await getDownloadURL(upload.ref);

      console.log("✅ Imagen subida:", this.imageUrl);
    } catch (err) {
      console.error("❌ Error al subir imagen:", err);
      alert("Error al subir imagen");
    }
  }
// async uploadImageToFirebase2(): Promise<string> {
//   if (!this.selectedFile) throw new Error('No image');

//   const filePath = `facebook_ads/${Date.now()}_${this.selectedFile.name}`;
//   const ref = this.storage.ref(filePath);

//   await this.storage.upload(filePath, this.selectedFile);

//   // 🔥 URL pública REAL
//   const publicUrl = `https://storage.googleapis.com/${this.storage.storage.app.options.storageBucket}/${filePath}`;

//   console.log('PUBLIC URL:', publicUrl);
//   return publicUrl;
// }


  async submit() {
    if (this.campaignForm.invalid) return;
    // 🔥 SUBIR IMAGEN SI ES IMAGE
    const v = this.campaignForm.value;

    var imageUrl = "";
    this.loading = true;
    var payload = {}

    console.log('Form Values:', v);
    payload = {
      mediaType: v.mediaType,
      imageUrl: this.imageUrl,
      videoUrl: "",
      gender: v.gender,
      agemin: Number(v.agemin),
      agemax: Number(v.agemax),
      indexAdx: Number(v.numberStock),
      dailyBudget: Number(v.dailyBudget),
      whatsappNumber: v.whatsappNumber,
      message: v.message
    };
      const functionUrl = 'https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/createFacebookWhatsAppAd'
    this.http.post(functionUrl, payload).subscribe({
      next: async res => {
        this.loading = false;
        const toast = await this.toastCtrl.create({
          message: '✅ Campaña creada correctamente',
          duration: 2500,
          color: 'success'
        });
        toast.present();
        this.modalCtrl.dismiss(res);
      },
      error: async err => {
        this.loading = false;
        const toast = await this.toastCtrl.create({
          message: '❌ Error al crear campaña',
          duration: 3000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}



