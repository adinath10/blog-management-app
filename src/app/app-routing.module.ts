import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogPostListComponent } from './components/blog-post-list/blog-post-list.component';
import { BlogPostFormComponent } from './components/blog-post-form/blog-post-form.component';

const routes: Routes = [
  { path: '', component: BlogPostListComponent },
  { path: 'edit/:id', component: BlogPostFormComponent },
  { path: 'add', component: BlogPostFormComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }