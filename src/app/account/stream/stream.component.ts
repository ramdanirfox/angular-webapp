import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { MainService } from 'src/app/main/main.service';
import { LogService } from 'src/app/shared/services/log.service';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
declare var MediaRecorder: any;
@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})
export class StreamComponent implements OnInit {
  audioAvail: any = '';
  imageAvail: any = '';
  textAvail: any = '';
  textAvailBefore: any = '';
  receivedText = '';
  packetSent = 0;
  isRecording = true;
  isVideoOnline = false;
  penyiarTerpilih = '';
  siarSebagai = '';
  audioStreamSub: any;
  constructor(
    private domSanitizer: DomSanitizer,
    private supa: SupabaseService,
    private console: LogService,
    private mainService: MainService
  ) { }

  ngOnInit(): void {
  }

  startRecordAudio(broadcastAs: any) {
    this.isRecording = true;
    let recorder: any = null;

    const onsuccess = (stream: any) => {
    recorder = new MediaRecorder(stream, {
      type: 'audio/ogg; codecs=opus',
      audioBitsPerSecond: 32000 // min 6000
    });

    recorder.start(); // Starting the record

    recorder.ondataavailable = (e: any) => {
        // Converting audio blob to base64
        // console.log('sebelum b64', e);
        let reader = new FileReader()
        reader.onloadend = () => {
          // this.console.log('datanyaaa', reader.result);
          this.audioAvail = this.domSanitizer.bypassSecurityTrustResourceUrl((reader.result as any));
          // srcElm.src = reader.result;
          // audioElm.load();
          // audioElm.play();
          this.mainService.genericFn({
            mode: 'supabroadcast',
            data: {
              json_data: JSON.stringify({
                audio: reader.result,
                image: this.imageAvail,
                text: this.textAvail == this.textAvailBefore ? '' : this.textAvail
              }),
              expiry_sec: 1,
              app_id: 'digiprint_audio-'+broadcastAs,
              account_id: 'anon',
              group_id: 'anon_group'
            }
          }).subscribe(x => {
            this.console.log('Event broadcasted!', x);
            this.packetSent++;
          });
            // You can upload the base64 to server here.
        }

        reader.readAsDataURL(e.data);
        // reader.readAsText(e.data, 'UTF-16'); // default to UTF-8 bad IDEA!
        }
    }
    (navigator as any).getUserMedia = (
        (navigator as any).getUserMedia ||
        (navigator as any).webkitGetUserMedia ||
        (navigator as any).mozGetUserMedia ||
        (navigator as any).msGetUserMedia
    );

    (navigator as any).getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
        }
    }, onsuccess, (e: any) => {
        console.log(e);
    });

    const recursiveCord = () => {
      setTimeout(() => {
        recorder.stop();
        if (this.isRecording) {
          recorder.start();
          recursiveCord(); // Stopping the recorder after 3 seconds
        }
      }, 3000);
    }

    recursiveCord();
  }

  startListen(broadcaster: any, audioElm: any, srcElm: any, imageElm: any) {
    if (broadcaster) {
      this.console.log('Dengerin', broadcaster);
      this.supa.disconnectStreamWS('digiprint_audio-' + broadcaster);
      this.supa.connectStreamWS('digiprint_audio-' + broadcaster);
      if (this.audioStreamSub) { this.audioStreamSub.unsubscribe(); }
      this.audioStreamSub = this.supa.listenWS('digiprint_audio-' + broadcaster).subscribe(x => {
          const data = JSON.parse(x.new.json_data);
          srcElm.src = data.audio;
          audioElm.load();
          audioElm.play();
          imageElm.src = data.image;
          if (data.text) { this.receivedText = data.text }
      });
    } 
    else {
      this.console.log('Udahan ah!', this.penyiarTerpilih);
      this.supa.disconnectStreamWS('digiprint_audio-' + this.penyiarTerpilih);
      if (this.audioStreamSub) { this.audioStreamSub.unsubscribe(); }
    }
  }

  startBroadCast(broadcastAs: any) {
    if (broadcastAs) {
      this.startRecordAudio(broadcastAs);
    }
    else {
      this.stopRecordAudio();
    }

  }

  stopRecordAudio() {
    this.isRecording = false;
  }

  startRecordVideo(videoElm: any, canvasElm: any, imgElm: any) {
    const video = videoElm;
    const canvas = canvasElm;
    const photo = imgElm;

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then((stream) => {
        video.srcObject = stream;
        video.play();
    })
    .catch((err) => {
        console.log("An error occurred: " + err);
    });
  }

  videoPlayable(video: any, canvas: any, photo: any) {
    this.console.log('the video is playable!');
    if (!this.isVideoOnline) {
      const width = 200;
      const height = video.videoHeight / (video.videoWidth/width);
      video.setAttribute('width', width);
      video.setAttribute('height', height);
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      this.isVideoOnline = true;
      setInterval(() => { this.takepicture(video, canvas, photo) }, 3000);
    }
  }

  takepicture(video: any, canvas: any, photo: any) {
      var context = canvas.getContext('2d');
    // if (width && height) {
      const width = 200;
      canvas.width = 200;
      const height = video.videoHeight / (video.videoWidth / width);
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

    var data = canvas.toDataURL('image/jpeg');
    this.console.log('Data img', data.length);
    photo.setAttribute('src', data);
    this.imageAvail = data;
    // } else {
    //   clearphoto();
    // }
  }

}
