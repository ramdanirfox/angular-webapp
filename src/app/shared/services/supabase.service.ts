import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js'

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  supabase: SupabaseClient | undefined;


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


}
