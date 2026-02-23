import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionAccesosPage } from './gestion-accesos.page';

const routes: Routes = [
  {
    path: '',
    component: GestionAccesosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionAccesosPageRoutingModule {}
