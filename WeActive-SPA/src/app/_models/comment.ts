export interface Comment {
    id: number;
    senderId: number;
    senderUsername: string;
    senderPhotoUrl: string;

    activityId: number;

    content: string;
    timeSent: Date;

    parentId?: number;

    // replies?: Comment[];
}
