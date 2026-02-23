import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfigAnswerPage } from './config-answer.page';

const routes: Routes = [
  {
    path: '',
    component: ConfigAnswerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigAnswerPageRoutingModule {}
