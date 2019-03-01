import { Routes } from '@angular/router';
import { ContribuicaosindicalpatronalComponent } from './contribuicaosindicalpatronal.component';
import { ListaContribuicaosindicalpatronalComponent } from './lista-contribuicaosindicalpatronal/lista-contribuicaosindicalpatronal.component';
import { AdicionarContribuicaosindicalpatronalComponent } from './adicionar-contribuicaosindicalpatronal/adicionar-contribuicaosindicalpatronal.component';
import { EditarContribuicaosindicalpatronalComponent } from './editar-contribuicaosindicalpatronal/editar-contribuicaosindicalpatronal.component';
import { ExcluirContribuicaosindicalpatronalComponent } from './excluir-contribuicaosindicalpatronal/excluir-contribuicaosindicalpatronal.component';
import { ReativarContribuicaosindicalpatronalComponent } from './reativar-contribuicaosindicalpatronal/reativar-contribuicaosindicalpatronal.component';

export const contribuicaosindicalpatronalRouterConfig: Routes = [
    {
        path: '', component: ContribuicaosindicalpatronalComponent,
        children: [
            { path: '', component: ListaContribuicaosindicalpatronalComponent,
                data: {
                    title: 'Cadastro Contribuição Sindical Patronal',
                    urls: [{title: 'Folha',url: '/contribuicaosindicalpatronal'},{title: 'Contribuição Sindical Patronal'}]
                }
            },
            { path: 'adicionar', component: AdicionarContribuicaosindicalpatronalComponent,
                data: {
                    title: 'Cadastro Contribuição Sindical Patronal',
                    urls: [{title: 'Folha',url: '/contribuicaosindicalpatronal'},{title: 'Contribuição Sindical Patronal'}]
                }
            },
            { path: 'editar/:id',  component: EditarContribuicaosindicalpatronalComponent,
                data: {
                    title: 'Cadastro Contribuição Sindical Patronal',
                    urls: [{title: 'Folha',url: '/contribuicaosindicalpatronal'},{title: 'Contribuição Sindical Patronal'}]
                }
            },
            { path: 'lista', component: ListaContribuicaosindicalpatronalComponent,
                data: {
                    title: 'Cadastro Contribuição Sindical Patronal',
                    urls: [{title: 'Folha',url: '/contribuicaosindicalpatronal'},{title: 'Contribuição Sindical Patronal'}]
                }
            },
            { path: 'excluir/:id', component: ExcluirContribuicaosindicalpatronalComponent, 
                data: {
                    title: 'Cadastro Contribuição Sindical Patronal',
                    urls: [{title: 'Folha',url: '/contribuicaosindicalpatronal'},{title: 'Contribuição Sindical Patronal'}]
                }
            },  
            { path: 'reativar/:id', component: ReativarContribuicaosindicalpatronalComponent,
                data: {
                    title: 'Cadastro Contribuição Sindical Patronal',
                    urls: [{title: 'Folha',url: '/contribuicaosindicalpatronal'},{title: 'Contribuição Sindical Patronal'}]
                }
            }             
        ]
    }
];