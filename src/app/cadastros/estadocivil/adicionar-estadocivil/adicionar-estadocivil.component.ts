import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EstadoCivil } from './../models/estadocivil';
import { Subscription, Observable } from 'rxjs';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { EstadocivilService } from '../estadocivil.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-adicionar-estadocivil',
  templateUrl: './adicionar-estadocivil.component.html',
  styleUrls: []
})
export class AdicionarEstadocivilComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public _estadoCivil: EstadoCivil;
  public _estadoCivilForm: FormGroup;
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
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this._estadoCivil = new EstadoCivil();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit(): void {
    this._estadoCivilForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      sigla: [],
      codigoNis:[],
      codigoESocial:[],
      descricao: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    });
  }

  adicionarEstadoCivil() {
    if (this._estadoCivilForm.dirty && this._estadoCivilForm.valid) {
      let p = Object.assign({}, this._estadoCivil, this._estadoCivilForm.value);

      this.estadoCivilService.AdicionarEstadoCivil(p)
          .subscribe(
          () => { 
            this.swal.showSwalSuccess('Estado Civil Adicionada com Sucesso!');
            this.router.navigate(['estadocivil']);
          },error =>  this.onError(error))
    }
  }
  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  } 

  cancelar() {
    this.router.navigate(['estadocivil']);
  }
}
