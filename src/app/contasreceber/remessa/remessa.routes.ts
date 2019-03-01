import { Routes } from '@angular/router';
import { RemessaComponent } from './remessa.component';
import { GerarRemessaComponent } from './gerar-remessa/gerar-remessa.component';

export const remessaRouterConfig: Routes = [
    {
        path: '', component: RemessaComponent,
        data: {
            title: 'Remessas',
            urls: [{title: 'Titulos a Receber',url:'/remessa'},{title: 'Remessas'}]
        },
        children: [
            { path: '', component: GerarRemessaComponent,
                data: {
                    title: 'Remessas',
                    urls: [{title: 'Titulos a Receber',url:'/remessa'},{title: 'Remessas'}]
                }
            },
            { path: 'gerar', component: GerarRemessaComponent,
                data: {
                    title: 'Remessas',
                    urls: [{title: 'Titulos a Receber',url:'/remessa'},{title: 'Remessas'}]
                }
            }
        ]
    }
];