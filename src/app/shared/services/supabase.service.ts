import { Injectable } from '@angular/core';
import { createClient, RealtimeSubscription, SupabaseClient } from '@supabase/supabase-js'
import { SupabaseRealtimeClient } from '@supabase/supabase-js/dist/main/lib/SupabaseRealtimeClient';
import { Subject } from 'rxjs';
import { SupabaseBroadcastOptions } from '../model/supabase.model';
const public_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMjI5MTkyNywiZXhwIjoxOTQ3ODY3OTI3fQ.eLNmjItUHvY4dp_Zt_otakkKr2njaCcY99gjufIeF2U';
const supabaseOrigin = 'jhqrimueimbqxgowplav.supabase.co'
const supabaseUrl = 'https://' + supabaseOrigin;

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  supabase: SupabaseClient | undefined;
  supabaseSubs: {[key: string]: RealtimeSubscription} = {};
  supabaseSubsWS: { [key: string]: {heartbeatTimerId: any, socket: WebSocket}} = {};
  supabaseSubjects: {[key: string]: Subject<any>} = {};
  supabaseSubjectsWS: {[key: string]: Subject<any>} = {};


  constructor() {

  }

  initializeClient() {
    this.supabase = createClient(supabaseUrl, public_key);
    console.log('Client : ', this.supabase);
  }

  getClient() {
    if (this.supabase) {
      return this.supabase;
    }
    else {
      throw Error('Maaf, supabase belum di inisialisasi. Silakan initializeClient terlebih dahulu.');
    }
  }

  connectStream(channel: string, options?: any, streamId?: string) {
    if (!streamId) { streamId = channel; }
    if (this.supabaseSubs[streamId]) { this.getClient().removeSubscription(this.supabaseSubs[streamId]) }
    // if (this.supabaseSubjects[streamId]) { this.getClient().removeSubscription(this.supabaseSubs[streamId]) }
    this.supabaseSubjects[streamId] = new Subject();
    const mySubscription = this.getClient()
      .from(`realtime_hooks:app_id=eq.${channel}`)
      .on('INSERT', payload => {
        this.supabaseSubjects[(streamId as string)].next(payload);
        // this.console.log('Change received!', payload);
        // this.supabaseView.push(payload);
      }).subscribe();
    this.supabaseSubs[streamId] = mySubscription;
    return mySubscription;
  }

  connectStreamWS(channel: string, options?: any, streamId?: string) {
    if (!streamId) { streamId = channel; }
    if (this.supabaseSubsWS[streamId]) {
      clearInterval(this.supabaseSubsWS[streamId].heartbeatTimerId);
      this.supabaseSubsWS[streamId].socket.close();
    }
    const wssUrl = `wss://${supabaseOrigin}/realtime/v1/websocket?apikey=${public_key}&vsn=1.0.0`
    const socket = new WebSocket(wssUrl);
    this.supabaseSubsWS[streamId] = {
      socket: socket,
      heartbeatTimerId: -1
    }
    this.supabaseSubjectsWS[streamId] = new Subject();
    let counter = 1;
    const heartBeatFn = () => {
      const heartMessage = JSON.stringify(
        {
          "topic": "phoenix",
          "event": "heartbeat",
          "payload": {},
          "ref": (counter++).toString()
        })
      socket.send(heartMessage);
      if (this.supabaseSubsWS[(streamId as string)].heartbeatTimerId) {
        setTimeout(() => heartBeatFn(), 30000);
      }
    }
    socket.addEventListener('open', (event) => {
      const initMessage = JSON.stringify({
        "topic": `realtime:public:realtime_hooks:app_id=eq.${channel}`,
        "event": "phx_join",
        "payload": {
          "user_token": public_key
        }, "ref": (counter++).toString()
      });
      socket.send(initMessage);
      this.supabaseSubsWS[(streamId as string)].heartbeatTimerId = 1;
      heartBeatFn();
    });

    socket.addEventListener('message', (event) => {
      // console.log('Message from server ', event.data);
      const eventdata = JSON.parse(event.data);
      if (eventdata.event == 'INSERT') {
        const formatted: any = {
          eventType: eventdata.payload.type,
          commit_timestamp: eventdata.payload.commit_timestamp,
          new: eventdata.payload.record,
          old: {},
          // schema: '',
          // table: ''
        }
        this.supabaseSubjectsWS[(streamId as string)].next(formatted);
      }
      else {
        console.log('Ignored WSS Message (' + streamId + ')', eventdata);
      }
    });

  }

  disconnectStreamWS(streamId: string) {
    if (this.supabaseSubsWS[streamId]) {
      // clearInterval(this.supabaseSubsWS[streamId].heartbeatTimerId);
      this.supabaseSubsWS[streamId].heartbeatTimerId = 0;
      this.supabaseSubsWS[streamId].socket.close();
      delete this.supabaseSubsWS[streamId];
    
      // You may notify subscription of this socket
      // this.supabaseSubjectsWS[streamId].next({event: 'CLOSE'})
    }
    else {
      console.log('Stream not found');
    }
  }

  listenWS(streamId: string) {
    return this.supabaseSubjectsWS[streamId].asObservable();
  }

  listen(streamId: string) {
    return this.supabaseSubjects[streamId].asObservable();
  }

  broadcast(data: any, options = new SupabaseBroadcastOptions()) {
    
  }


}
