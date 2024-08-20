import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';

@Injectable({
  providedIn: 'root'
})
export class BlogPostService {
  private apiUrl = 'https://localhost:5001/api/BlogPosts/';

  constructor(private http: HttpClient) { }

  getAll(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(this.apiUrl + 'GetBlogs').pipe(
      catchError(error => {
        console.error('Error fetching blog posts', error);
        return of([]); // Return an empty array or handle the error accordingly
      })
    );
  }

  getById(id: number): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.apiUrl + 'GetBlogs?id='}${id}`);
  }

  create(post: BlogPost): Observable<BlogPost> {
    post.id = 0;
    return this.http.post<BlogPost>(this.apiUrl + 'AddBlogs', post);
  }

  update(post: BlogPost): Observable<void> {
    return this.http.put<void>(`${this.apiUrl + 'UpdateBlog/'}${post.id}`, post);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl + 'DeleteBlog/'}${id}`);
  }
}