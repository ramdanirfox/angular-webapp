import { Component, OnInit } from '@angular/core';
import { GunService } from 'src/app/shared/services/gun.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
  title = "";
  note = "";
  notes: {title: string, content: string}[] = [];
  gunNote = this.gun.gunInstance().get("notes");
  constructor(private gun: GunService) { }

  ngOnInit(): void {
    console.log("[GUN] noteInstance", this.gunNote);
    this.gunNote.on((data, key, message, fnEvHandler) => {
      console.log("[GUN] ev is ", data, key, message, fnEvHandler);
      this.notes = Object.keys(data).filter(x => x !== "_").map(x => {
        return {
          title: x,
          content: data[x]
        }
      })
    });
  }


  fnSave() {
    const isoDt = (new Date()).toISOString();
    this.gunNote.get(this.title).put(this.note);
    console.log("should put", this.title, this.note);
  }

}
