import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Banco } from '../models/banco';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { BancoService } from '../banco.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-editar-banco',
  templateUrl: './editar-banco.component.html',
  styleUrls: []
})
export class EditarBancoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public banco: Banco;
  public bancoForm: FormGroup;
  public sub: Subscription;

  public bancoId: string = "";

  swal: SweetAlertAdviceService;

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public removerVisivel: boolean = false;
  public reativarVisivel: boolean = false;

  public errors: any[] = [];

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

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.bancoForm);
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
    
    this.reativarVisivel = this.banco.excluido === 'S';
    this.removerVisivel = this.banco.excluido === 'N';

    this.bancoForm.patchValue({
      codigo : this.banco.codigo,
      codigoBancoCentral: this.banco.codigoBancoCentral, 
      sigla : this.banco.sigla,
      descricao : this.banco.descricao
    });
  }

  editarBanco() {
    if (this.bancoForm.dirty && this.bancoForm.valid) {
      let p = Object.assign({}, this.banco, this.bancoForm.getRawValue());

      this.bancoService.ObterCodigoBanco(p.codigo)
      .subscribe(
      result => {          
        if (result[0] != undefined)  {
          if (result[0].id != p.id) {
            this.displayMessage.codigo = 'Código Existente já Adicionado!';
            this.router.navigate(['banco/editar/' + p.id]);
          } else {
            this.bancoService.ObterCodigoBancoCentral(p.codigoBancoCentral)
            .subscribe(
            result => {           
              if (result[0] != undefined) {
                if (result[0].id != p.id) {
                  this.displayMessage.codigoBancoCentral = 'Código Banco Central Existente já Adicionado!';
                  this.router.navigate(['banco/editar/' + p.id]);
                } else {
                  this.bancoService.AtualizarBanco(p)
                  .subscribe(
                  result => { 
                    this.swal.showSwalSuccess('Banco Atualizado com Sucesso');
                    this.router.navigate(['banco/lista']);
                  },
                  error => {
                    this.errors;
                  })
                }
              }
            })
          }
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['banco/lista']);
  }

  remover(id) {
    this.router.navigate(['banco/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['banco/reativar/' + id]);
  }

}
