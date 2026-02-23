import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisionYVisionPage } from './mision-y-vision.page';

describe('MisionYVisionPage', () => {
  let component: MisionYVisionPage;
  let fixture: ComponentFixture<MisionYVisionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MisionYVisionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
