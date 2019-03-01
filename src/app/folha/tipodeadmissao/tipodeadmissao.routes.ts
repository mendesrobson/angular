import { Routes } from '@angular/router';

import { TipodeadmissaoComponent } from './tipodeadmissao.component';
import { ListaTipodeadmissaoComponent } from './lista-tipodeadmissao/lista-tipodeadmissao.component';
import { AdicionarTipodeadmissaoComponent } from './adicionar-tipodeadmissao/adicionar-tipodeadmissao.component';
import { ReativarTipodeadmissaoComponent } from './reativar-tipodeadmissao/reativar-tipodeadmissao.component';
import { EditarTipodeadmissaoComponent } from './editar-tipodeadmissao/editar-tipodeadmissao.component';
import { ExcluirTipodeadmissaoComponent } from './excluir-tipodeadmissao/excluir-tipodeadmissao.component';

export const tipoDeAdmissaoRouterConfig: Routes = [
    {
        path: '', component: TipodeadmissaoComponent,
        data: {
            title: 'Tipo de Admissão',
            urls: [{ title: 'Folha', url: '/tipoadmissao' }, { title: 'Tipo de Admissão' }]
        },
        children: [
            {
                path: '', component: ListaTipodeadmissaoComponent,
                data: {
                    title: 'Tipo de Admissão',
                    urls: [{ title: 'Folha', url: '/tipoadmissao' }, { title: 'Tipo de Admissão' }]
                }
            },
            {
                path: 'adicionar', component: AdicionarTipodeadmissaoComponent,
                data: {
                    title: 'Tipo de Admissão',
                    urls: [{ title: 'Folha', url: '/tipoadmissao' }, { title: 'Tipo de Admissão' }]
                }
            },
            {
                path: 'editar/:id', component: EditarTipodeadmissaoComponent,
                data: {
                    title: 'Tipo de Admissão',
                    urls: [{ title: 'Folha', url: '/tipoadmissao' }, { title: 'Tipo de Admissão' }]
                }
            },
            {
                path: 'lista', component: ListaTipodeadmissaoComponent,
                data: {
                    title: 'Tipo de Admissão',
                    urls: [{ title: 'Folha', url: '/tipoadmissao' }, { title: 'Tipo de Admissão' }]
                }
            },
            {
                path: 'excluir/:id', component: ExcluirTipodeadmissaoComponent,
                data: {
                    title: 'Tipo de Admissão',
                    urls: [{ title: 'Folha', url: '/tipoadmissao' }, { title: 'Tipo de Admissão' }]
                }
            },
            {
                path: 'reativar/:id', component: ReativarTipodeadmissaoComponent,
                data: {
                    title: 'Tipo de Admissão',
                    urls: [{ title: 'Folha', url: '/tipoadmissao' }, { title: 'Tipo de Admissão' }]
                }
            }
        ]
    }
];