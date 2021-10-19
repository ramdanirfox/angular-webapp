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
  packetSent = 0;
  isRecording = true;
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
        type: 'audio/ogg; codecs=opus'
    } as any);

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
              json_data: JSON.stringify({ audio: reader.result }),
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
        }
    }
    (navigator as any).getUserMedia = (
        (navigator as any).getUserMedia ||
        (navigator as any).webkitGetUserMedia ||
        (navigator as any).mozGetUserMedia ||
        (navigator as any).msGetUserMedia
    );

    (navigator as any).getUserMedia({
        audio: true
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

  startListen(broadcaster: any, audioElm: any, srcElm: any) {
    if (broadcaster) {
      this.console.log('Dengerin', broadcaster);
      this.supa.disconnectStreamWS('digiprint_audio-' + broadcaster);
      this.supa.connectStreamWS('digiprint_audio-' + broadcaster);
      if (this.audioStreamSub) { this.audioStreamSub.unsubscribe(); }
      this.audioStreamSub = this.supa.listenWS('digiprint_audio-' + broadcaster).subscribe(x => {
          srcElm.src = JSON.parse(x.new.json_data).audio;
          audioElm.load();
          audioElm.play();
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

}
