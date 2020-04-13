import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ActivityService } from '../_services/activity.service';
import { Activity } from '../_models/activity';
import { Participant } from '../_models/participant';

@Injectable()
export class ParticipantListResolver implements Resolve<Participant[]> {

    constructor(private activityService: ActivityService,
                private router: Router, private alertify: AlertifyService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Participant[]> {
        console.log('participantListResolver: ');
        console.log(route.params['activityId']);
        return this.activityService.getParticipants(route.params['activityId']).pipe(
            catchError(error => {
                this.alertify.error('Problem retrieving data');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }
}
