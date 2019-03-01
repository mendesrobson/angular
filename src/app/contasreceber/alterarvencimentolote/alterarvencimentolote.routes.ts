import { Routes } from '@angular/router';
import { AlterarVencimentoLoteComponent } from './alterarvencimentolote.component';
import { ListaParcelaPagarComponent } from './lista-parcelapagar/lista-parcelapagar.component';
import { ListaParcelaReceberComponent } from './lista-parcelareceber/lista-parcelareceber.component';


export const alterarVencimentoLoteRouterConfig: Routes = [
    {
        path: '', component: AlterarVencimentoLoteComponent,
        children: [
            { path: 'pagar', component: ListaParcelaPagarComponent, 
                data: {
                    title: 'Alterar Vencimento a Receber',
                    urls: [{title: 'Contas a Pagar',url:'alterarvencimentolote/pagar'},{title: 'Alterar Vencimento a Pagar'}]
                }
            },
            { path: 'receber', component: ListaParcelaReceberComponent,
                data: {
                    title: 'Alterar Vencimento a Receber',
                    urls: [{title: 'Contas a Receber',url:'alterarvencimentolote/receber'},{title: 'Alterar Vencimento a Receber'}]
                }
            }
        ]
    }
];