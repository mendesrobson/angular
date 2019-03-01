import { Routes } from '@angular/router';

import { ChequeproprioComponent } from './chequeproprio.component';
import { ListaChequeproprioComponent } from './lista-chequeproprio/lista-chequeproprio.component';
import { AdicionarChequetalaoComponent } from './adicionar-chequetalao/adicionar-chequetalao.component';
import { EditarChequetalaoComponent } from './editar-chequetalao/editar-chequetalao.component';

export const chequeProprioRouterConfig: Routes = [
    {
        path: '', component: ChequeproprioComponent,
        data: {
            title: 'Cheque Próprio',
            urls: [{ title: 'Cheque Próprio', url: '/chequeproprio' }, { title: 'Cheque Próprio' }]
        },
        children: [
            { path: '', component: ListaChequeproprioComponent,
                data: {
                    title: 'Cheque Próprio',
                    urls: [{ title: 'Cheque Próprio', url: '/chequeproprio' }, { title: 'Cheque Próprio' }]
                }
            },
            { path: 'lista', component: ListaChequeproprioComponent,
                data: {
                    title: 'Cheque Próprio',
                    urls: [{ title: 'Cheque Próprio', url: '/chequeproprio' }, { title: 'Cheque Próprio' }]
                }
            },
            { path: 'adicionar', component: AdicionarChequetalaoComponent, 
                data: {
                    title: 'Cheque Próprio',
                    urls: [{ title: 'Cheque Próprio', url: '/chequeproprio' }, { title: 'Cheque Próprio' }]
                }
            },
            { path: 'editar/:id',  component: EditarChequetalaoComponent,
                data: {
                    title: 'Cheque Próprio',
                    urls: [{ title: 'Cheque Próprio', url: '/chequeproprio' }, { title: 'Cheque Próprio' }]
                }
            },
            // { path: 'excluir/:id',  component: ExcluirContaCorrenteComponent, },
            // { path: 'reativar/:id',  component: ReativarContaCorrenteComponent, },
            // { path: 'adicionardadoscobranca',  component: AdicionarDadosCobrancaComponent },
            
            // { path: 'listadadoscobranca', component: ListaContaCorrenteComponent },
            // { path: 'editardadoscobranca', component: EditarDadosCobrancaComponent}          
        ]
    }
];