import { Component, OnInit, ElementRef, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, Validators } from '@angular/forms';
import { TipoJornada } from './../models/tipojornada';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';
import { Subscription } from 'rxjs/Subscription';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { TipoJornadaService } from '../tipojornada.service';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-tipojornada',
  templateUrl: './editar-tipojornada.component.html',
  styleUrls: []
})
export class EditarTipojornadaComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public removerVisivel = false;
  public reativarVisivel = false;

  public tipoJornada: TipoJornada;
  public tipoJornadaForm: FormGroup;
  public TipoJornadaId = "";

  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  private result = {};


  constructor(
    private tipoJornadaService: TipoJornadaService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {
      this.validationMessages = {
        grupoEmpresaId:
        {
          required: 'Grupo requerido.'
        },
        empresaId: {
          required: 'Empresa requerida.'
        },
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
      this.tipoJornada = new TipoJornada();
      this.swal = new SweetAlertAdviceService();
     }

     ngOnInit() {
      this.tipoJornadaForm = this.fb.group({
        id: 0,
        grupoEmpresaId: ['', [Validators.required]],
        empresaId: ['', [Validators.required]],
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

      this.tipoJornadaService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas;
      },
      error => this.errors);

      this.tipoJornadaService.obterTodosEmpresa()
      .subscribe(empresas => {
        this.empresas = empresas;
      },
      error => this.errors);

      this.sub = this.route.params.subscribe(
        params => {
          this.TipoJornadaId = params['id'];
          this.obterTipoJornada(this.TipoJornadaId);
        });
   }

   obterTipoJornada(id: string) {
    this.tipoJornadaService.obterTipoJornada(id)
      .subscribe(
      tipoJornada => this.preencherFormTipoJornada(tipoJornada),
      response => {
        if (response.status === 404) {
          this.router.navigate(['NotFound']);
        }
      });
  }

  preencherFormTipoJornada(tipoJornada: TipoJornada): void {
    this.tipoJornada = tipoJornada;

    this.reativarVisivel = this.tipoJornada.excluido === 'S';
    this.removerVisivel = this.tipoJornada.excluido === 'N';
    !this.removerVisivel ? this.tipoJornadaForm.disable() : this.tipoJornadaForm.enable();

    this.tipoJornadaForm.patchValue({
      id: this.tipoJornada.id,
      grupoEmpresaId: this.tipoJornada.grupoEmpresaId,
      empresaId: this.tipoJornada.empresaId,
      codigo: this.tipoJornada.codigo,
      sigla: this.tipoJornada.sigla,
      descricao: this.tipoJornada.descricao,
      excluido: this.tipoJornada.excluido
    });
  }

  editarTipoJornada() {
    if (this.tipoJornadaForm.dirty && this.tipoJornadaForm.valid) {
      const p = Object.assign({}, this.tipoJornada, this.tipoJornadaForm.value);

      this.tipoJornadaService.atualizarTipoJornada(p)
        .subscribe(
        result => {
          this.swal.showSwalSuccess('Tipo Jornada Atualizado com Sucesso');
          this.router.navigate(['tipojornada/lista']);
        },
        error => {
          console.error(error);
        });
    }
  }
  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['tipojornada/lista']);
  }

  remover(id) {
    this.router.navigate(['tipojornada/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['tipojornada/reativar/' + id]);
  }

}
