import { Routes } from '@angular/router';
import { CobrancaComponent } from './cobranca.component';
import { FiltroCobrancaparcelaComponent } from './filtro-cobrancaparcela/filtro-cobrancaparcela.component';

export const cobrancaRouterConfig: Routes = [
    {
        path: '', component: CobrancaComponent,
        data: {
            title: 'Cobrança',
            urls: [{title: 'Contas a Receber',url:'/cobranca'},{title: 'Cobrança'}]
        },
        children: [
            { path: '', component: FiltroCobrancaparcelaComponent,
                data: {
                    title: 'Cobrança',
                    urls: [{title: 'Contas a Receber',url:'/cobranca'},{title: 'Cobrança'}]
                }
            },
            { path: 'lista', component: FiltroCobrancaparcelaComponent,
                data: {
                    title: 'Cobrança',
                    urls: [{title: 'Contas a Receber',url:'/cobranca'},{title: 'Cobrança'}]
                }
            }
        ]
    }
];