import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { RevisitsPage } from './revisits.page';

describe('RevisitsPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevisitsPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(RevisitsPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
