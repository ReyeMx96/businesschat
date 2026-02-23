import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoryPedidosPage } from './history-pedidos.page';

const routes: Routes = [
  {
    path: '',
    component: HistoryPedidosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryPedidosPageRoutingModule {}
