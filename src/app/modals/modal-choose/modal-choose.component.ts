import { Component, HostListener, OnInit } from '@angular/core';
import { ModalCartComponent } from '../modal-cart/modal-cart.component';
import { Router } from '@angular/router';
import { ModalController, NavParams } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref as dbRef, push, update } from '@angular/fire/database';
@Component({
  selector: 'app-modal-choose',
  templateUrl: './modal-choose.component.html',
  styleUrls: ['./modal-choose.component.scss'],
})
export class ModalChooseComponent  implements OnInit {
  uid:any
  arrayItem:any
  img:any
  precioBase = 0
  countAdd = 1
  modal:any
  nombre:any
  discountsState = false
  desc:any
  optionListTamano:any = []
  hasTamanoState = false
  phoneNumberAdmin:any
  hasSabores = false
  enableConfirm = false
  Ind = ''
  optionListVolkanLoko = [{Opt:"Tostitos salsa verde"},{Opt:"Tostitos flamin hot"},{Opt:"Conchitas"},{Opt:"Ruffles de queso"}, {Opt:"Doritos nacho"}]
 optionListLechera = [{Opt:"Si"}, {Opt:"No"}]
  phoneUser:any
  optionListsabores:any = []
  saborSelected:any
  tamanoSelected  = ''
  precio:any
  typeCart:any
    papitas1 = ""
  papitas2 = ""
  papitas3 = ""
  optionListFresastopping = [{Opt:"Chispas de chocolate"}, {Opt:"Chocolate Hersheys Liquido"},{Opt:"Nuez"}, {Opt:"Lechera"},  {Opt:"Cajeta"}]

  writeNota = false
  gomitasQ = 0
  lecheraQ = 0
  
  saborSelectedBoolean = false
  tamanoSelectedBoolean = false
  constructor(private router: Router,private modalController : ModalController,
    private navParams : NavParams) { }
  closeModal(){
    this.modalController.dismiss()
   }  
     setGomitas(item:any){
    console.log(item);
    if(item.Opt === 'Si'){
      this.gomitasQ = 25

    }else{

      if(this.gomitasQ === 25){
   
       this.gomitasQ = 0

      }else{
        this.gomitasQ = 0
       
      }

    }
   }
     fresasTopping = ""
     setFresastopping(item:any){
    console.log(item);
    if(item.Opt !== 'Si'){
      this.fresasTopping = item.Opt

    }else{
      if(this.lecheraQ === 10){
     

        this.lecheraQ = 0
      }else{
        this.lecheraQ = 0
       
      }


    }
   }
    setLechera(item:any){
    console.log(item);
    if(item.Opt === 'Si'){
      this.lecheraQ = 0

    }else{
      if(this.lecheraQ === 0){
     

        this.lecheraQ = 0
      }else{
        this.lecheraQ = 0
       
      }


    }
   }

   showNota(){
     this.writeNota = true
   }

      setVolkan1(item:any){
    console.log(item);
    
    this.papitas1 = item.Opt

    
   }

   setVolkan2(item:any){
    console.log(item);
this.papitas2 = item.Opt
  
   }
   setVolkan3(item:any){
    console.log(item);
  
    this.papitas3 = item.Opt


    
   }

