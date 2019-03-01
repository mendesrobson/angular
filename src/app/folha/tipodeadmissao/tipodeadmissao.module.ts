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

import { TipodeadmissaoComponent } from './tipodeadmissao.component';
import { AdicionarTipodeadmissaoComponent } from './adicionar-tipodeadmissao/adicionar-tipodeadmissao.component';
import { EditarTipodeadmissaoComponent } from './editar-tipodeadmissao/editar-tipodeadmissao.component';
import { ExcluirTipodeadmissaoComponent } from './excluir-tipodeadmissao/excluir-tipodeadmissao.component';
import { ListaTipodeadmissaoComponent } from './lista-tipodeadmissao/lista-tipodeadmissao.component';
import { ReativarTipodeadmissaoComponent } from './reativar-tipodeadmissao/reativar-tipodeadmissao.component';

import { TipoDeAdmissaoService } from './tipodeadmissao.service';
import { tipoDeAdmissaoRouterConfig } from './tipodeadmissao.routes';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(tipoDeAdmissaoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule
    ],
    declarations: [
        TipodeadmissaoComponent,
        AdicionarTipodeadmissaoComponent,
        EditarTipodeadmissaoComponent,
        ExcluirTipodeadmissaoComponent,
        ListaTipodeadmissaoComponent,
        ReativarTipodeadmissaoComponent
    ],
    providers: [
        TipoDeAdmissaoService
    ],
    exports: [RouterModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule]
})

export class TipoDeAdmissaoModule { }