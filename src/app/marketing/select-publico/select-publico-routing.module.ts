import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectPublicoPage } from './select-publico.page';

const routes: Routes = [
  {
    path: '',
    component: SelectPublicoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectPublicoPageRoutingModule {}
