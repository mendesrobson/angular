import { Routes } from '@angular/router';


import { ListaTipodeficienciaComponent } from './lista-tipodeficiencia/lista-tipodeficiencia.component';
import { AdicionarTipodeficienciaComponent } from './adicionar-tipodeficiencia/adicionar-tipodeficiencia.component';
import { ReativarTipodeficienciaComponent } from './reativar-tipodeficiencia/reativar-tipodeficiencia.component';
import { EditarTipodeficienciaComponent } from './editar-tipodeficiencia/editar-tipodeficiencia.component';
import { ExcluirTipodeficienciaComponent } from './excluir-tipodeficiencia/excluir-tipodeficiencia.component';
import { TipodeficienciaComponent } from './tipodeficiencia.component';

export const tipoDeficienciaRouterConfig: Routes = [
    {
        path: '', component: TipodeficienciaComponent,
        data: {
            title: 'Tipo de Deficiência',
            urls: [{ title: 'Folha', url: '/tipodeficiencia' }, { title: 'Tipo de Deficiência' }]
        },
        children: [
            {
                path: '', component: ListaTipodeficienciaComponent,
                data: {
                    title: 'Tipo de Deficiência',
                    urls: [{ title: 'Folha', url: '/tipodeficiencia' }, { title: 'Tipo de Deficiência' }]
                }
            },
            {
                path: 'adicionar', component: AdicionarTipodeficienciaComponent,
                data: {
                    title: 'Tipo de Deficiência',
                    urls: [{ title: 'Folha', url: '/tipodeficiencia' }, { title: 'Tipo de Deficiência' }]
                }
            },
            {
                path: 'editar/:id', component: EditarTipodeficienciaComponent,
                data: {
                    title: 'Tipo de Deficiência',
                    urls: [{ title: 'Folha', url: '/tipodeficiencia' }, { title: 'Tipo de Deficiência' }]
                }
            },
            {
                path: 'lista', component: ListaTipodeficienciaComponent,
                data: {
                    title: 'Tipo de Deficiência',
                    urls: [{ title: 'Folha', url: '/tipodeficiencia' }, { title: 'Tipo de Deficiência' }]
                }
            },
            {
                path: 'excluir/:id', component: ExcluirTipodeficienciaComponent,
                data: {
                    title: 'Tipo de Deficiência',
                    urls: [{ title: 'Folha', url: '/tipodeficiencia' }, { title: 'Tipo de Deficiência' }]
                }
            },
            {
                path: 'reativar/:id', component: ReativarTipodeficienciaComponent,
                data: {
                    title: 'Tipo de Deficiência',
                    urls: [{ title: 'Folha', url: '/tipodeficiencia' }, { title: 'Tipo de Deficiência' }]
                }
            }
        ]
    }
];