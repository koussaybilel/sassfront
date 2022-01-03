import { HttpClient, HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Colis,HistoStateOnly } from '../Model/colis';


@Injectable({
  providedIn: 'root'
})
export class ColisService {
  private societeLivraisonID = environment.societeLivraisonID
  private fournisseurID = environment.fournisseurID;
  private apiServerUrl =  environment.apiBaseUrl;
  currentUser: User;
  //private fournisseurID
  constructor(private http: HttpClient,private _authenticationService: AuthenticationService) { 
   // this._authenticationService.currentUser.subscribe(x => (this.currentUser = x));
//this.fournisseurID=this.currentUser.iduser
  }

  public getAllColisByFournisseur(f:number): Observable<Colis[]> {
    return this.http.get<Colis[]>(`${this.apiServerUrl}/getAllColis/${f}`);
  }
  public getColisCree(f:number): Observable<Colis[]> {
    return this.http.get<Colis[]>(`${this.apiServerUrl}/getColis/${f}/Crée`);
  }
  public getColisEnStock(f:number): Observable<Colis[]> {
    return this.http.get<Colis[]>(`${this.apiServerUrl}/getColis/${f}/En stock`);
  }
  public getColisEnCoursLivraison(f:number): Observable<Colis[]> {
    return this.http.get<Colis[]>(`${this.apiServerUrl}/getColis/${f}/En cours de livraison`);
  }
  public getColisLivree(f:number): Observable<Colis[]> {
    return this.http.get<Colis[]>(`${this.apiServerUrl}/getColis/${f}/Livré`);
  }
  public getColisLivreePayee(f:number): Observable<Colis[]> {
    return this.http.get<Colis[]>(`${this.apiServerUrl}/getColis/${f}/Livré payé`);
  }
  public getColisPlanifierRetour(f:number): Observable<Colis[]> {
    return this.http.get<Colis[]>(`${this.apiServerUrl}/getColis/${f}/Planifié retour`);
  }
  public getColisRetournee(f:number): Observable<Colis[]> {
    return this.http.get<Colis[]>(`${this.apiServerUrl}/getColis/${f}/Retourné`);
  }
  public getColisAudit(reference : number): Observable<HistoStateOnly[]> {
    return this.http.get<HistoStateOnly[]>(`${this.apiServerUrl}/getColisAudit/${reference}`);
  }
  public countByEtat(etat : String,f:number): Observable<number> {
    return this.http.get<number>(`${this.apiServerUrl}/count/${f}/${etat}`);
  }
  public addColis(colis : Colis): Observable<Colis> {
    colis.etat = "Crée" ;
    return this.http.post<Colis>(`${this.apiServerUrl}/saveColis`, colis);
  }
  public updateColis(colis : Colis): Observable<Colis> {
    return this.http.put<Colis>(`${this.apiServerUrl}/updateColis`,colis);
  }
  public deleteColis(ref : number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/deleteColis/${ref}`);
  }
  public getGouvernorat(): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/gouvernorat`);
  }
  public getDelegation(gouvernoratId : String): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/delegation/${gouvernoratId}`);
  }
  public findColisByBarCode(bar_code: String): Observable<Colis> {
    return this.http.get<Colis>(`${this.apiServerUrl}/findColisByBarCode/${bar_code}`); }

  public findColisByRunsheet_code(runsheet_code: number): Observable<Colis[]> {
    return this.http.get<Colis[]>(`${this.apiServerUrl}/findColisByRunsheet_code/${runsheet_code}`); 
  }
  public RemoveColisFromRunsheet(reference: number): Observable<void> {
    return this.http.get<void>(`${this.apiServerUrl}/RemoveColisFromRunsheet/${reference}`); 
  }

  public getColisByFournisseur(f:number): Observable<Colis[]> {
      return this.http.get<Colis[]>(`${this.apiServerUrl}/getAllColis/${f}`);
  }
  public getDechargePdf(listReference : number[]): Observable<Blob> {
      return this.http.put(`${this.apiServerUrl}/pdfDecharge`,listReference,{responseType: 'blob'});
  }
  public getBordereauPdf(listReference : number[]): Observable<Blob> {
      return this.http.put(`${this.apiServerUrl}/pdfFactureDordereau`,listReference,{responseType: 'blob'});
  }
  public downloadExemplaire(data){
    const REQUEST_PARAMS = new HttpParams().set('fileName', data.fileName);
    const REQUEST_URI = `${this.apiServerUrl}/download`;
    return this.http.get(REQUEST_URI, {params: REQUEST_PARAMS,responseType: 'arraybuffer'})
  }
  public findColisByEtat(etat : String): Observable<Colis[]> {
      return this.http.get<Colis[]>(`${this.apiServerUrl}/findColisByEtat/${etat}`);
  }
  public findColisByService(service : String,f:number): Observable<Colis[]> {
    return this.http.get<Colis[]>(`${this.apiServerUrl}/getColisByService/${f}/${service}`);
}
public findAllColisByService(service : String): Observable<Colis[]> {
  return this.http.get<Colis[]>(`${this.apiServerUrl}/getAllColisByService/${service}`);
}
  public getColisBySocieteLiv(): Observable<Colis[]> {
      return this.http.get<Colis[]>(`${this.apiServerUrl}/getColisBySocieteLiv/${this.societeLivraisonID}`);
  }
public countColisByEtatAndSocieteLiv(etat : String): Observable<number> {
      return this.http.get<number>(`${this.apiServerUrl}/countColisByEtatAndSocieteLiv/${this.societeLivraisonID}/${etat}`);
  }
public getColisCreeBySocieteLiv(): Observable<Colis[]> {
    return this.http.get<Colis[]>(`${this.apiServerUrl}/getColisBySocieteLivAndEtat/${this.societeLivraisonID}/Crée`);
}
public getColisEnstockBySocieteLiv(): Observable<Colis[]> {
    return this.http.get<Colis[]>(`${this.apiServerUrl}/getColisBySocieteLivAndEtat/${this.societeLivraisonID}/En stock`);
}
public getColisEncoursDeLivraisonBySocieteLiv(): Observable<Colis[]> {
  return this.http.get<Colis[]>(`${this.apiServerUrl}/getColisBySocieteLivAndEtat/${this.societeLivraisonID}/En cours de livraison`);
}
public getColisLivreBySocieteLiv(): Observable<Colis[]> {
  return this.http.get<Colis[]>(`${this.apiServerUrl}/getColisBySocieteLivAndEtat/${this.societeLivraisonID}/Livré`);
}
public getColisLivrePayeBySocieteLiv(): Observable<Colis[]> {
  return this.http.get<Colis[]>(`${this.apiServerUrl}/getColisBySocieteLivAndEtat/${this.societeLivraisonID}/Livré payé`);
}
public getColisplanificationRetourBySocieteLiv(): Observable<Colis[]> {
  return this.http.get<Colis[]>(`${this.apiServerUrl}/getColisBySocieteLivAndEtat/${this.societeLivraisonID}/Planifié retour`);
}
public getColisRetourneBySocieteLiv(): Observable<Colis[]> {
  return this.http.get<Colis[]>(`${this.apiServerUrl}/getColisBySocieteLivAndEtat/${this.societeLivraisonID}/Retourné`);
}

}



