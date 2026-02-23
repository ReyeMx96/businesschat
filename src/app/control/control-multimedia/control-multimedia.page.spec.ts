import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlMultimediaPage } from './control-multimedia.page';

describe('ControlMultimediaPage', () => {
  let component: ControlMultimediaPage;
  let fixture: ComponentFixture<ControlMultimediaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlMultimediaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
