import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-audioloop',
  templateUrl: './audioloop.component.html',
  styleUrls: ['./audioloop.component.scss']
})
export class AudioloopComponent implements OnInit {
  doNotCollectThis: any;
  devices = {
    videoIn: [] as any[],
    audioIn: [] as any[],
    audioOut: [] as any[]
  };
  constructor() { }

  ngOnInit(): void {
    navigator.mediaDevices.enumerateDevices()
    .then((e) => this.onEnumDevCb(e))
    .catch((e) => this.onEnumDevErr(e));
  }

  onEnumDevErr(e: any) {
    alert('Error Enumerate');
    console.log('Error Enumerate', e);
  }

  onEnumDevCb(deviceInfos: any) {

    for (var i = 0; i !== deviceInfos.length; ++i) {
      var deviceInfo = deviceInfos[i];
      var option = {value: '', text: '', detail: undefined as any};
      option.value = deviceInfo.deviceId;
      option.detail = deviceInfo;
      if (deviceInfo.kind === 'audioinput') {
        option.text = deviceInfo.label ||
          'Microphone ' + (this.devices.audioIn.length + 1);
        this.devices.audioIn.push(option);
      } else if (deviceInfo.kind === 'audiooutput') {
        option.text = deviceInfo.label ||
        'Speaker ' + (this.devices.audioOut.length + 1);
        this.devices.audioOut.push(option);
      } else if (deviceInfo.kind === 'videoinput') {
        option.text = deviceInfo.label ||
          'Camera ' + (this.devices.videoIn.length + 1);
        this.devices.videoIn.push(option);
      }
    }
    console.log('Got Devices : ', deviceInfos);
    console.log('Processed devices : ', this.devices);
  }

  initializeRecord() {
    navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
        } as any
    })
    .then((stream) => {
      var audioContext = new AudioContext();
      var mediaStreamNode = audioContext.createMediaStreamSource(stream);
      mediaStreamNode.connect(audioContext.destination);
  
      // This is a temporary workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=934512
      // where the stream is collected too soon by the Garbage Collector
      this.doNotCollectThis = stream;
    });
  }

}
