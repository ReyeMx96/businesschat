import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationTypePage } from './location-type.page';

const routes: Routes = [
  {
    path: '',
    component: LocationTypePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationTypePageRoutingModule {}
