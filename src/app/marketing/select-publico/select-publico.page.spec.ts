import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectPublicoPage } from './select-publico.page';

describe('SelectPublicoPage', () => {
  let component: SelectPublicoPage;
  let fixture: ComponentFixture<SelectPublicoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPublicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
