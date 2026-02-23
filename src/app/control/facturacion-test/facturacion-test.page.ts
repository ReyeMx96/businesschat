// import { Component, OnInit } from '@angular/core';
// import { FacturapiService } from 'src/app/facturapi.service';

// @Component({
//   selector: 'app-facturacion-test',
//   templateUrl: './facturacion-test.page.html',
//   styleUrls: ['./facturacion-test.page.scss'],
// })
// export class FacturacionTestPage implements OnInit {

//   clienteId = '';
//   productoId = '';
//   facturaId = '';

//   constructor(private facturapi: FacturapiService) {}
//   ngOnInit(): void {
//   }

//   crearCliente() {
//     this.facturapi.crearCliente({
//       legal_name: 'Cliente Prueba',
//       tax_id: 'XAXX010101000',
//       tax_system: '601',
//       email: 'test@correo.com'
//     }).subscribe((res: any) => {
//       this.clienteId = res.id;
//       console.log('✅ Cliente creado', res);
//     });
//   }

//   crearProducto() {
//     this.facturapi.crearProducto({
//       description: 'Consumo restaurante',
//       product_key: '01010101',
//       unit_key: 'E48',
//       unit_price: 50000
//     }).subscribe((res: any) => {
//       this.productoId = res.id;
//       console.log('✅ Producto creado', res);
//     });
//   }

//   crearFactura() {
//     this.facturapi.crearFactura({
//     customer: {
//       legal_name: 'Cliente Prueba',
//       tax_id: 'XAXX010101000',
//       tax_system: '616',
//       email: 'test@correo.com'
//     },
//       items: [{
//         product: this.productoId,
//         quantity: 1
//       }],
//       use: 'G03'
//     }).subscribe((res: any) => {
//       this.facturaId = res.id;
//       console.log('✅ Factura creada', res);
//     });
//   }

//   descargarPDF() {
//     this.facturapi.obtenerPDF(this.facturaId).subscribe(blob => {
//       this.descargar(blob, 'factura.pdf');
//     });
//   }

//   descargarXML() {
//     this.facturapi.obtenerXML(this.facturaId).subscribe((blob:any) => {
//       this.descargar(blob, 'factura.xml');
//     });
//   }

//   cancelarFactura() {
//     this.facturapi.cancelarFactura(this.facturaId).subscribe((res:any) => {
//       console.log('🗑️ Factura cancelada', res);
//     });
//   }

//   private descargar(blob: Blob, nombre: string) {
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = nombre;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FacturapiService } from 'src/app/facturapi.service';

@Component({
  selector: 'app-facturacion-test',
  templateUrl: './facturacion-test.page.html',
  styleUrls: ['./facturacion-test.page.scss'],
})
export class FacturacionTestPage implements OnInit {

  // IDs
  clienteId = '69352060d477dac816176fe7';
  productoId = '69352121d477dac8161770d4';
  facturaId = '69352287d477dac816177594';

  // MODELOS DEL FORMULARIO
  cliente = {
    legal_name: 'Michel Alberto Ochoa Santos',
    tax_id: 'OOSM900221URA',
    tax_system: '626',
    email: 'michel8a@hotmail.com',
    address: {
  street: 'Lagartos',
  exterior: '139',
  interior: '', // opcional
  neighborhood: 'NO ESPECIFICADA',
  city: 'Altamira',
  municipality: 'Benito Juárez',
  zip: '89600',
  country: 'MEX',
  state: 'TAMPS'
}
  };


producto = {
  description: 'Servicios de soporte técnico en sistemas',
  product_key: '81112100',
  unit_key: 'E48',
  price: 100 // $100.00 MXN
};

  factura = {
    use: 'G03'
  };

  constructor(private facturapi: FacturapiService) {}

  ngOnInit(): void {}

  // ================= CLIENTE =================
  crearCliente() {
    this.facturapi.crearCliente(this.cliente).subscribe({
      next: (res: any) => {
        this.clienteId = res.id;
        console.log('✅ Cliente creado', res);
        alert('Cliente creado correctamente');
      },
      error: err => {
        console.error(err);
        alert('Error creando cliente');
      }
    });
  }

  // ================= PRODUCTO =================
  crearProducto() {
    this.facturapi.crearProducto(this.producto).subscribe({
      next: (res: any) => {
        this.productoId = res.id;
        console.log('✅ Producto creado', res);
        alert('Producto creado correctamente');
      },
      error: err => {
        console.error(err);
        alert('Error creando producto');
      }
    });
  }

  // ================= FACTURA =================
  crearFactura() {
    if (!this.clienteId || !this.productoId) {
      alert('Primero crea el cliente y el producto');
      return;
    }

    const payload = {
      customer: this.clienteId,
      items: [
        {
          product: this.productoId,
          quantity: 1
        }
      ],
      use: this.factura.use || 'G03',
         // 🔴 CAMPOS QUE FALTABAN
      payment_form: '03',   // Transferencia
      payment_method: 'PUE' // Pago en una sola exhibición
      };

    this.facturapi.crearFactura(payload).subscribe({
      next: (res: any) => {
        this.facturaId = res.id;
        console.log('✅ Factura creada', res);
        alert('Factura LIVE creada correctamente');
      },
      error: err => {
        console.error(err);
        alert('Error creando factura');
      }
    });
  }

  // ================= DESCARGAS =================
  // descargarPDF() {
  //   this.facturapi.obtenerPDF(this.facturaId).subscribe(blob => {
  //     this.descargar(blob, 'factura.pdf');
  //   });
  // }

  // descargarXML() {
  //   this.facturapi.obtenerXML(this.facturaId).subscribe(blob => {
  //     this.descargar(blob, 'factura.xml');
  //   });
  // }
descargarPDF() {
  this.facturapi.obtenerPDF(this.facturaId).subscribe(res => {
    window.open(res.url, '_blank');
  });
}

descargarXML() {
  this.facturapi.obtenerXML(this.facturaId).subscribe(res => {
    window.open(res.url, '_blank');
  });
}

  cancelarFactura() {
    this.facturapi.cancelarFactura(this.facturaId).subscribe(res => {
      console.log('🗑️ Factura cancelada', res);
      alert('Factura cancelada');
    });
  }

  private descargar(blob: Blob, nombre: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
