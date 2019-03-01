import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { retornoPagamentoRouterConfig } from './retornopagamento.routes';
import { HttpClientModule } from '@angular/common/http';
import { DataTableModule } from 'angular2-datatable';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { BusyModule } from 'angular2-busy';
import { LerRetornoPagamentoComponent } from './ler-retornopagamento/ler-retornopagamento.component';
import { RetornoPagamentoService } from './retornopagamento.service';
import { RetornoPagamentoComponent } from './retornopagamento.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule.forChild(retornoPagamentoRouterConfig),
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        DataTableModule,
        DataFilterPipeModule,       
        BusyModule
    ],
    declarations: [
        RetornoPagamentoComponent,
        LerRetornoPagamentoComponent,        
 
    ],
    providers: [
        RetornoPagamentoService
    ],
    exports: [
        RouterModule,
        DataFilterPipeModule
    ]
})

export class RetornoPagamentoModule { }