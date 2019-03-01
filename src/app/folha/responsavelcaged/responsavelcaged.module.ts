import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DataTableModule } from 'angular2-datatable';
import { DataFilterPipeModule } from './../../utils/datafilter.pipe.module';

import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';

import { TextMaskModule } from 'angular2-text-mask';

import { ResponsavelcagedComponent } from './responsavelcaged.component';
import { AdicionarResponsavelcagedComponent } from './adicionar-responsavelcaged/adicionar-responsavelcaged.component';
import { EditarResponsavelcagedComponent } from './editar-responsavelcaged/editar-responsavelcaged.component';
import { ExcluirResponsavelcagedComponent } from './excluir-responsavelcaged/excluir-responsavelcaged.component';
import { ListaResponsavelcagedComponent } from './lista-responsavelcaged/lista-responsavelcaged.component';
import { ReativarResponsavelcagedComponent } from './reativar-responsavelcaged/reativar-responsavelcaged.component';

import { ResponsavelCagedService } from './responsavelcaged.service';
import { responsavelCagedRouterConfig } from './responsavelcaged.routes';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(responsavelCagedRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule,
        TextMaskModule
    ],
    declarations: [
        ResponsavelcagedComponent,
        AdicionarResponsavelcagedComponent,
        EditarResponsavelcagedComponent,
        ExcluirResponsavelcagedComponent,
        ListaResponsavelcagedComponent,
        ReativarResponsavelcagedComponent
    ],
    providers: [
        ResponsavelCagedService
    ],
    exports: [RouterModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule]
})

export class ResponsavelCagedModule { }