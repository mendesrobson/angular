import { Routes } from '@angular/router';
import { LocalidadeComponent } from './localidade.component';
import { ReativarLocalidadeComponent } from './reativar-localidade/reativar-localidade.component';
import { ExcluirLocalidadeComponent } from './excluir-localidade/excluir-localidade.component';
import { EditarLocalidadeComponent } from './editar-localidade/editar-localidade.component';
import { AdicionarLocalidadeComponent } from './adicionar-localidade/adicionar-localidade.component';
import { ListaLocalidadeComponent } from './lista-localidade/lista-localidade.component';


  export const LocalidadeRouterConfig: Routes = [
    {
        path: '', component: LocalidadeComponent,
        data: {
            title: 'Localidades',
            urls: [{ title: 'Cadastro', url: '/localidade' }, { title: 'Localidades' }]
        },
        children: [
            { path: '', component: ListaLocalidadeComponent,
                data: {
                    title: 'Localidades',
                    urls: [{ title: 'Cadastro', url: '/localidade' }, { title: 'Localidades' }]
                }
             },
            { path: 'adicionar', component: AdicionarLocalidadeComponent,
                data: {
                    title: 'Localidades',
                    urls: [{ title: 'Cadastro', url: '/localidade' }, { title: 'Localidades' }]
                }
            },
            { path: 'editar/:id',  component: EditarLocalidadeComponent, 
                data: {
                    title: 'Localidades',
                    urls: [{ title: 'Cadastro', url: '/localidade' }, { title: 'Localidades' }]
                }
            },
            { path: 'excluir/:id',  component: ExcluirLocalidadeComponent,
                data: {
                    title: 'Localidades',
                    urls: [{ title: 'Cadastro', url: '/localidade' }, { title: 'Localidades' }]
                }
            },
            { path: 'reativar/:id',  component: ReativarLocalidadeComponent, 
                data: {
                    title: 'Localidades',
                    urls: [{ title: 'Cadastro', url: '/localidade' }, { title: 'Localidades' }]
                }
            }         
        ]
    }
];