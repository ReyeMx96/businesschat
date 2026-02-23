import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditChatbotPage } from './edit-chatbot.page';

describe('EditChatbotPage', () => {
  let component: EditChatbotPage;
  let fixture: ComponentFixture<EditChatbotPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditChatbotPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
