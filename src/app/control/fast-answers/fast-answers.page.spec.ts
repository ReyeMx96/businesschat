import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FastAnswersPage } from './fast-answers.page';

describe('FastAnswersPage', () => {
  let component: FastAnswersPage;
  let fixture: ComponentFixture<FastAnswersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FastAnswersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
