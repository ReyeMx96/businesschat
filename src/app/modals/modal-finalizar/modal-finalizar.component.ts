import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { ModalCartComponent } from '../modal-cart/modal-cart.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, NavParams, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { FechaService } from 'src/app/fecha.service';
import { child, get, getDatabase, onValue, push, ref, remove, set, update } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ModalTextsComponent } from '../modal-texts/modal-texts.component';
import { serverTimestamp } from 'firebase/database';
import { getDownloadURL, getStorage, uploadBytesResumable,  ref as storageRef } from 'firebase/storage';
declare var google: any
@Component({
  selector: 'app-modal-finalizar',
  templateUrl: './modal-finalizar.component.html',
  styleUrls: ['./modal-finalizar.component.scss'],
})
export class ModalFinalizarComponent  implements OnInit {
 menuPromociones: any = []
  distancia : any
  precio = 0
  varObjt:any
  disableBtn = "key"
  arrayItem:any = []
  phoneAdvisorTransferencia = "5218333000460"
  //phoneAdvisorTransferencia = "5218334502378"
  arraySetSucursal:any = []
  notaVisible = true
  srcSendImg:any
  img = ""
  descuento:any

  cuantoPaga = ""
  mountCalcTime = 8
  showCoupon = true
  Lat = 0
  Lng = 0
  notaGeneral = ''
  writingCode:any
  direccion:any
  type:any
  colonia:any
  predTime = 15
  enableBtn = false
  ciudad:any
  keyProduct:any
  pais:any
  fechaEnd:any
  filepath:any
  ind = ""
  showCalleNum = true
  showImg = false
  textclient:any
  start:any
  modal:any
  costoEnvioRepa = ""
  tarjeta = "4152313953571150"
  estado:any
  numero:any
  showUploadBtn = true
  typeCart:any
  textPedidoClient = ''
  loading:any
  tarifasArray = []
  precioCache = 0
  costoEnvio = 0
  cuponCharged = false
  tarifasRepaArray = []
  codigopostal:any
  calle:any
  arrayCupones:any
  token:any
  outOfWork = false
  cudigo:any
  phoneAdvisor = "5218333000460"
  phoneAdvisor2 = "5218331071714"
  recojer = "No"
  textdueno:any
  textPedido = ""
  typeMethods = [{Type:'Transferencia bancaria'},{Type:'Tarjeta de debito'},{Type:'Pago en Efectivo'}]
  metodoPago = "Pago en Efectivo"
  ubicacion = 'Sin ubicacion'
  sucursal = ""
  uid:any
  croppedImage:any
  
  phone = ""
  locations = []
  slidesIMG:any
  phoneNumberId:any
  fechaServer
  
  nextId :any
  sessionActive = false
  phoneAdmin = ""

  fechaEndMax:any
  constructor(private modalController: ModalController,private route: ActivatedRoute,private http: HttpClient, 
    private loadingController : LoadingController,
    private alertController : AlertController, private toastController:ToastController,
    private router: Router,private dateService: FechaService,public navParams: NavParams,
    private zone : NgZone) {

      this.fechaServer =  this.dateService.serverHour()
      
      setTimeout(async () => {
        this.fechaServer = await this.dateService.serverHour();
        this.getHorarios()

        this.fechaEnd =      this.getHour(this.fechaServer,0,40)
        this.fechaEndMax =      this.getHour(this.fechaServer,1,15)

    }, 2700);
     }


