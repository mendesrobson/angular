import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { AuthenticationModule } from './authentication/authentication.module';

export const routes: Routes = [
{
    path: '',
    component: FullComponent,
    children: [
        { path: '', redirectTo: '/authentication/login', pathMatch: 'full' },
        { path: 'dashboard', loadChildren: './dashboards/dashboard.module#DashboardModule' },
        
        { path: 'starter', loadChildren: './starter/starter.module#StarterModule' },
        { path: 'component', loadChildren: './component/component.module#ComponentsModule' },
        { path: 'icons', loadChildren: './icons/icons.module#IconsModule' },
        { path: 'forms', loadChildren: './form/forms.module#FormModule' },
        { path: 'tables', loadChildren: './table/tables.module#TablesModule' },
        { path: 'charts', loadChildren: './charts/charts.module#ChartModule' },
        { path: 'widgets', loadChildren: './widgets/widgets.module#WidgetsModule' },
        { path: 'extra-component', loadChildren: './extra-component/extra-component.module#ExtraComponentsModule' },
        { path: 'apps', loadChildren: './apps/apps.module#AppsModule' },
        { path: 'sample-pages', loadChildren: './sample-pages/sample-pages.module#SamplePagesModule' },

        { path: 'agencia', loadChildren: 'app/cadastros/agencia/agencia.module#AgenciaModule' },
        { path: 'banco', loadChildren: 'app/cadastros/banco/banco.module#BancoModule' },
        { path: 'cartao', loadChildren: 'app/cadastros/cartao/cartao.module#CartaoModule'},    
        { path: 'centrocusto', loadChildren: 'app/cadastros/centrocusto/centrocusto.module#CentrocustoModule'},
        { path: 'centroresultado', loadChildren: 'app/cadastros/centroresultado/centroresultado.module#CentroresultadoModule'},
        
        { path: 'estadocivil', loadChildren:'app/cadastros/estadocivil/estadocivil.module#EstadocivilModule'},
        { path: 'localidade', loadChildren:'app/cadastros/localidade/localidade.module#LocalidadeModule'},
        //{ path: 'gradehorario', loadChildren:'app/folha/gradehorario/gradehorario.module#GradehorarioModule'},
        
        { path: 'cliente', loadChildren: 'app/cadastros/cliente/cliente.module#ClienteModule' },
        { path: 'configuracaopagamento', loadChildren: 'app/cadastros/configuracaopagamento/configuracaopagamento.module#ConfiguracaopagamentoModule'},
        { path: 'conta', loadChildren: 'app/cadastros/contacorrente/contacorrente.module#ContaCorrenteModule' },
        { path: 'desconto', loadChildren: 'app/cadastros/desconto/desconto.module#DescontoModule'},
        { path: 'mascara', loadChildren: 'app/cadastros/mascara/mascara.module#MascaraModule' },
        { path: 'tipologradouro', loadChildren: 'app/cadastros/tipologradouro/tipologradouro.module#TipoLogradouroModule' },
        { path: 'testemunha', loadChildren: 'app/cadastros/testemunha/testemunha.module#TestemunhaModule' },
        { path: 'observacao', loadChildren: 'app/cadastros/observacao/observacao.module#ObservacaoModule' },    
        { path: 'tipocontrato', loadChildren: 'app/cadastros/tipocontrato/tipocontrato.module#TipoContratoModule' },
        { path: 'categoriacontapagar', loadChildren: 'app/cadastros/categoriacontapagar/categoriacontapagar.module#CategoriaContaPagarModule' },
        { path: 'titulo', loadChildren: 'app/contasreceber/titulo/titulo.module#TituloModule' },
        { path: 'historicopadrao', loadChildren: 'app/cadastros/historicopadrao/historicopadrao.module#HistoricoPadraoModule' },
        { path: 'categoriacontareceber', loadChildren:'app/cadastros/categoriacontareceber/categoriacontareceber.module#CategoriaContaReceberModule'},
        { path: 'eventofaturamento', loadChildren: 'app/faturamento/eventofaturamento/eventofaturamento.module#EventoFaturamentoModule' },
        { path: 'contratofaturamento', loadChildren: 'app/faturamento/contratofaturamento/contratofaturamento.module#ContratoFaturamentoModule' },
        { path: 'lancamento', loadChildren: 'app/faturamento/lancamento/lancamento.module#LancamentoModule' },
        { path: 'faturamento', loadChildren: 'app/faturamento/faturamento/faturamento.module#FaturamentoModule'},
        { path: 'parametrofaturamento', loadChildren: 'app/faturamento/parametrofaturamento/parametrofaturamento.module#ParametroFaturamentoModule'},
       // {path: 'dashboard', loadChildren: 'app/dashboard/dashboard/dashboard.module#DashboardModule' },
        { path: 'empresa', loadChildren: 'app/cadastros/empresa/empresa.module#EmpresaModule'},
        { path: 'boleto', loadChildren: 'app/contasreceber/boleto/boleto.module#BoletoModule'},
        { path: 'remessa', loadChildren: 'app/contasreceber/remessa/remessa.module#RemessaModule'},
        { path: 'pessoa', loadChildren: 'app/cadastros/pessoa/pessoa.module#PessoaModule' },
        { path: 'fornecedor', loadChildren: 'app/cadastros/fornecedor/fornecedor.module#FornecedorModule' },
        { path: 'chequeproprio', loadChildren: 'app/cadastros/chequeproprio/chequeproprio.module#ChequeProprioModule' },
        { path: 'nfse', loadChildren: 'app/contasreceber/nfse/nfse.module#NfseModule' },
        { path: 'alterarvencimentolote', loadChildren: 'app/contasreceber/alterarvencimentolote/alterarvencimentolote.module#AlterarVencimentoLoteModule'},
        { path: 'reajustecontratofaturamento', loadChildren: 'app/faturamento/reajustecontratofaturamento/reajustecontratofaturamento.module#ReajusteContratoFaturamentoModule'},
        { path: 'administradoracartao', loadChildren: 'app/cadastros/administradoracartao/administradoracartao.module#AdministradoracartaoModule' },
        { path: 'tituloparcelabaixa', loadChildren: 'app/contasreceber/tituloparcelabaixa/tituloparcelabaixa.module#TituloParcelaBaixaModule'},
        { path: 'renegociacao', loadChildren: 'app/contasreceber/renegociacao/renegociacao.module#RenegociacaoModule' },
        { path: 'movimentoconta', loadChildren: 'app/movimentoconta/movimentoconta/movimentoconta.module#MovimentoContaModule'},
        { path: 'leiautearquivobancario', loadChildren: 'app/cadastros/leiautearquivobancario/leiautearquivobancario.module#LeiauteArquivoBancarioModule'},
        { path: 'gerarremessapagamento', loadChildren: 'app/contaspagar/gerarremessapagamento/gerarremessapagamento.module#GerarRemessaPagamentoModule'},
        { path: 'lerretornopagamento', loadChildren: 'app/contaspagar/retornopagamento/retornopagamento.module#RetornoPagamentoModule'},
        { path: 'conciliacaobancaria', loadChildren: 'app/conciliacaobancaria/conciliacaobancaria.module#ConciliacaoBancariaModule'},
        { path: 'cobranca', loadChildren: 'app/contasreceber/cobranca/cobranca.module#CobrancaModule' },
        { path: 'cargo', loadChildren: 'app/folha/cargo/cargo.module#CargoModule' },
        { path: 'cbo', loadChildren: 'app/folha/cbo/cbo.module#CboModule' },
        { path: 'tipojornada', loadChildren: 'app/folha/tipojornada/tipojornada.module#TipoJornadaModule' },
        { path: 'grade', loadChildren: 'app/folha/grade/grade.module#GradeModule' },
        { path: 'grauinstrucao', loadChildren: 'app/folha/grauinstrucao/grauinstrucao.module#GrauInstrucaoModule' },
        { path: 'parentesco', loadChildren: 'app/cadastros/parentesco/parentesco.module#ParentescoModule' },
        { path: 'contribuicaosindicalpatronal', loadChildren: 'app/folha/contribuicaosindicalpatronal/contribuicaosindicalpatronal.module#ContribuicaoSindicalPatronalModule' },
        { path: 'tipoadmissao', loadChildren: 'app/folha/tipodeadmissao/tipodeadmissao.module#TipoDeAdmissaoModule' },
        { path: 'tipobeneficio', loadChildren: 'app/folha/tipobeneficio/tipobeneficio.module#TipoBeneficioModule' },
        { path: 'tipoafastamento', loadChildren: 'app/folha/tipoafastamento/tipoafastamento.module#TipoAfastamentoModule'},
        { path: 'agenteintegrador', loadChildren: 'app/folha/agenteintegrador/agenteintegrador.module#AgenteintegradorModule'},
        { path: 'nacionalidades', loadChildren: 'app/cadastros/nacionalidade/nacionalidade.module#NacionalidadeModule'},
        { path: 'pais', loadChildren: 'app/cadastros/pais/pais.module#PaisModule'},
        { path: 'corraca', loadChildren: 'app/cadastros/corraca/corraca.module#CorRacaModule'},
        { path: 'tipoendereco', loadChildren: 'app/cadastros/tipoendereco/tipoendereco.module#TipoEnderecoModule'},
        { path: 'operadoraplanosaude', loadChildren: 'app/folha/operadoraplanosaude/operadoraplanosaude.module#OperadoraPlanoSaudeModule'},
        { path: 'coordenadordeestagio', loadChildren: 'app/folha/coordenadordeestagio/coordenadordeestagio.module#CoordenadorDeEstagioModule'},
        { path: 'uf', loadChildren: 'app/cadastros/uf/uf.module#UfModule'},
        { path: 'tipohorariotrabalho', loadChildren: 'app/folha/tipohorariotrabalho/tipohorariotrabalho.module#TipoHorarioTrabalhoModule'},
        { path: 'instituicaoensino', loadChildren: 'app/folha/instituicaoensino/instituicaoensino.module#InstituicaoensinoModule'},
        { path: 'responsavelcaged', loadChildren: 'app/folha/responsavelcaged/responsavelcaged.module#ResponsavelCagedModule'},
        { path: 'usuario', loadChildren: 'app/seguranca/usuario/usuario.module#UsuarioModule'},
        { path: 'tipodeficiencia', loadChildren: 'app/folha/tipodeficiencia/tipodeficiencia.module#TipoDeficienciaModule'},
        { path: 'sindicato', loadChildren: 'app/folha/sindicato/sindicato.module#SindicatoModule'},
        { path: 'convencao', loadChildren: 'app/folha/convencao/convencao.module#ConvencaoModule'},
        { path: 'legislacao', loadChildren: 'app/folha/legislacao/legislacao.module#LegislacaoModule'},
        { path: 'naturezalesao', loadChildren: 'app/folha/naturezalesao/naturezalesao.module#NaturezaLesaoModule'},
        { path: 'exposicaoagentenocivo', loadChildren: 'app/folha/exposicaoagentenocivo/exposicaoagentenocivo.module#ExposicaoagentenocivoModule'},
        { path: 'sitgeradoraacidentetrabalho', loadChildren: 'app/folha/sitgeradoraacidentetrabalho/sitgeradoraacidentetrabalho.module#SitGeradoraAcidenteTrabalhoModule'},
        { path: 'partecorpoatingida', loadChildren: 'app/folha/partecorpoatingida/partecorpoatingida.module#PartecorpoatingidaModule'},
        { path: 'agentecausadoracidente', loadChildren: 'app/folha/agentecausadoracidente/agentecausadoracidente.module#AgenteCausadorAcidenteModule'},
        { path: 'cid', loadChildren: 'app/folha/cid/cid.module#CidModule'},
        { path: 'colaborador', loadChildren: 'app/folha/empregado/empregado.module#EmpregadoModule'},
        { path: 'papel', loadChildren: 'app/seguranca/papel/papel.module#PapelModule'},
        { path: 'colaborador', loadChildren: 'app/folha/empregado/empregado.module#EmpregadoModule'},
        { path: 'departamento', loadChildren: 'app/folha/departamento/departamento.module#DepartamentoModule'},
        { path: 'equipprotecaoindividual', loadChildren: 'app/folha/equipprotecaoindividual/equipprotecaoindividual.module#EquipprotecaoindividualModule'},
        { path: 'tipolotacaotributaria', loadChildren: 'app/folha/tipolotacaotributaria/tipolotacaotributaria.module#TipolotacaotributariaModule'},
        { path: 'valortransporte', loadChildren: 'app/folha/valortransporte/valortransporte.module#ValortransporteModule'},
        { path: 'report', loadChildren: 'app/report/report.module#ReportModule'}

    ]
},
{
    path: '',
    component: BlankComponent,
    children: [
        {
            path: 'authentication',
            loadChildren: './authentication/authentication.module#AuthenticationModule'
        }
    ]
}, 
{
    path: '**',
    redirectTo: '404' 
}];

@NgModule({
    imports: [RouterModule.forRoot(routes), NgbModule.forRoot()],
    exports: [RouterModule]
})
export class AppRoutingModule { }

