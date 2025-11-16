import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiaposComponent } from './diapos-component';

describe('DiaposComponent', () => {
  let component: DiaposComponent;
  let fixture: ComponentFixture<DiaposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiaposComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiaposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
