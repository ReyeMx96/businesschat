import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddAddonsPage } from './add-addons.page';

const routes: Routes = [
  {
    path: '',
    component: AddAddonsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddAddonsPageRoutingModule {}
