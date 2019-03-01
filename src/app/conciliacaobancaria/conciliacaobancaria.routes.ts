import { Routes } from '@angular/router';
import { ConciliacaoBancariaComponent } from './conciliacaobancaria.component';
import { ListaConciliacaoBancariaComponent } from './lista-conciliacaobancaria/lista-conciliacaobancaria.component';
import { EditarConciliacaoBancariaComponent } from './editar-conciliacaobancaria/editar-conciliacaobancaria.component';


export const conciliacaobancariaRouterConfig: Routes = [
    {
        path: '', component: ConciliacaoBancariaComponent,
        data: {
            title: 'Conciliação Bancária',
            urls: [{title: 'Conciliação Bancária',url:'/conciliacaobancaria'},{title: 'Conciliação Bancária'}]
        },
        children: [
            { path: '', component: ListaConciliacaoBancariaComponent,
            data: {
                title: 'Conciliação Bancária',
                urls: [{title: 'Conciliação Bancária',url:'/conciliacaobancaria'},{title: 'Conciliação Bancária'}]
            }
         },
            { path: 'editar/:id',  component: EditarConciliacaoBancariaComponent, 
            data: {
                title: 'Conciliação Bancária',
                urls: [{title: 'Conciliação Bancária',url:'/conciliacaobancaria'},{title: 'Conciliação Bancária'}]
            }
        },
            { path: 'lista', component: ListaConciliacaoBancariaComponent,
            data: {
                title: 'Conciliação Bancária',
                urls: [{title: 'Conciliação Bancária',url:'/conciliacaobancaria'},{title: 'Conciliação Bancária'}]
            }
         }            
        ]
    }
];