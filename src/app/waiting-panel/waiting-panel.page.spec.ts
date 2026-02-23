import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WaitingPanelPage } from './waiting-panel.page';

describe('WaitingPanelPage', () => {
  let component: WaitingPanelPage;
  let fixture: ComponentFixture<WaitingPanelPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingPanelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
