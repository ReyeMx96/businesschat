import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { catchError, tap } from 'rxjs/operators';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PushService {
  token: string | null = null;

  constructor(private afMessaging: AngularFireMessaging,private firestore: AngularFirestore) {}

  getMessages() {
    return this.afMessaging.messages;
  }

  private getDeviceId(): string {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = crypto.randomUUID(); // genera un UUID único
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  }

  // requestPermission(bot: string) {
  //   return this.afMessaging.requestToken.pipe(
  //     tap(async (token) => {
  //       console.log('token:', token);

  //       const deviceId = this.getDeviceId();
  //       const tokenRef = this.firestore.collection( 'tokenWeb');

  //       try {
  //         // Verificar si ya existe un token para este deviceId
  //         const q = query(tokenRef, where('idDevice', '==', deviceId));
  //         const snapshot = await getDocs(q);

  //         if (!snapshot.empty) {
  //           console.log('Este dispositivo ya tiene un token registrado.');
  //           return;
  //         }

  //         // Si no existe, crear un nuevo documento
  //         await addDoc(tokenRef, {
  //           tokenWeb: token,
  //           tst: serverTimestamp(),
  //           idDevice: deviceId,
  //           bot: bot
  //         });

  //         console.log('Token guardado en Firestore correctamente');
  //       } catch (error) {
  //         console.error('Error guardando token en Firestore:', error);
  //       }
  //     })
  //   );
  // }

requestPermission(bot: string) {
  return this.afMessaging.requestToken.pipe(
    tap(async (token) => {
      console.log('token:', token);

      const deviceId = this.getDeviceId();
      const tokenRef = this.firestore.collection('tokenWeb');

      try {
        // Verificar si ya existe un token para este deviceId
        const snapshot = await tokenRef.ref.where('idDevice', '==', deviceId).get();

        if (!snapshot.empty) {
          console.log('Este dispositivo ya tiene un token registrado. Actualizando token...');

          const doc = snapshot.docs[0];

          await tokenRef.doc(doc.id).update({
            tokenWeb: token,
            tst: new Date()
          });

          console.log('Token actualizado correctamente');
          return;
        }

        // Si no existe, crear uno nuevo
        await tokenRef.add({
          tokenWeb: token,
          tst: new Date(),
          idDevice: deviceId,
          bot: bot
        });

        console.log('Token guardado en Firestore correctamente');

      } catch (error) {
        console.error('Error guardando token en Firestore:', error);
        alert('Firestore ERROR: ' + error);
      }
    }),

    // ⬅️ ATRAPA errores del requestToken o del observable
    catchError((err) => {
      console.error('Error solicitando el token de notificaciones:', err);
      alert('requestToken ERROR: ' + err);
      return of(null); // evita que explote el observable
    })
  );
}


}
