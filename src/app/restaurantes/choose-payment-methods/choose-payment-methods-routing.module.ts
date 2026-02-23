import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChoosePaymentMethodsPage } from './choose-payment-methods.page';

const routes: Routes = [
  {
    path: '',
    component: ChoosePaymentMethodsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChoosePaymentMethodsPageRoutingModule {}
