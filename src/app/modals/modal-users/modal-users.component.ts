import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ModalController, ToastController } from '@ionic/angular';
import { FechaService } from 'src/app/fecha.service';
import { ModalFiltersComponent } from '../modal-filters/modal-filters.component';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { get, getDatabase, onValue, ref } from 'firebase/database';
import { getFirestore, collection, getDocs } from "firebase/firestore";

@Component({
  selector: 'app-modal-users',
  templateUrl: './modal-users.component.html',
  styleUrls: ['./modal-users.component.scss'],
})
export class ModalUsersComponent  implements OnInit {
 actualVar = "Tst"
  arrayContactosRes : any
  arrayVariables:any = []
  eventarget:any
  fechaActual:any
 arrayContactos:any = []
 menuLength = 0 
 enableService = false
 arrayContactosCacheSearch:any = []
 arrayContactosCache:any = []
 ph:any
 arrayNumbers : any = []
 descVars = [
  {Name:"Tst",Desc:"Ultima vez que el cliente envió un mensaje"},
  {Name:"TstMe",Desc:"Ultima vez que el bot envió un mensaje al cliente"},
  {Name:"TstCmpg",Desc:"Ultima vez que envió un mensaje de campaña al cliente"},
  {Name:"LstBuy",Desc:"Ultima vez que el cliente compró"},
  {Name:"NumberPedidos",Desc:"Veces que el cliente compró"},
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
 listUsersToAdd:any = []
 uid:any
 descVar = ""

  constructor(private toastController :ToastController,private router: Router,private dateService : FechaService,
    private actionSheetCtrl: ActionSheetController, private modalController: ModalController,
    
    private zone: NgZone) {
      
    }
ngOnInit(){

  this.fechaActual = this.dateService.getDateMexico().replace("/","").replace("/","")

  const auth = getAuth();
  const db = getDatabase();

  onAuthStateChanged(auth, (user) => {

    if (user) {

      const uid = user.uid;
      this.uid = uid;

      const userRef = ref(db, `UsersBusinessChat/${this.uid}`);

      onValue(userRef, (snapshot) => {
      console.log("🔥 onValue disparado");
        const res = snapshot.val();
        const array :any = [];

        console.log(res?.['Auth']);

        if (res?.['Auth'] === undefined) {

          this.enableService = false;

        } else {

          this.enableService = true;

          for (const i in res['Auth']) {
            array.push(res['Auth'][i]['Ph']);
          }

          this.zone.run(() => {

            this.arrayNumbers = array;
            this.ph = res['SelectedPh'];

            const contactosRef = ref(db, `ruta/Contactos/${this.ph.toString()}`);

            get(contactosRef).then(async (snapshot) => {

              const res = snapshot.val();
              if (!res) return;

              const now = Date.now();
              const fourteenDays = 1000 * 60 * 60 * 24 * 14;

              const contactosArray = Object.values(res) as any[];

              this.arrayContactosRes = Object.keys(res);

              contactosArray.sort((a: any, b: any) => b.Tst - a.Tst);

              // =====================================================
              // 🔥 TRAER PEDIDOS UNA SOLA VEZ
              // =====================================================
              const firestore = getFirestore();
              const pedidosRef = collection(firestore, "pedidos", "all", "today");
              const snapshotPedidos = await getDocs(pedidosRef);
              console.log(snapshotPedidos.size, 'pedidos encontrados');
              const pedidosPorTelefono: any = {}; 
              const productosPorTelefono: any = {};
              snapshotPedidos.forEach(doc => {
                const data = doc.data();
                const phone = (data['phone'] || '').toString().trim();
                const items = data['items'] || [];

                // ---------------------------
                // CONTAR PEDIDOS
                // ---------------------------
                if (!pedidosPorTelefono[phone]) {
                  pedidosPorTelefono[phone] = 0;
                }
                pedidosPorTelefono[phone]++;

                // ---------------------------
                // CONTAR PRODUCTOS
                // ---------------------------
                if (!productosPorTelefono[phone]) {
                  productosPorTelefono[phone] = {};
                }

                items.forEach((item: any) => {
                  const nombreProducto = item.name;

                  if (!productosPorTelefono[phone][nombreProducto]) {
                    productosPorTelefono[phone][nombreProducto] = 0;
                  }

                  productosPorTelefono[phone][nombreProducto] += item.quantity || 1;
                });
              });
              console.log('Pedidos por teléfono:', pedidosPorTelefono);
              console.log('Pedidos por teléfono:', pedidosPorTelefono.length);
              // =====================================================
              // MAP PRINCIPAL
              // =====================================================
              console.log(this.arrayContactosCache.length)
              console.log(contactosArray.length)
              console.log(contactosArray)
             this.arrayContactosCache = await Promise.all(
                contactosArray.map(async (item: any, index: number) => {

                  const now = Date.now();

                  item.TstCmpg ??= 0;
                  item.TstMe ??= 0;
                  item.BuyCnt ??= 0;

                  // =====================================================
                  // 🔥 1️⃣ SI YA TIENE COORDENADAS → CALCULAR DISTANCIA
                  // =====================================================

                  if (
                    !isNaN(Number(item.Lat)) &&
                    !isNaN(Number(item.Lng))
                  ) {
                    item.StateSelect = false
                    item.Lat = Number(item.Lat);
                    item.Lng = Number(item.Lng);

                    item.Km = this.calcularDistancia(
                      22.314669261048728,
                      -97.8686636897337,
                      item.Lat,
                      item.Lng
                    );

                  } else {

                    // =====================================================
                    // 🔥 2️⃣ SI NO TIENE COORDENADAS → BUSCAR EN LOCATIONS
                    // =====================================================
                    item.StateSelect = false

                    const locationRef = ref(db, `Locations/${this.ph}/${item.Num}/0`);
                    const snapshotLoc = await get(locationRef);
                    const loc = snapshotLoc.val();

                    if (loc && !isNaN(Number(loc.lat)) && !isNaN(Number(loc.lng))) {

                      item.Lat = Number(loc.lat);
                      item.Lng = Number(loc.lng);

                      item.Km = this.calcularDistancia(
                        22.314669261048728,
                        -97.8686636897337,
                        item.Lat,
                        item.Lng
                      );

                      item.TstLocation = now;

                    } else {
                      item.Km = null;
                    }
                  }

                  // =====================================================
                  // 🔥 PEDIDOS + PRODUCTO FAVORITO
                  // =====================================================

                  const telefonoCliente = item.Num || item.phone;

                  const productosCliente = productosPorTelefono[telefonoCliente] || {};

                  const topProductos = Object.entries(productosCliente)
                    .sort((a: any, b: any) => b[1] - a[1])
                    .slice(0, 3)
                    .map((prod: any) => ({
                      name: prod[0],
                      total: prod[1]
                    }));

                  item.TopProductos = topProductos;
                  item.ProductoFavorito = topProductos.length
                    ? topProductos[0].name
                    : null;

                  item.NumberPedidos = pedidosPorTelefono[telefonoCliente] || 0;

                  // =====================================================
                  // FORMATEO
                  // =====================================================

                  if (item.LstBuy) item.LstBuy = this.formatFecha(item.LstBuy);
                  if (item.Tst) item.Tst = this.formatFecha(item.Tst);

                  item.IndexArray = index;

                  return item;
                })
              );


              this.arrayContactos = this.arrayContactosCache.slice(0, 200);
              console.log(this.arrayContactos)
              // =====================================================
              // VARIABLES (NO SE QUITO NADA)
              // =====================================================

              this.arrayVariables = [];

              for (let i = 0; i < this.descVars.length; i++) {
                this.arrayVariables.push({ Name: this.descVars[i]['Name'] });
              }

            }).then(() => {

              setTimeout(() => {
                this.menuLength = this.arrayContactosCache.length;
              }, 500);

            }).catch(console.error);

          });

        }

      });

    } else {
      // No user is signed in
    }

  });

  // =====================================================
  // NO SE QUITO ESTA PARTE
  // =====================================================

  for(var i = 0; i < this.descVars.length;i++){
    if(this.descVars[i]['Name'] === this.actualVar){
      this.descVar = this.descVars[i]['Desc']
    }
  }

}
 calcularDistancia(lat1: any, lon1: any, lat2: any, lon2: any) {

  if (
    isNaN(Number(lat1)) ||
    isNaN(Number(lon1)) ||
    isNaN(Number(lat2)) ||
    isNaN(Number(lon2))
  ) {
    return null;
  }

  const radioTierra = 6371;

  const latitud1 = this.toRadian(Number(lat1));
  const longitud1 = this.toRadian(Number(lon1));
  const latitud2 = this.toRadian(Number(lat2));
  const longitud2 = this.toRadian(Number(lon2));

  const difLatitud = latitud2 - latitud1;
  const difLongitud = longitud2 - longitud1;

  const a =
    Math.sin(difLatitud / 2) ** 2 +
    Math.cos(latitud1) *
      Math.cos(latitud2) *
      Math.sin(difLongitud / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distancia = radioTierra * c;

  return Number(distancia.toFixed(1)); // 👈 ahora sí es number
}

  toRadian(grados:any) {
    return grados * Math.PI / 180;
}
  formatFecha(timestamp: number): string {
  const fecha = new Date(timestamp);
  const yyyy = fecha.getFullYear();
  const mm = ('0' + (fecha.getMonth() + 1)).slice(-2);
  const dd = ('0' + fecha.getDate()).slice(-2);
  const hh = ('0' + fecha.getHours()).slice(-2);
  const min = ('0' + fecha.getMinutes()).slice(-2);

  return `${hh}:${min}\n${yyyy}-${mm}-${dd}`;
}

  reverseArray(){
    this.arrayContactos.reverse()
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
      for(var i = 0;i <this.arrayContactos.length; i++){
        this.arrayContactos[i]["IndexArray"] = i
      }
      this.arrayContactosCacheSearch = this.arrayContactos
      for(var i = 0; i < this.descVars.length;i++){
        if(this.descVars[i]['Name'] === this.actualVar){
      this.descVar = this.descVars[i]['Desc']
          
        }
    }
   })
 
  }

