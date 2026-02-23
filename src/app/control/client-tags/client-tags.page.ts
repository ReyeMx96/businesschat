import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { getAuth, onAuthStateChanged,User  } from 'firebase/auth';
import { get, getDatabase, onValue, ref as dbRef } from 'firebase/database';
import { ModalFiltersComponent } from 'src/app/modals/modal-filters/modal-filters.component';

@Component({
  selector: 'app-client-tags',
  templateUrl: './client-tags.page.html',
  styleUrls: ['./client-tags.page.scss'],
})
export class ClientTagsPage implements OnInit {

 actualVar = "Tst"
  arrayContactosRes : any
  arrayVariables:any = []
  eventarget:any
 arrayContactos:any = []
 menuLength = 0 
 enableService = false
 arrayContactosCacheSearch:any = []
 arrayContactosCache:any = []
 ph:any
 arrayNumbers:any = []
 descVars = [
  {Name:"Tst",Desc:"Ultima vez que el cliente envió un mensaje"},
  {Name:"TstMe",Desc:"Ultima vez que el bot envió un mensaje al cliente"},
  {Name:"TstCmpg",Desc:"Ultima vez que envió un mensaje de campaña al cliente"},
  {Name:"LstBuy",Desc:"Ultima vez que el cliente compró"},
  {Name:"BuyCnt",Desc:"Veces que el cliente compró"},
  {Name:"FavProd",Desc:"Producto Favorito"},
  {Name:"Quejas",Desc:"Quejas realizadas"},
  {Name:"WppNoWeb",Desc:"Hablo al bot y pero compró producto"},
  {Name:"DgtlReq",Desc:"Veces que compró por digitalmente"},
  {Name:"WppNoWeb",Desc:"Hablo al bot y pero compró producto"},
  {Name:"LstSuc",Desc:"Ultima sucursal en la que compró"},
  {Name:"Sug",Desc:"Veces que hizo sugerencias"},
  {Name:"Num",Desc:"Ordenar por numero telefonico"},
  {Name:"Name",Desc:"Ordenar por orden alfabetico"},
  {Name:"Km",Desc:"Distancia entre sucursal"},

  {Name:"AsesrReq",Desc:"Veces que solicitó un asesor"},
  {Name:"CartFgt",Desc:"Dejó su carrito incompleto"}
]
 modal: any
 uid:any
 descVar = ""

