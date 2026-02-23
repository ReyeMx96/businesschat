import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationConfirmDataPage } from './location-confirm-data.page';

const routes: Routes = [
  {
    path: '',
    component: LocationConfirmDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationConfirmDataPageRoutingModule {}
