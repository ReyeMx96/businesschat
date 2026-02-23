import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowImgPage } from './show-img.page';

describe('ShowImgPage', () => {
  let component: ShowImgPage;
  let fixture: ComponentFixture<ShowImgPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowImgPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
