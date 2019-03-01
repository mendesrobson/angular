import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Nacionalidade } from '../models/nacionalidade';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { Pais } from '../../../cadastros/pessoa/models/pessoa';
import { Subscription } from 'rxjs';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { NacionalidadeService } from '../nacionalidade.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-excluir-nacionalidade',
  templateUrl: './excluir-nacionalidade.component.html',
  styleUrls: []
})

export class ExcluirNacionalidadeComponent implements OnInit, AfterViewInit {
  [x: string]: any;
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

      var self = this;
      this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
        if (isConfirmed) {
          self.removerNacionalidade();
        }
        else {
          self.cancelar();
        }
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

  removerNacionalidade() {
    this.nacionalidadeService.removerNacionalidade(this.nacionalidade)
      .subscribe(
        result => {
          if (result) {
            this.swal.showSwalSuccess('Nacionalidade Removida com Sucesso!');
          } else {
            this.swal.showSwalErro('Ocorreu um erro ao Remover!');
          }
          this.router.navigate(['nacionalidades/lista']);
        },
        error => {
          console.error(error)
        });
  }

  cancelar() {
    this.router.navigate(['nacionalidades/editar/' + this.nacionalidadeId]);
  }
}



