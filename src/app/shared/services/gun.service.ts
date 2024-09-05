import { Injectable } from '@angular/core';
import { IGunInstance } from 'gun';
// import * as radisk from "gun/lib/radisk";
// import * as radix from "gun/lib/radix";
// import * as store from "gun/lib/store";
import "gun/lib/rindexed";
import { IRindexedDB } from 'gun/lib/rindexed';
declare global {
  interface Window {
    RindexedDB: IRindexedDB;
  }
}
declare var RindexedDB: any;
@Injectable({
  providedIn: 'root'
})
export class GunService {
  readonly peerId = location.origin + '/gun';
  private gun: IGunInstance;

  constructor() { 
    console.log("[GUN] peerId is " + this.peerId)
    // localStorage.clear();
    let opt = {
      peers: [this.peerId, "https://gun-manhattan.herokuapp.com/gun"],
      store: undefined as any,
      localStorage: false
    };
    opt.store = RindexedDB(opt);
    this.gun = Gun(this.peerId);
  }

  initialize() {
    console.log("[GUN] ignored. peer is " + this.peerId, this.gun);
    
    // this.gun = Gun(this.peerId);
  }

  gunInstance() {
    return this.gun;
  }
}
