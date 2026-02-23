import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref as dbRef, onValue, remove } from '@angular/fire/database';

@Component({
  selector: 'app-modal-cart',
  templateUrl: './modal-cart.component.html',
  styleUrls: ['./modal-cart.component.scss'],
})
export class ModalCartComponent implements OnInit {
  menuPromociones:any = [];
  countAdd: any;
  precio = 0;
  uid: any;
  phone: any;
  typeCart: any;
  arrayCachemenuPromociones: any = [];

  constructor(
    private route: ActivatedRoute,
    public navParams: NavParams,
    private modalController: ModalController,
    private toastController: ToastController,
    private router: Router,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.typeCart = this.navParams.get('type');
    this.phone = this.navParams.get('admin');

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.uid = user.uid;
        this.getMenuWpp();
      } else {
        this.getMenuWpp();
      }
    });
  }

  getUsers() {
    const db = getDatabase();
    const userRef = dbRef(db, 'Users/' + this.uid);
    onValue(userRef, (snap) => {
      const res = snap.val();
      const array = [];
      for (const i in res) {
        array.push(res[i]);
      }
      this.phone = res.Phone;
    });
  }

  getUsersMenu() {
    const db = getDatabase();
    const userRef = dbRef(db, 'Users/' + this.uid);
    onValue(userRef, (snap) => {
      const res = snap.val();
      const array = [];
      for (const i in res) {
        array.push(res[i]);
      }
      this.phone = res.Phone;
      this.getMenu();
    });
  }

  getMenu() {
    const db = getDatabase();
    const cartRef = dbRef(db, 'CartWpp/' + this.phone);
    onValue(cartRef, (snap) => {
      const res = snap.val();
      const array :any = [];
      for (const i in res) {
        array.push(res[i]);
      }

      if (res === null) {
        this.showToast('No hay elementos en el carrito, serás enviado al menu');
      } else {
        this.precio = 0;
        this.zone.run(() => {
          this.menuPromociones = array;
          this.arrayCachemenuPromociones = Object.keys(res);

          for (let i = 0; i < this.menuPromociones.length; i++) {
            this.precio += +this.menuPromociones[i]['Precio'];
          }
        });
      }

      console.log(this.menuPromociones);
    });
  }

  getMenuWpp() {
    const db = getDatabase();
    const cartRef = dbRef(db, 'ruta/' + this.phone + '/CartWpp/' + this.typeCart);
    onValue(cartRef, (snap) => {
      const res = snap.val();
      const array : any = [];
      for (const i in res) {
        array.push(res[i]);
      }

      if (res === null) {
        this.showToast('No hay elementos en el carrito, serás enviado al menu');
        this.modalController.dismiss();
      } else {
        this.precio = 0;
        this.zone.run(() => {
          this.menuPromociones = array;
          this.arrayCachemenuPromociones = Object.keys(res);

          for (let i = 0; i < this.menuPromociones.length; i++) {
            this.precio += +this.menuPromociones[i]['Precio'];
          }
        });
      }

      console.log(this.menuPromociones);
    });
  }

  async showToast(message: any) {
    const toast = await this.toastController.create({
      message,
      duration: 5000,
      position: 'top',
      color: 'success',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            toast.dismiss();
          },
        },
      ],
    });
    toast.present();
  }

  closeModal() {
    this.modalController.dismiss();
  }

  saveModal() {
    this.modalController.dismiss();
  }

  deleteItemCart(index: any) {
    this.precio = 0;
    const db = getDatabase();

    if (this.typeCart === 'michelotes') {
      const itemRef = dbRef(db, 'ruta/' + this.phone + '/' + this.arrayCachemenuPromociones[index]);
      remove(itemRef);
    } else {
      const itemRef = dbRef(
        db,
        'ruta/' +
          this.phone +
          '/CartWpp/' +
          this.typeCart +
          '/' +
          this.arrayCachemenuPromociones[index]
      );
      remove(itemRef);
    }

    this.showToast('Eliminado con exito');
  }

  goToConfirm() {
    this.router.navigate(['/payments/' + this.typeCart], { replaceUrl: true });
  }

  goToMenu() {
    this.router.navigate(['/search/' + this.typeCart], { replaceUrl: true });
  }

  @HostListener('window:popstate', ['$event'])
  dismissModal() {
    this.modalController.dismiss();
  }
}
