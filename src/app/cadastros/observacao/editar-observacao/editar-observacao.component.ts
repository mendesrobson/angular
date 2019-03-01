import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { Observacao } from '../models/observacao';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ObservacaoService } from '../observacao.service';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Empresa, GrupoEmpresa } from '../../empresa/models/empresa';

@Component({
  selector: 'app-editar-observacao',
  templateUrl: './editar-observacao.component.html',
  styleUrls: []
})

export class EditarObservacaoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  empresas: Empresa[];
  grupoEmpresas: GrupoEmpresa[];

  public removerVisivel: boolean = false;
  public reativarVisivel: boolean = false;

  public observacao: Observacao;
  public observacaoForm: FormGroup;
  public observacaoId: string = "";

  displayMessage: { [key: string]: string } = {};
 
  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  swal: SweetAlertAdviceService;

  private result = {};
  public errors: any[] = [];
  
  constructor(
    private observacaoService: ObservacaoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {

    this.validationMessages = {
        codigo: {
          required: 'O Código é requerido.',
          minlength: 'O Código precisa ter no mínimo 2 caracteres',
          maxlength: 'O Código precisa ter no máximo 20 caracteres'
        },
        descricao: {
            required: 'A Descrição é requerida',
            minlength: 'A Descrição precisa ter no mínimo 3 caracteres',
            maxlength: 'A Descrição precisa ter no máximo 100 caracteres'
          },
        empresaId: {
          required: 'Informe a Empresa'
        },  
        grupoEmpresaId: {
          required: 'Informe o Grupo'
        }  
    };
  
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.observacao = new Observacao();
    this.swal = new SweetAlertAdviceService();
  }
  
  ngOnInit() {
    
    this.observacaoForm = this.fb.group({
      codigo: ['', [Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)]],
      descricao: ['', [Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)]],
      observacaoComplementar : '',  
      empresaId: ['', [Validators.required]],
      grupoEmpresaId: ['', [Validators.required]] });
   
    this.sub = this.route.params.subscribe(
        params => {
          this.observacaoId = params['id'];
          this.obterObservacao(this.observacaoId);
        });

    this.observacaoService.obterTodosGrupoEmpresa()
        .subscribe(grupoEmpresas => {
            this.grupoEmpresas = grupoEmpresas
            }, 
         error => this.errors);
   }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.observacaoForm);
    });
  }

  obterObservacao(id: string) {
      this.observacaoService.obterObservacao(id)
        .subscribe(            
          observacao => this.preencherFormObservacao(observacao),
        response => {
          if (response.status == 404) {
            this.router.navigate(['404']);
          }
        });
   }
  
  preencherFormObservacao(observacao: Observacao): void {
      this.observacao = observacao;
      
      this.reativarVisivel = this.observacao.excluido === 'S';
      this.removerVisivel = this.observacao.excluido === 'N';

      this.observacaoForm.controls['codigo'].disable();

      this.observacaoForm.patchValue({
        codigo: this.observacao.codigo,
        descricao: this.observacao.descricao,
        observacaoComplementar: this.observacao.observacaoComplementar,
        empresaId: this.observacao.empresaId,
        grupoEmpresaId: this.observacao.grupoEmpresaId,
      });
  }

  editarObservacao() {
    if (this.observacaoForm.dirty && this.observacaoForm.valid) {
      let p = Object.assign({}, this.observacao, this.observacaoForm.value);
      
      this.observacaoService.atualizarObservacao(p)
      .subscribe(
      result => { 
        this.swal.showSwalSuccess('Observação Atualizada com Sucesso');
        this.router.navigate(['observacao/lista']);
      },
      error => {
          this.errors;
      })
    }
  }

  ConsultaEmpresa(idGrupo){

    this.empresas = [];
    this.observacaoService.obterTodosEmpresaPorGrupo(idGrupo)
        .subscribe(empresas => {
            this.empresas = empresas
        },
            () => this.errors);
}


  cancelar() {
    this.router.navigate(['observacao/lista']);
  }

  remover(id) {
    this.router.navigate(['observacao/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['observacao/reativar/' + id]);
  }

}
