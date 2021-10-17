import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwimpieComponent } from './swimpie.component';

describe('SwimpieComponent', () => {
  let component: SwimpieComponent;
  let fixture: ComponentFixture<SwimpieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwimpieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwimpieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
