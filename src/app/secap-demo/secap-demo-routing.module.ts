import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SecapDemoPage } from './secap-demo.page';

const routes: Routes = [
  {
    path: '',
    component: SecapDemoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecapDemoPageRoutingModule {}
