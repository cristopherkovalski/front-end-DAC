import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositaComponent } from './deposita.component';

describe('DepositaComponent', () => {
  let component: DepositaComponent;
  let fixture: ComponentFixture<DepositaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DepositaComponent]
    });
    fixture = TestBed.createComponent(DepositaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