     getHour(fechaServ:any,hr:any,min:any){
      var fechaString = fechaServ.replace('&', '').replace(' ', '');
   
      // Parsear la cadena de texto en un objeto de fecha
      var fechaInicial = new Date(fechaString.replace(/-/g, '/')); // Reemplazar guiones por barras
      
      // Obtener la diferencia de tiempo entre UTC y la zona horaria local del cliente
      var diferenciaZonaHoraria = fechaInicial.getTimezoneOffset() * 60000; // en milisegundos
  
      // Ajustar la fecha para mostrarla en la zona horaria local del cliente
      var fechaLocal = new Date(fechaInicial.getTime() - diferenciaZonaHoraria);
      
      // Agregar 1 hora y 30 minutos
      fechaLocal.setHours(fechaLocal.getHours() + hr);
      fechaLocal.setMinutes(fechaLocal.getMinutes() + min);
      
      // Formatear la fecha en el mismo formato
      var fechaFormateada = fechaLocal.toISOString().slice(0, 19).replace("T", " ");
      
      console.log(fechaFormateada);
      return fechaFormateada
      // Resultado: "2024-03-30 23:42:24" (en la zona horaria local del cliente)
     }
    async showToast(message:any){
      const toast = await this.toastController.create({
        message,
        duration: 5000,
        position:'top',
        color:'primary',
        buttons: [
    
          {
            text: 'OK',
            role: 'cancel',
            handler: () => {
      
           toast.dismiss();
              }
          }
        ]
      });
      toast.present();
    }
    goCart(){
      this.router.navigate(['/payments/'+this.typeCart],{ replaceUrl: true });

    }
    goCart2(){
      this.router.navigate(['/home/cart/'+this.typeCart]);

    }
    openMenuopts(){
      document.getElementById('slct-opt')!.click()
    }
    resetArray(){
      this.slidesIMG = []
      this.showImg = false
    }
     openImg(url:any){
      localStorage.setItem('url',url)
      this.router.navigate(['/show-img/']);
     }
    async uploadImg() {
  try {
    this.showUploadBtn = false;
    this.loadingUser();

    const we2 = document.getElementById('imagenProfile2')!.outerHTML;
    const resultmatch = we2.match('src="(.*?)">');
    if (!resultmatch || !resultmatch[1]) {
      this.showToast('No se encontró la imagen');
      return;
    }

    const db = getDatabase();
    const usersRef = ref(db, 'Users');

    // Push vacío para obtener la key
    const snap = await push(usersRef, {});
    const key = snap.key;
    if (key) {
      localStorage.setItem('KeyProductDynamicLink', key);
      this.keyProduct = key;
    }

    if (resultmatch[1].length > 150) {
      console.log(localStorage.getItem('img64name'));
      console.log('img64name5');

      const filePath = `/Michelotes/${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}${localStorage.getItem('img64name')}`;
      console.log(filePath);

      const storage = getStorage();
      const storageReference = storageRef(storage, filePath);

      // Convierte base64 o url en blob y crea archivo
      const url = resultmatch[1];
      const res = await fetch(url);
      const blob = await res.blob();

      const file = new File([blob], "selectim5g.png", { type: "image/png" });

      // Subida con uploadBytesResumable para progress
      const uploadTask = uploadBytesResumable(storageReference, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          console.error(error);
          this.showToast('Error al subir la imagen');
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('File available at', downloadURL);
          localStorage.setItem('imgnow', downloadURL);
          document.getElementById('btnUpload2')!.click();
        }
      );

    } else {
      setTimeout(() => {
        this.loading.dismiss();
        this.showToast('Debes seleccionar una imagen primero');
      }, 2000);
    }
  } catch (error) {
    console.error('Error en uploadImg:', error);
    this.showToast('Error inesperado');
  }
}
       subirOtra(){
        this.router.navigate(['/payments/'+this.typeCart],{ replaceUrl: true });
           
       }
       
    doit(){
      if(this.outOfWork === false){
      this.showToast('El establecimiento se encuentra cerrado. Te enviaremos un recordatorio cuando la tienda inicie sus servicios.')
        
        return
      }
    
      document.getElementById("upload2")!.click();
    } 
   async buyNow(){
    if(this.outOfWork === false){
      this.showToast('El establecimiento se encuentra cerrado. Te enviaremos un recordatorio cuando la tienda inicie sus servicios.')
      return
    }

    if(this.metodoPago === 'Transferencia bancaria' && this.showImg === false){
      this.showToast('Debes agregar tu comprobante de pago.')
      
      return
    }
    if(this.ind === ''){
      this.showToast('Debes agregar la calle y el numero de tu domicilio')
      this.textComponent('Agregar calle y numero')
      return
    }
      if(this.precio === 0){
        this.showToast('No puedes crear una compra con $0 mxn')
        return
      }
      
      if(this.ubicacion === "Sin ubicacion"){
        this.showToast('No hay ubicacion disponible')
        this.typeLocation()
         return
      }
      this.disableBtn = "Sin ubicacion"
      
      const fechaString = (await this.dateService.serverHour()).replace('&', '');


      // Parsear la cadena de texto en un objeto de fecha
      var fechaInicial = new Date(fechaString.replace(/-/g, '/')); // Reemplazar guiones por barras
      
      // Agregar 1 hora y 30 minutos
      fechaInicial.setHours(fechaInicial.getHours() + 1);
      fechaInicial.setMinutes(fechaInicial.getMinutes() + 15);
      
      // Formatear la fecha en el mismo formato
      var fechaFormateada = fechaInicial.toISOString().slice(0, 19).replace("T", " ");
      
      console.log(fechaFormateada); // Resultado: "2024-03-30 17:28:50"
      const db = getDatabase();

    const usersRef = ref(db, 'Users');
  const snap = await push(usersRef, {});
  const key = snap.key;

  await this.generarNuevoPedido();
    }
    sendMsgWhatsApp(data:any){
    
      this.http.post('https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/sendWppFast', data)
      .subscribe((response:any) => {
        console.log(response)
      }, (error:any) => {
        console.error(error);
      });
    }
    sendServicesEfectivo(numbToSend:any,numbToSend2:any, arrDataClient:any){
      var clientPhone = ""
      if(this.typeCart === "michelotes"){
          clientPhone = this.phone
      }else{
        clientPhone = this.typeCart
      }
      
      var dataClient = {
        Lat: this.Lat,
        Array: this.varObjt,
        TxtClient: this.textclient,
        ArrDataClient: arrDataClient,
        Id: this.nextId,
        Lng: this.Lng,
        Street: this.ubicacion,
        Ph: this.phoneAdmin,
        Text: this.textdueno,
        Tk:this.token,
        Phone:numbToSend,
        Phone2:numbToSend2,
        PhBs: this.phoneNumberId,
        Adm: this.phoneAdvisor,
        Adm2: this.phoneAdvisor2,
        Start:this.fechaServer,
        User: clientPhone,
        CuantoPaga:this.cuantoPaga,
        CobroRepa: this.costoEnvioRepa,
        Nota:this.notaGeneral,
        Url: this.srcSendImg || '',
        Tst: serverTimestamp(),
        Arr:[
          {
            "reply": {
              "id": "no_transf",
              "title": "Rechazar"
            },
            "type": "reply"
          },
          {
            "reply": {
              "id": "$"+this.nextId,
              "title": "Confirmar"
            },
            "type": "reply"
          },
        ]
      }
      console.log(  dataClient)

      this.http.post('https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/updateServices', dataClient)
      .subscribe((response:any) => {
        console.log(response)
      }, (error:any) => {
        console.error(error);
      });
    }
    sendMsgWhatsAppImgBtns(numbToSend:any,numbToSend2:any, arrDataClient:any){
      var clientPhone = ""
      if(this.typeCart === "michelotes"){
          clientPhone = this.phone
      }else{
        clientPhone = this.typeCart
      }
      
      var dataClient = {
        Lat: this.Lat,
        Array: this.varObjt,
        TxtClient: this.textclient,
        ArrDataClient: arrDataClient,
        Id: this.nextId,
        Lng: this.Lng,
        Street: this.ubicacion,
        Ph: this.phoneAdmin,
        Text: this.textdueno ,
        Tk:this.token,
        Phone:numbToSend,
        Phone2:numbToSend2,
        PhBs: this.phoneNumberId,
        Adm: this.phoneAdvisor,
        Adm2: this.phoneAdvisor2,
        Start:this.fechaServer,
        User: clientPhone,
        CuantoPaga:this.cuantoPaga,
        CobroRepa: this.costoEnvioRepa,
        Nota:this.notaGeneral,
        Url: this.srcSendImg,
        Tst: serverTimestamp(),

        Arr:[
          {
            "reply": {
              "id": "no_transf",
              "title": "Rechazar"
            },
            "type": "reply"
          },
          {
            "reply": {
              "id": "$"+this.nextId,
              "title": "Confirmar"
            },
            "type": "reply"
          },
        ]
      }

      this.http.post('https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/sendWppFastImgBtnsTxt', dataClient)
      .subscribe((response:any) => {
        console.log(response)
      }, (error:any) => {
        console.error(error);
      });
    }

    sendMsgWhatsAppBtns(numbToSend:any){
      var clientPhone = ""
      if(this.typeCart === "michelotes"){
          clientPhone = this.phone
      }else{
        clientPhone = this.typeCart
      }
      
      var dataClient = {
        Lat: this.Lat,
        Id: this.nextId,
        Lng: this.Lng,
        Street: this.ubicacion,
        Ph: this.phoneAdmin,
        Text:this.textdueno,
        Tk:this.token,
        Phone:numbToSend,
        PhBs: this.phoneNumberId,
        Adm: this.phoneAdvisor,
        Adm2: this.phoneAdvisor2,
        Start:this.fechaServer,
        User: clientPhone,
        CuantoPaga:this.cuantoPaga,
        CobroRepa: this.costoEnvioRepa,
        Nota:this.notaGeneral,
      }

      this.http.post('https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/sendPedidoSuc', dataClient)
      .subscribe((response:any) => {
        console.log(response)
      }, (error:any) => {
        console.error(error);
      });
    }
    sendMsgWhatsAppLocation(numbToSend:any){
      var dataClient = {
        Lat: this.Lat,
        Lng: this.Lng,
        Street: this.ubicacion,
        Ph: this.phoneAdmin,
        Text:this.phone,
        Tk:this.token,
        Phone:numbToSend,
        PhBs: this.phoneNumberId,
      }
      
      this.http.post('https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/sendWppFastLocation', dataClient)
      .subscribe((response:any) => {
        console.log(response)
      }, (error:any) => {
        console.error(error);
      });
    }
   
