import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Banco } from '../models/banco';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { BancoService } from '../banco.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GenericValidator } from '../../../validation/generic-form-validator';

@Component({
  selector: 'app-excluir-banco',
  templateUrl: './excluir-banco.component.html',
  styleUrls: []
})
export class ExcluirBancoComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  swal: SweetAlertAdviceService;

  private sub: Subscription;
  public banco: Banco;
  public bancoId: string;
  public errors: any[] = [];
  public bancoForm: FormGroup;

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private bancoService: BancoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {

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

    this.sub = this.route.params.subscribe(
      params => {
        this.bancoId = params['id'];
        this.obterBanco(this.bancoId);
      });

  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    var self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerBanco();
      }
      else {
        self.cancelar();
      }
    });
  }

  obterBanco(id: string) {
    this.bancoService.obterBanco(id)
      .subscribe(
      banco => this.preencherFormBanco(banco),
      response => {
        if (response.status == 404) {
          this.router.navigate(['404']);
        }
      });
  }

  preencherFormBanco(banco: Banco): void {
    this.banco = banco;

    this.bancoForm.patchValue({
      codigo: this.banco.codigo,
      codigoBancoCentral: this.banco.codigoBancoCentral,
      sigla: this.banco.sigla,
      descricao: this.banco.descricao
    });
  }

  cancelar() {
    this.router.navigate(['banco/editar/' + this.bancoId]);
  }

  removerBanco() {
    this.bancoService.RemoverBanco(this.banco)
      .subscribe(
      result => {
        this.swal.showSwalSuccess('Banco Removido com Sucesso');
        this.router.navigate(['banco/lista']);
      },
      error => {
        error => this.errors;
      });
  }

}    