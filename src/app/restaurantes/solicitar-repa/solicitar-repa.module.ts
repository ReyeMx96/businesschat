import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitarRepaPageRoutingModule } from './solicitar-repa-routing.module';

import { SolicitarRepaPage } from './solicitar-repa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitarRepaPageRoutingModule
  ],
  declarations: [SolicitarRepaPage]
})
export class SolicitarRepaPageModule {}
