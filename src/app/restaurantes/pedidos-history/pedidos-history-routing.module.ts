import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidosHistoryPage } from './pedidos-history.page';

const routes: Routes = [
  {
    path: '',
    component: PedidosHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidosHistoryPageRoutingModule {}
