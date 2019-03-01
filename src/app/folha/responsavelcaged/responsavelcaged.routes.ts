import { Routes } from '@angular/router';

import { ResponsavelcagedComponent } from './responsavelcaged.component';
import { ListaResponsavelcagedComponent } from './lista-responsavelcaged/lista-responsavelcaged.component';
import { AdicionarResponsavelcagedComponent } from './adicionar-responsavelcaged/adicionar-responsavelcaged.component';
import { ReativarResponsavelcagedComponent } from './reativar-responsavelcaged/reativar-responsavelcaged.component';
import { EditarResponsavelcagedComponent } from './editar-responsavelcaged/editar-responsavelcaged.component';
import { ExcluirResponsavelcagedComponent } from './excluir-responsavelcaged/excluir-responsavelcaged.component';

export const responsavelCagedRouterConfig: Routes = [
    {
        path: '', component: ResponsavelcagedComponent,
        data: {
            title: 'Responsável Caged',
            urls: [{ title: 'Folha', url: '/responsavelcaged' }, { title: 'Responsável Caged' }]
        },
        children: [
            {
                path: '', component: ListaResponsavelcagedComponent,
                data: {
                    title: 'Responsável Caged',
                    urls: [{ title: 'Folha', url: '/responsavelcaged' }, { title: 'Responsável Caged' }]
                }
            },
            {
                path: 'adicionar', component: AdicionarResponsavelcagedComponent,
                data: {
                    title: 'Responsável Caged',
                    urls: [{ title: 'Folha', url: '/responsavelcaged' }, { title: 'Responsável Caged' }]
                }
            },
            {
                path: 'editar/:id', component: EditarResponsavelcagedComponent,
                data: {
                    title: 'Responsável Caged',
                    urls: [{ title: 'Folha', url: '/responsavelcaged' }, { title: 'Responsável Caged' }]
                }
            },
            {
                path: 'lista', component: ListaResponsavelcagedComponent,
                data: {
                    title: 'Responsável Caged',
                    urls: [{ title: 'Folha', url: '/responsavelcaged' }, { title: 'Responsável Caged' }]
                }
            },
            {
                path: 'excluir/:id', component: ExcluirResponsavelcagedComponent,
                data: {
                    title: 'Responsável Caged',
                    urls: [{ title: 'Folha', url: '/responsavelcaged' }, { title: 'Responsável Caged' }]
                }
            },
            {
                path: 'reativar/:id', component: ReativarResponsavelcagedComponent,
                data: {
                    title: 'Responsável Caged',
                    urls: [{ title: 'Folha', url: '/responsavelcaged' }, { title: 'Responsável Caged' }]
                }
            }
        ]
    }
];