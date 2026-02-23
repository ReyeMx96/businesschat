import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddAddonsPage } from './add-addons.page';

describe('AddAddonsPage', () => {
  let component: AddAddonsPage;
  let fixture: ComponentFixture<AddAddonsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAddonsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