// async generarNuevoPedido() {
//   try {
//     const db = getDatabase();

//     const pedidosRef = ref(db, 'KeyGen');

//     // Obtener snapshot de los datos actuales (equivale a .once('value'))
//     const snapshot = await get(pedidosRef);
//     const data = snapshot.val();
//     const numPedidos = data ? Object.keys(data).length : 0;

//     const randomLetterIndex = Math.floor(Math.random() * 26);
//     const randomLetter = String.fromCharCode(65 + randomLetterIndex); // 'A' a 'Z'
//     const nextId = randomLetter + (numPedidos + 1);

//     this.nextId = nextId;

//     let state = "Recibido";
//     if (this.metodoPago === 'Transferencia bancaria') {
//       state = "Pendiente";
//     }

//     const objt = {
//       List: this.menuPromociones,
//       Lat: this.Lat,
//       Id: this.nextId,
//       Start: this.fechaServer,
//       End: this.fechaEnd,
//       Suc: this.sucursal,
//       EndMax: this.fechaEndMax,
//       Lng: this.Lng,
//       Deliv: this.costoEnvio,
//       Precio: this.precio,
//       Street: this.ubicacion,
//       State: "En curso",
//       Step: state,
//       TypePay: this.metodoPago,
//       Img: localStorage.getItem('imgnow'),
//       Phone: this.phone,
//       CuantoPaga: this.cuantoPaga,
//       CobroRepa: this.costoEnvioRepa,
//       Nota: this.notaGeneral,
//       Tst: { ".sv": "timestamp" } // Timestamp modular para Realtime DB
//     };

//     this.varObjt = objt;

//     // (Aquí mantienes toda la lógica de construcción de textos y condiciones que tienes, sin cambios...)

//     // Ejemplo simplificado para actualizar data:
//     if (this.typeCart === 'michelotes') {
//       await set(ref(db, `ruta/${this.phoneAdmin}/CartWpp/${this.typeCart}`), null);
//     } else {
//       await set(ref(db, `ruta/${this.phoneAdmin}/CartWpp/${this.typeCart}`), null);
//     }

//     this.showToast('Pedido realizado exitosamente, tu pedido llegara en unos minutos.');

//     if (this.sessionActive === true) {
//       await update(ref(db, `ruta/${this.phoneAdmin}/Panel/${this.nextId}`), objt);
//     } else {
//       await update(ref(db, `ruta/${this.phoneAdmin}/Panel/${this.nextId}`), objt);
//     }

//     // Guardar el pedido bajo KeyGen/nextId
//     await set(child(pedidosRef, nextId.toString()), objt);

//     setTimeout(() => {
//       this.modalController.dismiss("finished");
//       setTimeout(() => {
//         // document.getElementById('wppId').click()
//       }, 1700);
//     }, 1000);

//     console.log('Pedido guardado exitosamente con el N° de rastreo: #', nextId);

