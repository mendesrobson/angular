import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MaskService } from '../../../services/mask.service';
import { Subscription } from 'rxjs';
import { UtilService } from '../../../services/util.service';
import { ParametroFaturamento, ConfiguracaoPagamento, ContaCorrente } from '../../parametrofaturamento/models/parametrofaturamento';
import { ParametroFaturamentoService } from '../parametrofaturamento.service';
import { Empresa, GrupoEmpresa } from '../../../cadastros/empresa/models/empresa';
//import { THIS_EXPR } from '../../../../../node_modules/@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-editar-parametrofaturamento',
  templateUrl: './editar-parametrofaturamento.component.html',
  providers: [MaskService],
  styleUrls: []

})

export class EditarParametroFaturamentoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public removerVisivel: boolean = false;
  public reativarVisivel: boolean = false;

  public parametroFaturamento: ParametroFaturamento;
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
      aliquotaCRF: {
        required: 'Alíquota CRF requerido.'
      },
      aliquotaPIS: {
        required: 'Alíquota PIS requerido.'
      },
      aliquotaCOFINS: {
        required: 'Alíquota COFINS requerido.'
      },
      aliquotaCSLL: {
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

  }


  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.parametroFaturamentoForm);
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

    this.reativarVisivel = this.parametroFaturamento.excluido === 'S';
    this.removerVisivel = this.parametroFaturamento.excluido === 'N';

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

  editarParametroFaturamento() {
    if (this.parametroFaturamentoForm.dirty && this.parametroFaturamentoForm.valid) {
      let p = Object.assign({}, this.parametroFaturamento, this.parametroFaturamentoForm.getRawValue());

      console.log("PARAMETRO: ");
      console.log(p);

      this.parametroFaturamentoService.atualizarParametroFaturamento(p)
        .subscribe(
          result => {
            this.swal.showSwalSuccess('Parametro Faturamento atualizado com Sucesso!');
            this.router.navigate(['parametrofaturamento/lista']);
          },
          error => {
            this.onError(error)
          })
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['parametrofaturamento/lista']);
  }

  remover(id) {
    this.router.navigate(['parametrofaturamento/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['parametrofaturamento/reativar/' + id]);
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.parametroFaturamentoService.obterTodosEmpresaPorGrupo(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

  ConsultaSelectEmpresa(idEmpresa) {   
    this.configuracaoPagamentos = [];
    this.parametroFaturamentoService.obterTodosConfiguracaoPagamentoPorEmpresa(idEmpresa)
      .subscribe(configuracaoPagamentos => {
        this.configuracaoPagamentos = configuracaoPagamentos
      },
        error => this.errors);

    this.contaCorrentes = [];
    this.parametroFaturamentoService.obterTodosContaCorrentePorEmpresa(idEmpresa)
      .subscribe(contaCorrentes => {
        this.contaCorrentes = contaCorrentes
      },
        error => this.errors);
  }

}


