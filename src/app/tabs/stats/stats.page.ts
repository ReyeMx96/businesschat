import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import * as firebase from 'firebase/app';
import { Chart, registerables } from 'chart.js';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { get, getDatabase, ref } from 'firebase/database';
import { collection, getFirestore, onSnapshot } from 'firebase/firestore';
import { AlertController, ModalController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx'; // Importa la biblioteca
import { ModalAddComponent } from 'src/app/modals/modal-add/modal-add.component';

Chart.register(...registerables);
@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit {
productos: any[] = []; 
  finalizadoCount = 0 
  // Declarar variables para guardar las instancias de los gráficos
  salesChart: any;
  salesChart2:any
  currentRestaurantes = ""
  usersChart: any;
  ordersChart: any;
  pendienteCount = 0
rol = ""
inactiveCount = 0
activeCount = 0
private activatedRoute = inject(ActivatedRoute);

totalVentas = 0
pedidos: any = []
arraySelectedsRestaurantes : any = []
  revenueChart: any;
  currentBusiness = ""
  openCount = 0
  pedidosCount = 0
  allSelectedRest = ""
  fechainit = ""
  fechalast:any
  canceladosCount = 0
  enCaminoCount = 0
  constructor(private modal : ModalController, private alertController: AlertController) { }
private getVentasUltimos7Dias(pedidos: any[]) {
  const hoy = new Date();
  hoy.setHours(23, 59, 59, 999);

  const hace7Dias = new Date(hoy);
  hace7Dias.setDate(hoy.getDate() - 6);
  hace7Dias.setHours(0, 0, 0, 0);

  // 👉 inicializar mapa de fechas
  const ventasPorDia: Record<string, number> = {};

  for (let i = 0; i < 7; i++) {
    const d = new Date(hace7Dias);
    d.setDate(hace7Dias.getDate() + i);
    const key = d.toISOString().split('T')[0];
    ventasPorDia[key] = 0;
  }

  // 👉 acumular ventas
  pedidos.forEach(pedido => {
    if (!pedido.tst || pedido.status === 'Cancelado') return;

    const fecha = pedido.tst.toDate();
    if (fecha < hace7Dias || fecha > hoy) return;

    const key = fecha.toISOString().split('T')[0];
    ventasPorDia[key] += pedido.total || 0;
  });

  // 👉 construir arrays para Chart.js
  const labels: string[] = [];
  const data: number[] = [];

  Object.keys(ventasPorDia).sort().forEach(key => {
    const [y, m, d] = key.split('-');
    labels.push(`${d}/${m}`);
    data.push(ventasPorDia[key]);
  });

  return { labels, data };
}

  ngOnInit() {
    this.currentBusiness = this.activatedRoute.snapshot.paramMap.get('id') as string;
    //this.loadCharts();
    if(this.currentBusiness === "all"){
    this.mostrarAlertaConPIN()

    }else {
        
                     this.obtenerPedidosDelDia()
                 this.obtenerPedidosDelDia2()
    }
  }

   async mostrarAlertaConPIN() {
    const alert = await this.alertController.create({
      header: 'Verificación',
      message: 'Ingresa el PIN para continuar',
      backdropDismiss: false, // 👈 impide cerrar al tocar fuera
      inputs: [
        {
          name: 'pin',
          type: 'password',
          placeholder: 'PIN',
          attributes: {
            inputmode: 'numeric',
            maxlength: 4,
          },
        },
      ],
      buttons: [
        {
          text: 'Validar',
          handler: (data:any) => {
            const pinIngresado = data.pin;
            const pinCorrecto = '1221';
            const pinCorrecto2 = '2030';

            if (pinIngresado === pinCorrecto || pinIngresado === pinCorrecto2) {
              console.log('✅ PIN correcto, continuar...');
              
                     this.obtenerPedidosDelDia()
                 this.obtenerPedidosDelDia2()
              return true; // se cierra
            } else {
              // ❌ PIN incorrecto, no cerrar
              this.mostrarErrorPIN();
              return false; // 👈 evita que se cierre
            }
          },
        },
           {
          text: 'Cerrar',
          handler: (data:any) => {
            this.alertController.dismiss()
          },
        },
      ],
    });

    await alert.present();
  }

  async mostrarErrorPIN() {
    const error = await this.alertController.create({
      header: 'Error',
      message: 'PIN incorrecto. Intenta de nuevo.',
      buttons: ['OK'],
    });
    await error.present();
  }
fechaMasAntigua:any
fechaMasReciente:any
private formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

 async obtenerPedidosDelDia() {
  try {
    const firestore = getFirestore();
    const restaurantOrderRef = collection(
      firestore,
      `pedidos/${this.currentBusiness}/today`
    );

    onSnapshot(
      restaurantOrderRef,
      (snapshot) => {
        const pedidos: any[] = [];
        let canceladosCount = 0;
        let enCaminoCount = 0;
        let finalizadoCount = 0;
        let pendienteCount = 0;
        let totalVentas = 0;

        let fechaMasAntigua: Date | null = null;
        let fechaMasReciente: Date | null = null;

        snapshot.forEach((doc) => {
          const data = doc.data();

          pedidos.push({
            id: doc.id,
            ...data,
          });

          totalVentas += data['total'] || 0;

          // Estados
          if (
            data['status'] === 'Nuevo' ||
            data['status'] === 'En preparacion' ||
            data['status'] === 'Aceptado' ||
            data['status'] === 'Listo para recoger' ||
            data['status'] === 'Pendiente'
          ) {
            pendienteCount++;
          }

          if (data['status'] === 'En camino') enCaminoCount++;
          if (data['status'] === 'Entregado') finalizadoCount++;
          if (data['status'] === 'Cancelado') canceladosCount++;

          // 🔥 NUEVO: fechas por Timestamp
          if (data['tst']) {
            const fechaPedido = data['tst'].toDate();

            if (!fechaMasAntigua || fechaPedido < fechaMasAntigua) {
              fechaMasAntigua = fechaPedido;
            }

            if (!fechaMasReciente || fechaPedido > fechaMasReciente) {
              fechaMasReciente = fechaPedido;
            }
          }
        });

        // Asignaciones existentes
        this.pedidosCount = pedidos.length;
        this.canceladosCount = canceladosCount;
        this.finalizadoCount = finalizadoCount;
        this.enCaminoCount = enCaminoCount;
        this.pendienteCount = pendienteCount;
        this.totalVentas = totalVentas;
        this.pedidos = pedidos;

        // ✅ NUEVOS DATOS
        this.fechaMasAntigua = fechaMasAntigua;
        this.fechaMasReciente = fechaMasReciente;
        if (fechaMasAntigua) {
          this.fechainit = this.formatDateForInput(fechaMasAntigua);
        }

        if (fechaMasReciente) {
          this.fechalast = this.formatDateForInput(fechaMasReciente);
        }
      
        console.log('📅 Fecha más antigua:', fechaMasAntigua);
        console.log('📅 Fecha más reciente:', fechaMasReciente);

        this.updateChartData();
      },
      (error) => {
        console.error(
          'Error al obtener los pedidos del día en tiempo real:',
          error
        );
      }
    );
  } catch (error) {
    console.error(
      'Error al establecer el listener de pedidos del día:',
      error
    );
  }
}

  async obtenerPedidosDelDia2() {
    try {
      const firestore = getFirestore();
      const restaurantOrderRef = collection(firestore, `pedidos/${this.currentBusiness}/today`);

      onSnapshot(
        restaurantOrderRef,
        (snapshot) => {
          const pedidos: any[] = [];
          let canceladosCount = 0;
          let enCaminoCount = 0;
          let finalizadoCount = 0;
          let pendienteCount = 0;
          let totalVentas = 0;

          snapshot.forEach((doc) => {
            const data = doc.data();
            pedidos.push({
              id: doc.id,
              ...data,
            });

            totalVentas += data['total'] || 0;

            // Contar el pedido según su estado
            if (data['status'] === 'Nuevo') pendienteCount++;
            if (data['status'] === 'En preparacion') pendienteCount++;
            if (data['status'] === 'Aceptado') pendienteCount++;
            if (data['status'] === 'Listo para recoger') pendienteCount++;
            if (data['status'] === 'En camino') enCaminoCount++;
            if (data['status'] === 'Entregado') finalizadoCount++;
            if (data['status'] === 'Pendiente') pendienteCount++;
            if (data['status'] === 'Cancelado') canceladosCount++;

            // Procesar los productos de cada pedido
            if (data['items'] && data['items'].length > 0) {
              data['items'].forEach((item: any) => {
                const existingProduct = this.productos.find(p => p.nombre === item.name);
                if (existingProduct) {
                  existingProduct.ventas += item.quantity; // Sumar la cantidad de ventas
                  existingProduct.ganancias += item.quantity * item.price; // Calcular las ganancias
                } else {
                  this.productos.push({
                    nombre: item.name,
                    ventas: item.quantity,
                    negocio: data['nameRest'],
                    key: data['idBs'],
                    ganancias: item.quantity * item.price,
                    fecha: new Date(data['fecha']) // Puedes ajustar el formato de fecha si es necesario
                  });
                }
              });
            }
          });
  // Ordenar los productos de mayor a menor por el campo `ganancias`
  this.productos.sort((a, b) => b.ganancias - a.ganancias);

          // Actualizar los datos del componente con las estadísticas de pedidos
          this.pedidosCount = pedidos.length;
          this.canceladosCount = canceladosCount;
          this.finalizadoCount = finalizadoCount;
          this.enCaminoCount = enCaminoCount;
          this.pendienteCount = pendienteCount;
          this.totalVentas = totalVentas;

          console.log('Pedidos del día actualizados:', pedidos);
        },
        (error:any) => {
          console.error('Error al obtener los pedidos del día en tiempo real:', error);
        }
      );
    } catch (error) {
      console.error('Error al establecer el listener de pedidos del día:', error);
    }
  }
 updateChartData() {
  const ventasSemana = this.getVentasUltimos7Dias(this.pedidos);

  const usersData = [this.pedidosCount];
  const ordersData = [
    this.pendienteCount,
    this.enCaminoCount,
    this.finalizadoCount,
    this.canceladosCount,
  ];

  this.loadCharts(
    ventasSemana.data,
    usersData,
    ordersData,
    ventasSemana.labels
  );
}

  parseFechaPersonalizada(fecha: string): Date {
    const meses = {
        enero: 0,
        febrero: 1,
        marzo: 2,
        abril: 3,
        mayo: 4,
        junio: 5,
        julio: 6,
        agosto: 7,
        septiembre: 8,
        octubre: 9,
        noviembre: 10,
        diciembre: 11,
    };

    const [dia, mes, anio] = fecha.split(" "); // Removemos la parte de hora y minuto

    const mesIndex = meses[mes.toLowerCase() as keyof typeof meses];
    if (mesIndex === undefined) {
        throw new Error(`Mes inválido: ${mes}`);
    }

    return new Date(
        parseInt(anio, 10), // Año
        mesIndex,           // Mes (en índice)
        parseInt(dia, 10),  // Día
        0,                  // Hora fija en 0
        0                   // Minuto fijo en 0
    );
}

exportarPedidosAExcelFiltro(pedidos: any[]) {
  console.log(pedidos)
  const fechaInicioInput = this.fechainit + 'T00:00:00';
  const fechaInicio = new Date(fechaInicioInput);
  fechaInicio.setHours(0, 0, 0, 0);

  const fechaInicioInput2 = this.fechalast + 'T00:00:00';
  const fechaFin = new Date(fechaInicioInput2);
  fechaFin.setHours(0, 0, 0, 0);

  console.log('Fecha Inicio:', fechaInicio);
  console.log('Fecha Fin:', fechaFin);

  // 👉 obtener solo las keys seleccionadas
  const selectedKeys = this.arraySelectedsRestaurantes.map((rest:any) => rest.key);
  console.log('Restaurantes seleccionados (keys):', selectedKeys);

  // 👉 Filtrar pedidos por restaurante seleccionado y por rango de fechas
  const pedidosFiltrados = pedidos.filter((pedido) => {
    const fechaPedido = this.parseFechaPersonalizada(pedido.fecha);
    const coincideKey = selectedKeys.includes(pedido.idBs); // Coincidencia por key
    const enRangoFecha = fechaPedido >= fechaInicio && fechaPedido <= fechaFin;

    console.log(`Pedido ${pedido.idn} - Key: ${pedido.idBs} - Fecha: ${fechaPedido}`);
    console.log('Coincide key:', coincideKey, 'En rango:', enRangoFecha);

    return coincideKey && enRangoFecha;
  });

  // 👉 Ordenar por ID
  const pedidosOrdenados = pedidosFiltrados.sort((a, b) => {
    const idA = Number(a.idn || 0);
    const idB = Number(b.idn || 0);
    return idA - idB;
  });

  // 👉 Mapear para exportar
  const datosParaExportar = pedidosOrdenados.map((pedido) => ({
    ID_ORDEN: pedido.idn || 'Sin ID',
    CLIENTE: pedido.cliente || 'Desconocido',
    DIRECCION: pedido.direccion || 'Sin dirección',
    COMERCIO: pedido.nameRest || 'Sin nombre',
    REPARTIDOR: pedido.RepaName || 'Sin repartidor',
    CARRITO: pedido.total || 0,
    "Costo de envio": pedido.envio || 'Sin repartidor',
    "Tarifa de servicio": +pedido.tfs || 0,
    'Total': (Number(pedido.tfs) || 0) + (Number(pedido.envio) || 0) + (Number(pedido.total) || 0),
    'Metodo de Pago': pedido.typePay || 'Sin tipo de pago',
    PLAN: pedido.plan || 'Sin plan',
    COMISION: pedido.comision || 10,
    'ADICIONAL X PEDIDO': pedido.adicional || 0,
    'TOTAL COMISION': +pedido.tfs || 0,
    'GANANCIA NEGOCIO': pedido.gananciaNegocio || 0,
    FECHA: pedido.fecha || 'Sin fecha',
    ESTADO: pedido.status || 'Sin estado',
  }));

  // 👉 Crear hoja de cálculo
  const hojaDeCalculo = XLSX.utils.json_to_sheet(datosParaExportar);

  // 👉 Crear libro de Excel
  const libroDeExcel = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libroDeExcel, hojaDeCalculo, 'Pedidos del Día');

  // 👉 Exportar archivo
  const nombreArchivo = `Pedidos_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(libroDeExcel, nombreArchivo);

  console.log('Archivo Excel generado:', nombreArchivo);
}


checkExportar(pedidos: any[]){
  if(this.arraySelectedsRestaurantes.length === 0){
    this.exportarPedidosAExcel(pedidos)
  }else{
    this.exportarPedidosAExcelFiltro(pedidos)
  }
}
exportarPedidosAExcel(pedidos: any[]) {
  console.log(this.fechainit)
    // Normalizar fechas de inicio y fin a las 00:00
    const fechaInicioInput = this.fechainit + 'T00:00:00';
    const fechaInicio = new Date(fechaInicioInput);
    fechaInicio.setHours(0, 0, 0, 0);

    const fechaInicioInput2 = this.fechalast + 'T00:00:00';
    const fechaFin = new Date(fechaInicioInput2);
    fechaFin.setHours(0, 0, 0, 0);

    console.log('Fecha Inicio:', fechaInicio);
    console.log('Fecha Fin:', fechaFin);

    // Filtrar pedidos dentro del rango de fechas
    const pedidosFiltrados = pedidos.filter((pedido) => {
        console.log('Fecha Pedido Original:', pedido.fecha);
        const fechaPedido = this.parseFechaPersonalizada(pedido.fecha); // Convertir la fecha personalizada
        console.log('Fecha Pedido Normalizada:', fechaPedido);
        return fechaPedido >= fechaInicio && fechaPedido <= fechaFin;
    });

    // Ordenar los pedidos por ID en orden ascendente (antiguos primero)
    const pedidosOrdenados = pedidosFiltrados.sort((a, b) => {
        const idA = Number(a.idn || 0);
        const idB = Number(b.idn || 0);
        return idA - idB; // Orden ascendente
    });

    const datosParaExportar = pedidosOrdenados.map((pedido) => ({
        ID_ORDEN: pedido.idn || 'Sin ID',
        CLIENTE: pedido.cliente || 'Desconocido',
        DIRECCION: pedido.direccion || 'Sin dirección',
        COMERCIO: pedido.nameRest || 'Sin nombre',
        REPARTIDOR: pedido.RepaName || 'Sin repartidor',
        CARRITO: pedido.total || 0,
        "Costo de envio": pedido.envio || 'Sin repartidor',
        "Tarifa de servicio": +pedido.tfs || 0,
        'Total': (Number(pedido.tfs) || 0) + (Number(pedido.envio) || 0) + (Number(pedido.total) || 0),
        'Metodo de Pago': pedido.typePay || 'Sin tipo de pago',
        PLAN: pedido.plan || 'Sin plan',
        COMISION: pedido.comision || 10,
        'ADICIONAL X PEDIDO': pedido.adicional || 0,
        'TOTAL COMISION': +pedido.tfs || 0,
        'GANANCIA NEGOCIO': pedido.gananciaNegocio || 0,
        FECHA: pedido.fecha || 'Sin fecha',
        ESTADO: pedido.status || 'Sin estado',
    }));

    // Crear hoja de cálculo
    const hojaDeCalculo = XLSX.utils.json_to_sheet(datosParaExportar);

    // Crear libro de Excel
    const libroDeExcel = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libroDeExcel, hojaDeCalculo, 'Pedidos del Día');

    // Exportar el archivo
    const nombreArchivo = `Pedidos_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(libroDeExcel, nombreArchivo);

    console.log('Archivo Excel generado:', nombreArchivo);
}


  async openRepartidoresModal() {
   
    const modal = await this.modal.create({
      component: ModalAddComponent,
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        this.arraySelectedsRestaurantes = result.data; // Capture the selected repartidor
        console.log(result.data)

        for(var i = 0 ; i < this.arraySelectedsRestaurantes.length; i ++){
          this.allSelectedRest = this.allSelectedRest  +  this.arraySelectedsRestaurantes[i]['nombreRest'] + ", "
        }
      }
    });

    await modal.present(); // Present the modal
  }
  
  // Método para destruir los gráficos cuando el componente se cierra o se recrea
  ngOnDestroy() {
    this.destroyCharts();
  }

  // Método para destruir los gráficos si ya están en uso
  destroyCharts() {
    if (this.salesChart) {
      this.salesChart.destroy();
    }
      if (this.salesChart2) {
      this.salesChart2.destroy();
    }
    if (this.usersChart) {
      this.usersChart.destroy();
    }
    if (this.ordersChart) {
      this.ordersChart.destroy();
    }
    if (this.revenueChart) {
      this.revenueChart.destroy();
    }
  }
