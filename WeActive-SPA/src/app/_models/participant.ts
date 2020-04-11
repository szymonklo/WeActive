import { Activity } from './activity';
import { User } from './user';

export interface Participant {
    activityId: number;
    activity: Activity;
    userId: number;
    user: User;
    participantStatus: ParticipantStatus;
}

export enum ParticipantStatus {
    Joined,
    Interested,
    Unconfirmed,
    Resigned
}
