import { Routes } from '@angular/router';

import { TituloComponent } from './titulo.component';
import { ListaTituloComponent } from './lista-titulo/lista-titulo.component';
import { AdicionarTituloComponent } from './adicionar-titulo/adicionar-titulo.component';
import { EditarTituloComponent } from './editar-titulo/editar-titulo.component';
import { ReativarTituloComponent } from './reativar-titulo/reativar-titulo.component';
import { ExcluirTituloComponent } from './excluir-titulo/excluir-titulo.component';
import { AdicionarTitulodescontoComponent } from './adicionar-titulodesconto/adicionar-titulodesconto.component';
import { ListaTitulodescontoComponent } from './lista-titulodesconto/lista-titulodesconto.component';
import { ListaTitulocentrocustoComponent } from './lista-titulocentrocusto/lista-titulocentrocusto.component';
import { AdicionarTitulocentrocustoComponent } from './adicionar-titulocentrocusto/adicionar-titulocentrocusto.component';
import { ListaTitulocentroresultadoComponent } from './lista-titulocentroresultado/lista-titulocentroresultado.component';
import { AdicionarTitulocentroresultadoComponent } from './adicionar-titulocentroresultado/adicionar-titulocentroresultado.component';
import { ListaTituloparcelaComponent } from './lista-tituloparcela/lista-tituloparcela.component';
import { AdicionarTituloparcelaComponent } from './adicionar-tituloparcela/adicionar-tituloparcela.component';
import { ListaTituloparceladescontoComponent } from './lista-tituloparceladesconto/lista-tituloparceladesconto.component';
import { AdicionarTituloparceladescontoComponent } from './adicionar-tituloparceladesconto/adicionar-tituloparceladesconto.component';


export const tituloRouterConfig: Routes = [
    {
        path: '', component: TituloComponent,
        children: [
            { path: '', component: ListaTituloComponent },
            { path: 'adicionar/:natureza', component: AdicionarTituloComponent },            
            { path: 'editar/:natureza/:id',  component: EditarTituloComponent, },
            { path: 'excluir/:id',  component: ExcluirTituloComponent, },
            { path: 'reativar/:id',  component: ReativarTituloComponent, },
            { path: 'lista/:natureza', component: ListaTituloComponent },
            { path: 'listaDesconto', component: ListaTitulodescontoComponent },
            { path: 'adicionarDesconto', component: AdicionarTitulodescontoComponent },
            { path: 'listaCentroCusto', component: ListaTitulocentrocustoComponent },
            { path: 'adicionarCentroCusto', component: AdicionarTitulocentrocustoComponent },
            { path: 'listaCentroResultado', component: ListaTitulocentroresultadoComponent },
            { path: 'adicionarCentroResultado', component: AdicionarTitulocentroresultadoComponent },
            { path: 'listaParcela', component: ListaTituloparcelaComponent },
            { path: 'adicionarParcela', component: AdicionarTituloparcelaComponent },
            { path: 'listaParcelaDesconto', component: ListaTituloparceladescontoComponent },
            //{ path: 'adicionarParcelaDesconto', component: AdicionarTituloparcelaComponent },
            { path: 'adicionarParcelaDesconto', component: AdicionarTituloparceladescontoComponent }
        ]
    }
];