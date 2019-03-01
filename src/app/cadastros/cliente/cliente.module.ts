import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

// components
import { ClienteComponent } from './cliente.component';
import { ListaClienteComponent } from './lista-cliente/lista-cliente.component';

// services
import { ClienteService } from './cliente.service';

// config
import { clienteRouterConfig } from './cliente.routes';

// my modules
//import { SharedModule } from '../../shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask';
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';
import { OnlyNumberDirectiveModule } from '../../diretivas/onlynumber.module';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { HttpClientModule } from '@angular/common/http';
import { DxSelectBoxModule } from 'devextreme-angular';

@NgModule({
    imports: [
       // SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(clienteRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        TextMaskModule,
        OnlyNumberDirectiveModule,   
        CheckBoxSetDirectiveModule,             
        DisableControlDirectiveModule,
        DxSelectBoxModule
    ],
    declarations: [
        ClienteComponent,
        ListaClienteComponent
    ],
    providers: [
      ClienteService
    ],
    exports: [RouterModule,
        OnlyNumberDirectiveModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule,
        DataFilterPipeModule]
})

export class ClienteModule { }