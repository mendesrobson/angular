import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Subscription, Observable } from 'rxjs';
import { Localidade } from './../models/localidade';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { LocalidadeService } from './../localidade.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Uf } from '../../uf/models/uf'

@Component({
  selector: 'app-reativar-localidade',
  templateUrl: './reativar-localidade.component.html',
  styleUrls: []
})
export class ReativarLocalidadeComponent implements OnInit, AfterViewInit {

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
    private fb: FormBuilder,
    private router: Router,
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
        this.obterEstadoCivil(this._localidadeId);
      });

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    var self = this;
    this.swal.showSwalConfirm('Reativação', function (isConfirmed) {
      if (isConfirmed) {
        self.reativarLocalidade();
      }
      else {
        self.cancelar();
      }
    });
  }

  obterEstadoCivil(id: string) {
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

  reativarLocalidade() {
    this.localidadeService.ReativarLocalidade(this._localidade)
      .subscribe(
        () => {
          this.swal.showSwalSuccess('Localidade reativado com sucesso!');
          this.router.navigate(['localidade']);
        }, () => this._errors
      );
  }
}