  constructor(private router: Router,private actionSheetCtrl: ActionSheetController, 
    private alertController: AlertController,
    private modalController: ModalController,
    private zone: NgZone) {
      
    }
  ngOnInit() {
    const auth = getAuth();
    const db   = getDatabase();

    onAuthStateChanged(auth, async (user: User | null) => {
      if (!user) {
        return;
      }

      this.uid = user.uid;

      // Fetch initial user business chat record once
      try {
        const userSnap = await get(dbRef(db, `UsersBusinessChat/${this.uid}`));
        const userRes = userSnap.val() || {};

        // Now subscribe to live updates
        onValue(dbRef(db, `UsersBusinessChat/${this.uid}`), async (snap) => {
          const res = snap.val() || {};
          const array: string[] = [];

          if (!res.Auth) {
            this.enableService = false;
            alert('we');
          } else {
            this.enableService = true;
            for (const i in res.Auth) {
              array.push(res.Auth[i].Ph);
            }
            this.zone.run(async () => {
              this.arrayNumbers = array;
              this.ph = res.SelectedPh;

              // Load contactos
              const contactosSnap = await get(dbRef(db, `ruta/Contactos/${this.ph}`));
              const contactosRes = contactosSnap.val() || {};
              this.arrayContactosRes = Object.keys(contactosRes);
              this.arrayContactosCache = Object.values(contactosRes);

              // Sort and enrich cache
              this.arrayContactosCache.sort((a:any, b:any) => b.Tst - a.Tst);
              this.arrayContactosCache.forEach((item: any, i: number) => {
                // calculate Km
                item.Km = this.calcularDistancia(
                  22.314669261048728, -97.8686636897337,
                  item.Lat, item.Lng
                );

                // format LstBuy
                const fb = new Date(item.LstBuy);
                const diff = Date.now() - fb.getTime();
                const localDate = new Date(Date.now() - diff);
                const fstr = `${localDate.getFullYear()}/${
                  ('0' + (localDate.getMonth() + 1)).slice(-2)}/${
                  ('0' + localDate.getDate()).slice(-2)} ${
                  ('0' + localDate.getHours()).slice(-2)}:${
                  ('0' + localDate.getMinutes()).slice(-2)}`;
                const [d, t] = fstr.split(' ');
                item.LstBuy = `${t}\n${d.replace(/\//g, '-')}`;

                // format Tst
                const ft = new Date(item.Tst);
                const diff2 = Date.now() - ft.getTime();
                const local2 = new Date(Date.now() - diff2);
                const tstr = `${local2.getFullYear()}/${
                  ('0' + (local2.getMonth() + 1)).slice(-2)}/${
                  ('0' + local2.getDate()).slice(-2)} ${
                  ('0' + local2.getHours()).slice(-2)}:${
                  ('0' + local2.getMinutes()).slice(-2)}`;
                const [d2, t2] = tstr.split(' ');
                item.Tst = `${t2}\n${d2.replace(/\//g, '-')}`;
              });

              // take first 200
              this.arrayContactos = this.arrayContactosCache.slice(0, 400);

              // build variable list
              const varNames = Object.keys(this.arrayContactos[0] || {});
              varNames.filter(n => typeof this.arrayContactos[0][n] !== 'object')
                      .forEach((_, i) => {
                this.arrayVariables.push({ Name: this.descVars[i]?.Name });
              });

              // ensure defaults
              this.arrayContactos.forEach((item: any, idx: number) => {
                item.IndexArray = idx;
                item.TstCmpg = item.TstCmpg ?? 0;
                item.TstMe   = item.TstMe ?? 0;
                item.BuyCnt  = item.BuyCnt ?? 0;
              });

              // update menu length after next tick
              setTimeout(() => {
                this.menuLength = this.arrayContactosCache.length;
              }, 1000);
            });
          }
        });
      } catch {}
      
      // set descVar from descVars
      this.descVars.forEach(v => {
        if (v.Name === this.actualVar) {
          this.descVar = v.Desc;
        }
      });
    });
  }
  reverseArray(){
    this.arrayContactos.reverse()
  }
  formatDate(timestamp: any): string {

  if (!timestamp) return '';

  let ts = Number(timestamp);

  // Si viene en segundos (10 dígitos), convertir a milisegundos
  if (ts.toString().length === 10) {
    ts = ts * 1000;
  }

  const fecha = new Date(ts);

  return fecha.toLocaleString('es-MX', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
  async filtercomponent(){

    this.modal = await this.modalController.create({
      component: ModalFiltersComponent,
      cssClass: 'modal-add',
      canDismiss:true,
      backdropDismiss:true,
       initialBreakpoint:1,
        breakpoints:[0, 0.25, 1, 0.1],
        componentProps: {
          Array: this.arrayVariables,
          ArrayDesc: this.descVars,
     
      }
    
    });
    await this.modal.present();
 
 
    await this.modal.onDidDismiss().then((e:any)=>{
      console.log(e.data)
      this.actualVar = e.data.Name

      this.arrayContactosCache.sort((a:any, b:any) => b[this.actualVar] - a[this.actualVar]);
      this.arrayContactos = []
      for(var i = 0 ; i < this.arrayContactosCache.length;i ++){
        this.arrayContactos.push(this.arrayContactosCache[i])
        if (i === 200) break
      }
      this.arrayContactosCacheSearch = this.arrayContactos
      for(var i = 0; i < this.descVars.length;i++){
        if(this.descVars[i]['Name'] === this.actualVar){
      this.descVar = this.descVars[i]['Desc']
          
        }
    }
   })
 
  }

  openChat(phone: string) {
  console.log('📩 Abrir chat:', phone);
        this.router.navigate(['/p/' + phone ]);

  // navega o carga conversación
}


// formatDate(tst: number): string {
//   const fecha = new Date(tst);
//   const hoy = new Date();

//   const hoySinHora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
//   const fechaSinHora = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());

//   const diffDias =
//     (hoySinHora.getTime() - fechaSinHora.getTime()) / (1000 * 60 * 60 * 24);

//   if (diffDias < 1) {
//     return fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   } else if (diffDias < 2) {
//     return 'ayer';
//   } else {
//     const dias = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
//     return dias[fecha.getDay()];
//   }
// }
searchTimeout: any = null;

async searchSort(event: any) {
  const res = (event.detail.value || '').toLowerCase().trim();
  this.eventarget = res;

  this.zone.run(async() => {

    if (res === '') {
      // restaurar lista original
      console.log(this.arrayContactosCacheSearch)
      this.arrayContactos = [...this.arrayContactosCacheSearch];
    
      this.menuLength = this.arrayContactos.length;
      this.remoteResults = []
      return;
    }

    const fict: any[] = [];

    for (let x = 0; x < this.arrayContactosCache.length; x++) {

      const contacto = this.arrayContactosCache[x];

      const num  = (contacto.Num  ?? '').toString().toLowerCase();
      const name = (contacto.Name ?? '').toString().toLowerCase();

      if (num.includes(res) || name.includes(res)) {
        fict.push(contacto);
      }

      if (fict.length === 450) break;
    }

    // 🔹 NUEVO: si no encontró nada
    if (fict.length === 0) {
      console.log('🔍 No se encontró en cache, hacer nueva búsqueda:', res);

      // aquí luego puedes llamar tu búsqueda remota
       this.remoteResults = await this.searchRemote(res);

    }

    this.arrayContactos = fict;
  });
}
remoteResults: any[] = [];


async searchRemote(term: string) {
  const db = getDatabase();
  const baseRef = dbRef(db, `ruta/${this.ph}`);

  const snap = await get(baseRef);
  const data = snap.val();

  if (!data) return [];

  const termLower = term.toLowerCase();
  const resultados: any[] = [];

  // recorrer contactos (solo numéricos)
  for (const phone in data) {

    // validar que sea solo números
    if (!/^\d+$/.test(phone)) continue;

    const mensajes = data[phone];

    if (!mensajes || typeof mensajes !== 'object') continue;

    // recorrer mensajes del contacto
    for (const msgId in mensajes) {
      const msg = mensajes[msgId];
      //console.log(msg)

      const text = msg?.interactive?.body?.text;
      //console.log(text)
      if (!text) continue;

      if (text.toLowerCase().includes(termLower)) {
        resultados.push({
          phone,
          msgId,
          text,
          tst: msg.tst,
          type: msg.type
        });

        break; // ⚠️ solo una coincidencia por contacto
      }
    }
      console.log(resultados)
    if (resultados.length === 50) break; // límite de seguridad
  }

  console.log('🔎 Resultados remotos:', resultados);
  return resultados;
}

    async presentActionSheet2(array:any,index:any) {
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Actions for : ' + array.Name,
        mode:'ios',
        cssClass: 'my-custom-class',
        buttons: [
          {
            text: 'Enviar mensaje',
            role: 'destructive',
            icon: 'chatbubbles-outline',
            data: {
              action: 'send_message',
            },
          },
          {
            text: 'Agregar a grupo',
            role: 'destructive',
            icon: 'people-circle-outline',
    
            data: {
              action: 'cancel-class',
            },
          },
          {
            text: 'Agregar etiqueta',
            role: 'destructive',
            icon: 'pricetag-outline',
    
            data: {
              action: 'reprogramar',
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
            icon: 'close-circle-outline',
            data: {
              action: 'cancel',
            },
          },
        ],
      });
    
      await actionSheet.present();
      //alert(this.usersRes[array.IndexArray])
      localStorage.setItem('userUidCache',this.arrayContactosRes[array.IndexArray])
      const result = await actionSheet.onDidDismiss();
      if(result.data === null || result.data === undefined){
    
      }else{
    
      console.log(result.data.action)
      //alert(this.usersRes[array.IndexArray])
   
    
      if(result.data.action === 'send_message'){
        this.router.navigate(['/p/' + array.Num ]);
      }
      if(result.data.action === 'send_message'){
        this.router.navigate(['/p/' + array.Num ]);
      }
      if(result.data.action === 'send_message'){
        this.router.navigate(['/p/' + array.Num ]);
      }
    }
      
      //this.result = JSON.stringify(result, null, 2);
    }
async presentActionSheet(array: any, index: any) {

  // cache del usuario
  localStorage.setItem(
    'userUidCache',
    this.arrayContactosRes[array.IndexArray]
  );

  const alert = await this.alertController.create({
    header: 'Actions for: ' + array.Name,
    mode: 'ios',
    cssClass: 'my-custom-class',
    buttons: [
      {
        text: 'Enviar mensaje',
        handler: () => {
          this.router.navigate(['/p/' + array.Num]);
        }
      },
      {
        text: 'Agregar a grupo',
        handler: () => {
          console.log('Agregar a grupo');
          // aquí tu lógica real
        }
      },
      {
        text: 'Agregar etiqueta',
        handler: () => {
          console.log('Agregar etiqueta');
          // aquí tu lógica real
        }
      },
      {
        text: 'Cancelar',
        role: 'cancel'
      }
    ]
  });

  await alert.present();
}


    calcularDistancia(lat1:any, lon1:any, lat2:any, lon2:any) {
      const radioTierra = 6371; // Radio de la Tierra en kilómetros
      
      // Convertir grados a radianes
      const latitud1 = this.toRadian(lat1);
      const longitud1 = this.toRadian(lon1);
      const latitud2 = this.toRadian(lat2);
      const longitud2 = this.toRadian(lon2);
      
      // Diferencias de latitud y longitud
      const difLatitud = latitud2 - latitud1;
      const difLongitud = longitud2 - longitud1;
      
      // Fórmula del haversine
      const a = Math.pow(Math.sin(difLatitud / 2), 2) + Math.cos(latitud1) * Math.cos(latitud2) * Math.pow(Math.sin(difLongitud / 2), 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distancia = radioTierra * c;
      const distanciaUnaDecimal = distancia.toFixed(1);
      
      return distanciaUnaDecimal;
  }
  toRadian(grados:any) {
    return grados * Math.PI / 180;
}
}