import { Component, ElementRef, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonContent, ToastController } from '@ionic/angular';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { get as getDbRef, getDatabase, onValue, ref } from 'firebase/database';

import { get } from 'scriptjs';
import { environment } from 'src/environments/environment.prod';
declare var google: any
@Component({
  selector: 'app-select-publico',
  templateUrl: './select-publico.page.html',
  styleUrls: ['./select-publico.page.scss'],
})
export class SelectPublicoPage implements OnInit {
 @ViewChild('map', { static: false }) mapRef: ElementRef | undefined;
  @ViewChild(IonContent, { static: false }) content!: IonContent;
 arrayContactosCacheSearch:any = []
 arrayContactosCache:any = []
 descVarsAnalitycs : any
 arrayContactosSegmented:any = []
 menuLengthAnalitycs =0
 currentRadio = 1
 currentRadioPersonas = 0
 currentRadioTodos = 50
 arrayContactosCacheAnalitycs : any = []
  menuLength = 0 
  arrayContactosCache2 : any = []

  currentLat : any = 22.314669261048728
  serverHour = ""
  currentLng :any =  -97.8686636897337
    arrayVariables:any = []
  direccion =""
  colonia=""
  iconMarker = "https://png.pngtree.com/png-clipart/20230502/original/pngtree-location-pin-flat-icon-png-image_9133195.png"
  programa:any = []
  referencia = ""
  ciudad = ""
  arrayVariablesAnalitycs:any = []
  arrayNumbersAnalitycs: any = []
arrayContactosAnalitycs: any = []
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
arrayContactosResAnalitycs:any
  vivienda = ""
  houseTypes = [
    { name: 'Casa', icon: 'home-outline' },
    { name: 'Departamento', icon: 'business-outline' },
    { name: 'Oficina', icon: 'bag-remove-outline' },
    { name: 'Hotel', icon: 'bed-outline' },
    { name: 'Otro', icon: 'location-outline' }
  ];
  currentTypeHouse: string = '';
  isDireccionDisabled: boolean = false;
  pais = ""
  cacheNavigation =""
  estado = ""
  numero = ""
  userId = ""
  db = getDatabase();
  
  codigopostal= ""
   arrayContactos:any = []
   arrayNumbers : any = []
  calle=""
  enableService = false
  mapMarkerDraggable:any
  mapsKey = environment.mapsKey
   ph:any
  private activatedRoute = inject(ActivatedRoute);
  map : any;
    arrayContactosRes : any
  uid = ""
  selecteds = 0
  phone = ""
  title = ""
  usuarioLogueado = false
  constructor(private alertController:AlertController,private zone : NgZone,private toastController:ToastController, private router: Router) {

        get(`https://maps.googleapis.com/maps/api/js?key=`+ this.mapsKey+`&libraries=places`, () => {
      setTimeout(() => {

          console.log("La web app está corriendo en un navegador.");
          if (window.AndroidApp) {

        
            alert("requestpermisionlocation")
    
        
          } else {
            console.error('AndroidApp interface not available');
          }
          this.getLocation()

 
 
      }, 500);
      //      get(`https://maps.googleapis.com/maps/api/js?key=AIzaSyClzbvzJI0_4Q_1z5Pr0PCI9IdmYuwpMmo&libraries=places`, () => {
            });
   }

