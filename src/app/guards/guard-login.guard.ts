import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Ajusta la ruta si es necesario
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, 
       private firestore: AngularFirestore, private alertCtrl: AlertController) {}

  async canActivate(): Promise<boolean> {
    try {
      console.log('Checking if user is logged in...');
      const loggedIn = await this.authService.isLoggedIn();

      if (!loggedIn) {
        console.log('User is not logged in, allowing access to login page.');
        return true; // Permitir acceso a login
      }

      const uid = await this.authService.getUID() || ""; 
      const userRef = this.firestore.collection('users').doc(uid);
      const docSnap = await userRef.get().toPromise();

      if (!docSnap!.exists) {
        console.log('User doc not found, allowing access to login.');
        return true;
      }

      const userData: any = docSnap!.data();
      const rol = userData?.rol;
      const savedPanelId = localStorage.getItem('idpanel');
      if (savedPanelId) {
        console.log('Panel ID found in localStorage, redirecting...');
        this.router.navigate([`/panel/${savedPanelId}`], { replaceUrl: true });
        return false;
      } else {
        console.log('No panel ID in localStorage.');
      }
      if (rol === 'client' || rol === "admin") {
        console.log('User is a client, redirecting to conversations...');
        this.router.navigate(['/tabs/conversations'], { replaceUrl: true });
        return false;
      }




      // Usuario con rol no reconocido
      console.log('User role not recognized, redirecting to login...');
      return true;

    } catch (error) {
      console.error('Error during authentication guard:', error);
      return false;
    }
  }


}
