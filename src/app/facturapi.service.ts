import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FacturapiService {

  private API = 'https://us-central1-the-business-chat.cloudfunctions.net/mercadoLibreWebhookk';

  constructor(private http: HttpClient) {}

  crearCliente(data: any) {
    return this.http.post(`${this.API}/cliente`, data);
  }

  crearProducto(data: any) {
    return this.http.post(`${this.API}/producto`, data);
  }

  crearFactura(data: any) {
    return this.http.post(`${this.API}/factura`, data);
  }

  listarFacturas() {
    return this.http.get(`${this.API}/facturas`);
  }

obtenerPDF(id: string) {
  return this.http.get<any>(`${this.API}/factura/${id}/pdf`);
}

obtenerXML(id: string) {
  return this.http.get<any>(`${this.API}/factura/${id}/xml`);
}


  cancelarFactura(id: string) {
    return this.http.post(`${this.API}/factura/${id}/cancelar`, {});
  }
}