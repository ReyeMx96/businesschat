import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPanelPage } from './login-panel.page';

describe('LoginPanelPage', () => {
  let component: LoginPanelPage;
  let fixture: ComponentFixture<LoginPanelPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPanelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
