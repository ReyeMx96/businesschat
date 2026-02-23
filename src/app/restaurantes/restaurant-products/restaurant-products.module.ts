import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestaurantProductsPageRoutingModule } from './restaurant-products-routing.module';

import { RestaurantProductsPage } from './restaurant-products.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RestaurantProductsPageRoutingModule
  ],
  declarations: [RestaurantProductsPage]
})
export class RestaurantProductsPageModule {}
