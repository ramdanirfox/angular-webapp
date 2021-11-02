import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioloopComponent } from './audioloop.component';

describe('AudioloopComponent', () => {
  let component: AudioloopComponent;
  let fixture: ComponentFixture<AudioloopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudioloopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioloopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
