import { Routes } from '@angular/router';
import { RenegociacaoComponent } from './renegociacao.component';
import { ListaRenegociacaoComponent } from './lista-renegociacao/lista-renegociacao.component';
import { AdicionarRenegociacaoComponent } from './adicionar-renegociacao/adicionar-renegociacao.component';
import { EditarRenegociacaoComponent } from './editar-renegociacao/editar-renegociacao.component';

export const renegociacaoRouterConfig: Routes = [
    {
        path: '', component: RenegociacaoComponent,
        data: {
            title: 'Renegociação',
            urls: [{title: 'Contas a Receber',url:'/renegociacao'},{title: 'Renegociação'}]
        },
        children: [
            { path: ':natureza', component: ListaRenegociacaoComponent,
                data: {
                    title: 'Renegociação',
                    urls: [{title: 'Contas a Receber',url:'/renegociacao/receber'},{title: 'Renegociação'}]
                }
            },
            { path: 'lista/:natureza', component: ListaRenegociacaoComponent,
                data: {
                    title: 'Renegociação',
                    urls: [{title: 'Contas a Receber',url:'/renegociacao/receber'},{title: 'Renegociação'}]
                }
            },
            { path: 'adicionar/:natureza', component: AdicionarRenegociacaoComponent,
                data: {
                    title: 'Renegociação',
                    urls: [{title: 'Contas a Receber',url:'/renegociacao/receber'},{title: 'Renegociação'}]
                }
            },
            { path: 'editar/:natureza/:id', component: EditarRenegociacaoComponent,
                data: {
                    title: 'Renegociação',
                    urls: [{title: 'Contas a Receber',url:'/renegociacao/receber'},{title: 'Renegociação'}]
                }
            }
        ]
    }
];