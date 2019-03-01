import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { CustomValidators, CustomFormsModule } from 'ng2-validation';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { CorRaca } from '../models/corraca';
import { CorRacaService } from '../corraca.service';

@Component({
  selector: 'app-adicionar-corraca',
  templateUrl: './adicionar-corraca.component.html',
  styleUrls: []
})
export class AdicionarCorRacaComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public corRaca: CorRaca;
  public corRacaForm: FormGroup;

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private corRacaService: CorRacaService,
    private fb: FormBuilder,
    private router: Router) { 

      this.validationMessages = {
        
        codigo: {
          required: 'Código requerido!',
          minlength: 'O Código deve ter no mínimo 2 caracteres!',
          maxlength: 'O Código deve ter no máximo 20 caracteres!'
        },
        sigla: {
          required: 'Sigla requerida!',
          minlength: 'A Sigla deve ter no mínimo 2 caracteres!',
          maxlength: 'A Sigla deve ter no máximo 20 caracteres!'
        },
        descricao: {
          required: 'Descrição requerida!',
          minlength: 'A Descrição deve ter no mínimo 3 caracteres!',
          maxlength: 'A Descrição deve ter no máximo 100 caracteres!'
        },
        codigoNis: {
          required: 'Código NIS requerido!'
        },
        codigoESocial: {
          required: 'Código E-Social requerido!',
          maxlength: 'O Código E-Social deve ter no máximo 5 caracteres!'
        },
      };
  
      this.genericValidator = new GenericValidator(this.validationMessages);
      this.corRaca = new CorRaca();
      this.swal = new SweetAlertAdviceService();
    }

    ngOnInit(): void {
      this.corRacaForm = this.fb.group({
        id: 0,
        codigo: ['', [Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)]],
        sigla: ['', [Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)]],
        descricao: ['', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)]],
        codigoNis: ['', [Validators.required]],
        codigoESocial: ['', [Validators.required,
        Validators.maxLength(5)]],
        excluido: 'N'
      });
  
    }

    ngAfterViewInit(): void {
      let controlBlurs: Observable<any>[] = this.formInputElements
        .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
  
      Observable.merge(...controlBlurs).subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.corRacaForm);
      });
    }

    adicionarCorRaca() {
      if (this.corRacaForm.dirty && this.corRacaForm.valid) {
        let p = Object.assign({}, this.corRaca, this.corRacaForm.value);
  
        this.corRacaService.AdicionarCorRaca(p)
          .subscribe(
            result => {
              this.swal.showSwalSuccess('Cor/Raça adicionado com sucesso!');
              this.router.navigate(['corraca/lista']);
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
      this.router.navigate(['corraca/lista']);
    }

}
