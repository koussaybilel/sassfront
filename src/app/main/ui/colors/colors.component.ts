
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ColumnMode, DatatableComponent} from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { CoreTranslationService } from '@core/services/translation.service';
import { HubService } from 'app/service/hub.service';
import { Hub } from 'app/Model/hub';
import { SocieteLiv } from 'app/Model/societeLiv';
import { SocieteLivService } from 'app/service/societeLiv.service';
import { ConsoleService } from 'app/service/console.service';
@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ColorsComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;//
  private tempData = [];//
  public contentHeader: object;
  public rows: any;//
  public selected = [];
  public listHub: any;//
  public basicSelectedOption: number = 10;
  public ColumnMode = ColumnMode;
  public expanded = {};
  public exportCSVData;//

  public id_hubVar ; 
  public gouvernoratVar ;//
  public adresseVar;
  public titreVar;
  public displayForm : boolean = false ;

  public editHub : Hub;
  public deleteHub: Hub;
  public selectMulti;
  public selectMultiSelected=[] ;
  public gouvernoratList =['ARIANA', 'BEJA','BEN AROUS','BIZERTE','GABES','GAFSA','JENDOUBA','KAIROUAN','KASSERINE',
  'KEBILI','KEF','MAHDIA','MANOUBA','MEDENINE','MONASTIR','NABEUL','SFAX','SIDI BOUZID','TOZEUR','ZAGHOUAN','SOUSSE',
  'SILIANA','TATAOUINE','TUNIS']

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('tableRowDetails') tableRowDetails: any;

/**
 * Constructor
 *
 * @param {DatatablesService} _datatablesService
 * @param {CoreTranslationService} _coreTranslationService
 * @param {ToastrService} _toastrService
 */
  
 constructor(private router: Router, private hubService: HubService, private modalService: NgbModal, 
  private _datatablesService: HubService, private societeLivraisonService :SocieteLivService,
  private _coreTranslationService: CoreTranslationService,
  private _toastrService: ToastrService,) 
  {
    
   this._unsubscribeAll = new Subject();
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
      return  d.gouvernorat.toLowerCase().startsWith(val) || d.titre.toLowerCase().startsWith(val) || d.gouvernorat_lie.forEach(item => {item.toLowerCase().startsWith(val)}) ;
    });

    // update the rows
    this.listHub = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;}
    else{
      this.ngOnInit();
    }
  }
 
  ngOnInit() {
    this._datatablesService.getHubBySocieteLiv().subscribe(response => {
      this.rows = response;
      console.log(this.rows)
      this.tempData = this.rows;
      this.listHub = this.rows;
      this.selectMulti=this.gouvernoratList;
    });
    this.contentHeader = {
      headerTitle: 'Gestion Hub',
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
            name: 'Gestion Hub',
            isLink: false
          }
        ]
      }
    };
  }
  openCreateModal(createModel) {
    this.modalService.open(createModel, {
      centered: true,
      size: 'lg' });
    }
btnDisplayForm () {
      
    this.displayForm = true ; 
};
btnAnnulerForm () {
    
  this.displayForm = false ; 
};

openUpdateModal(hub : Hub ,modalUpdate) {
  this.modalService.open(modalUpdate, {
    centered: true,
    size: 'lg'
  });
  this.editHub= hub;
}

openDeleteModal(hub : Hub , modalDelete) {
  this.modalService.open(modalDelete, {
    centered: true,
    windowClass: 'modal modal-danger'
  });
  this.deleteHub= hub;
}

public async onAddHub (HWForm : NgForm) :Promise<void> {
  if (HWForm.form.valid === true)
    {
          let testSocieteLiv ;
          let hub ; 
          hub =Object.assign(HWForm.value);
          await this.societeLivraisonService.getSocieteLivById(1).toPromise().then(
          (response : SocieteLiv) =>{testSocieteLiv = response;})

          hub.societeLiv=testSocieteLiv;
          await this.hubService.addHub(hub).toPromise().then(

          (response : Hub )=> { 
          this._toastrService.success('Vous avez ajouté le hub '+ response.id_hub+' avec succès ! ',
          'Ajout avec succès !',{ toastClass: 'toast ngx-toastr', closeButton: true,timeOut:2000 }).onHidden.subscribe(res => { window.location.reload() });
         // window.location.reload();
        },

          (error : HttpErrorResponse) => {console.log(error.message) ; });
        //  this.modalService.dismissAll;
    } 
  else 
    {
          this._toastrService.error('Vérifier que vous avez bien rempli le formulaire ! ',
          "Échec d'ajout !",{ toastClass: 'toast ngx-toastr', closeButton: true,timeOut:2000 }).onHidden.subscribe(res =>{});
    }
}

  public async onUpdateHub (hub : Hub) :Promise<void> {

      let testSocieteLiv; 
      await this.societeLivraisonService.getSocieteLivById(1).toPromise().then(
      (response : SocieteLiv) =>{testSocieteLiv = response;})
    
      hub.societeLiv=testSocieteLiv;
      
      await this.hubService.updateHub(hub).toPromise().then(
      
         (response : Hub )=> {
          console.log(response);
           this._toastrService.success('Vous avez modifié le hub '+ response.id_hub +' avec succès ! ',
            'Modification avec succès !',{ toastClass: 'toast ngx-toastr', closeButton: true,timeOut:2000 }).onHidden.subscribe(res => window.location.reload());
    
            document.getElementById('btnAnnulerUpdate').click(); 
            
            // window.location.reload();

          },

        (error : HttpErrorResponse) => { alert ( error.message) ;
          this._toastrService.error('Vérifier que vous avez bien rempli le formulaire ! ',
          "Échec Modification !",{ toastClass: 'toast ngx-toastr', closeButton: true,timeOut:2000 }).onHidden.subscribe(res => window.location.reload());

        });
          
  }
    public onDeleteHub (hubId : number) :void {
      
      this.hubService.deleteHub(hubId).subscribe(
        
        (response : void )=> {console.log(response);});
        document.getElementById('btnAnnulerDelete').click(); 
        this._toastrService.success('Vous avez supprimé le hub '+ hubId +' avec succès ! ',
        'Suppression avec succès !',{ toastClass: 'toast ngx-toastr', closeButton: true,timeOut:2000 }).onHidden.subscribe(res => window.location.reload());


         //window.location.reload();
    }

async update(){
  if (this.gouvernoratVar != null) {
  //  console.log(s)
 // await this.selectMultiSelected.push(this.gouvernoratVar)
 // this.items = [...this.items, {id: 1, name: 'New item'}];
 this.selectMultiSelected= [...this.selectMultiSelected,{gouv : this.gouvernoratVar}]
  console.log(this.selectMultiSelected)

  } 
}

}
