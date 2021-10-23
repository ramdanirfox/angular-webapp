import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { MainService } from 'src/app/main/main.service';
import { LogService } from 'src/app/shared/services/log.service';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import * as blobUtil from 'blob-util';
declare var MediaRecorder: any;
@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})
export class StreamComponent implements OnInit {
  audioArrAvail: any = [];
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
          this.console.log('datanyaaa', reader.result?.toString().substring(0, 20));
          this.audioArrAvail.push(reader.result);
          // this.audioAvail = this.domSanitizer.bypassSecurityTrustResourceUrl((reader.result as any));
          // this.mainService.genericFn({
          //   mode: 'supabroadcast',
          //   data: {
          //     json_data: JSON.stringify({
          //       audio: reader.result,
          //       image: this.imageAvail,
          //       text: this.textAvail == this.textAvailBefore ? '' : this.textAvail
          //     }),
          //     expiry_sec: 1,
          //     app_id: 'digiprint_audio-'+broadcastAs,
          //     account_id: 'anon',
          //     group_id: 'anon_group'
          //   }
          // }).subscribe(x => {
          //   this.console.log('Event broadcasted!', x);
          //   this.packetSent++;
          // });
            // You can upload the base64 to server here.
        }

        reader.readAsDataURL(e.data);
        // reader.readAsText(e.data, 'UTF-8'); // default to UTF-8 bad IDEA!
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
          recorder.start(1000);
          // recursiveCord(); // Stopping the recorder after 3 seconds
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

  manualPlay(audioElm: any, srcElm: any) {
    // const mergedData = this.audioArrAvail.map((x: string, i: number) => i ? x.split(',')[1] : x);
    const mergedData = this.audioArrAvail;
    const splitData = this.audioArrAvail[0].split(';base64,')
    const blobDatas = this.base64toBlob(splitData[1], splitData[0].split(':')[1], 512);
    const blobDataV2 = mergedData.map((x: string) => blobUtil.dataURLToBlob(x));
    this.console.log('Datas', this.audioArrAvail);
    this.console.log('Merged', mergedData);
    this.console.log('Blobs', blobDatas);
    this.console.log('BlobInstantzz', blobDataV2);
    const mergedBlob = new Blob(blobDataV2, { type: 'audio/webm' });
    this.console.log('BlobMerged', mergedBlob);
    // srcElm.src = mergedData.join('');
    let reader = new FileReader();
    reader.onloadend = () => {
      this.console.log('Load Finish', (reader.result as string).length);
      srcElm.src = reader.result;
      audioElm.load();
    }
    reader.readAsDataURL(mergedBlob);
    // audioElm.play();
  }

  base64toBlob(base64Data: string, contentType: any, sliceSize: any) {

    var byteCharacters: any,
        byteArray,
        byteNumbers,
        blobData,
        blob;

    contentType = contentType || '';

    byteCharacters = atob(base64Data);

    // Get BLOB data sliced or not
    blobData = sliceSize ? getBlobDataSliced() : getBlobDataAtOnce();

    blob = new Blob(blobData, { type: contentType });

    return blob;


    /*
     * Get BLOB data in one slice.
     * => Fast in Internet Explorer on new Blob(...)
     */
    function getBlobDataAtOnce() {
        byteNumbers = new Array(byteCharacters.length);

        for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        byteArray = new Uint8Array(byteNumbers);

        return [byteArray];
    }

    /*
     * Get BLOB data in multiple slices.
     * => Slow in Internet Explorer on new Blob(...)
     */
    function getBlobDataSliced() {

        var slice,
            byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            slice = byteCharacters.slice(offset, offset + sliceSize);

            byteNumbers = new Array(slice.length);

            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            byteArray = new Uint8Array(byteNumbers);

            // Add slice
            byteArrays.push(byteArray);
        }

        return byteArrays;
    }
}

}
