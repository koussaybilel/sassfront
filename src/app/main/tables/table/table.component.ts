import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ToastrService, GlobalConfig } from 'ngx-toastr';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';

import * as snippet from 'app/main/extensions/toastr/toastr.snippetcode';
import { TableService } from 'app/main/tables/table/table.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Fournisseur } from 'app/Model/fournisseur';
import { FournisseurService } from 'app/service/fournisseur.service'
import Stepper from 'bs-stepper';
import { HttpErrorResponse } from '@angular/common/http';
import { SocieteLivService } from 'app/service/societeLiv.service';
import { SocieteLiv } from 'app/Model/societeLiv';
import { ColisService } from 'app/service/colis.service';
import { Colis } from 'app/Model/colis';
import { NumberInput } from '@angular/cdk/coercion';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
;



@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TableComponent implements OnInit { 
  private _unsubscribeAll: Subject<any>;
  private tempData = [];

  public contentHeader: object;
  public rows: any;
  public selected = [];
  public kitchenSinkRows: any;
  public basicSelectedOption: number = 10;
  public ColumnMode = ColumnMode;
  public expanded = {};
  public exportCSVData;
  public displayForm : boolean = false ; 

  public nom_societeVar: String  ;
  public nom_fVar : String;
  public prenom_fVar  : String ;
  public tel_fVar : number  ; 
  public cinVar :number ; 
  public email_fVar : String ;
  public date_fin_contratVar : string  ;
  public adresse_societeVar : String ;
  public gouvernorat_societeVar: String  ;
  public localite_societeVar: String  ;
  public delegation_societeVar : String  ;
  public code_postal_societeVar : number ; 
  public adresse_livraisonVar : String;
  public gouvernorat_livraisonVar : String  ; 
  public localite_livraisonVar: String  ;
  public delegation_livraisonVar : String  ;
  public code_postal_livraisonVar  : number ;
  public prix_livraisonVar : number;
  public prix_retourVar : number;
  public passwordVar : String ; 
  public currentUser: User;
  private fournisseurID;
  public editFournisseur : Fournisseur;
  public deleteFournisseur: Fournisseur;
  public testSocieteLiv : SocieteLiv;
  public testFournisseur : Fournisseur ;
  public dateNow: Date = new Date();
  public problemDate:boolean;
  public disabledButton:boolean=false;

  userFile ;
  userFileName;
  public imagePath;
  imgURL: any;
  public message: string;
  
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

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;

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
      return d.nom_f.toLowerCase().startsWith(val) || d.prenom_f.toLowerCase().startsWith(val) || d.adresse_societe.toLowerCase().startsWith(val) || d.nom_societe.toLowerCase().startsWith(val) || d.tel_f.toString().toLowerCase().startsWith(val) ;
    });

    // update the rows
    this.kitchenSinkRows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;}
    else{
      this.ngOnInit();
    }
  }
 
  // private
  private horizontalWizardStepper: Stepper;
  public _snippetCodeTypes = snippet.snippetCodeTypes;

 
   /**
   * Horizontal Wizard Stepper Next
   *
   * @param data
   */
  horizontalWizardStepperNext(data) {
    let newDate = new Date(this.date_fin_contratVar)
    console.log(newDate)
    if (this.dateNow > newDate)
     { //data.form.valid = false;
      this.problemDate=true;
      } else {
        this.problemDate=false;
      }
console.log(this.problemDate)
     
    if (data.form.valid === true && this.problemDate===false ) {
      //this.problemDate=false;
      this.horizontalWizardStepper.next();
    }
  }
  /**
   * Horizontal Wizard Stepper Previous
   */
  horizontalWizardStepperPrevious() {
    this.horizontalWizardStepper.previous();
  }

  // private
  private toastRef: any;
  private options: GlobalConfig;

  /**
   * Constructor
   *
   * @param {DatatablesService} _datatablesService
   * @param {CoreTranslationService} _coreTranslationService
   * @param {ToastrService} _toastrService
   */
  constructor(private router: Router, private modalService: NgbModal, private _datatablesService: TableService, 
    private fournisseurService: FournisseurService,private colisService: ColisService, private _toastrService: ToastrService, 
    private societeLivraisonService: SocieteLivService,private _authenticationService: AuthenticationService) {
    this._unsubscribeAll = new Subject();
    this.horizontalWizardStepper
    this._authenticationService.currentUser.subscribe(x => (this.currentUser = x));
    this.fournisseurID=this.currentUser.iduser
  }

  ngOnInit() {
    var today = new Date().toISOString().split('T')[0];
document.getElementsByName("date_fin_contrat")[0]?.setAttribute('min', today);
console.log(today)
    this._datatablesService.onDatatablessChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.rows = response;
      console.log(this.rows)
      this.tempData = this.rows;
      this.kitchenSinkRows = this.rows;
      this.exportCSVData = this.rows;
    });
    if(document.querySelector('#stepper1')) {
      this.horizontalWizardStepper = new Stepper(document.querySelector('#stepper1'), {});

    }
    // content header
    this.contentHeader = {
      headerTitle: 'Gestion Fournisseur',
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
            name: 'Gestion Fournisseur',
            isLink: false
          }
        ]
      }
    };
  }