//   } catch (error) {
//     console.error('Error al guardar el pedido:', error);
//   }
// }
async generarNuevoPedido() {
  const db = getDatabase();
  const pedidosRef = ref(db, 'KeyGen');

  get(pedidosRef)
    .then(snapshot => {
      const numPedidos = snapshot.size;
      const randomLetterIndex = Math.floor(Math.random() * 26);
      const randomLetter = String.fromCharCode(65 + randomLetterIndex);
      const nextId = randomLetter + (numPedidos + 1);
  
      this.nextId = nextId;
  
      var state = "Recibido";
      if(this.metodoPago === 'Transferencia bancaria'){
        state = "Pendiente";
      }

      var objt = {
        List: this.menuPromociones,
        Lat: this.Lat,
        Id: this.nextId,
        Start: this.fechaServer,
        End: this.fechaEnd,
        Suc: this.sucursal,
        EndMax: this.fechaEndMax,
        Lng: this.Lng,
        Deliv: this.costoEnvio,      
        Precio: this.precio,
        Street: this.ubicacion,
        State: "En curso",
        Step: state,
        TypePay: this.metodoPago,
        Img: localStorage.getItem('imgnow'),
        Phone: this.phone,
        CuantoPaga: this.cuantoPaga,
        CobroRepa: this.costoEnvioRepa,
        Nota: this.notaGeneral,
        Tst: serverTimestamp(),
      };

      this.varObjt = objt;

      if(this.metodoPago === 'Transferencia bancaria'){
        if(this.typeCart === 'michelotes'){
          this.textdueno = "*¡Tienes un nuevo pedido!*\n *N° de rastreo* #" + this.nextId +  "\n" 
          + "Orden de compra:\n" + this.textPedido +"\n\n"
          + this.metodoPago + "\n"      
          + "\n*Total*: $" + (+this.precio + +this.costoEnvio).toString() + " MXN \n"
          + "\n*Pagar al repartidor*: $" + this.costoEnvioRepa.toString() + " MXN \n"
          + "*Sucursal*:" + this.sucursal                      
          + "\n*Contacto*:" + this.phone     
          + "\nCalle y numero: " + this.ind;

        } else {
          this.textdueno = "*¡Tienes un nuevo pedido!*\n *N° de rastreo* #" + this.nextId +  "\n" 
          + "Orden de compra:\n" + this.textPedido +"\n\n"
          + this.metodoPago + "\n"     
          + "\n*Total*: $" + (+this.precio + +this.costoEnvio).toString() + " MXN \n"
          + "\n*Pagar al repartidor*: $" + this.costoEnvioRepa.toString() + " MXN \n"
          + "*Sucursal*:" + this.sucursal                      
          + "\n*Contacto*:" + this.typeCart
          + "\nCalle y numero: " + this.ind;
        }
      } else {
        if(this.typeCart === 'michelotes'){
          this.textdueno = "*¡Tienes un nuevo pedido!*\n *N° de rastreo* #" + this.nextId + "\nOrden de compra:\n" 
          + this.textPedido + "\n\n" + this.metodoPago + "\n"    
          + "Paga con: $" + this.cuantoPaga    
          + "\n*Total*: $" + (+this.precio + +this.costoEnvio).toString() + " MXN \n"
        //  + "\n*Cobrar al repartidor*: $" + (+this.precio - +this.costoEnvioRepa + +this.costoEnvio).toString() + " MXN \n"
          + "*Contacto*:" + this.phone
          + "\n*Sucursal*:" + this.sucursal                      
          + "\nCalle y numero: " + this.ind;

        } else {
          this.textdueno = "*¡Tienes un nuevo pedido!*\n *N° de rastreo* #" + this.nextId + "\nOrden de compra:\n" 
          + this.textPedido + "\n\n" + this.metodoPago + "\n"
          + "Paga con: $" + this.cuantoPaga    
          + "\n*Total*: $" + (+this.precio + +this.costoEnvio).toString() + " MXN \n"
          //+ "\n*Cobrar al repartidor*: $" + (+this.precio - +this.costoEnvioRepa + +this.costoEnvio).toString() + " MXN \n"
          + "*Contacto*:" + this.typeCart
          + "\n*Sucursal*:" + this.sucursal                      
          + "\nCalle y numero: " + this.ind;
        }
      }

      if(this.notaVisible === false){
        this.textdueno = this.textdueno + "\n" + "*Nota General:* " + this.notaGeneral;
      }

      var dataDueno = {
        Text: this.textdueno,
        Phone: this.phoneAdvisor,
        Pay: this.typeMethods,
        Ph: this.phoneAdmin,
        PhBs: this.phoneNumberId,
        Tk: this.token,
      };

      var dataDueno2 = {
        Text: this.textdueno,
        Phone: this.phoneAdvisor2,
        Pay: this.typeMethods,
        Ph: this.phoneAdmin,
        PhBs: this.phoneNumberId,
        Tk: this.token,
      };

      if(this.metodoPago === 'Transferencia bancaria'){
        this.textclient = " *Tu pedido ya está en proceso.* \n *N° de rastreo* #" + this.nextId
        + "\n" + this.textPedido
        +"\n\nTe enviaremos un mensaje cuando el repartidor se encuentre en camino a tu domicilio."
        + "\n\n*Costo de envio*: $" + this.costoEnvio + "\n*" + this.metodoPago + "*\n"
        + "*Total:* $" + (+this.precio + +this.costoEnvio).toString() +
        "\n\nPara monitorear tu pedido entra a \n https://michelotes.com/pedido/" + this.nextId;

      } else {
        this.textclient = " *Tu pedido ya está en proceso.* \n *N° de rastreo* #" + this.nextId
        + "\n" + this.textPedido
        +"\n\nTe enviaremos un mensaje cuando el repartidor se encuentre en camino a tu domicilio."
        + "\n\n*Costo de envio*: $" + this.costoEnvio + "\n*" + this.metodoPago + "*\n"
        + "*Total:* $" + (+this.precio + +this.costoEnvio).toString() +
        "\n\nPara monitorear el status de tu pedido entra a la aplicación web de Michelotes:  \n https://michelotes.com/pedido/" + this.nextId;
      }

      var dataClient = {};

      if(this.typeCart === 'michelotes'){
        dataClient = {
          Text: this.textclient,
          Pay: this.metodoPago,
          Ph: this.phoneAdmin,
          Tk: this.token,
          Phone: this.phone,
          PhBs: this.phoneNumberId,
        };
      } else {
        dataClient = {
          Text: this.textclient,
          Pay: this.metodoPago,
          Ph: this.phoneAdmin,
          Tk: this.token,
          Phone: this.typeCart,
          PhBs: this.phoneNumberId,
        };
      }

      if(state === 'Pendiente'){
        this.sendMsgWhatsAppImgBtns(this.phoneAdvisorTransferencia, this.phoneAdvisor2, dataClient);
        var typ = this.typeCart === 'michelotes' ? this.phone : this.typeCart;
        this.setIntervencion(typ);

        var dataClient8 = {
          Text: "Estamos revisando tu transferencia bancaria. /n/n No te preocupes no demorará mas de 5 minutos. /n/n Serás notificado cuando la transferencia sea validada.",
          Pay: this.metodoPago,
          Ph: this.phoneAdmin,
          Tk: this.token,
          Phone: typ,
          PhBs: this.phoneNumberId,
        };

        this.sendMsgWhatsApp(dataClient8);

      } else {
        var typ = this.typeCart === 'michelotes' ? this.phone : this.typeCart;
        this.setIntervencion(typ);

        this.sendMsgWhatsApp(dataClient);
        this.sendServicesEfectivo(this.phoneAdvisorTransferencia, this.phoneAdvisor2, dataClient);
      }

      const cartPath = `ruta/${this.phoneAdmin}/CartWpp/${this.typeCart}`;
      remove(ref(db, cartPath));

      this.showToast('Pedido realizado exitosamente, tu pedido llegara en unos minutos.');

      const panelPath = `ruta/${this.phoneAdmin}/Panel/${this.nextId}`;
      update(ref(db, panelPath), objt);

      set(child(ref(db, 'KeyGen'), nextId.toString()), objt);

      setTimeout(() => {
        this.modalController.dismiss("finished");
        setTimeout(() => {}, 1700);
      }, 1000);

      console.log('Pedido guardado exitosamente con el N° de rastreo: #', nextId);
    })
    .catch(error => {
      console.error('Error al guardar el pedido:', error);
    });
}


    hideChatFeatures(type:any){
      this.filepath = localStorage.getItem('img64name')
    }
    setIntervencion(phone:any){
      const monto = phone; // El monto que deseas enviar
      const admin = this.phoneAdmin;
      const data = {
        monto,
        admin
      };
      this.http.post('https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/setIntervention', data)
      .subscribe((response:any) => {
      console.log(response)
        return response

      }, (error:any) => {
        console.error(error);
      });

    }

    getLocationUser(){
      const monto = this.typeCart; // El monto que deseas enviar
      const admin = this.phoneAdmin;
      const data = {
        monto,
        admin
      };
      this.http.post('https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/getLocationUser', data)
      .subscribe((response:any) => {
        console.log(this.locations)
        console.log(response)
        console.log(response[0])
        this.Lat = response[1]
        this.Lng = response[0]
        this.ubicacion = response[2]
        this.ind = response[3]
        
      
        return response

      }, (error:any) => {
        console.error(error);
      });

    }
  async sendMsgStripe(){
      const monto = +this.precio*100; // El monto que deseas enviar
      const data = {
        monto,
    
      
      };

      this.http.post('https://us-central1-the-business-chat.cloudfunctions.net/stripeCloudPayment', data)
      .subscribe((response:any) => {
        console.log(response)
      }, (error:any) => {
        console.error(error);
      });
    }
    sendMsgWhatsAppDuenoImg(data:any){
                     
      this.http.post('https://us-central1-the-business-chat.cloudfunctions.net/sendWhatsAppMsg', data)
      .subscribe((response:any) => {
        console.log(response)
     
  
      }, (error:any) => {
        console.error(error);
      });
    }
   async typeLocation(){
      const alert = await this.alertController.create({
        header: 'Seleccionar ubicación',
        mode:'md',
        inputs: [
          {
            name: 'option1',
            type: 'radio',
            label: 'Ubicación Actual',
            value: 'actual',
            checked: true
          },
          {
            name: 'option2',
            type: 'radio',
            label: 'Ubicación Manual',
            value: 'manual'
          },      
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: (data) => {
              console.log(data)
              if(data === 'manual'){
                this.router.navigate(['/world-map'],{ replaceUrl: true });
              }
              if(data === 'actual'){
                this.getLocationCoords()
              }
              console.log('Confirm Ok', data);
            }
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
  ngOnInit() {
    const modalState = {
      modal : true,
      desc : 'fake state for our modal'
    };
    setTimeout(() => {
          //  Ph: this.phoneAdmin,
          // Tk: this.token,
          // Phone: this.phone,
          // PhBs: this.phoneNumberId,
          console.log(this.phoneAdmin)
          console.log(this.token)
          console.log(this.phone)
          console.log(this.phoneNumberId)
    }, 3000);
    history.pushState(modalState, "null");
    this.typeCart = this.navParams.get('type');
    this.phoneAdmin = this.navParams.get('admin');
    this.sucursal = this.navParams.get('suc');
    this.metodoPago = this.navParams.get('metodoPago');
    this.phoneNumberId = this.navParams.get('phonenumberid');
    this.token = this.navParams.get('token');
   this.cuantoPaga = this.navParams.get('cuantopaga');
   this.ind = this.navParams.get('notageneral');
   this.costoEnvio =  this.navParams.get('costoEnvio');
    

  //  this.getCupones()

    setTimeout(() => {
        if(this.costoEnvio === 0){
           location.reload()
        }
    }, 18000);
    localStorage.setItem('imgnow','')
   const auth = getAuth();
    const db = getDatabase();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.uid = user.uid;
        this.sessionActive = true;

        const userRef = ref(db, `Users/${this.uid}`);
        onValue(userRef, (snapshot) => {
          const res = snapshot.val();
          console.log(res);
          this.phone = this.typeCart;

          if (this.typeCart === 'michelotes') {
            this.getUsersMenu();
            this.getLocation();
            this.getCredentials();
          } else {
            this.getCredentials();
            this.getLocationBsChat();
            this.getUsersMenuCache();
            this.getMenuWpp();
            this.ubicacion = 'pendiente';
          }
        });
      } else {
        const cacheRef = ref(db, `UsersCache/${this.typeCart}`);
        onValue(cacheRef, (snapshot) => {
          const res = snapshot.val();
          console.log(res);
          console.log(res?.Nombre);
          this.phone = this.typeCart;

          if (this.typeCart === 'michelotes') {
            this.getMenu();
            this.getLocation();
            this.getCredentials();
          } else {
            this.ubicacion = 'pendiente';
            this.getCredentials();
            this.getLocationBsChat();
            this.getUsersMenuCache();
            this.getMenuWpp();
          }
        });
      }
    });
  }

getCupones() {
  const db = getDatabase();
  const cuponesRef = ref(db, 'Cupones');

  get(cuponesRef).then((snapshot) => {
    if (snapshot.exists()) {
      const res = snapshot.val();
      const array = [];

      for (const key in res) {
        if (res.hasOwnProperty(key)) {
          array.push(res[key]);
        }
      }

      this.arrayCupones = array;
    } else {
      console.log("No hay cupones disponibles.");
      this.arrayCupones = [];
    }
  }).catch((error:any) => {
    console.error("Error al obtener cupones:", error);
  });
}

  getCredentials(){
    // console.log(this.phoneAdmin)
    // this.afDB.database.ref("ruta").child(this.phoneAdmin).once('value', snap => {
    //   const res = snap.val();
    //   console.log(res)
  
    //   this.phoneNumberId  = res.PhId
    //   this.token = res.Tk
 
    
    // })
  }
  toggleFullScreen() {
    const elem: any = document.documentElement;
    if (!document.fullscreenElement && !document['fullscreenElement']) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem['webkitRequestFullscreen']) {
        elem['webkitRequestFullscreen']();
      }
    } else {
        if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any)['exitFullscreen']) {
        (document as any)['exitFullscreen']();
      }
    }
  }
  
 
