import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CsvModule } from '@ctrl/ngx-csv';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { CoreCommonModule } from '@core/common.module';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { TableComponent } from 'app/main/tables/table/table.component';
import { TableService } from './table.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoreDirectivesModule } from '@core/directives/directives';
import { NgSelectModule } from '@ng-select/ng-select';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { Role } from 'app/auth/models';
import { AuthGuard } from 'app/auth/helpers';

const routes: Routes = [
  {
    path: 'table',
    component: TableComponent,
    canActivate: [AuthGuard],
    resolve: {
      table: TableService
    },
    data: { roles: [Role.Admin],animation: 'table' }
  }
];

@NgModule({
  declarations: [TableComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    TranslateModule,
    CoreCommonModule,
    ContentHeaderModule,
    FormsModule,
    CardSnippetModule,
    NgxDatatableModule,
    CsvModule,
    CoreDirectivesModule,
    NgSelectModule,
    SweetAlert2Module.forRoot()
  ],
  providers: [TableService]
})
export class TableModule {}
