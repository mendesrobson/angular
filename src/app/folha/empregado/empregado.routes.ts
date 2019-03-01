import { Routes } from "@angular/router";
import { EmpregadoComponent } from "./empregado.component";
import { ListaEmpregadoComponent } from "./lista-empregado/lista-empregado.component";
import { AdicionarEmpregadoComponent } from "./adicionar-empregado/adicionar-empregado.component";
import { EditarEmpregadoComponent } from "./editar-empregado/editar-empregado.component";


export const EmpregadoRouterConfig: Routes = [
    {
        path: '', component: EmpregadoComponent,
        data: {
            title: 'Colaborador',
            urls: [{ title: 'Folha', url: '/colaborador' }, { title: 'Convenção' }]
        },
        children: [
            {
                path: '', component: ListaEmpregadoComponent,
                data: {
                    title: 'Colaborador',
                    urls: [{ title: 'Folha', url: '/colaborador' }, { title: 'Colaborador' }]
                }
            },
            {
                path: 'lista', component: ListaEmpregadoComponent,
                data: {
                    title: 'Colaborador',
                    urls: [{ title: 'Folha', url: '/colaborador' }, { title: 'Colaborador' }]
                }
            },
            {
                path: 'adicionar', component: AdicionarEmpregadoComponent,
                data: {
                    title: 'Colaborador',
                    urls: [{ title: 'Folha', url: '/colaborador' }, { title: 'Colaborador' }]
                }
            },
            {
                path: 'editar/:id', component: EditarEmpregadoComponent,
                data: {
                    title: 'Colaborador',
                    urls: [{ title: 'Folha', url: '/colaborador' }, { title: 'Colaborador' }]
                }
            }
        ]
    }
];