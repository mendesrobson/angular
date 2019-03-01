import { Routes } from '@angular/router';

import { TipohorariotrabalhoComponent } from './tipohorariotrabalho.component';
import { ListaTipohorariotrabalhoComponent } from './lista-tipohorariotrabalho/lista-tipohorariotrabalho.component';
import { AdicionarTipohorariotrabalhoComponent } from './adicionar-tipohorariotrabalho/adicionar-tipohorariotrabalho.component';
import { ReativarTipohorariotrabalhoComponent } from './reativar-tipohorariotrabalho/reativar-tipohorariotrabalho.component';
import { EditarTipohorariotrabalhoComponent } from './editar-tipohorariotrabalho/editar-tipohorariotrabalho.component';
import { ExcluirTipohorariotrabalhoComponent } from './excluir-tipohorariotrabalho/excluir-tipohorariotrabalho.component';

export const tipoHorarioTrabalhoRouterConfig: Routes = [
    {
        path: '', component: TipohorariotrabalhoComponent,
        data: {
            title: 'Tipo Horário Trabalho',
            urls: [{ title: 'Folha', url: '/tipohorariotrabalho' }, { title: 'Tipo Horário Trabalho' }]
        },
        children: [
            {
                path: '', component: ListaTipohorariotrabalhoComponent,
                data: {
                    title: 'Tipo Horário Trabalho',
                    urls: [{ title: 'Folha', url: '/tipohorariotrabalho' }, { title: 'Tipo Horário Trabalho' }]
                }
            },
            {
                path: 'adicionar', component: AdicionarTipohorariotrabalhoComponent,
                data: {
                    title: 'Tipo Horário Trabalho',
                    urls: [{ title: 'Folha', url: '/tipohorariotrabalho' }, { title: 'Tipo Horário Trabalho' }]
                }
            },
            {
                path: 'editar/:id', component: EditarTipohorariotrabalhoComponent,
                data: {
                    title: 'Tipo Horário Trabalho',
                    urls: [{ title: 'Folha', url: '/tipohorariotrabalho' }, { title: 'Tipo Horário Trabalho' }]
                }
            },
            {
                path: 'lista', component: ListaTipohorariotrabalhoComponent,
                data: {
                    title: 'Tipo Horário Trabalho',
                    urls: [{ title: 'Folha', url: '/tipohorariotrabalho' }, { title: 'Tipo Horário Trabalho' }]
                }
            },
            {
                path: 'excluir/:id', component: ExcluirTipohorariotrabalhoComponent,
                data: {
                    title: 'Tipo Horário Trabalho',
                    urls: [{ title: 'Folha', url: '/tipohorariotrabalho' }, { title: 'Tipo Horário Trabalho' }]
                }
            },
            {
                path: 'reativar/:id', component: ReativarTipohorariotrabalhoComponent,
                data: {
                    title: 'Tipo Horário Trabalho',
                    urls: [{ title: 'Folha', url: '/tipohorariotrabalho' }, { title: 'Tipo Horário Trabalho' }]
                }
            }
        ]
    }
];