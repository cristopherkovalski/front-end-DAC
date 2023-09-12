import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManutencaoAdminComponent } from './manutencao-admin.component';

describe('ManutencaoAdminComponent', () => {
  let component: ManutencaoAdminComponent;
  let fixture: ComponentFixture<ManutencaoAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManutencaoAdminComponent]
    });
    fixture = TestBed.createComponent(ManutencaoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
