import { Routes } from '@angular/router';
import { ListaEmpresaComponent } from './lista-empresa/lista-empresa.component';
// import { AdicionarEmpresaComponent } from './adicionar-empresa/adicionar-empresa.component';
// import { EditarEmpresaComponent } from './editar-empresa/editar-empresa.component';
// import { ExcluirEmpresaComponent } from './excluir-empresa/excluir-empresa.component';
// import { ReativarEmpresaComponent } from './reativar-empresa/reativar-empresa.component';
import { EmpresaComponent } from './empresa.component';
import { data } from './../../table/smart-table/smart-data-table';


export const empresaRouterConfig: Routes = [
    {
        path: '', component: EmpresaComponent,
        data: {
            title: 'Empresa',
            urls: [{ title: 'Cadastros', url: '/empresa' }, { title: 'Empresa' }]
        },
        children: [
            { path: '', component: ListaEmpresaComponent,
                data: {
                    title: 'Empresa',
                    urls: [{title: 'Cadastros',url: '/empresa'},{title: 'Empresa'}]
              } 
            },
            // { path: 'adicionar', component: AdicionarEmpresaComponent },
            // { path: 'editar/:id',  component: EditarEmpresaComponent, },
            // { path: 'excluir/:id',  component: ExcluirEmpresaComponent, },
            // { path: 'reativar/:id',  component: ReativarEmpresaComponent, },
            { path: 'lista', component: ListaEmpresaComponent,
                data: {
                    title: 'Empresa',
                    urls: [{title: 'Cadastros',url: '/empresa'},{title: 'Empresa'}]
                }
            }             
        ]
    }
]