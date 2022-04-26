import { TestBed } from '@angular/core/testing';

import { MemoriesService } from './memories.service';

describe('MemoriesService', () => {
  let service: MemoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
