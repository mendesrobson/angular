import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren } from '@angular/core';
import { LancamentoService } from '../lancamento.service';
import { FormBuilder, FormGroup, Validators, FormControlName } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Lancamento, Cliente, Evento, Contrato, ParametroFaturamento } from '../models/lancamento';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { DateUtils } from '../../../utils/date.utils';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { UtilService } from '../../../services/util.service';
import { Empresa, GrupoEmpresa } from '../../../cadastros/empresa/models/empresa';

@Component({
  selector: 'app-editar-lancamento',
  templateUrl: './editar-lancamento.component.html',
  styleUrls: []
})
export class EditarLancamentoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public errors: any[] = [];
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public lancamento: Lancamento;
  public lancamentoForm: FormGroup;

  public sub: Subscription;
  swal: SweetAlertAdviceService;
  public myDatePickerOptions = DateUtils.getMyDatePickerOptions();

  public removerVisivel: boolean = false;
  public reativarVisivel: boolean = false;

  public lancamentoId: string = "";

  clientes: Cliente[];
  empresas: Empresa[];
  grupoEmpresas: GrupoEmpresa[];
  eventos: Evento[];
  contratos: Contrato[];
  parametro: ParametroFaturamento;

  constructor(
    private lancamentoService: LancamentoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private _utilService: UtilService) {

    this.validationMessages = {
      codigo: {
        required: 'O Código é requerido',
        minlength: 'O Código precisa ter no mínimo 2 caracteres',
        maxlength: 'O Código precisa ter no máximo 20 caracteres'
      },
      descricao: {
        required: 'A Descrição é requerida',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      },
      empresaId: {
        required: 'Informe a Empresa'
      },
      grupoEmpresaId: {
        required: 'Informe o Grupo'
      },
      quantidade: {
        required: 'A Quantidade é requerida',
        min: 'A Quantidade deve ser maior que 1'
      },
      valorUnitario: {
        required: 'Valor Unitário é requirido',
        min: 'Valor Unitário deve ser maior que 0'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.lancamento = new Lancamento();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.lancamentoForm = this.fb.group({
      codigo: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      clienteId: ['', [Validators.required]],
      eventoFaturamentoId: ['', [Validators.required]],
      fixo: 'N',
      faturarContrato: 'N',
      geradoPeloContrato: [{ value: 'N', disabled: true }],
      contratoFaturamentoId: ['', [Validators.required]],
      dataLancamento: DateUtils.setMyDatePickerDate(Date.now()),
      dataVencimento: ['', [Validators.required]],
      dataEncerramento: '',
      quantidade: [1, [Validators.required,
      Validators.min(1)]],
      percentual: '',
      valorUnitario: ['', [Validators.required,
      Validators.min(1)]],
      valorTotal: [{ value: '', disabled: true }, [Validators.required]],
      empresaId: ['', [Validators.required]],
      grupoEmpresaId: ['', [Validators.required]],
      diaVencimento: 0,
      aliquotaIRRF: 0,
      aliquotaISS: 0,
      aliquotaPIS: 0,
      aliquotaCOFINS: 0,
      aliquotaCSLL: 0,
      aliquotaCRF: 0
    });

    this.lancamentoForm.get('aliquotaIRRF').disable();
    this.lancamentoForm.get('aliquotaISS').disable();
    this.lancamentoForm.get('aliquotaPIS').disable();
    this.lancamentoForm.get('aliquotaCOFINS').disable();
    this.lancamentoForm.get('aliquotaCSLL').disable();
    this.lancamentoForm.get('aliquotaCRF').disable();

    this.sub = this.route.params.subscribe(
      params => {
        this.lancamentoId = params['id'];
        this.obterLancamento(this.lancamentoId);
      });

    this.lancamentoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);

    this.lancamentoService.obterTodosContrato()
      .subscribe(contratos => {
        this.contratos = contratos
      },
        error => this.errors);

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.lancamentoForm);
    });
  }

  obterLancamento(id: string) {
    this.lancamentoService.obterLancamentoPorId(id)
      .subscribe(
        Lancamento => this.preencherLancamentoForm(Lancamento),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
  }

  preencherLancamentoForm(lancamento: Lancamento): void {
    this.lancamento = lancamento;

    this.lancamentoForm.controls['codigo'].disable();

    this.reativarVisivel = this.lancamento.excluido === 'S';
    this.removerVisivel = this.lancamento.excluido === 'N' && this.lancamento.faturamentoId === null;
    this.lancamento.fixo = lancamento.fixo;
    this.lancamento.faturarContrato = lancamento.faturarContrato;
    if (this.lancamento.faturarContrato == 'S')
      this.habilitarDesabilitarContrato(true)
    else
      this.habilitarDesabilitarContrato(false)
    this.lancamento.geradoPeloContrato = lancamento.geradoPeloContrato;
    let dataEncerramento;
    let dataVencimento;

    if (this.lancamento.dataEncerramento == null)
      dataEncerramento = ''
    else
      dataEncerramento = DateUtils.setMyDatePickerDate(this.lancamento.dataEncerramento);

    if (this.lancamento.dataVencimento == null)
      dataVencimento = ''
    else
      dataVencimento = DateUtils.setMyDatePickerDate(this.lancamento.dataVencimento);

    this.lancamentoForm.patchValue({
      id: lancamento.id,
      codigo: lancamento.codigo,
      descricao: lancamento.descricao,
      clienteId: lancamento.clienteId,
      eventoFaturamentoId: lancamento.eventoFaturamentoId,
      // fixo: lancamento.fixo,
      // faturarContrato: lancamento.faturarContrato,
      //  geradoPeloContrato: lancamento.geradoPeloContrato,
      contratoFaturamentoId: lancamento.contratoFaturamentoId,
      dataLancamento: DateUtils.setMyDatePickerDate(this._utilService.ToDate(lancamento.dataLancamento)),
      dataVencimento: dataVencimento,
      dataEncerramento: dataEncerramento,
      quantidade: lancamento.quantidade,
      percentual: lancamento.percentual,
      valorUnitario: lancamento.valorUnitario,
      valorTotal: lancamento.valorTotal,
      empresaId: lancamento.empresaId,
      grupoEmpresaId: lancamento.grupoEmpresaId,
      diaVencimento: lancamento.diaVencimento,
      aliquotaIRRF: lancamento.aliquotaIRRF,
      aliquotaISS: lancamento.aliquotaISS,
      aliquotaPIS: lancamento.aliquotaPIS,
      aliquotaCOFINS: lancamento.aliquotaCOFINS,
      aliquotaCSLL: lancamento.aliquotaCSLL,
      aliquotaCRF: lancamento.aliquotaCRF
    });

    if (this.lancamento.fixo == 'S') {
      this.lancamentoService.obterTodosLancamentosFilho(this.lancamentoId)
        .subscribe(
          Lancamento => {
            if (Lancamento.length > 0) {
              this.lancamentoForm.disable()
              this.lancamentoForm.get('dataEncerramento').enable()
            }
          },
          response => {
            if (response.status == 404) {
              this.router.navigate(['404']);
            }
          });
      this.lancamentoForm.get('dataVencimento').disable();
    } else {
      this.lancamentoForm.get('dataVencimento').enable();
    }

    if (this.lancamento.faturamentoId != null) {
      this.lancamentoForm.disable();
      var self = this;
      this.swal.showSwalError('Não é possível editar um lançamento já faturado', function (isConfirmed) {
        if (isConfirmed) {
          // self.cancelar();
        }
      });
    }

  }

  cancelar() {
    this.router.navigate(['lancamento/lista']);
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  preencherDadosOrigemEvento(eventoId) {
    let evento: Evento[];
    let valorLancamento: number = 0;
    let percentual: number = 0;
    let novaDataVencimento = new Date();

    evento = this.eventos.filter(e => e.id == eventoId);

    if (evento[0].aliquotaIRRF == undefined)
      evento[0].aliquotaIRRF = 0;

    if (evento[0].aliquotaISS == undefined)
      evento[0].aliquotaISS = 0;

    if (evento[0].aliquotaPIS == undefined)
      evento[0].aliquotaPIS = 0;

    if (evento[0].aliquotaCOFINS == undefined)
      evento[0].aliquotaCOFINS = 0;

    if (evento[0].aliquotaCSLL == undefined)
      evento[0].aliquotaCSLL = 0;

    this.lancamento.aliquotaIRRF = 0;
    this.lancamento.aliquotaISS = 0;
    this.lancamento.aliquotaPIS = 0;
    this.lancamento.aliquotaCSLL = 0;
    this.lancamento.aliquotaCOFINS = 0;
    this.lancamento.aliquotaCRF = 0;
    this.lancamento.valorUnitario = 0;
    this.lancamento.percentual = 0;
    this.lancamento.descricao = '';

    this.lancamento.faturarContrato = evento[0].faturarContrato;

    if (this.lancamento.faturarContrato == 'N') {
      this.lancamentoForm.get('contratoFaturamentoId').setValue('');
      this.lancamentoForm.get('contratoFaturamentoId').disable();
    }
    else
      this.lancamentoForm.get('contratoFaturamentoId').enable();

    if (evento[0].unidade == 'PRC') {
      percentual = evento[0].valorReferencia;
      this.lancamentoForm.get('percentual').enable();
    } else {
      this.lancamentoForm.get('percentual').disable();

      if (this.lancamento.valorUnitario == undefined)
        valorLancamento = evento[0].valorReferencia
      else
        valorLancamento = (this.lancamento.valorUnitario + evento[0].valorReferencia);
    }

    this.recalculoDataVencimento(this.lancamentoForm.get('dataLancamento').value);

    if (this.parametro != null) {    
      this.lancamento.aliquotaIRRF = this.parametro.aliquotaRetencaoFonte;    
      this.lancamento.aliquotaISS = this.parametro.aliquotaISS; 
      this.lancamento.aliquotaPIS = this.parametro.aliquotaPIS;
      this.lancamento.aliquotaCSLL = this.parametro.aliquotaCSLL;
      this.lancamento.aliquotaCOFINS = this.parametro.aliquotaCOFINS;
      this.lancamento.aliquotaCRF = this.parametro.aliquotaCRF;
    }

    if (evento[0].aliquotaIRRF > 0)
      this.lancamento.aliquotaIRRF = evento[0].aliquotaIRRF;

    if (evento[0].aliquotaISS > 0)
      this.lancamento.aliquotaISS = evento[0].aliquotaISS;

    if (evento[0].aliquotaPIS > 0)
      this.lancamento.aliquotaPIS = evento[0].aliquotaPIS;

    if (evento[0].aliquotaCOFINS > 0)
      this.lancamento.aliquotaCOFINS = evento[0].aliquotaCOFINS;

    if (evento[0].aliquotaCSLL > 0)
      this.lancamento.aliquotaCSLL = evento[0].aliquotaCSLL;

    this.lancamento.valorUnitario = valorLancamento;
    this.lancamento.percentual = percentual;
    this.lancamento.descricao = evento[0].descricao;

    this.lancamentoForm.patchValue({
      aliquotaIRRF: this.lancamento.aliquotaIRRF,
      aliquotaISS: this.lancamento.aliquotaISS,
      aliquotaPIS: this.lancamento.aliquotaPIS,
      aliquotaCSLL: this.lancamento.aliquotaCSLL,
      aliquotaCOFINS: this.lancamento.aliquotaCOFINS,
      aliquotaCRF: this.lancamento.aliquotaCRF,
      valorUnitario: this.lancamento.valorUnitario,
      percentual: this.lancamento.percentual,
      // dataVencimento: DateUtils.setMyDatePickerDate(novaDataVencimento),
      descricao: this.lancamento.descricao
    })
    this.calcularValorTotal(this.lancamentoForm.get('quantidade').value);
  }

  preencherDadosOrigemContrato(contratoId) {
    let evento: Evento[];
    let contrato: Contrato[];
    let valorLancamento: number = 0;
    let percentual: number = 0;
    let novaDataVencimento = new Date();

    valorLancamento = this.lancamentoForm.get('valorUnitario').value;
    evento = this.eventos.filter(e => e.id == this.lancamentoForm.get('eventoFaturamentoId').value);
    contrato = this.contratos.filter(c => c.id == contratoId);

    if (evento[0].valorContrato == 'S')
      valorLancamento = contrato[0].valorContrato

    this.recalculoDataVencimento(this.lancamentoForm.get('dataLancamento').value);

    this.lancamentoForm.patchValue({
      valorUnitario: valorLancamento,
    })
  }

  recalculoDataVencimento(dataLancamento) {
    let evento: Evento[];
    let contrato: Contrato[];
    let novaDataVencimento = new Date();

    if (this.lancamentoForm.get('eventoFaturamentoId').value != '' && this.eventos !== undefined) {
      evento = this.eventos.filter(e => e.id == this.lancamentoForm.get('eventoFaturamentoId').value);

      if (evento[0].diaVencimentoContrato == 'S') {
        if (this.lancamentoForm.get('contratoFaturamentoId').value != '') {
          contrato = this.contratos.filter(c => c.id == this.lancamentoForm.get('contratoFaturamentoId').value);

          let data;

          if (dataLancamento.date.day < contrato[0].diaVencimento)
            data = new Date(dataLancamento.date.year, dataLancamento.date.month - 1, dataLancamento.date.day);
          else
            data = new Date(dataLancamento.date.year, dataLancamento.date.month - 1, dataLancamento.date.day + contrato[0].qtdeDiaVencimento + 1);

          if (contrato[0].qtdeDiaVencimento > 0) {
            novaDataVencimento = new Date(data)

            if (contrato[0].diaVencimento > 0 && novaDataVencimento.getDate() > contrato[0].diaVencimento) {
              novaDataVencimento = new Date(novaDataVencimento.getFullYear(), novaDataVencimento.getUTCMonth(), contrato[0].diaVencimento);
            }
            else if (contrato[0].diaVencimento > 0 && novaDataVencimento.getDate() < contrato[0].diaVencimento) {
              novaDataVencimento = new Date(novaDataVencimento.getFullYear(), novaDataVencimento.getUTCMonth(), contrato[0].diaVencimento);
            }
          }

          if (contrato[0].qtdeDiaVencimento == 0 && contrato[0].diaVencimento == 0)
            novaDataVencimento = new Date(dataLancamento);

        }
      }
      else {
        let data;

        if (dataLancamento.date.day < evento[0].diaVencimento)
          data = new Date(dataLancamento.date.year, dataLancamento.date.month - 1, dataLancamento.date.day);
        else
          data = new Date(dataLancamento.date.year, dataLancamento.date.month - 1, dataLancamento.date.day + evento[0].qtdeDiaVencimento + 1);

        if (evento[0].qtdeDiaVencimento > 0) {
          novaDataVencimento = new Date(data);

          if (evento[0].diaVencimento > 0 && novaDataVencimento.getDate() > evento[0].diaVencimento) {
            novaDataVencimento = new Date(novaDataVencimento.getFullYear(), novaDataVencimento.getUTCMonth(), evento[0].diaVencimento);
          }
          else if (evento[0].diaVencimento > 0 && novaDataVencimento.getDate() < evento[0].diaVencimento) {
            novaDataVencimento = new Date(novaDataVencimento.getFullYear(), novaDataVencimento.getUTCMonth(), evento[0].diaVencimento);
          }
        }

        if (evento[0].qtdeDiaVencimento == 0 && evento[0].diaVencimento == 0)
          novaDataVencimento = new Date(dataLancamento);
      }

      this.lancamentoForm.patchValue({
        dataVencimento: DateUtils.setMyDatePickerDate(novaDataVencimento),
      })
    }
  }

  calcularValorTotal(quantidade) {
    let valorPerc = 0;
    if (this.lancamentoForm.get('percentual').value != 0) {
      valorPerc = (this.lancamentoForm.get('valorUnitario').value * (this.lancamentoForm.get('percentual').value / 100)) * quantidade
      this.lancamentoForm.patchValue({
        valorTotal: valorPerc
      });
      this.lancamento.valorTotal = valorPerc;
    } else {
      this.lancamentoForm.patchValue({
        valorTotal: this.lancamentoForm.get('valorUnitario').value * quantidade
      });
      this.lancamento.valorTotal = this.lancamentoForm.get('valorUnitario').value * quantidade;
    }
  }

  habilitarDesabilitarContrato(checked: Boolean) {
    if (checked)
      this.lancamentoForm.get('contratoFaturamentoId').enable();
    else {
      this.lancamentoForm.get('contratoFaturamentoId').setValue('');
      this.lancamentoForm.get('contratoFaturamentoId').disable();
    }
  }

  buscarContratosdoCliente(id) {
    this.lancamentoService.obterTodosContratoPorCliente(id)
      .subscribe(contratos => {
        this.contratos = contratos
      },
        error => this.errors);
  }

  editarLancamento() {
    if (this.lancamentoForm.dirty && this.lancamentoForm.valid) {      
      let p = Object.assign({}, this.lancamento, this.lancamentoForm.getRawValue());
      console.log(p);
      if (p.dataLancamento != '' && p.dataLancamento != null)
        p.dataLancamento = DateUtils.getMyDatePickerDate(p.dataLancamento);

      if (p.dataVencimento != '' && p.dataVencimento != null)
        p.dataVencimento = DateUtils.getMyDatePickerDate(p.dataVencimento);

      if (p.dataEncerramento != '' && p.dataEncerramento != null)
        p.dataEncerramento = DateUtils.getMyDatePickerDate(p.dataEncerramento);

      this.lancamentoService.atualizarLancamento(p)
        .subscribe(
          result => {
            this.swal.showSwalSuccess('Lançamento atualizado com Sucesso!');
            this.router.navigate(['lancamento/lista']);
          },
          error => {
            this.onError(error)
          })
    }
  }

  remover(id) {
    this.router.navigate(['lancamento/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['lancamento/reativar/' + id]);
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.lancamentoService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

  ConsultaClienteAndEvento(idEmpresa) {
    this.clientes = [];
    this.lancamentoService.obterTodosCliente(idEmpresa)
      .subscribe(clientes => {
        this.clientes = clientes
      },
        () => this.errors);

    this.eventos = [];
    this.lancamentoService.obterEventoFaturamentoPorEmpresa(idEmpresa)
      .subscribe(eventos => {
        this.eventos = eventos
      },
        error => this.errors);

    this.lancamentoService.obterParametroPorEmpresaId(idEmpresa)
      .subscribe(parametro => {
        this.parametro = parametro
      },
        error => this.errors);

  }

  validaVencimento(fixo) {
    this.lancamentoForm.controls['dataVencimento'].patchValue('');
    this.lancamentoForm.controls['diaVencimento'].patchValue('');
    if (fixo == 'S') {      
      this.lancamentoForm.get('diaVencimento').enable();
      this.lancamentoForm.get('dataVencimento').disable();
    } else {
      this.lancamentoForm.get('dataVencimento').enable();
      this.lancamentoForm.get('diaVencimento').disable();
    }
  }


}
