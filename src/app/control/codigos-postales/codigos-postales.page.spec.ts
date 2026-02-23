import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CodigosPostalesPage } from './codigos-postales.page';

describe('CodigosPostalesPage', () => {
  let component: CodigosPostalesPage;
  let fixture: ComponentFixture<CodigosPostalesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CodigosPostalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
