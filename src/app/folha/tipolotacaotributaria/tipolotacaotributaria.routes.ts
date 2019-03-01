import { Routes } from "@angular/router";
import { TipolotacaotributariaComponent } from "./tipolotacaotributaria.component";
import { ListaTipolotacaotributariaComponent } from "./lista-tipolotacaotributaria/lista-tipolotacaotributaria.component";
import { AdicionarTipolotacaotributariaComponent } from './adicionar-tipolotacaotributaria/adicionar-tipolotacaotributaria.component';
import { EditarTipolotacaotributariaComponent } from './editar-tipolotacaotributaria/editar-tipolotacaotributaria.component';
import { ReativarTipolotacaotributariaComponent } from './reativar-tipolotacaotributaria/reativar-tipolotacaotributaria.component';
import { ExcluirTipolotacaotributariaComponent } from "./excluir-tipolotacaotributaria/excluir-tipolotacaotributaria.component";

export const TipolotacaotributariaRouterConfig: Routes = [
    {
        path: '', component: TipolotacaotributariaComponent,
        data: {
            title: 'Tipos de Lotação Tributária',
            urls: [{ title: 'Folha', url: '/tipolotacaotributaria' }, { title: 'Tipos de Lotação Tributária' }]
        },
        children: [
            {
                path: '', component: ListaTipolotacaotributariaComponent,
                data: {
                    title: 'Tipos de Lotação Tributária',
                    urls: [{ title: 'Folha', url: '/tipolotacaotributaria' }, { title: 'Tipos de Lotação Tributária' }]
                }
            },
            {
                path: 'adicionar', component: AdicionarTipolotacaotributariaComponent,
                data: {
                    title: 'Tipos de Lotação Tributária',
                    urls: [{ title: 'Folha', url: '/tipolotacaotributaria' }, { title: 'Tipos de Lotação Tributária' }]
                }
            },
            {
                path: 'editar/:id', component: EditarTipolotacaotributariaComponent,
                data: {
                    title: 'Tipos de Lotação Tributária',
                    urls: [{ title: 'Folha', url: '/tipolotacaotributaria' }, { title: 'Tipos de Lotação Tributária' }]
                }
            },
            {
                path: 'lista', component: ListaTipolotacaotributariaComponent,
                data: {
                    title: 'Tipos de Lotação Tributária',
                    urls: [{ title: 'Folha', url: '/tipolotacaotributaria' }, { title: 'Tipos de Lotação Tributária' }]
                }
            },
            {
                path: 'excluir/:id', component: ExcluirTipolotacaotributariaComponent,
                data: {
                    title: 'Tipos de Lotação Tributária',
                    urls: [{ title: 'Folha', url: '/tipolotacaotributaria' }, { title: 'Tipos de Lotação Tributária' }]
                }
            },
            {
                path: 'reativar/:id', component: ReativarTipolotacaotributariaComponent,
                data: {
                    title: 'Tipos de Lotação Tributária',
                    urls: [{ title: 'Folha', url: '/tipolotacaotributaria' }, { title: 'Tipos de Lotação Tributária' }]
                }
            }
        ]
    }
];