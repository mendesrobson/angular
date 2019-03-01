import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Subscription, Observable } from 'rxjs';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { LocalidadeService } from '../localidade.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Localidade } from './../models/localidade';
import { Uf } from '../../uf/models/uf'

@Component({
  selector: 'app-excluir-localidade',
  templateUrl: './excluir-localidade.component.html',
  styleUrls: []
})
export class ExcluirLocalidadeComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  swal: SweetAlertAdviceService;

  private _sub: Subscription;
  public _localidade: Localidade;
  public _localidadeId: string;
  public _errors: any[] = [];
  public _localidadeForm: FormGroup;

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public ufs: Uf[];
  public errors: any[] = [];

  constructor(
    private localidadeService: LocalidadeService,
    private fb: FormBuilder, private router: Router,
    private route: ActivatedRoute) {

    this.genericValidator = new GenericValidator(this.validationMessages);
    this._localidade = new Localidade();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit(): void {
    this._localidadeForm = this.fb.group({
      codigo: [],
      sigla: [],
      codigoIbge:[],
      descricao: [],
      ufId: []
    });

    this.localidadeService.ObterTodosUf()
    .subscribe(ufs => {
      this.ufs = ufs
    },
      () => this.errors);

    this._sub = this.route.params.subscribe(
      params => {
        this._localidadeId = params['id'];
        this.obterLocalidade(this._localidadeId);
      });

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerLocalidade();
      }
      else {
        self.cancelar();
      }
    });
  }

  obterLocalidade(id: string) {
    this.localidadeService.obterLocalidade(id)
      .subscribe(
      localidade => this.preencherFormLocalidade(localidade),
      response => {
        if (response.status == 404) {
          this.router.navigate(['404']);
        }
      });
  }

  preencherFormLocalidade(localidade: Localidade): void {
    this._localidade = localidade;

    this._localidadeForm.patchValue({
      codigo: this._localidade.codigo,
      codigoIbge: this._localidade.codigoIbge,
      sigla: this._localidade.sigla,
      descricao: this._localidade.descricao,
      ufId: this._localidade.ufId
    });
  }

  cancelar() {
    this.router.navigate(['localidade/editar/' + this._localidadeId]);
  }

  removerLocalidade() {
    this.localidadeService.RemoverLocalidade(this._localidade)
      .subscribe(
      () => {
        this.swal.showSwalSuccess('Localidade Removido com Sucesso');
        this.router.navigate(['localidade']);
      },() => this._errors
      );
  }
}    