getMenu() {
  const db = getDatabase();
  const menuRef = ref(db, `ruta/${this.phoneAdmin}/CartWpp/${this.typeCart}`);

  onValue(menuRef, (snapshot) => {
    const res = snapshot.val();
    const array:any = [];

    for (const i in res) {
      array.push(res[i]);
    }

    if (res === null) {
      // this.showToast('we are null')
    } else {
      // this.showToast('we get information')
    }

    this.precio = 0;
    this.textPedido = "";
    this.textPedidoClient = "";

    this.zone.run(() => {
      this.menuPromociones = array;
      for (let i = 0; i < this.menuPromociones.length; i++) {
        this.precio = this.precio + +this.menuPromociones[i]['Precio'];

        if (this.menuPromociones[i]['Ind'] === '') {
          this.textPedido += "\n- " + this.menuPromociones[i]['Nombre'] + " - " +
            this.menuPromociones[i]['TamanoSelected'] + " " +
            this.menuPromociones[i]['SaborSelected'] + " ";

          this.textPedidoClient += "\n- " + this.menuPromociones[i]['Nombre'] + " - " +
            this.menuPromociones[i]['TamanoSelected'] + " " +
            this.menuPromociones[i]['SaborSelected'] + " ";
        } else {
          this.textPedido += "\n- " + this.menuPromociones[i]['Nombre'] + " - " +
            this.menuPromociones[i]['TamanoSelected'] + " " +
            this.menuPromociones[i]['SaborSelected'] +
            "\n  Indicaciones: " + this.menuPromociones[i]['Ind'] + " ";

          this.textPedidoClient += "- " + this.menuPromociones[i]['Nombre'] + " - " +
            this.menuPromociones[i]['TamanoSelected'] + " " +
            this.menuPromociones[i]['SaborSelected'] + " " +
            "\n Indicacionesx: " + this.menuPromociones[i]['Ind'] + " ";
        }
      }
    });

    console.log(this.menuPromociones);
  });
}
  getMenuWpp() {
  const db = getDatabase();
  const menuRef = ref(db, `ruta/${this.phoneAdmin}/CartWpp/${this.typeCart}`);

  onValue(menuRef, (snapshot) => {
    const res = snapshot.val();
    const array :any = [];

    for (const i in res) {
      array.push(res[i]);
    }

    if (res === null) {
      // this.showToast('we are null')
    } else {
      // this.showToast('we get information')
    }

    this.precio = 0;
    this.textPedido = "";
    this.textPedidoClient = "";

    this.zone.run(() => {
      this.menuPromociones = array;

      for (let i = 0; i < this.menuPromociones.length; i++) {
        this.precio = this.precio + +this.menuPromociones[i]['Precio'];

        this.textPedido += "- " + this.menuPromociones[i]['Nombre'] + " - " +
          this.menuPromociones[i]['TamanoSelected'] + " " +
          this.menuPromociones[i]['SaborSelected'] +
          "\n Indicaciones: " + this.menuPromociones[i]['Ind'] + " ";

        this.textPedidoClient += "- " + this.menuPromociones[i]['Nombre'] + " - " +
          this.menuPromociones[i]['TamanoSelected'] + " " +
          this.menuPromociones[i]['SaborSelected'] + " " +
          "\n Indicaciones:" + this.menuPromociones[i]['Ind'];
      }
    });

    console.log(this.menuPromociones);
  });
}

  getTarifas(distancia: any) {
  const db = getDatabase();
  const tarifasRef = ref(db, `ruta/${this.phoneAdmin}/Tarifa`);

  onValue(tarifasRef, (snapshot) => {
    const res = snapshot.val();
    const array: any = [];

    for (const i in res) {
      array.push(res[i]);
    }

    if (res === null) {
      // this.showToast('we are null')
    } else {
      // this.showToast('we get information')
    }

    this.zone.run(() => {
      this.tarifasArray = array;
    });

    for (let i = 0; i < this.tarifasArray.length; i++) {
      if (this.tarifasArray[i]['Min'] <= distancia && this.tarifasArray[i]['Max'] >= distancia) {
        this.zone.run(() => {
          this.costoEnvio = this.tarifasArray[i]['Precio'];
          this.enableBtn = true;
        });
      }
    }
  });
}

 getTarifasRepa(distancia: any) {
  const db = getDatabase();
  const tarifasRef = ref(db, `ruta/${this.phoneAdmin}/TarifasRepa`);

  onValue(tarifasRef, (snapshot) => {
    const res = snapshot.val();
    const array: any = [];

    for (const i in res) {
      array.push(res[i]);
    }

    if (res === null) {
      // this.showToast('we are null')
    } else {
      // this.showToast('we get information')
    }

    this.zone.run(() => {
      this.tarifasRepaArray = array;

      for (let i = 0; i < this.tarifasRepaArray.length; i++) {
        if (this.tarifasRepaArray[i]['Min'] <= distancia && this.tarifasRepaArray[i]['Max'] >= distancia) {
          this.zone.run(() => {
            this.costoEnvioRepa = this.tarifasRepaArray[i]['Precio'];
            this.enableBtn = true;
          });
        }
      }
    });
  });
}

