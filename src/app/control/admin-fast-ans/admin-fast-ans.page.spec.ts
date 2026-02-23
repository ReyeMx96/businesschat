import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminFastAnsPage } from './admin-fast-ans.page';

describe('AdminFastAnsPage', () => {
  let component: AdminFastAnsPage;
  let fixture: ComponentFixture<AdminFastAnsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFastAnsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