loadCharts(
  salesData: number[],
  usersData: number[],
  ordersData: number[],
  labels: string[]
) {

    // Asegurarse de destruir los gráficos antes de recrearlos
    this.destroyCharts();
    console.log(salesData)
    // Sales Chart
   this.salesChart = new Chart('salesChart', {
  type: 'line',
  data: {
    labels: labels,
    datasets: [
      {
        label: 'Ultimos 7 dias',
        data: salesData, // ← aquí puede venir tu array real
        borderColor: '#17a76b',
        backgroundColor: 'rgba(99, 241, 170, 0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 3
      },
  
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          usePointStyle: true,
          boxWidth: 6
        }
      }
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        grid: {
          color: 'rgba(0,0,0,0.05)'
        },
        ticks: {
          callback: value => `$${value}`
        }
      }
    }
  }
});
}
  
}

//   phoneNumberAdmin :any
//   randomcolors = ['#8f0316','#028a3f'];
//   totalPagoComision = 0
//   arrayVentas: any = []
//   arrayIntervencion: any = []
//   arrayNumbers:any
//   graph: any = [
//   ]
//   totalVentas = 0
//   uid:any
//   phid:any
//   chartcornerssimulacion: any;
//   AccWppId:any
//   handicapLabel : any = [];
  
//   @ViewChild('canvascornerssimulacion') canvascornerssimulacion!: ElementRef<HTMLCanvasElement>;

