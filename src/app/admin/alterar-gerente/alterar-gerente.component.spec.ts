import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterarGerenteComponent } from './alterar-gerente.component';

describe('AlterarGerenteComponent', () => {
  let component: AlterarGerenteComponent;
  let fixture: ComponentFixture<AlterarGerenteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlterarGerenteComponent]
    });
    fixture = TestBed.createComponent(AlterarGerenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
