import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZelleComponent } from './zelle-component';

describe('ZelleComponent', () => {
  let component: ZelleComponent;
  let fixture: ComponentFixture<ZelleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZelleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZelleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
