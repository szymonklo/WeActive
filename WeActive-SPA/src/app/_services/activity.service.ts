import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Activity } from '../_models/activity';
import { PaginatedResult } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { Message } from '../_models/message';
import { Participant } from '../_models/participant';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getActivities(page?, itemsPerPage?, activityParams?, likeParams?): Observable<PaginatedResult<Activity[]>> {
    const paginatedResult: PaginatedResult<Activity[]> = new PaginatedResult<Activity[]>();
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    if (activityParams !== {}) {
      params = params.append('activityType', activityParams.activityType);
    }

    return this.http.get<Activity[]>(this.baseUrl + 'activities', { observe: 'response', params})
      .pipe (
        map(response => {
          paginatedResult.result = response.body;
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          return paginatedResult;
        })
      );
  }

  getActivity(id: number): Observable<Activity> {
    return this.http.get<Activity>(this.baseUrl + 'activities/' + id);
  }

  createActivity(activity: Activity) {
    return this.http.post(this.baseUrl + 'activities/', activity);
  }

  updateActivity(id: number, activity: Activity) {
    return this.http.put(this.baseUrl + 'activities/' + id, activity);
  }

  getParticipants(activityId: number) {
    return this.http.get(this.baseUrl + 'activities/' + activityId + '/participants');
  }

  addParticipant(activityId: number, userId: number, participant: Participant) {
    return this.http.post(this.baseUrl + 'activities/' + activityId + '/participants/' + userId, participant);
  }

  getComments(activityId: number) {
    return this.http.get<Comment[]>(this.baseUrl + 'comments/activities/' + activityId);
  }

  postComment(userId: number, comment: Comment) {
    console.log(userId);
    console.log(comment);
    return this.http.post(this.baseUrl + 'comments/' + userId, comment);
  }
}