  searchSort(event:any){
 
    const res = event.target.value.toLowerCase();
    this.eventarget = res
  
  this.zone.run(() => {
  //   console.log('REYEs')
      console.log(this.arrayContactosCache)
    const fict = [];
    if(event.target.value === ''){
      console.log(this.arrayContactosCacheSearch)

      this.arrayContactos = this.arrayContactosCacheSearch
      console.log(this.arrayContactos)
    /* for(var yi = 0; yi < this.arrayContactosCache.length ;yi++){
        this.arrayContactos.push(this.arrayContactosCache[yi])
        
      }*/
    }else{
      
    this.arrayContactos = []
      for(let x = 0; x < this.arrayContactosCache.length; x++){
        if(this.arrayContactosCache[x].Num === undefined){
          this.arrayContactosCache[x].Num = "None"
        }
        var temu = this.arrayContactosCache[x].Num.toString()
        if (temu.includes(res) || temu.includes(res) ){
        fict.push(this.arrayContactosCache[x]);
      
        }
        if (fict.length === 250) break
        }
        this.arrayContactos = fict;
        for(var i = 0 ; i < this.arrayContactos.length;i++){
          this.arrayContactos[i]["IndexArray"] = i

        }
    //    console.log(this.arrayContactosCache)
    }
  
    });
    }

