import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckPaypalPage } from './check-paypal.page';

describe('CheckPaypalPage', () => {
  let component: CheckPaypalPage;
  let fixture: ComponentFixture<CheckPaypalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckPaypalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
