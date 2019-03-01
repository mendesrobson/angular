import { Routes } from '@angular/router';
import { ListaContratoFaturamentoComponent } from './lista-contratofaturamento/lista-contratofaturamento.component';
import { AdicionarContratoFaturamentoComponent } from './adicionar-contratofaturamento/adicionar-contratofaturamento.component';
import { EditarContratoFaturamentoComponent } from './editar-contratofaturamento/editar-contratofaturamento.component';
import { ExcluirContratoFaturamentoComponent } from './excluir-contratofaturamento/excluir-contratofaturamento.component';
import { ReativarContratoFaturamentoComponent } from './reativar-contratofaturamento/reativar-contratofaturamento.component';
import { ContratoFaturamentoComponent } from './contratofaturamento.component';


export const contratoFaturamentoRouterConfig: Routes = [
    {
        path: '', component: ContratoFaturamentoComponent,
        data: {
            title: 'Cadastro de Contrato Faturamento',
            urls: [{title: 'Faturamento',url:'/contratofaturamento'},{title: 'Contrato Faturamento'}]
        },
        children: [
            { path: '', component: ListaContratoFaturamentoComponent },
            { path: 'adicionar', component: AdicionarContratoFaturamentoComponent,
                data: {
                    title: 'Cadastro de Contrato Faturamento',
                    urls: [{title: 'Faturamento',url:'/contratofaturamento'},{title: 'Contrato Faturamento'}]
                },
            },
            { path: 'editar/:id',  component: EditarContratoFaturamentoComponent, 
                data: {
                    title: 'Cadastro de Contrato Faturamento',
                    urls: [{title: 'Faturamento',url:'/contratofaturamento'},{title: 'Contrato Faturamento'}]
                },
            },
            { path: 'excluir/:id',  component: ExcluirContratoFaturamentoComponent, 
                data: {
                    title: 'Cadastro de Contrato Faturamento',
                    urls: [{title: 'Faturamento',url:'/contratofaturamento'},{title: 'Contrato Faturamento'}]
                },
            },
            { path: 'reativar/:id',  component: ReativarContratoFaturamentoComponent, 
                data: {
                    title: 'Cadastro de Contrato Faturamento',
                    urls: [{title: 'Faturamento',url:'/contratofaturamento'},{title: 'Contrato Faturamento'}]
                },
            },
            { path: 'lista', component: ListaContratoFaturamentoComponent, 
                data: {
                    title: 'Cadastro de Contrato Faturamento',
                    urls: [{title: 'Faturamento',url:'/contratofaturamento'},{title: 'Contrato Faturamento'}]
                },
            }            
        ]
    }
];