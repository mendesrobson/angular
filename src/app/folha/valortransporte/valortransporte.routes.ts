import { Routes } from "@angular/router";
import { ValortransporteComponent } from "./valortransporte.component";
import { ListaValortransporteComponent } from "./lista-valortransporte/lista-valortransporte.component";
import { AdicionarValortransporteComponent } from './adicionar-valortransporte/adicionar-valortransporte.component';
import { EditarValortransporteComponent } from './editar-valortransporte/editar-valortransporte.component';
import { ExcluirValortransporteComponent } from "./excluir-valortransporte/excluir-valortransporte.component";
import { ReativarValortransporteComponent } from './reativar-valortransporte/reativar-valortransporte.component';

export const ValortransporteRouterConfig: Routes = [
    {
        path: '', component: ValortransporteComponent,
        data: {
            title: 'Valores dos Transportes',
            urls: [{ title: 'Folha', url: '/valortransporte' }, { title: 'Valores dos Transportes' }]
        },
        children: [
            {
                path: '', component: ListaValortransporteComponent,
                data: {
                    title: 'Valores dos Transportes',
                    urls: [{ title: 'Folha', url: '/valortransporte' }, { title: 'Valores dos Transportes' }]
                }
            },
            {
                path: 'adicionar', component: AdicionarValortransporteComponent,
                data: {
                    title: 'Valores dos Transportes',
                    urls: [{ title: 'Folha', url: '/valortransporte' }, { title: 'Valores dos Transportes' }]
                }
            },
            {
                path: 'editar/:id', component: EditarValortransporteComponent,
                data: {
                    title: 'Valores dos Transportes',
                    urls: [{ title: 'Folha', url: '/valortransporte' }, { title: 'Valores dos Transportes' }]
                }
            },
            {
                path: 'lista', component: ListaValortransporteComponent,
                data: {
                    title: 'Valores dos Transportes',
                    urls: [{ title: 'Folha', url: '/valortransporte' }, { title: 'Valores dos Transportes' }]
                }
            },
            {
                path: 'excluir/:id', component: ExcluirValortransporteComponent,
                data: {
                    title: 'Valores dos Transportes',
                    urls: [{ title: 'Folha', url: '/valortransporte' }, { title: 'Valores dos Transportes' }]
                }
            },
            {
                path: 'reativar/:id', component: ReativarValortransporteComponent,
                data: {
                    title: 'Valores dos Transportes',
                    urls: [{ title: 'Folha', url: '/valortransporte' }, { title: 'Valores dos Transportes' }]
                }
            }
        ]
    }
];