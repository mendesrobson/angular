import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// components
import { MascaraComponent } from './mascara.component';
import { ListaMascaraComponent } from './lista-mascara/lista-mascara.component';
import { AdicionarMascaraComponent } from './adicionar-mascara/adicionar-mascara.component';
import { EditarMascaraComponent } from './editar-mascara/editar-mascara.component';
import { ExcluirMascaraComponent } from './excluir-mascara/excluir-mascara.component';
import { ReativarMascaraComponent } from './reativar-mascara/reativar-mascara.component';

// services
import { MascaraService } from './mascara.service';

// config
import { mascaraRouterConfig } from './mascara.routes';

// my modules
//import { SharedModule } from '../../shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask';
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';
import { OnlyNumberDirectiveModule } from '../../diretivas/onlynumber.module';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';



@NgModule({
    imports: [
       // SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(mascaraRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        TextMaskModule,
        OnlyNumberDirectiveModule,   
        CheckBoxSetDirectiveModule,             
        DisableControlDirectiveModule
    ],
    declarations: [
        MascaraComponent,
        ListaMascaraComponent,
        AdicionarMascaraComponent,
        EditarMascaraComponent,
        ExcluirMascaraComponent,
        ReativarMascaraComponent
    ],
    providers: [
      MascaraService
    ],
    exports: [RouterModule,
        OnlyNumberDirectiveModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule,
        DataFilterPipeModule]
})

export class MascaraModule { }
