import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdxMediaPage } from './adx-media.page';

describe('AdxMediaPage', () => {
  let component: AdxMediaPage;
  let fixture: ComponentFixture<AdxMediaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdxMediaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
