import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { EventoFaturamento, HistoricoPadrao, ParametroFaturamento, TipoMesVencimento, TipoVencimento, UnidadeEvento } from '../models/eventofaturamento';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { EventoFaturamentoService } from '../eventofaturamento.service';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Empresa, GrupoEmpresa } from '../../../cadastros/empresa/models/empresa';

@Component({
  selector: 'app-editar-eventofaturamento',
  templateUrl: './editar-eventofaturamento.component.html',
  styleUrls: []
})
export class EditarEventoFaturamentoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public removerVisivel: boolean = false;
  public reativarVisivel: boolean = false;

  public eventoFaturamento: EventoFaturamento;
  public parametroFaturamento: ParametroFaturamento;
  public eventoFaturamentoForm: FormGroup;
  public eventoFaturamentoId: string = "";
  public empresaId: string = "";

  displayMessage: { [key: string]: string } = {};

  empresas: Empresa[];
  grupoEmpresas: GrupoEmpresa[];
  public historicoPadrao: HistoricoPadrao[];
  public tipoMesVencimento: TipoMesVencimento[];
  public tipoVencimento: TipoVencimento[];
  public unidadeEvento: UnidadeEvento[];

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  swal: SweetAlertAdviceService;

  private result = {};
  public errors: any[] = [];

  constructor(
    private eventoFaturamentoService: EventoFaturamentoService,
    private fb: FormBuilder,
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
      codigo: {
        required: 'Codigo requerido.'
      },
      descricao: {
        required: 'Descricao requerido.'
      },
      historicoPadraoId: {
        required: 'Histórico Padrão requerido.'
      },
      diaVencimento: {
        required: 'Dia Vencimento requerido.'
      },
      mesVencimento: {
        required: 'Mês Vencimento requerido.'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.eventoFaturamento = new EventoFaturamento();
    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit() {

    this.eventoFaturamentoForm = this.fb.group({
      guid: 0,
      id: 0,
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      unidade: '',
      valorReferencia: 0,
      historicoPadraoId: ['', [Validators.required]],
      irrf: 'N',
      aliquotaIRRF: 0,
      iss: 'N',
      aliquotaISS: 0,
      retencaoFonte: 'N',
      aliquotaRetencaoFonte: 0,
      inssRetido: 'N',
      aliquotaINSSRetido: 0,
      issRetido: 'N',
      aliquotaISSRetido: 0,
      // lancamentoMensal: 'N',
      faturarContrato: 'N',
      vencimento: '',
      diaVencimento: 0,
      mesVencimento: '',
      excluido: 'N',
      diaVencimentoContrato: 'N',
      valorContrato: 'N',
      dataAlteracao: null,
      dataCadastro: null,
      dataInativacao: null
    });

    //this.parametroFaturamento = { crf: null, pis: null, cofins: null, csll: null, aliquotaRetencaoFonte: 0 };

    this.sub = this.route.params.subscribe(
      params => {
        this.eventoFaturamentoId = params['id'];
        this.obterEventoFaturamento(this.eventoFaturamentoId);
      });

    this.eventoFaturamentoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);

        this.eventoFaturamentoService.obterTodosHistoricoPadrao()
        .subscribe(historicoPadrao => {
          this.historicoPadrao = historicoPadrao
          console.log("this.historicoPadrao: ");
          console.log(this.historicoPadrao);
        },
          () => this.errors);

    // this.eventoFaturamentoService.getUnidadeEvento()
    //   .subscribe(unidadeEvento => {
    //     this.unidadeEvento = unidadeEvento

    //   },
    //     error => this.errors);
    this.unidadeEvento = [{
      "id": "",
      "valor": ""
    },
    {
      "id": "VLR",
      "valor": "Valor"
    },
    {
      "id": "QTD",
      "valor": "Quantidade"
    },
    {
      "id": "PRC",
      "valor": "Percentual"
    }];

    // this.eventoFaturamentoService.getTipoMesVencimento()
    // .subscribe(tipoMesVencimento => {
    //   this.tipoMesVencimento = tipoMesVencimento

    // },
    // error => this.errors);
    this.tipoMesVencimento = [
      {
        "id": "",
        "valor": ""
      },
      {
        "id": "MSM",
        "valor": "No mesmo"
      },
      {
        "id": "APO",
        "valor": "Após"
      },
      {
        "id": "SEG",
        "valor": "No segundo"
      }
    ];

    // this.eventoFaturamentoService.getTipoVencimento()
    // .subscribe(tipoVencimento => {
    //   this.tipoVencimento = tipoVencimento

    // },
    // error => this.errors);
    this.tipoVencimento = [{
      "id": "",
      "valor": ""
    },
    {
      "id": "FX",
      "valor": "Fixo"
    },
    {
      "id": "CNT",
      "valor": "Conforme Contrato"
    }];
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.eventoFaturamentoForm);
    });
  }

  obterEventoFaturamento(id: string) {
    this.eventoFaturamentoService.obterEventoFaturamento(id)
      .subscribe(
        categoriaContaPagar => this.preencherEventoFaturamentoForm(categoriaContaPagar),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
  }

  preencherEventoFaturamentoForm(eventoFaturamento: EventoFaturamento): void {

    this.eventoFaturamento = eventoFaturamento;
    this.reativarVisivel = this.eventoFaturamento.excluido === 'S';
    this.removerVisivel = this.eventoFaturamento.excluido === 'N';

    this.eventoFaturamentoForm.controls['codigo'].disable();

    this.eventoFaturamentoForm.patchValue({
      id: this.eventoFaturamento.id,
      grupoEmpresaId: this.eventoFaturamento.grupoEmpresaId,
      empresaId: this.eventoFaturamento.empresaId,
      codigo: this.eventoFaturamento.codigo,
      descricao: this.eventoFaturamento.descricao,
      unidade: this.eventoFaturamento.unidade,
      valorReferencia: this.eventoFaturamento.valorReferencia,
      historicoPadraoId: this.eventoFaturamento.historicoPadraoId,
      irrf: this.eventoFaturamento.irrf,
      aliquotaIRRF: this.eventoFaturamento.aliquotaIRRF,
      iss: this.eventoFaturamento.iss,
      aliquotaISS: this.eventoFaturamento.aliquotaISS,
      retencaoFonte: this.eventoFaturamento.retencaoFonte,
      aliquotaRetencaoFonte: this.eventoFaturamento.aliquotaRetencaoFonte,
      inssRetido: this.eventoFaturamento.inssRetido,
      aliquotaINSSRetido: this.eventoFaturamento.aliquotaINSSRetido,
      issRetido: this.eventoFaturamento.issRetido,
      aliquotaISSRetido: this.eventoFaturamento.aliquotaISSRetido,
      // lancamentoMensal: this.eventoFaturamento.lancamentoMensal,
      faturarContrato: this.eventoFaturamento.faturarContrato,
      vencimento: this.eventoFaturamento.vencimento,
      diaVencimentoContrato: this.eventoFaturamento.diaVencimentoContrato,
      diaVencimento: this.eventoFaturamento.diaVencimento,
      mesVencimento: this.eventoFaturamento.mesVencimento,
      valorContrato: this.eventoFaturamento.valorContrato
    });
    this.eventoFaturamentoForm.controls['grupoEmpresaId'].disable();
    this.eventoFaturamentoForm.controls['empresaId'].disable();
  }

  editarEventoFaturamento() {
    if (this.eventoFaturamentoForm.dirty && this.eventoFaturamentoForm.valid) {
      let p = Object.assign({}, this.eventoFaturamento, this.eventoFaturamentoForm.value);

      this.eventoFaturamentoService.atualizarEventoFaturamento(p)
        .subscribe(
          result => {
            this.swal.showSwalSuccess('Evento atualizado com sucesso');
            this.router.navigate(['eventofaturamento/lista']);
          },
          error => {
            this.errors;
          })
    }
  }

  cancelar() {
    this.router.navigate(['eventofaturamento/lista']);
  }

  remover(id) {
    this.router.navigate(['eventofaturamento/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['eventofaturamento/reativar/' + id]);
  }

  habilitarAliquotaRetencao(event) {
    if (this.eventoFaturamento.retencaoFonte == 'S') {
      if (this.parametroFaturamento != null){
        if (this.parametroFaturamento.aliquotaRetencaoFonte != null){
          this.eventoFaturamento.aliquotaRetencaoFonte = this.parametroFaturamento.aliquotaRetencaoFonte;
        }
      }
    } else {
      this.eventoFaturamentoForm.controls['aliquotaRetencaoFonte'].reset();
    }
  }


  selecionarParametroEmpresa(id) {
    if (this.eventoFaturamentoForm.controls['irrf'].value == 'S'){
      this.eventoFaturamentoForm.controls['irrf'].patchValue('N');
      this.eventoFaturamentoForm.controls['aliquotaIRRF'].clearValidators();
    }
    if (this.eventoFaturamentoForm.controls['iss'].value == 'S'){
      this.eventoFaturamentoForm.controls['iss'].patchValue('N');
      this.eventoFaturamentoForm.controls['aliquotaISS'].clearValidators();
    }
    if (this.eventoFaturamentoForm.controls['retencaoFonte'].value == 'S'){
      this.eventoFaturamentoForm.controls['retencaoFonte'].patchValue('N');
      this.eventoFaturamentoForm.controls['aliquotaRetencaoFonte'].clearValidators();
    }
    if (this.eventoFaturamentoForm.controls['inssRetido'].value == 'S'){
      this.eventoFaturamentoForm.controls['inssRetido'].patchValue('N');
      this.eventoFaturamentoForm.controls['aliquotaINSSRetido'].clearValidators();
    }
    if (this.eventoFaturamentoForm.controls['issRetido'].value == 'S'){
      this.eventoFaturamentoForm.controls['issRetido'].patchValue('N');
      this.eventoFaturamentoForm.controls['aliquotaISSRetido'].clearValidators();
    }

    this.eventoFaturamentoService.obterParametroPorEmpresaId(id)
      .subscribe(parametroFaturamento => {
        this.parametroFaturamento = parametroFaturamento        
        console.log(this.parametroFaturamento);

        if (this.parametroFaturamento != null){

          if (this.parametroFaturamento.aliquotaISS != null){
            this.eventoFaturamentoForm.controls['iss'].patchValue(this.parametroFaturamento.iss);
            this.eventoFaturamentoForm.controls['aliquotaISS'].patchValue(this.parametroFaturamento.aliquotaISS);
            this.eventoFaturamentoForm.controls['issRetido'].patchValue(this.parametroFaturamento.iss);
            this.eventoFaturamentoForm.controls['aliquotaISSRetido'].patchValue(this.parametroFaturamento.aliquotaISS);
          }

          if (this.parametroFaturamento.aliquotaRetencaoFonte != null){
            this.eventoFaturamentoForm.controls['irrf'].patchValue('S');
            this.eventoFaturamentoForm.controls['aliquotaIRRF'].patchValue(this.parametroFaturamento.aliquotaRetencaoFonte);
            this.eventoFaturamentoForm.controls['retencaoFonte'].patchValue("S");
            this.eventoFaturamentoForm.controls['aliquotaRetencaoFonte'].patchValue(this.parametroFaturamento.aliquotaRetencaoFonte);
          }

          if (this.parametroFaturamento.aliquotaINSS != null){
            this.eventoFaturamentoForm.controls['inssRetido'].patchValue(this.parametroFaturamento.inss);
            this.eventoFaturamentoForm.controls['aliquotaINSSRetido'].patchValue(this.parametroFaturamento.aliquotaINSS);
          }

        }

      },
        () => this.errors);
  }

  ConsultaEmpresa(idGrupo) {
    this.eventoFaturamentoService.obterTodosEmpresaGrupo(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

}
