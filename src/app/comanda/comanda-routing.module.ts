import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComandaPage } from './comanda.page';

const routes: Routes = [
  {
    path: '',
    component: ComandaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComandaPageRoutingModule {}