//   interactions = 0
//   arrayCmpgs : any = []
//   tkUser:any
//   totalMkt:any
//   totalMktReal:any
//   ph:any
//   constructor() {
//     Chart.register(...registerables);
//     const handle2 = setInterval(() => {

//       //    this.chartcornerssimulacion.destroy();

//       this.graficaSimulaciones()

//       clearInterval(handle2)

//     }, 2500);
//    }

//   ngOnInit() {
// const auth = getAuth();
// const db = getDatabase();
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     const uid = user.uid;
//     this.uid = uid;

//     const userRef = ref(db, `UsersBusinessChat/${uid}`);
//     get(userRef).then(snapshot => {
//       const res = snapshot.val();
//       console.log(res);

//       const array = [];
//       for (const i in res['Auth']) {
//         array.push(res['Auth'][i]);
//       }
//       this.arrayNumbers = array;
//       this.ph = res['SelectedPh'];
//       this.phoneNumberAdmin = res['SelectedPh'].toString();

//       // Get Panel data
//       const panelRef = ref(db, `ruta/${this.phoneNumberAdmin}/PanelRespaldo`);
//       get(panelRef).then(snapshot => {
//         const res = snapshot.val();
//         console.log(res);

//         const array = [];
//         for (const i in res) {
//           array.push(res[i]);
//         }
//         this.arrayVentas = array;
// console.log(this.arrayVentas)
//         this.totalVentas = 0;
//         for (let i = 0; i < this.arrayVentas.length; i++) {
//           if (this.arrayVentas[i]["Precio"]) {
//             this.totalVentas += +this.arrayVentas[i]["Precio"];
//           } else {
//             console.log(this.arrayVentas[i]);
//             console.log([i]);
//           }
//         }

