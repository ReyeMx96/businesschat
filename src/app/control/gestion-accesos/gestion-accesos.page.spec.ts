import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionAccesosPage } from './gestion-accesos.page';

describe('GestionAccesosPage', () => {
  let component: GestionAccesosPage;
  let fixture: ComponentFixture<GestionAccesosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionAccesosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
