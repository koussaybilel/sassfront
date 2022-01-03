import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';

import { DatatablesService } from 'app/main/tables/datatables/datatables.service';
import { HistoStateOnly } from 'app/Model/colis';
import { HttpErrorResponse } from '@angular/common/http';
import { ColisService } from 'app/service/colis.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FournisseurService } from 'app/service/fournisseur.service';
import { Fournisseur } from 'app/Model/fournisseur';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';


@Component({
  selector: 'app-datatables',
  templateUrl: './datatables.component.html',
  styleUrls: ['./datatables.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DatatablesComponent implements OnInit {
 
  private _unsubscribeAll: Subject<any>;
  private tempData = [];
  public listFournisseur : any[];
  public contentHeader: object;
  public rows: any;
  public kitchenSinkRows: any;
  public selectedFour;
  public currentUser: User;
  private fournisseurID;
  public basicSelectedOption: number = 10;
  public ColumnMode = ColumnMode;
  public expanded = {};
  public SelectionType = SelectionType;    
  public listeState : HistoStateOnly[];
  public displayRows : number =0;
  public totalstate={
    cree: 0, 
    en_stock: 0,
    encours_de_livraison :0,
    livree: 0,
    livre_paye:0,
    planifier_retour :0,
    retournee :0,
    total: 0,
  }
  
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;

  // Public Methods
  // -----------------------------------------------------------------------------------------------------
  /**
   * Search (filter)
   *
   * @param event
   */
  filterUpdate(event) {
    const val = event.target.value.toLowerCase();
    if (val !=""){

    // filter our data
   /// console.log(this.kitchenSinkRows)
    const temp = this.tempData.filter(function (d) {
      
      return d.nom_c.toLowerCase().startsWith(val) || d.prenom_c.toLowerCase().startsWith(val) || d.bar_code.toString().toLowerCase().startsWith(val) || d.tel_c_1.toString().toLowerCase().startsWith(val) || d.cod.toString().toLowerCase().startsWith(val) || d.etat.toLowerCase().startsWith(val) || d.service.toLowerCase().startsWith(val)   ;

    });
    // update the rows
    this.kitchenSinkRows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;}
    else {
      this.ngOnInit();
    }  }

  /**
   * Constructor
   *
   * @param {DatatablesService} _datatablesService
   * @param {CoreTranslationService} _coreTranslationService
   */
  constructor(private modalService: NgbModal, private colisService: ColisService,
    private _datatablesService: DatatablesService,private serviceFournisseur : FournisseurService,private _authenticationService: AuthenticationService) {
    this._unsubscribeAll = new Subject();
    this._authenticationService.currentUser.subscribe(x => (this.currentUser = x));
    this.fournisseurID=this.currentUser.iduser
  }

  setDisplayRows(num?:number){
    
    this.displayRows=num ;
    this.ngOnInit();
  }

   ngOnInit() {
    this.serviceFournisseur.getFournisseurBySocieteLiv().subscribe(
      res=>{ this.listFournisseur=res
              // console.log(this.listFournisseur)

      }
    )
    this._datatablesService.onDatatablessChanged2.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
     this.rows = response;
      this.tempData = this.rows;
      if (this.displayRows==0)
      {this.kitchenSinkRows = this.rows;}
      this.countByEtat ();
    });
    this.colisService.getColisCree(this.fournisseurID).subscribe(response =>{
      this.rows = response;
      this.tempData = this.rows;
      if (this.displayRows==1)
      {this.kitchenSinkRows = this.rows;}
    } )
    this.colisService.getColisEnStock(this.fournisseurID).subscribe(response =>{
      this.rows = response;
      this.tempData = this.rows;
      if (this.displayRows==2)
      {this.kitchenSinkRows = this.rows;}
    } )
    this.colisService.getColisEnCoursLivraison(this.fournisseurID).subscribe(response =>{
      this.rows = response;
      this.tempData = this.rows;
      if (this.displayRows==3)
      {this.kitchenSinkRows = this.rows;}
    } )
    this.colisService.getColisLivree(this.fournisseurID).subscribe(response =>{
      this.rows = response;
      this.tempData = this.rows;
      if (this.displayRows==4)
      {this.kitchenSinkRows = this.rows;}
    } )
    this.colisService.getColisLivreePayee(this.fournisseurID).subscribe(response =>{
      this.rows = response;
      this.tempData = this.rows;
      if (this.displayRows==5)
      {this.kitchenSinkRows = this.rows;}
    } )
    this.colisService.getColisPlanifierRetour(this.fournisseurID).subscribe(response =>{
      this.rows = response;
      this.tempData = this.rows;
      if (this.displayRows==6)
      {this.kitchenSinkRows = this.rows;}
    } )
    this.colisService.getColisRetournee(this.fournisseurID).subscribe(response =>{
      this.rows = response;
      this.tempData = this.rows;
      if (this.displayRows==7)
      {this.kitchenSinkRows = this.rows;}
    } )
     
    this.contentHeader = {
      headerTitle: 'Gestion des colis',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'gestion des colis',
            isLink: false
          }
        ]
      }
    };
  }

  modalOpenVC(modalVC, reference? : number) {
    this.getAuditColis(reference);
    this.modalService.open(modalVC, {
      centered: true,
    });
  }  
  
  public getAuditColis (ref : number): void {
    
    this.colisService.getColisAudit(ref).subscribe(
      (response : HistoStateOnly[])=>{ this.listeState = response ; }, 
      (error:HttpErrorResponse) => { alert(error.message); } );
  }
    
  public countByEtat (): void{
    this.colisService.countColisByEtatAndSocieteLiv('Crée').subscribe(
    (response : number) =>{this.totalstate.cree= response;
      this.totalstate.total=this.totalstate.cree;}
    )
    this.colisService.countColisByEtatAndSocieteLiv('En stock').subscribe(
      (response : number) =>{this.totalstate.en_stock= response;
        this.totalstate.total+=this.totalstate.en_stock;}
      )
    this.colisService.countColisByEtatAndSocieteLiv('Livré').subscribe(
      (response : number) =>{this.totalstate.livree= response;
        this.totalstate.total+=this.totalstate.livree;}
      )
    this.colisService.countColisByEtatAndSocieteLiv('En cours de livraison').subscribe(
      (response : number) =>{this.totalstate.encours_de_livraison= response;
        this.totalstate.total+=this.totalstate.encours_de_livraison;}
      )
    this.colisService.countColisByEtatAndSocieteLiv('Livré payé').subscribe(
      (response : number) =>{this.totalstate.livre_paye= response;
        this.totalstate.total+=this.totalstate.livre_paye;}
      )
    this.colisService.countColisByEtatAndSocieteLiv('Planifié retour').subscribe(
      (response : number) =>{this.totalstate.planifier_retour= response;
         this.totalstate.total+=this.totalstate.planifier_retour;}
      )
    this.colisService.countColisByEtatAndSocieteLiv('Retourné').subscribe(
      (response : number) =>{this.totalstate.retournee= response;
        this.totalstate.total+=this.totalstate.retournee;}
      )
          
  }
  filterFournisseur(s:string){
    if (s!="none"){
      this._datatablesService.onDatatablessChanged2.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
        this.rows = response;
         this.tempData = this.rows;
         if (this.displayRows==0)
         {this.kitchenSinkRows = this.rows;}
         this.countByEtat ();
       });


     const temp = this.kitchenSinkRows.filter(function (d) {
       // console.log(d)
        return d.fournisseur.nom_societe.toLowerCase()===s.toLowerCase() ;
  
      });
      console.log(temp)
      // update the rows
      this.kitchenSinkRows = temp;
      // Whenever the filter changes, always go back to the first page
      this.table.offset = 0;
      
    } else {
      this.ngOnInit()
    }
  }
  
}
