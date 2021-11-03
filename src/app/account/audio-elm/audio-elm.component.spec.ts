import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioElmComponent } from './audio-elm.component';

describe('AudioElmComponent', () => {
  let component: AudioElmComponent;
  let fixture: ComponentFixture<AudioElmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudioElmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioElmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
