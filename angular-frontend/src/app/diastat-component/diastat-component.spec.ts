import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiastatComponent } from './diastat-component';

describe('DiastatComponent', () => {
  let component: DiastatComponent;
  let fixture: ComponentFixture<DiastatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiastatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiastatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
