import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiateamComponent } from './diateam-component';

describe('DiateamComponent', () => {
  let component: DiateamComponent;
  let fixture: ComponentFixture<DiateamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiateamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiateamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
