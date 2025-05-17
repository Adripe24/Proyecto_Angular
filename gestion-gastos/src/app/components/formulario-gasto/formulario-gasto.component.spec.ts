import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioGastoComponent } from './formulario-gasto.component';

describe('FormularioGastoComponent', () => {
  let component: FormularioGastoComponent;
  let fixture: ComponentFixture<FormularioGastoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioGastoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioGastoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
