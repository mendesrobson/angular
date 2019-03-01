import { Routes } from '@angular/router';
import { ReportComponent } from './report.component';
import { ReportViewerBancoComponent } from './report-banco/report-viewer-banco.component';
import { ReportViewerClienteComponent } from './report-cliente/report-viewer-cliente.component';
import { ReportViewerRelacaoFaturamentoComponent } from './report-relacaofaturamento/report-viewer-relacaofaturamento.component';
import { ReportViewerExtratoFaturamentoComponent } from './report-extratofaturamento/report-viewer-extratofaturamento.component';
import { ReportViewerDarfirrfComponent } from './report-darfirrf/report-viewer-darfirrf.component';
import { ReportViewerReciboProvisorioServicoEmitidoComponent } from './report-reciboprovisorioservicoemitido/report-viewer-reciboprovisorioservicoemitido.component';
import { ReportViewerBoletosemitidosComponent } from './report-boletosemitidos/report-viewer-boletosemitidos.component';
import { ReportViewerNotasfiscaisemitidasComponent } from './report-notasfiscaisemitidas/report-viewer-notasfiscaisemitidas.component';
import { ReportViewerDocumentoCobrancaEmitidoComponent } from './report-documentocobrancaemitido/report-viewer-documentocobrancaemitido.component';
import { ReportViewerRelacaocontratoComponent } from './report-relacaocontrato/report-viewer-relacaocontrato.component'

import { ReportViewerDarfcrfComponent } from './report-darfcrf/report-viewer-darfcrf.component';
import { ReportViewerResumoFaturamentoComponent } from './report-resumofaturamento/report-viewer-resumofaturamento.component';
import { ReportViewerPendenciafaturamentoComponent } from './report-pendenciafaturamento/report-viewer-pendenciafaturamento.component';
import { ReportViewerFaturamentoperiodoComponent } from './report-faturamentoperiodo/report-viewer-faturamentoperiodo.component';
import { ReportViewerLancamentoeventoComponent } from './report-lancamentoeventos/report-viewer-lancamentoevento.component';
import { ReportViewerReajusteeventosfixos } from './report-reajusteeventosfixos/report-viewer-reajusteeventosfixos.component';
import { ReportViewerReajustecontratos } from './report-reajustecontratos/report-viewer-reajustecontratos.component';

export const reportRouterConfig: Routes = [
    {
        path: '', component: ReportComponent,
        children: [
            {
                path: 'banco', component: ReportViewerBancoComponent,
                data: {
                    title: 'Relatório Banco',
                    urls: [{ title: 'Relatório Banco', url: '/report' }, { title: 'Relatório Banco' }]
                }
            },
            {
                path: 'cliente', component: ReportViewerClienteComponent,
                data: {
                    title: 'Relatório Cliente',
                    urls: [{ title: 'Relatório Cliente', url: '/report' }, { title: 'Relatório Cliente' }]
                }
            },
            {
                path: 'relacaofaturamento', component: ReportViewerRelacaoFaturamentoComponent,
                data: {
                    title: 'Relatório Relação Faturamento',
                    urls: [{ title: 'Relatório Relação Faturamento', url: '/report' }, { title: 'Relatório Relação Faturamento' }]
                }
            },
            {
                path: 'extratofaturamento', component: ReportViewerExtratoFaturamentoComponent,
                data: {
                    title: 'Relatório Extrato Faturamento',
                    urls: [{ title: 'Relatório Extrato Faturamento', url: '/report' }, { title: 'Relatório Extrato Faturamento' }]
                }
            },
            {
                path: 'reciboprovisorioservicoemitido', component: ReportViewerReciboProvisorioServicoEmitidoComponent,
                data: {
                    title: 'Relatório Recido Provisório Serviços Emitidos ',
                    urls: [{ title: 'Relatório Recido Provisório Serviços Emitidos', url: '/report' }, { title: 'Relatório Recido Provisório Serviços Emitidos' }]
                }
            },
            {
                path: 'darfirrf', component: ReportViewerDarfirrfComponent,
                data: {
                    title: 'Relatório DARF IRRF',
                    urls: [{ title: 'Relatório DARF IRRF', url: '/report' }, { title: 'Relatório DARF IRRF' }]
                }
            },
            {
                path: 'boletosemitidos', component: ReportViewerBoletosemitidosComponent,
                data: {
                    title: 'Relatório Boletos Emitidos',
                    urls: [{ title: 'Relatório Boletos Emitidos', url: '/report' }, { title: 'Relatório Boletos Emitidos' }]
                }
            },
            {
                path: 'notasfiscaisemitidas', component: ReportViewerNotasfiscaisemitidasComponent,
                data: {
                    title: 'Relatório Notas Fiscais Emitidas',
                    urls: [{ title: 'Relatório Notas Fiscais Emitidas', url: '/report' }, { title: 'Relatório Notas Fiscais Emitidas' }]
                }
            },
            {
                path: 'darfcrf', component: ReportViewerDarfcrfComponent,
                data: {
                    title: 'Relatório DARF CRF',
                    urls: [{ title: 'Relatório DARF CRF', url: '/report' }, { title: 'Relatório DARF CRF' }]
                }
            },
            {
                path: 'documentocobrancaemitido', component: ReportViewerDocumentoCobrancaEmitidoComponent,
                data: {
                    title: 'Relatório Documentos de Cobrança Emitidos',
                    urls: [{ title: 'Relatório Documentos de Cobrança Emitidos', url: '/report' }, { title: 'Relatório Documentos de Cobrança Emitidos' }]
                }
            },
            {
                path: 'resumofaturamento', component: ReportViewerResumoFaturamentoComponent,
                data: {
                    title: 'Relatório Resumo Faturamento',
                    urls: [{ title: 'Relatório Resumo Faturamento', url: '/report' }, { title: 'Relatório Resumo Faturamento' }]
                }
            },
            {
                path: 'pendenciafaturamento', component: ReportViewerPendenciafaturamentoComponent,
                data: {
                    title: 'Pendência Faturamento',
                    urls: [{ title: 'Pendência Faturamento', url: '/report' }, { title: 'Pendência Faturamento' }]
                }
            },
            {
                path: 'faturamentoperiodo', component: ReportViewerFaturamentoperiodoComponent,
                data: {
                    title: 'Faturamento por período',
                    urls: [{ title: 'Faturamento por período', url: '/report' }, { title: 'Faturamento por período' }]
                }
            },
            {
                path: 'lancamentoevento', component: ReportViewerLancamentoeventoComponent,
                data: {
                    title: 'Lançamentos de Eventos',
                    urls: [{ title: 'Lançamentos de Eventos', url: '/report' }, { title: 'Lançamentos de Eventos' }]
                }
            },
            {
                path: 'relacaocontrato', component: ReportViewerRelacaocontratoComponent,
                data: {
                    title: 'Relação de Contratos',
                    urls: [{ title: 'Relação de Contratos', url: '/report' }, { title: 'Relação de Contratos' }]
                }
            },
            {
                path: 'reajusteeventosfixos', component: ReportViewerReajusteeventosfixos,
                data: {
                    title: 'Reajuste de Eventos Fixos',
                    urls: [{ title: 'Reajuste de Eventos Fixos', url: '/report' }, { title: 'Reajuste de Eventos Fixos' }]
                }
            },
            {
                path: 'reajustecontratos', component: ReportViewerReajustecontratos,
                data: {
                    title: 'Reajuste de Contratos',
                    urls: [{ title: 'Reajuste de Contratos', url: '/report' }, { title: 'Reajuste de Contratos' }]
                }
            }
        ]
    }
];