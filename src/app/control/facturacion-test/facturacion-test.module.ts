import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FacturacionTestPageRoutingModule } from './facturacion-test-routing.module';

import { FacturacionTestPage } from './facturacion-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacturacionTestPageRoutingModule
  ],
  declarations: [FacturacionTestPage]
})
export class FacturacionTestPageModule {}
