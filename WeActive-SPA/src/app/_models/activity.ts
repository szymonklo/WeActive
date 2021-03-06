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

    description: string;

}

export enum ActivityType {
    Undefined,
    Cycling,
    Running,
    Trekking,
    Climbing,
    Skiing
}

export enum Status {
    Undefined,
    Planned,
    Confirmed,
    Cancelled
}

