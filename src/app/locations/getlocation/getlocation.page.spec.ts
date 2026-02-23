import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GetlocationPage } from './getlocation.page';

describe('GetlocationPage', () => {
  let component: GetlocationPage;
  let fixture: ComponentFixture<GetlocationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GetlocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
