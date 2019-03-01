import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators, MaxLengthValidator } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TipoHorarioTrabalhoService } from '../tipohorariotrabalho.service';
import { TipoHorarioTrabalho } from '../models/tipohorariotrabalho';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';

@Component({
  selector: 'app-editar-tipohorariotrabalho',
  templateUrl: './editar-tipohorariotrabalho.component.html',
  styleUrls: []
})
export class EditarTipohorariotrabalhoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public reativarVisivel = false;
  public removerVisivel = false;

  public tipohorariotrabalho: TipoHorarioTrabalho;
  public tipoHorarioTrabalhoForm: FormGroup;
  public tipoHorarioTrabalhoId: "";
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private tipoHorarioTrabalhoService: TipoHorarioTrabalhoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) { 

      this.validationMessages = {

        descricao: {
          required: 'Descrição requerida!',
          minlength: 'A Descrição deve ter no mínimo 3 caracteres!',
          maxlength: 'A Descrição deve ter no máximo 100 caracteres!'
        },
        codigo:{
          required: 'Código requerido!',
          maxlength:'O Código deve ter no máximo 20 caracteres!'
        }
      };
  
      this.genericValidator = new GenericValidator(this.validationMessages);
      this.tipohorariotrabalho = new TipoHorarioTrabalho();
      this.swal = new SweetAlertAdviceService();

    }

    ngOnInit() {

      this.tipoHorarioTrabalhoForm = this.fb.group({
        id: 0,
        guid: 1,
        grupoEmpresaId: [''],
        empresaId: [''],
        codigo: ['', [Validators.required]],
        sigla: [''],
        descricao: ['', [Validators.required]],
        excluido: 'N'
      });

      this.sub = this.route.params.subscribe(
        params => {
          this.tipoHorarioTrabalhoId = params['id'];
          this.ObterTipoHorarioTrabalho(this.tipoHorarioTrabalhoId);
        });

      this.tipoHorarioTrabalhoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);
    
    }

    ObterTipoHorarioTrabalho(id: string) {
      this.tipoHorarioTrabalhoService.obterTipoHorarioTrabalho(id)
        .subscribe(
          tipohorariotrabalho => this.preencherFormTipoHorarioTrabalho(tipohorariotrabalho),
          response => {
            if (response.status === 404) {
              this.router.navigate(['NotFound']);
            }
            
          });
    }

    preencherFormTipoHorarioTrabalho(tipohorariotrabalho: TipoHorarioTrabalho): void {
      this.tipohorariotrabalho = tipohorariotrabalho;
  
      this.reativarVisivel = this.tipohorariotrabalho.excluido === 'S';
      this.removerVisivel = this.tipohorariotrabalho.excluido === 'N';
      !this.removerVisivel ? this.tipoHorarioTrabalhoForm.disable() : this.tipoHorarioTrabalhoForm.enable();
  
      this.tipoHorarioTrabalhoForm.patchValue({
        id: this.tipohorariotrabalho.id,
        guid: 1,
        grupoEmpresaId: this.tipohorariotrabalho.grupoEmpresaId,
        empresaId: this.tipohorariotrabalho.empresaId,
        codigo: this.tipohorariotrabalho.codigo,
        sigla: this.tipohorariotrabalho.sigla,
        descricao: this.tipohorariotrabalho.descricao,
        excluido: this.tipohorariotrabalho.excluido
      });
    }

    ngAfterViewInit(): void {
      const controlBlurs: Observable<any>[] = this.formInputElements
        .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
      Observable.merge(...controlBlurs).subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.tipoHorarioTrabalhoForm);
      });
    }

    editarTipoHorarioTrabalho() {
      if (this.tipoHorarioTrabalhoForm.dirty && this.tipoHorarioTrabalhoForm.valid) {
        const p = Object.assign({}, this.tipohorariotrabalho, this.tipoHorarioTrabalhoForm.value);
  
        this.tipoHorarioTrabalhoService.atualizarTipoHorarioTrabalho(p)
          .subscribe(
            result => {
              if (result) {
                  this.swal.showSwalSuccess('Tipo Horário Trabalho atualizado com sucesso!');
                  this.router.navigate(['tipohorariotrabalho/lista']);
              } else {
                  this.swal.showSwalErro('Ocorreu um erro ao gravar!');
              }
  
          },
          error => {
              console.error(error)
          })
      }
    }

    ConsultaEmpresa(idGrupo) {
      this.empresas = [];
      this.tipoHorarioTrabalhoService.obterTodosEmpresa(idGrupo)
        .subscribe(empresas => {
          this.empresas = empresas
        },
          () => this.errors);
    }

    onError(error) {
      this.errors = JSON.parse(error._body).errors;
    }
  
    cancelar() {
      this.router.navigate(['tipohorariotrabalho/lista']);
    }
  
    remover(id) {
      this.router.navigate(['tipohorariotrabalho/excluir/' + id]);
    }
  
    reativar(id) {
      this.router.navigate(['tipohorariotrabalho/reativar/' + id]);
    }

}
