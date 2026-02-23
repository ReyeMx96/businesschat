import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlSmartHomePage } from './control-smart-home.page';

describe('ControlSmartHomePage', () => {
  let component: ControlSmartHomePage;
  let fixture: ComponentFixture<ControlSmartHomePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlSmartHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
