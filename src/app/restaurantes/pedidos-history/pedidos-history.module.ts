import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidosHistoryPageRoutingModule } from './pedidos-history-routing.module';

import { PedidosHistoryPage } from './pedidos-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidosHistoryPageRoutingModule
  ],
  declarations: [PedidosHistoryPage]
})
export class PedidosHistoryPageModule {}
