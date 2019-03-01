import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EstadoCivil } from './../models/estadocivil';
import { Subscription, Observable } from 'rxjs';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { EstadocivilService } from '../estadocivil.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-estadocivil',
  templateUrl: './editar-estadocivil.component.html',
  styleUrls: []
})
export class EditarEstadocivilComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public estadoCivil: EstadoCivil;
  public estadoCivilForm: FormGroup;
  public sub: Subscription;

  public estadoCivilId: string = "";

  swal: SweetAlertAdviceService;

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public removerVisivel: boolean = false;
  public reativarVisivel: boolean = false;

  public errors: any[] = [];

  constructor(
    private estadoCivilService: EstadocivilService,
    private fb: FormBuilder,
    private router: Router,
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
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.estadoCivil = new EstadoCivil();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit(): void {
    this.estadoCivilForm = this.fb.group({
      codigo: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      sigla: [''],
      codigoNis:[''],
      codigoESocial:[''],
      descricao: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.estadoCivilId = params['id'];
        this.obterEstadoCivil(this.estadoCivilId);
      });
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.estadoCivilForm);
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
    this.estadoCivil = estadoCivil;

    this.reativarVisivel = this.estadoCivil.excluido === 'S';
    this.removerVisivel = this.estadoCivil.excluido === 'N';

    this.estadoCivilForm.patchValue({
      codigo: this.estadoCivil.codigo,
      sigla: this.estadoCivil.sigla,
      codigoNis:this.estadoCivil.codigoNis,
      codigoESocial:this.estadoCivil.codigoESocial,
      descricao: this.estadoCivil.descricao
    });
  }

  editarEstadoCivil() {
    if (this.estadoCivilForm.dirty && this.estadoCivilForm.valid) {

      let p = Object.assign({}, this.estadoCivil, this.estadoCivilForm.getRawValue());

      this.estadoCivilService.AtualizarEstadoCivil(p)
        .subscribe(
        () => {
          this.swal.showSwalSuccess('Estado Civil Atualizada com Sucesso!');
          this.router.navigate(['estadocivil']);
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
    this.router.navigate(['estadocivil']);
  }

  remover(id) {
    this.router.navigate(['estadocivil/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['estadocivil/reativar/' + id]);
  }

}