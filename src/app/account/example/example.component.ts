import { Component, OnInit } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { LogService } from 'src/app/shared/services/log.service';
import { SupabaseService } from 'src/app/shared/services/supabase.service';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements OnInit {
  supabaseView: any[] = [];
  firebaseView: any[] = [];
  supabase: SupabaseClient | undefined;
  file: File | undefined;

  constructor(
    private supa: SupabaseService,
    private console: LogService
  ) { }

  ngOnInit(): void {
  }

  async createBucket() {
    const result = await this.supa.getClient()
      .storage
      .createBucket('media', { public: true })
    this.console.log('CheckResult', result);
  }

  fileChanged(evt: any) {
    this.file = evt.target.files[0];
    this.console.log('File', this.file);
  }

  async uploadTest() {
    if (this.file) {
      const result = this.supa.getClient()
        .storage
        .from('media')
        .upload('test/' + this.file.name, this.file, {
          cacheControl: '3600',
          upsert: false
        });
    }
  }

  connectSupabase() {
    // const public_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMjI5MTkyNywiZXhwIjoxOTQ3ODY3OTI3fQ.eLNmjItUHvY4dp_Zt_otakkKr2njaCcY99gjufIeF2U';
    // const supabaseUrl = 'https://jhqrimueimbqxgowplav.supabase.co';
    // this.supabase = createClient(supabaseUrl, public_key);
    // console.log('Client : ', this.supabase);

    const mySubscription = this.supa.getClient()
    .from('*')
    .on('*', payload => {
      this.console.log('Change received!', payload);
      this.supabaseView.push(payload);
    })
    .subscribe()
  }

  connectFirebaseSSE() {
    
  }

}
