import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DienstplanComponent } from './dienstplan-component';

describe('DienstplanComponent', () => {
  let component: DienstplanComponent;
  let fixture: ComponentFixture<DienstplanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DienstplanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DienstplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
