import { TestBed } from '@angular/core/testing';

import { TransformControlService } from './transform-control.service';

describe('TransformControlService', () => {
  let service: TransformControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransformControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
