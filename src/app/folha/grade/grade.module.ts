import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { GradeComponent } from './grade.component';
import { ListaGradeComponent } from './lista-grade/lista-grade.component';
import { AdicionarGradeComponent } from './adicionar-grade/adicionar-grade.component';
import { EditarGradeComponent } from './editar-grade/editar-grade.component';
import { ExcluirGradeComponent } from './excluir-grade/excluir-grade.component';

import { GradeService } from './grade.service';
import { gradeRouterConfig } from './grade.routes';
import { DataTableModule } from 'angular2-datatable';
import { DataFilterPipeModule } from './../../utils/datafilter.pipe.module';
import { ReativarGradeComponent } from './reativar-grade/reativar-grade.component';
import { DxTemplateModule, DxSelectBoxModule, DxDateBoxModule, DxSchedulerModule } from 'devextreme-angular';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AdicionarGradehorarioComponent } from './adicionar-gradehorario/adicionar-gradehorario.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(gradeRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        DxTemplateModule,
        DxSelectBoxModule,
        DxDateBoxModule,
        FormsModule,
        DxSchedulerModule,
        NgbModule
    ],
    declarations: [
        GradeComponent,
        ListaGradeComponent,
        AdicionarGradeComponent,
        EditarGradeComponent,
        ExcluirGradeComponent,
        ReativarGradeComponent,
        AdicionarGradehorarioComponent
    ],
    providers: [
        GradeService,
    ],
    exports: [RouterModule,
        DataFilterPipeModule]
})

export class GradeModule { }

platformBrowserDynamic().bootstrapModule(GradeModule)