openUpdateModal(fournisseur : Fournisseur ,modalUpdate) {
    this.modalService.open(modalUpdate, {
      centered: true,
      size: 'lg'});
    this.editFournisseur= fournisseur;
  }
  
openDeleteModal(fournisseur : Fournisseur, modalDelete) 
  {
    this.modalService.open(modalDelete, {
      centered: true,
      windowClass: 'modal modal-danger' });
    this.deleteFournisseur= fournisseur;
  }
  openCreateModal(createModel) {
    
    this.modalService.open(createModel, {
      centered: true,
      size: 'lg' });
    }
  btnDisplayForm= function () 
  {
    this.displayForm = true ; 
  };

  btnAnnulerForm () 
  { 
    this.displayForm = false ; 
  };

async onAddFournisseurWithImage(HWForm : NgForm,HWForm2 : NgForm) {
  
  if (this.userFile)
    {
        if (HWForm2.form.valid === true)
          {     this.disabledButton=true;
                await this.societeLivraisonService.getSocieteLivById(1).toPromise().then(
                (response : SocieteLiv) =>{this.testSocieteLiv = response;})
                  
                const formData = new  FormData();
                this.testFournisseur=Object.assign(HWForm.value, HWForm2.value);
                this.testFournisseur.societeLiv=this.testSocieteLiv;
                const fournisseur = this.testFournisseur;
                formData.append('fournisseur',JSON.stringify(fournisseur));
                formData.append('file',this.userFile);
                await this.fournisseurService.addFournisseurWithImage(formData).toPromise().then( data => { console.log(data) ;
               
                  this._toastrService.success('Vous avez ajouté le fournisseur '+' avec succès ! ',
                  'Ajout avec succès !',{ toastClass: 'toast ngx-toastr', closeButton: true,timeOut:2000 }).onHidden.subscribe(res =>{ window.location.reload(); this.disabledButton=false;});


                });
                
               

          } 
        else 
          {
                this._toastrService.error('Vérifier que vous avez bien rempli le formulaire ! ',
                      "Échec d'ajout !",{ toastClass: 'toast ngx-toastr', closeButton: true, });
          }
    }
    else 
    {
        this.onAddFournisseur(HWForm,HWForm2);
    }
}

