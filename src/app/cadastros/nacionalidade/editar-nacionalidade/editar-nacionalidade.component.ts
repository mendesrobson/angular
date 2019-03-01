import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren } from '@angular/core';
import { Nacionalidade } from '../models/nacionalidade';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { Pais } from '../../../cadastros/pessoa/models/pessoa';
import { Subscription } from 'rxjs';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { NacionalidadeService } from '../nacionalidade.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-editar-nacionalidade',
  templateUrl: './editar-nacionalidade.component.html',
  styleUrls: []
})

export class EditarNacionalidadeComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public removerVisivel: boolean = false;
  public reativarVisivel: boolean = false;

  public nacionalidade: Nacionalidade;
  public nacionalidadeForm: FormGroup;

  displayMessage: { [key: string]: string } = {};
  public paises: Pais[];

  nacionalidadeId: string;

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  private result = {};

  constructor(
    private nacionalidadeService: NacionalidadeService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {

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


    this.sub = this.route.params.subscribe(
      params => {
        this.nacionalidadeId = params['id'];
        this.obterNacionalidade(this.nacionalidadeId);
      });

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.nacionalidadeForm);
    });
  }

  obterNacionalidade(id: string) {
    this.nacionalidadeService.obterNacionalidade(id)
      .subscribe(
        nacionalidade => this.preencherFormNacionalidade(nacionalidade),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
  }

  preencherFormNacionalidade(nacionalidade: Nacionalidade): void {
    this.nacionalidade = nacionalidade;

    this.reativarVisivel = this.nacionalidade.excluido === 'S';
    this.removerVisivel = this.nacionalidade.excluido === 'N';

    !this.removerVisivel ? this.nacionalidadeForm.disable() : this.nacionalidadeForm.enable();

    this.nacionalidadeForm.patchValue({
      id: this.nacionalidade.id,
      codigo: this.nacionalidade.codigo,
      sigla: this.nacionalidade.sigla,
      descricao: this.nacionalidade.descricao,
      codigoCaged: this.nacionalidade.codigoCaged,
      paisId: this.nacionalidade.paisId,
      excluido: this.nacionalidade.excluido
    });

  }

  editarNacionalidade() {
    if (this.nacionalidadeForm.dirty && this.nacionalidadeForm.valid) {
      let p = Object.assign({}, this.nacionalidade, this.nacionalidadeForm.value);

      this.nacionalidadeService.atualizarNacionalidade(p)
        .subscribe(
          result => {
            this.swal.showSwalSuccess('Nacionalidade Atualizada com Sucesso');
            this.router.navigate(['nacionalidades/lista']);
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

  remover(id) {
    this.router.navigate(['nacionalidades/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['nacionalidades/reativar/' + id]);
  }

}
