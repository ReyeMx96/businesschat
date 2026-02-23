import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckPaypalPageRoutingModule } from './check-paypal-routing.module';

import { CheckPaypalPage } from './check-paypal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckPaypalPageRoutingModule
  ],
  declarations: [CheckPaypalPage]
})
export class CheckPaypalPageModule {}
