import { TestBed } from '@angular/core/testing';
import { Spinner } from './spinner';

describe('Spinner', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Spinner],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Spinner);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
