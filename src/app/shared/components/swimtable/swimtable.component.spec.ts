import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwimtableComponent } from './swimtable.component';

describe('SwimtableComponent', () => {
  let component: SwimtableComponent;
  let fixture: ComponentFixture<SwimtableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwimtableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwimtableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
