import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Cliente, FiltroLancamentoFaturamento, TipoFaturamento, ConfiguracaoPagamento } from '../models/faturamento';
import { FaturamentoService } from '../faturamento.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';

@Component({
  selector: 'app-gerar-faturamento',
  templateUrl: './gerar-faturamento.component.html',
  styleUrls: []
})
export class GerarFaturamentoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public configuracaoPagamentoForm: FormGroup;
  public configuracaoPagamento: ConfiguracaoPagamento;
  public configuracoesPagamento: ConfiguracaoPagamento[];
  public dadosFaturamento: FiltroLancamentoFaturamento;

  swal: SweetAlertAdviceService;

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public clientes: Cliente[];
  public tiposFaturamento: TipoFaturamento[];


  public errors: any[] = [];

  constructor(private faturamentoService: FaturamentoService,
    private fb: FormBuilder,
    private router: Router) {

    this.validationMessages = {
      grupoEmpresaId:
      {
        required: 'Grupo requerido.'
      },
      empresaId: {
        required: 'Empresa requerida.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.dadosFaturamento = new FiltroLancamentoFaturamento();
    this.configuracaoPagamento = new ConfiguracaoPagamento();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.configuracaoPagamentoForm = this.fb.group({
      quantidadeParcela: '',
      periodicidade: '',
      dataPrimeiroVencimento: '',
      manterDiaVencimento: '',
      diaUtil: '',
      posterga: '',
      antecipa: '',
      ultimoDiaMes: '',
      sabadoUtil: '',
      domingoUtil: '',
      numeroDiaUtil: '',
      percentualJuros: '',
      percentualMulta: ''
    });

    this.faturamentoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);

    // this.faturamentoService.obterTodosEmpresa()
    //   .subscribe(empresas => {
    //     this.empresas = empresas
    //   },
    //   error => this.errors);

    // this.faturamentoService.obterTodosCliente()
    //   .subscribe(clientes => {
    //     this.clientes = clientes
    //   },
    //   error => this.errors);

    // this.faturamentoService.getTipoFaturamento()
    //   .subscribe(tiposFaturamento => {
    //     this.tiposFaturamento = tiposFaturamento
    //   },
    //   error => this.errors);
    this.tiposFaturamento = [
      {
        "id": "TOD",
        "valor": "Todos"
      },
      {
        "id": "CEFC",
        "valor": "Somente contratos e eventos que faturam com os contratos"
      },
      {
        "id": "ENFC",
        "valor": "Somente eventos que não faturam com o contrato"
      }
    ];

    this.faturamentoService.obterTodosConfiguracaoPagamento()
      .subscribe(configuracoesPagamento => {
        this.configuracoesPagamento = configuracoesPagamento
      },
        error => this.errors);
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

  cancelar() {
    this.router.navigate(['faturamento/lista']);
  }

  obterConfiguracaoPagamento(id: string) {

    this.configuracoesPagamento.forEach(element => {
      if (element.id == id) {
        this.preencherConfiguracaoPagamentoForm(element);
      }

    });



  }


  preencherConfiguracaoPagamentoForm(configuracaoPagamento: ConfiguracaoPagamento) {
    this.configuracaoPagamento = configuracaoPagamento;



    this.configuracaoPagamentoForm.patchValue({
      id: this.configuracaoPagamento.id,
      descricao: configuracaoPagamento.descricao,
      quantidadeParcela: configuracaoPagamento.quantidadeParcela,
      periodicidade: configuracaoPagamento.periodicidade,
      dataPrimeiroVencimento: configuracaoPagamento.dataPrimeiroVencimento,
      manterDiaVencimento: configuracaoPagamento.manterDiaVencimento,
      diaUtil: configuracaoPagamento.diaUtil,
      posterga: configuracaoPagamento.posterga,
      antecipa: configuracaoPagamento.antecipa,
      ultimoDiaMes: configuracaoPagamento.ultimoDiaMes,
      sabadoUtil: configuracaoPagamento.sabadoUtil,
      domingoUtil: configuracaoPagamento.domingoUtil,
      numeroDiaUtil: configuracaoPagamento.numeroDiaUtil,
      percentualJuros: configuracaoPagamento.percentualJuros,
      percentualMulta: configuracaoPagamento.percentualMulta

    })



  }


}
