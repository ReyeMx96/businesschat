import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BuyFinishPage } from './buy-finish.page';

describe('BuyFinishPage', () => {
  let component: BuyFinishPage;
  let fixture: ComponentFixture<BuyFinishPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyFinishPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
