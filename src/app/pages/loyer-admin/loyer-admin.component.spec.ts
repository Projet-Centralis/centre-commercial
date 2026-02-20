import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyerAdminComponent } from './loyer-admin.component';

describe('LoyerAdminComponent', () => {
  let component: LoyerAdminComponent;
  let fixture: ComponentFixture<LoyerAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoyerAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoyerAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
