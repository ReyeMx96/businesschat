import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientTagsPage } from './client-tags.page';

const routes: Routes = [
  {
    path: '',
    component: ClientTagsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientTagsPageRoutingModule {}
