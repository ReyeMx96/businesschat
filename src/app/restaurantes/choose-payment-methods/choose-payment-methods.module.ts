import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChoosePaymentMethodsPageRoutingModule } from './choose-payment-methods-routing.module';

import { ChoosePaymentMethodsPage } from './choose-payment-methods.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChoosePaymentMethodsPageRoutingModule
  ],
  declarations: [ChoosePaymentMethodsPage]
})
export class ChoosePaymentMethodsPageModule {}
