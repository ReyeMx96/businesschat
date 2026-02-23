import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapaLluviaPage } from './mapa-lluvia.page';

describe('MapaLluviaPage', () => {
  let component: MapaLluviaPage;
  let fixture: ComponentFixture<MapaLluviaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaLluviaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
