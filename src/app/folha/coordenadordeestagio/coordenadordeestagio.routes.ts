import { Routes } from '@angular/router';

import { CoordenadorDeEstagioComponent } from './coordenadordeestagio.component';
import { ListaCoordenadorDeEstagioComponent } from './lista-coordenadordeestagio/lista-coordenadordeestagio.component';
import { AdicionarCoordenadorDeEstagioComponent } from './adicionar-coordenadordeestagio/adicionar-coordenadordeestagio.component';
import { ReativarCoordenadorDeEstagioComponent } from './reativar-coordenadordeestagio/reativar-coordenadordeestagio.component';
import { EditarCoordenadorDeEstagioComponent } from './editar-coordenadordeestagio/editar-coordenadordeestagio.component';
import { ExcluirCoordenadorDeEstagioComponent } from './excluir-coordenadordeestagio/excluir-coordenadordeestagio.component';

export const coordenadorDeEstagioRouterConfig: Routes = [
    {
        path: '', component: CoordenadorDeEstagioComponent,
        data: {
            title: 'Coordenador de Estágio',
            urls: [{ title: 'Folha', url: '/coordenadordeestagio' }, { title: 'Coordenador de Estágio' }]
        },
        children: [
            {
                path: '', component: ListaCoordenadorDeEstagioComponent,
                data: {
                    title: 'Coordenador de Estágio',
                    urls: [{ title: 'Folha', url: '/coordenadordeestagio' }, { title: 'Coordenador de Estágio' }]
                }
            },
            {
                path: 'adicionar', component: AdicionarCoordenadorDeEstagioComponent,
                data: {
                    title: 'Coordenador de Estágio',
                    urls: [{ title: 'Folha', url: '/coordenadordeestagio' }, { title: 'Coordenador de Estágio' }]
                }
            },
            {
                path: 'editar/:id', component: EditarCoordenadorDeEstagioComponent,
                data: {
                    title: 'Coordenador de Estágio',
                    urls: [{ title: 'Folha', url: '/coordenadordeestagio' }, { title: 'Coordenador de Estágio' }]
                }
            },
            {
                path: 'lista', component: ListaCoordenadorDeEstagioComponent,
                data: {
                    title: 'Coordenador de Estágio',
                    urls: [{ title: 'Folha', url: '/coordenadordeestagio' }, { title: 'Coordenador de Estágio' }]
                }
            },
            {
                path: 'excluir/:id', component: ExcluirCoordenadorDeEstagioComponent,
                data: {
                    title: 'Coordenador de Estágio',
                    urls: [{ title: 'Folha', url: '/coordenadordeestagio' }, { title: 'Coordenador de Estágio' }]
                }
            },
            {
                path: 'reativar/:id', component: ReativarCoordenadorDeEstagioComponent,
                data: {
                    title: 'Coordenador de Estágio',
                    urls: [{ title: 'Folha', url: '/coordenadordeestagio' }, { title: 'Coordenador de Estágio' }]
                }
            }
        ]
    }
];