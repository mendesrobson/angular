import { Routes } from "@angular/router";
import { EquipprotecaoindividualComponent } from "./equipprotecaoindividual.component";
import { ListaEquipprotecaoindividualComponent } from "./lista-equipprotecaoindividual/lista-equipprotecaoindividual.component";
import { AdicionarEquipprotecaoindividualComponent } from './adicionar-equipprotecaoindividual/adicionar-equipprotecaoindividual.component';
import { EditarEquipprotecaoindividualComponent } from './editar-equipprotecaoindividual/editar-equipprotecaoindividual.component';
import { ExcluirEquipprotecaoindividualComponent } from "./excluir-equipprotecaoindividual/excluir-equipprotecaoindividual.component";
import { ReativarEquipprotecaoindividualComponent } from './reativar-equipprotecaoindividual/reativar-equipprotecaoindividual.component';

export const EquipprotecaoindividualRouterConfig: Routes = [
    {
        path: '', component: EquipprotecaoindividualComponent,
        data: {
            title: 'Equipamentos de Proteção Individual',
            urls: [{ title: 'Folha', url: '/equipprotecaoindividual' }, { title: 'EPI' }]
        },
        children: [
            {
                path: '', component: ListaEquipprotecaoindividualComponent,
                data: {
                    title: 'Equipamentos de Proteção Individual',
                    urls: [{ title: 'Folha', url: '/equipprotecaoindividual' }, { title: 'EPI' }]
                }
            },
            {
                path: 'adicionar', component: AdicionarEquipprotecaoindividualComponent,
                data: {
                    title: 'Equipamentos de Proteção Individual',
                    urls: [{ title: 'Folha', url: '/equipprotecaoindividual' }, { title: 'EPI' }]
                }
            },
            {
                path: 'editar/:id', component: EditarEquipprotecaoindividualComponent,
                data: {
                    title: 'Equipamentos de Proteção Individual',
                    urls: [{ title: 'Folha', url: '/equipprotecaoindividual' }, { title: 'EPI' }]
                }
            },
            {
                path: 'lista', component: ListaEquipprotecaoindividualComponent,
                data: {
                    title: 'Equipamentos de Proteção Individual',
                    urls: [{ title: 'Folha', url: '/equipprotecaoindividual' }, { title: 'EPI' }]
                }
            },
            {
                path: 'excluir/:id', component: ExcluirEquipprotecaoindividualComponent,
                data: {
                    title: 'Equipamentos de Proteção Individual',
                    urls: [{ title: 'Folha', url: '/equipprotecaoindividual' }, { title: 'EPI' }]
                }
            },
            {
                path: 'reativar/:id', component: ReativarEquipprotecaoindividualComponent,
                data: {
                    title: 'Equipamentos de Proteção Individual',
                    urls: [{ title: 'Folha', url: '/equipprotecaoindividual' }, { title: 'EPI' }]
                }
            }
        ]
    }
];