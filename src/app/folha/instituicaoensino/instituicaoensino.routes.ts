import { Routes } from '@angular/router';

import { InstituicaoensinoComponent } from './instituicaoensino.component';
import { ListaInstituicaoensinoComponent } from './lista-instituicaoensino/lista-instituicaoensino.component';
import { AdicionarInstituicaoensinoComponent } from './adicionar-instituicaoensino/adicionar-instituicaoensino.component';
import { EditarInstituicaoensinoComponent } from './editar-instituicaoensino/editar-instituicaoensino.component';
import { ExcluirInstituicaoensinoComponent } from './excluir-instituicaoensino/excluir-instituicaoensino.component';
import { ReativarInstituicaoensinoComponent } from './reativar-instituicaoensino/reativar-instituicaoensino.component';


export const instituicaoensinoRouterConfig: Routes = [
    {
        path: '', component: InstituicaoensinoComponent,
        children: [
            { path: '', component: ListaInstituicaoensinoComponent,
                data: {
                    title: 'Cadastro Instituição de Ensino',
                    urls: [{title: 'Folha', url: '/instituicaoensino'}, {title: 'Instituição Ensino'}]
                }
            },
            { path: 'adicionar', component: AdicionarInstituicaoensinoComponent,
                data: {
                    title: 'Cadastro Instituição de Ensino',
                    urls: [{title: 'Folha', url: '/instituicaoensino'}, {title: 'Instituição Ensino'}]
                }
            },
            { path: 'editar/:id',  component: EditarInstituicaoensinoComponent,
                data: {
                    title: 'Cadastro Instituição de Ensino',
                    urls: [{title: 'Folha', url: '/instituicaoensino'}, {title: 'Instituição Ensino'}]
                }
            },
            { path: 'lista', component: ListaInstituicaoensinoComponent,
                data: {
                    title: 'Cadastro Instituição de Ensino',
                    urls: [{title: 'Folha', url: '/instituicaoensino'}, {title: 'Instituição Ensino'}]
                }
            },
            { path: 'excluir/:id', component: ExcluirInstituicaoensinoComponent,
                data: {
                    title: 'Cadastro Instituição de Ensino',
                    urls: [{title: 'Folha', url: '/instituicaoensino'}, {title: 'Instituição Ensino'}]
                }
            },
            { path: 'reativar/:id', component: ReativarInstituicaoensinoComponent,
                data: {
                    title: 'Cadastro Instituição de Ensino',
                    urls: [{title: 'Folha', url: '/instituicaoensino'}, {title: 'Instituição Ensino'}]
                }
            }
        ]
    }
];
