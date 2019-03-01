import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, ViewContainerRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MaskService } from '../../../services/mask.service';
import { UtilService } from '../../../services/util.service';
import { ParametroFaturamentoService } from '../parametrofaturamento.service';
import { ParametroFaturamento, ConfiguracaoPagamento, ContaCorrente } from '../../parametrofaturamento/models/parametrofaturamento';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-adicionar-parametrofaturamento',
  templateUrl: './adicionar-parametrofaturamento.component.html',
  providers: [MaskService],
  styleUrls: []

})

export class AdicionarParametroFaturamentoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public parametroFaturamento: ParametroFaturamento;
  private parametroFaturamentos: ParametroFaturamento[];
  public parametroFaturamentoForm: FormGroup;

  swal: SweetAlertAdviceService;
  mesAnoMask = this._maskService.MesAno();

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public configuracaoPagamentos: ConfiguracaoPagamento[];
  public contaCorrentes: ContaCorrente[];

  public errors: any[] = [];

  constructor(
    private parametroFaturamentoService: ParametroFaturamentoService,
    private fb: FormBuilder, public toastr: ToastsManager,
    private _maskService: MaskService, vcr: ViewContainerRef,
    private _utilService: UtilService,
    private router: Router) {

    this.toastr.setRootViewContainerRef(vcr);

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
      quantidadeParcelasEmAberto: '',// ['', [Validators.required]],     
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
      aliquotaRetencaoFonte: '',
      inss: 'N',
      aliquotaINSS: '',
      iss: 'N',
      aliquotaISS: '',
      configuracaoPagamentoId: '',
      contaCorrenteId: '',
      valorMinimoIRRF: '',
      valorMinimoCRF: '',
      excluido: 'N'
    });

    this.parametroFaturamentoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);

    this.parametroFaturamentoService.obterTodosParametroFaturamento()
      .subscribe(paramentros => {
        this.parametroFaturamentos = paramentros;
      });
  }


  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.parametroFaturamentoForm);
    });
  }

  adicionarParametroFaturamento() {
    if (this.parametroFaturamentoForm.dirty && this.parametroFaturamentoForm.valid) {
      let p = Object.assign({}, this.parametroFaturamento, this.parametroFaturamentoForm.getRawValue());

      let isValid = false;

      for (var i = 0; this.parametroFaturamentos.length > i; i++) {
        if (this.parametroFaturamentos[i].empresaId == p.empresaId) {
          isValid = true;
          break;
        }
        else
          isValid = false;
      }

      if (!isValid) {
        this.parametroFaturamentoService.adicionarParametroFaturamento(p)
          .subscribe(
            () => {
              this.swal.showSwalSuccess('Parametro Faturamento adicionada com Sucesso!');
              this.router.navigate(['parametrofaturamento/lista']);
            },
            (erro) => { console.log(erro); });
      } else {
        this.toastr.error("Parâmetro para esta empresa já existe.", "Ops!");
      }
    }
  }


  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['parametrofaturamento/lista']);
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
