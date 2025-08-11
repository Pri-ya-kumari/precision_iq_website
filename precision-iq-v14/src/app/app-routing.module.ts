import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { BlogFormComponent } from './blog-form/blog-form.component';
import { NewsDetailsComponent } from './news-details/news-details.component';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent, // Show this component when visiting the root path
  },
  { path: 'login', component: LoginComponent },
  { path: 'create-blog', component: BlogFormComponent },
  { path: 'news-details/:id', component: NewsDetailsComponent },
  { path: '**', redirectTo: '' }  // Redirect any other invalid path to the root
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