closeModal(){
  this.modalController.dismiss()
}
 getLocation() {
  const db = getDatabase();
  const locationRef = ref(db, `Lcts/${this.phone}`);

  onValue(locationRef, async (snapshot) => {
    const res = snapshot.val();
    console.log(res);

    if (res === null || res === "null") {
      this.router.navigate(['/world-map'], { replaceUrl: true });
      return;
    }

    if (res.Ind === "") {
      this.ind = "";
    } else {
      this.ind = res.Ind;
      this.showCalleNum = false;
    }

    const array:any = [];
    for (const i in res) {
      array.push(res);
    }
    console.log(array);

    this.zone.run(async () => {
      this.locations = array.reverse();

      for (let i = 0; i < this.locations.length; i++) {
        if (this.locations[i]['Pred'] === true) {
          this.ubicacion = this.locations[i]['Street'];
          this.Lat = this.locations[i]['Lat'];
          this.Lng = this.locations[i]['Lng'];

          const sucursalesRef = ref(db, 'Sucursales');
          const sucSnapshot = await get(sucursalesRef);
          const sucData = sucSnapshot.val();

          const sucArray = [];
          for (const key in sucData) {
            sucArray.push(sucData[key]);
          }

          for (let j = 0; j < sucArray.length; j++) {
            const coord1 = [sucArray[j]['Lat'], sucArray[j]['Lng']];
            const coord2 = [this.Lat, this.Lng];
            const precision = 7;

            const coord1Ajustadas = this.ajustarPrecision(coord1, precision);
            const coord2Ajustadas = this.ajustarPrecision(coord2, precision);

            const latitud1 = coord1Ajustadas[0];
            const longitud1 = coord1Ajustadas[1];
            const latitud2 = coord2Ajustadas[0];
            const longitud2 = coord2Ajustadas[1];

            const distancia22 = this.calcularDistancia(latitud1, longitud1, latitud2, longitud2);
            this.arraySetSucursal.push({ distancia22 });
          }

          console.log(this.arraySetSucursal);
          let minDistance = Infinity;
          let minIndex = -1;

          for (let k = 0; k < this.arraySetSucursal.length; k++) {
            const distancia = this.arraySetSucursal[k].distancia22;
            if (+distancia < +minDistance) {
              minDistance = distancia;
              minIndex = k;
            }
          }

          console.log("La distancia mínima es:", minDistance);
          console.log("Está en la posición:", minIndex);

          this.sucursal = sucArray[minIndex]['Sucursal'];
          const coord1 = [sucArray[minIndex]['Lat'], sucArray[minIndex]['Lng']];
          const coord2 = [this.Lat, this.Lng];
          const coord1Ajustadas = this.ajustarPrecision(coord1, 7);

          const latitud1 = coord1Ajustadas[0];
          const longitud1 = coord1Ajustadas[1];
          const distancia2 = this.calcularDistancia(latitud1, longitud1, this.Lat, this.Lng);

          console.log("Distancia en kilómetros2:", distancia2);
          this.distancia = distancia2;
          this.start = (this.distancia * this.mountCalcTime) + +this.predTime + 17;

          this.getTarifas(distancia2);
          this.getTarifasRepa(distancia2);

          break; // detener loop después de encontrar ubicación con Pred == true
        }
      }
    });

    console.log(this.menuPromociones);
  });
}

  ajustarPrecision(coord:any, precision:any) {
    return coord.map(function(value:any) {
        return parseFloat(value.toFixed(precision));
    });
}

goToMap(){

  this.router.navigate(['/world-map'],{ replaceUrl: true });
}
async getLocationBsChat() {
  const db = getDatabase();
  const location = await this.getLocationUser();

  setTimeout(async () => {
    const sucursalesRef = ref(db, `ruta/${this.phoneAdmin}/Sucursales`);
    const snapshot = await get(sucursalesRef);

    const res = snapshot.val();
    const array = [];

    for (const i in res) {
      array.push(res[i]);
    }

    for (let i = 0; i < array.length; i++) {
      const coord1 = [array[i]['Lat'], array[i]['Lng']];
      const coord2 = [this.Lat, this.Lng];
      const precision = 7;

      const coord1Ajustadas = this.ajustarPrecision(coord1, precision);
      const coord2Ajustadas = this.ajustarPrecision(coord2, precision);

      const latitud1 = coord1Ajustadas[0];
      const longitud1 = coord1Ajustadas[1];
      const latitud2 = coord2Ajustadas[0];
      const longitud2 = coord2Ajustadas[1];

      const distancia22 = this.calcularDistancia(latitud1, longitud1, latitud2, longitud2);
      this.arraySetSucursal.push({ distancia22 });
    }

    console.log(this.arraySetSucursal);

    let minDistance = Infinity;
    let minIndex = -1;

    for (let j = 0; j < this.arraySetSucursal.length; j++) {
      const distancia = this.arraySetSucursal[j].distancia22;

      if (+distancia < +minDistance) {
        minDistance = distancia;
        minIndex = j;
      }
    }

    console.log("La distancia mínima es:", minDistance);
    console.log("Está en la posición:", minIndex);

    this.sucursal = array[minIndex]['Sucursal'];

    const coord1 = [array[minIndex]['Lat'], array[minIndex]['Lng']];
    const coord2 = [this.Lat, this.Lng];

    const coord1Ajustadas = this.ajustarPrecision(coord1, 7);
    const coord2Ajustadas = this.ajustarPrecision(coord2, 7);

    const latitud1 = coord1Ajustadas[0];
    const longitud1 = coord1Ajustadas[1];
    const latitud2 = coord2Ajustadas[0];
    const longitud2 = coord2Ajustadas[1];

    const distancia2 = this.calcularDistancia(latitud1, longitud1, latitud2, longitud2);

    console.log("Distancia en kilómetros2:", distancia2);
    this.distancia = distancia2;
    this.start = (this.distancia * this.mountCalcTime) + +this.predTime + 17;

    this.getTarifas(distancia2);
    this.getTarifasRepa(distancia2);
  }, 2000);
}

getUsers() {
  const db = getDatabase();
  const userRef = ref(db, `Users/${this.uid}`);

  onValue(userRef, (snapshot) => {
    const res = snapshot.val();
    const array = [];

    for (const i in res) {
      array.push(res[i]);
    }

    this.phone = res.Phone;

    if (res === null) {
      // this.showToast('we are null');
    } else {
      // this.showToast('we get information');
    }

    console.log(this.menuPromociones);
  });
}
  
async getHorarios() {
  try {
    // Obtener la fecha del servidor desde tu servicio
    const fechaServer = await this.dateService.serverHour(); // debe retornar string tipo '2024-02-24 & 19:30'
    
    // Obtener referencia a la base de datos
    const db = getDatabase();

    // Obtener snapshot de las sucursales
    const sucursalesRef = ref(db, `ruta/${this.phoneAdmin}/Sucursales`);
    const snapshot = await get(sucursalesRef);
    const res = snapshot.val();

    const array = [];
    for (const i in res) {
      array.push(res[i]);
    }

    // Extraer y limpiar la hora actual
    const fechaActual = fechaServer.substring(13, 18).replace(":", "");
    const horaApertura = array[0]['Horario'].substring(0, 5).replace(":", "");
    const horaCierre = array[0]['Horario'].substring(8, 13).replace(":", "");

    // Verificar si está dentro del horario
    if (fechaActual >= horaApertura && fechaActual <= horaCierre) {
      console.log("La fecha del servidor está dentro del horario de operación.");
      this.outOfWork = true;
    } else {
      console.log("La fecha del servidor está fuera del horario de operación.");
      this.outOfWork = false;
      // this.showToast('El establecimiento se encuentra cerrado.');
    }

  } catch (error: any) {
    alert("Se ha producido un error: " + error.message);
    alert("Se ha producido un error2: " + error.stack);
  }
}


