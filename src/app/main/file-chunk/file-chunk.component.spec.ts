import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileChunkComponent } from './file-chunk.component';

describe('FileChunkComponent', () => {
  let component: FileChunkComponent;
  let fixture: ComponentFixture<FileChunkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileChunkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileChunkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
