import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdxProPageRoutingModule } from './adx-pro-routing.module';

import { AdxProPage } from './adx-pro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdxProPageRoutingModule
  ],
  declarations: [AdxProPage]
})
export class AdxProPageModule {}
