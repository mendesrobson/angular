import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
// import { TreeTableModule } from 'primeng/treetable';
// import { TreeNode } from 'primeng/api';
import {TreeTableModule} from "ng-treetable";

// components
import { CentroresultadoComponent } from './centroresultado.component';
import { ListaCentroresultadoComponent } from './lista-centroresultado/lista-centroresultado.component';
import { AdicionarCentroresultadoComponent } from './adicionar-centroresultado/adicionar-centroresultado.component';
import { EditarCentroresultadoComponent } from './editar-centroresultado/editar-centroresultado.component';
import { ExcluirCentroresultadoComponent } from './excluir-centroresultado/excluir-centroresultado.component';
import { ReativarCentroresultadoComponent } from './reativar-centroresultado/reativar-centroresultado.component';

// services
import { CentroResultadoService } from './centroresultado.service';
import { MaskService } from '../../services/mask.service';
import { TextMaskModule } from 'angular2-text-mask';

// config
import { centroResultadoRouterConfig } from './centroresultado.routes';

// my modules
//import { SharedModule } from '../../shared/shared.module';

// utils
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { HttpClientModule } from '@angular/common/http';
import { DxTreeListModule, DxDropDownBoxModule, DxTreeViewModule, DxDataGridModule, DxSelectBoxModule } from '../../../../node_modules/devextreme-angular';


@NgModule({
    imports: [
      //  SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(centroResultadoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        TreeTableModule,
        TextMaskModule,
        DxTreeListModule,
        DxDropDownBoxModule,
        DxTreeViewModule,
        DxDataGridModule,
        DxSelectBoxModule
    ],
    declarations: [
        CentroresultadoComponent,
        ListaCentroresultadoComponent,
        AdicionarCentroresultadoComponent,
        EditarCentroresultadoComponent,
        ExcluirCentroresultadoComponent,
        ReativarCentroresultadoComponent
    ],
    providers: [
        MaskService,
      CentroResultadoService
    ],
    exports: [RouterModule,
        DataFilterPipeModule]
})

export class CentroresultadoModule { }