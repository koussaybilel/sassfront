import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import { repeaterAnimation } from 'app/main/forms/form-repeater/form-repeater.animation';
import { Personnel } from 'app/Model/personnel';
import { NgForm } from '@angular/forms'
import { PersonnelService } from 'app/service/personnel.service'
import { FormRepeaterService } from './form-repeater.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { ColumnMode, DatatableComponent} from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { HubService } from 'app/service/hub.service';
import { Hub } from 'app/Model/hub';
@Component({
  selector: 'app-form-repeater',
  templateUrl: './form-repeater.component.html',
  styleUrls: ['./form-repeater.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [repeaterAnimation]
})
export class FormRepeaterComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;//
  private tempData = [];//

  // public
  public contentHeader: object;
  public rows: any;//
  public selected = [];
  public  listPersonnel: any;//
  public basicSelectedOption: number = 10;
  public ColumnMode = ColumnMode;
  public expanded = {};
  public exportCSVData;//

  public roles = [
    {value: 'livreur', viewValue: 'Livreur'},
    {value: 'magasinier', viewValue: 'Magasinier'},
    {value: 'commercial', viewValue: 'Commercial'},
    {value: 'gérant', viewValue: 'Gérant'}
  ]; 
  public cinVar;
	public nomVar;
  public prenomVar; 
	public role_personnelVar; 
	public tel_personnelVar; 
	public mailVar; 
	public permisVar;
	public matricule_vehVar; 
	public carte_griseVar ;
  public hubVar;
  public disabledButton:boolean=false;

  public displayForm : boolean = false ;
  public isDisabled :boolean = true ; 
  public isRequired :boolean = false ; 
	
  userFile ;
  public imagePath;
  imgURL: any;
  public message: string;

  public editPersonnel : Personnel;
  public deletePersonnel: Personnel;
  public testPersonnel : Personnel;
  public listHub : Hub[];
  public gouvernoratList =['ARIANA', 'BEJA','BEN AROUS','BIZERTE','GABES','GAFSA','JENDOUBA','KAIROUAN','KASSERINE',
  'KEBILI','KEF','MAHDIA','MANOUBA','MEDENINE','MONASTIR','NABEUL','SFAX','SIDI BOUZID','TOZEUR','ZAGHOUAN','SOUSSE',
  'SILIANA','TATAOUINE','TUNIS']

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
      return d.nom.toLowerCase().startsWith(val) || d.nom.toLowerCase().startsWith(val)|| d.prenom.toLowerCase().startsWith(val) || d.role_personnel.toLowerCase().startsWith(val) || d.mail.toLowerCase().startsWith(val) || d.tel_personnel.toString().toLowerCase().startsWith(val) ;
    });

    // update the rows
    this. listPersonnel = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;}
    else{
      this.ngOnInit();
    }
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
  
  constructor(private router: Router, private personnelService: PersonnelService, private modalService: NgbModal, 
    private _datatablesService: FormRepeaterService,private hubService : HubService,private _toastrService: ToastrService,) 
     {
      this._unsubscribeAll = new Subject();
     }

  ngOnInit() {
      this.personnelService.getPersonnelBySocieteLiv().subscribe(response => {
        this.rows = response;
        console.log(this.rows)
        this.tempData = this.rows;
        this.listPersonnel = this.rows;
        this.exportCSVData = this.rows; });

      this.hubService.getHubBySocieteLiv().subscribe(
        (response : Hub[])=>{this.listHub=response}
      )
      this.contentHeader = {
        headerTitle: 'Ajouter personnel',
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
              name: 'Ajouter personnel',
              isLink: false
            }
          ]
        }
      };
    }
  onChangeRole(roleValue) {
    this.isDisabled= false;
    if (roleValue=="livreur")
        {
          this.isRequired = true; 
        }
     else 
      {
        this.isRequired = false; 
      }
  }
  openUpdateModal(personnel : Personnel ,modalUpdate) {
    this.modalService.open(modalUpdate, {
      centered: true,
      size: 'lg' });
    this.editPersonnel= personnel;
    }
    openCreateModal(createModel) {
      this.modalService.open(createModel, {
        centered: true,
        size: 'lg' });
      }
  openDeleteModal(personnel : Personnel, modalDelete) {
    this.modalService.open(modalDelete, {
      centered: true,
      windowClass: 'modal modal-danger'});
    this.deletePersonnel= personnel;
    }


  btnDisplayForm () {
    this.displayForm = true ; 
  };
  btnAnnulerForm () {
    this.displayForm = false ; 
};
  onSelectImage(event) {
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
        }
}

  public gestListHub()
  {
    this.hubService.getHubBySocieteLiv().subscribe(
      (response : Hub[])=>{this.listHub=response}
    )
  }

  async onAddPersonnelWithImage(HWForm : NgForm) {
  
    if (this.userFile)
      {
            if (HWForm.form.valid === true)
              {
                this.disabledButton=true;
                let hub ; 
                const formData = new  FormData();
                const personnel = this.testPersonnel=Object.assign(HWForm.value);

                await this.hubService.getHubById(this.hubVar).toPromise().then(
                (response : Hub)=>{hub = response })
                 personnel.hub= hub ; 
            
                formData.append('personnel',JSON.stringify(personnel));
                formData.append('file',this.userFile);
                
                await this.personnelService.createData(formData).toPromise().then( data => {console.log(data) ;});
                this._toastrService.success('Vous avez ajouté le personnel avec succès ! ',
                'Ajout avec succès !',{ toastClass: 'toast ngx-toastr', closeButton: true,timeOut:2000 }).onHidden.subscribe(res =>{this.disabledButton=false; window.location.reload();});


        
                } 
            else 
                {
                  this._toastrService.error('Vérifier que vous avez bien rempli le formulaire ! ', "Échec d'ajout !",
                  { toastClass: 'toast ngx-toastr', closeButton: true,});
                }
      }
    else 
      {
        this.onAddPersonnel(HWForm);
      }
  }
  public async onAddPersonnel (HWForm : NgForm) :Promise<void> {
    if (HWForm.form.valid === true)
        {this.disabledButton=true;
            let personnel ; 
            let hub ; 
            personnel = Object.assign(HWForm.value);

            await this.hubService.getHubById(this.hubVar).toPromise().then(
            (response : Hub)=>{hub = response })
            personnel.hub= hub ; 
            
            await  this.personnelService.addPersonnel(personnel).toPromise().then(
            (response : Personnel )=> {
            this._toastrService.success('Vous avez ajouté le peronnel avec succès ! ',
            'Ajout avec succès !',{ toastClass: 'toast ngx-toastr', closeButton: true, timeOut:2000 }).onHidden.subscribe(res => {HWForm.reset();this.disabledButton=false;window.location.reload()});


          },
            (error : HttpErrorResponse) => { console.log(error.message) ; } );
           // window.location.reload();
        } 

    else 
        {
            this._toastrService.error('Vérifier que vous avez bien rempli le formulaire ! ',"Échec d'ajout !",
            { toastClass: 'toast ngx-toastr', closeButton: true,});
        }
  }

  public async onUpdatePersonnel (personnel : Personnel) :Promise<void> {
            
    await this.personnelService.updatePersonnel(this.editPersonnel).toPromise().then(
      (response : Personnel )=> {console.log(response);
        this._toastrService.success('Vous avez modifié le personnel '+ response.iduser +' avec succès ! ',
        'Modification avec succès !',{ toastClass: 'toast ngx-toastr', closeButton: true,timeOut:2000 }).onHidden.subscribe(res => window.location.reload());

   
        document.getElementById('btnAnnulerUpdate').click(); 
        // window.location.reload();
        },

         (error : HttpErrorResponse) => { alert ( error.message) ;
        this._toastrService.error('Vérifier que vous avez bien rempli le formulaire ! ', "Échec Modification !",
        { toastClass: 'toast ngx-toastr', closeButton: true,});
      });
    
      
  }

  async updateFournisseurPhoto(personnel : Personnel) {
  
    if (this.userFile)
      {
          const formData = new  FormData();
          formData.append('personnel',JSON.stringify(personnel));
          formData.append('file',this.userFile);
  
          await this.personnelService.updatePersonnelPhoto(formData).toPromise().then(
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
      this.updateFournisseurPhoto(this.editPersonnel);
  }
  }
  public onDeletePersonnel (personnelId : number) :void {
    
    this.personnelService.deletePersonnel(personnelId).subscribe(
      
      (response : void )=> {console.log(response);} );
      document.getElementById('btnAnnulerDelete').click(); 
      this._toastrService.success('Vous avez supprimé le personnel '+ personnelId +' avec succès ! ',
      'Suppression avec succès !',{ toastClass: 'toast ngx-toastr', closeButton: true,timeOut:2000 }).onHidden.subscribe(res => window.location.reload());


  }

  
}
