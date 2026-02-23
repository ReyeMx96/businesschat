import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { ShowFullImgComponent } from '../show-full-img/show-full-img.component';
import { AlertController, LoadingController, ModalController, NavParams, ToastController } from '@ionic/angular';
import { FechaService } from 'src/app/fecha.service';
import { ActivatedRoute } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { get, getDatabase, push, ref, update } from 'firebase/database';
import { getDownloadURL,ref as storageRef, getStorage, uploadBytesResumable } from 'firebase/storage';

@Component({
  selector: 'app-modal-profile',
  templateUrl: './modal-profile.component.html',
  styleUrls: ['./modal-profile.component.scss'],
})
export class ModalProfileComponent  implements OnInit {
firstOperation:any
  uidUser:any
  showBackdrop:any
  constructor(private modalController: ModalController,private route: ActivatedRoute,
    private zone : NgZone,private toastController:ToastController,
    private dateService: FechaService,private alertController : AlertController,
    
    private loadingController : LoadingController,public navParams: NavParams) { }
  userLogout: any;
AccType: any;
rescache: any;
loading: any;
desc: any = "Usuario frecuente su producto favorito es las fresas con crema su media de compra es de $150. Tiende a comprar por las noches.";
keyProduct: any;
name: any;
quejas: any = 0;
nocivo: any = 0;
pedidosUserArray: any = [];
modal: any;
lastSeen: any;
admin: any;
vfType: any;
gender: any;
regdate: any;
hbd: any;
email: any;
specialCredits: any;
credits: any;
croppedImage: any;
img: any;
favProd: any;
favProdTimes: any;
owner: any = true;
street: any;
lat: any;
lng: any;
fechaServer: any;
user: any;

  arrayFavorites: any = []
  gastoTotal = 0
  loaded = 0
  tag:any
typeCart: any;
sucursal: any;
phoneAdmin: any;
mapUrl: any;
metodoPago: any;
phoneNumberId: any;
token: any;
cuantoPaga: any;
ind: any;
costoEnvio: any;

  discountsState = false
  chatArray = []
  pjName = "environment.NameProjectDB"
  ngOnInit() {
    const modalState = {
      modal : true,
      desc : 'fake state for our modal'
    };
    history.pushState(modalState, "null");
    this.fechaServer =  this.dateService.serverHour()
    this.discountsState = this.navParams.get('discounts');
    this.street = this.navParams.get('ubicacion');
    this.typeCart = this.navParams.get('type');
    this.phoneAdmin = this.navParams.get('admin');
    this.chatArray = this.navParams.get('chat');
    this.getChatAnalitycs(this.chatArray);
    this.sucursal = this.navParams.get('suc');
    this.metodoPago = this.navParams.get('metodoPago');
    this.phoneNumberId = this.navParams.get('phonenumberid');
    this.token = this.navParams.get('token');
   this.cuantoPaga = this.navParams.get('cuantopaga');
   this.ind = this.navParams.get('notageneral');
   this.costoEnvio =  this.navParams.get('costoEnvio');
   this.name =  this.navParams.get('name');
   this.lat =  this.navParams.get('lat');
   this.lng =  this.navParams.get('lng');
   this.tag =  this.navParams.get('tag');
   this.getHistoryClient(this.typeCart)
   setTimeout(() => {
   this.imgGoogle(this.lat,this.lng)
     
   }, 1000);

 const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  this.uidUser = this.route.snapshot.paramMap.get('uid');
});
   // alert(this.uidUser)
  }
  closeModal(){
    this.modalController.dismiss()
  }
  getChatAnalitycs(array:any){
    let primerMensaje = null;
    let valorMin = Infinity;

// Itera sobre los objetos en el array
array.forEach((elemento:any) => {
  if (elemento.tstcache < valorMin) {
    valorMin = elemento.tstcache;
    primerMensaje = elemento;
  }
});
    
console.log("El primer mensaje enviado es:", primerMensaje);
this.firstOperation = primerMensaje
  }
