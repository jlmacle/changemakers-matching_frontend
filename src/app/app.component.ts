import { Component, OnInit } from '@angular/core';
// TODO : to move later in a component
import {Project} from './models/project';
// TODO: comment to remove : page displayed before uncommenting and after
import { ProjectDataService } from './services/project-data.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  // page displays before uncommenting constructor + implements declaration
  // the issue appeears when calling the constructor
  constructor(private projectDataService: ProjectDataService){}
  
  ngOnInit(): void {
    console.log("Entering ngOnInit()");
    this.getProjects();
  }


  title = 'changemakers-matchmaking_front-end';

  // TODO: to move later in a component
  // TODO: to remember the quick fix for the lack of initializer
  projects: Array<Project> | undefined;

  
  getProjects()
  {
    this.projectDataService.getProjects().then
    (
      (data) =>
        {
          this.projects = data;
          console.log("Getting the projects data.");
        },

      (error) =>
        {
          console.log("Issue while getting the projects data.");
        }
    );
  }
  
}
