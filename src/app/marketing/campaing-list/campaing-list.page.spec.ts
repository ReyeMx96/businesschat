import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CampaingListPage } from './campaing-list.page';

describe('CampaingListPage', () => {
  let component: CampaingListPage;
  let fixture: ComponentFixture<CampaingListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaingListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
