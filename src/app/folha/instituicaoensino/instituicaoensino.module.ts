import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// components
import { ListaInstituicaoensinoComponent } from './lista-instituicaoensino/lista-instituicaoensino.component';
import { InstituicaoensinoComponent } from './instituicaoensino.component';
import { AdicionarInstituicaoensinoComponent } from './adicionar-instituicaoensino/adicionar-instituicaoensino.component';
import { EditarInstituicaoensinoComponent } from './editar-instituicaoensino/editar-instituicaoensino.component';
import { ExcluirInstituicaoensinoComponent } from './excluir-instituicaoensino/excluir-instituicaoensino.component';
import { ReativarInstituicaoensinoComponent } from './reativar-instituicaoensino/reativar-instituicaoensino.component';

// config
import { InstituicaoEnsinoService } from './instituicaoensino.service';

// services
import { instituicaoensinoRouterConfig } from './instituicaoensino.routes';

// utils
import { DataTableModule } from 'angular2-datatable';
import { DataFilterPipeModule } from './../../utils/datafilter.pipe.module';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';
import { TextMaskModule } from 'angular2-text-mask';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(instituicaoensinoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        TextMaskModule,
        DisableControlDirectiveModule
    ],
    declarations: [
        InstituicaoensinoComponent,
        ListaInstituicaoensinoComponent,
        AdicionarInstituicaoensinoComponent,
        EditarInstituicaoensinoComponent,
        ExcluirInstituicaoensinoComponent,
        ReativarInstituicaoensinoComponent,
    ],
    providers: [
        InstituicaoEnsinoService
    ],
    exports: [RouterModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule]
})

export class InstituicaoensinoModule { }
