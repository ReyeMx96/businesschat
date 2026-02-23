import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidosHistoryPage } from './pedidos-history.page';

describe('PedidosHistoryPage', () => {
  let component: PedidosHistoryPage;
  let fixture: ComponentFixture<PedidosHistoryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
