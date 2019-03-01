import { Routes } from '@angular/router';

import { BancoComponent } from './banco.component';
import { ListaBancoComponent } from './lista-banco/lista-banco.component';
import { AdicionarBancoComponent } from './adicionar-banco/adicionar-banco.component';
import { EditarBancoComponent } from './editar-banco/editar-banco.component';
import { ExcluirBancoComponent } from './excluir-banco/excluir-banco.component';
import { ReativarBancoComponent } from './reativar-banco/reativar-banco.component';

export const bancoRouterConfig: Routes = [
    {
        path: '', component: BancoComponent,
        children: [
            {
                path: '', component: ListaBancoComponent,
                data: {
                    title: 'Cadastro Banco',
                    urls: [{ title: 'Informações Bancárias', url: '/banco' }, { title: 'Banco' }]
                }
            },
            {
                path: 'adicionar', component: AdicionarBancoComponent,
                data: {
                    title: 'Cadastro Banco',
                    urls: [{ title: 'Informações Bancárias', url: '/banco' }, { title: 'Adicionar' }]
                }
            },
            {
                path: 'editar/:id', component: EditarBancoComponent,
                data: {
                    title: 'Cadastro Banco',
                    urls: [{ title: 'Informações Bancárias', url: '/banco' }, { title: 'Editar' }]
                }
            },
            {
                path: 'excluir/:id', component: ExcluirBancoComponent, 
                data: {
                    title: 'Cadastro Banco',
                    urls: [{ title: 'Informações Bancárias', url: '/banco' }, { title: 'Excluir' }]
                }
            },
            {
                path: 'reativar/:id', component: ReativarBancoComponent, 
                data: {
                    title: 'Cadastro Banco',
                    urls: [{ title: 'Informações Bancárias', url: '/banco' }, { title: 'Reativar' }]
                }
            },
            {
                path: 'lista', component: ListaBancoComponent, 
                data: {
                    title: 'Cadastro Banco',
                    urls: [{ title: 'Informações Bancárias', url: '/banco' }, { title: 'Lista' }]
                }
            }
        ]
    }
];