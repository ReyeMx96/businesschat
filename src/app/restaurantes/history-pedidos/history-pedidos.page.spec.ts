import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryPedidosPage } from './history-pedidos.page';

describe('HistoryPedidosPage', () => {
  let component: HistoryPedidosPage;
  let fixture: ComponentFixture<HistoryPedidosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryPedidosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
