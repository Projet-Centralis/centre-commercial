import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutiquesComponent } from './boutiques.component';

describe('BoutiquesComponent', () => {
  let component: BoutiquesComponent;
  let fixture: ComponentFixture<BoutiquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoutiquesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoutiquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
