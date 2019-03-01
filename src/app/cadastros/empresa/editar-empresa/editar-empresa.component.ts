import { Component, OnInit, ViewChildren, AfterViewInit, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Empresa, GrupoEmpresa } from '../models/empresa';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { EmpresaService } from '../empresa.service';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription, Observable } from 'rxjs';
import { MaskService } from '../../../services/mask.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-editar-empresa',
  templateUrl: './editar-empresa.component.html',
  styleUrls: [],
  providers: [MaskService]
})
export class EditarEmpresaComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public empresa: Empresa;
  public empresaForm: FormGroup;
  public empresaId: string = "";
  public sub: Subscription;

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  public removerVisivel: boolean = false;
  public reativarVisivel: boolean = false;

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  public grupoEmpresas: GrupoEmpresa[];

  cnpjMask = this._maskService.Cnpj();  

  public errors: any[] = [];

  constructor(
    private empresaService: EmpresaService,
    private fb: FormBuilder,
    private _maskService: MaskService,
    private router: Router,
    private route: ActivatedRoute) {

    this.validationMessages = {
      codigo: {
        required: 'Código requerido.',
        minlength: 'O Código precisa ter no mínimo 2 caracteres',
        maxlength: 'O Código precisa ter no máximo 20 caracteres'
      },
      nome: {
        required: 'Nome requerido.'
      },
      cnpj: {
        required: 'CNPJ requerido.',
        minlength: 'A Descrição precisa ter no mínimo 14 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 14 caracteres'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.empresa = new Empresa();
    this.swal = new SweetAlertAdviceService();


  }

  ngOnInit(): void {
    console.log('entrou no init do editar-empresa')

    this.empresaForm = this.fb.group({
      grupoEmpresaId: null,
      excluido: 'N',
      codigo: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      cnpj: ['', [Validators.required,
      Validators.minLength(14),
      Validators.maxLength(14)]],
      nome: ['', [Validators.required]],
      fantasia: ''
    });



    this.sub = this.route.params.subscribe(
      params => {
        this.empresaId = params['id'];
        this.obterEmpresa(this.empresaId);
      });

    this.empresaService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
      error => this.errors);


  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.empresaForm);
    });

  }

  obterEmpresa(id: string) {
    this.empresaService.obterEmpresa(id)
      .subscribe(
      empresa => this.preencherFormEmpresa(empresa),
      response => {
        if (response.status == 404) {
          this.router.navigate(['404']);
        }
      });
  }

  preencherFormEmpresa(empresa: Empresa): void {
    this.empresa = empresa;

    this.reativarVisivel = this.empresa.excluido === 'S';
    this.removerVisivel = this.empresa.excluido === 'N';
    console.log('grupo empresa id ' + this.empresa.grupoEmpresaId)

    this.empresaForm.patchValue({
      grupoEmpresaId: this.empresa.grupoEmpresaId,
      excluido: this.empresa.excluido,
      codigo: this.empresa.pessoa.codigo,
      cnpj: this.empresa.pessoa.cnpj,
      nome: this.empresa.pessoa.nome,
      fantasia: this.empresa.pessoa.fantasia
    });

    console.log(this.empresaForm.value)


  }

  editarEmpresa() {
    if (this.empresaForm.dirty && this.empresaForm.valid) {

      let p = Object.assign({}, this.empresa, this.empresaForm.getRawValue());

      this.empresaService.atualizarEmpresa(p)
        .subscribe(
        result => {
          this.swal.showSwalSuccess('Empresa Atualizada com Sucesso!');
          this.router.navigate(['empresa/lista']);
        },
        error => {
          this.onError(error)
        })
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['empresa/lista']);
  }

  remover(id) {
    this.router.navigate(['empresa/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['empresa/reativar/' + id]);
  }
}
