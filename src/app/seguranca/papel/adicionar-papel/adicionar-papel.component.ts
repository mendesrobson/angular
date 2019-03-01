import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '../../../../../node_modules/@angular/forms';
import { Papel } from '../models/papel';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { PapelService } from '../papel.service';
import { Router } from '../../../../../node_modules/@angular/router';
import { Observable } from '../../../../../node_modules/rxjs';

@Component({
  selector: 'app-adicionar-papel',
  templateUrl: './adicionar-papel.component.html',
  styleUrls: []
})

export class AdicionarPapelComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public papel: Papel;
  public papelForm: FormGroup;

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private papelService: PapelService,
    private fb: FormBuilder,
    private router: Router) {

    this.validationMessages = {
      nome: {
        required: 'A Descrição é requerida.',
        minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.papel = new Papel();
    this.swal = new SweetAlertAdviceService();
  }

  ngOnInit(): void {
    this.papelForm = this.fb.group({
      papelId: 0,
      nome: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)]]
    });

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.papelForm);
    });
  }

  adicionarPapel() {
    if (this.papelForm.dirty && this.papelForm.valid) {
      let p = Object.assign({}, this.papel, this.papelForm.value);
      this.papelService.adicionarPapel(p)
        .subscribe(
          result => {
            this.swal.showSwalSuccess('Papel Adicionado com Sucesso!');
            this.router.navigate(['papel/lista']);
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
    this.router.navigate(['papel/lista']);
  }

}


