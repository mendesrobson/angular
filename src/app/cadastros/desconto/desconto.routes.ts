import { Routes } from '@angular/router';

import { DescontoComponent } from './desconto.component';
import { ListaDescontoComponent } from './lista-desconto/lista-desconto.component';
import { AdicionarDescontoComponent } from './adicionar-desconto/adicionar-desconto.component';
import { EditarDescontoComponent } from './editar-desconto/editar-desconto.component';
import { ExcluirDescontoComponent } from './excluir-desconto/excluir-desconto.component';
import { ReativarDescontoComponent } from './reativar-desconto/reativar-desconto.component';

export const DescontoRouterConfig: Routes = [
    {
        path: '', component: DescontoComponent,
        data: {
            title: 'Desconto',
            urls: [{ title: 'Titulos a Receber', url: '/desconto' }, { title: 'Desconto' }]
        },
        children: [
            { path: '', component: ListaDescontoComponent,
                data: {
                    title: 'Desconto',
                    urls: [{ title: 'Titulos a Receber', url: '/desconto' }, { title: 'Desconto' }]
                }
            },
            { path: 'adicionar', component: AdicionarDescontoComponent, 
                data: {
                    title: 'Desconto',
                    urls: [{ title: 'Titulos a Receber', url: '/desconto' }, { title: 'Desconto' }]
                }
            },
            { path: 'editar/:id',  component: EditarDescontoComponent, 
                data: {
                    title: 'Desconto',
                    urls: [{ title: 'Titulos a Receber', url: '/desconto' }, { title: 'Desconto' }]
                }
            },
            { path: 'excluir/:id',  component: ExcluirDescontoComponent, 
                data: {
                    title: 'Desconto',
                    urls: [{ title: 'Titulos a Receber', url: '/desconto' }, { title: 'Desconto' }]
                }
            },
            { path: 'reativar/:id',  component: ReativarDescontoComponent, 
                data: {
                    title: 'Desconto',
                    urls: [{ title: 'Titulos a Receber', url: '/desconto' }, { title: 'Desconto' }]
                }
            },
            { path: 'lista', component: ListaDescontoComponent,
                data: {
                    title: 'Desconto',
                    urls: [{ title: 'Titulos a Receber', url: '/desconto' }, { title: 'Desconto' }]
                }
            }            
        ]
    }
];