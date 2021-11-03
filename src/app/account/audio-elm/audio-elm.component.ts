import { AfterViewInit, Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
// import { EventEmitter } from 'stream';

@Component({
  selector: 'app-audio-elm',
  templateUrl: './audio-elm.component.html',
  styleUrls: ['./audio-elm.component.scss']
})
export class AudioElmComponent implements OnInit, AfterViewInit {
  @ViewChild('audioElm', { static: true }) audioEl: any;
  @Output() emitAudioElm = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.emitAudioElm.emit(this.audioEl);
  }

}
