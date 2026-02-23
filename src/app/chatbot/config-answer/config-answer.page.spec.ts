import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigAnswerPage } from './config-answer.page';

describe('ConfigAnswerPage', () => {
  let component: ConfigAnswerPage;
  let fixture: ComponentFixture<ConfigAnswerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAnswerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
