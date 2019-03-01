import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { TipoDeAdmissao } from '../models/tipodeadmissao';
import { GrupoEmpresa, Empresa } from '../../../contasreceber/alterarvencimentolote/models/parcela';
import { TipoDeAdmissaoService } from '../tipodeadmissao.service';

@Component({
  selector: 'app-adicionar-tipodeadmissao',
  templateUrl: './adicionar-tipodeadmissao.component.html',
  styleUrls: []
})
export class AdicionarTipodeadmissaoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public tipoDeAdmissao: TipoDeAdmissao;
  public tipoDeAdmissaoForm: FormGroup;
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private tipoDeAdmissaoService: TipoDeAdmissaoService,
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
      codigoRais:{
        required: 'Código Rais requerido!',
        maxlength: 'O código Rais deve ter no máximo 5 caracteres!'
      },
      codigoESocial: {
        required: 'Código E-Social requerido!',
        maxlength: 'O código E-Social deve ter no máximo 5 caracteres!'
      },
      codigoCaged:{
        required: 'Código Caged requerido!',
        maxlength: 'O código Caged deve ter no Máximo 5 caracteres!'
      },
      descricao: {
        required: 'Descrição requerida!',
        minlength: 'A Descrição deve ter no mínimo 3 caracteres!',
        maxlength: 'A Descrição deve ter no máximo 100 caracteres!'
      },
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.tipoDeAdmissao = new TipoDeAdmissao();
    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit() {

    this.tipoDeAdmissaoForm = this.fb.group({
      id: 0,
      guid: 1,
      grupoEmpresaId: ['', [Validators.required]],
      empresaId: ['', [Validators.required]],
      codigo: [''],
      sigla: [''],
      descricao: ['', [Validators.required]],
      codigoRais: ['', [Validators.required]],
      codigoESocial: ['', [Validators.required]],
      codigoCaged: ['', Validators.required],
      excluido: 'N'
    });

    this.tipoDeAdmissaoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.tipoDeAdmissaoForm);
    });
  }

  adicionarTipoDeAdmissao() {
    if (this.tipoDeAdmissaoForm.dirty && this.tipoDeAdmissaoForm.valid) {
      const p = Object.assign({}, this.tipoDeAdmissao, this.tipoDeAdmissaoForm.value);

      this.tipoDeAdmissaoService.adicionarTipoDeAdmissao(p)
        .subscribe(
          result => {
            if (result) {
                this.swal.showSwalSuccess('Tipo de Admissão adicionado com sucesso!');
                this.router.navigate(['tipoadmissao/lista']);
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
    this.router.navigate(['tipoadmissao/lista']);
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.tipoDeAdmissaoService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => this.errors);
  }

}
