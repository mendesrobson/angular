import { Component, OnInit, Input, OnChanges, AfterViewInit, ViewChildren, ElementRef, ViewContainerRef } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { FormControlName, FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ContaCorrente, Banco, Agencia } from '../models/contacorrente';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { ContaCorrenteService } from '../contacorrente.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { MaskService } from '../../../services/mask.service';
import { ContaCorrenteComponent } from '../contacorrente.component';
import { ToastsManager, Toast } from 'ng2-toastr';
import { GrupoEmpresa, Empresa } from '../../empresa/models/empresa';

@Component({
  selector: 'app-lista-dadoscobranca',
  templateUrl: './lista-dadoscobranca.component.html',
  providers: [MaskService],
  styleUrls: []
})
export class ListaDadosCobrancaComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public contaCorrenteClass: ContaCorrente;
  public contaCorrenteForm: FormGroup;
  public contaCorrente: ContaCorrente[];

  public contaCorrenteId: 0;

  swal: SweetAlertAdviceService;
  cpfMask = this._maskService.Cpf();

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public modalAddVisible: boolean;
  public modalEditVisible: boolean;

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public bancos: Banco[];
  public agencias: Agencia[];
  public errors: any[] = [];
  public data: any[];
  public campos: any[] = [];
  public droppedCampos: any[] = [];
  public dragEnabled = true;
  public texto = '';
  public cursor = 0;
  public caretPos = 0;
  public visible = 'none';
  public visible2: 'inline';
  public reativarVisible: 'none';
  public inativarVisible: 'none';

  public filterQuery = '';
  public rowsOnPage = 10;
  public sortBy = 'nome';
  public sortOrder = 'asc';

  public FormContaCorrenteCobrancaVisible: string = "none";
  public GridContaCorrenteCobrancaVisible: string = "inline";
  public btnGravarContaCorrenteCobrancaVisible: string = "inline";
  public btnEditarContaCorrenteCobrancaVisible: string = "none";

  @Input() sessionData: boolean;

  constructor(private contaCorrenteService: ContaCorrenteService,
    private _maskService: MaskService,
    private _fb: FormBuilder,
    private router: Router,
    private contaCorrenteComponent: ContaCorrenteComponent,
    private toastr: ToastsManager,
    vcr: ViewContainerRef,
    private route: ActivatedRoute) {

    this.toastr.setRootViewContainerRef(vcr);

    // this.contaCorrenteForm = this._fb.group({
    //   codigo: [''],
    //   sigla: [''],
    //   descricao: [''],
    //   numeroConvenio: [''],
    //   numeroContrato: [''],
    //   codigoCedente: [''],
    //   numeroRemessa: [''],
    //   nossoNumero: [''],
    //   numeroCarteira: [''],
    //   numeroVariacaoCarteira: [''],
    //   localPagamento: [''],
    //   carteiraIntegracaoId: [''],
    //   producao: [''],
    //   instrucao: ['']
    // })

    // this.validationMessages = {
    //   grupoEmpresaId:
    //     {
    //       required: 'Grupo requerido.'
    //     },
    //   empresaId: {
    //     required: 'Empresa requerida.'
    //   },
    //   bancoId: {
    //     required: 'Banco requerido.'
    //   },
    //   agenciaId: {
    //     required: 'Agência requerida.'
    //   },
    //   codigo: {
    //     required: 'Codigo requerido.'
    //   },
    //   descricao: {
    //     required: 'descricao requerida.'
    //   },
    //   nomeEmpresa: {
    //     required: 'empresa requerida.'
    //   },
    //   cnpj: {
    //     required: 'cnpj requerido.'
    //   },
    //   conta: {
    //     required: 'conta requerida.'
    //   },
    //   digito: {
    //     required: 'digito requerida.'
    //   }
    // };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.contaCorrenteClass = new ContaCorrente();
    this.swal = new SweetAlertAdviceService();
    this.modalAddVisible = false;
    this.modalEditVisible = false;
  }

  ngOnInit() {

    // console.log('contacorrente2');
    // console.log(this.contaCorrenteComponent.ContaCorrente.contaCorrenteCobranca)
    this.data = this.contaCorrenteComponent.contaCorrente.contaCorrenteCobranca;
    // this.contaCorrenteForm = this._fb.group({
    //   guid: 0,
    //   id: 0,
    //   grupoEmpresaId: ['', [Validators.required]],
    //   empresaId: ['', [Validators.required]],
    //   bancoId: ['', [Validators.required]],
    //   agenciaId: ['', [Validators.required]],
    //   codigo: ['', [Validators.required]],
    //   descricao: ['', [Validators.required]],
    //   nomeEmpresa: ['', [Validators.required]],
    //   cnpj: ['', [Validators.required]],
    //   conta: ['', [Validators.required]],
    //   digito: ['', [Validators.required]]
    // });

    // this.campos = [
    //   { name: '{{Valor Desconto}}', type: 'campo' },
    //   { name: '{{Data desconto}}', type: 'campo' },
    //   { name: '{{Valor Juros}}', type: 'campo' },
    //   { name: '{{Data Juros}}', type: 'campo' },
    //   { name: '{{Valor Multa}}', type: 'campo' },
    //   { name: '{{Data Multa}}', type: 'campo' }
    // ];


    if (this.route.snapshot.params['id'] === undefined) {
      this.contaCorrenteId = 0; }  else {
        this.contaCorrenteId = this.route.snapshot.params['id'];
      }

    /*  this.contaCorrenteService.obterTodosContaCorrente()
      .subscribe(contaCorrente => {
        if(this.sessionData != true)
        {
          this.contaCorrente = contaCorrente
          this.data = contaCorrente
        }
        else
        {*/
    //   console.log('valor do data')
    //    this.data = JSON.parse(localStorage.getItem("contaCorrenteCobranca"));
    //    console.log(this.data);
    /*  }
    },
    error => this.errors);*/

    // console.log(this.data);

    // this.contaCorrenteService.obterTodosGrupoEmpresa()
    //   .subscribe(grupoEmpresas => {
    //     this.grupoEmpresas = grupoEmpresas
    //   },
    //   error => this.errors);

    // this.contaCorrenteService.obterTodosEmpresa()
    //   .subscribe(empresas => {
    //     this.empresas = empresas
    //   },
    //   error => this.errors);

    //   this.contaCorrenteService.obterTodosBanco()
    //   .subscribe(bancos => {
    //     this.bancos = bancos
    //   },
    //   error => this.errors);

    //   this.contaCorrenteService.obterTodosAgencia()
    //   .subscribe(agencias => {
    //     this.agencias = agencias
    //     console.log(this.agencias);
    //   },
    //   error => this.errors);
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.contaCorrenteForm);
    });
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['contacorrente/lista']);
  }

  listarContaCorrente() {
    this.router.navigate(['contacorrente/lista']);
  }

  adicionarContaCorrente() {
    if (this.contaCorrenteForm.dirty && this.contaCorrenteForm.valid) {
      const p = Object.assign({}, this.contaCorrenteClass, this.contaCorrenteForm.value);

      this.contaCorrenteService.adicionarContaCorrente(p)
        .subscribe(
        () => {
          this.swal.showSwalSuccess('Conta Corrente Adicionada com Sucesso!');
          this.router.navigate(['contacorrente/lista']);
        },
        error => {
          this.onError(error);
        });
    }
  }

  onCamposDrop(e: any) {
    this.droppedCampos.push(e.dragData);
    const instrucaoValue = this.contaCorrenteForm.controls['instrucao'].value;
    const textoInicio: string = instrucaoValue.substr(0, this.cursor);
    const textoFim: string = instrucaoValue.substr(textoInicio.length, instrucaoValue.length);
    this.contaCorrenteForm.patchValue({
      instrucao: textoInicio + this.droppedCampos[this.droppedCampos.length - 1].name + textoFim
    });
  }

  getPosition(oField) {
    if (oField.selectionStart || oField.selectionStart === '0') {
      this.caretPos = oField.selectionStart;
      this.cursor = this.caretPos;
    }
  }

  editarContaCorrenteCobranca(contacorrentecobranca) {
    console.log('valor 3');

    console.log(contacorrentecobranca);

    this.contaCorrenteComponent.ContaCorrenteCobranca = contacorrentecobranca;

    console.log(this.contaCorrenteComponent.ContaCorrenteCobranca)
    this.modalEditVisible = true;
  }

  public mensagemToastr(mensagem: string) {

    // this.toastr.success(mensagem, 'Sucesso', { dismiss: 'controlled' })
    //   .then((toast: Toast) => {
    //     setTimeout(() => {
    //       this.toastr.dismissToast(toast);

    //     }, 2500);
    //   });

  }

  inativarContaCorrenteCobranca(contacorrentecobranca) {
    // tslint:disable-next-line:prefer-const
    let self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerContaCorrenteCobranca(contacorrentecobranca);
      }
    });
  }

  removerContaCorrenteCobranca(contacorrentecobranca) {

    if (this.contaCorrenteId > 0) {
      this.contaCorrenteService.removerContaCorrenteCobranca(contacorrentecobranca)
        .subscribe(
        result => {
          this.mensagemToastr('Dados Cobrança Removido com Sucesso!')

          // tslint:disable-next-line:no-shadowed-variable
          for (let i = 0; i < this.contaCorrenteComponent.ContaCorrente.contaCorrenteCobranca.length; i++) {
            if (contacorrentecobranca.id === this.contaCorrenteComponent.ContaCorrente.contaCorrenteCobranca[i].id) {
              this.contaCorrenteComponent.ContaCorrente.contaCorrenteCobranca.splice(i, 1);
            }
          }

          console.log('contato removido');
          console.log(this.contaCorrenteComponent.ContaCorrente.contaCorrenteCobranca);

          this.data = this.contaCorrenteComponent.ContaCorrente.contaCorrenteCobranca;

        },
        error => {
          // tslint:disable-next-line:no-unused-expression
          this.errors;
        });
    } else {
      // this.swal.showSwalSuccess('Contato inativado com Sucesso');
      // this.contatos = JSON.parse(localStorage.getItem("contatoCliente"));


      for (let i = 0; i < this.contaCorrenteComponent.ContaCorrente.contaCorrenteCobranca.length; i++) {
        if (contacorrentecobranca.id === this.contaCorrenteComponent.ContaCorrente.contaCorrenteCobranca[i].id) {
          this.contaCorrenteComponent.ContaCorrente.contaCorrenteCobranca.splice(i, 1);
        }
      }

      console.log('contato removido');
      console.log(this.contaCorrenteComponent.ContaCorrente.contaCorrenteCobranca);
      this.data = this.contaCorrenteComponent.ContaCorrente.contaCorrenteCobranca;
      this.mensagemToastr('Dados Cobrança Removido com Sucesso!')
    }
  }

}
