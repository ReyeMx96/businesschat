import { TestBed } from '@angular/core/testing';

import { FacturapiService } from './facturapi.service';

describe('FacturapiService', () => {
  let service: FacturapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
