import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GptControlPage } from './gpt-control.page';

describe('GptControlPage', () => {
  let component: GptControlPage;
  let fixture: ComponentFixture<GptControlPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GptControlPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