async getHistoryClient(user: any) {
  const db = getDatabase();
  const pedidosRef = ref(db, `ruta/${this.phoneAdmin}/Pedidos/${user}`);
  
  try {
    const snapshot = await get(pedidosRef);
    const res = snapshot.val();
    const array: any[] = [];

    if (res) {
      for (const i in res) {
        array.push(res[i]);
      }
    }

    this.zone.run(() => {
      this.pedidosUserArray = array;
      this.arrayFavorites = [];
      this.gastoTotal = 0;

      for (let i = 0; i < this.pedidosUserArray.length; i++) {
        for (let x = 0; x < this.pedidosUserArray[i]['List'].length; x++) {
          this.arrayFavorites.push({
            Nombre: this.pedidosUserArray[i]['List'][x]['Nombre']
          });
        }

        this.gastoTotal += this.pedidosUserArray[i]['Precio'] + this.pedidosUserArray[i]['Deliv'];
      }

      const nombresUnicos = [...new Set(this.arrayFavorites.map((item:any) => item.Nombre.toLowerCase()))];

      const contador: { [key: string]: number } = {};
      nombresUnicos.forEach((nombre:any) => {
        contador[nombre] = 0;
      });

      this.arrayFavorites.forEach((elemento:any) => {
        const nombre = elemento.Nombre.toLowerCase();
        if (contador.hasOwnProperty(nombre)) {
          contador[nombre]++;
        }
      });

      let nombreMax = '';
      let valorMax = 0;

      for (const nombre in contador) {
        if (contador[nombre] > valorMax) {
          valorMax = contador[nombre];
          nombreMax = nombre;
        }
      }

      nombreMax = this.capitalizarPrimeraLetra(nombreMax);
      this.favProd = nombreMax;
      this.favProdTimes = valorMax;

      this.desc =
        `Su producto favorito es ${this.favProd}. Lo ha comprado ${this.favProdTimes} veces y ha gastado $${this.gastoTotal}. \n` +
        `Su primer interacción fue el ${this.firstOperation['fecha']} ${this.firstOperation['tst']}`;

      console.log(contador);
      console.log(this.pedidosUserArray);
    });

  } catch (error) {
    console.error('Error obteniendo historial:', error);
  }
}

