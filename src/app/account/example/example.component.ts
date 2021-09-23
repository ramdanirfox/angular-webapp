import { Component, OnInit } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js'

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements OnInit {
  supabaseView: any[] = [];
  firebaseView: any[] = [];
  supabase: SupabaseClient | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  connectSupabase() {
    const public_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMjI5MTkyNywiZXhwIjoxOTQ3ODY3OTI3fQ.eLNmjItUHvY4dp_Zt_otakkKr2njaCcY99gjufIeF2U';
    const supabaseUrl = 'https://jhqrimueimbqxgowplav.supabase.co';
    this.supabase = createClient(supabaseUrl, public_key);
    console.log('Client : ', this.supabase);

    const mySubscription = this.supabase
    .from('*')
    .on('*', payload => {
      console.log('Change received!', payload);
      this.supabaseView.push(payload);
    })
    .subscribe()
  }

  connectFirebaseSSE() {
    
  }

}
