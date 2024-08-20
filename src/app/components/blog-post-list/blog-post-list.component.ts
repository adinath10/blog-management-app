import { Component, OnInit } from '@angular/core';
import { BlogPostService } from '../../services/blog-post.service';
import { BlogPost } from '../../models/blog-post.model';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

type SortKey = keyof BlogPost;

@Component({
  selector: 'app-blog-post-list',
  templateUrl: './blog-post-list.component.html',
  styleUrls: ['./blog-post-list.component.css']
})
export class BlogPostListComponent implements OnInit {
  blogPosts: BlogPost[] = [];
  filteredBlogPosts: BlogPost[] = [];
  paginatedBlogPosts: BlogPost[] = [];
  sortBy: SortKey = 'id';  // Default sort field
  sortOrder: 'asc' | 'desc' = 'asc';  // Default sort order
  searchTerm: string = '';  // Search term
  private searchTermSubject: Subject<string> = new Subject<string>();

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  pages: number[] = [];

  constructor(private blogPostService: BlogPostService) {}

  ngOnInit(): void {
    this.loadBlogPosts();

    // Set up the debounce time for search input
    this.searchTermSubject.pipe(
      debounceTime(300) // Adjust debounce time as needed
    ).subscribe(() => {
      this.applyFilters();
    });
  }

  loadBlogPosts(): void {
    this.blogPostService.getAll().subscribe(posts => {
      this.blogPosts = posts;
      this.applyFilters();
    });
  }

  deletePost(id: number): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.blogPostService.delete(id).subscribe(() => {
        this.loadBlogPosts();
      });
    }
  }

  sortPosts(posts: BlogPost[]): BlogPost[] {
    return posts.sort((a, b) => {
      const fieldA = a[this.sortBy];
      const fieldB = b[this.sortBy];

      let comparison = 0;
      if (fieldA < fieldB) comparison = -1;
      if (fieldA > fieldB) comparison = 1;

      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  onSortSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.sortBy = selectElement.value as SortKey;
    this.sortOrder = 'asc'; // Default to ascending order when changing sort field
    this.loadBlogPosts(); // Reload posts with the new sorting
  }

  toggleSortOrder(sortKey: SortKey): void {
    if (this.sortBy === sortKey) {
      // Toggle sortOrder if the same sortKey is selected
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Change sortBy and reset sortOrder to ascending
      this.sortBy = sortKey;
      this.sortOrder = 'asc';
    }
    this.loadBlogPosts(); // Reload posts with the new sorting
  }

  onSearchChange(term: string): void {
    this.searchTermSubject.next(term);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchTermSubject.next(''); // Pass an empty string to the subject
  }

  applyFilters(): void {
    // Apply sorting
    let sortedPosts = this.sortPosts(this.blogPosts);

    // Apply partial matching filtering
    if (this.searchTerm.trim()) {
      const lowerCaseSearchTerm = this.searchTerm.trim().toLowerCase();
      sortedPosts = sortedPosts.filter(post =>
        post.username.toLowerCase().includes(lowerCaseSearchTerm) ||
        post.text.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // Update filtered blog posts
    this.filteredBlogPosts = sortedPosts;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredBlogPosts.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.changePage(this.currentPage);
  }

  changePage(page: number): void {
    // Ensure the page number is within the valid range

    // Update the current page
    this.currentPage = page;

    // Calculate start and end indices for pagination
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = Math.min(start + this.itemsPerPage, this.filteredBlogPosts.length);

    // Slice the array for pagination
    this.paginatedBlogPosts = this.filteredBlogPosts.slice(start, end);

    if (page < 1 || page > this.totalPages) return;
  }
}