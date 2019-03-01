import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router } from '@angular/router';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Uf } from '../models/uf';
import { UfService } from '../uf.service';
import { Pais } from '../../../cadastros/pessoa/models/pessoa';


@Component({
  selector: 'app-adicionar-uf',
  templateUrl: './adicionar-uf.component.html',
  styleUrls: []
})
export class AdicionarUfComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public uf: Uf;
  public ufForm: FormGroup;
  public paises: Pais[];

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private ufService: UfService,
    private fb: FormBuilder,
    private router: Router) {

    this.validationMessages = {
      codigo: {
        required: 'O Código é requerido.',
        minlength: 'O Código precisa ter no mínimo 2 caracteres',
        maxlength: 'O Código precisa ter no máximo 20 caracteres'
      },
      sigla: {
        required: 'A Sigla é requerida.',
        minlength: 'A Sigla precisa ter no mínimo 2 caracteres',
        maxlength: 'A Sigla precisa ter no máximo 10 caracteres'
      },
      descricao: {
        required: 'A Descrição é requerida.',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      },
      paisId: {
        required: 'O País é requerido!'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.uf = new Uf();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit(): void {
    this.ufForm = this.fb.group({
      id: 0,
      codigo: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      sigla: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(10)]],
      descricao: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]],
      paisId: [null, [Validators.required]],
      excluido: 'N'
    });
    
    this.ufService.obterTodosPaisEndereco()
      .subscribe(paises => {
        this.paises = paises
      },
        () => this.errors);

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.ufForm);
    });
  }

  adicionarUf() {
    if (this.ufForm.dirty && this.ufForm.valid) {
      let p = Object.assign({}, this.uf, this.ufForm.value);

      this.ufService.AdicionarUf(p)
        .subscribe(
          result => {
            this.swal.showSwalSuccess('Uf, Adicionada com Sucesso!');
            this.router.navigate(['uf/lista']);
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
    this.router.navigate(['uf/lista']);
  }

}
