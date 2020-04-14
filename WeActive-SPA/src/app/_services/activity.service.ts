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

  // getUsers(page?, itemsPerPage?, userParams?, likeParams?): Observable<PaginatedResult<User[]>> {
  //   const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();

  //   let params = new HttpParams();

  //   if (page != null && itemsPerPage != null) {
  //     params = params.append('pageNumber', page);
  //     params = params.append('pageSize', itemsPerPage);
  //   }

  //   if (userParams != null)
  //   {
  //     params = params.append('minAge', userParams.minAge);
  //     params = params.append('maxAge', userParams.maxAge);
  //     params = params.append('gender', userParams.gender);
  //     params = params.append('orderBy', userParams.orderBy);
  //   }

  //   if(likeParams == 'Likers') {
  //     params = params.append('likers', 'true');
  //   }

  //   if(likeParams == 'Likees') {
  //     params = params.append('likees', 'true');
  //   }

  //   return this.http.get<User[]>(this.baseUrl + 'users', { observe: 'response', params})
  //     .pipe (
  //       map(response => {
  //         paginatedResult.result = response.body;
  //         // if (response.headers.get('Pagination') != null)
  //         {
  //           paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
  //         }
  //         return paginatedResult;
  //       })
  //     );
  // }

  getActivities(page?, itemsPerPage?, activityParams?, likeParams?): Observable<PaginatedResult<Activity[]>> {
    const paginatedResult: PaginatedResult<Activity[]> = new PaginatedResult<Activity[]>();
    
    let params = new HttpParams();  // temp

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    console.log('service params');
    console.log(activityParams);
    if (activityParams !== {})
    {
      console.log('notnull');
      params = params.append('activityType', activityParams.activityType);
      console.log(params);
    }

    return this.http.get<Activity[]>(this.baseUrl + 'activities', { observe: 'response', params})
      .pipe (
        map(response => {
          paginatedResult.result = response.body;
          // if (response.headers.get('Pagination') != null)
          {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );

    // return this.http.get<Activity>(this.baseUrl + 'activities/');
  }

  getActivity(id): Observable<Activity> {
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

  // getMessages(id: number, page?, itemsPerPage?, messageContainer?) {
  //   const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();

  //   let params = new HttpParams();

  //   params = params.append('MessageContainer', messageContainer);

  //   if (page != null && itemsPerPage != null) {
  //     params = params.append('pageNumber', page);
  //     params = params.append('pageSize', itemsPerPage);
  //   }

  //   return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages', {observe: 'response', params})
  //     .pipe(
  //       map(response => {
  //         paginatedResult.result = response.body;
  //         if (response.headers.get('Pagination') !== null) {
  //           paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
  //         }

  //         return paginatedResult;
  //       })
  //     );
  // }

  // getMessageThread(id: number, recipientId: number) {
  //   return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId)
  // }

  // sendMessage(id: number, message: Message) {
  //   return this.http.post(this.baseUrl + 'users/' + id + '/messages', message);
  // }
}
