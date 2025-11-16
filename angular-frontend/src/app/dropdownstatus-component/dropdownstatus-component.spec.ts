import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownstatusComponent } from './dropdownstatus-component';

describe('DropdownstatusComponent', () => {
  let component: DropdownstatusComponent;
  let fixture: ComponentFixture<DropdownstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownstatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
