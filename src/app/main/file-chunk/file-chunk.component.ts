import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';

@Component({
  selector: 'app-file-chunk',
  templateUrl: './file-chunk.component.html',
  styleUrls: ['./file-chunk.component.scss']
})
export class FileChunkComponent implements OnInit {
  CHUNK_SIZE = 500000;
  chunkstart = 0;
  chunkend = 0;
  constructor(private mainService: MainService) { }

  ngOnInit(): void {
  }

  initializeUpload(evt: any, audioElm: any) {
    const file = evt.target.files[0];
    const fileInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    };
    this.chunkend = ((this.chunkend + this.CHUNK_SIZE) <= fileInfo.size) ? (this.chunkend + this.CHUNK_SIZE) : this.CHUNK_SIZE;
    this.chunkstart = this.chunkend;
    const fchunk3 = new Blob([file.slice(90000, 500000)], { type: fileInfo.type });
    const fchunk2 = new Blob([file.slice(0, 90000)], { type: fileInfo.type });
    const fchunk = new Blob([fchunk2], { type: fileInfo.type });
    // VBR OPUS => concatable, non swappable
    // CBR MP3 => concatable, swappable
    // const fchunk = new Blob([fchunk3, fchunk2], { type: fileInfo.type });
    const fileRead = new FileReader();
    fileRead.onload = (e) => {
      // const params = {
      //   "data":"base64amajiiingg",
      //   "name":"coba.csv",
      //   "ftype":"image/jpeg",
      //   "size":320478,
      //   "hash":"aaaaa",
      //   "total_chunk":9,
      //   "chunk_id":1,
      //   "chunk_size":2000,
      //   "path":"/data"
      // }
      console.log('Chunk disini', fileRead.result);
      audioElm.src = fileRead.result;
      // try to apply audiourl here :)
      fileRead.result;
    };
    fileRead.readAsDataURL(fchunk);
    const chunkSize = 200000;
    console.log('Files', file, fileInfo);
    // this.mainService.genericLocalGet('/api/file/check', {}).subscribe(x => {
    //   console.log('HAsil', x);
    // });
    // this.mainService.genericLocalPost('/api/file/upload', params).subscribe(x => {
    //   console.log('HAsil', x);
    // });
    // name, size, type, lastModified
  }

}
