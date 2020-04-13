import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-member-miniature',
  templateUrl: './member-miniature.component.html',
  styleUrls: ['./member-miniature.component.css']
})
export class MemberMiniatureComponent implements OnInit {
  @Input() user: User;


  constructor() { }

  ngOnInit() {
  }

}
