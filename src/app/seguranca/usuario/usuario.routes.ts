import { Routes } from '@angular/router';

import { UsuarioComponent } from './usuario.component';
import { ListaUsuarioComponent } from './lista-usuario/lista-usuario.component';
import { AdicionarUsuarioComponent } from './adicionar-usuario/adicionar-usuario.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { ExcluirUsuarioComponent } from './excluir-usuario/excluir-usuario.component';
import { ReativarUsuarioComponent } from './reativar-usuario/reativar-usuario.component';
import { RedefinirSenhaComponent } from './redefinir-senha/redefinir-senha.component';

export const usuarioRouterConfig : Routes =  [
    {
        path: '', component: UsuarioComponent,
        children: [
            { path: '', component: ListaUsuarioComponent,
            data: {
                title: 'Usuários',
                urls: [{title: 'Segurança', url: '/usuario'}, {title: 'Cadastro Usuário'}]
            }
           },
            { path: 'adicionar', component: AdicionarUsuarioComponent,
                data: {
                    title: 'Cadastro Usuário',
                    urls: [{title: 'Segurança', url: '/usuario'}, {title: 'Cadastro Usuário'}]
                }
            },
            { path: 'editar/:id',  component: EditarUsuarioComponent,
                data: {
                    title: 'Editar Usuário',
                    urls: [{title: 'Segurança', url: '/usuario'}, {title: 'Editar Usuário'}]
                }
            },
            { path: 'lista', component: ListaUsuarioComponent,
                data: {
                    title: 'Usuários',
                    urls: [{title: 'Segurança', url: '/usuario'}, {title: 'Listar Usuário'}]
                }
            },
            { path: 'excluir/:id', component: ExcluirUsuarioComponent,
                data: {
                    title: 'Excluir Usuário',
                    urls: [{title: 'Segurança', url: '/usuario'}, {title: 'Excluir Usuário'}]
                }
            },
            { path: 'reativar/:id', component: ReativarUsuarioComponent,
                data: {
                    title: 'Reativar Usuário',
                    urls: [{title: 'Segurança', url: '/usuario'}, {title: 'Reativar Usuário'}]
                }                
            },
            { path: 'redefinir/:id', component: RedefinirSenhaComponent,
            data: {
                title: 'Redefinir Senha Usuário',
                urls: [{title: 'Segurança', url: '/usuario'}, {title: 'Redefinir Senha Usuário'}]
            }                
        }
        ]
    }
]; 