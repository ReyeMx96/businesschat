import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComandaPageRoutingModule } from './comanda-routing.module';

import { ComandaPage } from './comanda.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComandaPageRoutingModule
  ],
  declarations: [ComandaPage],
  exports: [ComandaPage]
})
export class ComandaPageModule {}
