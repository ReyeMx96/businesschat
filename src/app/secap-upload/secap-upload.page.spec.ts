import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecapUploadPage } from './secap-upload.page';

describe('SecapUploadPage', () => {
  let component: SecapUploadPage;
  let fixture: ComponentFixture<SecapUploadPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SecapUploadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
