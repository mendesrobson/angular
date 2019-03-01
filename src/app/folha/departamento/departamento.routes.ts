import { Routes } from "@angular/router";
import { DepartamentoComponent } from "./departamento.component";
import { ListaDepartamentoComponent } from "./lista-departamento/lista-departamento.component";
import { AdicionarDepartamentoComponent } from './adicionar-departamento/adicionar-departamento.component';
import { EditarDepartamentoComponent } from './editar-departamento/editar-departamento.component';
import { ExcluirDepartamentoComponent } from "./excluir-departamento/excluir-departamento.component";
import { ReativarDepartamentoComponent } from './reativar-departamento/reativar-departamento.component';

export const DepartamentoRouterConfig: Routes = [
    {
        path: '', component: DepartamentoComponent,
        data: {
            title: 'Departamento',
            urls: [{ title: 'Folha', url: '/departamento' }, { title: 'Departamento' }]
        },
        children: [
            {
                path: '', component: ListaDepartamentoComponent,
                data: {
                    title: 'Departamento',
                    urls: [{ title: 'Folha', url: '/departamento' }, { title: 'Departamento' }]
                }
            },
            {
                path: 'adicionar', component: AdicionarDepartamentoComponent,
                data: {
                    title: 'Departamento',
                    urls: [{ title: 'Folha', url: '/departamento' }, { title: 'Departamento' }]
                }
            },
            {
                path: 'editar/:id', component: EditarDepartamentoComponent,
                data: {
                    title: 'Departamento',
                    urls: [{ title: 'Folha', url: '/departamento' }, { title: 'Departamento' }]
                }
            },
            {
                path: 'lista', component: ListaDepartamentoComponent,
                data: {
                    title: 'Departamento',
                    urls: [{ title: 'Folha', url: '/departamento' }, { title: 'Departamento' }]
                }
            },
            {
                path: 'excluir/:id', component: ExcluirDepartamentoComponent,
                data: {
                    title: 'Departamento',
                    urls: [{ title: 'Folha', url: '/departamento' }, { title: 'Departamento' }]
                }
            },
            {
                path: 'reativar/:id', component: ReativarDepartamentoComponent,
                data: {
                    title: 'Departamento',
                    urls: [{ title: 'Folha', url: '/departamento' }, { title: 'Departamento' }]
                }
            }
        ]
    }
];