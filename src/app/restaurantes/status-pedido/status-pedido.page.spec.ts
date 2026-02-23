import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusPedidoPage } from './status-pedido.page';

describe('StatusPedidoPage', () => {
  let component: StatusPedidoPage;
  let fixture: ComponentFixture<StatusPedidoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusPedidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
