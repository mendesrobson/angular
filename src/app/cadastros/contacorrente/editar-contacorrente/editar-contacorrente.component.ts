import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, ViewChild } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ContaCorrente, Banco, Agencia, ContaCorrenteCobranca, TipoConta } from '../models/contacorrente';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { ContaCorrenteService } from '../contacorrente.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MaskService } from '../../../services/mask.service';
import { Subscription } from 'rxjs';
import { EditarDadosCobrancaComponent } from '../editar-dadoscobranca/editar-dadoscobranca.component';
import { ContaCorrenteComponent } from '../contacorrente.component';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-editar-contacorrente',
  templateUrl: './editar-contacorrente.component.html',
  providers: [MaskService, EditarDadosCobrancaComponent],
  styleUrls: []
})

export class EditarContaCorrenteComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public filterQuery = '';
  public rowsOnPage = 10;
  public sortBy = 'nome';
  public sortOrder = 'asc';

  public contaCorrenteForm: FormGroup;
  public contaCorrente: ContaCorrente;
  public contaCorrenteCobranca: ContaCorrenteCobranca[];
  public contaCorrenteId = '';

  carregarDadosCobranca = false;

  swal: SweetAlertAdviceService;
  cnpjMask = this._maskService.Cnpj();
  cnpjPattern = this._maskService.cnpjPattern;

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public bancos: Banco[];
  public agencias: Agencia[];
  public tipoContas: TipoConta[];
  public errors: any[] = [];

  public data: ContaCorrenteCobranca;
  public sub: Subscription;

  public removerVisivel = false;
  public reativarVisivel = false;

  constructor(private contaCorrenteService: ContaCorrenteService,
    private _maskService: MaskService,
    private _utilService: UtilService,
    private _fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private contaCorrenteComponent: ContaCorrenteComponent,
    /*, private editarDadosCobrancaComponent: EditarDadosCobrancaComponent*/
  ) {
    this.contaCorrente = new ContaCorrente();
    // this.contaCorrente._contaCorrenteCobranca = new ContaCorrenteCobranca();
    this.contaCorrenteForm = this._fb.group({
      codigo: [''],
      sigla: [''],
      descricao: [''],
      numeroConvenio: [''],
      numeroContrato: [''],
      codigoCedente: [''],
      numeroRemessa: [''],
      nossoNumero: [''],
      numeroCarteira: [''],
      numeroVariacaoCarteira: [''],
      localPagamento: [''],
      carteiraIntegracaoId: [''],
      producao: [''],
      instrucao: ['']
    });

    this.validationMessages = {
      grupoEmpresaId:
      {
        required: 'Grupo requerido.'
      },
      empresaId: {
        required: 'Empresa requerida.'
      },
      bancoId: {
        required: 'Banco requerido.'
      },
      tipoContaId: {
        required: 'Tipo da Conta requerido.'
      },
      agenciaId: {
        required: 'Agência requerida.'
      },
      codigo: {
        required: 'Código requerido.',
        maxLength: 'O Código precisa ter no máximo 20 caracteres'
      },
      descricao: {
        required: 'Descricao requerida.',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      },
      nomeEmpresa: {
        required: 'Nome Empresa requerida.',
        maxlength: 'O Nome Empresa precisa ter no máximo 20 caracteres'
      },
      cnpj: {
        required: 'CNPJ requerido.',
        pattern: 'Formato de CNPJ inválido'
      },
      conta: {
        required: 'Conta requerida.',
        maxlength: 'A Conta precisa ter no máximo 20 caracteres'
      },
      digito: {
        required: 'Dígito requerida.',
        maxlength: 'O Dígito precisa ter no máximo 20 caracteres'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.swal = new SweetAlertAdviceService();

    this.contaCorrenteComponent.ContaCorrente = new ContaCorrente();
    this.contaCorrenteComponent.contaCorrente.contaCorrenteCobranca = [];
    this.contaCorrenteComponent.contaCorrenteCobranca = new ContaCorrenteCobranca();

  }

  ngOnInit() {
    this.carregarDadosCobranca = false;
    this.contaCorrenteForm = this._fb.group({
      guid: 0,
      id: 0,
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      bancoId: ['', [Validators.required]],
      agenciaId: ['', [Validators.required]],
      tipoContaId: ['', [Validators.required]],
      codigo: ['', [Validators.required,
      Validators.maxLength(20)]],
      descricao: ['', [Validators.required,
      Validators.maxLength(100)]],
      nomeEmpresa: ['', [Validators.required,
      Validators.maxLength(20)]],
      cnpj: ['', [Validators.required, Validators.pattern(this.cnpjPattern)]],
      conta: ['', [Validators.required,
      Validators.maxLength(20)]],
      digito: ['', [Validators.required,
      Validators.maxLength(20)]],
      dataInicial: null,
      saldoInicial: '',
      saldoReal: '',
      saldoConciliado: '',
      saldoConciliadoEmissao: '',
      dataUltimaConciliacao: null,
      sangria: 'N',
      caixaPrincipal: 'N',
      visualizaFluxoCaixa: 'N',
      codigoConvenioBanco: null,
      excluido: 'N'
    });

    this.contaCorrenteForm.controls['tipoContaId'].disable();

    this.sub = this.route.params.subscribe(
      params => {
        this.contaCorrenteId = params['id'];
        this.obterContaCorrentePorId(this.contaCorrenteId);
      });

    this.contaCorrenteService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas;
      },
        () => this.errors);

    this.contaCorrenteService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas;
      },
        () => this.errors);

    this.contaCorrenteService.obterTodosBanco()
      .subscribe(bancos => {
        this.bancos = bancos;
      },
        () => this.errors);

    this.contaCorrenteService.obterTodosAgencia()
      .subscribe(agencias => {
        this.agencias = agencias;
      },
        () => this.errors);

    this.contaCorrenteService.obterTodosTipoConta()
      .subscribe(tipoContas => {
        this.tipoContas = tipoContas;
      },
        () => this.errors);

    // this.prencherDadosCobranca(this.contaCorrenteId);
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.contaCorrenteForm);
    });
  }
  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    if (this.contaCorrenteForm.controls['tipoContaId'].value == 25) {
      this.router.navigate(['conta/listacontacaixa']);
    } else {
      this.router.navigate(['conta']);
    }
  }

  limparFormContaCorrenteCobranca() {
    this.contaCorrenteForm = this._fb.group({
      grupoEmpresaId: [''],
      empresaId: [''],
      bancoId: [''],
      agenciaId: [''],
      tipoContaId: [''],
      codigo: [''],
      descricao: [''],
      nomeEmpresa: [''],
      cnpj: [''],
      conta: [''],
      digito: ['']
    });
  }


  // listarContaCorrente() {
  //   this.router.navigate(['contacorrente/lista']);
  // }

  editContaCorrenteCobranca(row) {
    localStorage.setItem('contaCorrenteCobranca', JSON.stringify(row));
    // this.editarDadosCobrancaComponent.preencherDadosCobranca();
  }

  onRemove() {
  }

  onReative() {
  }

  inativarContaCorrenteCobranca() {
  }

  ativarContaCorrenteCobranca() {
  }


  editarContaCorrente() {
    if (this.contaCorrenteForm.dirty && this.contaCorrenteForm.valid) {

      const p = Object.assign({}, this.contaCorrente, this.contaCorrenteForm.getRawValue());

      p.ContaCorrenteCobranca = this.contaCorrenteComponent.ContaCorrente.contaCorrenteCobranca;

      this.contaCorrenteService.atualizarContaCorrente(p)
        .subscribe(
          result => {
            this.swal.showSwalSuccess('Conta atualizada com Sucesso');
            console.log('editarContaCorrente');
            if (p.tipoContaId === 25) {
              this.router.navigate(['conta/listacontacaixa']);
            } else {
              this.router.navigate(['conta/lista']);
            }
          },
          error => {
            this.errors;
          });
    }
  }


  preencherFormContaCorrente(contaCorrente: ContaCorrente): void {
    this.contaCorrente = contaCorrente;
    this.reativarVisivel = this.contaCorrente.excluido === 'S';
    this.removerVisivel = this.contaCorrente.excluido === 'N';

    this.contaCorrenteForm.controls['codigo'].disable();

    // this.data = this.contaCorrente;
    this.contaCorrenteForm.patchValue({
      id: this.contaCorrente.id,
      empresaId: this.contaCorrente.empresaId,
      grupoEmpresaId: this.contaCorrente.grupoEmpresaId,
      bancoId: this.contaCorrente.bancoId,
      agenciaId: this.contaCorrente.agenciaId,
      tipoContaId: this.contaCorrente.tipoContaId,
      codigo: this.contaCorrente.codigo,
      descricao: this.contaCorrente.descricao,
      nomeEmpresa: this.contaCorrente.nomeEmpresa,
      cnpj: this.contaCorrente.cnpj,
      conta: this.contaCorrente.conta,
      digito: this.contaCorrente.digito,
      saldoInicial: this.contaCorrente.saldoInicial,
      saldoReal: this.contaCorrente.saldoReal,
      saldoConciliado: this.contaCorrente.saldoConciliado,
      saldoConciliadoEmissao: this.contaCorrente.saldoConciliadoEmissao,
      dataUltimaConciliacao: this._utilService.ToDate(this.contaCorrente.dataUltimaConciliacao),
      sangria: this.contaCorrente.sangria,
      caixaPrincipal: this.contaCorrente.caixaPrincipal,
      visualizaFluxoCaixa: this.contaCorrente.visualizaFluxoCaixa
    });


    this.contaCorrenteComponent.ContaCorrente = this.contaCorrente;
    this.carregarDadosCobranca = true;

  }
  obterContaCorrentePorId(id: string) {
    this.contaCorrenteService.obterContaCorrentePorId(id)
      .subscribe(
        contaCorrente => this.preencherFormContaCorrente(contaCorrente),
        response => {
          if (response.status === 404) {
            this.router.navigate(['404']);
          }
        });
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.contaCorrenteForm.get('cnpj').reset();
    this.contaCorrenteService.obterTodosEmpresaPorId(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

  ObterCNPJAutomatico(event) {
    if(this.empresas!== null){
      this.empresas.forEach(result => {
        if (result.pessoa.id == event) {
          this.contaCorrenteForm.get('cnpj').setValue(result.pessoa.cnpj);
        }
      });
    }
  }

  formCaixaBanco(event) {
    this.contaCorrente.tipoContaId = event;
  }

  remover(id) {
    this.router.navigate(['conta/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['conta/reativar/' + id]);
  }
}
