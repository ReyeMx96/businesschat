import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  Timestamp,
  where
} from 'firebase/firestore';
import { filter } from 'rxjs';

@Component({
  selector: 'app-pedidos-history',
  templateUrl: './pedidos-history.page.html',
  styleUrls: ['./pedidos-history.page.scss'],
})
export class PedidosHistoryPage implements OnInit {

  fecha: string = '';
  fechaTimestamp!: Timestamp;

  // 👉 NUEVO: fecha base seleccionada
  fechaSeleccionadaDate!: Date;

  orders = [
    {
      id: '212 482',
      created: '09/22/2023',
      customer: 'Lisa Graham',
      avatar: 'https://i.pravatar.cc/40?img=1',
      fulfillment: 'Unfulfilled',
      total: '$652.34',
      profit: '$178.56',
      status: 'Authorized',
      updated: 'Today'
    }
  ];
  currentRoute: string = '';

  constructor(private router: Router) {
  
  }

  currentBusiness = '';
  pedidos: any[] = [];

  pedidosCount = 0;
  canceladosCount = 0;
  enCaminoCount = 0;
  finalizadoCount = 0;
  pendienteCount = 0;
  totalVentas = 0;

  private activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    this.currentBusiness =
      this.activatedRoute.snapshot.paramMap.get('id') as string;

    // 👉 Fecha inicial = hoy
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    this.setFecha(hoy);
  }

  /* =============================
     OBTENER PEDIDOS POR FECHA
  ============================== */
  async obtenerPedidosDelDia() {
    if (!this.fechaSeleccionadaDate) return;

    const inicio = new Date(this.fechaSeleccionadaDate);
    inicio.setHours(0, 0, 0, 0);

    const fin = new Date(this.fechaSeleccionadaDate);
    fin.setHours(23, 59, 59, 999);

    const inicioTimestamp = Timestamp.fromDate(inicio);
    const finTimestamp = Timestamp.fromDate(fin);

    try {
      const firestore = getFirestore();

      const restaurantOrderRef = collection(
        firestore,
        `pedidos/${this.currentBusiness}/today`
      );

      const q = query(
        restaurantOrderRef,
        where('tst', '>=', inicioTimestamp),
        where('tst', '<=', finTimestamp)
      );

      onSnapshot(
        q,
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

            if (
              data['status'] === 'Nuevo' ||
              data['status'] === 'En preparacion' ||
              data['status'] === 'Aceptado' ||
              data['status'] === 'Listo para recoger' ||
              data['status'] === 'Pendiente'
            ) pendienteCount++;

            if (data['status'] === 'En camino') enCaminoCount++;
            if (data['status'] === 'Entregado') finalizadoCount++;
            if (data['status'] === 'Cancelado') canceladosCount++;
          });

          this.pedidos = pedidos;
          this.pedidosCount = pedidos.length;
          this.canceladosCount = canceladosCount;
          this.finalizadoCount = finalizadoCount;
          this.enCaminoCount = enCaminoCount;
          this.pendienteCount = pendienteCount;
          this.totalVentas = totalVentas;

          console.log('📦 Pedidos:', pedidos);
        },
        (error) => {
          console.error('Error al obtener pedidos:', error);
        }
      );
    } catch (error) {
      console.error('Error general:', error);
    }
  }
  fechaInicioDate!: Date;
fechaFinDate!: Date;
setFechaInicio(event: any) {
  const [y, m, d] = event.target.value.split('-').map(Number);
  this.fechaInicioDate = new Date(y, m - 1, d, 0, 0, 0);
}
goComanda(order: any){
this.router.navigate(['/comanda/' + order.id]);  
}
setFechaFin(event: any) {
  const [y, m, d] = event.target.value.split('-').map(Number);
  this.fechaFinDate = new Date(y, m - 1, d, 23, 59, 59);
}

async obtenerPedidosPorRango() {
  if (!this.fechaInicioDate || !this.fechaFinDate) return;

  const inicio = new Date(this.fechaInicioDate);
  inicio.setHours(0, 0, 0, 0);

  const fin = new Date(this.fechaFinDate);
  fin.setHours(23, 59, 59, 999);

  const inicioTimestamp = Timestamp.fromDate(inicio);
  const finTimestamp = Timestamp.fromDate(fin);

  try {
    const firestore = getFirestore();

    const restaurantOrderRef = collection(
      firestore,
      `pedidos/${this.currentBusiness}/today`
    );

    const q = query(
      restaurantOrderRef,
      where('tst', '>=', inicioTimestamp),
      where('tst', '<=', finTimestamp)
    );

    onSnapshot(q, (snapshot) => {
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

        if (
          data['status'] === 'Nuevo' ||
          data['status'] === 'En preparacion' ||
          data['status'] === 'Aceptado' ||
          data['status'] === 'Listo para recoger' ||
          data['status'] === 'Pendiente'
        ) pendienteCount++;

        if (data['status'] === 'En camino') enCaminoCount++;
        if (data['status'] === 'Entregado') finalizadoCount++;
        if (data['status'] === 'Cancelado') canceladosCount++;
      });

      this.pedidos = pedidos;
      this.pedidosCount = pedidos.length;
      this.canceladosCount = canceladosCount;
      this.finalizadoCount = finalizadoCount;
      this.enCaminoCount = enCaminoCount;
      this.pendienteCount = pendienteCount;
      this.totalVentas = totalVentas;

      console.log('📅📅 Pedidos por rango:', pedidos);
    });
  } catch (error) {
    console.error('Error por rango:', error);
  }
}

  /* =============================
     CALENDARIO NATIVO
  ============================== */
  @ViewChild('dateInput') dateInput!: ElementRef<HTMLInputElement>;

  abrirCalendario() {
    this.dateInput.nativeElement.showPicker
      ? this.dateInput.nativeElement.showPicker()
      : this.dateInput.nativeElement.click();
  }

onFechaSeleccionada(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  if (!value) return;

  const [year, month, day] = value.split('-').map(Number);

  const fechaSeleccionada = new Date(year, month - 1, day, 0, 0, 0);

  this.setFecha(fechaSeleccionada);
}


  /* =============================
     SETEAR FECHA Y RECARGAR
  ============================== */
  setFecha(date: Date) {
    this.fechaSeleccionadaDate = date;

    this.fecha = date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    this.fechaTimestamp = Timestamp.fromDate(date);

    console.log('📅 Fecha UI:', this.fecha);
    console.log('🕒 Timestamp:', this.fechaTimestamp);

    // 🔥 VOLVER A CONSULTAR
    this.obtenerPedidosDelDia();
  }
}
