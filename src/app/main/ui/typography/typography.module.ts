import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// ng bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

// core modules
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { CoreCommonModule } from '@core/common.module';
import { CsvModule } from '@ctrl/ngx-csv';

import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CoreDirectivesModule } from '@core/directives/directives';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { TypographyService } from './typography.service';
import { TypographyComponent } from 'app/main/ui/typography/typography.component';
import { Role } from 'app/auth/models';
import { AuthGuard } from 'app/auth/helpers';

// routing
const routes: Routes = [
  {
    path: 'content/typography',
    component: TypographyComponent,
    canActivate: [AuthGuard],
    resolve: {
      form: TypographyService
    },
    data: { roles: [Role.Admin], animation: 'typography' }
  }
];

@NgModule({
  declarations: [TypographyComponent],
  imports: [
    RouterModule.forChild(routes),
    CoreCommonModule,
    HighlightModule,
    NgbModule,
    CardSnippetModule,
    ContentHeaderModule,
    CommonModule, 
    RouterModule.forChild(routes), 
    CardSnippetModule,
    ContentHeaderModule, 
    FormsModule, 
    NgbModule,
    NgxDatatableModule,
    CoreCommonModule,
    NgSelectModule,
    CsvModule,
    CoreDirectivesModule,
    SweetAlert2Module.forRoot()
  ],
  providers: [TypographyService]
})
export class TypographyModule {}
