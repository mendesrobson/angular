import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { TipoAfastamento } from '../models/tipoafastamento';
import { TipoAfastamentoService } from '../tipoafastamento.service';

@Component({
  selector: 'app-editar-tipoafastamento',
  templateUrl: './editar-tipoafastamento.component.html',
  styleUrls: []
})
export class EditarTipoafastamentoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public reativarVisivel = false;
    public removerVisivel = false;
  
    public tipoAfastamento: TipoAfastamento;
    public tipoAfastamentoForm: FormGroup;
    public tipoAfastamentoId: "";
    displayMessage: { [key: string]: string } = {};
  
    public grupoEmpresas: GrupoEmpresa[];
    public empresas: Empresa[];
    public afastamentos = new Array();
  
    public sub: Subscription;
    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;
  
    swal: SweetAlertAdviceService;
    public errors: any[] = [];

  constructor(
    private tipoAfastamentoService: TipoAfastamentoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {

      this.validationMessages = {
        grupoEmpresaId:
        {
          required: 'Grupo requerido!'
        },
        empresaId: {
          required: 'Empresa requerida!'
        },
        codigoRais:{
          required: 'Código Rais requerido!',
          maxlength: 'O código Rais deve ter no máximo 5 caracteres!'
        },
        codigoESocial: {
          required: 'Código E-Social requerido!',
          maxlength: 'O código Social deve ter no máximo 5 caracteres!'
        },
        tipoDeAfastamento:{
          required: 'Tipo de afastamento requerido!'
        },
        tipoSEFIP:{
          required: 'Tipo de SEFIP requerido!',
          maxlength: 'O SEFIP deve ter 10 caracteres!',
          minlength: 'O SEFIP deve ter 10 caracteres!'
        },
        descricao: {
          required: 'Descrição requerida!',
          minlength: 'A Descrição deve ter no mínimo 3 caracteres!',
          maxlength: 'A Descrição deve ter no máximo 100 caracteres!'
        },
      };
      this.genericValidator = new GenericValidator(this.validationMessages);
      this.tipoAfastamento = new TipoAfastamento();
      this.swal = new SweetAlertAdviceService();

     }

  ngOnInit() {

    this.tipoAfastamentoForm = this.fb.group({
      id: 0,
      guid: 1,
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      codigo: [''],
      sigla: [''],
      descricao: ['', [Validators.required]],
      tipoDeAfastamento:['', [Validators.required]],
      remuneracao:['N'],
      codigoESocial: ['', [Validators.required]],
      tipoSEFIP:['', Validators.required],
      codigoRais: ['', [Validators.required]],
      excluido: 'N'
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.tipoAfastamentoId = params['id'];
        this.obterTipoAfastamento(this.tipoAfastamentoId);
      });

    this.tipoAfastamentoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);
        
    // this.tipoAfastamentoService.getTipoAfastamento()
    // .subscribe(afastamentos => {
    //   console.log(afastamentos);
    //   this.afastamentos = afastamentos

    // },
    // error => this.errors);  
    this.afastamentos = [{
      "id": "",
      "valor": ""
    },
    {
      "id": "Leg",
      "valor": "Legal"
    },
    {
      "id": "Doe",
      "valor": "Doença"
    },
    {
      "id": "Aci",
      "valor": "Acidente"
    },
    {
      "id": "Sind",
      "valor": "Sindical"
    },
    {
      "id": "Ces",
      "valor": "Cessão"
    },
    {
      "id": "Mil",
      "valor": "Militar"
    },
    {
      "id": "Conc",
      "valor": "Conciliação"
    },
    {
      "id": "Mater",
      "valor": "Maternidade"
    }];

  }

  obterTipoAfastamento(id: string) {
    this.tipoAfastamentoService.obterTipoAfastamento(id)
      .subscribe(
        tipoAfastamento => this.preencherFormTipoAfastamento(tipoAfastamento),
        response => {
          if (response.status === 404) {
            this.router.navigate(['NotFound']);
          }
        });
  }

  preencherFormTipoAfastamento(tipoAfastamento: TipoAfastamento): void {
    this.tipoAfastamento = tipoAfastamento;

    this.reativarVisivel = this.tipoAfastamento.excluido === 'S';
    this.removerVisivel = this.tipoAfastamento.excluido === 'N';
    !this.removerVisivel ? this.tipoAfastamentoForm.disable() : this.tipoAfastamentoForm.enable();

    this.tipoAfastamentoForm.patchValue({
      id: this.tipoAfastamento.id,
      grupoEmpresaId: this.tipoAfastamento.grupoEmpresaId,
      empresaId: this.tipoAfastamento.empresaId,
      codigo: this.tipoAfastamento.codigo,
      sigla: this.tipoAfastamento.sigla,
      descricao: this.tipoAfastamento.descricao,
      tipoDeAfastamento: this.tipoAfastamento.tipoDeAfastamento,
      remuneracao: this.tipoAfastamento.remuneracao,
      codigoESocial: this.tipoAfastamento.codigoESocial,
      tipoSEFIP: this.tipoAfastamento.tipoSEFIP,
      codigoRais: this.tipoAfastamento.codigoRais,
      excluido: this.tipoAfastamento.excluido
    });
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.tipoAfastamentoForm);
    });
  }

  editarTipoAfastamento() {
    if (this.tipoAfastamentoForm.dirty && this.tipoAfastamentoForm.valid) {
      const p = Object.assign({}, this.tipoAfastamento, this.tipoAfastamentoForm.value);

      this.tipoAfastamentoService.atualizarTipoAfastamento(p)
        .subscribe(
          result => {
            if (result) {
                this.swal.showSwalSuccess('Tipo de afastamento atualizado com sucesso!');
                this.router.navigate(['tipoafastamento/lista']);
            } else {
                this.swal.showSwalErro('Ocorreu um erro ao gravar!');
            }

        },
        error => {
            console.error(error)
        })
    }
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.tipoAfastamentoService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['tipoafastamento/lista']);
  }

  remover(id) {
    this.router.navigate(['tipoafastamento/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['tipoafastamento/reativar/' + id]);
  }

}
