import { Component, OnInit } from '@angular/core';
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';

interface CPItem {
  cp: string;
  precio: number | null;
  docRef: any;
}

@Component({
  selector: 'app-codigos-postales',
  templateUrl: './codigos-postales.page.html',
  styleUrls: ['./codigos-postales.page.scss'],
})
export class CodigosPostalesPage implements OnInit {

  firestore = getFirestore();
  listaCP: CPItem[] = [];

  constructor() { }

  async ngOnInit() {
    await this.cargarCodigosPostales();
  }

  // -------------------------
  // Cargar todos los CP
  // -------------------------
  async cargarCodigosPostales() {
    this.listaCP = [];
    try {
      const cpColRef = collection(this.firestore, 'CodigoP/toyama/CPs');
      const snapshot = await getDocs(cpColRef);

      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        this.listaCP.push({
          cp: docSnap.id,
          precio: data['precio'] || null,
          docRef: docSnap.ref
        });
      });

      console.log('🔥 Lista de CP cargada:', this.listaCP);

    } catch (err) {
      console.error('Error cargando CP:', err);
    }
  }

  // -------------------------
  // Editar precio de un CP
  // -------------------------
  async editarCP(cpItem: CPItem) {
    const alert = document.createElement('ion-alert');
    alert.header = `Editar CP ${cpItem.cp}`;
    alert.inputs = [
      { name: 'precio', type: 'number', value: cpItem.precio, placeholder: 'Nuevo precio' }
    ];
    alert.buttons = [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Guardar',
        handler: async (data) => {
          if (!data.precio) return;

          await updateDoc(cpItem.docRef, {
            precio: Number(data.precio),
            updatedAt: new Date()
          });

          cpItem.precio = Number(data.precio);
          console.log('🔥 Precio actualizado:', cpItem.cp, data.precio);
        }
      }
    ];

    document.body.appendChild(alert);
    await alert.present();
  }

  // -------------------------
  // Agregar nuevo CP
  // -------------------------
  async agregarNuevoCP() {
    const alert = document.createElement('ion-alert');
    alert.header = 'Nuevo Código Postal';
    alert.inputs = [
      { name: 'cp', type: 'text', placeholder: 'Código Postal' },
      { name: 'precio', type: 'number', placeholder: 'Precio' }
    ];
    alert.buttons = [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Agregar',
        handler: async (data) => {
          if (!data.cp || !data.precio) return;

          const cpID = data.cp;
          const docRef = doc(this.firestore, `CodigoP/toyama/CPs/${cpID}`);

          await setDoc(docRef, {
            precio: Number(data.precio),
            createdAt: new Date()
          });

          this.listaCP.push({
            cp: cpID,
            precio: Number(data.precio),
            docRef
          });

          console.log('🔥 Nuevo CP agregado:', cpID);
        }
      }
    ];

    document.body.appendChild(alert);
    await alert.present();
  }

}