getUsersMenuCache() {
  const db = getDatabase();
  const usersCacheRef = ref(db, `UsersCache/${this.typeCart}`);

  onValue(usersCacheRef, (snapshot) => {
    const res = snapshot.val();
    const array = [];

    for (const i in res) {
      array.push(res[i]);
    }

    // this.cuantoPaga = res.CuantoPaga;
    // this.ind = res.Ind;
    // this.metodoPago = res.PaymentType;

    this.getMenu();

    if (res === null) {
      // this.showToast('we are null');
    } else {
      // this.showToast('we get information');
    }

    console.log(this.menuPromociones);
  });
}
  getUsersMenu() {
  const db = getDatabase();
  const usersRef = ref(db, `Users/${this.uid}`);

  onValue(usersRef, (snapshot) => {
    const res = snapshot.val();
    const array = [];

    for (const i in res) {
      array.push(res[i]);
    }

    this.phone = res.Phone;
    // this.cuantoPaga = res.CuantoPaga;

    this.getMenu();

    if (res === null) {
      // this.showToast('we are null');
    } else {
      // this.showToast('we get information');
    }

    console.log(this.menuPromociones);
  });
}


  async  loadingUser(){
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Cargando imagen, puede demorar algunos segundos...',
    });
    await this.loading.present();
  }
  dismiss(){
    this.modalController.dismiss()
  }
  async showCartModal(){
    this.modal = await this.modalController.create({
      component: ModalCartComponent,
      cssClass: 'modal-add',
      canDismiss:true,
      backdropDismiss:true,
       initialBreakpoint:1,
        breakpoints:[0, 0.25, 1, 0.1],
       componentProps: {
         type: this.typeCart,
         admin: this.phoneAdmin
    
     }
    
    });
    await this.modal.present();
 
 
    await this.modal.onDidDismiss().then((e:any)=>{
      console.log(e.data)
      //this.digitalist = true

     // this.sendMessage(e.data['Cmd'],e.data['TypeAns'],e.data['Src'],e.data['Pro'])
 
     
   })
 
  }
 newBot() {
  this.srcSendImg = localStorage.getItem('imgnow');
  this.loading.dismiss();

  const dataClient = {
    Img: this.srcSendImg,
  };

  const db = getDatabase();

  let updateRef;

  if (this.typeCart === 'michelotes') {
    updateRef = ref(db, `Users/${this.uid}`);
  } else {
    updateRef = ref(db, `UsersCache/${this.typeCart}`);
  }

  update(updateRef, dataClient)
    .then(() => {
      this.showImg = true;
      // Navegar si deseas
      // this.router.navigate(['/confirmar-pedido/'+this.typeCart+'/'+this.metodoPago],{ replaceUrl: true });
    })
    .catch((error) => {
      console.error("Error al actualizar la imagen:", error);
    });
}
  getLocationCoords(){        
    var x = document.getElementById("demo");
   
  

  if (navigator.geolocation) {
    // Verificar si el navegador soporta el seguimiento de la ubicación en tiempo real
    if (navigator.geolocation.getCurrentPosition) {
      navigator.geolocation.getCurrentPosition((position) => {
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;
          const geocoder = new google.maps.Geocoder();
          const latlngDraggable = {
              lat: latitude,
              lng: longitude,
          };
          geocoder.geocode({ location: latlngDraggable }, (results:any, status:any) => {
              if (status === "OK") {
                  if (results[0]) {
                      console.log('formatted address')
                      this.direccion = results[0].formatted_address;
                      this.numero = results[0].address_components[0]['long_name'];
                      this.calle = results[0].address_components[1]['long_name'];
                      this.colonia = results[0].address_components[2]['long_name'];
                      this.ciudad = results[0].address_components[3]['long_name'];
                      this.estado = results[0].address_components[4]['long_name'];
                      this.pais = results[0].address_components[5]['long_name'];
                      this.codigopostal = results[0].address_components[6]['long_name'];
                      this.ubicacion = this.calle + " Col. " + this.colonia + " CP:" + this.codigopostal;
                  } else {
                      window.alert("No results found");
                  }
              } else {
                  window.alert("Geocoder failed due to: " + status);
              }
          });
          var objt = {
              Lat: latitude,
              Lng: longitude,
              Calle: ""
          }
          console.log("Posición obtenida - Latitud: " + latitude + ", Longitud: " + longitude);
      }, function (error) {
          console.error("Error al obtener la ubicación: " + error.message);
      });
  }
  
  } else {
    console.error("La geolocalización no es compatible con este navegador.");
  }
    }
    async textComponent(type:any){
      this.modal = await this.modalController.create({
        component: ModalTextsComponent,
        cssClass: 'modal-add',
        canDismiss:true,
        backdropDismiss:true,
         initialBreakpoint:1,
          breakpoints:[0, 0.25, 1, 0.1],
         componentProps: {
           Type: type,
       }
      });
      await this.modal.present();
   
   
      await this.modal.onDidDismiss().then((e:any)=>{
        console.log(e.data)
        if(e.data === undefined ){

        }else{
             if(e.data['Type'] === 'Agregar cupon'){

          this.cudigo = e.data['Text'].toUpperCase().substring(0,4)
             this.addCode(this.cudigo)
        } 
         if(e.data['Type'] === 'Agregar una nota'){
          this.notaGeneral = e.data['Text']
          this.showToast('Se agregó la nota')
          this.notaVisible = false
        }
        if(e.data['Type'] === 'Agregar calle y numero'){
          this.zone.run(() => {
            this.ind = e.data['Text']
            this.showCalleNum = false
            var objt = {
              Ind: this.ind
            }
           
    const db = getDatabase();

let updateRef;

if (this.typeCart === 'michelotes') {
  updateRef = ref(db, `Lcts/${this.phone}`);
} else {
  updateRef = ref(db, `UsersCache/${this.typeCart}`);
}

update(updateRef, objt)
  .then(() => {
    console.log('Datos actualizados correctamente');
  })
  .catch((error) => {
    console.error('Error al actualizar datos:', error);
  });

         })
          this.showToast('Se agregó la calle y numero')
        }
        }
     
       
     })
   
    }
    addCode(str:any){
      var testing = false

      if(this.cuponCharged === false){
      
        for(var i = 0 ; i < this.arrayCupones.length;i++){
          if(this.cudigo.toUpperCase() === this.arrayCupones[i]['Code']){
            localStorage.setItem('LastDiscount',this.precio.toString())
            this.precioCache =  Math.round(+this.precio); 
            this.precio = +this.precio - +this.precio/100 * +this.arrayCupones[i]['Descuento']    
            this.precio =  Math.round(+this.precio); 
            this.writingCode = false
            this.descuento = +this.arrayCupones[i]['Descuento']
            testing = true
            this.showToast('Se agregó correctamente el descuento de '+this.arrayCupones[i]['Descuento']+'%')
            this.cuponCharged = true
    
          }
        }
      }else{
        this.showToast('Solo puedes agregar un cupon')
      }
    
       this.zone.run(() => {
       if (testing === true){
         this.showToast('descuento aplicado')
 
       }else{
      
         this.showToast('El cupón esta vencido o está en uso')
       }
    })

      }
      copy(){
        this.copyMessage(this.tarjeta)
        //this.shareGral()
      }
      copyMessage(url:any){
        const selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = url;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        this.showToast('Copiado')
        //this.router.navigate(['/bonos'],{ replaceUrl: true });
      }
      @HostListener('window:popstate', ['$event'])
      dismissModal() {
        this.modalController.dismiss();
      }
    
}

