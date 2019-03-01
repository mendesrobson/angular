import { Routes } from '@angular/router';

import { HistoricopadraoComponent } from './historicopadrao.component';
import { ListaHistoricopadraoComponent } from './lista-historicopadrao/lista-historicopadrao.component';
import { AdicionarHistoricopadraoComponent } from './adicionar-historicopadrao/adicionar-historicopadrao.component';
import { EditarHistoricopadraoComponent } from './editar-historicopadrao/editar-historicopadrao.component';
import { ExcluirHistoricopadraoComponent } from './excluir-historicopadrao/excluir-historicopadrao.component';
import { ReativarHistoricopadraoComponent } from './reativar-historicopadrao/reativar-historicopadrao.component';

export const historicoPadraoRouterConfig: Routes = [
    {
        path: '', component: HistoricopadraoComponent,
        data: {
            title: 'Histórico Padrão',
            urls: [{title: 'Histórico Padrão',url: '/historicopadrao'},{title: 'Histórico Padrão'}]
        },
        children: [
            { path: '', component: ListaHistoricopadraoComponent,
                data: {
                    title: 'Histórico Padrão',
                    urls: [{title: 'Histórico Padrão',url: '/historicopadrao'},{title: 'Histórico Padrão'}]
                }
            },
            { path: 'adicionar', component: AdicionarHistoricopadraoComponent,
                data: {
                    title: 'Histórico Padrão',
                    urls: [{title: 'Histórico Padrão',url: '/historicopadrao'},{title: 'Histórico Padrão'}]
                }
            },
            { path: 'editar/:id', component: EditarHistoricopadraoComponent, 
                data: {
                    title: 'Histórico Padrão',
                    urls: [{title: 'Histórico Padrão',url: '/historicopadrao'},{title: 'Histórico Padrão'}]
                }
            },
            { path: 'excluir/:id', component: ExcluirHistoricopadraoComponent,
                data: {
                    title: 'Histórico Padrão',
                    urls: [{title: 'Histórico Padrão',url: '/historicopadrao'},{title: 'Histórico Padrão'}]
                }
            },
            { path: 'reativar/:id', component: ReativarHistoricopadraoComponent,
                data: {
                    title: 'Histórico Padrão',
                    urls: [{title: 'Histórico Padrão',url: '/historicopadrao'},{title: 'Histórico Padrão'}]
                }
            },
            { path: 'lista', component: ListaHistoricopadraoComponent,
                data: {
                    title: 'Histórico Padrão',
                    urls: [{title: 'Histórico Padrão',url: '/historicopadrao'},{title: 'Histórico Padrão'}]
                }
            }
        ]
    }
];