    async presentActionSheet(array:any,index:any) {
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



checkboxAdd(event:any,array:any,index:any){
  console.log(event)


  if(event.detail.checked === true){

    if(this.listUsersToAdd.length === 0){
      this.listUsersToAdd.push({Num:array.Num ,Name:array.Name, State: event.detail.checked })
      this.arrayContactos[index]['Checked'] = event.detail.checked

    }else{

      var testingBolean = false
      for(var i = 0 ; i < this.listUsersToAdd.length;i++ ){
        if(+this.listUsersToAdd[i]['Num'] === +array.Num){
          testingBolean = true
          console.log(this.listUsersToAdd)
        }

      }

      if(testingBolean === false){
        this.listUsersToAdd.push({Num:array.Num ,Name:array.Name, State: event.detail.checked })
        this.arrayContactos[index]['Checked'] = event.detail.checked

      }else{

      }
    }
  }

  if(event.detail.checked === false){
    for(var i = 0 ; i < this.listUsersToAdd.length;i++ ){
      if(+this.listUsersToAdd[i]['Num'] === +array.Num){
        this.listUsersToAdd.splice(i,1)
     this.arrayContactos[index]['Checked'] = event.detail.checked

        console.log(this.listUsersToAdd)
      }

    }
  
  }

   if(this.listUsersToAdd.length === 100){
    this.showToast('Maximo 100 personas')
        this.listUsersToAdd.splice(this.listUsersToAdd.length-1,1)

    setTimeout(() => {
  this.arrayContactos[index]['Checked'] = false
      
    }, 100);
    setTimeout(() => {
      this.arrayContactos[index]['Checked'] = false
          
        }, 500);

  }
 
 
  console.log(this.listUsersToAdd)
}
async showToast(message:any){
  const toast = await this.toastController.create({
    message,
    duration: 4000,
    position:'middle',
    color:'danger',
    buttons: [

      {
        text: 'OK',
        role: 'cancel',
        handler: () => {
     // this.router.navigate(['/login'],{ replaceUrl: true });
       //toast.dismiss();
          }
      }
    ]
  });
  toast.present();
}
selectItem() {
  this.modalController.dismiss(this.listUsersToAdd);
}
@HostListener('window:popstate', ['$event'])
dismissModal() {
  this.modalController.dismiss();
}

}
