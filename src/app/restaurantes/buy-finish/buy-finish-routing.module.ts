import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuyFinishPage } from './buy-finish.page';

const routes: Routes = [
  {
    path: '',
    component: BuyFinishPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuyFinishPageRoutingModule {}
