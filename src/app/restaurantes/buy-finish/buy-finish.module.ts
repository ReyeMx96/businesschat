import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BuyFinishPageRoutingModule } from './buy-finish-routing.module';

import { BuyFinishPage } from './buy-finish.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BuyFinishPageRoutingModule
  ],
  declarations: [BuyFinishPage]
})
export class BuyFinishPageModule {}
