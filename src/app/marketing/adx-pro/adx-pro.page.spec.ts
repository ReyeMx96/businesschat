import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdxProPage } from './adx-pro.page';

describe('AdxProPage', () => {
  let component: AdxProPage;
  let fixture: ComponentFixture<AdxProPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdxProPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
