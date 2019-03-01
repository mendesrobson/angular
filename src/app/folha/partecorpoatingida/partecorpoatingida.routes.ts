import { PartecorpoatingidaComponent } from "./partecorpoatingida.component";
import { Routes } from "../../../../node_modules/@angular/router";
import { ListaPartecorpoatingidaComponent } from "./lista-partecorpoatingida/lista-partecorpoatingida.component";
import { AdicionarPartecorpoatingidaComponent } from "./adicionar-partecorpoatingida/adicionar-partecorpoatingida.component";
import { EditarPartecorpoatingidaComponent } from "./editar-partecorpoatingida/editar-partecorpoatingida.component";
import { ExcluirPartecorpoatingidaComponent } from "./excluir-partecorpoatingida/excluir-partecorpoatingida.component";
import { ReativarPartecorpoatingidaComponent } from "./reativar-partecorpoatingida/reativar-partecorpoatingida.component";

export const partecorpoatingidaRouterConfig: Routes = [
    {
        path: '', component: PartecorpoatingidaComponent,
        children: [
            { path: '', component: ListaPartecorpoatingidaComponent,
                data: {
                    title: 'Parte Corpo Atiginda',
                    urls: [{title: 'Folha',url: '/partecorpoatingida'},{title: 'Parte Corpo Atiginda'}]
                }
             },
            { path: 'adicionar', component: AdicionarPartecorpoatingidaComponent,
                data: {
                    title: 'Parte Corpo Atiginda',
                    urls: [{title: 'Folha',url: '/partecorpoatingida'},{title: 'Parte Corpo Atiginda'}]
                }
            },
            { path: 'editar/:id',  component: EditarPartecorpoatingidaComponent,
                data: {
                    title: 'Parte Corpo Atiginda',
                    urls: [{title: 'Folha',url: '/partecorpoatingida'},{title: 'Parte Corpo Atiginda'}]
                }
            },
            { path: 'lista', component: ListaPartecorpoatingidaComponent, 
                data: {
                    title: 'Parte Corpo Atiginda',
                    urls: [{title: 'Folha',url: '/partecorpoatingida'},{title: 'Parte Corpo Atiginda'}]
                }
            },
            { path: 'excluir/:id', component: ExcluirPartecorpoatingidaComponent,  
                data: {
                    title: 'Parte Corpo Atiginda',
                    urls: [{title: 'Folha',url: '/partecorpoatingida'},{title: 'Parte Corpo Atiginda'}]
                }
            },  
            { path: 'reativar/:id', component: ReativarPartecorpoatingidaComponent,
                data: {
                    title: 'Parte Corpo Atiginda',
                    urls: [{title: 'Folha',url: '/partecorpoatingida'},{title: 'Parte Corpo Atiginda'}]
                }
            }             
        ]
    }
];