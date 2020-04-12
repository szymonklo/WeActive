import { User } from './user';
import { Participant } from './participant';

export interface Activity {

    id: number;
    name: string;
    hostId: number;
    host: User;
    hostUsername: string;
    hostPhotoUrl: string;

    privateActivity: boolean;

    dateCreated: Date;
    startDate: Date;
    flexStartDate: boolean;
    endDate: Date;
    flexEndDate: boolean;

    place: string;

    minParticipantsNumber: number;
    maxParticipantsNumber: number;
    participantsNumber: number;
    participants: Participant[];

    participantsListClosureTime: Date;

    confirmationTime: Date;

    status: Status;

    activityType: ActivityType;

}

export enum ActivityType {
    Undefined,
    Cycling,
    Trekking,
    Running,
    Climbing,
    Skiing
}

export enum Status {
    Undefined,
    Planed,
    Confirmed,
    Cancelled
}

