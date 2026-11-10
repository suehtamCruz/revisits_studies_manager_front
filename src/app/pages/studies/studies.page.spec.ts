import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { StudiesPage } from './studies.page';

describe('StudiesPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudiesPage],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(StudiesPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
