import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { TipoAfastamento } from '../models/tipoafastamento';
import { GrupoEmpresa, Empresa } from '../../../contasreceber/alterarvencimentolote/models/parcela';
import { TipoAfastamentoService } from '../tipoafastamento.service';

@Component({
  selector: 'app-adicionar-tipoafastamento',
  templateUrl: './adicionar-tipoafastamento.component.html',
  styleUrls: []
})
export class AdicionarTipoafastamentoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public tipoAfastamento: TipoAfastamento;
  public tipoAfastamentoForm: FormGroup;
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public afastamentos = new Array();

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private tipoAfastamentoService: TipoAfastamentoService,
    private fb: FormBuilder,
    private router: Router) {

    this.validationMessages = {

      grupoEmpresaId:
      {
        required: 'Grupo requerido!'
      },
      empresaId: {
        required: 'Empresa requerida!'
      },
      codigoRais: {
        required: 'Código Rais requerido!',
        maxlength: 'O código Rais deve ter no máximo 5 caracteres!'
      },
      codigoESocial: {
        required: 'Código E-Social requerido!',
        maxlength: 'O código Social deve ter no máximo 5 caracteres!'
      },
      tipoDeAfastamento: {
        required: 'Tipo de afastamento requerido!'
      },
      tipoSEFIP: {
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
      tipoDeAfastamento: ['', [Validators.required]],
      remuneracao: ['N'],
      codigoESocial: ['', [Validators.required]],
      tipoSEFIP: ['', Validators.required],
      codigoRais: ['', [Validators.required]],
      excluido: 'N'
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

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.tipoAfastamentoForm);
    });
  }

  adicionarTipoAfastamento() {
    if (this.tipoAfastamentoForm.dirty && this.tipoAfastamentoForm.valid) {
      const p = Object.assign({}, this.tipoAfastamento, this.tipoAfastamentoForm.value);

      this.tipoAfastamentoService.adicionarTipoAfastamento(p)
        .subscribe(
          result => {
            if (result) {
              this.swal.showSwalSuccess('Tipo de Afastamento adicionado com sucesso!');
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
  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['tipoafastamento/lista']);
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.tipoAfastamentoService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

}
