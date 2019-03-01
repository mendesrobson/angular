import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Pais } from '../models/pais';
import { PaisService } from '../pais.service';

@Component({
  selector: 'app-editar-pais',
  templateUrl: './editar-pais.component.html',
  styleUrls: []
})
export class EditarPaisComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    public reativarVisivel = false;
    public removerVisivel = false;
  
    public pais: Pais;
    public paisForm: FormGroup;
    public paisId: "";
    displayMessage: { [key: string]: string } = {};
  
    public sub: Subscription;
    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;
  
    swal: SweetAlertAdviceService;
    public errors: any[] = [];

  constructor(
      private paisService: PaisService,
      private fb: FormBuilder,
      private router: Router,
      private route: ActivatedRoute) { 

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

  ngOnInit() {

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

    this.sub = this.route.params.subscribe(
      params => {
        this.paisId = params['id'];
        this.obterPais(this.paisId);
      });
  }

  obterPais(id: string) {
    this.paisService.ObterPais(id)
      .subscribe(
        pais => this.preencherFormPais(pais),
        response => {
          if (response.status === 404) {
            this.router.navigate(['NotFound']);
          }
        });
  }

  preencherFormPais(pais: Pais): void {
    this.pais = pais;

    this.reativarVisivel = this.pais.excluido === 'S';
    this.removerVisivel = this.pais.excluido === 'N';

    this.paisForm.patchValue({
      id: this.pais.id,
      codigo: this.pais.codigo,
      sigla: this.pais.sigla,
      descricao: this.pais.descricao,
      codigoReceitaFederal: this.pais.codigoReceitaFederal,
      excluido: this.pais.excluido
    });
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.paisForm);
    });
  }

  editarPais() {
    if (this.paisForm.dirty && this.paisForm.valid) {
      const p = Object.assign({}, this.pais, this.paisForm.value);

      this.paisService.AtualizarPais(p)
        .subscribe(
          result => {
            if (result) {
                this.swal.showSwalSuccess('País atualizado com sucesso!');
                this.router.navigate(['pais/lista']);
            } else {
                this.swal.showSwalErro('Ocorreu um erro ao gravar!');
            }

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

  remover(id) {
    this.router.navigate(['pais/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['pais/reativar/' + id]);
  }

}
