import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit, Renderer, ViewChild } from '@angular/core';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { Cliente, Lancamento, Evento, Contrato, ParametroFaturamento } from '../models/lancamento';
import { LancamentoService } from '../lancamento.service';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { IMyDpOptions, IMyDefaultMonth } from 'mydatepicker';
import { DateUtils } from '../../../utils/date.utils';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { CustomValidators } from 'ng2-validation';
import { Empresa, GrupoEmpresa } from '../../../cadastros/empresa/models/empresa';
import { Mascara } from '../../../cadastros/mascara/models/mascara';
import { MaskService } from '../../../services/mask.service';

@Component({
  selector: 'app-adicionar-lancamento',
  templateUrl: './adicionar-lancamento.component.html',
  styleUrls: []
})

export class AdicionarLancamentoComponent implements OnInit, AfterViewInit {
  genericValidator: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  @ViewChild('focusCodigo') focusCodigo: ElementRef;

  public maskValid: boolean;
  public mascSequencial: Mascara;

  public grupoEmpresaId: number;

  public codMask = [];

  constructor(
    private lancamentoService: LancamentoService,
    private fb: FormBuilder,
    private router: Router,
    private _maskService: MaskService,
    private renderer: Renderer) {

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

    this.maskValid = true;
    this.mascSequencial = new Mascara();
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.lancamento = new Lancamento();
    this.swal = new SweetAlertAdviceService();
  }

  public myDatePickerOptions = DateUtils.getMyDatePickerOptions();

  public lancamento: Lancamento;
  public lancamentoForm: FormGroup;
  clientes: Cliente[];
  empresas: Empresa[];
  grupoEmpresas: GrupoEmpresa[];
  eventos: Evento[];
  contratos: Contrato[];
  parametro: ParametroFaturamento;

  swal: SweetAlertAdviceService;

  public errors: any[] = [];
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };

  ngOnInit(): void {
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
      quantidade: [0, [Validators.required,
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

    this.lancamentoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);

    this.lancamentoForm.get('contratoFaturamentoId').setValue('');
    this.lancamentoForm.get('contratoFaturamentoId').disable();
    this.lancamentoForm.get('aliquotaIRRF').disable();
    this.lancamentoForm.get('aliquotaISS').disable();
    this.lancamentoForm.get('aliquotaPIS').disable();
    this.lancamentoForm.get('aliquotaCOFINS').disable();
    this.lancamentoForm.get('aliquotaCSLL').disable();
    this.lancamentoForm.get('aliquotaCRF').disable();  
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.lancamentoForm);
    });
  }

  async adicionarLancamento(): Promise<void> {
    if (this.lancamentoForm.dirty && this.lancamentoForm.valid) {
      let p = Object.assign({}, this.lancamento, this.lancamentoForm.value);

      if (this.mascSequencial == null) {
        this.mascSequencial = new Mascara();
        this.mascSequencial.sequencial = 'N';
      }

      if (this.mascSequencial.sequencial === 'S') {

        p.dataLancamento = DateUtils.getMyDatePickerDate(p.dataLancamento);

        if (p.dataVencimento !== undefined)
          p.dataVencimento = DateUtils.getMyDatePickerDate(p.dataVencimento);

        if (p.dataEncerramento != '')
          p.dataEncerramento = DateUtils.getMyDatePickerDate(p.dataEncerramento);

        this.lancamentoService.adicionarLancamento(p)
          .subscribe(
            result => {
              this.swal.showSwalSuccess('Lançamento Adicionado com Sucesso!');
              this.router.navigate(['lancamento/lista']);
            },
            error => {
              this.onError(error)
            });
      }
      else {
        let codigo: string = p.codigo.replace(/\//g, 'barrad').replace(/\\/g, 'barrae');
        let lancamento = await this.lancamentoService.ObterLancamentoPorCodigo(codigo).toPromise();

        if (lancamento != null) {
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
          p.dataLancamento = DateUtils.getMyDatePickerDate(p.dataLancamento);

          console.log(p.dataVencimento);

          if (p.dataVencimento !== undefined)
            p.dataVencimento = DateUtils.getMyDatePickerDate(p.dataVencimento);

          if (p.dataEncerramento != '')
            p.dataEncerramento = DateUtils.getMyDatePickerDate(p.dataEncerramento);

          this.lancamentoService.adicionarLancamento(p)
            .subscribe(
              result => {
                this.swal.showSwalSuccess('Lançamento Adicionado com Sucesso!');
                this.router.navigate(['lancamento/lista']);
              },
              error => {
                this.onError(error)
              });
        }

      }


    }
  }

  cancelar() {
    this.router.navigate(['lancamento/lista']);
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  limparCampoCodigo() {
    this.lancamentoForm.controls['codigo'].setValue('');
    this.renderer.selectRootElement(this.focusCodigo['nativeElement']).focus();
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

    if (this.lancamentoForm.get('eventoFaturamentoId').value != '') {
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

  async ConsultaEmpresa(idGrupo): Promise<void> {

    this.grupoEmpresaId = idGrupo;
    this.mascSequencial = await this._maskService.VerificaCodSequencialGrupo(1, 'Lancamento', this.grupoEmpresaId);

    if (this.mascSequencial != null) {
      if (this.mascSequencial.sequencial === "S") {
        this.lancamentoForm.controls['codigo'].setValue('');
        this.maskValid = false;
      }
      else {
        this.lancamentoForm.controls['codigo'].setValue('');
        this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
        this.maskValid = true;
      }

    }
    else {
      this.lancamentoForm.controls['codigo'].setValue('');
      this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
      this.maskValid = true;
    }

    this.empresas = [];
    this.lancamentoService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

  async ConsultaClienteAndEvento(idEmpresa): Promise<void> {

    this.mascSequencial = await this._maskService.VerificaCodSequencialGrupoEmpresa(1, 'Lancamento', this.grupoEmpresaId, idEmpresa);

    if (this.mascSequencial != null) {
      if (this.mascSequencial.sequencial === 'S') {
        this.lancamentoForm.controls['codigo'].setValue('');
        this.maskValid = false;
      }
      else {
        this.lancamentoForm.controls['codigo'].setValue('');
        this.codMask = this._maskService.CodigoMaskGrupo(this.mascSequencial);
        this.maskValid = true;
      }
    }
    else {
      this.lancamentoForm.controls['codigo'].setValue('');
      this.codMask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
      this.maskValid = true;

    }

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

