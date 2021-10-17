import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-swimtable',
  templateUrl: './swimtable.component.html',
  styleUrls: ['./swimtable.component.scss']
})
export class SwimtableComponent implements OnInit {
  rows = [    { name: 'Austin', gender: 'Male', company: 'Swimlane' },    { name: 'Dany', gender: 'Male', company: 'KFC' },    { name: 'Molly', gender: 'Female', company: 'Burger King' }  ];
  columns = [{ prop: 'name' }, { name: 'Gender' }, { name: 'Company' }];
  
  constructor() { }

  ngOnInit(): void {
  }

}
