import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComoFuncionaPage } from './como-funciona.page';

const routes: Routes = [
  {
    path: '',
    component: ComoFuncionaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComoFuncionaPageRoutingModule {}
