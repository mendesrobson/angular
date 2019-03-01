import { Routes } from '@angular/router';
import { TituloParcelaBaixaComponent } from './tituloparcelabaixa.component';
import { ListaTituloParcelaBaixaReceberComponent } from './lista-tituloparcelabaixareceber/lista-tituloparcelabaixareceber.component';
import { AdicionarBaixaComponent } from './adicionar-baixa/adicionar-baixa.component';
import { EditarBaixaComponent } from './editar-baixa/editar-baixa.component';

export const tituloParcelaBaixaRouterConfig: Routes = [
    {
        path: '', component: TituloParcelaBaixaComponent,
        children: [
            { path: 'lista/:natureza', component: ListaTituloParcelaBaixaReceberComponent},
            {
                path: 'lista/receber',
                component: AdicionarBaixaComponent,
                data: {
                    title: 'Baixar Parcelas',
                    urls: [{title: 'Contas Receber',url: '/tituloparcelabaixa/lista/receber'},{title: 'Baixar Parcelas'}]
                }
            },
            {
                path: 'lista/pagar',
                component: AdicionarBaixaComponent,
                data: {
                    title: 'Baixar Parcelas',
                    urls: [{title: 'Contas Pagar',url: '/tituloparcelabaixa/lista/receber'},{title: 'Baixar Parcelas'}]
                }
            },
            { path: 'adicionar/:natureza', component: AdicionarBaixaComponent},
            {
                path: 'adicionar/receber',
                component: AdicionarBaixaComponent,
                data: {
                    title: 'Baixar Parcelas',
                    urls: [{title: 'Contas Receber',url: '/tituloparcelabaixa/lista/receber'},{title: 'Baixar Parcelas'}]
                }
            },
            {
                path: 'adicionar/pagar',
                component: AdicionarBaixaComponent,
                data: {
                    title: 'Baixar Parcelas',
                    urls: [{title: 'Contas Pagar',url: '/tituloparcelabaixa/lista/pagar'},{title: 'Baixar Parcelas'}]
                }
            },
            { path: 'editar/:natureza/:id', component: EditarBaixaComponent },
            {
                path: 'editar/receber/:id',
                component: EditarBaixaComponent,

                data: {
                    title: 'Baixar Parcelas',
                    urls: [{title: 'Contas Receber',url: '/tituloparcelabaixa/lista/receber'},{title: 'Baixar Parcelas'}]
                }
            },
            {
                path: 'editar/pagar/:id',
                component: EditarBaixaComponent,
                data: {
                    title: 'Baixar Parcelas',
                    urls: [{title: 'Contas Pagar',url: '/tituloparcelabaixa/lista/pagar'},{title: 'Baixa Manual'}]
                }
            }
        ]
    }
]