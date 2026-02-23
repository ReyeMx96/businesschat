import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { getAuth, GoogleAuthProvider, RecaptchaVerifier, sendPasswordResetEmail, signInWithPhoneNumber, signInWithPopup, signOut } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import { map, Observable, take } from 'rxjs';
import { Database, ref, set, update, get, child , getDatabase} from '@angular/fire/database';
//import { Configuration } from "openai";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
interface User {
  projects: any[]; // Cambia `any` por el tipo adecuado si lo conoces
  // Puedes agregar otros campos según sea necesario
}

interface UserData {
  phone?: string;
  uid?: string;
  cred?: string;
  nombre?: string;
  rol? : string;
  direccion : string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
 private isAuthenticated = false
 private currentUserUid: string | null = null;
  private auth = getAuth();
  private db = getDatabase();
rol: any = ""
  private apiUrl = "https://api.openai.com/v1/chat/completions"; // URL de la API
  apiKey = environment.mapsKey; // Tu clave de API

  constructor(
    public loadingController: LoadingController,
    public alertController: AlertController,
    public platform: Platform,
    private toastController: ToastController,
    private firestore: AngularFirestore,
    private http: HttpClient,
    private afAuth: AngularFireAuth
  ) {
    
  }

  async loginGoogle(): Promise<any> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      console.log(result.user);
      return result.user;
    } catch (error) {
      console.error('Error en login con Google:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      localStorage.setItem('UID', 'null');
    } catch (error) {
      console.log('Error al cerrar sesión:', error);
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      console.log('Error al enviar correo de recuperación:', error);
    }
  }
  async isLoggedIn(): Promise<boolean> {
    // Devuelve una promesa que resuelve el estado de autenticación
    const user = await this.afAuth.authState.pipe(take(1)).toPromise();
    
    if (user) {
      console.log('Usuario logueado:', user);
      this.isAuthenticated = true;
      this.currentUserUid = user.uid;
    } else {
      console.log('No hay usuario logueado');
      this.isAuthenticated = false;
      this.currentUserUid = null;
    }

    return this.isAuthenticated; // Devuelve el estado actualizado
  }
  async login(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log('Login successful:', userCredential);
      return userCredential;
    } catch (error:any) {
      console.error('Error al iniciar sesión:', error);
      this.showToast('Error al iniciar sesión: ' + error.message);
      throw error;
    }
  }

    private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top' 
    });
    toast.present();
  }

  async getUID(): Promise<string | null> {
    return this.currentUserUid;
  }
    async isClient(): Promise<boolean> {
 
    
    return new Promise((resolve, reject) => {
      // Verificar que currentUserUid no sea nulo

      if (this.currentUserUid) {
        // Si currentUserUid tiene un valor, continúa con la consulta
        this.firestore.collection('users').doc(this.currentUserUid).valueChanges().subscribe(userData => {
          const data = userData as UserData; // Casting el tipo a UserData
          if (data) {
            this.rol = data.rol ?? null; // Asignar el rol del usuario
  
            // Verificar el rol
            if (this.rol === 'client') {
              resolve(true); // Retorna true si es 'client'
            } else {
              resolve(false); // Retorna false si no es 'client'
            }
          } else {
            console.warn('No se pudieron obtener datos del usuario:', userData);
            resolve(false); // Si no hay datos, considera que no es cliente
          }
        }, error => {
          console.error('Error al obtener los datos del usuario:', error);
          resolve(false); // Manejo de error
        });
      } else {
        console.warn('currentUserUid es null');
        resolve(false); // Si el UID es null, no es cliente
      }
    });
  }

  async registerUser(data: any, uid: string) {
    const loading = await this.loadingController.create({
      message: 'Agregando usuario a la base de datos',
    });
    await loading.present();

    const userRef = ref(this.db, `UsersBusinessChat/${uid}`);
    await set(userRef, data);

    await loading.dismiss();
  }

  async addProduct(reference: string, keyProduct: string, array: any, url: string, arraytags: any) {
    const loading = await this.loadingController.create({
      message: 'Agregando producto a la base de datos',
    });
    await loading.present();

    const productRef = ref(this.db, `Shop/${reference}/${keyProduct}`);
    await set(productRef, array);
    await update(productRef, {
      Img: localStorage.getItem('imgNew'),
      Url: url,
      Reference: keyProduct,
    });

    const tagsRef = ref(this.db, `Shop/TagsProducts/${keyProduct}`);
    await set(tagsRef, arraytags);

    await loading.dismiss();
    this.customAlertMessage('Producto agregado', 'Se agregó el producto exitosamente');
  }

  async getCategorias(): Promise<any[]> {
    const catRef = ref(this.db, 'Shop/Categorias');
    const snapshot = await get(catRef);
    const data = snapshot.val();

    if (!data) return [];

    return Object.values(data);
  }

  async getCodeCloudStore(reference: string, refCode: string): Promise<any[]> {
    const uid = localStorage.getItem('UID')!;
    const codeRef = ref(this.db, `CodeCloudStore/${reference}/${uid}/${refCode}`);
    const snapshot = await get(codeRef);
    const data = snapshot.val();

    if (!data) return [];

    return Object.values(data);
  }

  async onFailAlert(type: string, error: string) {
    const alert = await this.alertController.create({
      header: type,
      message: error,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async customAlertMessage(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

    textPred = "" 
    getDataFromOpenAI(prompt: string): Observable<any> {
    
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${this.apiKey}`,
      "max_tokens": "1000",
    });

    const body = {
      model: "gpt-4",
      messages: [
        { role: "system", 
          content: "Eres un bot que responde mensajes del cliente eres muy amable y usas iconos, estas diseñado para crear respuestas cortas y efectivas" +
         "y utilizas un lenguaje bastante natural. Estos son tus conocimientos: " +
         "Michelotes Es el nombre del Negocio. Michebot Es tu nombre."+
         ""+
         ""
        
        },
        { role: "user", content: prompt }
      ],
    };
    console.log(body)
    return this.http.post(this.apiUrl, body, { headers });
  }

}
