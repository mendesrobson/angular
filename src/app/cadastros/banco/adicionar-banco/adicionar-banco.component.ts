import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Validators, FormBuilder, FormGroup, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

import { Banco } from '../models/banco';
import { BancoService } from '../banco.service';

@Component({
  selector: 'app-adicionar-banco',
  templateUrl: './adicionar-banco.component.html',
  styleUrls: []
})

export class AdicionarBancoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public banco: Banco;
  public bancoForm: FormGroup;

  swal: SweetAlertAdviceService;
  temCodigoBanco: Boolean;
  temCodigoBancoCentral: Boolean;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public errors: any[] = [];

  constructor(
    private bancoService: BancoService,
    private fb: FormBuilder,
    private router: Router) {

    this.validationMessages = {
      codigo: {
        required: 'O Código é requerido.',
        minlength: 'O Código precisa ter no mínimo 2 caracteres',
        maxlength: 'O Código precisa ter no máximo 20 caracteres'
      },
      codigoBancoCentral: {
        required: 'O Código Banco Central é requerido.',
        minlength: 'O Código Banco Central precisa ter no mínimo 2 caracteres',
        maxlength: 'O Código Banco Central precisa ter no máximo 20 caracteres'
      },
      descricao: {
        required: 'A Descrição é requerida',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.banco = new Banco();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit(): void {
    this.bancoForm = this.fb.group({
      codigo: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      codigoBancoCentral: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      sigla: [],
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]]
    });
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.bancoForm);
    });

  }

  adicionarBanco() {
    if (this.bancoForm.dirty && this.bancoForm.valid) {

      let p = Object.assign({}, this.banco, this.bancoForm.value);     

      this.bancoService.ObterCodigoBanco(p.codigo)
      .subscribe(
      result => {          
        if (result[0] != undefined)  {
          this.displayMessage.codigo = 'Código Existente já Adicionado!';
          this.router.navigate(['banco/adicionar']);
        } else {
          this.bancoService.ObterCodigoBancoCentral(p.codigoBancoCentral)
          .subscribe(
          result => {           
            if (result[0] != undefined) {
              this.displayMessage.codigoBancoCentral = 'Código Banco Central Existente já Adicionado!';
              this.router.navigate(['banco/adicionar']);
            } else {
              this.bancoService.AdicionarBanco(p).subscribe(
              result => {
                this.swal.showSwalSuccess('Banco Adicionado com Sucesso!');
                this.router.navigate(['banco/lista']);
              },
              error => {
                this.onError(error)
              })
            }
          })
        }
      })
      
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['banco/lista']);
  }

}

