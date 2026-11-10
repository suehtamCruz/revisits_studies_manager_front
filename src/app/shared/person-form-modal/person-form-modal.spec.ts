import { TestBed } from '@angular/core/testing';
import { PersonFormModal } from './person-form-modal';

describe('PersonFormModal', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonFormModal],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PersonFormModal);
    fixture.componentRef.setInput('title', 'Nova revisita');
    fixture.componentRef.setInput('dayLabel', 'Dia da revisita');
    fixture.componentRef.setInput('submitLabel', 'Salvar revisita');
    expect(fixture.componentInstance).toBeTruthy();
  });
});
