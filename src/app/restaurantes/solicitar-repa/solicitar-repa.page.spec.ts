import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitarRepaPage } from './solicitar-repa.page';

describe('SolicitarRepaPage', () => {
  let component: SolicitarRepaPage;
  let fixture: ComponentFixture<SolicitarRepaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitarRepaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
