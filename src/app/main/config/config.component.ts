import { Component, OnInit } from '@angular/core';
import { LogService } from 'src/app/shared/services/log.service';
import { RT_MAIN } from '../main.routes';
import { MainService } from '../main.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  db_data: any;
  R_MAIN = new RT_MAIN();
  constructor(
    private mainService: MainService,
    private logService: LogService
    ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.mainService.genericFnEvt<{data: {"pg_database_size": number}[], error: any}>({
      mode: 'supastatus'
    }).subscribe(x => {
      if (x.type == 4) {
        this.logService.log(x);
        const used = x.body?.data[0].pg_database_size as number;
        const remain = 500000000 - used;
        this.db_data = [
          {"name": "Terpakai", "value": used},
          {"name": "Tersisa", "value": remain}
        ]
      }
    },
    err => {
      this.logService.log('ERR', err);
    });

    // this.mainService.genericFnEvt({
    //   mode: 'supastorage'
    // }).subscribe(x => {
    //   if (x.type == 4) {
    //     this.logService.log(x);
    //   }
    // },
    // err => {
    //   this.logService.log('ERR', err);
    // });
  }

}
