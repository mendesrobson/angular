import { Routes } from "@angular/router";
import { FaturamentoComponent } from "./faturamento.component";
import { GerarFaturamentoComponent } from "./gerar-faturamento/gerar-faturamento.component";
import { FiltrarFaturamentoComponent } from "./filtrar-faturamento/filtrar-faturamento.component";
import { ExcluirFaturamentoComponent } from "./excluir-faturamento/excluir-faturamento.component";
import { ListaFaturamentoTodosComponent } from "./lista-faturamentotodos/lista-faturamentotodos.component";





export const faturamentoRouterConfig: Routes = [
    {
        path: '', component: FaturamentoComponent,
        children: [
            { path: '', component: FiltrarFaturamentoComponent },
            { path: 'gerar', component: GerarFaturamentoComponent },      
            { path: 'excluir/:id',  component: ExcluirFaturamentoComponent },
            { path: 'lista', component: ListaFaturamentoTodosComponent }             
        ]
    }
];