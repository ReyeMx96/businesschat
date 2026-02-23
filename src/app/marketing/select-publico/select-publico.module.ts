import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectPublicoPageRoutingModule } from './select-publico-routing.module';

import { SelectPublicoPage } from './select-publico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectPublicoPageRoutingModule
  ],
  declarations: [SelectPublicoPage]
})
export class SelectPublicoPageModule {}
