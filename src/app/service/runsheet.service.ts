import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Runsheet } from '../Model/runsheet';

@Injectable({
  providedIn: 'root'
})
export class RunsheetService {

  private apiServerUrl =  environment.apiBaseUrl;
  constructor(private http: HttpClient) { }


  public addRunsheet(runsheet : Runsheet): Observable<Runsheet> {
    runsheet.etat_debrief='Non debrifié'
     return this.http.post<Runsheet>(`${this.apiServerUrl}/add-Runsheet`, runsheet);
  }
  public getRunsheetById(ref : number): Observable<Runsheet> {
    return this.http.get<Runsheet>(`${this.apiServerUrl}/retrieve-Runsheet/${ref}`);
  }
  public updateRunsheet(runsheet : Runsheet): Observable<Runsheet> {
    return this.http.put<Runsheet>(`${this.apiServerUrl}/modify-Runsheet`,runsheet); 
  }
  public deleteRunsheet(ref : number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/remove-Runsheet/${ref}`);
  }
  public getRunsheetPdf(ref : number): Observable<Blob> {
    return this.http.get(`${this.apiServerUrl}/runsheet/${ref}`,{responseType: 'blob' });
  }
  public addColisToRunsheet(code_runsheet : number, bar_codeList: String[] ): Observable<String> {
    return this.http.put<String>(`${this.apiServerUrl}/addColisToRunsheet/${code_runsheet}`,bar_codeList);
  }
  public totalCodPerRunsheet(ref : number): Observable<number> {
    return this.http.get<number>(`${this.apiServerUrl}/totalCodPerRunsheet/${ref}`);
  }
  
}
