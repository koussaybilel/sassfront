import { NgModule } from '@angular/core';

import { FormRepeaterModule } from 'app/main/forms/form-repeater/form-repeater.module';
import { FormElementsModule } from 'app/main/forms/form-elements/form-elements.module';
import { FormLayoutModule } from 'app/main/forms/form-layout/form-layout.module';
import { FormValidationModule } from 'app/main/forms/form-validation/form-validation.module';
import { FormWizardModule } from 'app/main/forms/form-wizard/form-wizard.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { RouterModule } from '@angular/router';
import { FormWizardComponent } from './form-wizard/form-wizard.component';
import { AuthGuard } from 'app/auth/helpers';
import { Role } from 'app/auth/models';
import { FormLayoutComponent } from './form-layout/form-layout.component';
import { FormRepeaterComponent } from './form-repeater/form-repeater.component';
import { FormRepeaterService } from './form-repeater/form-repeater.service';


const routes = [
  {
    path: 'form-wizard',
    component: FormWizardComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Fournisseur] },
   // data: { animation: 'danalytics' },
    resolve: {
     // css: DashboardService,
     // inv: InvoiceListService
    }
  },
  {
    path: 'form-layout',
    component: FormLayoutComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Fournisseur] },
    resolve: {
     // css: DashboardService
    },
   // data: { animation: 'decommerce' }
  },
  {
    path: 'form-repeater',
    component: FormRepeaterComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin],animation: 'repeater'  },
   // data: { animation: 'danalytics' },
    resolve: {
     // css: DashboardService,
     // inv: InvoiceListService
     form: FormRepeaterService
    }
  }
];


@NgModule({
 // declarations: [FormWizardComponent,FormLayoutComponent,FormRepeaterComponent],
 declarations :[],
 imports: [FormElementsModule, 
   // FormLayoutModule, 
   // FormWizardModule, 
    FormValidationModule,
   //  FormRepeaterModule,
     RouterModule.forChild(routes),
     SweetAlert2Module],
   //  exports: [FormWizardComponent,FormLayoutComponent,FormRepeaterComponent],
   providers:[FormRepeaterService]
})
export class FormsModule {}
