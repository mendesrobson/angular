import { Component, OnInit, ViewChildren, AfterViewInit, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { ParametroFaturamento, ConfiguracaoPagamento, ContaCorrente } from '../models/parametrofaturamento';
import { Subscription } from 'rxjs';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { ParametroFaturamentoService } from '../parametrofaturamento.service';
import { MaskService } from '../../../services/mask.service';
import { UtilService } from '../../../services/util.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';

@Component({
  selector: 'app-reativar-parametrofaturamento',
  templateUrl: './reativar-parametrofaturamento.component.html',
  styleUrls: []
})

export class ReativarParametroFaturamentoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public parametroFaturamento: ParametroFaturamento
  public parametroFaturamentoForm: FormGroup;
  public parametroFaturamentoId: string = "";

  swal: SweetAlertAdviceService;
  mesAnoMask = this._maskService.MesAno();

  displayMessage: { [key: string]: string } = {};

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public configuracaoPagamentos: ConfiguracaoPagamento[];
  public contaCorrentes: ContaCorrente[];

  public errors: any[] = [];

  constructor(
    private parametroFaturamentoService: ParametroFaturamentoService,
    private fb: FormBuilder,
    private _maskService: MaskService,
    private _utilService: UtilService,
    private router: Router,
    private route: ActivatedRoute) {

    this.validationMessages = {
      grupoEmpresaId:
      {
        required: 'Grupo requerido.'
      },
      empresaId: {
        required: 'Empresa requerida.'
      },
      quantidadeParcelasEmAberto: {
        required: 'Quantidade Parcela requerida.'
      },
      considerarDescontoPara: {
        required: 'Considera Desconto Para requerido.'
      },
      quantidadeMesesDesconto: {
        required: 'Meses Desconto requerido.'
      },
      percentual: {
        required: 'Percentual requerido.'
      },
      percentualJuros: {
        required: 'Percentual Juros requerido.'
      },
      percentualMulta: {
        required: 'Percentual Multa requerido.'
      },
      aliquotaCrf: {
        required: 'Alíquota CRF requerido.'
      },
      aliquotaPis: {
        required: 'Alíquota PIS requerido.'
      },
      aliquotaCofins: {
        required: 'Alíquota COFINS requerido.'
      },
      aliquotaCsll: {
        required: 'Alíquota CSLL requerido.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.parametroFaturamento = new ParametroFaturamento();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.parametroFaturamentoForm = this.fb.group({
      guid: 0,
      id: 0,
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      faturarInativos: 'N',
      fechamentoMes: 'N',
      emiteAvisosReajustes: 'N',
      gerarComFaturasVencidas: 'N',
      quantidadeParcelasEmAberto: '',//['', [Validators.required]],     
      calcularDescontosAdimplentes: 'N',
      considerarDescontoPara: ['', [Validators.required]],
      quantidadeMesesDesconto: ['', [Validators.required]],
      percentual: ['', [Validators.required]],
      faturarClientesConstituicao: 'N',
      calcularJuros: 'N',
      percentualJuros: ['', [Validators.required]],
      calcularMulta: 'N',
      percentualMulta: ['', [Validators.required]],
      crf: 'N',
      aliquotaCRF: ['', [Validators.required]],
      pis: 'N',
      aliquotaPIS: ['', [Validators.required]],
      cofins: 'N',
      aliquotaCOFINS: ['', [Validators.required]],
      csll: 'N',
      aliquotaCSLL: ['', [Validators.required]],
      inss: 'N',
      aliquotaINSS: '',//['', [Validators.required]],
      iss: 'N',
      aliquotaISS: '',//['', [Validators.required]],
      aliquotaRetencaoFonte: '',
      configuracaoPagamentoId: '',
      contaCorrenteId: '',
      valorMinimoCRF: '',
      valorMinimoIRRF: ''
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.parametroFaturamentoId = params['id'];
        this.obterParametroFaturamento(this.parametroFaturamentoId);
      });

    this.parametroFaturamentoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);

    this.parametroFaturamentoService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas
      },
        error => this.errors);

    this.parametroFaturamentoService.obterTodosConfiguracaoPagamento()
      .subscribe(configuracaoPagamentos => {
        this.configuracaoPagamentos = configuracaoPagamentos
      },
        error => this.errors);

    this.parametroFaturamentoService.obterTodosContaCorrente()
      .subscribe(contaCorrentes => {
        this.contaCorrentes = contaCorrentes
      },
        error => this.errors);

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    var self = this;
    this.swal.showSwalConfirm('Reativação', function (isConfirmed) {
      if (isConfirmed) {
        self.reativarParametroFaturamento();
      }
      else {
        self.cancelar();
      }
    });
  }

  obterParametroFaturamento(id: string) {
    this.parametroFaturamentoService.obterParametroFaturamento(id)
      .subscribe(
        ParametroFaturamento => this.preencherParametroFaturamentoForm(ParametroFaturamento),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
  }


  preencherParametroFaturamentoForm(parametroFaturamento: ParametroFaturamento): void {
    this.parametroFaturamento = parametroFaturamento;

    this.parametroFaturamentoForm.patchValue({
      id: this.parametroFaturamento.id,
      grupoEmpresaId: this.parametroFaturamento.grupoEmpresaId,
      empresaId: this.parametroFaturamento.empresaId,
      faturarInativos: this.parametroFaturamento.faturarInativos,
      fechamentoMes: this.parametroFaturamento.fechamentoMes,
      emiteAvisosReajustes: this.parametroFaturamento.emiteAvisosReajustes,
      gerarComFaturasVencidas: this.parametroFaturamento.gerarComFaturasVencidas,
      quantidadeParcelasEmAberto: this.parametroFaturamento.quantidadeParcelasEmAberto,
      calcularDescontosAdimplentes: this.parametroFaturamento.calcularDescontosAdimplentes,
      considerarDescontoPara: this.parametroFaturamento.considerarDescontoPara,
      quantidadeMesesDesconto: this.parametroFaturamento.quantidadeMesesDesconto,
      percentual: this.parametroFaturamento.percentual,
      faturarClientesConstituicao: this.parametroFaturamento.faturarClientesConstituicao,
      calcularJuros: this.parametroFaturamento.calcularJuros,
      percentualJuros: this.parametroFaturamento.percentualJuros,
      calcularMulta: this.parametroFaturamento.calcularMulta,
      percentualMulta: this.parametroFaturamento.percentualMulta,
      crf: this.parametroFaturamento.crf,
      aliquotaCRF: this.parametroFaturamento.aliquotaCRF,
      pis: this.parametroFaturamento.pis,
      aliquotaPIS: this.parametroFaturamento.aliquotaPIS,
      cofins: this.parametroFaturamento.cofins,
      aliquotaCOFINS: this.parametroFaturamento.aliquotaCOFINS,
      csll: this.parametroFaturamento.csll,
      aliquotaCSLL: this.parametroFaturamento.aliquotaCSLL,
      iss: this.parametroFaturamento.iss,
      aliquotaISS: this.parametroFaturamento.aliquotaISS,
      inss: this.parametroFaturamento.inss,
      aliquotaINSS: this.parametroFaturamento.aliquotaINSS,
      aliquotaRetencaoFonte: this.parametroFaturamento.aliquotaRetencaoFonte,
      configuracaoPagamentoId: this.parametroFaturamento.configuracaoPagamentoId,
      contaCorrenteId: this.parametroFaturamento.contaCorrenteId,
      valorMinimoCRF: this.parametroFaturamento.valorMinimoCRF,
      valorMinimoIRRF: this.parametroFaturamento.valorMinimoIRRF
    });
  }

  reativarParametroFaturamento() {
    this.parametroFaturamentoService.reativarParametroFaturamento(this.parametroFaturamento)
      .subscribe(
        result => {
          this.swal.showSwalSuccess('Parametro Faturamento reativado com sucesso!');
          this.router.navigate(['parametrofaturamento/lista']);
        },
        error => {
          error => this.errors;
        });
  }

  cancelar() {
    this.router.navigate(['parametrofaturamento/editar/' + this.parametroFaturamentoId]);
  }


}
