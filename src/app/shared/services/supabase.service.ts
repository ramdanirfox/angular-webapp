import { Injectable } from '@angular/core';
import { createClient, RealtimeSubscription, SupabaseClient } from '@supabase/supabase-js'
import { SupabaseRealtimeClient } from '@supabase/supabase-js/dist/main/lib/SupabaseRealtimeClient';
import { Subject } from 'rxjs';
import { SupabaseBroadcastOptions } from '../model/supabase.model';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  supabase: SupabaseClient | undefined;
  supabaseSubs: {[key: string]: RealtimeSubscription} = {};
  supabaseSubjects: {[key: string]: Subject<any>} = {};


  constructor() {

  }

  initializeClient() {
    const public_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMjI5MTkyNywiZXhwIjoxOTQ3ODY3OTI3fQ.eLNmjItUHvY4dp_Zt_otakkKr2njaCcY99gjufIeF2U';
    const supabaseUrl = 'https://jhqrimueimbqxgowplav.supabase.co';
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

  listen(channel: string) {
    return this.supabaseSubjects[channel].asObservable();
  }

  broadcast(data: any, options = new SupabaseBroadcastOptions()) {
    
  }


}
