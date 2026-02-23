import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatalogarPage } from './catalogar.page';

const routes: Routes = [
  {
    path: '',
    component: CatalogarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogarPageRoutingModule {}
