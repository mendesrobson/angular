import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Subscription, Observable } from 'rxjs';
import { EstadoCivil } from '../models/estadocivil';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { EstadocivilService } from '../estadocivil.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reativar-estadocivil',
  templateUrl: './reativar-estadocivil.component.html',
  styleUrls: []
})
export class ReativarEstadocivilComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  swal: SweetAlertAdviceService;

  private _sub: Subscription;
  public _estadoCivil: EstadoCivil;
  public _estadoCivilId: string;
  public _errors: any[] = [];
  public _estadoCivilForm: FormGroup;

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private estadoCivilService: EstadocivilService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {

    this.genericValidator = new GenericValidator(this.validationMessages);
    this._estadoCivil = new EstadoCivil();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit(): void {
    this._estadoCivilForm = this.fb.group({
      codigo: [],
      sigla: [],
      codigoNis:[],
      codigoESocial:[],
      descricao: []
    });

    this._sub = this.route.params.subscribe(
      params => {
        this._estadoCivilId = params['id'];
        this.obterEstadoCivil(this._estadoCivilId);
      });

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    var self = this;
    this.swal.showSwalConfirm('Reativação', function (isConfirmed) {
      if (isConfirmed) {
        self.reativarEstadoCivil();
      }
      else {
        self.cancelar();
      }
    });
  }

  obterEstadoCivil(id: string) {
    this.estadoCivilService.obterEstadoCivil(id)
      .subscribe(
        estadocivil => this.preencherFormEstadoCivil(estadocivil),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
  }

  preencherFormEstadoCivil(estadoCivil: EstadoCivil): void {
    this._estadoCivil = estadoCivil;

    this._estadoCivilForm.patchValue({
      codigo: this._estadoCivil.codigo,
      codigoNis: this._estadoCivil.codigoNis,
      codigoESocial: this._estadoCivil.codigoESocial,
      sigla: this._estadoCivil.sigla,
      descricao: this._estadoCivil.descricao
    });
  }

  cancelar() {
    this.router.navigate(['estadocivil/editar/' + this._estadoCivilId]);
  }

  reativarEstadoCivil() {
    this.estadoCivilService.ReativarEstadoCivil(this._estadoCivil)
      .subscribe(
        () => {
          this.swal.showSwalSuccess('Estado Civil reativado com sucesso!');
          this.router.navigate(['estadocivil']);
        }, () => this._errors
      );
  }
}