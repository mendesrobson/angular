import { Component, OnInit, ElementRef, AfterViewInit, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { TipoEndereco } from '../models/tipoendereco';
import { TipoEnderecoService } from '../tipoendereco.service';

@Component({
  selector: 'app-editar-tipoendereco',
  templateUrl: './editar-tipoendereco.component.html',
  styleUrls: []
})
export class EditarTipoenderecoComponent implements OnInit, AfterViewInit {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  
    public removerVisivel: boolean = false;
    public reativarVisivel: boolean = false;
  
    public tipoEndereco: TipoEndereco;
    public tipoEnderecoForm: FormGroup;
    public tipoEnderecoId: string = "";
  
    displayMessage: { [key: string]: string } = {};
  
    public sub: Subscription;
    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;
    swal: SweetAlertAdviceService;
    public errors: any[] = [];
  
    private result = {};
  
    constructor(
      private tipoEnderecoService: TipoEnderecoService,
      private fb: FormBuilder,
      private router: Router,
      private route: ActivatedRoute) {
  
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
  
      };
  
      this.genericValidator = new GenericValidator(this.validationMessages);
      this.tipoEndereco = new TipoEndereco();
      this.swal = new SweetAlertAdviceService();
    }
  
    ngOnInit() {
      this.tipoEnderecoForm = this.fb.group({
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
        excluido: 'N'
      });
  
  
  
      this.sub = this.route.params.subscribe(
        params => {
          this.tipoEnderecoId = params['id'];
          this.obterTipoEndereco(this.tipoEnderecoId);
        });
        
    }
  
    ngAfterViewInit(): void {
      let controlBlurs: Observable<any>[] = this.formInputElements
        .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
  
      Observable.merge(...controlBlurs).subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.tipoEnderecoForm);
      });
    }
  
    obterTipoEndereco(id: string) {
      this.tipoEnderecoService.ObterTipoEnderecoPorId(id)
        .subscribe(
        tipoEndereco => this.preencherFormTipoEndereco(tipoEndereco),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
    }
  
    preencherFormTipoEndereco(tipoEndereco: TipoEndereco): void {
      this.tipoEndereco = tipoEndereco;
  
      this.reativarVisivel = this.tipoEndereco.excluido === 'S';
      this.removerVisivel = this.tipoEndereco.excluido === 'N';
  
      this.tipoEnderecoForm.patchValue({
        id: this.tipoEndereco.id,
        codigo: this.tipoEndereco.codigo,
        sigla: this.tipoEndereco.sigla,
        descricao: this.tipoEndereco.descricao,
        excluido: this.tipoEndereco.excluido  
      });
    }
  
    editarTipoEndereco() {
      if (this.tipoEnderecoForm.dirty && this.tipoEnderecoForm.valid) {
        let p = Object.assign({}, this.tipoEndereco, this.tipoEnderecoForm.value);
  
        this.tipoEnderecoService.AtualizarTipoEndereco(p)
          .subscribe(
          result => {
            this.swal.showSwalSuccess('Tipo de Endereco, Atualizado com Sucesso');
            this.router.navigate(['tipoendereco/lista']);
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
      this.router.navigate(['tipoendereco/lista']);
    }
  
    remover(id) {
      this.router.navigate(['tipoendereco/excluir/' + id]);
    }
  
    reativar(id) {
      this.router.navigate(['tipoendereco/reativar/' + id]);
    }
  
  }
