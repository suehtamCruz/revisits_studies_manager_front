import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Menu } from './menu';

describe('Menu', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Menu],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Menu);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
