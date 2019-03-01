import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { Localidade } from '../models/localidade';
import { FormGroup, FormControlName, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { LocalidadeService } from './../localidade.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Uf } from '../../uf/models/uf'

@Component({
  selector: 'app-editar-localidade',
  templateUrl: './editar-localidade.component.html',
  styleUrls: []
})
export class EditarLocalidadeComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public _localidade: Localidade;
  public _localidadeForm: FormGroup;
  public sub: Subscription;

  public _localidadeId: string = "";

  swal: SweetAlertAdviceService;

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public removerVisivel: boolean = false;
  public reativarVisivel: boolean = false;

  public ufs: Uf[];

  public errors: any[] = [];

  constructor(
    private localidadeService: LocalidadeService,
    private fb: FormBuilder, private router: Router,
    private route: ActivatedRoute) {

    this.validationMessages = {
      codigo: {
        required: 'O Código é requerido.',
        minlength: 'O Código precisa ter no mínimo 2 caracteres',
        maxlength: 'O Código precisa ter no máximo 20 caracteres'
      },
      descricao: {
        required: 'A Descrição é requerida',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      },
      ufId: {
        required: 'Unidade da Federação requerido!'
      },
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this._localidade = new Localidade();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit(): void {
    this._localidadeForm = this.fb.group({
      codigo: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      sigla: [''],
      codigoIbge:['',[Validators.maxLength(6)]],
      descricao: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      ufId: [null, Validators.required]
    });

    this.localidadeService.ObterTodosUf()
    .subscribe(ufs => {
      this.ufs = ufs
    },
      () => this.errors);

    this.sub = this.route.params.subscribe(
      params => {
        this._localidadeId = params['id'];
        this.obterLocalidade(this._localidadeId);
      });
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this._localidadeForm);
    });
  }

  obterLocalidade(id: string) {
    this.localidadeService.obterLocalidade(id)
      .subscribe(
        estadocivil => this.preencherFormEstadoCivil(estadocivil),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
  }

  preencherFormEstadoCivil(localidade: Localidade): void {
    this._localidade = localidade;

    this.reativarVisivel = this._localidade.excluido === 'S';
    this.removerVisivel = this._localidade.excluido === 'N';

    !this.removerVisivel ? this._localidadeForm.disable() : this._localidadeForm.enable();

    this._localidadeForm.patchValue({
      codigo: this._localidade.codigo,
      sigla: this._localidade.sigla,
      codigoIbge:this._localidade.codigoIbge,
      descricao: this._localidade.descricao,
      ufId: this._localidade.ufId
    });
  }

  editarLocalidade() {
    if (this._localidadeForm.dirty && this._localidadeForm.valid) {

      let p = Object.assign({}, this._localidade, this._localidadeForm.getRawValue());

      this.localidadeService.AtualizarLocalidade(p)
        .subscribe(
        () => {
          this.swal.showSwalSuccess('Localidade Atualizada com Sucesso!');
          this.router.navigate(['localidade']);
        }, error =>  this.onError(error))
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }
  
  cancelar() {
    this.router.navigate(['localidade']);
  }

  remover(id) {
    this.router.navigate(['localidade/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['localidade/reativar/' + id]);
  }

}
