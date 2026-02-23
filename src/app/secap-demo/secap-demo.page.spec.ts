import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecapDemoPage } from './secap-demo.page';

describe('SecapDemoPage', () => {
  let component: SecapDemoPage;
  let fixture: ComponentFixture<SecapDemoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SecapDemoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
