import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlteraPerfilComponent } from './altera-perfil.component';

describe('AlteraPerfilComponent', () => {
  let component: AlteraPerfilComponent;
  let fixture: ComponentFixture<AlteraPerfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlteraPerfilComponent]
    });
    fixture = TestBed.createComponent(AlteraPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
