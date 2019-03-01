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
import { TipoContratoComponent } from './tipocontrato.component';
import { AdicionarTipoContratoComponent } from './adicionar-tipocontrato/adicionar-tipocontrato.component';
import { EditarTipoContratoComponent } from './editar-tipocontrato/editar-tipocontrato.component';
import { ExcluirTipoContratoComponent } from './excluir-tipocontrato/excluir-tipocontrato.component';
import { ReativarTipoContratoComponent } from './reativar-tipocontrato/reativar-tipocontrato.component';
import { ListaTipoContratoComponent } from './lista-tipocontrato/lista-tipocontrato.component';

// services
import { TipoContratoService } from './tipocontrato.service';

// config
import { tipoContratoRouterConfig } from './tipocontrato.routes';

// my modules
//import { SharedModule } from '../../shared/shared.module';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';


@NgModule({
    imports: [
     //   SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(tipoContratoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        SelectModule,
        TextMaskModule,
        DisableControlDirectiveModule,
        CheckBoxSetDirectiveModule
    ],
    declarations: [
        TipoContratoComponent,
        ListaTipoContratoComponent,
        AdicionarTipoContratoComponent,
        EditarTipoContratoComponent,
        ExcluirTipoContratoComponent,
        ReativarTipoContratoComponent
    ],
    providers: [
        MaskService,
        TipoContratoService
    ],
    exports: [
        RouterModule,
        DataFilterPipeModule,
        DisableControlDirectiveModule,
        CheckBoxSetDirectiveModule ]
})

export class TipoContratoModule { }