   addCount(){
    if(this.countAdd === 10){
      
      return
    }
     this.countAdd = +this.countAdd + 1
     this.precio = this.precioBase * this.countAdd
   
   }
   removeCount(){
     if(this.countAdd === 1){
       return
     }
    this.countAdd = this.countAdd - 1
    this.precio = this.precioBase * +this.countAdd
  
  }
  ngOnInit() {
  
    const modalState = {
      modal : true,
      desc : 'fake state for our modal'
    };
    history.pushState(modalState, "null");
    
    this.arrayItem = this.navParams.get('Item')
    this.uid = this.navParams.get('Uid')
    this.discountsState = this.navParams.get('discounts');

    this.phoneNumberAdmin = this.navParams.get('Admin')
    this.typeCart = this.navParams.get('TypeCart')
    this.hasSabores = this.arrayItem['Sabores']
    this.hasTamanoState = this.arrayItem['Tamaño']
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        this.uid = uid;
      } else {
        // Usuario no autenticado
      }
    });
    if(this.tamanoSelectedBoolean === false && this.hasSabores === false){
     // this.enableConfirm = true
    }
    if(this.discountsState === true){

      if(this.arrayItem['Disc'] > 0){
        this.precio = this.arrayItem['DescFinal']
  
      }else{
        this.precio = this.arrayItem['Precio']
  
      }
    }else{
      this.precio = this.arrayItem['Precio']

    }
  
    this.precioBase = this.precio

    if(this.hasSabores === true){
      this.optionListsabores = this.arrayItem['SaborList']
      for(var i = 0 ; i < this.optionListsabores.length;i++){
        this.optionListsabores[i]['Tamano'] =this.optionListsabores[i]['Tamaño'] 
      }
    }
    if(this.hasTamanoState === true){
      this.optionListTamano = this.arrayItem['TamañoList']
      for(var i = 0 ; i < this.optionListTamano.length;i++){
        this.optionListTamano[i]['Tamano'] =this.optionListTamano[i]['Tamaño'] 
      }
    }
  
    this.nombre = this.arrayItem['Nombre']
    this.desc = this.arrayItem['Desc']
    this.img = this.arrayItem['Img']
    
  
  }
  async textComponent(type:any){

    this.modal = await this.modalController.create({
      component: ModalCartComponent,
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
      //alert(JSON.stringify(e.data.Text)); 
      this.Ind = e.data.Text


     // this.sendMessage(e.data['Cmd'],e.data['TypeAns'],e.data['Src'],e.data['Pro'])
 
     
   })
 
  }
  setSabor(item:any){
    this.saborSelectedBoolean = true
    this.saborSelected = item.Sabor
    if(this.tamanoSelectedBoolean === true){
      
      this.enableConfirm = true
      }else if(this.hasTamanoState === false){
        this.enableConfirm = true

      }
      if(item.Precio === 0){

      }else{
      
        this.precio = 0
        this.precio = item.Precio * +this.countAdd
        if(this.discountsState === true){
          this.precio = +this.precio - (+this.precio/100*+item.Disc)  
          this.precioBase = item.Precio - (+item.Precio/100*+item.Disc)  
    
        }else{

        }
     
      }
  }
  setTamano(item:any){
   console.log(this.saborSelectedBoolean)

    this.tamanoSelected = item.Tamano
    this.tamanoSelectedBoolean = true
    if(this.saborSelectedBoolean === true){
   
    this.enableConfirm = true
    }
    if(this.tamanoSelectedBoolean === true && this.saborSelectedBoolean === true){
     
      this.enableConfirm = true
      }
      if(this.tamanoSelectedBoolean === true && this.hasSabores === false){
     
        this.enableConfirm = true
        }

      
    if(item.Precio === 0){
    
    }else{
      this.precio = 0
      this.precio = item.Precio * +this.countAdd
      this.precioBase = item.Precio 

     if(this.discountsState === true){
        this.precio = +this.precio - (+this.precio/100*+item.Disc)  
        this.precioBase = item.Precio - (+item.Precio/100*+item.Disc)  
  
      }else{
    
      }


    }

  }


updateCart() {
  
      if(this.nombre === "Volkan Loco"){
        console.log(this.papitas1)
        console.log(this.papitas2)
        console.log(this.papitas3)
        if(this.papitas1 === '' || this.papitas2 === '' || this.papitas3 === ''){
          alert("Falta un sabor de papitas")
          return

        }
      }
      if(this.nombre === "Charola Mix"){
        if(this.papitas1 === ''){
          alert("Falta un sabor de papitas")
          return

        }
      }
  const db = getDatabase();
   var nameTest = this.nombre 
    var testFresas = 0
    if(this.fresasTopping !== ''){
      nameTest = this.nombre + " + Extra de "+this.fresasTopping
      testFresas = 10
    }
    if (this.lecheraQ > 0){
      nameTest = this.nombre + " (CON LECHERA)"

    }else if (this.gomitasQ > 0){
      nameTest = this.nombre + " (CON EXTRA DE GOMITAS)"
    }

    var sabor = this.saborSelected

    if(this.nombre === "Charola Mix"){

    sabor = this.saborSelected + " + " + this.papitas1
    
    }

      if(this.nombre === "Volkan Loco"){
    sabor = this.saborSelected + " + " + this.papitas1 + " + " + this.papitas2 + " + " + this.papitas3
    }
//     [17:23, 2/5/2025] Estrella: 5264246816524648
// [17:23, 2/5/2025] Estrella: Banorte
// Estrella Ruiz Gómez
    var array = {
      SaborSelected : sabor || '',
      TamanoSelected : this.tamanoSelected || '',
      Precio: +this.precioBase + +this.lecheraQ + +this.gomitasQ + +testFresas,
      Ind: this.Ind,
      Nombre: nameTest,
      Img:this.img,
      Tops: "(" + this.papitas1 + " " + this.papitas2 + " " + this.papitas3,
      Desc:this.desc
    }
  // const array = {
  //   SaborSelected: this.saborSelected || '',
  //   TamanoSelected: this.tamanoSelected,
  //   Precio: this.precioBase,
  //   Ind: this.Ind,
  //   Nombre: this.nombre,
  //   Img: this.img,
  //   Desc: this.desc
  // };
  console.log(array)

  for (let i = 0; i < +this.countAdd; i++) {
    const usersRef = dbRef(db, 'Users');
    push(usersRef, {}).then((snap: any) => {
      const keyt = snap.key;

      const cartRef = dbRef(
        db,
        `ruta/${this.phoneNumberAdmin}/CartWpp/${this.typeCart}/${keyt}`
      );

      update(cartRef, array).then(() => {
        this.modalController.dismiss();
      });
    });
  }
}
  @HostListener('window:popstate', ['$event'])
  dismissModal() {
    this.modalController.dismiss();
  }

}

