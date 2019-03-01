import { NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// components
import { HistoricopadraoComponent } from './historicopadrao.component';
import { ListaHistoricopadraoComponent } from './lista-historicopadrao/lista-historicopadrao.component';
import { AdicionarHistoricopadraoComponent } from './adicionar-historicopadrao/adicionar-historicopadrao.component';
import { ListaHistoricocentrocustoComponent } from './lista-historicocentrocusto/lista-historicocentrocusto.component';
import { EditarHistoricopadraoComponent } from './editar-historicopadrao/editar-historicopadrao.component';
import { ListaHistoricocentroresultadoComponent } from './lista-historicocentroresultado/lista-historicocentroresultado.component';
import { AdicionarHistoricocentrocustoComponent } from './adicionar-historicocentrocusto/adicionar-historicocentrocusto.component';
import { AdicionarHistoricocentroresultadoComponent } from './adicionar-historicocentroresultado/adicionar-historicocentroresultado.component';
import { EditarHistoricocentrocustoComponent } from './editar-historicocentrocusto/editar-historicocentrocusto.component';
import { EditarHistoricocentroresultadoComponent } from './editar-historicocentroresultado/editar-historicocentroresultado.component';
import { ExcluirHistoricopadraoComponent } from './excluir-historicopadrao/excluir-historicopadrao.component';
import { ReativarHistoricopadraoComponent } from './reativar-historicopadrao/reativar-historicopadrao.component';

// services
import { HistoricoPadraoService } from './historicopadrao.service';

// config
import { historicoPadraoRouterConfig } from './historicopadrao.routes';

// my modules
//import { SharedModule } from '../../shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask';
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';
import { OnlyNumberDirectiveModule } from '../../diretivas/onlynumber.module';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { DxSelectBoxModule, DxTreeViewModule, DxTreeListModule, DxDropDownBoxModule, DxDataGridModule } from 'devextreme-angular';


@NgModule({
    imports: [
       // SharedModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild(historicoPadraoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,
        TextMaskModule,
        OnlyNumberDirectiveModule,   
        CheckBoxSetDirectiveModule,             
        DisableControlDirectiveModule,
        DxSelectBoxModule,
        DxTreeViewModule,
        DxTreeListModule,
        DxDataGridModule,
        DxDropDownBoxModule
    ],
    declarations: [
        HistoricopadraoComponent,
        ListaHistoricopadraoComponent,
        AdicionarHistoricopadraoComponent,
        ListaHistoricocentrocustoComponent,
        EditarHistoricopadraoComponent,
        ListaHistoricocentroresultadoComponent,
        AdicionarHistoricocentrocustoComponent,
        AdicionarHistoricocentroresultadoComponent,
        EditarHistoricocentrocustoComponent,
        EditarHistoricocentroresultadoComponent,
        ExcluirHistoricopadraoComponent,
        ReativarHistoricopadraoComponent
    ],
    providers: [
      HistoricoPadraoService
    ],
    exports: [RouterModule,
        OnlyNumberDirectiveModule,
        CheckBoxSetDirectiveModule,
        DisableControlDirectiveModule,
        DataFilterPipeModule]
})

export class HistoricoPadraoModule { }
