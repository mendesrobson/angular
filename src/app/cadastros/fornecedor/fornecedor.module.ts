import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// components
import { FornecedorComponent } from './fornecedor.component';
import { ListaFornecedorComponent } from './lista-fornecedor/lista-fornecedor.component';

// services
import { FornecedorService } from './fornecedor.service';

// config
import { fornecedorRouterConfig } from './fornecedor.routes';

// my modules
//import { SharedModule } from '../../shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask';
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';
import { OnlyNumberDirectiveModule } from '../../diretivas/onlynumber.module';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';

import { DxSelectBoxModule } from 'devextreme-angular';

@NgModule({
    imports: [
       // SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(fornecedorRouterConfig),
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
        FornecedorComponent,
        ListaFornecedorComponent
    ],
    providers: [
      FornecedorService
    ],
    exports: [RouterModule,
        OnlyNumberDirectiveModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule,
        DataFilterPipeModule]
})

export class FornecedorModule { }