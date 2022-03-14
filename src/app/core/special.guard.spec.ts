import { TestBed } from '@angular/core/testing';

import { SpecialGuard } from './special.guard';

describe('SpecialGuard', () => {
  let guard: SpecialGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(SpecialGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
