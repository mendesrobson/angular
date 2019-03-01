import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { TipoLogradouroService } from '../tipologradouro.service';
import { TipoLogradouro } from '../models/tipologradouro';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';



@Component({
  selector: 'app-excluir-tipologradouro',
  templateUrl: './excluir-tipologradouro.component.html',
  styleUrls: []
})
export class ExcluirTipologradouroComponent implements OnInit, AfterViewInit {
  [x: string]: any;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public removerVisivel: boolean = false;
  public reativarVisivel: boolean = false;

  public tipoLogradouro: TipoLogradouro;
  public tipoLogradouroForm: FormGroup;
  public tipoLogradouroId: string = "";

  displayMessage: { [key: string]: string } = {};

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  private result = {};

  constructor(
    private tipoLogradouroService: TipoLogradouroService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {

    this.validationMessages = {
      codigo: {
        required: 'O Código é requerido.',
        minlength: 'O Código precisa ter no mínimo 2 caracteres',
        maxlength: 'O Código precisa ter no máximo 20 caracteres'
      },
      sigla: {
        required: 'A Sigla é requerida.',
        minlength: 'A Sigla precisa ter no mínimo 1 caracteres',
        maxlength: 'A Sigla precisa ter no máximo 10 caracteres'
      },
      abreviacao: {
        required: 'A Abreviação é requerida.',
        minlength: 'A Abreviação precisa ter no mínimo 2 caracteres',
        maxlength: 'A Abreviação precisa ter no máximo 10 caracteres'
      },
      descricao: {
        required: 'A Descrição é requerida.',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      },

    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.tipoLogradouro = new TipoLogradouro();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit() {
    this.tipoLogradouroForm = this.fb.group({
      codigo: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      sigla: ['', [Validators.required,
      Validators.minLength(1),
      Validators.maxLength(10)]],
      abreviacao:[''],
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]]
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.tipoLogradouroId = params['id'];
        this.obterTipoLogradouro(this.tipoLogradouroId);
      });
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerTipoLogradouro();
      }
      else {
        self.cancelar();
      }
    });
  }

  obterTipoLogradouro(id: string) {
    this.tipoLogradouroService.obterTipoLogradouro(id)
      .subscribe(
        tipologradouro => this.preencherFormTipoLogradouro(tipologradouro),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
  }

  preencherFormTipoLogradouro(tipologradouro: TipoLogradouro): void {
    this.tipoLogradouro = tipologradouro;

    this.reativarVisivel = this.tipoLogradouro.excluido === 'S';
    this.removerVisivel = this.tipoLogradouro.excluido === 'N';

    this.tipoLogradouroForm.patchValue({
      codigo: this.tipoLogradouro.codigo,
      sigla: this.tipoLogradouro.sigla,
      descricao: this.tipoLogradouro.descricao
    });
  }

  removerTipoLogradouro() {
    this.tipoLogradouroService.RemoverTipoLogradouro(this.tipoLogradouro)
      .subscribe(
        result => {
          this.swal.showSwalSuccess('Tipo de Logradouro Removido com Sucesso');
          this.router.navigate(['tipologradouro/lista']);
        },
        error => {
          console.error(error)
        });
  }

  cancelar() {
    this.router.navigate(['tipologradouro/editar/' + this.tipoLogradouroId]);
  }

}
