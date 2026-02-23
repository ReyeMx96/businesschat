import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PuntoDeVentaPageRoutingModule } from './punto-de-venta-routing.module';

import { PuntoDeVentaPage } from './punto-de-venta.page';
import { ComandaPage } from '../comanda/comanda.page';
import { ComandaPageModule } from '../comanda/comanda.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    PuntoDeVentaPageRoutingModule
  ],
  declarations: [PuntoDeVentaPage]
})
export class PuntoDeVentaPageModule {

}