//         const numero = this.totalVentas;
//         const redondeado = Math.round(numero * 100) / 100;
//         this.totalVentas = redondeado;
//         console.log(this.totalVentas)
//         this.totalPagoComision = this.arrayVentas.length * 10;
//       });

//       // Get Cmpgs data
//       const cmpgsRef = ref(db, `ruta/Cmpgs/${this.phoneNumberAdmin}`);
//       get(cmpgsRef).then(snapshot => {
//         const res = snapshot.val();
//         console.log(res);

//         const array = [];
//         for (const i in res) {
//           array.push(res[i]);
//         }
//         this.arrayCmpgs = array;

//         this.totalMkt = 0;
//         this.totalMktReal = 0;
//         for (let i = 0; i < this.arrayCmpgs.length; i++) {
//           const arrayr = Object.values(this.arrayCmpgs[i]);
//           if(arrayr.length > 50000){

//           }else{
//           this.totalMkt += arrayr.length;
//           this.totalMktReal += arrayr.length;

//           }
//           console.log(arrayr.length)
//         }
        
//         const redondeado = Math.round(this.totalMkt * 40 * 100) / 100;
//         this.totalMkt = redondeado;

//       });

//       // Get Intervencion data
//       const intervencionRef = ref(db, `ruta/Intervencion/${this.phoneNumberAdmin}`);
//       get(intervencionRef).then(snapshot => {
//         const res = snapshot.val();
//         console.log(res);

