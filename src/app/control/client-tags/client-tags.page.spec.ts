import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientTagsPage } from './client-tags.page';

describe('ClientTagsPage', () => {
  let component: ClientTagsPage;
  let fixture: ComponentFixture<ClientTagsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientTagsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
