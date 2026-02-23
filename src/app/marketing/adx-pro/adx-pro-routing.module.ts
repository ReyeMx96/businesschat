import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdxProPage } from './adx-pro.page';

const routes: Routes = [
  {
    path: '',
    component: AdxProPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdxProPageRoutingModule {}
