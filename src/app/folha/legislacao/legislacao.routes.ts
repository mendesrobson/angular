import { Routes } from '@angular/router';
import { LegislacaoComponent } from './legislacao.component';
import { ListaLegislacaoComponent } from './lista-legislacao/lista-legislacao.component';
import { AdicionarLegislacaoComponent } from './adicionar-legislacao/adicionar-legislacao.component';
import { EditarLegislacaoComponent } from './editar-legislacao/editar-legislacao.component';
import { ExcluirLegislacaoComponent } from './excluir-legislacao/excluir-legislacao.component';
import { ReativarLegislacaoComponent } from './reativar-legislacao/reativar-legislacao.component';

export const legislacaoRouterConfig: Routes = [
    {
        path: '', component: LegislacaoComponent,
        children: [
            { path: '', component: ListaLegislacaoComponent,
                data: {
                    title: 'Cadastro Legislação',
                    urls: [{title: 'Folha', url: '/legislacao'}, {title: 'Legislação'}]
                }
            },
            { path: 'adicionar', component: AdicionarLegislacaoComponent,
                data: {
                    title: 'Cadastro Legislação',
                    urls: [{title: 'Folha', url: '/legislacao'}, {title: 'Legislação'}]
                }
            },
            { path: 'editar/:id',  component: EditarLegislacaoComponent,
                data: {
                    title: 'Cadastro Legislação',
                    urls: [{title: 'Folha', url: '/legislacao'}, {title: 'Legislação'}]
                }
            },
            { path: 'lista', component: ListaLegislacaoComponent,
                data: {
                    title: 'Cadastro Legislação',
                    urls: [{title: 'Folha', url: '/legislacao'}, {title: 'Legislação'}]
                }
            },
            { path: 'excluir/:id', component: ExcluirLegislacaoComponent,
                data: {
                    title: 'Cadastro Legislação',
                    urls: [{title: 'Folha', url: '/legislacao'}, {title: 'Legislação'}]
                }
            },
            { path: 'reativar/:id', component: ReativarLegislacaoComponent,
                data: {
                    title: 'Cadastro Legislação',
                    urls: [{title: 'Folha', url: '/legislacao'}, {title: 'Legislação'}]
                }
            }
        ]
    }
];