public async onAddFournisseur (HWForm : NgForm,HWForm2 : NgForm) :Promise<void> {
  if (HWForm2.form.valid === true)

      {   this.disabledButton=true;
          this.testFournisseur=Object.assign(HWForm.value, HWForm2.value); 
          await this.societeLivraisonService.getSocieteLivById(1).toPromise().then(
          (response : SocieteLiv) =>{this.testSocieteLiv = response;})

          this.testFournisseur.societeLiv=this.testSocieteLiv;
      
          await this.fournisseurService.addFournisseur(this.testFournisseur).toPromise().then(
            
            (response : Fournisseur )=> {console.log(response); 
            this._toastrService.success('Vous avez ajouté le fournisseur '+ ' avec succès ! ',
            'Ajout avec succès !',{ toastClass: 'toast ngx-toastr', closeButton: true,timeOut:2000 }).onHidden.subscribe(res => { HWForm2.reset();HWForm.reset();window.location.reload();this.disabledButton=false;});


            },
            (error : HttpErrorResponse) => { alert ( error.message) ; });
      } 
  else 
      {
          this._toastrService.error('Vérifier que vous avez bien rempli le formulaire !  ',
          "Échec d'ajout !",{ toastClass: 'toast ngx-toastr', closeButton: true,});
      }
}

public async onUpdateFournisseur (fournisseur : Fournisseur) :Promise<void> {
    let listColis : Colis[];
    await this.colisService.getColisByFournisseur(this.fournisseurID).toPromise().then(
    (response : Colis[])=>{ listColis = response ;})

    fournisseur.colis= listColis; 
    await this.societeLivraisonService.getSocieteLivById(1).toPromise().then(
    (response : SocieteLiv) =>{this.testSocieteLiv = response;})

    fournisseur.societeLiv=this.testSocieteLiv;
    await this.fournisseurService.updateFournisseur(fournisseur).toPromise().then(
      (response : Fournisseur )=> {console.log(response);
        this._toastrService.success('Vous avez modifié le fournisseur '+ response.iduser +' avec succès ! ',
        'Modification avec succès !',{ toastClass: 'toast ngx-toastr', closeButton: true,timeOut:2000 }).onHidden.subscribe(res => window.location.reload());



        document.getElementById('btnAnnulerUpdate').click(); 
       // window.location.reload();
      },

      (error : HttpErrorResponse) => { alert ( error.message) ;
      this._toastrService.error('Vérifier que vous avez bien rempli le formulaire ! ',
      "Échec Modification !",{ toastClass: 'toast ngx-toastr', closeButton: true,});}); 
}
async updateFournisseurPhoto(fournisseur : Fournisseur) {
  
  if (this.userFile)
    {
        const formData = new  FormData();;
        console.log(fournisseur);
        formData.append('fournisseur',JSON.stringify(fournisseur));
        formData.append('file',this.userFile);

        await this.fournisseurService.updateFournisseurPhoto(formData).toPromise().then(
        data => { console.log(data) ;});
      window.location.reload();
    }
}
uploadImage(event) {
  if (event.target.files.length > 0)
  {
    const file = event.target.files[0];
    this.userFile = file;  
    var mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) 
      {
          this.message = "Only images are supported.";
          return;
      }
    var reader = new FileReader();
    this.imagePath = file;
    reader.readAsDataURL(file); 
    reader.onload = (_event) => { this.imgURL = reader.result; }
    this.updateFournisseurPhoto(this.editFournisseur);
}
}
public onDeleteFournisseur (fournisseurId : number) :void {
  
  this.fournisseurService.deleteFournisseur(fournisseurId).subscribe(
    (response : void )=> {console.log(response);});

    document.getElementById('btnAnnulerDelete').click(); 
    this._toastrService.success('Vous avez supprimé le fournisseur '+ fournisseurId +' avec succès ! ',
    'Suppression avec succès !',{ toastClass: 'toast ngx-toastr', closeButton: true,timeOut:2000 }).onHidden.subscribe(res => window.location.reload());


}

  onSelectImage(event) {
    if (event.target.files.length > 0)
    {
      const file = event.target.files[0];
      this.userFile = file;  
      this.userFileName=file.name

      var mimeType = event.target.files[0].type;
      if (mimeType.match(/image\/*/) == null) 
        {
            this.message = "Only images are supported.";
            return;
        }
      var reader = new FileReader();
      this.imagePath = file;
      reader.readAsDataURL(file); 
      reader.onload = (_event) => { this.imgURL = reader.result; }
  }
}

update(){
  //this.editFournisseur.delegation_livraison=this.editFournisseur.delegation_societe;
}

}