import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CodigosPostalesPageRoutingModule } from './codigos-postales-routing.module';

import { CodigosPostalesPage } from './codigos-postales.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CodigosPostalesPageRoutingModule
  ],
  declarations: [CodigosPostalesPage]
})
export class CodigosPostalesPageModule {}
