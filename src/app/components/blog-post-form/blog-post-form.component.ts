import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogPostService } from '../../services/blog-post.service';
import { BlogPost } from '../../models/blog-post.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-blog-post-form',
  templateUrl: './blog-post-form.component.html',
  styleUrls: ['./blog-post-form.component.css']
})
export class BlogPostFormComponent implements OnInit {
  blogPostForm: FormGroup;
  isEditMode = false;
  postId: number | null = null;
  maxDate: string;

  constructor(
    private fb: FormBuilder,
    private blogPostService: BlogPostService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    const today = new Date().toISOString().split('T')[0];
    this.maxDate = today;
    
    this.blogPostForm = this.fb.group({
      id: [null],
      username: ['', Validators.required],
      dateCreated: ['', Validators.required],
      text: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.postId = +params.get('id')!;
      if (this.postId) {
        this.isEditMode = true;
        this.loadPost();
      }
    });
  }

  loadPost(): void {
    this.blogPostService.getById(this.postId!).subscribe(post => {
      post.dateCreated = formatDate(post.dateCreated, 'yyyy-MM-dd', 'en-US');
      this.blogPostForm.patchValue(post);
    });
  }

  onSubmit(): void {
    if (this.blogPostForm.invalid) {
      return;
    }

    const blogPost: BlogPost = this.blogPostForm.value;
    if (this.isEditMode) {
      this.blogPostService.update(blogPost).subscribe(() => {
        this.router.navigate(['/']);
      });
    } else {
      this.blogPostService.create(blogPost).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}