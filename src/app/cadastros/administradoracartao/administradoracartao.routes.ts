import { Routes } from '@angular/router';

import { AdministradoracartaoComponent } from './administradoracartao.component';
import { ListaAdministradoracartaoComponent } from './lista-administradoracartao/lista-administradoracartao.component';
import { AdicionarAdministradoracartaoComponent } from './adicionar-administradoracartao/adicionar-administradoracartao.component';
import { EditarAdministradoracartaoComponent } from './editar-administradoracartao/editar-administradoracartao.component';
// import { ExcluirAdministradoracartaoComponent } from './excluir-administradoracartao/excluir-administradoracartao.component';
// import { ReativarAdministradoracartaoComponent } from './reativar-administradoracartao/reativar-administradoracartao.component';

export const administradoraCartaoRouterConfig: Routes = [
    {
        path: '', component: AdministradoracartaoComponent,
        children: [
            {
            path: '', component: ListaAdministradoracartaoComponent,
                data: {
                    title: 'Cadastro Administradora de Cartão',
                    urls: [{ title: 'Cadastros', url: '/administradoracartao' }, { title: 'Administradora de Cartão' }]
                }
            },
            { path: 'adicionar', component: AdicionarAdministradoracartaoComponent,
                data: {
                    title: 'Cadastro Administradora de Cartão',
                    urls: [{ title: 'Cadastros', url: '/administradoracartao' }, { title: 'Adicionar - Administradora de Cartão' }]
                }
            },
            { path: 'editar/:id', component: EditarAdministradoracartaoComponent, 
                data: {
                    title: 'Cadastro Administradora de Cartão',
                    urls: [{ title: 'Cadastros', url: '/administradoracartao' }, { title: 'Editar - Administradora de Cartão' }]
                }
            },
            // { path: 'excluir/:id',  component: ExcluirAdministradoracartaoComponent, },
            // { path: 'reativar/:id',  component: ReativarAdministradoracartaoComponent, },
            { path: 'lista', component: ListaAdministradoracartaoComponent, 
                data: {
                    title: 'Cadastro Administradora de Cartão',
                    urls: [{ title: 'Cadastros', url: '/administradoracartao' }, { title: 'Lista - Administradora de Cartão' }]
                }
            }
        ]
    }
];