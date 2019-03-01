import { Routes } from '@angular/router';

import { FornecedorComponent } from './fornecedor.component';
import { ListaFornecedorComponent } from './lista-fornecedor/lista-fornecedor.component';

export const fornecedorRouterConfig: Routes = [
    {
        path: '', component: FornecedorComponent,
        data: {
            title: 'Fornecedor',
            urls: [{title: 'Cadastros',url: '/fornecedor'},{title: 'Fornecedor'}]
        },
        children: [
            { path: '', component: ListaFornecedorComponent,
                data: {
                    title: 'Fornecedor',
                    urls: [{title: 'Cadastros',url: '/fornecedor'},{title: 'Fornecedor'}]
                }
            },            
            { path: 'lista', component: ListaFornecedorComponent,
                data: {
                    title: 'Fornecedor',
                    urls: [{title: 'Cadastros',url: '/fornecedor'},{title: 'Fornecedor'}]
                }
            }
        ]
    }
];