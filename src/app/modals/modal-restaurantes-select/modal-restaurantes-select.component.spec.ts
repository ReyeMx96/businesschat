import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalRestaurantesSelectComponent } from './modal-restaurantes-select.component';

describe('ModalRestaurantesSelectComponent', () => {
  let component: ModalRestaurantesSelectComponent;
  let fixture: ComponentFixture<ModalRestaurantesSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRestaurantesSelectComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalRestaurantesSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