  ngOnInit() {
    const auth = getAuth();
 
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        this.uid = uid;
    setTimeout(() => {
          const userRef = ref(this.db, `UsersBusinessChat/${this.uid}`);
        onValue(userRef, (snapshot) => {
          const res = snapshot.val();
          const array :any = [];
          console.log(res?.['Auth']);
    
          if (res?.['Auth'] === undefined) {
            this.enableService = false;
            alert('we');
          } else {
            this.enableService = true;
    
            for (const i in res['Auth']) {
              array.push(res['Auth'][i]['Ph']);
            }
    
            this.zone.run(() => {
              this.arrayNumbers = array;
              this.ph = res['SelectedPh'];
    
              
              const contactosRef = ref(this.db, `ruta/${this.ph.toString()}/Locations/`);
              getDbRef(contactosRef).then((snapshot) => {
                const res = snapshot.val();
                const array = [];
    
                     for (const key in res) {
                  if (res.hasOwnProperty(key)) {
                    const obj = res[key];
                    obj[0].Numb = key; // Agrega el campo Numb con la clave
                    array.push(obj);
                  }
                }
                this.arrayContactosRes = Object.keys(res);
                this.arrayContactosCache = array; 
                // console.log(this.arrayContactosRes)
                for(var i = 0 ; i < this.arrayContactosCacheAnalitycs.length; i++){
                for(var xi = 0 ; xi < this.arrayContactosCache.length; xi++){
                  if (+this.arrayContactosCacheAnalitycs[i]['Num'] === +this.arrayContactosCache[xi][0]['Numb']){
                    
                    this.arrayContactosCache[xi][0]['StateSelect'] = this.arrayContactosCacheAnalitycs[i]['StateSelect']
                      
                    
                    
                  }
                }                  
                
                }
             
                for (let i = 0; i < this.arrayContactosCache.length; i++) {
               
                  this.arrayContactosCache[i]['Km'] = this.calcularDistancia(
                  this.currentLat, this.currentLng,
                    this.arrayContactosCache[i][0]['lat'], this.arrayContactosCache[i][0]['lng']
                  );
    
                 }
                  for (let i = 0; i < this.arrayContactosCache.length; i++) {
                    const kmStr = this.arrayContactosCache[i]['Km'];
                    const kmNum = parseFloat(kmStr); // convierte "1.5" en 1.5
                    this.arrayContactosCache[i]['KmNum'] = kmNum;
                  }
                  this.arrayContactos = []

                  this.arrayContactosSegmented = []
                const arraycachegift = [...this.arrayContactosCache]; // o this.arrayContactosCache.slice()
                const arraycachegift2 = [...this.arrayContactosCache];
                this.arrayContactosCache =  arraycachegift.filter((c: any) => c['KmNum'] <= this.currentRadioTodos);
                this.arrayContactosSegmented =  arraycachegift2.filter((c: any) => c['KmNum'] <= this.currentRadio);
                this.currentRadioPersonas = this.arrayContactosSegmented.length;
                console.log(this.arrayContactosSegmented)
                for (let i = 0; i < this.arrayContactosCache.length && i <= 2000; i++) {
                  this.arrayContactos.push(this.arrayContactosCache[i]);
                  //this.arrayContactosSegmented.push(this.arrayContactosCache[i]);
                }
        

                const variableNames = Object.keys(this.arrayContactos);
                const variableNamesArray = variableNames.filter(name => typeof this.arrayContactos[0][name] !== 'object');
    
                for (let i = 0; i < this.descVars.length; i++) {
                  this.arrayVariables.push({ Name: this.descVars[i]['Name'] });
                }
    
                for (let i = 0; i < this.arrayContactos.length; i++) {
                  this.arrayContactos[i]["IndexArray"] = i;
                 }
            
              }).then(() => {
                setTimeout(() => {
                  this.menuLength = this.arrayContactosCache.length;
                }, 1000);
              }).catch((err:any) => {
                console.error(err);
              });
       
            });
          }
         setTimeout(() => {
              
               this.arrayContactosCache2 = this.arrayContactosCache
                .filter((item:any) => item.Lat !== undefined || item.Lng !== undefined)
                .map((item:any) => ({ ...item })); // copia profunda de cada objeto
         
         }, 5000);
        });
    }, 4000);
    
      } else {
        // No user is signed in
      }

        if (user) {
    const uid = user.uid;
    this.uid = uid;

    const userRef = ref(this.db, `UsersBusinessChat/${this.uid}`);
    onValue(userRef, (snapshot) => {
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
          this.arrayNumbersAnalitycs = array;
          this.ph = res['SelectedPh'];

          const contactosRef = ref(this.db, `ruta/Contactos/${this.ph.toString()}`);
          getDbRef(contactosRef).then((snapshot) => {
            const res = snapshot.val();
            const array = [];

            for (const i in res) {
              array.push(res[i]);
            }

            this.arrayContactosResAnalitycs = Object.keys(res);
            this.arrayContactosCacheAnalitycs = array;
            this.arrayContactosCacheAnalitycs.sort((a:any, b:any) => b.Tst - a.Tst);

            for (let i = 0; i < this.arrayContactosCacheAnalitycs.length; i++) {
              if (this.arrayContactosCacheAnalitycs[i]['TstCmpg'] === 0 || this.arrayContactosCacheAnalitycs[i]['TstCmpg'] === undefined) {
                this.arrayContactosCacheAnalitycs[i]['StateSelect'] = false;
              } else {
                const timestampServidor = this.arrayContactosCacheAnalitycs[i]['TstCmpg'];
                const fechaServidor = new Date(timestampServidor);
                const diferenciaTiempo = Date.now() - fechaServidor.getTime();
                const diasPasados = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24));

                this.arrayContactosCacheAnalitycs[i]['StateSelect'] = diasPasados <= 14;

                const fechaCliente = new Date(Date.now() - diferenciaTiempo);
                const fechaFormateada = `${fechaCliente.getFullYear()}/${('0' + (fechaCliente.getMonth() + 1)).slice(-2)}/${('0' + fechaCliente.getDate()).slice(-2)} ${('0' + fechaCliente.getHours()).slice(-2)}:${('0' + fechaCliente.getMinutes()).slice(-2)}`;
                const partes = fechaFormateada.split(" ");
                this.arrayContactosCacheAnalitycs[i]['TstCmpg'] = `${partes[1]}\n${partes[0].replace("/","-").replace("/","-")}`;
              }
            }

            for (let i = 0; i < this.arrayContactosCacheAnalitycs.length; i++) {
              this.arrayContactosCacheAnalitycs[i]['Km'] = this.calcularDistancia(
                22.314669261048728, -97.8686636897337,
                this.arrayContactosCacheAnalitycs[i]['Lat'], this.arrayContactosCacheAnalitycs[i]['Lng']
              );

              const timestampServidor = this.arrayContactosCacheAnalitycs[i]['LstBuy'];
              const fechaServidor = new Date(timestampServidor);
              const diferenciaTiempo = Date.now() - fechaServidor.getTime();
              const fechaCliente = new Date(Date.now() - diferenciaTiempo);
              const fechaFormateada = `${fechaCliente.getFullYear()}/${('0' + (fechaCliente.getMonth() + 1)).slice(-2)}/${('0' + fechaCliente.getDate()).slice(-2)} ${('0' + fechaCliente.getHours()).slice(-2)}:${('0' + fechaCliente.getMinutes()).slice(-2)}`;
              const partes = fechaFormateada.split(" ");
              this.arrayContactosCacheAnalitycs[i]['LstBuy'] = `${partes[1]}\n${partes[0].replace("/","-").replace("/","-")}`;
            }

            for (let i = 0; i < this.arrayContactosCacheAnalitycs.length; i++) {
              const timestampServidor = this.arrayContactosCacheAnalitycs[i]['Tst'];
              const fechaServidor = new Date(timestampServidor);
              const diferenciaTiempo = Date.now() - fechaServidor.getTime();
              const fechaCliente = new Date(Date.now() - diferenciaTiempo);
              const fechaFormateada = `${fechaCliente.getFullYear()}/${('0' + (fechaCliente.getMonth() + 1)).slice(-2)}/${('0' + fechaCliente.getDate()).slice(-2)} ${('0' + fechaCliente.getHours()).slice(-2)}:${('0' + fechaCliente.getMinutes()).slice(-2)}`;
              const partes = fechaFormateada.split(" ");
              this.arrayContactosCacheAnalitycs[i]['Tst'] = `${partes[1]}\n${partes[0].replace("/","-").replace("/","-")}`;
            }

            for (let i = 0; i < this.arrayContactosCacheAnalitycs.length && i <= 200; i++) {
              this.arrayContactos.push(this.arrayContactosCacheAnalitycs[i]);
            }

      
       

            for (let i = 0; i < this.arrayContactosAnalitycs.length; i++) {
              this.arrayContactosAnalitycs[i]["IndexArray"] = i;
              if (this.arrayContactosAnalitycs[i]["TstCmpg"] === undefined) this.arrayContactosAnalitycs[i]["TstCmpg"] = 0;
              if (this.arrayContactosAnalitycs[i]["TstMe"] === undefined) this.arrayContactosAnalitycs[i]["TstMe"] = 0;
              if (this.arrayContactosAnalitycs[i]["BuyCnt"] === undefined) this.arrayContactosAnalitycs[i]["BuyCnt"] = 0;
            }

          }).then(() => {
            setTimeout(() => {
              console.log(this.arrayContactosCacheAnalitycs)
              this.menuLengthAnalitycs = this.arrayContactosCacheAnalitycs.length;
            }, 1000);
          }).catch((err) => {
            console.error(err);
          });
        });
      }
    });
  } else {
    // No user is signed in
  }
    });

 



  }

  toRad(value: number): number {
  return value * Math.PI / 180;
}

async getDistanceInMeters(lat1: number, lng1: number, lat2: number, lng2: number): Promise<number> {
  const R = 16371000; // Radio de la Tierra en metros
  const dLat = this.toRad(lat2 - lat1);
  const dLng = this.toRad(lng2 - lng1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

    showMap(lat:any,lng:any){
 
    const location = new google.maps.LatLng(lat,lng);

    const options = {
    center: location,
    zoom:13,
    disableDefaultUI:false,
    draggable: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_RIGHT
    },
    zoomControl: true, // Mostrar solo los controles de zoom
    mapTypeControl: false, // Desactivar el control de tipo de mapa
    scaleControl: false, // Desactivar el control de escala
    streetViewControl: false, // Desactivar el control de Street View
    rotateControl: false, // Desactivar el control de rotación
    fullscreenControl: false, // Desactivar el control de pantalla completa
    mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain", "Dark"]
    }
    var iconSize = new google.maps.Size(70, 70); // Cambia 50, 50 al tamaño deseado

    var customIcon = {
      url: this.iconMarker,
      scaledSize: iconSize // Aplica el tamaño deseado
    };
    if (this.mapRef) {
      this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    }
    const iconVerde = {
      url: 'https://cdn-icons-png.freepik.com/512/1018/1018626.png', // ícono verde estándar
      scaledSize: new google.maps.Size(5, 5)
    };
   
    setTimeout(() => {

        const puntos = [
    ];
    console.log(this.arrayContactosCache)

    for(var i = 0 ; i < this.arrayContactosCache.length; i++){
      console.log(this.arrayContactosCache[i])
      if(this.arrayContactosCache[i][0]['StateSelect'] === false){
      puntos.push(this.arrayContactosCache[i][0])

      }else{
        console.log("STATESELECT:")
          console.log(this.arrayContactosCache[i][0]['StateSelect'])
          console.log(this.arrayContactosCache[i][0]['Numb'])
      }
    }

    puntos.forEach(p => {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(p.lat, p.lng), // ← directamente, sin parseFloat
        map: this.map,
        icon: iconVerde,
        title: 'Punto verde'
      });
    });
    }, 9000);
  
    let position = new google.maps.LatLng(lat,lng);
    this.mapMarkerDraggable = new google.maps.Marker({
   position:position,
   latitude:lat,
   title: '',
   longitude: lng,
   animation: google.maps.Animation.DROP,
   draggable:true,
   icon: customIcon
   });
   
 //  markers[0].setMap(this.map)
 // Crear el círculo
var circle = new google.maps.Circle({
  map: this.map,
  center: position,
  radius: this.currentRadio * 1000, // Radio de 30px
  strokeColor: "#FF0000", // Color del borde del círculo
  strokeOpacity: 0.8, // Opacidad del borde del círculo
  strokeWeight: 2, // Grosor del borde del círculo
  fillColor: "#FF0000", // Color de relleno del círculo
  fillOpacity: 0.30 // Opacidad del relleno del círculo
});

// Enlazar el círculo al marcador
circle.bindTo('center', this.mapMarkerDraggable, 'position');
 this.mapMarkerDraggable.setMap(this.map)
 const geocoder = new google.maps.Geocoder();

 google.maps.event.addListener(this.mapMarkerDraggable, 'dragend', async (marker: any) =>{
 
  var latLng = marker.latLng; 
  //this.markers = []

  const latlngDraggable = {
    lat: latLng.lat(),
    lng: latLng.lng(),
  };
    const lat1 = latLng.lat();
  const lng1 = latLng.lng();
  this.currentLat = lat1
  this.currentLng = lng1
       const contactosRef = ref(this.db, `ruta/${this.ph.toString()}/Locations/`);
              getDbRef(contactosRef).then((snapshot) => {
                const res = snapshot.val();
                const array = [];
                for (const key in res) {
                  if (res.hasOwnProperty(key)) {
                    const obj = res[key];
                    obj[0].Numb = key; // Agrega el campo Numb con la clave
                    array.push(obj);
                  }
                }
                this.arrayContactosRes = Object.keys(res);
                this.arrayContactosCache = array; 
                this.arrayContactosCache.sort((a:any, b:any) => b.Tst - a.Tst);
          
                for(var i = 0 ; i < this.arrayContactosCacheAnalitycs.length; i++){
                for(var xi = 0 ; xi < this.arrayContactosCache.length; xi++){
                  if (+this.arrayContactosCacheAnalitycs[i]['Num'] === +this.arrayContactosCache[xi][0]['Numb']){
                    
                    this.arrayContactosCache[xi]['StateSelect'] = this.arrayContactosCacheAnalitycs[i]['StateSelect']
                      
                    
                    
                  }
                }                  
                
                }
    
                for (let i = 0; i < this.arrayContactosCache.length; i++) {
                  //console.log(this.arrayContactosCache[i])
                  this.arrayContactosCache[i]['Km'] = this.calcularDistancia(
                    this.currentLat, this.currentLng,
                    this.arrayContactosCache[i][0]['lat'], this.arrayContactosCache[i][0]['lng']
                  );
    
                  for (let i = 0; i < this.arrayContactosCache.length; i++) {
                    const kmStr = this.arrayContactosCache[i]['Km'];
                    const kmNum = parseFloat(kmStr); // convierte "1.5" en 1.5
                    this.arrayContactosCache[i]['KmNum'] = kmNum;
                  }
                           // Paso 2: Filtrar los que estén a 2 km o menos
                }
                const arraycachegift = [...this.arrayContactosCache]; // o this.arrayContactosCache.slice()
                const arraycachegift2 = [...this.arrayContactosCache];
                this.arrayContactosCache =  arraycachegift.filter((c: any) => c['KmNum'] <= this.currentRadioTodos);
                this.arrayContactos = []
                this.arrayContactosSegmented = []
                this.arrayContactosSegmented =  arraycachegift2.filter((c: any) => c['KmNum'] <= this.currentRadio);
                this.currentRadioPersonas = this.arrayContactosSegmented.length;
                
                for (let i = this.arrayContactosSegmented.length - 1; i >= 0; i--) {
                  if (this.arrayContactosSegmented[i]['StateSelect'] === true) {
                    this.arrayContactosSegmented.splice(i, 1); // Elimina el elemento
                  }
                }
                console.log(this.arrayContactosSegmented)


                for (let i = 0; i < this.arrayContactosCache.length && i <= 1700; i++) {
                  this.arrayContactos.push(this.arrayContactosCache[i]);
                  //this.arrayContactosSegmented.push(this.arrayContactosCache[i]);
                }
             
                const variableNames = Object.keys(this.arrayContactos);
                const variableNamesArray = variableNames.filter(name => typeof this.arrayContactos[0][name] !== 'object');
    
                for (let i = 0; i < this.descVars.length; i++) {
                  this.arrayVariables.push({ Name: this.descVars[i]['Name'] });
                }
    
                for (let i = 0; i < this.arrayContactos.length; i++) {
                  this.arrayContactos[i]["IndexArray"] = i;
            }
    
              }).then(() => {
                setTimeout(() => {
                  this.menuLength = this.arrayContactosCache.length;
                }, 1000);
              }).catch((err:any) => {
                console.error(err);
              });
  //alert(lat1)
    const maxDistanceMeters = 1000;

  // Validar si los datos están bien
  console.log("Coordenadas del marcador:", lat1, lng1);
      for (let i = 0; i < this.arrayContactosCache2.length; i++) {
                  // this.arrayContactosCache[i]['Km'] = this.calcularDistancia(
                  //   22.314669261048728, -97.8686636897337,
                  //   this.arrayContactosCache[i]['Lat'], this.arrayContactosCache[i]['Lng']
                  // );
 const distancia = await this.getDistanceInMeters(lat1, lng1, this.arrayContactosCache2[i][0]['lat'], this.arrayContactosCache2[i][0]['lng']);

    }
  const contactosEnRango = this.arrayContactosCache2.filter( async (contacto: any) => {
    console.log(contacto[0])
    if (contacto[0].lat != null && contacto[0].lng != null) {
      const distancia = await this.getDistanceInMeters(lat1, lng1, contacto[0].lat, contacto[0].lng);
      console.log(`Distancia con ${contacto[0].lat},${contacto[0].lng}:`, distancia);
      return distancia <= maxDistanceMeters;
    }
    return false;
  });


    // Centrar el mapa en la nueva ubicación
    this.map.setCenter(latLng);  // <--- Esta línea centra el mapa
  console.log(latLng.lat())
  console.log(latLng.lng())
  
  this.currentLat = latLng.lat()
  this.currentLng = latLng.lng()
  geocoder.geocode({ location: latlngDraggable }, (results: any, status: any) => {
    if (status === "OK") {
      if (results[0]) {
       

        this.numero = results[0].address_components[0]['long_name']
            
        if(this.numero === "S/N"){

        }else{
          this.numero = ""
        }

        this.calle = results[0].address_components[1]['long_name']
        this.colonia = results[0].address_components[2]['long_name']
        this.ciudad = results[0].address_components[3]['long_name']
        this.estado = results[0].address_components[4]['long_name']
        this.pais = results[0].address_components[5]['long_name']
        this.codigopostal = results[0].address_components[6]['long_name']
        this.direccion = this.calle + ", " +  this.colonia +", " + this.ciudad
      
        this.mapMarkerDraggable.title = results[0].formatted_address
     //   this.saveLocation()

      } else {
        window.alert("No results found");
      }
    } else {
      window.alert("Geocoder failed due to: " + status);
    }

  });



}); 

  }

  
async openSettings() {
  const radios = [
    0.2, 0.3, 0.4, 0.5,
    1, 2, 3, 4, 5
  ];

  const alert = await this.alertController.create({
    header: 'Selecciona el radio en km',
    inputs: radios.map((value) => ({
      name: `radio${value}`,
      type: 'radio',
      label: `${value} km`,
      value: value,
      checked: this.currentRadio === value
    })),
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Aceptar',
        handler: (value: any) => {
          this.currentRadio = value;
          console.log('Nuevo radio seleccionado:', this.currentRadio);
          this.showMap(this.currentLat, this.currentLng);
          this.ciudad === '' 
          this.calle === '' 
          this.colonia === ''
        }
      }
    ]
  });

  await alert.present();
}


  async showToast(message:string){
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position:'top',
      color:'primary',
      buttons: [
  
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
        //this.router.navigate(['/login'],{ replaceUrl: true });
         toast.dismiss();
            }
        }
      ]
    });
    toast.present();
  }
  onRadioChange(event:any) {
    this.currentRadioPersonas = event.detail.value; 
    console.log('Nuevo radio seleccionado:', this.currentRadioPersonas);
  }
  async saveLocation() {
    if (this.direccion  === "") {
      this.showToast("Debes colocar una ubicación valida.")
      
      return
    }
      this.router.navigate(['/tabs/marketing'], {
        state: { miArray: this.arrayContactosSegmented }
      });

      setTimeout(() => {
        window.location.reload()
      }, 2000);
    
    this.direccion = this.calle + ', ' + this.colonia + ', ' + this.ciudad
    var array = {codigopostal:this.codigopostal,calle:this.calle, colonia:this.colonia, ciudad:this.ciudad, 
      lat:this.currentLat, lng: this.currentLng, direccion:this.direccion}
      console.log(array)
 

    //   header: 'Confirmar la dirección'  ,
    //   message:  this.direccion,
    //   buttons: [
    //     {
    //       text: 'Cancelar',
    //       role: 'cancel',
    //       cssClass: 'secondary',
    //       handler: () => {
    //         console.log('Cancelado');
    //       }
    //     },
    //     {
    //       text: 'Aceptar',
    //       handler: async () => {
    //         const array = {
    //           lat: this.currentLat,
    //           lng: this.currentLng,
    //           direccion: this.calle + ', ' + this.colonia + ', ' + this.codigopostal + ', ' + this.ciudad + ', ' + this.pais,
    //           calle: this.calle,
    //           colonia: this.colonia,
    //           cp:this.codigopostal,
    //           ref: this.referencia,
    //           ciudad:this.ciudad,
    //           pais: this.pais
    //         };
    //         if(this.usuarioLogueado === true){
    //           await this.updateUserLocation();

    //         }else{
    //           await this.updateUserLocationCache();

    //         }

    //         this.router.navigate(['/tabs/marketplace'],{ replaceUrl: true });
    //       }
    //     }
    //   ]
    // });
  
    // await alert.present();
  }
getLocation(){   
   
  var x = document.getElementById("demo");

 
    this.showMap(this.currentLat,this.currentLng)


    const input = document.getElementById("pac-input") as HTMLInputElement;
    const searchBox = new google.maps.places.SearchBox(input);

    this.map.addListener('bouds_changed',() =>{
    searchBox.setBounds(this.map.getBounds());
    });

    var markers = [];
    searchBox.addListener('places_changed',() => {

    var places = searchBox.getPlaces()
    console.log(places)
  
    if(places.length == 0){
      console.log('places not founc')
    return
    } 
    console.log(this.currentLat)
    var bounds = new google.maps.LatLngBounds();
    const geocoder = new google.maps.Geocoder();

    places.forEach((place:any) =>{
      console.log('place')
      console.log(place)
   
    this.currentLat = place.geometry.location.lat();
    this.currentLng = place.geometry.location.lng();
    console.log(this.currentLat)
    console.log(this.currentLng)

    if(place.geometry.viewport){
      bounds.union(place.geometry.viewport);
      
      }else {
      
      bounds.extend(place.geometry.location)
      }
       this.mapMarkerDraggable.setMap(null)

       const latlngDraggable = {
        lat: this.currentLat,
        lng: this.currentLng,
      };
      document.getElementById('pac-input')!.blur()

      geocoder.geocode({ location: latlngDraggable }, (results:any, status:any) => {
        if (status === "OK") {
          if (results[0]) {
            console.log('formated adress')

            this.numero = results[0].address_components[0]['long_name']
                
            if(this.numero === "S/N"){

            }else{
              this.numero = ""
            }
            this.calle = results[0].address_components[1]['long_name']
            this.colonia = results[0].address_components[2]['long_name']
            this.ciudad = results[0].address_components[3]['long_name']
            this.estado = results[0].address_components[4]['long_name']
            this.pais = results[0].address_components[5]['long_name']
            this.codigopostal = results[0].address_components[6]['long_name']
            this.mapMarkerDraggable.title = results[0].formatted_address
            this.direccion = this.calle + ", " +  this.colonia +", " + this.ciudad
        
          } else {
            window.alert("No results found");
          }
        } else {
          window.alert("Geocoder failed due to: " + status);
        }
    
      });
      var iconSize = new google.maps.Size(50, 50); // Cambia 50, 50 al tamaño deseado

      var customIcon = {
        url: this.iconMarker,
        scaledSize: iconSize // Aplica el tamaño deseado
      };
           let position = new google.maps.LatLng(this.currentLat,this.currentLng);
       this.mapMarkerDraggable = new google.maps.Marker({
      position:position,
      latitude:this.currentLat,
      title:place.location,
      longitude: this.currentLng,
      animation: google.maps.Animation.DROP,
      draggable:true,
      icon: iconSize
      });
      google.maps.event.addListener(this.mapMarkerDraggable, 'dragend', (marker : any) =>{
        alert("592")
        var latLng = marker.latLng; 
        //this.markers = []
        console.log('place.location')
        console.log(place.location)
        const latlngDraggable = {
          lat: latLng.lat(),
          lng: latLng.lng(),
        };
        geocoder.geocode({ location: latlngDraggable }, (results:any, status:any) => {
          if (status === "OK") {
            if (results[0]) {
              console.log('formated adress')
  
      
              this.numero = results[0].address_components[0]['long_name']
          
              if(this.numero === "S/N"){

              }else{
                this.numero = ""
              }

              this.calle = results[0].address_components[1]['long_name']
              this.colonia = results[0].address_components[2]['long_name']
              this.ciudad = results[0].address_components[3]['long_name']
              this.estado = results[0].address_components[4]['long_name']
              this.pais = results[0].address_components[5]['long_name']
              this.codigopostal = results[0].address_components[6]['long_name']
              this.mapMarkerDraggable.title = results[0].formatted_address
              this.direccion = this.calle + ", " +  this.colonia +", " + this.ciudad
        
            } else {
              window.alert("No results found");
            }
          } else {
            window.alert("Geocoder failed due to: " + status);
          }
      
        });



      }); 



    //  markers[0].setMap(this.map)
    this.mapMarkerDraggable.setMap(this.map)

      this.map.fitBounds(bounds)


    if (!places.geometry) {
      console.log("Returned place contains no geometry");
      return;
    }

    })


  
    })





  }
 toRadian(grados:any) {
    return grados * Math.PI / 180;
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

}
