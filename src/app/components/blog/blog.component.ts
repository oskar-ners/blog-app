import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../services/blog.service';
import { BlogPost } from '../../interfaces/blog-post.interface';
import { onAuthStateChanged } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { LogoutButtonComponent } from '../logout-button/logout-button.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [FormsModule, AsyncPipe, LogoutButtonComponent],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent implements OnInit {
  blogService = inject(BlogService);
  firebaseAuth = inject(Auth);

  title: string = '';
  description: string = '';
  editTitle: string = '';
  editDescription: string = '';
  blogPosts: BlogPost[] = [];

  async ngOnInit(): Promise<void> {
    onAuthStateChanged(this.firebaseAuth, async (user) => {
      if (user) {
        this.blogPosts = await this.blogService.getPosts();
      }
    });
  }

  async addPost(title: string, description: string): Promise<void> {
    if (!title || !description) return;
    await this.blogService.addPost(title, description);
    this.blogPosts = await this.blogService.getPosts();
    this.title = '';
    this.description = '';
  }

  async removePost(post: BlogPost): Promise<void> {
    this.blogService.deletePost(post);
    this.blogPosts = await this.blogService.getPosts();
  }

  async editPost(post: BlogPost): Promise<void> {
    if (!this.editTitle || !this.editDescription) return;
    await this.blogService.editPost(post, this.editTitle, this.editDescription);
    this.blogPosts = await this.blogService.getPosts();
    this.editTitle = '';
    this.editDescription = '';
  }
}
