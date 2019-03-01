import { Routes } from '@angular/router';
import { NaturezalesaoComponent } from './naturezalesao.component';
import { ListaNaturezalesaoComponent } from './lista-naturezalesao/lista-naturezalesao.component';
import { AdicionarNaturezalesaoComponent } from './adicionar-naturezalesao/adicionar-naturezalesao.component';
import { EditarNaturezalesaoComponent } from './editar-naturezalesao/editar-naturezalesao.component';
import { ExcluirNaturezalesaoComponent } from './excluir-naturezalesao/excluir-naturezalesao.component';
import { ReativarNaturezalesaoComponent } from './reativar-naturezalesao/reativar-naturezalesao.component';


export const naturezalesaoRouterConfig: Routes = [
    {
        path: '', component: NaturezalesaoComponent,
        children: [
            { path: '', component: ListaNaturezalesaoComponent,
                data: {
                    title: 'Natureza Lesão',
                    urls: [{title: 'Folha', url: '/naturezalesao'}, {title: 'Natureza Lesão'}]
                }
            },
            { path: 'adicionar', component: AdicionarNaturezalesaoComponent,
                data: {
                    title: 'Natureza Lesão',
                    urls: [{title: 'Folha', url: '/naturezalesao'}, {title: 'Natureza Lesão'}]
                }
            },
            { path: 'editar/:id',  component: EditarNaturezalesaoComponent,
                data: {
                    title: 'Natureza Lesão',
                    urls: [{title: 'Folha', url: '/naturezalesao'}, {title: 'Natureza Lesão'}]
                }
            },
            { path: 'lista', component: ListaNaturezalesaoComponent,
                data: {
                    title: 'Natureza Lesão',
                    urls: [{title: 'Folha', url: '/naturezalesao'}, {title: 'Natureza Lesão'}]
                }
            },
            { path: 'excluir/:id', component: ExcluirNaturezalesaoComponent,
                data: {
                    title: 'Natureza Lesão',
                    urls: [{title: 'Folha', url: '/naturezalesao'}, {title: 'Natureza Lesão'}]
                }
            },
            { path: 'reativar/:id', component: ReativarNaturezalesaoComponent,
                data: {
                    title: 'Natureza Lesão',
                    urls: [{title: 'Folha', url: '/naturezalesao'}, {title: 'Natureza Lesão'}]
                }
            }
        ]
    }
];
