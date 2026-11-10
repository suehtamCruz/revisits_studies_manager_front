import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthPage } from './auth.page';

describe('AuthPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthPage],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AuthPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
