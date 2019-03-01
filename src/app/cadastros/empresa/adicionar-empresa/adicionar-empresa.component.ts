import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { MaskService } from '../../../services/mask.service';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Empresa, GrupoEmpresa } from '../models/empresa';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { EmpresaService } from '../empresa.service';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-adicionar-empresa',
  templateUrl: './adicionar-empresa.component.html',
  styleUrls: [],
  providers: [MaskService]
})
export class AdicionarEmpresaComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public empresa: Empresa;
  public empresaForm: FormGroup;

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  public grupoEmpresas: GrupoEmpresa[];


  public errors: any[] = [];

  cnpjMask = this._maskService.Cnpj();


  constructor(
    private empresaService: EmpresaService,
    private fb: FormBuilder,
    private _maskService: MaskService,
    private router: Router) {

    this.validationMessages = {
      codigo: {
        required: 'Código requerido.',
        minlength: 'O Código precisa ter no mínimo 2 caracteres',
        maxlength: 'O Código precisa ter no máximo 20 caracteres'
      },
      nome: {
        required: 'Nome requerido.'
      },
      cnpj: {
        required: 'CNPJ requerido.',
        minlength: 'A Descrição precisa ter no mínimo 14 caracteres',
        maxlength: 'A Descrição precisa ter no máximo 14 caracteres'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.empresa = new Empresa();
    this.swal = new SweetAlertAdviceService();
  }



  ngOnInit(): void {
    console.log("Oninit AdicionarEmpresaComponent");
    this.empresaForm = this.fb.group({
      grupoempresaid: null,
      excluido: 'N',
      codigo: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      cnpj: ['', [Validators.required]],
      nome: ['', [Validators.required]],
      fantasia: ''
    });

    this.empresaService.obterTodosGrupoEmpresa()
    .subscribe(grupoEmpresas => {
      this.grupoEmpresas = grupoEmpresas
    },
    error => this.errors);    
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.empresaForm);
    });

  }  

  adicionarEmpresa() {
    if (this.empresaForm.dirty && this.empresaForm.valid) {

      let p = Object.assign({}, this.empresa, this.empresaForm.getRawValue());

      this.empresaService.adicionaEmpresa(p)
      .subscribe(
        result => {
          this.swal.showSwalSuccess('Empresa Adicionada com Sucesso!');
          this.router.navigate(['empresa/lista']);
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
    this.router.navigate(['empresa/lista']);
  }  
}
