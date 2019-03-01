import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EventoFaturamentoService } from '../eventofaturamento.service';
import { Subscription } from 'rxjs';
import { EventoFaturamento, HistoricoPadrao, ParametroFaturamento, TipoMesVencimento, TipoVencimento, UnidadeEvento } from '../models/eventofaturamento';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { FormGroup, FormBuilder, FormControlName } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Empresa, GrupoEmpresa } from '../../../cadastros/empresa/models/empresa';


@Component({
  selector: 'app-excluir-eventofaturamento',
  templateUrl: './excluir-eventofaturamento.component.html',
  styleUrls: []
})
export class ExcluirEventoFaturamentoComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public removerVisivel: boolean = false;
  public reativarVisivel: boolean = false;

  public eventoFaturamento: EventoFaturamento;
  public parametroFaturamento: ParametroFaturamento;
  public eventoFaturamentoForm: FormGroup;
  public eventoFaturamentoId: string = "";

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

    this.swal = new SweetAlertAdviceService();
    this.eventoFaturamento = new EventoFaturamento();

  }

  ngOnInit() {

    this.eventoFaturamentoForm = this.fb.group({
      guid: 0,
      id: 0,
      grupoEmpresaId: '',
      empresaId: '',
      codigo: '', 
      descricao: '',
      unidade: '',
      valorReferencia: 0,
      historicoPadraoId: '', 
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
      },
        () => this.errors);

    // this.eventoFaturamentoService.getUnidadeEvento()
    // .subscribe(unidadeEvento => {
    //   this.unidadeEvento = unidadeEvento

    // },
    // error => this.errors);
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
  }

  ngAfterViewInit(): void {

    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerEventoFaturamento();
      }
      else {
        self.cancelar();
      }
    });
  }

  obterEventoFaturamento(id: string) {
    this.eventoFaturamentoService.obterEventoFaturamento(id)
      .subscribe(
        eventoFaturamento => this.preencherEventoFaturamentoForm(eventoFaturamento),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
  }

  preencherEventoFaturamentoForm(eventoFaturamento: EventoFaturamento): void {
    this.eventoFaturamento = eventoFaturamento;

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
      //lancamentoMensal: this.eventoFaturamento.lancamentoMensal,
      faturarContrato: this.eventoFaturamento.faturarContrato,
      vencimento: this.eventoFaturamento.vencimento,
      diaVencimentoContrato: this.eventoFaturamento.diaVencimentoContrato,
      diaVencimento: this.eventoFaturamento.diaVencimento,
      mesVencimento: this.eventoFaturamento.mesVencimento,
      valorContrato: this.eventoFaturamento.valorContrato
    });
  }

  removerEventoFaturamento() {
    this.eventoFaturamentoService.removerEventoFaturamento(this.eventoFaturamento)
      .subscribe(
        result => {
          this.swal.showSwalSuccess('Evento removido com sucesso!');
          this.router.navigate(['eventofaturamento/lista']);
        },
        error => {
          error => this.errors;
        });
  }

  cancelar() {
    this.router.navigate(['eventofaturamento/editar/' + this.eventoFaturamentoId]);
  }

  ConsultaEmpresa(idGrupo) {
    this.eventoFaturamentoService.obterTodosEmpresaGrupo(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

}
