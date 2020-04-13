import { Component, OnInit, Input } from '@angular/core';
import { Participant, ParticipantStatus } from '../../_models/participant';
import { ActivatedRoute } from '@angular/router';
import { ActivityService } from 'src/app/_services/activity.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.css']
})
export class ParticipantListComponent implements OnInit {
  @Input() activityId: number;
  participants: Participant[];

  constructor(private route: ActivatedRoute, private activityService: ActivityService,
              private alertify: AlertifyService, private authService: AuthService) { }

  ngOnInit() {
    this.loadParticipants();
    // this.route.data.subscribe(data => {
    //   console.log('Data: ');
    //   console.log(data);
    //   console.log('Participants: ' + data['participants']);
    //   this.participants = data['participants'].result;
    // });
  }

  loadParticipants() {
    this.activityService.getParticipants(this.activityId)
      .subscribe((participants: Participant[]) => {
        this.participants = participants;
      }, error => {
        this.alertify.error(error);
      });
  }

  addParticipant() {
    console.log('joining started');
    let newParticipant: any = {};
    newParticipant.activityId = this.activityId;
    newParticipant.userId = this.authService.decodedToken.nameid;
    newParticipant.participantStatus = ParticipantStatus.Joined;
    this.activityService.addParticipant(
      this.activityId, this.authService.decodedToken.nameid, newParticipant)
      .subscribe(() => {
        this.alertify.success('You joined this activity');
      }, error => {
        this.alertify.error(error);
      });
    console.log('test_addParticipant_from_participant-list.component');

  }

}
