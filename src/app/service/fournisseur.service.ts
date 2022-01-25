import { HttpClient, HttpHeaders } from '@angular/common/http';
import { identifierModuleUrl } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Fournisseur } from '../Model/fournisseur';

@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  private societeLivraisonID = environment.societeLivraisonID;
  private apiServerUrl =  environment.apiBaseUrl;
  constructor(private http: HttpClient) { }

  public getFournisseurBySocieteLiv(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(`${this.apiServerUrl}/getPersonnelBySocieteLiv/${this.societeLivraisonID}`);
  }

  public updateFournisseur(fournisseur : Fournisseur): Observable<Fournisseur> {
    return this.http.put<Fournisseur>(`${this.apiServerUrl}/updatefournisseur`,fournisseur);
    
  }
  public getFournisseurById(id : number): Observable<Fournisseur> {
    return this.http.get<Fournisseur>(`${this.apiServerUrl}/findFournisseurById/${id}`);
  }

  public addFournisseur(fournisseur : Fournisseur): Observable<Fournisseur> {
    fournisseur.isDeleted=false;
    return this.http.post<Fournisseur>(`${this.apiServerUrl}/addfour`, fournisseur);
  }

  public deleteFournisseur(id : number): Observable<void> {
    return this.http.get<void>(`${this.apiServerUrl}/deleteLogiqueFournisseur/${id}`);
  } 
  public addFournisseurWithImage(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiServerUrl}/addFournisseurWithImage`, formData);
  }
  public updateFournisseurPhoto(formData: FormData): Observable<any> {
    return this.http.put(`${this.apiServerUrl}/updateFournisseurPhoto`, formData);
  }
  
  


}
