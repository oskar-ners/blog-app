import { Timestamp } from 'firebase/firestore';

export interface BlogPost {
  title: string;
  description: string;
  isEditing?: boolean;
  imageUrl?: string;
  createdAt?: Timestamp;
}
