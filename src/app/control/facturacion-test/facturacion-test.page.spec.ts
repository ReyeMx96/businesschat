import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacturacionTestPage } from './facturacion-test.page';

describe('FacturacionTestPage', () => {
  let component: FacturacionTestPage;
  let fixture: ComponentFixture<FacturacionTestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturacionTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
