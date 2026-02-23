import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CatalogarPage } from './catalogar.page';

describe('CatalogarPage', () => {
  let component: CatalogarPage;
  let fixture: ComponentFixture<CatalogarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
