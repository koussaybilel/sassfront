import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { SocieteLiv } from '../Model/societeLiv';

@Injectable({
  providedIn: 'root'
})

export class SocieteLivService {

    private apiServerUrl =  environment.apiBaseUrl;
    constructor(private http: HttpClient) { }

    public getSocieteLivById(id : number): Observable<SocieteLiv> {
        return this.http.get<SocieteLiv>(`${this.apiServerUrl}/retrieve-SocieteLiv/${id}`);
    }

    
}