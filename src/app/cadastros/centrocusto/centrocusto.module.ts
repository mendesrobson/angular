import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
// import { TreeModule } from 'angular-tree-component';
// import { TreeTableModule } from 'primeng/treetable';
// import { TreeNode } from 'primeng/api';
import { TreeTableModule } from "ng-treetable";


// components
import { CentrocustoComponent } from './centrocusto.component';
import { ListaCentrocustoComponent } from './lista-centrocusto/lista-centrocusto.component';
import { AdicionarCentrocustoComponent } from './adicionar-centrocusto/adicionar-centrocusto.component';
import { EditarCentrocustoComponent } from './editar-centrocusto/editar-centrocusto.component';
import { ExcluirCentrocustoComponent } from './excluir-centrocusto/excluir-centrocusto.component';
import { ReativarCentrocustoComponent } from './reativar-centrocusto/reativar-centrocusto.component';

// services
import { CentroCustoService } from './centrocusto.service';
import { MaskService } from '../../services/mask.service';
import { TextMaskModule } from 'angular2-text-mask';

// config
import { centroCustoRouterConfig } from './centrocusto.routes';

// utils
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { HttpClientModule } from '@angular/common/http';
import { DxTreeListModule, DxDropDownBoxModule, DxTreeViewModule, DxDataGridModule, DxSelectBoxModule } from 'devextreme-angular';


@NgModule({
    imports: [
        // SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(centroCustoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        TextMaskModule,
        // TreeModule,
        TreeTableModule,
        DxTreeListModule,
        DxDropDownBoxModule,
        DxTreeViewModule,
        DxDataGridModule,
        DxSelectBoxModule
    ],
    declarations: [
        CentrocustoComponent,
        ListaCentrocustoComponent,
        AdicionarCentrocustoComponent,
        EditarCentrocustoComponent,
        ExcluirCentrocustoComponent,
        ReativarCentrocustoComponent
    ],
    providers: [
        MaskService,
        CentroCustoService
    ],
    exports: [RouterModule,
        DataFilterPipeModule]
})

export class CentrocustoModule { }