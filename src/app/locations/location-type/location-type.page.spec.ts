import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationTypePage } from './location-type.page';

describe('LocationTypePage', () => {
  let component: LocationTypePage;
  let fixture: ComponentFixture<LocationTypePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationTypePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
