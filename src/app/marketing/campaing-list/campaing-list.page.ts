import { Component, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { get, getDatabase, ref } from 'firebase/database';

@Component({
  selector: 'app-campaing-list',
  templateUrl: './campaing-list.page.html',
  styleUrls: ['./campaing-list.page.scss'],
})
export class CampaingListPage implements OnInit {

  uid:any
  arrayListCmpg:any = []
    constructor() { }
  
    ngOnInit() {
     const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      this.uid = uid;
      this.getList();  // Llama tu método modular de getList()
    } else {
      // El usuario está desconectado
      console.log('Usuario no autenticado');
      // this.router.navigate(['/login']);
    }
  });
      
    }
  async getList() {
  const db = getDatabase();
  const listRef = ref(db, `ruta/ListCmpg/${this.uid}`);

  try {
    const snapshot = await get(listRef);
    const res = snapshot.val();
    const array = [];

    for (const i in res) {
      array.push(res[i]);
    }

    this.arrayListCmpg = array;

    // Ordenar por timestamp (asegúrate de que las claves sean consistentes)
    this.arrayListCmpg.sort((a:any, b:any) => b.tst - a.tst).reverse();

    for (let i = 0; i < this.arrayListCmpg.length; i++) {
      const timestampServidor = this.arrayListCmpg[i]['Tst'];

      const fechaServidor = new Date(timestampServidor);
      const diferenciaTiempo = Date.now() - fechaServidor.getTime();
      const fechaCliente = new Date(Date.now() - diferenciaTiempo);

      const fechaFormateada = fechaCliente.getFullYear() + '/' +
        ('0' + (fechaCliente.getMonth() + 1)).slice(-2) + '/' +
        ('0' + fechaCliente.getDate()).slice(-2) + ' ' +
        ('0' + fechaCliente.getHours()).slice(-2) + ':' +
        ('0' + fechaCliente.getMinutes()).slice(-2);

      const partes = fechaFormateada.split(" ");

      this.arrayListCmpg[i]['tst'] = partes[1];
      this.arrayListCmpg[i]['date'] = partes[0].replace("/", "-").replace("/", "-");
    }

    console.log(this.arrayListCmpg);
  } catch (error) {
    console.error('Error al obtener la lista de campañas:', error);
  }
}
  }
  