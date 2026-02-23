import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CampaingDetailsPage } from './campaing-details.page';

describe('CampaingDetailsPage', () => {
  let component: CampaingDetailsPage;
  let fixture: ComponentFixture<CampaingDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaingDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
