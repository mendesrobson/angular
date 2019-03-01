import { Routes } from '@angular/router'; 
import { LerRetornoPagamentoComponent } from './ler-retornopagamento/ler-retornopagamento.component';
import { RetornoPagamentoComponent } from './retornopagamento.component';

export const retornoPagamentoRouterConfig: Routes = [
    {
        path: '', component: RetornoPagamentoComponent,
        data: {
            title: 'Retorno De Pagamento',
            urls: [{title: 'Títulos a Pagar',url:'/lerretornopagamento'},{title: 'etorno De Pagamento'}]
        },
        children: [
            { path: '', component: LerRetornoPagamentoComponent,
                data: {
                    title: 'Retorno De Pagamento',
                    urls: [{title: 'Títulos a Pagar',url:'/lerretornopagamento'},{title: 'etorno De Pagamento'}]
                }
            }
        ]
    }
];