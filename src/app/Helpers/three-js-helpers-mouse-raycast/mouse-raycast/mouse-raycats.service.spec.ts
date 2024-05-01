import { TestBed } from '@angular/core/testing';

import { MouseRaycatsService } from './mouse-raycats.service';

describe('MouseRaycatsService', () => {
  let service: MouseRaycatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MouseRaycatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
