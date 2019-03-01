import { Routes } from '@angular/router';
import { GerarArquivoPagamentoComponent } from './gerar-arquivopagamento/gerar-arquivopagamento.component';
import { GerarRemessaPagamentoComponent } from './gerarremessapagamento.component';



export const gerarRemessaPagamentoRouterConfig: Routes = [
    {
        path: '', component: GerarRemessaPagamentoComponent,
        data: {
            title: 'Gerar Remessa de Pagamentos',
            urls: [{title: 'Títulos a Pagar',url:'/gerarremessapagamento'},{title: 'Gerar Remessa de Pagamentos'}]
        },
        children: [
            { path: '', component: GerarArquivoPagamentoComponent,
                data: {
                    title: 'Gerar Remessa de Pagamentos',
                    urls: [{title: 'Títulos a Pagar',url:'/gerarremessapagamento'},{title: 'Gerar Remessa de Pagamentos'}]
                }
            }         
        ]
    }
];