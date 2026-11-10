import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RevisitsPage } from './revisits.page';

describe('RevisitsPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevisitsPage],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(RevisitsPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
