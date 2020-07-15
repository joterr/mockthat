import { TestBed } from '@angular/core/testing';

import { UpdateSeoService } from './update-seo.service';

describe('UpdateSeoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UpdateSeoService = TestBed.get(UpdateSeoService);
    expect(service).toBeTruthy();
  });
});
