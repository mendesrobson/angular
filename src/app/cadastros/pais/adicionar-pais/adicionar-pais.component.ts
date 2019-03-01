import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { CustomValidators, CustomFormsModule } from 'ng2-validation';
import { Observable } from 'rxjs/Observable';

import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Pais } from '../models/pais';
import { PaisService } from '../pais.service';

@Component({
  selector: 'app-adicionar-pais',
  templateUrl: './adicionar-pais.component.html',
  styleUrls: []
})
export class AdicionarPaisComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public pais: Pais;
  public paisForm: FormGroup;

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private paisService: PaisService,
    private fb: FormBuilder,
    private router: Router) {

      this.validationMessages = {
        
        codigo: {
          required: 'Código sequencial do cadastro requerido!',
          minlength: 'O Código sequencial do cadastro deve ter no mínimo 2 caracteres!',
          maxlength: 'O Código sequencial do cadastro deve ter no máximo 20 caracteres!'
        },
        sigla: {
          required: 'Sigla requerida!',
          minlength: 'A Sigla deve ter no mínimo 2 caracteres!',
          maxlength: 'A Sigla deve ter no máximo 20 caracteres!'
        },
        descricao: {
          required: 'Nome do País requerido!',
          minlength: 'O Nome do País deve ter no mínimo 3 caracteres!',
          maxlength: 'O Nome do País deve ter no máximo 100 caracteres!'
        },
        codigoReceitaFederal: {
          required: 'Código da RFB requerido!',
          maxlength: 'O Código da RFB deve ter no máximo 6 caracteres!'
        },
      };
  
      this.genericValidator = new GenericValidator(this.validationMessages);
      this.pais = new Pais();
      this.swal = new SweetAlertAdviceService();

     }

     ngOnInit(): void {
      this.paisForm = this.fb.group({
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
        codigoReceitaFederal: ['', [Validators.required,
        Validators.maxLength(6)]],
        excluido: 'N'
      });
  
    }

    ngAfterViewInit(): void {
      let controlBlurs: Observable<any>[] = this.formInputElements
        .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
  
      Observable.merge(...controlBlurs).subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.paisForm);
      });
    }

    adicionarPais() {
      if (this.paisForm.dirty && this.paisForm.valid) {
        let p = Object.assign({}, this.pais, this.paisForm.value);
  
        this.paisService.AdicionarPais(p)
          .subscribe(
            result => {
              this.swal.showSwalSuccess('País adicionado com sucesso!');
              this.router.navigate(['pais/lista']);
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
      this.router.navigate(['pais/lista']);
    }
  
}
