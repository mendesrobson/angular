import { Routes } from '@angular/router';

import { SitgeradoraacidentetrabalhoComponent } from './sitgeradoraacidentetrabalho.component';
import { ListaSitgeradoraacidentetrabalhoComponent } from './lista-sitgeradoraacidentetrabalho/lista-sitgeradoraacidentetrabalho.component';
import { AdicionarSitgeradoraacidentetrabalhoComponent } from './adicionar-sitgeradoraacidentetrabalho/adicionar-sitgeradoraacidentetrabalho.component';
import { ReativarSitgeradoraacidentetrabalhoComponent } from './reativar-sitgeradoraacidentetrabalho/reativar-sitgeradoraacidentetrabalho.component';
import { EditarSitgeradoraacidentetrabalhoComponent } from './editar-sitgeradoraacidentetrabalho/editar-sitgeradoraacidentetrabalho.component';
import { ExcluirSitgeradoraacidentetrabalhoComponent } from './excluir-sitgeradoraacidentetrabalho/excluir-sitgeradoraacidentetrabalho.component';

export const sitGeradoraAcidenteTrabalhoRouterConfig: Routes = [
    {
        path: '', component: SitgeradoraacidentetrabalhoComponent,
        data: {
            title: 'Situação Geradora do acidente de trabalho',
            urls: [{ title: 'Folha', url: '/sitgeradoraacidentetrabalho' }, { title: 'Situação Geradora do acidente de trabalho' }]
        },
        children: [
            {
                path: '', component: ListaSitgeradoraacidentetrabalhoComponent,
                data: {
                    title: 'Situação Geradora do acidente de trabalho',
                    urls: [{ title: 'Folha', url: '/sitgeradoraacidentetrabalho' }, { title: 'Situação Geradora do acidente de trabalho' }]
                }
            },
            {
                path: 'adicionar', component: AdicionarSitgeradoraacidentetrabalhoComponent,
                data: {
                    title: 'Situação Geradora do acidente de trabalho',
                    urls: [{ title: 'Folha', url: '/sitgeradoraacidentetrabalho' }, { title: 'Situação Geradora do acidente de trabalho' }]
                }
            },
            {
                path: 'editar/:id', component: EditarSitgeradoraacidentetrabalhoComponent,
                data: {
                    title: 'Situação Geradora do acidente de trabalho',
                    urls: [{ title: 'Folha', url: '/sitgeradoraacidentetrabalho' }, { title: 'Situação Geradora do acidente de trabalho' }]
                }
            },
            {
                path: 'lista', component: ListaSitgeradoraacidentetrabalhoComponent,
                data: {
                    title: 'Situação Geradora do acidente de trabalho',
                    urls: [{ title: 'Folha', url: '/sitgeradoraacidentetrabalho' }, { title: 'Situação Geradora do acidente de trabalho' }]
                }
            },
            {
                path: 'excluir/:id', component: ExcluirSitgeradoraacidentetrabalhoComponent,
                data: {
                    title: 'Situação Geradora do acidente de trabalho',
                    urls: [{ title: 'Folha', url: '/sitgeradoraacidentetrabalho' }, { title: 'Situação Geradora do acidente de trabalho' }]
                }
            },
            {
                path: 'reativar/:id', component: ReativarSitgeradoraacidentetrabalhoComponent,
                data: {
                    title: 'Situação Geradora do acidente de trabalho',
                    urls: [{ title: 'Folha', url: '/sitgeradoraacidentetrabalho' }, { title: 'Situação Geradora do acidente de trabalho' }]
                }
            }
        ]
    }
];