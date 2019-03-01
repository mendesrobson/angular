import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DataTableModule } from 'angular2-datatable';
import { DataFilterPipeModule } from './../../utils/datafilter.pipe.module';

import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';

import { SitgeradoraacidentetrabalhoComponent } from './sitgeradoraacidentetrabalho.component';
import { AdicionarSitgeradoraacidentetrabalhoComponent } from './adicionar-sitgeradoraacidentetrabalho/adicionar-sitgeradoraacidentetrabalho.component';
import { EditarSitgeradoraacidentetrabalhoComponent } from './editar-sitgeradoraacidentetrabalho/editar-sitgeradoraacidentetrabalho.component';
import { ExcluirSitgeradoraacidentetrabalhoComponent } from './excluir-sitgeradoraacidentetrabalho/excluir-sitgeradoraacidentetrabalho.component';
import { ListaSitgeradoraacidentetrabalhoComponent } from './lista-sitgeradoraacidentetrabalho/lista-sitgeradoraacidentetrabalho.component';
import { ReativarSitgeradoraacidentetrabalhoComponent } from './reativar-sitgeradoraacidentetrabalho/reativar-sitgeradoraacidentetrabalho.component';

import { SitGeradoraAcidenteTrabalhoService } from './sitgeradoraacidentetrabalho.service';
import { sitGeradoraAcidenteTrabalhoRouterConfig } from './sitgeradoraacidentetrabalho.routes';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(sitGeradoraAcidenteTrabalhoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule
    ],
    declarations: [
    SitgeradoraacidentetrabalhoComponent,
    AdicionarSitgeradoraacidentetrabalhoComponent,
    EditarSitgeradoraacidentetrabalhoComponent,
    ExcluirSitgeradoraacidentetrabalhoComponent,
    ListaSitgeradoraacidentetrabalhoComponent,
    ReativarSitgeradoraacidentetrabalhoComponent],
    providers: [
        SitGeradoraAcidenteTrabalhoService
    ],
    exports: [RouterModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule]
})

export class SitGeradoraAcidenteTrabalhoModule{}