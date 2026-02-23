import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacturacionTestPage } from './facturacion-test.page';

const routes: Routes = [
  {
    path: '',
    component: FacturacionTestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacturacionTestPageRoutingModule {}
