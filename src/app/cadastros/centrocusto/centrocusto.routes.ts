import { Routes } from '@angular/router';

import { CentrocustoComponent } from './centrocusto.component';
import { ListaCentrocustoComponent } from './lista-centrocusto/lista-centrocusto.component';
import { AdicionarCentrocustoComponent } from './adicionar-centrocusto/adicionar-centrocusto.component';
import { EditarCentrocustoComponent } from './editar-centrocusto/editar-centrocusto.component';
import { ExcluirCentrocustoComponent } from './excluir-centrocusto/excluir-centrocusto.component';
import { ReativarCentrocustoComponent } from './reativar-centrocusto/reativar-centrocusto.component';

export const centroCustoRouterConfig: Routes = [
    {
        path: '', component: CentrocustoComponent,
        data: {
            title: 'Centro de Custo',
            urls: [{ title: 'Histórico Padrão', url: '/centrocusto' }, { title: 'Centro de Custo' }]
        },
        children: [
            { path: '', component: ListaCentrocustoComponent,
                data: {
                    title: 'Centro de Custo',
                    urls: [{ title: 'Histórico Padrão', url: '/centrocusto' }, { title: 'Centro de Custo' }]
                }
            },
            { path: 'adicionar', component: AdicionarCentrocustoComponent,
                data: {
                    title: 'Centro de Custo',
                    urls: [{ title: 'Histórico Padrão', url: '/centrocusto' }, { title: 'Centro de Custo' }]
                }
            },
            { path: 'editar/:id',  component: EditarCentrocustoComponent, 
                data: {
                    title: 'Centro de Custo',
                    urls: [{ title: 'Histórico Padrão', url: '/centrocusto' }, { title: 'Centro de Custo' }]
                }
            },
            { path: 'excluir/:id',  component: ExcluirCentrocustoComponent,
                data: {
                    title: 'Centro de Custo',
                    urls: [{ title: 'Histórico Padrão', url: '/centrocusto' }, { title: 'Centro de Custo' }]
                }
            },
            { path: 'reativar/:id',  component: ReativarCentrocustoComponent,
                data: {
                    title: 'Centro de Custo',
                    urls: [{ title: 'Histórico Padrão', url: '/centrocusto' }, { title: 'Centro de Custo' }]
                }
            },
            { path: 'lista', component: ListaCentrocustoComponent,
                data: {
                    title: 'Centro de Custo',
                    urls: [{ title: 'Histórico Padrão', url: '/centrocusto' }, { title: 'Centro de Custo' }]
                }
            }            
        ]
    }
];