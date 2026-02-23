import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatusPedidoPage } from './status-pedido.page';

const routes: Routes = [
  {
    path: '',
    component: StatusPedidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatusPedidoPageRoutingModule {}
