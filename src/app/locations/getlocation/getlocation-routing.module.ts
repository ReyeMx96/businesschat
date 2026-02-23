import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GetlocationPage } from './getlocation.page';

const routes: Routes = [
  {
    path: '',
    component: GetlocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GetlocationPageRoutingModule {}