//         const array = [];
//         for (const i in res) {
//           array.push(res[i]);
//         }
//         this.arrayIntervencion = array;
//         this.interactions = this.arrayIntervencion.length;
//       });

//       document.getElementById('updateComponent')!.click();

//       console.log(this.arrayNumbers);
//       for (let i = 0; i < this.arrayNumbers.length; i++) {
//         if (this.ph === this.arrayNumbers[i]['Ph']) {
//           this.phid = this.arrayNumbers[i]['PhId'];
//           this.tkUser = this.arrayNumbers[i]['Tk'];
//           this.AccWppId = this.arrayNumbers[i]['AccWppId'];
//         }
//       }

//     });

//   } else {
//     // User is signed out
//     // ...
//   }
// });

//   }

//   // URL de tu app de Meta
//   private appId = '745989908217945';
//   private redirectUri = 'https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk/callback'; // donde recibirás el token
//   private scope = 'whatsapp_business_management,business_management';

//   authorizeWhatsApp() {
//     const oauthUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${this.appId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&scope=${this.scope}&response_type=code`;

//     // Abrir pop-up
//     const width = 500;
//     const height = 700;
//     const left = (window.screen.width / 2) - (width / 2);
//     const top = (window.screen.height / 2) - (height / 2);
//     window.open(oauthUrl, 'WhatsApp OAuth', `width=${width},height=${height},top=${top},left=${left}`);
//   }

