import { inject, Injectable } from '@angular/core';
import { CommunityMember } from '../interfaces/community-member.interface';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { BlogPost } from '../interfaces/blog-post.interface';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  auth = inject(Auth);
  firestore = inject(Firestore);

  async getCommunityMembersData(): Promise<CommunityMember[]> {
    try {
      const usersCollection = collection(this.firestore, 'users');
      const usersDocs = await getDocs(usersCollection);
      const usersData = usersDocs.docs.map(
        (doc) => doc.data() as CommunityMember
      );
      return usersData;
    } catch (error) {
      console.warn(
        'Something went wrong when you tried to get community members data!'
      );
      throw error;
    }
  }

  async getAuthorBlogPosts(uid: string): Promise<BlogPost[]> {
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      const userDoc = await getDoc(userDocRef);
      const userPosts = userDoc.data()?.['posts'] as BlogPost[];
      return userPosts;
    } catch (error) {
      console.warn(
        'Something went wrong when you tried to get author blog posts!'
      );
      throw error;
    }
  }
}
