import { Component, OnInit } from '@angular/core';
import { IGunChain, IGunInstance } from 'gun';
import { GunService } from 'src/app/shared/services/gun.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
  updateCount = 0;
  peerServersStr = "";
  title = "";
  note = "";
  notes: {title: string, content: string}[] = [];
  gunNote: IGunChain<any, IGunInstance<any>, IGunInstance<any>, "notes"> | undefined;
  constructor(private gun: GunService) { }


  ngOnInit(): void {

  }

  fnInit() {
    let custPeer = this.peerServersStr.split(",");
    this.gun.initialize(custPeer);
    this.gunNote = this.gun.gunInstance()?.get("notes");
    this.initializeNote();
  }

  initializeNote() {
    console.log("[GUN] noteInstance", this.gunNote);
    this.gunNote?.on((data, key, message, fnEvHandler) => {
      this.updateCount++;
      console.log("[GUN] ev is ", data, key, message, fnEvHandler);

      this.notes = Object.keys(data).filter(x => x !== "_" && data[x]).map(x => {
        return {
          title: x,
          content: data[x]
        }
      })
    });
  }


  fnSave() {
    const isoDt = (new Date()).toISOString();
    this.gunNote?.get(this.title).put(this.note);
    console.log("should put", this.title, this.note);
  }


  fnDelete() {
    const isoDt = (new Date()).toISOString();
    this.gunNote?.get(this.title).put(null);
    console.log("should delete", this.title, this.note);
  }

  fnUpdated() {
    const isoDt = (new Date()).toISOString();
    this.gunNote?.get(this.title).put(null);
    console.log("should delete", this.title, this.note);
  }

  fnSelectNote(n: any) {
    this.title = n.title;
    this.note = n.content;
  }

}
