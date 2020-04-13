import { Component, OnInit, Input } from '@angular/core';
import { Participant, ParticipantStatus } from '../../_models/participant';


@Component({
  selector: 'app-participant-card',
  templateUrl: './participant-card.component.html',
  styleUrls: ['./participant-card.component.css']
})
export class ParticipantCardComponent implements OnInit {
  @Input() participant: Participant;
  participantStatus: string;

  constructor() { }

  ngOnInit() {
    this.participantStatus = ParticipantStatus[this.participant.participantStatus];
  }

}
