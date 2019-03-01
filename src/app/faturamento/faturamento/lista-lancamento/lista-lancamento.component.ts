import { Component, OnInit, Input, ElementRef, ViewChildren, AfterViewInit, ViewContainerRef } from '@angular/core';
import { FiltroLancamentoFaturamento, Lancamento, ConfiguracaoPagamento, LancamentoConfiguracaoPagamento } from '../models/faturamento';
import { FaturamentoService } from '../faturamento.service';
import { FormGroup, FormBuilder, FormControlName, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { DateUtils } from '../../../utils/date.utils';
import { CheckBoxSetDirective } from '../../../diretivas/checkboxset.directive';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
//import { ToastsManager } from 'ng2-toastr';
import { Subscription } from 'rxjs';
import { UtilService } from '../../../services/util.service';
import { FiltrarFaturamentoComponent } from '../filtrar-faturamento/filtrar-faturamento.component';

@Component({
  selector: 'app-lista-lancamento',
  templateUrl: './lista-lancamento.component.html',
  styleUrls: []
})
export class ListaLancamentoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  @Input() dadosFiltro: any = null;


  public lancamentos1: Lancamento[];

  public errors: any[] = [];

  busy: Subscription;

  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "nome";
  public sortOrder = "asc";

  displayMessage: { [key: string]: string } = {};
  private genericValidator: GenericValidator;
  private validationMessages: { [key: string]: { [key: string]: string } };

  public configuracaoPagamentoForm: FormGroup;
  public configuracaoPagamento: ConfiguracaoPagamento;
  public configuracoesPagamento: ConfiguracaoPagamento[];
  public lancamentoConfiguracaoPagamento: LancamentoConfiguracaoPagamento;

  public myDatePickerOptions = DateUtils.getMyDatePickerOptions();

  public diretivaCheckBox = CheckBoxSetDirective;

  swal: SweetAlertAdviceService;

  public data: any[];

  selectedEntities: any[];

  constructor(private faturamentoService: FaturamentoService,
    private fb: FormBuilder, public filtrarFaturamentoComponent: FiltrarFaturamentoComponent,
    // private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private _utilService: UtilService) {

    //this.toastr.setRootViewContainerRef(vcr);

    this.validationMessages = {

      id: {
        required: 'Configuração de Pagamento requerida'
      },
      quantidadeParcela: {
        required: 'Quantidade Parcela requerida.'
      },
      periodicidade: {
        required: 'Periodicidade requerida.'
      },
      numeroDiaUtil: {
        required: 'Qtd. Dia Útil requerida.'
      },
      dataPrimeiroVencimento: {
        required: 'Data Primeiro Vencimento requerida'
      }
    };

    this.configuracaoPagamento = new ConfiguracaoPagamento();
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {

    this.faturamentoService.obterTodosLancamentoFaturamento(this.dadosFiltro)
      .subscribe(
        lancamentos => {
          this.data = lancamentos;
        },
        error => {
          this.onError(error)
        });

    this.configuracaoPagamentoForm = this.fb.group({
      id: [0, [Validators.required]],
      quantidadeParcela: [0, [Validators.required]],
      periodicidade: [0, [Validators.required]],
      dataPrimeiroVencimento: ['', [Validators.required]],
      manterDiaVencimento: 'N',
      diaUtil: 'N',
      posterga: 'N',
      antecipa: 'N',
      ultimoDiaMes: 'N',
      sabadoUtil: 'N',
      domingoUtil: 'N',
      numeroDiaUtil: [0, [Validators.required]],
      percentualJuros: 0,
      percentualMulta: 0
    });

    this.faturamentoService.obterTodosConfiguracaoPagamento()
      .subscribe(configuracoesPagamento => {
        this.configuracoesPagamento = configuracoesPagamento
      },
        () => { });

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.configuracaoPagamentoForm);
    });
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }


  obterConfiguracaoPagamento(id: string): void {
    if (id != undefined) {
      this.configuracoesPagamento.forEach(element => {
        if (element.id == id) {
          this.preencherConfiguracaoPagamentoForm(element);
        }
      });
    }
  }


  preencherConfiguracaoPagamentoForm(configuracaoPagamento: ConfiguracaoPagamento): void {
    this.configuracaoPagamento = configuracaoPagamento;
    this.configuracaoPagamentoForm.patchValue({
      id: this.configuracaoPagamento.id,
      descricao: this.configuracaoPagamento.descricao,
      quantidadeParcela: this.configuracaoPagamento.quantidadeParcela,
      periodicidade: this.configuracaoPagamento.periodicidade,
      //dataPrimeiroVencimento: this._utilService.ToDate(this.configuracaoPagamento.dataPrimeiroVencimento),
      dataPrimeiroVencimento: this.configuracaoPagamento.dataPrimeiroVencimento,
      numeroDiaUtil: this.configuracaoPagamento.numeroDiaUtil,
      percentualJuros: this.configuracaoPagamento.percentualJuros,
      percentualMulta: this.configuracaoPagamento.percentualMulta
    })
  }


  gerarFaturamento() {
    this.lancamentoConfiguracaoPagamento = new LancamentoConfiguracaoPagamento();

    let p = Object.assign({}, this.configuracaoPagamento, this.configuracaoPagamentoForm.getRawValue());

    p.dataPrimeiroVencimento = this.dadosFiltro.dataVencimentoInicial;

    this.lancamentoConfiguracaoPagamento.configuracaoPagamento = p;

    this.lancamentoConfiguracaoPagamento.lancamento = this.selectedEntities;

    if ((p.id == "") && (this.selectedEntities == undefined || this.selectedEntities.length == 0)) {
      // this.toastr.warning('Configuração de Pagamento requerida', 'Atenção', { dismiss: 'click' });
      // this.toastr.warning('Escolha ao menos 1(um) lançamento para faturar', 'Atenção', { dismiss: 'click' });
    }
    else if (this.selectedEntities == undefined || this.selectedEntities.length == 0) {
      //this.toastr.warning('Escolha ao menos 1(um) lançamento para faturar', 'Atenção', { dismiss: 'click' });
    }
    else {
      this.busy = this.faturamentoService.gerarFaturamento(this.lancamentoConfiguracaoPagamento)
        .subscribe(
           async () => {
            //this.filtrarFaturamentoComponent.valorRadio = "faturamento";
            await this.filtrarFaturamentoComponent.faturamentoForm.reset();
            this.swal.showSwalSuccess('Faturamento(s) gerado(s) com sucesso');
          }, () => { }
        );
    }

  }


  public setSelectedEntities($event: any) {
    this.selectedEntities = $event;
  }


}
