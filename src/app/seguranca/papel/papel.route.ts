import { Routes } from '@angular/router';
import { AdicionarPapelComponent } from './adicionar-papel/adicionar-papel.component';
import { ListaPapelComponent } from './lista-papel/lista-papel.component';
import { PapelComponent } from './papel.component';
import { VisualizarPapelComponent } from './visualizar-papel/visualizar-papel.component';
import { ExcluirPapelComponent } from './excluir-papel/excluir-papel.component';

export const papelRouterConfig: Routes = [
    {
        path: '', component: PapelComponent,
        children: [
            {
                path: '', component: ListaPapelComponent,
                data: {
                    title: 'Papéis',
                    urls: [{ title: 'Segurança', url: '/papel' }, { title: 'Lista de Papéis' }]
                }
            },
            {
                path: 'adicionar', component: AdicionarPapelComponent,
                data: {
                    title: 'Cadastro Papel',
                    urls: [{ title: 'Segurança', url: '/papel' }, { title: 'Cadastro Papel' }]
                }
            },
            {
                path: 'lista', component: ListaPapelComponent,
                data: {
                    title: 'Papéis',
                    urls: [{ title: 'Segurança', url: '/papel' }, { title: 'Lista de Papéis' }]
                }
            },
            {
                path: 'visualizar/:id', component: VisualizarPapelComponent,
                data: {
                    title: 'Cadastro Papel',
                    urls: [{ title: 'Segurança', url: '/papel' }, { title: 'Cadastro Papel' }]
                }
            },
            {
                path: 'excluir/:id', component: ExcluirPapelComponent,
                data: {
                    title: 'Cadastro Papel',
                    urls: [{ title: 'Segurança', url: '/papel' }, { title: 'Cadastro Papel' }]
                }
            }
        ]
    }
];