import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { Nacionalidade } from '../models/nacionalidade';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { Pais } from '../../../cadastros/pessoa/models/pessoa';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { NacionalidadeService } from '../nacionalidade.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-adicionar-nacionalidade',
  templateUrl: './adicionar-nacionalidade.component.html',
  styleUrls: []
})

export class AdicionarNacionalidadeComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public nacionalidade: Nacionalidade;
  public nacionalidadeForm: FormGroup;

  displayMessage: { [key: string]: string } = {};

  public paises: Pais[];

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private nacionalidadeService: NacionalidadeService,
    private fb: FormBuilder,
    private router: Router) {

    this.validationMessages = {
      paisId: {
        required: 'País requerido.'
      },
      codigo: {
        required: 'O Código é requerido.',
        minlength: 'O Código precisa ter no mínimo 2 caracteres',
        maxlength: 'O Código precisa ter no máximo 20 caracteres'
      },
      sigla: {
        required: 'A Sigla é requerida.',
        minlength: 'A Sigla precisa ter no mínimo 2 caracteres',
        maxlength: 'A Sigla precisa ter no máximo 10 caracteres'
      },
      descricao: {
        required: 'A Descrição é requerida.',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      },
      codigoCaged: {
        required: 'O Código CAGED é requerido.',
        minlength: 'O Código CAGED precisa ter no mínimo 2 caracteres',
        maxlength: 'O Código CAGED precisa ter no máximo 20 caracteres'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.nacionalidade = new Nacionalidade();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit(): void {
    this.nacionalidadeForm = this.fb.group({
      id: 0,
      paisId: ['', [Validators.required]],
      codigo: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      sigla: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(10)]],
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      codigoCaged: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      excluido: 'N'
    });

    this.nacionalidadeService.obterTodosPaisEndereco()
      .subscribe(paises => {
        this.paises = paises
      },
        () => this.errors);
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.nacionalidadeForm);
    });
  }

  adicionarNacionalidade() {
    if (this.nacionalidadeForm.dirty && this.nacionalidadeForm.valid) {
      let p = Object.assign({}, this.nacionalidade, this.nacionalidadeForm.getRawValue());

      this.nacionalidadeService.adicionarNacionalidade(p)
        .subscribe(
          result => {
            if (result) {
              this.swal.showSwalSuccess('Nacionalidade Adicionada com Sucesso!');
              this.router.navigate(['nacionalidades/lista']);
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
    this.router.navigate(['nacionalidades/lista']);
  }

}

