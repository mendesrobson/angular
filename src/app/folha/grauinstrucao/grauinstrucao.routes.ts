import { Routes } from '@angular/router';

import { GrauInstrucaoComponent } from './grauinstrucao.component';
import { ListaGrauInstrucaoComponent } from './lista-grauinstrucao/lista-grauinstrucao.component';
import { AdicionarGrauInstrucaoComponent } from './adicionar-grauinstrucao/adicionar-grauinstrucao.component';
import { ReativarGrauInstrucaoComponent } from './reativar-grauinstrucao/reativar-grauinstrucao.component';
import { EditarGrauInstrucaoComponent } from './editar-grauinstrucao/editar-grauinstrucao.component';
import { ExcluirGrauInstrucaoComponent } from './excluir-grauinstrucao/excluir-grauinstrucao.component';


export const grauInstrucaoRouterConfig : Routes =  [
{
    path: '', component: GrauInstrucaoComponent,
    children: [
        { path: '', component: ListaGrauInstrucaoComponent,
            data: {
                title: 'Cadastro Grau de Instrução',
                urls: [{title: 'Folha',url: '/grauinstrucao'},{title: 'Grau de Instrução'}]
            }
        },
        { path: 'adicionar', component: AdicionarGrauInstrucaoComponent,
            data: {
                title: 'Cadastro Grau de Instrução',
                urls: [{title: 'Folha',url: '/grauinstrucao'},{title: 'Grau de Instrução'}]
            }
        },
        { path: 'editar/:id',  component: EditarGrauInstrucaoComponent,
            data: {
                title: 'Cadastro Grau de Instrução',
                urls: [{title: 'Folha',url: '/grauinstrucao'},{title: 'Grau de Instrução'}]
            }
        },
        { path: 'lista', component: ListaGrauInstrucaoComponent,
            data: {
                title: 'Cadastro Grau de Instrução',
                urls: [{title: 'Folha',url: '/grauinstrucao'},{title: 'Grau de Instrução'}]
            }
        },
        { path: 'excluir/:id', component: ExcluirGrauInstrucaoComponent, 
            data: {
                title: 'Cadastro Grau de Instrução',
                urls: [{title: 'Folha',url: '/grauinstrucao'},{title: 'Grau de Instrução'}]
            }
        },  
        { path: 'reativar/:id', component: ReativarGrauInstrucaoComponent,
            data: {
                title: 'Cadastro Grau de Instrução',
                urls: [{title: 'Folha',url: '/grauinstrucao'},{title: 'Grau de Instrução'}]
            }
        }             
    ]
}
 ];
