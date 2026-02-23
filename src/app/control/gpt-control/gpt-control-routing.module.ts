import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GptControlPage } from './gpt-control.page';

const routes: Routes = [
  {
    path: '',
    component: GptControlPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GptControlPageRoutingModule {}
