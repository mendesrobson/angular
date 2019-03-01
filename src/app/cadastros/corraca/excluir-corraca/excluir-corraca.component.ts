import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { CorRaca } from '../models/corraca';
import { CorRacaService } from '../corraca.service';

@Component({
  selector: 'app-excluir-corraca',
  templateUrl: './excluir-corraca.component.html',
  styleUrls: []
})
export class ExcluirCorRacaComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    public reativarVisivel = false;
    public removerVisivel = false;
  
    public corRaca: CorRaca;
    public corRacaForm: FormGroup;
    public corRacaId: "";
    displayMessage: { [key: string]: string } = {};
  
    public sub: Subscription;
    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;
  
    swal: SweetAlertAdviceService;
    public errors: any[] = [];

  constructor(
      private corRacaService: CorRacaService,
      private fb: FormBuilder,
      private router: Router,
      private route: ActivatedRoute) { 

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

      this.sub = this.route.params.subscribe(
        params => {
          this.corRacaId = params['id'];
          this.obterCorRaca(this.corRacaId);
        });
  
    }

    ngAfterViewInit(): void {
      let controlBlurs: Observable<any>[] = this.formInputElements
        .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
  
      var self = this;
      this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
        if (isConfirmed) {
          self.removerCorRaca();
        }
        else {
          self.cancelar();
        }
      });
    }

    obterCorRaca(id: string) {
      this.corRacaService.ObterCorRaca(id)
        .subscribe(
          corRaca => this.preencherFormCorRaca(corRaca),
          response => {
            if (response.status === 404) {
              this.router.navigate(['NotFound']);
            }
          });
    }

    preencherFormCorRaca(corRaca: CorRaca): void {
      this.corRaca = corRaca;
  
      this.reativarVisivel = this.corRaca.excluido === 'S';
      this.removerVisivel = this.corRaca.excluido === 'N';
  
      this.corRacaForm.patchValue({
        id: this.corRaca.id,
        codigo: this.corRaca.codigo,
        sigla: this.corRaca.sigla,
        descricao: this.corRaca.descricao,
        codigoNis: this.corRaca.codigoNis,
        codigoESocial: this.corRaca.codigoESocial,
        excluido: this.corRaca.excluido
      });
    }

    removerCorRaca() {   
      this.corRacaService.RemoverCorRaca(this.corRaca)
        .subscribe(
          result => {
            if (result) {
              this.swal.showSwalSuccess('Cor/Raça removido com sucesso!');            
            } else {
              this.swal.showSwalErro('Ocorreu um erro ao Remover!');            
            }
            this.router.navigate(['corraca/lista']);
          },
          error => {
            console.error(error)
          });
    }
  
    onError(error) {
      this.errors = JSON.parse(error._body).errors;
    }
  
    cancelar() {
      this.router.navigate(['corraca/lista']);
    }


}
