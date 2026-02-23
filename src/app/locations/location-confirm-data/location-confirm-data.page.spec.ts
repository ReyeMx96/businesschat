import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationConfirmDataPage } from './location-confirm-data.page';

describe('LocationConfirmDataPage', () => {
  let component: LocationConfirmDataPage;
  let fixture: ComponentFixture<LocationConfirmDataPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationConfirmDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
