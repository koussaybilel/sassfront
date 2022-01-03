
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';

import { DatatablesService } from 'app/main/tables/datatables/datatables.service';
import { Colis, HistoStateOnly } from 'app/Model/colis';
import { HttpErrorResponse } from '@angular/common/http';
import { ColisService } from 'app/service/colis.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Fournisseur } from 'app/Model/fournisseur';
import { FournisseurService } from 'app/service/fournisseur.service';
import Stepper from 'bs-stepper';
import { AuthenticationService } from 'app/auth/service/authentication.service';
import { User } from 'app/auth/models';


@Component({
  selector: 'app-form-validation',
  templateUrl: './form-validation.component.html',
  styleUrls: ['./form-validation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FormValidationComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  private tempData = [];
  
  public contentHeader: object;
  public rows: any;
  public kitchenSinkRows: any;
  public basicSelectedOption: number = 10;
  public ColumnMode = ColumnMode;
  public expanded = {};
  public SelectionType = SelectionType; 
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
  public displayForm : boolean = false ;
  public editColis : Colis;
  public deleteColis: Colis;
  public testColis : Colis ; 
  public testFournisseur : Fournisseur;
  public listFournisseur : Fournisseur[];
  private horizontalWizardStepper: Stepper;
  private bsStepper;
public currentUser: User;
private fournisseurID;

  public referenceVar  ; 
	public nom_cVar;
	public prenom_cVar; 
	public tel_c_1Var;
	public tel_c_2Var; 
	public date_creationVar;
	public adresseVar; 
	public gouvernoratVar; 
	public delegationVar ;
	public localiteVar;
	public code_postalVar; 
	public codVar; 
	public mode_paiementVar; 
	public serviceVar ;
	public designationVar;
	public remarqueVar; 
	public etatVar ;
	public anomalieVar;
	public nb_pVar ; 
	public longeurVar;
	public largeurVar;
	public hauteurVar ;
	public poidsVar;
  public fournisseur_idVar;
  public fournisseurVar; 

  

  public gouvernoratList =[
    {value:'ARIANA', viewValue: 'ARIANA'},
		{value:'BEJA', viewValue: 'BEJA'},
		{value:'BEN AROUS', viewValue: 'BEN AROUS'},
		{value:'BIZERTE', viewValue: 'BIZERTE'},
		{value:'GABES', viewValue: 'GABES'},
		{value:'GAFSA', viewValue: 'GAFSA'},
		{value:'JENDOUBA', viewValue: 'JENDOUBA'},
		{value:'KAIROUAN', viewValue: 'KAIROUAN'},
		{value:'KASSERINE', viewValue: 'KASSERINE'},
		{value:'KEBILI', viewValue: 'KEBILI'},
		{value:'KEF', viewValue: 'KEF'},
		{value:'MAHDIA', viewValue: 'MAHDIA'},
		{value:'MANOUBA', viewValue: 'MANOUBA'},
		{value:'MEDENINE', viewValue: 'MEDENINE'},
		{value:'MONASTIR', viewValue: 'MONASTIR'},
		{value:'NABEUL', viewValue: 'NABEUL'},
		{value:'SFAX', viewValue: 'SFAX'},
		{value:'SIDI BOUZID', viewValue: 'SIDI BOUZID'},
		{value:'SILIANA', viewValue: 'SILIANA'},
		{value:'SOUSSE', viewValue: 'SOUSSE'},
		{value:'TATAOUINE', viewValue: 'TATAOUINE'},
		{value:'TOZEUR', viewValue: 'TOZEUR'},
		{value:'TUNIS', viewValue: 'TUNIS'},
		{value:'ZAGHOUAN', viewValue: 'ZAGHOUAN'},
]

  public services = [
    {value: 'Livraison', viewValue: 'Livraison'},
    {value: 'Echange', viewValue: 'Echange'},
  ];
  mode_pay = [
    {value: 'Traite', viewValue: 'Traite'},
    {value: 'Chéque', viewValue: 'Chéque'},
    {value: 'Virement', viewValue: 'Virement'},
    {value: 'Espèce', viewValue: 'Espèse'},
  ];
  listEtat = ['Crée','En stock','En cours de livraison',
              'Livré','Livré payé','Planifié retour', 'Retourné'];
             
             
   @ViewChild(DatatableComponent) table: DatatableComponent;
   @ViewChild('tableRowDetails') tableRowDetails: any;
  /**
   * Horizontal Wizard Stepper Next
   *
   * @param data
   */
   horizontalWizardStepperNext(data) {
    if (data.form.valid === true) {
      this.horizontalWizardStepper.next();
    }
  }
  /**
   * Horizontal Wizard Stepper Previous
   */
  horizontalWizardStepperPrevious() {
    this.horizontalWizardStepper.previous();
  }
/**
   * Search (filter)
   *
   * @param event
   */
 filterUpdate(event) {
    
  const val = event.target.value.toLowerCase();
  if (val !=""){
  // filter our data
  const temp = this.tempData.filter(function (d) {
    return d.nom_c.toLowerCase().startsWith(val) || d.prenom_c.toLowerCase().startsWith(val) || d.etat.toLowerCase().startsWith(val) || d.service.toLowerCase().startsWith(val) || d.bar_code.toLowerCase().startsWith(val) || d.tel_c_1.toString().toLowerCase().startsWith(val) || d.cod.toString().toLowerCase().startsWith(val) ;
  });

  // update the rows
  this.kitchenSinkRows = temp;    // Whenever the filter changes, always go back to the first page
  this.table.offset = 0;}
  else{
    this.ngOnInit();
  }
}
  constructor(private modalService: NgbModal, private colisService: ColisService
    ,private _toastrService: ToastrService, private serviceFournisseur : FournisseurService,private _authenticationService: AuthenticationService) {
    this._unsubscribeAll = new Subject();
    this._authenticationService.currentUser.subscribe(x => (this.currentUser = x));
    this.fournisseurID=this.currentUser.iduser


  }

  ngOnInit() {
    this.horizontalWizardStepper = new Stepper(document.querySelector('#stepper1'), {});
    this.bsStepper = document.querySelectorAll('.bs-stepper');

    this.colisService.getAllColisByFournisseur(this.fournisseurID).subscribe(response => {
      console.log(response)
      this.rows = response;
       this.tempData = this.rows;
       if (this.displayRows==0)
       {this.kitchenSinkRows = this.rows;}
       this.countByEtatAndSociete ();
      });
      this.colisService.getColisCreeBySocieteLiv().subscribe(response =>{
        console.log(response)

        this.rows = response;
        this.tempData = this.rows;
        if (this.displayRows==1)
        {this.kitchenSinkRows = this.rows;}
      } )
      this.colisService.getColisEnstockBySocieteLiv().subscribe(response =>{
        this.rows = response;
        this.tempData = this.rows;
        if (this.displayRows==2)
        {this.kitchenSinkRows = this.rows;}
      } )
      this.colisService.getColisEncoursDeLivraisonBySocieteLiv().subscribe(response =>{
        this.rows = response;
        this.tempData = this.rows;
        if (this.displayRows==3)
        {this.kitchenSinkRows = this.rows;}
      } )
      this.colisService.getColisLivreBySocieteLiv().subscribe(response =>{
        this.rows = response;
        this.tempData = this.rows;
        if (this.displayRows==4)
        {this.kitchenSinkRows = this.rows;}
      } )
      this.colisService.getColisLivrePayeBySocieteLiv().subscribe(response =>{
        this.rows = response;
        this.tempData = this.rows;
        if (this.displayRows==5)
        {this.kitchenSinkRows = this.rows;}
      } )
      this.colisService.getColisplanificationRetourBySocieteLiv().subscribe(response =>{
        this.rows = response;
        this.tempData = this.rows;
        if (this.displayRows==6)
        {this.kitchenSinkRows = this.rows;}
      } )
      this.colisService.getColisRetourneBySocieteLiv().subscribe(response =>{
        this.rows = response;
        this.tempData = this.rows;
        if (this.displayRows==7)
        {this.kitchenSinkRows = this.rows;}
      } )
    this.contentHeader = {
      headerTitle: 'Gestion Colis',
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
            name: 'Gestion Colis',
            isLink: false
          }
        ]
      }
    };
  }
  public countByEtatAndSociete (): void{
    this.colisService.countByEtat('Crée',this.fournisseurID).subscribe(
    (response : number) =>{this.totalstate.cree= response;
      this.totalstate.total=this.totalstate.cree;}
    )
    this.colisService.countByEtat('En stock',this.fournisseurID).subscribe(
      (response : number) =>{this.totalstate.en_stock= response;
        this.totalstate.total+=this.totalstate.en_stock;}
      )
    this.colisService.countByEtat('Livré',this.fournisseurID).subscribe(
      (response : number) =>{this.totalstate.livree= response;
        this.totalstate.total+=this.totalstate.livree;}
      )
    this.colisService.countByEtat('En cours de livraison',this.fournisseurID).subscribe(
      (response : number) =>{this.totalstate.encours_de_livraison= response;
        this.totalstate.total+=this.totalstate.encours_de_livraison;}
      )
    this.colisService.countByEtat('Livré payé',this.fournisseurID).subscribe(
      (response : number) =>{this.totalstate.livre_paye= response;
        this.totalstate.total+=this.totalstate.livre_paye;}
      )
    this.colisService.countByEtat('Planifié retour',this.fournisseurID).subscribe(
      (response : number) =>{this.totalstate.planifier_retour= response;
         this.totalstate.total+=this.totalstate.planifier_retour;}
      )
    this.colisService.countByEtat('Retourné',this.fournisseurID).subscribe(
      (response : number) =>{this.totalstate.retournee= response;
        this.totalstate.total+=this.totalstate.retournee;}
      )  
      this.getListFournisseur();
     // console.log(this.getListFournisseur())
  }
  setDisplayRows(num?:number){
    this.displayRows=num ;
    this.ngOnInit();
  }
  openUpdateModal(colis : Colis ,modalUpdate) {
  this.modalService.open(modalUpdate, {
    centered: true,
    size: 'lg' });
  this.editColis= colis;
  }
