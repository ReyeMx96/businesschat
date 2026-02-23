import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestaurantProductsPage } from './restaurant-products.page';

describe('RestaurantProductsPage', () => {
  let component: RestaurantProductsPage;
  let fixture: ComponentFixture<RestaurantProductsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurantProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