//   graficaSimulaciones() {
//     this.handicapLabel = [];
//     this.graph = []; // Asegúrate de vaciar el array antes de comenzar a llenarlo
         
//     for (let i = 0; i < 30; i++) {
//       let date = new Date();
//       date.setDate(date.getDate() - i); // Restar 'i' días de la fecha actual
//       let dateString = date.toISOString().split('T')[0]; // Obtener solo la parte de la fecha en formato YYYY-MM-DD
//       this.handicapLabel.push(dateString); // Agregar la fecha formateada al array
      
//       let precioVenta = 0; // Reiniciar el precioVenta para cada día
  
//       // Recorrer las ventas y sumar los precios que coinciden con la fecha
//       for (let x = 0; x < this.arrayVentas.length; x++) {
//         if (this.arrayVentas[x]['Start'] && this.arrayVentas[x]['Start'].substring(0, 10) === dateString) {
//           precioVenta += +this.arrayVentas[x]['Precio']; // Sumar el precio de la venta
//         }
//       }
  
//       this.graph.push(precioVenta); // Agregar el total del día al array `graph`
//     }
  
//     // Crear el gráfico después de llenar los datos
//     var ctx = this.canvascornerssimulacion.nativeElement.getContext('2d');
//     var gradient = ctx!.createLinearGradient(0, 0, 0, 400);
//     gradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
//     gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
//     this.chartcornerssimulacion = new Chart(this.canvascornerssimulacion.nativeElement, {
//       type: 'line',
//       data: {
//         labels: this.handicapLabel,
//         datasets: [
//           {
//             label: 'Ingreso',
//             backgroundColor: gradient,
//             borderColor: '#fff',
//             pointBackgroundColor: '#fff',
//             pointBorderColor: '#000',
//             pointHoverBackgroundColor: '#000',
//             pointHoverBorderColor: '#fff',
//             data: this.graph,
//             fill: true,
//             tension: 0.4,
//             borderWidth: 2,
//             pointRadius: 5,
//             pointHoverRadius: 7
//           }
//         ]
//       },
//       options: {
//         responsive: true,
//         plugins: {
//           legend: {
//             display: false,
//             labels: {
//               color: '#fff' // Color de las etiquetas de la leyenda
//             }
//           },
//           title: {
//             display: true,
//             text: 'Ventas por día Últimos 7 Días',
//             color: '#fff', // Color del título
//             font: {
//               size: 18
//             }
//           },
//         },
//         scales: {
//           y: {
//             beginAtZero: true,
//             ticks: {
//               color: '#fff' // Color del texto en el eje Y
//             },
//             grid: {
//               color: 'rgba(255, 255, 255, 0.2)' // Color de las líneas de la cuadrícula
//             }
//           },
//           x: {
//             ticks: {
//               color: '#fff' // Color del texto en el eje X
//             },
//             grid: {
//               color: 'rgba(255, 255, 255, 0.2)' // Color de las líneas de la cuadrícula
//             }
//           }
//         }
//       }
//     });
  
//     this.chartcornerssimulacion.update();
//   }
  
  
// }
