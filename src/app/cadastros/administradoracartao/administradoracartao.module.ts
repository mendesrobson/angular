import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

// components
import { AdministradoracartaoComponent } from './administradoracartao.component';

// services
import { AdministradoracartaoService } from './administradoracartao.service';

// config
import { administradoraCartaoRouterConfig } from './administradoracartao.routes';

// my modules
//import { SharedModule } from '../../shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask';
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';
import { ListaAdministradoracartaoComponent } from './lista-administradoracartao/lista-administradoracartao.component';
import { AdicionarAdministradoracartaoComponent } from './adicionar-administradoracartao/adicionar-administradoracartao.component';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { DisableControlCheckBoxDirectiveModule } from '../../diretivas/disablecontrolcheckbox.module';
import { OnlyNumberDirectiveModule } from '../../diretivas/onlynumber.module';
import { EditarAdministradoracartaoComponent } from './editar-administradoracartao/editar-administradoracartao.component';
import { AdicionarAdministradoracartaoenderecoComponent } from './adicionar-administradoracartaoendereco/adicionar-administradoracartaoendereco.component';
import { ListaAdministradoracartaoenderecoComponent } from './lista-administradoracartaoendereco/lista-administradoracartaoendereco.component';
import { EditarAdministradoracartaoenderecoComponent } from './editar-administradoracartaoendereco/editar-administradoracartaoendereco.component';
import { ListaAdministradoracartaocontatoComponent } from './lista-administradoracartaocontato/lista-administradoracartaocontato.component';
import { AdicionarAdministradoracartaocontatoComponent } from './adicionar-administradoracartaocontato/adicionar-administradoracartaocontato.component';
import { EditarAdministradoracartaocontatoComponent } from './editar-administradoracartaocontato/editar-administradoracartaocontato.component';
import {  HttpClientModule } from '@angular/common/http';



@NgModule({
    imports: [
     //   SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(administradoraCartaoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        TextMaskModule,
        DisableControlDirectiveModule,
        CheckBoxSetDirectiveModule,
        OnlyNumberDirectiveModule,
        DisableControlCheckBoxDirectiveModule
    ],
    declarations: [
        AdministradoracartaoComponent,
        ListaAdministradoracartaoComponent,
        AdicionarAdministradoracartaoComponent,
        EditarAdministradoracartaoComponent,
        AdicionarAdministradoracartaoenderecoComponent,
        ListaAdministradoracartaoenderecoComponent,
        EditarAdministradoracartaoenderecoComponent,
        ListaAdministradoracartaocontatoComponent,
        AdicionarAdministradoracartaocontatoComponent,
        EditarAdministradoracartaocontatoComponent
    ],
    providers: [
        AdministradoracartaoService
    ],
    exports: [RouterModule,
        DisableControlDirectiveModule,
        DataFilterPipeModule,
        CheckBoxSetDirectiveModule,
        OnlyNumberDirectiveModule,
        DisableControlCheckBoxDirectiveModule]
})

export class AdministradoracartaoModule { }