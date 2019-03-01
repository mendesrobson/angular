import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, Renderer, ViewChild } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContratoFaturamento, Cliente, TipoContrato, SituacaoContrato, EventoFaturamento, ParametroFaturamento } from '../models/contratofaturamento';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { ContratoFaturamentoService } from '../contratofaturamento.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MaskService } from '../../../services/mask.service';
import { UtilService } from '../../../services/util.service';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Lancamento } from '../../lancamento/models/lancamento';
import { Mascara } from '../../../cadastros/mascara/models/mascara';
import CustomStore from 'devextreme/data/custom_store';

@Component({
  selector: 'app-adicionar-contratofaturamento',
  templateUrl: './adicionar-contratofaturamento.component.html',
  providers: [MaskService],
  styleUrls: ['./adicionar-contratofaturamento.component.css']

})

export class AdicionarContratoFaturamentoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  @ViewChild('focusCodigo') focusCodigo: ElementRef;

  public maskValid: boolean;
  public mascSequencial: Mascara;

  public grupoEmpresaId: number;

  public contratoFaturamento: ContratoFaturamento
  public contratoFaturamentoForm: FormGroup;

  dropdownList = [];
  gridDataSource: any;
  _gridBoxValue: string = '';
  _gridSelectedRowKeys: string[];

  swal: SweetAlertAdviceService;
  mesAnoMask = this._maskService.MesAno();

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public clientes: Cliente[];
  public tipoContratos: TipoContrato[];
  public situacaoContratos: SituacaoContrato[];
  public eventoFaturamentos: EventoFaturamento[];
  public parametro: ParametroFaturamento;
  public lancamentoFaturamento: Lancamento;

  public errors: any[] = [];
  public codMask = [];

  selectDiaVencimento = [
    { id: '', value: '' },
    { id: '01', value: '01' },
    { id: '02', value: '02' },
    { id: '03', value: '03' },
    { id: '04', value: '04' },
    { id: '05', value: '05' },
    { id: '06', value: '06' },
    { id: '07', value: '07' },
    { id: '08', value: '08' },
    { id: '09', value: '09' },
    { id: '10', value: '10' },
    { id: '11', value: '11' },
    { id: '12', value: '12' },
    { id: '13', value: '13' },
    { id: '14', value: '14' },
    { id: '15', value: '15' },
    { id: '16', value: '16' },
    { id: '17', value: '17' },
    { id: '18', value: '18' },
    { id: '19', value: '19' },
    { id: '20', value: '20' },
    { id: '21', value: '21' },
    { id: '22', value: '22' },
    { id: '23', value: '23' },
    { id: '24', value: '24' },
    { id: '25', value: '25' },
    { id: '26', value: '26' },
    { id: '27', value: '27' },
    { id: '28', value: '28' },
    { id: '29', value: '29' },
    { id: '30', value: '30' },
    { id: '31', value: '31' }
  ];

  constructor(
    private contratoFaturamentoService: ContratoFaturamentoService,
    private fb: FormBuilder,
    private _maskService: MaskService,
    private _utilService: UtilService,
    private router: Router,
    private renderer: Renderer) {

    this.validationMessages = {
      grupoEmpresaId:
      {
        required: 'Grupo requerido.'
      },
      empresaId: {
        required: 'Empresa requerida.'
      },
      clienteId: {
        required: 'Cliente requerido.'
      },
      tipoContratoId: {
        required: 'Tipo Contrato requerido.'
      },
      situacaoContratoId: {
        required: 'Situa&ccedil&atildeo Contrato requerido.'
      },
      eventoFaturamentoId: {
        required: 'Evento Faturamento requerido.'
      },
      codigo: {
        required: 'Codigo requerido.'
      },
      // sigla: {
      //   required: 'Sigla requerida.'
      // },
      descricao: {
        required: 'Descri&ccedil&atildeo requerida.'
      },
      dataEmissao: {
        required: 'Data Emiss&atildeo requerida.'
      },
      mesAnoInicio: {
        required: 'M&ecircs Ano Inicio requerido.'
      },
      diaVencimento: {
        required: 'Dia Vencimento requerido.'
      },
      mesInicioFaturamento: {
        required: 'M&ecircs Inicio Faturamento requerido.'
      },
      // qtdeDiaVencimento: {
      //   required:'Valor Qde dia Vencimento requerido.'
      // },
      valorContrato: {
        required: 'Valor Contrato requerido.'
      },
      valorOriginal: {
        required: 'Valor Original requerido.'
      },
      dataTermino: {
        required: 'Data Termino requerida.'
      },
      percentual: {
        required: 'Percentual requerido.'
      },
      percentualCobrado: {
        required: 'Percentual Cobrado requerido.'
      },
      valor: {
        required: 'Valor requerido.'
      },
      iniciaEm: {
        required: 'Inicia Em requerido.'
      },
      valorAdicionalEmpregado: {
        required: 'Valor Adicional Empregado requerido.'
      },
    };

    this.maskValid = true;
    this.mascSequencial = new Mascara();
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.contratoFaturamento = new ContratoFaturamento();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.contratoFaturamentoForm = this.fb.group({
      guid: 0,
      id: 0,
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      clienteId: ['', [Validators.required]],
      tipoContratoId: ['', [Validators.required]],
      situacaoContratoId: ['', [Validators.required]],
      eventoFaturamentoId: ['', [Validators.required]],
      excluido: 'N',
      codigo: ['', [Validators.required]],
      // sigla: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      dataEmissao: ['', [Validators.required]],
      mesAnoInicio: ['', [Validators.required]],
      diaVencimento: ['', [Validators.required]],
      mesInicioFaturamento: ['', [Validators.required]],
      // qtdeDiaVencimento: [''],
      definirDataTermino: 'N',
      dataTermino: ['', [Validators.required]],
      valorContrato: ['', [Validators.required]],
      valorOriginal: ['', [Validators.required]],
      descontoAdimplencia: 'N',
      percentual: ['', [Validators.required]],
      cobrarAdicionalAnual: 'N',
      percentualValorContrato: 'N',
      percentualCobrado: ['', [Validators.required]],
      valorFixo: 'N',
      valor: ['', [Validators.required]],
      proporcionalDataInicio: 'N',
      valorUltimoFaturamento: 'N',
      faturarComContrato: 'N',
      iniciaEm: ['', [Validators.required]],
      //copiaContrato: '',
      //documentoVinculado: '',
      copiaContratoFile: '',
      documentoVinculadoFile: '',
      adicionalFuncionarios: 'N',
      numeroContratado: ['', [Validators.required]],
      valorAdicionalEmpregado: ['', [Validators.required]],
      dataAlteracao: null,
      dataCadastro: null,
      dataInativacao: null
    });

    this.contratoFaturamentoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        () => this.errors);

    this.contratoFaturamentoService.obterTodosTipoContrato()
      .subscribe(tipoContratos => {
        this.tipoContratos = tipoContratos
      },
        () => this.errors);

    this.contratoFaturamentoService.obterTodosSituacaoContrato()
      .subscribe(situacaoContratos => {
        this.situacaoContratos = situacaoContratos
      },
        () => this.errors);

  }


  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(this.contratoFaturamentoForm.valueChanges, ...controlBlurs).debounceTime(1000).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.contratoFaturamentoForm);
    });
  }

  async adicionarContratoFaturamento(): Promise<void> {

    if (this.contratoFaturamentoForm.dirty && this.contratoFaturamentoForm.valid) {
      let p = Object.assign({}, this.contratoFaturamento, this.contratoFaturamentoForm.value);

      if (this.mascSequencial == null) {
        this.mascSequencial = new Mascara();
        this.mascSequencial.sequencial = 'N';
      }

      if (this.mascSequencial.sequencial === 'S') {
        //#region  add
        let evento;
        for (let i = 0; this.eventoFaturamentos.length > i; i++) {
          if (p.eventoFaturamentoId == this.eventoFaturamentos[i].id) {
            evento = this.eventoFaturamentos[i];
          }
        }

        this.contratoFaturamentoService.obterParametroPorEmpresaId(evento.empresaId)
          .subscribe(parametro => {
            this.parametro = parametro
          },() => {});

        this.lancamentoFaturamento = new Lancamento();
        this.lancamentoFaturamento.fixo = "S";
        this.lancamentoFaturamento.codigo = p.codigo;
        this.lancamentoFaturamento.descricao = p.descricao;
        this.lancamentoFaturamento.faturarContrato = p.faturarContrato;
        this.lancamentoFaturamento.dataLancamento = p.dataEmissao;
        this.lancamentoFaturamento.dataEncerramento = p.dataTermino;
        this.lancamentoFaturamento.quantidade = p.quantidade;
        this.lancamentoFaturamento.percentual = p.percentual;
        this.lancamentoFaturamento.valorUnitario = p.valorContrato;
        this.lancamentoFaturamento.valorTotal = p.valorContrato;
        this.lancamentoFaturamento.geradoPeloContrato = "S";
        this.lancamentoFaturamento.faturarContrato = "S";
        this.lancamentoFaturamento.excluido = "N";
        this.lancamentoFaturamento.grupoEmpresaId = p.grupoEmpresaId;
        this.lancamentoFaturamento.empresaId = p.empresaId;
        this.lancamentoFaturamento.clienteId = p.clienteId;
        this.lancamentoFaturamento.eventoFaturamentoId = p.eventoFaturamentoId;
        this.lancamentoFaturamento.faturamentoId = p.faturamentoId;
        this.lancamentoFaturamento.lancamentoPaiId = null;
        this.lancamentoFaturamento.diaVencimento = p.diaVencimento;
        this.lancamentoFaturamento.aliquotaIRRF = evento.aliquotaIRRF;
        this.lancamentoFaturamento.aliquotaISS = evento.aliquotaISS;
        if (this.parametro != null) {
          this.lancamentoFaturamento.aliquotaPIS = this.parametro.aliquotaPIS;
          this.lancamentoFaturamento.aliquotaCSLL = this.parametro.aliquotaCSLL;
          this.lancamentoFaturamento.aliquotaCOFINS = this.parametro.aliquotaCOFINS;
          this.lancamentoFaturamento.aliquotaCRF = this.parametro.aliquotaCRF;
        }

        this.contratoFaturamentoService.adicionarContratoFaturamento(p)
          .subscribe(
            result => {
              this.lancamentoFaturamento.contratoFaturamentoId = result.id.toString();
              this.contratoFaturamentoService.adicionarLancamento(this.lancamentoFaturamento)
                .subscribe(
                  result => {
                    this.swal.showSwalSuccess('Contrato Faturamento adicionada com Sucesso!');
                    this.router.navigate(['contratofaturamento/lista']);
                  },
                  error => {
                    this.onError(error)
                  })
            },
            (error) => {
              this.onError(error)
            });
        //#endregion
      }
      else {

        let codigo: string = p.codigo.replace(/\//g, 'barrad').replace(/\\/g, 'barrae');
        let contratoFaturamento = await this.contratoFaturamentoService.ObterContratoFaturamentoPorCodigo(codigo).toPromise();

        if (contratoFaturamento != null) {
          var self = this;
          this.swal.showSwalErrorCodigo('Informe um código que não esteja cadastrado!', function (isConfirmed) {
            if (isConfirmed) {
              self.limparCampoCodigo();
            }
            else {

            }
          });
        }
        else {
          //#region  add

          let evento;
          for (let i = 0; this.eventoFaturamentos.length > i; i++) {
            if (p.eventoFaturamentoId == this.eventoFaturamentos[i].id) {
              evento = this.eventoFaturamentos[i];
            }
          }

          this.contratoFaturamentoService.obterParametroPorEmpresaId(evento.empresaId)
            .subscribe(parametro => {
              this.parametro = parametro
            },
              error => this.errors);

          this.lancamentoFaturamento = new Lancamento();
          this.lancamentoFaturamento.fixo = "S";
          this.lancamentoFaturamento.codigo = p.codigo;
          this.lancamentoFaturamento.descricao = p.descricao;
          this.lancamentoFaturamento.faturarContrato = p.faturarContrato;
          this.lancamentoFaturamento.dataLancamento = p.dataEmissao;
          this.lancamentoFaturamento.dataEncerramento = p.dataTermino;
          this.lancamentoFaturamento.quantidade = p.quantidade;
          this.lancamentoFaturamento.percentual = p.percentual;
          this.lancamentoFaturamento.valorUnitario = p.valorContrato;
          this.lancamentoFaturamento.valorTotal = p.valorContrato;
          this.lancamentoFaturamento.geradoPeloContrato = "S";
          this.lancamentoFaturamento.faturarContrato = "S";
          this.lancamentoFaturamento.excluido = "N";
          this.lancamentoFaturamento.grupoEmpresaId = p.grupoEmpresaId;
          this.lancamentoFaturamento.empresaId = p.empresaId;
          this.lancamentoFaturamento.clienteId = p.clienteId;
          this.lancamentoFaturamento.eventoFaturamentoId = p.eventoFaturamentoId;
          this.lancamentoFaturamento.faturamentoId = p.faturamentoId;
          this.lancamentoFaturamento.lancamentoPaiId = null;
          this.lancamentoFaturamento.diaVencimento = p.diaVencimento;
          this.lancamentoFaturamento.aliquotaIRRF = evento.aliquotaIRRF;
          this.lancamentoFaturamento.aliquotaISS = evento.aliquotaISS;
          if (this.parametro != null) {
            this.lancamentoFaturamento.aliquotaPIS = this.parametro.aliquotaPIS;
            this.lancamentoFaturamento.aliquotaCSLL = this.parametro.aliquotaCSLL;
            this.lancamentoFaturamento.aliquotaCOFINS = this.parametro.aliquotaCOFINS;
            this.lancamentoFaturamento.aliquotaCRF = this.parametro.aliquotaCRF;
          }

          this.contratoFaturamentoService.adicionarContratoFaturamento(p)
            .subscribe(
              result => {
                this.lancamentoFaturamento.contratoFaturamentoId = result.id.toString();
                this.contratoFaturamentoService.adicionarLancamento(this.lancamentoFaturamento)
                  .subscribe(
                    result => {
                      this.swal.showSwalSuccess('Contrato Faturamento adicionada com Sucesso!');
                      this.router.navigate(['contratofaturamento/lista']);
                    },
                    error => {
                      this.onError(error)
                    })
              },
              (error) => {
                this.onError(error)
              });

          //#endregion
        }

      }
    }
  }

  adicionarCopiaContrato(event) {
    this.contratoFaturamento.copiaContrato = event.srcElement.files[0].name;
    this.contratoFaturamentoForm.patchValue({
      copiaContratoFile: this.contratoFaturamento.copiaContrato
    });
    this._utilService.ConverterArquivoParaString(event, (result) => this.arquivoStringCC(result));
  }

  adicionarDocumentoVinculado(event) {
    this.contratoFaturamento.documentoVinculado = event.srcElement.files[0].name;
    this.contratoFaturamentoForm.patchValue({
      documentoVinculadoFile: this.contratoFaturamento.documentoVinculado
    });
    this._utilService.ConverterArquivoParaString(event, (result) => this.arquivoStringDV(result));
  }

  arquivoStringDV(result) {
    this.contratoFaturamento.arquivoDocumentoVinculado = result;
  }

  arquivoStringCC(result) {
    this.contratoFaturamento.arquivoCopiaContrato = result;
  }

  visualizarCopiaContrato(arquivo) {
    if (arquivo != "" && arquivo != null) {
      this._utilService.VisualizarArquivo(arquivo, "PDF");
    }
  }

  visualizarDocumentoVinculado(arquivo) {
    if (arquivo != "" && arquivo != null) {
      this._utilService.VisualizarArquivo(arquivo, "PDF");
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['contratofaturamento/lista']);
  }

  limparCampoCodigo() {
    this.contratoFaturamentoForm.controls['codigo'].setValue('');
    this.renderer.selectRootElement(this.focusCodigo['nativeElement']).focus();
  }

  async ConsultaEmpresa(idGrupo): Promise<void> {

    this.grupoEmpresaId = idGrupo;
    this.mascSequencial = await this._maskService.VerificaCodSequencialGrupo(1, 'ContratoFaturamento', this.grupoEmpresaId);

    if (this.mascSequencial != null) {
      if (this.mascSequencial.sequencial === "S") {
        this.contratoFaturamentoForm.controls['codigo'].setValue('');
        this.maskValid = false;
      }
      else {
        this.contratoFaturamentoForm.controls['codigo'].setValue('');
        this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
        this.maskValid = true;
      }

    }
    else {
      this.contratoFaturamentoForm.controls['codigo'].setValue('');
      this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
      this.maskValid = true;
    }

    this.empresas = [];
    this.contratoFaturamentoService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

  async ConsultaClienteAndEvento(idEmpresa): Promise<void> {

    this.mascSequencial = await this._maskService.VerificaCodSequencialGrupoEmpresa(1, 'ContratoFaturamento', this.grupoEmpresaId, idEmpresa);

    if (this.mascSequencial != null) {
      if (this.mascSequencial.sequencial === 'S') {
        this.contratoFaturamentoForm.controls['codigo'].setValue('');
        this.maskValid = false;
      }
      else {
        this.contratoFaturamentoForm.controls['codigo'].setValue('');
        this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
        this.maskValid = true;
      }
    }
    else {
      this.contratoFaturamentoForm.controls['codigo'].setValue('');
      this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
      this.maskValid = true;

    }
    
    this.contratoFaturamentoService.obterTodosClientePorEmpresa(idEmpresa)
      .subscribe(f => {
        this.clientes = f;
        this.clientes.forEach(el => {
          this.dropdownList.push({ id: el.id, codigo: el.pessoa.codigo, cliente: el.pessoa.nome });
        });

        this.gridDataSource = this.makeAsyncDataSource(this.dropdownList);

      }, () => { });

    this.eventoFaturamentos = [];
    this.contratoFaturamentoService.obterEventoFaturamentoPorEmpresa(idEmpresa)
      .subscribe(eventoFaturamentos => {
        this.eventoFaturamentos = eventoFaturamentos
      },
        error => this.errors);
  }
  makeAsyncDataSource(clientes) {
    return new CustomStore({
      loadMode: "raw",
      key: "id",
      load: function () {
        return clientes;
      }
    });
  }

  get gridBoxValue(): string {
    return this._gridBoxValue;
  }

  set gridBoxValue(value: string) {
    this._gridBoxValue = value || '';
  }

  get gridSelectedRowKeys(): string[] {
    return this._gridSelectedRowKeys;
  }

  set gridSelectedRowKeys(value: string[]) {
    this._gridBoxValue = value.length && value[0] || null;
    this._gridSelectedRowKeys = value;
  }

}
