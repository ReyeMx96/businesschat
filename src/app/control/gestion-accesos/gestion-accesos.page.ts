import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-gestion-accesos',
  templateUrl: './gestion-accesos.page.html',
  styleUrls: ['./gestion-accesos.page.scss'],
})
export class GestionAccesosPage implements OnInit {
  users: any[] = [];
  email = '';
  password = '';

  constructor(
    private fns: AngularFireFunctions,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    const callable = this.fns.httpsCallable('getAllUsers');
    const result = await callable({}).toPromise();
    if (result?.success) {
      this.users = result.users;
    }
  }

  async addUser() {
    if (!this.email || !this.password) {
      this.showAlert('Faltan datos', 'Ingresa correo y contraseña');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Creando usuario...',
    });
    await loading.present();

    const callable = this.fns.httpsCallable('createUserAccount');
    const result = await callable({
      email: this.email,
      password: this.password,
    }).toPromise();

    await loading.dismiss();

    if (result?.success) {
      this.showAlert('Éxito', 'Usuario creado correctamente');
      this.email = '';
      this.password = '';
      this.loadUsers();
    } else {
      this.showAlert('Error', result?.message || 'No se pudo crear');
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({ header, message, buttons: ['OK'] });
    await alert.present();
  }
}
