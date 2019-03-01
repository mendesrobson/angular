import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DataTableModule } from "ng2-data-table";
import { SelectModule } from 'ng2-select';
import { TextMaskModule } from 'angular2-text-mask';
import { MaskService } from '../../services/mask.service';
import { DataFilterPipeModule } from '../../utils/datafilter.pipe.module';
import { FaturamentoComponent } from './faturamento.component';
import { GerarFaturamentoComponent } from './gerar-faturamento/gerar-faturamento.component';
import { ListaFaturamentoComponent } from './lista-faturamento/lista-faturamento.component';
import { faturamentoRouterConfig } from './faturamento.routes';
import { FaturamentoService } from './faturamento.service';
import { CheckBoxSetDirectiveModule } from '../../diretivas/checkboxset.module';
import { DisableControlDirectiveModule } from '../../diretivas/disablecontrol.module';
import { FiltrarFaturamentoComponent } from './filtrar-faturamento/filtrar-faturamento.component';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { ListaLancamentoComponent } from './lista-lancamento/lista-lancamento.component';
import { MyDatePickerModule } from 'mydatepicker';
import { DisableControlCheckBoxDirectiveModule } from '../../diretivas/disablecontrolcheckbox.module';
//import { ToastsManager, Toast } from 'ng2-toastr/ng2-toastr';
import { ExcluirFaturamentoComponent } from './excluir-faturamento/excluir-faturamento.component';
import { ListaFaturamentoTodosComponent } from './lista-faturamentotodos/lista-faturamentotodos.component';
import { BusyModule } from 'angular2-busy';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { OnlyNumberDirectiveModule } from '../../diretivas/onlynumber.module';
import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";
import { DxDateBoxModule, DxDataGridModule, DxDropDownBoxModule, DxSelectBoxModule } from '../../../../node_modules/devextreme-angular';


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
  //  SharedModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(faturamentoRouterConfig),
    HttpClientModule,
    ReactiveFormsModule,
    DataTableModule,
    DataFilterPipeModule,
    SelectModule,
    TextMaskModule,
    CheckBoxSetDirectiveModule,
    DisableControlDirectiveModule,
    MultiselectDropdownModule,
    AngularMultiSelectModule,
    MyDatePickerModule,
    DisableControlCheckBoxDirectiveModule,
    BusyModule,
    OnlyNumberDirectiveModule,  
    DxDateBoxModule,
    DxDataGridModule,
    DxDropDownBoxModule,
    DxSelectBoxModule
  ],
  
  declarations: [
    FaturamentoComponent,
    ListaFaturamentoComponent,
    GerarFaturamentoComponent,
    FiltrarFaturamentoComponent,
    ListaLancamentoComponent,
    ExcluirFaturamentoComponent,
    ListaFaturamentoTodosComponent 
  ],
  providers : [
    MaskService,
    FaturamentoService,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  exports: [
    RouterModule,
    DataFilterPipeModule,
    CheckBoxSetDirectiveModule,
    OnlyNumberDirectiveModule,
    DisableControlDirectiveModule,
    DisableControlCheckBoxDirectiveModule
  ]
})
export class FaturamentoModule { }
