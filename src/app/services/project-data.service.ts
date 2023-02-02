import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Variables} from '../environments/variables';


@Injectable({
  providedIn: 'root',
})
export class ProjectDataService {
  constructor(private http: HttpClient) { }

  getProjects(): Promise<any> {
    
    console.log("Entering getProjects()");
    let results:unknown = this.http.get(Variables.baseUrl + '/projects').toPromise();
    console.log("Base URL "+Variables.baseUrl);    
    return (results as Promise<any>);
  }
  
}
