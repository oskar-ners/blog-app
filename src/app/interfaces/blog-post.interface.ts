import { Timestamp } from 'firebase/firestore';
import { Comment } from './comment.interface';

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  isEditing?: boolean;
  imageUrl?: string;
  createdAt?: Timestamp;
  comments: Comment[];
}
