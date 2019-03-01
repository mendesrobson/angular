import { Routes } from '@angular/router';
import { NacionalidadeComponent } from './nacionalidade.component';
import { ListaNacionalidadeComponent } from './lista-nacionalidade/lista-nacionalidade.component';
import { AdicionarNacionalidadeComponent } from './adicionar-nacionalidade/adicionar-nacionalidade.component';
import { EditarNacionalidadeComponent } from './editar-nacionalidade/editar-nacionalidade.component';
import { ExcluirNacionalidadeComponent } from './excluir-nacionalidade/excluir-nacionalidade.component';
import { ReativarNacionalidadeComponent } from './reativar-nacionalidade/reativar-nacionalidade.component';


export const nacionalidadeRouterConfig: Routes = [
    {
        path: '', component: NacionalidadeComponent,
        children: [
            {
                path: '', component: ListaNacionalidadeComponent,
                data: {
                    title: 'Cadastro de Nacionalidades',
                    urls: [{ title: 'Folha', url: '/nacionalidades' }, { title: 'Cadastro de Nacionalidades' }]
                }
            },

            {
                path: 'lista', component: ListaNacionalidadeComponent,
                data: {
                    title: 'Cadastro de Nacionalidades',
                    urls: [{ title: 'Folha', url: '/nacionalidades' }, { title: 'Cadastro de Nacionalidades' }]
                }
            },

            {
                path: 'adicionar', component: AdicionarNacionalidadeComponent,
                data: {
                    title: 'Cadastro de Nacionalidades',
                    urls: [{ title: 'Folha', url: '/nacionalidades' }, { title: 'Cadastro de Nacionalidades' }]
                }
            },

            {
                path: 'editar/:id', component: EditarNacionalidadeComponent,
                data: {
                    title: 'Cadastro de Nacionalidades',
                    urls: [{ title: 'Folha', url: '/nacionalidades' }, { title: 'Cadastro de Nacionalidades' }]
                }
            },

            {
                path: 'excluir/:id', component: ExcluirNacionalidadeComponent,
                data: {
                    title: 'Cadastro de Nacionalidades',
                    urls: [{ title: 'Folha', url: '/nacionalidades' }, { title: 'Cadastro de Nacionalidades' }]
                }
            },
            
            {
                path: 'reativar/:id', component: ReativarNacionalidadeComponent,
                data: {
                    title: 'Cadastro de Nacionalidades',
                    urls: [{ title: 'Folha', url: '/nacionalidades' }, { title: 'Cadastro de Nacionalidades' }]
                }
            }

        ]
    }
];