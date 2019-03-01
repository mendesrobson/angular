import { Routes } from '@angular/router';

import { TipoafastamentoComponent } from './tipoafastamento.component';
import { ListaTipoafastamentoComponent } from './lista-tipoafastamento/lista-tipoafastamento.component';
import { AdicionarTipoafastamentoComponent } from './adicionar-tipoafastamento/adicionar-tipoafastamento.component';
import { ReativarTipoafastamentoComponent } from './reativar-tipoafastamento/reativar-tipoafastamento.component';
import { EditarTipoafastamentoComponent } from './editar-tipoafastamento/editar-tipoafastamento.component';
import { ExcluirTipoafastamentoComponent } from './excluir-tipoafastamento/excluir-tipoafastamento.component';

export const tipoAfastamentoRouterConfig: Routes = [
    {
        path: '', component: TipoafastamentoComponent,
        data: {
            title: 'Tipo de Afastamento',
            urls: [{ title: 'Folha', url: '/tipoafastamento' }, { title: 'Tipo de Afastamento' }]
        },
        children: [
            {
                path: '', component: ListaTipoafastamentoComponent,
                data: {
                    title: 'Tipo de Afastamento',
                    urls: [{ title: 'Folha', url: '/tipoafastamento' }, { title: 'Tipo de Afastamento' }]
                }
            },
            {
                path: 'adicionar', component: AdicionarTipoafastamentoComponent,
                data: {
                    title: 'Tipo de Afastamento',
                    urls: [{ title: 'Folha', url: '/tipoafastamento' }, { title: 'Tipo de Afastamento' }]
                }
            },
            {
                path: 'editar/:id', component: EditarTipoafastamentoComponent,
                data: {
                    title: 'Tipo de Afastamento',
                    urls: [{ title: 'Folha', url: '/tipoafastamento' }, { title: 'Tipo de Afastamento' }]
                }
            },
            {
                path: 'lista', component: ListaTipoafastamentoComponent,
                data: {
                    title: 'Tipo de Afastamento',
                    urls: [{ title: 'Folha', url: '/tipoafastamento' }, { title: 'Tipo de Afastamento' }]
                }
            },
            {
                path: 'excluir/:id', component: ExcluirTipoafastamentoComponent,
                data: {
                    title: 'Tipo de Afastamento',
                    urls: [{ title: 'Folha', url: '/tipoafastamento' }, { title: 'Tipo de Afastamento' }]
                }
            },
            {
                path: 'reativar/:id', component: ReativarTipoafastamentoComponent,
                data: {
                    title: 'Tipo de Afastamento',
                    urls: [{ title: 'Folha', url: '/tipoafastamento' }, { title: 'Tipo de Afastamento' }]
                }
            }
        ]
    }
];