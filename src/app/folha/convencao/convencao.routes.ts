import { Routes } from "@angular/router";
import { ConvencaoComponent } from "./convencao.component";
import { ListaConvencaoComponent } from "./lista-convencao/lista-convencao.component";
import { AdicionarConvencaoComponent } from './adicionar-convencao/adicionar-convencao.component';
import { EditarConvencaoComponent } from './editar-convencao/editar-convencao.component';
import { ExcluirConvencaoComponent } from "./excluir-convencao/excluir-convencao.component";
import { ReativarConvencaoComponent } from './reativar-convencao/reativar-convencao.component';

export const ConvencaoRouterConfig: Routes = [
    {
        path: '', component: ConvencaoComponent,
        data: {
            title: 'Convenção',
            urls: [{ title: 'Folha', url: '/convencao' }, { title: 'Convenção' }]
        },
        children: [
            {
                path: '', component: ListaConvencaoComponent,
                data: {
                    title: 'Convenção',
                    urls: [{ title: 'Folha', url: '/convencao' }, { title: 'Convenção' }]
                }
            },
            {
                path: 'adicionar', component: AdicionarConvencaoComponent,
                data: {
                    title: 'Convenção',
                    urls: [{ title: 'Folha', url: '/convencao' }, { title: 'Convenção' }]
                }
            },
            {
                path: 'editar/:id', component: EditarConvencaoComponent,
                data: {
                    title: 'Convenção',
                    urls: [{ title: 'Folha', url: '/convencao' }, { title: 'Convenção' }]
                }
            },
            {
                path: 'lista', component: ListaConvencaoComponent,
                data: {
                    title: 'Convenção',
                    urls: [{ title: 'Folha', url: '/convencao' }, { title: 'Convenção' }]
                }
            },
            {
                path: 'excluir/:id', component: ExcluirConvencaoComponent,
                data: {
                    title: 'Convenção',
                    urls: [{ title: 'Folha', url: '/convencao' }, { title: 'Convenção' }]
                }
            },
            {
                path: 'reativar/:id', component: ReativarConvencaoComponent,
                data: {
                    title: 'Convenção',
                    urls: [{ title: 'Folha', url: '/convencao' }, { title: 'Convenção' }]
                }
            }
        ]
    }
];