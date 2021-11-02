import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-audioloop',
  templateUrl: './audioloop.component.html',
  styleUrls: ['./audioloop.component.scss']
})
export class AudioloopComponent implements OnInit {
  doNotCollectThis: any;
  deviceForm = [{ key: 'audioIn', value: 'Mikrofon' }, { key: 'audioOut', value: 'Perangkat Suara' }, { key: 'videoIn', value: 'Kamera' }];
  devices: any = {
    videoIn: [] as any[],
    audioIn: [] as any[],
    audioOut: [] as any[]
  };
  selectedDevice: any = {
    videoIn: undefined as any,
    audioIn: undefined as any,
    audioOut: undefined as any
  }
  showCtl = true;
  audioCtxHolder: any[] = [];
  constructor(private changeRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    navigator.mediaDevices.enumerateDevices()
    .then((e) => this.onEnumDevCb(e))
    .catch((e) => this.onEnumDevErr(e));
  }

  onEnumDevErr(e: any) {
    alert('Error Enumerate');
    console.log('Error Enumerate', e);
  }

  
  startRecordVideo(videoElm: any) {
    const video = videoElm;
    // const canvas = canvasElm;
    // const photo = imgElm;

    navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: this.selectedDevice.videoIn ? { exact: this.selectedDevice.videoIn.value } : undefined,
    }, audio: false })
    .then((stream) => {
        video.srcObject = stream;
        video.play();
    })
    .catch((err) => {
        console.log("An error occurred: " + err);
    });
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
    // OBS Virt Cam show only over HTTPS, so deploy first please...d
  }

  initializeRecord() {
    const constraint: any = {
      audio: {
        deviceId: this.selectedDevice.audioIn ? { exact: this.selectedDevice.audioIn.value } : undefined,
        channelCount: 1,
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }
    };
    console.log('constrain', constraint);
    navigator.mediaDevices.getUserMedia(constraint)
    .then((stream) => {
      var audioContext = new AudioContext();
      var mediaStreamNode = audioContext.createMediaStreamSource(stream);
      const gainNode = audioContext.createGain();
      mediaStreamNode.connect(gainNode).connect(audioContext.destination);
  
      // This is a temporary workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=934512
      // where the stream is collected too soon by the Garbage Collector
      this.doNotCollectThis = stream;
      this.audioCtxHolder.push(
        {
          device: this.selectedDevice.audioIn,
          audioContext: audioContext,
          gainNode: gainNode,
          gainValue: 100
        }
      );
      console.log('AudioCtx', this.audioCtxHolder);
    });
  }

  audioCtxCtl(name: 'pause' | 'play' | 'stop' | 'volume', value: any, ctx: any, i: number) {
    if (name == 'pause') {
      ctx.audioContext.suspend().then(() => this.updateUI());
    }
    else if (name == 'play') {
      ctx.audioContext.resume().then(() => this.updateUI());
    }
    else if (name == 'stop') {
      ctx.audioContext.close().then(() => this.updateUI());
      this.audioCtxHolder.splice(i, 1);
    }
    else if (name == 'volume') {
      // ctx.audioContext.close().then(() => this.updateUI());
      ctx.gainNode.gain.value = value / 100;
      ctx.gainValue = value;
    }
    else {

    }
  }

  startPlayMedia(evt: any, video: any, source: any) {
    const files = evt.target.files;
    const file = files[0];
    if (file) {
      source.src = URL.createObjectURL(file);
      video.load();
      video.play();
    }
  }

  updateUI() {
    this.changeRef.detectChanges();
    this.changeRef.markForCheck();
  }

  logTest(param: any) {
    console.log('LogTest', param);
  }

}
