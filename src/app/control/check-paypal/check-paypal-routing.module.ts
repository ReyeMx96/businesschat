import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckPaypalPage } from './check-paypal.page';

const routes: Routes = [
  {
    path: '',
    component: CheckPaypalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckPaypalPageRoutingModule {}
