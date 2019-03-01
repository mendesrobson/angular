import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// components
import { AgenteintegradorComponent } from './agenteintegrador.component';
import { ListaAgenteintegradorComponent } from './lista-agenteintegrador/lista-agenteintegrador.component';
import { AdicionarAgenteintegradorComponent } from './adicionar-agenteintegrador/adicionar-agenteintegrador.component';
import { EditarAgenteintegradorComponent } from './editar-agenteintegrador/editar-agenteintegrador.component';
import { ExcluirAgenteintegradorComponent } from './excluir-agenteintegrador/excluir-agenteintegrador.component';
import { ReativarAgenteintegradorComponent } from './reativar-agenteintegrador/reativar-agenteintegrador.component';

// config
import { agenteintegradorRouterConfig } from './agenteintegrador.routes';

// services
import { AgenteintegradorService } from './agenteintegrador.service';

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
        RouterModule.forChild(agenteintegradorRouterConfig),
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
        AgenteintegradorComponent,
        ListaAgenteintegradorComponent,
        AdicionarAgenteintegradorComponent,
        EditarAgenteintegradorComponent,
        ExcluirAgenteintegradorComponent,
        ReativarAgenteintegradorComponent
    ],
    providers: [
        AgenteintegradorService
    ],
    exports: [RouterModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule]
})

export class AgenteintegradorModule { }
