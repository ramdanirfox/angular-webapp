import { Component } from '@angular/core';
import { SupabaseService } from './shared/services/supabase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'exxon';
  showHead = true;
  constructor(private supa: SupabaseService) {
    this.supa.initializeClient();
  }
}
