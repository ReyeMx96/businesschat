import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitarRepaPage } from './solicitar-repa.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitarRepaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitarRepaPageRoutingModule {}
