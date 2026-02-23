import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestaurantProductsPage } from './restaurant-products.page';

const routes: Routes = [
  {
    path: '',
    component: RestaurantProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantProductsPageRoutingModule {}
