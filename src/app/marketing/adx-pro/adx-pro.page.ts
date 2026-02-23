import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, MenuController, ModalController, Platform, ToastController } from '@ionic/angular';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { CreateCampaignModalComponent } from '../create-campaign-modal/create-campaign-modal.component';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getDatabase, onValue, ref as refDb } from 'firebase/database';
export interface FacebookAd {
  id?: string;

  facebook: {
    campaignId: string;
    adSetId: string;
    creativeId: string;
    adId: string;
  };

  media: {
    type: string;
    imageUrl?: string;
    imageHash?: string;
    videoUrl?: string;
    videoId?: string;
  };

  targeting: {
    gender: string;
    agemin: number;
    agemax: number;
    cities: string[];
  };

  meta: {
    dailyBudget: number;
    objective: string;
  };

  platform: string;
  ph: string;
  index: number;
  createdAt: any;
}

@Component({
  selector: 'app-adx-pro',
  templateUrl: './adx-pro.page.html',
  styleUrls: ['./adx-pro.page.scss'],
})
// ads.model.ts


export class AdxProPage implements OnInit {
 selectedFile: File | null = null;
  previewImage: string | null = null;
  imageUrl: string = "https://firebasestorage.googleapis.com/v0/b/the-business-chat.appspot.com/o/73dobEnTlHSrLpoL6LSJ0x7D7zt2%2FWhatsApp%20Image%202026-01-20%20at%2015.52.18.jpeg?alt=media&token=f3aa69df-9131-4617-ba5a-f9c0723fa41e";
  resultado: any = null;
    adId = '52662255729054'; // adId que quieres consultar
  adData: any;
  constructor(private http: HttpClient,
        private platform: Platform,
    private zone: NgZone,
    private menu: MenuController,
    private route: ActivatedRoute,
    private router: Router,
    private firestore: AngularFirestore,
    private alertController: AlertController,
    private toastController: ToastController,
    private modalController: ModalController
  ) { }
uid:any
arrayNumbers:any
ph:any
name:any
connect : any
enableService = false
  private db = getDatabase();
  private auth = getAuth();

  ngOnInit() {
  
      onAuthStateChanged(this.auth, (user: User | null) => {
          if (user) {
            this.uid = user.uid;
            const userRef = refDb(this.db, `UsersBusinessChat/${this.uid}`);
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
                  this.loadAds();

                  this.name = res.Name || '';
                  this.connect = res.Connect || '';
                });
              }
            });
          }
        });
  }
loading = true;

  whatsappNumber = '5218332367397';
  ads: FacebookAd[] = [];
  loadAds() {
    this.firestore
      .collection<FacebookAd>('facebook_ads', ref =>
        ref.where('ph', '==', this.whatsappNumber)
           .orderBy('createdAt', 'desc')
      )
      .valueChanges({ idField: 'id' })
      .subscribe({
        next: (data) => {
          this.ads = data;
           this.loading = false;
          console.log('📊 ADS:', data);
        },
        error: (err) => {
          console.error('❌ Error Firestore:', err);
           this.loading = false;
        }
      });
  }

   async loadAdData() {
  try {
    const adsCol = this.firestore.collection('facebook_ads');
    const adsSnap = await adsCol.get().toPromise();

    const adsList: any[] = [];
adsSnap!.forEach(docSnap => {
  adsList.push({ id: docSnap.id, ...(docSnap.data() ?? {}) });
});


    this.zone.run(() => {
      this.adData = adsList; // ahora adData es un array de todos los anuncios
      console.log('Lista completa de anuncios:', this.adData);
    });

  } catch (err) {
    console.error('Error cargando anuncios:', err);
  }
}


  async openWhatsApp() {
    if (!this.adData?.ph) return;

    const url = `https://wa.me/${this.adData.ph}`;
    window.open(url, '_blank');
  }

crearAnuncio2() {
    if (!this.imageUrl.trim()) {
      alert('Ingresa una URL de imagen válida');
      return;
    }

    //const functionUrl = 'https://us-central1-reczon-delivery.cloudfunctions.net/api/createFacebookAd'; // reemplaza por tu URL real
  const functionUrl = 'https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/createFacebookWhatsAppAd';
//const functionUrl = 'https://us-central1-reczon-delivery.cloudfunctions.net/api/createFacebookCatalogAd';


    this.http.post(functionUrl, { imageUrl: this.imageUrl }).subscribe({
      next: (res) => {
        this.resultado = res;
        console.log('✅ Anuncio creado:', res);
      },
      error: (err) => {
        console.error('❌ Error al crear anuncio:', err);
        alert('Ocurrió un error al crear el anuncioxxxxxxxxxs');
      }
    });
  }

  crearAnuncio() {
  //1473791564061491
  // const catalogId = '749139975478336';
  // const productSetId = '972811028119534';
    const catalogId = '1473791564061491';
  const productSetId = '702721195802991';
  
  const pageId = '1707474032916462';
  const adAccountId = 'act_294228311';

  const functionUrl = 'https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/createFacebookCatalogAdx2';

  this.http.post(functionUrl, {
    catalogId,
    productSetId,
    pageId,
    adAccountId
  }).subscribe({
    next: (res) => {
      this.resultado = res;
      console.log('✅ Anuncio catálogo creado:', res);
    },
    error: (err) => {
      console.error('❌ Error al crear anuncio catálogo:', err);
      alert('Ocurrió un error al crear el anuncio');
    }
  });
}

async openCreateCampaign() {
  const modal = await this.modalController.create({
    component: CreateCampaignModalComponent,
    cssClass: 'create-campaign-modal'
  });

  modal.onDidDismiss().then(res => {
    if (res.data) {
      console.log('Campaña creada:', res.data);
      // aquí refrescas la tabla
    }
  });

  await modal.present();
}
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    // vista previa
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => this.previewImage = reader.result as string;
      reader.readAsDataURL(this.selectedFile);
    }
  }
  async uploadImage() {
    if (!this.selectedFile) return;

    try {
      const storage = getStorage();
      const filePath = `anuncios/${Date.now()}_${this.selectedFile.name}`;
      const fileRef = ref(storage, filePath);

      const upload = await uploadBytes(fileRef, this.selectedFile);
      this.imageUrl = await getDownloadURL(upload.ref);

      console.log("✅ Imagen subida:", this.imageUrl);
      alert("Imagen subida correctamente");

    } catch (err) {
      console.error("❌ Error al subir imagen:", err);
      alert("Error al subir imagen");
    }
  }
}
