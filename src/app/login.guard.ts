import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    try {
      console.log('Checking if user is logged in...');
      const loggedIn = await this.authService.isLoggedIn();

      if (!loggedIn) {
        console.log('User is not logged in, allowing access to login page.');
        return true; // Permitir el acceso a la página de login
      }

      // Si el usuario está autenticado, verificar sus roles
      console.log('User is logged in, checking roles...');
      
      if (await this.authService.isClient()) {
        console.log('User is a client, redirecting to marketplace...');
      
        this.router.navigate(['/pedidos']);
        return false; // Bloquear acceso a la página de login
      }

      if (await this.authService.isAdminRest()) {
        console.log('User is a restaurant admin, redirecting to tester-restaurant...');
        //this.router.navigate(['/casa/tester-restaurant']);
        return false;
      }

      if (await this.authService.isAdmin()) {
        console.log('User is an admin, redirecting to all...');
        this.router.navigate(['/pedidos']);
        return false;
      }

      console.log('User does not have a recognized role, redirecting to login...');
      return true; // Bloquear acceso si no se reconoce el rol

    } catch (error) {
      console.error('Error during authentication guard:', error);
      return false; // Bloquear acceso en caso de error
    }
  }
}
