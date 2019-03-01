import { NgModule } from '@angular/core';
import { ReportComponent } from './report.component';
import { ReportViewerBancoComponent } from './report-banco/report-viewer-banco.component';
import { CommonModule } from '../../../node_modules/@angular/common';
import { RouterModule } from '../../../node_modules/@angular/router';
import { reportRouterConfig } from './report.routes';
import { ReportViewerClienteComponent } from './report-cliente/report-viewer-cliente.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportService } from './report.service';
import { DxSelectBoxModule, DxDateBoxModule, DxTagBoxModule, DxRadioGroupModule, DxCheckBoxModule, DxDataGridModule, DxDropDownBoxModule } from 'devextreme-angular';
import { ReportViewerRelacaoFaturamentoComponent } from './report-relacaofaturamento/report-viewer-relacaofaturamento.component';
import { ReportViewerExtratoFaturamentoComponent } from './report-extratofaturamento/report-viewer-extratofaturamento.component';
import { ReportViewerDarfirrfComponent } from './report-darfirrf/report-viewer-darfirrf.component';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from 'ng2-currency-mask/src/currency-mask.config';
import { MaskService } from '../services/mask.service';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ReportViewerReciboProvisorioServicoEmitidoComponent } from './report-reciboprovisorioservicoemitido/report-viewer-reciboprovisorioservicoemitido.component';
import { ReportViewerBoletosemitidosComponent } from './report-boletosemitidos/report-viewer-boletosemitidos.component';
import { ReportViewerNotasfiscaisemitidasComponent } from './report-notasfiscaisemitidas/report-viewer-notasfiscaisemitidas.component';
import { ReportViewerDocumentoCobrancaEmitidoComponent } from './report-documentocobrancaemitido/report-viewer-documentocobrancaemitido.component';

import { ReportViewerDarfcrfComponent } from './report-darfcrf/report-viewer-darfcrf.component';
import { ReportViewerResumoFaturamentoComponent } from './report-resumofaturamento/report-viewer-resumofaturamento.component';
import { ReportViewerPendenciafaturamentoComponent } from './report-pendenciafaturamento/report-viewer-pendenciafaturamento.component';
import { ReportViewerFaturamentoperiodoComponent } from './report-faturamentoperiodo/report-viewer-faturamentoperiodo.component';
import { ReportViewerLancamentoeventoComponent } from './report-lancamentoeventos/report-viewer-lancamentoevento.component';
import { ReportViewerRelacaocontratoComponent } from './report-relacaocontrato/report-viewer-relacaocontrato.component';
import { ReportViewerReajusteeventosfixos } from './report-reajusteeventosfixos/report-viewer-reajusteeventosfixos.component';
import { ReportViewerReajustecontratos } from './report-reajustecontratos/report-viewer-reajustecontratos.component';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "right",
  allowNegative: false,
  //  allowZero: true,
  decimal: ",",
  precision: 2,
  prefix: " ",
  suffix: "",
  thousands: "."
};

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    RouterModule.forChild(reportRouterConfig),
    ReactiveFormsModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    DxTagBoxModule,
    DxRadioGroupModule,
    DxCheckBoxModule,
    CurrencyMaskModule,
    DxDataGridModule,
    DxDropDownBoxModule
  ],
  declarations: [
    ReportComponent,
    ReportViewerBancoComponent,
    ReportViewerClienteComponent,
    ReportViewerRelacaoFaturamentoComponent,
    ReportViewerExtratoFaturamentoComponent,
    ReportViewerReciboProvisorioServicoEmitidoComponent,
    ReportViewerDarfirrfComponent,
    ReportViewerBoletosemitidosComponent,
    ReportViewerNotasfiscaisemitidasComponent,
    ReportViewerDarfcrfComponent,
    ReportViewerDocumentoCobrancaEmitidoComponent,
    ReportViewerResumoFaturamentoComponent,
    ReportViewerPendenciafaturamentoComponent,
    ReportViewerFaturamentoperiodoComponent,
    ReportViewerLancamentoeventoComponent,
    ReportViewerRelacaocontratoComponent,
    ReportViewerReajusteeventosfixos,
    ReportViewerReajustecontratos
  ],
  providers: [
    MaskService,
    ReportService,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  exports: [
    RouterModule]
})
export class ReportModule { }

