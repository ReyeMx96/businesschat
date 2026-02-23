import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChoosePaymentMethodsPage } from './choose-payment-methods.page';

describe('ChoosePaymentMethodsPage', () => {
  let component: ChoosePaymentMethodsPage;
  let fixture: ComponentFixture<ChoosePaymentMethodsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosePaymentMethodsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
