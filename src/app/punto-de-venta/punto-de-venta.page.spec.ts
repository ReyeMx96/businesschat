import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PuntoDeVentaPage } from './punto-de-venta.page';

describe('PuntoDeVentaPage', () => {
  let component: PuntoDeVentaPage;
  let fixture: ComponentFixture<PuntoDeVentaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PuntoDeVentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