capitalizarPrimeraLetra(str:any) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
  imgGoogle(lat:any,lng:any){
    // Tu clave de API de Google Maps

    const apiKey = 'AIzaSyClueipQXCVTtY6Vr4Wo5x_QSyXRI5raw0';

    // Coordenadas del centro del mapa (por ejemplo, Ciudad de México)

    // Coordenadas del centro del mapa (por ejemplo, Ciudad de México)


    // Parámetros de la imagen del mapa
    const zoom = 14; // Nivel de zoom
    const size = '600x400'; // Tamaño de la imagen (ancho x alto)
    const mapType = 'roadmap'; // Tipo de mapa (roadmap, satellite, hybrid, terrain)
    const marker = `markers=color:red%7C${lat},${lng}`; // Marcador en las coordenadas especificadas

    // Construir la URL de la imagen del mapa
  //  https://maps.googleapis.com/maps/api/staticmap?center=Williamsburg,Brooklyn,NY&zoom=13&size=400x400&
//markers=color:blue%7Clabel:S%7C11211%7C11206%7C11222&key=YOUR_API_KEY&signature=YOUR_SIGNATURE
    this.mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&maptype=${mapType}&${marker}&key=${apiKey}`;

    console.log('Mapa URL:', this.mapUrl);


  }
  resetArray(){

  }
  logout(){
    //this.authsv.logout()
    //this.popCtrl.dismiss()
    localStorage.setItem('UID','null')
    window.location.reload()
  }
  shareGralLoc(var1:any,var2:any){
    var1 = this.lat
    var2 = this.lng
    let newVariable: any;
  
    newVariable = window.navigator;
      
      if (newVariable && newVariable.share) {
        newVariable.share({
          title: '',
          text: '',
          url: "https://www.google.com/maps?q=" + var1 + "," + var2,
        })
          .then(() => console.log('Successful share'))
          .catch((error:any) => 
          
          
          console.log('error',error)
          );
      } else {

      }
  
}

  async getGender() {
    const alert = await this.alertController.create({
      header: 'Select gender',
      inputs: [
        {
          name: 'gender',
          type: 'radio',
          label: 'Hombre',
          value: 'male',
          checked: true
        },
        {
          name: 'gender',
          type: 'radio',
          label: 'Mujer',
          value: 'female'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Accept',
          handler: (data:any) => {
            console.log('Seleccionado:', data);
            //alert(data)
            
        const db = getDatabase();
        const userRef = ref(db, `${this.pjName}/Users/${this.user}`);

        update(userRef, { Gender: data.toUpperCase() })
          .then(() => {
            this.gender = data.toUpperCase();
            this.showToast('Updated successfully');
          })
          .catch(err => {
            console.error('Update failed:', err);
          });
          }
        }
      ]
    });
  
    await alert.present();
  }


  async showToast(message:any){
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position:'middle',
      color:'danger',
      buttons: [
  
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
          
       toast.dismiss();
            }
        }
      ]
    });
    toast.present();
  }
  async presentDateAlert() {
    const alert = await this.alertController.create({
      header: 'Select your birthday',
      inputs: [
        {
          name: 'dob',
          type: 'date',
          label: 'Birthday',
          value: '1990-01-01' // Valor predeterminado opcional
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Accept',
          handler: (data:any) => {
            console.log('Fecha de Nacimiento:', data.dob);
       
const db = getDatabase();
const userRef = ref(db, `${this.pjName}/Users/${this.user}`);

update(userRef, { Hbd: data.dob })
  .then(() => {
    this.hbd = data.dob;
    this.showToast('Updated successfully');
  })
  .catch(err => {
    console.error('Update failed:', err);
  });
          }
        }
      ]
    });
  
    await alert.present();
  }
  doit(){

  
    document.getElementById("upload2")!.click();
  } 
  async presentTextAlertName() {
    const alert = await this.alertController.create({
      header: 'Change name',
      inputs: [
        {
          name: 'name',
          value: this.name,
          type: 'text',
          placeholder: 'Write your name here...'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Accept',
          handler: (data:any) => {
            console.log('Descripción:', data.descripcion);
     const db = getDatabase();
const userRef = ref(db, `${this.pjName}/Users/${this.user}`);

update(userRef, { Name: data.name })
  .then(() => {
    this.name = data.name;
    this.showToast('Updated successfully');
  })
  .catch(err => {
    console.error('Update failed:', err);
  });
          }
        }
      ]
    });
  
    await alert.present();
  }
  async presentTextAlertNameAdmin() {
    const alert = await this.alertController.create({
      header: 'Change name',
      inputs: [
        {
          name: 'name',
          value: this.name,
          type: 'text',
          placeholder: 'Write your name here...'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Accept',
          handler: (data:any) => {
            console.log('Descripción:', data.descripcion);
   
            const db = getDatabase();
            const userRef = ref(db, `${this.pjName}/Users/${this.uidUser}`);

            update(userRef, { Name: data.name })
              .then(() => {
                this.name = data.name;
                this.showToast('Updated successfully');
              })
              .catch(err => {
                console.error('Update failed:', err);
              });
          }
        }
      ]
    });
  
    await alert.present();
  }
  async presentTextAlertNameAdminCorreo() {
    const alert = await this.alertController.create({
      header: 'Change name',
      inputs: [
        {
          name: 'name',
          value: this.email,
          type: 'text',
          placeholder: 'Change email...'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Accept',
          handler: (data) => {
            console.log('Descripción:', data.descripcion);
   const db = getDatabase();
const userRef = ref(db, `${this.pjName}/Users/${this.uidUser}`);

update(userRef, { Email: data.name })
  .then(() => {
    this.name = data.name;
    this.showToast('Updated successfully');
  })
  .catch(err => {
    console.error('Update failed:', err);
  });
          }
        }
      ]
    });
  
    await alert.present();
  }
  async presentTextAlert() {
    const alert = await this.alertController.create({
      header: 'Add Description',
      inputs: [
        {
          name: 'descripcion',
          type: 'text',
          value: this.desc,
          placeholder: 'Write your description here...'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Cancelado');
          }
        },
        {
          text: 'Accept',
          handler: (data:any) => {
            console.log('Descripción:', data.descripcion);
      const db = getDatabase();
const userRef = ref(db, `${this.pjName}/Users/${this.user}`);

update(userRef, { Desc: data.descripcion })
  .then(() => {
    this.desc = data.descripcion;
    this.showToast('Updated successfully');
  })
  .catch(err => {
    console.error('Update failed:', err);
  });
          }
        }
      ]
    });
  
    await alert.present();
  }
async newBot() {
  this.loadingUser();

  const db = getDatabase();
  const userRef = ref(db, `${this.pjName}/Users/${this.user}`);

  try {
    await update(userRef, {
      Img: localStorage.getItem('imgnow')
    });

    setTimeout(() => {
      this.showToast('Se actualizó la imagen correctamente.');
      this.loading.dismiss();
      location.reload();
    }, 1000);

    localStorage.setItem('imgnow', '');

  } catch (err) {
    console.error('Error updating image:', err);
  }

  console.log('coninunin');
}

async uploadImg() {
  var we2 = document.getElementById('imagenProfile2')!.outerHTML;
  var resultmatch = we2.match('src="' + '(.*?)">');

  const db = getDatabase();

  try {
    const snap = await push(ref(db, 'Users'), {});
    const key = snap.key;
    localStorage.setItem('KeyProductDynamicLink', key!);
    this.keyProduct = key;
  } catch (err) {
    console.error('Error pushing new user:', err);
  }

  if (resultmatch && resultmatch[1].length > 150) {
    var filePath = '/E8Fit/ProfileUsers/' + Math.random().toString(36).substring(2, 15)
      + Math.random().toString(36).substring(2, 15)
      + localStorage.getItem('img64name');

    console.log(filePath);

    const storage = getStorage();
    const storageReference = storageRef(storage, filePath);
    const url = resultmatch[1];

    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        var file = new File([blob], "selectim5g.png", { type: "image/png" });
        const uploadTask = uploadBytesResumable(storageReference, file);

        uploadTask.on('state_changed',
          (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          },
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL);
              localStorage.setItem('imgnow', downloadURL);
              document.getElementById('btnUpload2')!.click();
            });
          }
        );

        console.log(file);
      });
  } else {
    var hendle = setInterval(() => {
      this.loading.dismiss();
      this.showToast('Debes seleccionar una imagen primero');
      clearInterval(hendle);
    }, 2000);
  }
}








    async  loadingUser(){
      this.loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Cargando imagen, puede demorar algunos segundos...',
      });
      await this.loading.present();
    }
    async openImg() {
      this.modal = await this.modalController.create({
        component: ShowFullImgComponent,
        cssClass: 'date-medium',
        canDismiss:true,
        backdropDismiss:true,
         initialBreakpoint:0.99,
          breakpoints:[0, 0.25, 1, 0.1],
         componentProps: {
           Img: this.mapUrl,
      
       }
      
      });
      await this.modal.present();
    
    
      await this.modal.onDidDismiss().then((e:any)=>{
        console.log(e.data)
    
      //  this.fdn = e.data.toString()
    
        //this.fecha =e.data.toString()
      // this.arrayPartidosHoy = []
       //this.getPartidos()
    
       
     })
    
    }
    @HostListener('window:popstate', ['$event'])
    dismissModal() {
      this.modalController.dismiss();
    }
  
}
