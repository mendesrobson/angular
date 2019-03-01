import { Routes } from '@angular/router';

import { GradeComponent } from './grade.component';
import { ListaGradeComponent } from './lista-grade/lista-grade.component';
import { AdicionarGradeComponent } from './adicionar-grade/adicionar-grade.component';
import { ReativarGradeComponent } from './reativar-grade/reativar-grade.component';
import { EditarGradeComponent } from './editar-grade/editar-grade.component';
import { ExcluirGradeComponent } from './excluir-grade/excluir-grade.component';


export const gradeRouterConfig: Routes = [
    {
        path: '', component: GradeComponent,
        children: [
            {
                path: '', component: ListaGradeComponent,
                data: {
                    title: 'Folha',
                    urls: [{ title: 'Cadastro Grade', url: '/grade' }, { title: 'Grade' }]
                }
            },
            {
                path: 'adicionar', component: AdicionarGradeComponent,
                data: {
                    title: 'Folha',
                    urls: [{ title: 'Cadastro Grade', url: '/grade' }, { title: 'Grade' }]
                }
            },
            {
                path: 'editar/:id', component: EditarGradeComponent,
                data: {
                    title: 'Folha',
                    urls: [{ title: 'Cadastro Grade', url: '/grade' }, { title: 'Grade' }]
                }
            },
            {
                path: 'lista', component: ListaGradeComponent,
                data: {
                    title: 'Folha',
                    urls: [{ title: 'Cadastro Grade', url: '/grade' }, { title: 'Grade' }]
                }
            },
            {
                path: 'excluir/:id', component: ExcluirGradeComponent,
                data: {
                    title: 'Folha',
                    urls: [{ title: 'Cadastro Grade', url: '/grade' }, { title: 'Grade' }]
                }
            },
            {
                path: 'reativar/:id', component: ReativarGradeComponent,
                data: {
                    title: 'Folha',
                    urls: [{ title: 'Cadastro Grade', url: '/grade' }, { title: 'Grade' }]
                }
            }
        ]
    }
];
