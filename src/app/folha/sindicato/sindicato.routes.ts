import { Routes } from '@angular/router';

import { SindicatoComponent } from './sindicato.component';
import { ListaSindicatoComponent } from './lista-sindicato/lista-sindicato.component';
import { AdicionarSindicatoComponent } from './adicionar-sindicato/adicionar-sindicato.component';
import { ReativarSindicatoComponent } from './reativar-sindicato/reativar-sindicato.component';
import { EditarSindicatoComponent } from './editar-sindicato/editar-sindicato.component';
import { ExcluirSindicatoComponent } from './excluir-sindicato/excluir-sindicato.component';

export const sindicatoRouterConfig: Routes = [
    {
        path: '', component: SindicatoComponent,
        data: {
            title: 'Sindicato',
            urls: [{ title: 'Folha', url: '/sindicato' }, { title: 'Sindicato' }]
        },
        children: [
            {
                path: '', component: ListaSindicatoComponent,
                data: {
                    title: 'Sindicato',
                    urls: [{ title: 'Folha', url: '/sindicato' }, { title: 'Sindicato' }]
                }
            },
            {
                path: 'adicionar', component: AdicionarSindicatoComponent,
                data: {
                    title: 'Sindicato',
                    urls: [{ title: 'Folha', url: '/sindicato' }, { title: 'Sindicato' }]
                }
            },
            {
                path: 'editar/:id', component: EditarSindicatoComponent,
                data: {
                    title: 'Sindicato',
                    urls: [{ title: 'Folha', url: '/sindicato' }, { title: 'Sindicato' }]
                }
            },
            {
                path: 'lista', component: ListaSindicatoComponent,
                data: {
                    title: 'Sindicato',
                    urls: [{ title: 'Folha', url: '/sindicato' }, { title: 'Sindicato' }]
                }
            },
            {
                path: 'excluir/:id', component: ExcluirSindicatoComponent,
                data: {
                    title: 'Sindicato',
                    urls: [{ title: 'Folha', url: '/sindicato' }, { title: 'Sindicato' }]
                }
            },
            {
                path: 'reativar/:id', component: ReativarSindicatoComponent,
                data: {
                    title: 'Sindicato',
                    urls: [{ title: 'Folha', url: '/sindicato' }, { title: 'Sindicato' }]
                }
            }
        ]
    }
];