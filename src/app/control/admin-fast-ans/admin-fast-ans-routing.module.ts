import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminFastAnsPage } from './admin-fast-ans.page';

const routes: Routes = [
  {
    path: '',
    component: AdminFastAnsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminFastAnsPageRoutingModule {}
