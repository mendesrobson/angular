import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DataTableModule } from "angular2-datatable";
import { SelectModule } from 'ng2-select';
import { TextMaskModule } from 'angular2-text-mask';
import { MaskService } from '../../services/mask.service';

// components
import { ObservacaoComponent } from './observacao.component';
import { ListaObservacaoComponent } from './lista-observacao/lista-observacao.component';
import { AdicionarObservacaoComponent } from './adicionar-observacao/adicionar-observacao.component';
import { EditarObservacaoComponent } from './editar-observacao/editar-observacao.component';
import { ExcluirObservacaoComponent } from './excluir-observacao/excluir-observacao.component';
import { ReativarObservacaoComponent } from './reativar-observacao/reativar-observacao.component';

import { DisableControlDirectiveModule } from "../../diretivas/disablecontrol.module";


// services
import { ObservacaoService } from './observacao.service';

// config
import { observacaoRouterConfig } from './observacao.routes';


// my modules
//import { SharedModule } from '../../shared/shared.module';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';


@NgModule({
    imports: [
      //  SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(observacaoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        SelectModule,
        TextMaskModule,
        DisableControlDirectiveModule
    ],
    declarations: [
        ObservacaoComponent,
        ListaObservacaoComponent,
        AdicionarObservacaoComponent,
        EditarObservacaoComponent,
        ExcluirObservacaoComponent,
        ReativarObservacaoComponent
    ],
    providers: [
        MaskService,
        ObservacaoService
    ],
    exports: [
        RouterModule,
        DataFilterPipeModule ]
})

export class ObservacaoModule { }