openDeleteModal(colis : Colis, modalDelete) {
  this.modalService.open(modalDelete, {
    centered: true,
    windowClass: 'modal modal-danger'});
  this.deleteColis= colis;
  }
btnDisplayForm () {
  this.displayForm = true ; 
};
btnAnnulerForm () {
  this.displayForm = false ; 
};
public getListFournisseur()
  {
    this.serviceFournisseur.getFournisseurBySocieteLiv().subscribe(
      (response : Fournisseur[])=>{this.listFournisseur=response}
    )
}
public async onAddColis (HWForm : NgForm,HWForm2 : NgForm) :Promise<void> {
  if (HWForm2.form.valid === true)

      {
          this.testColis=Object.assign(HWForm.value, HWForm2.value); 
          await this.serviceFournisseur.getFournisseurById(this.fournisseurID).toPromise().then(
          (response : Fournisseur)=> {console.log(response); this.testFournisseur= response;},
          (error : HttpErrorResponse) => { alert ( error.message)});

          this.testColis.fournisseur= this.testFournisseur;

          await this.colisService.addColis(this.testColis).toPromise().then(
          (response : Colis )=> {console.log(response); 
          this._toastrService.success('Vous avez ajouté le colis '+ response.reference +' avec succès ! ',
          'Ajout avec succès !',{ toastClass: 'toast ngx-toastr', closeButton: true,timeOut:2000 }).onHidden.subscribe(res =>{HWForm2.reset(); HWForm.reset(); window.location.reload()});
        },
            
          (error : HttpErrorResponse) => { console.log(error.message) ; });
         // window.location.reload();
      } 
  else 
      {
            this._toastrService.error('Vérifier que vous avez bien rempli le formulaire ! ',
            "Échec d'ajout !", { toastClass: 'toast ngx-toastr', closeButton: true,});
      }

}
public async onUpdateColis (colis : Colis) :Promise<void> {
            
  await this.colisService.updateColis(this.editColis).toPromise().then(
    (response : Colis )=> {console.log(response);
      this._toastrService.success('Vous avez modifié le colis '+ response.reference +' avec succès ! ',
      'Modification avec succès !',{ toastClass: 'toast ngx-toastr', closeButton: true,});   
      document.getElementById('btnAnnulerUpdate').click(); 
      // window.location.reload();
      },

       (error : HttpErrorResponse) => { alert ( error.message) ;
      this._toastrService.error('Vérifier que vous avez bien rempli le formulaire ! ', "Échec Modification !",
      { toastClass: 'toast ngx-toastr', closeButton: true,});});
  
    
}
public onDeleteColis (colisId : number) :void {
    
  this.colisService.deleteColis(colisId).subscribe(
    
    (response : void )=> {console.log(response);} );
    document.getElementById('btnAnnulerDelete').click(); 
    this._toastrService.success('Vous avez supprimé le colis '+ colisId +' avec succès ! ',
    'Suppression avec succès !',{ toastClass: 'toast ngx-toastr', closeButton: true,});  
    window.location.reload();
}
}
