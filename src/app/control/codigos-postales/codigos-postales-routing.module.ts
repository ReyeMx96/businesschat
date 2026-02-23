import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CodigosPostalesPage } from './codigos-postales.page';

const routes: Routes = [
  {
    path: '',
    component: CodigosPostalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CodigosPostalesPageRoutingModule {}
