import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoryPedidosPageRoutingModule } from './history-pedidos-routing.module';

import { HistoryPedidosPage } from './history-pedidos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoryPedidosPageRoutingModule
  ],
  declarations: [HistoryPedidosPage]
})
export class HistoryPedidosPageModule {}
