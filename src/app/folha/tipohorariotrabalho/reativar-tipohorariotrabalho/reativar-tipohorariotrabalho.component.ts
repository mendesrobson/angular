import { Component, OnInit, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TipoHorarioTrabalhoService } from '../tipohorariotrabalho.service';
import { Subscription } from 'rxjs/Subscription';
import { TipoHorarioTrabalho } from '../models/tipohorariotrabalho';
import { GrupoEmpresa, Empresa } from '../../../cadastros/empresa/models/empresa';

@Component({
  selector: 'app-reativar-tipohorariotrabalho',
  templateUrl: './reativar-tipohorariotrabalho.component.html',
  styleUrls: []
})
export class ReativarTipohorariotrabalhoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public reativarVisivel = false;
  public removerVisivel = false;

  public tipoHorarioTrabalho: TipoHorarioTrabalho;
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
      this.tipoHorarioTrabalho = new TipoHorarioTrabalho();
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

    ngAfterViewInit(): void {
      let controlBlurs: Observable<any>[] = this.formInputElements
        .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
  
      var self = this;
      this.swal.showSwalConfirm('Reativação', function (isConfirmed) {
        if (isConfirmed) {
          self.reativarTipoHorarioTrabalho();
        }
        else {
          self.cancelar();
        }
      });
    }

    ObterTipoHorarioTrabalho(id: string) {
      this.tipoHorarioTrabalhoService.obterTipoHorarioTrabalho(id)
        .subscribe(
          tipoHorarioTrabalho => this.preencherFormTipoHorarioTrabalho(tipoHorarioTrabalho),
          response => {
            if (response.status === 404) {
              this.router.navigate(['NotFound']);
            }
          });
    }

    preencherFormTipoHorarioTrabalho(tipohorariotrabalho: TipoHorarioTrabalho): void {
      this.tipoHorarioTrabalho = tipohorariotrabalho;
  
      this.reativarVisivel = this.tipoHorarioTrabalho.excluido === 'S';
      this.removerVisivel = this.tipoHorarioTrabalho.excluido === 'N';
  
      this.tipoHorarioTrabalhoForm.patchValue({
        id: this.tipoHorarioTrabalho.id,
        guid: 1,
        grupoEmpresaId: this.tipoHorarioTrabalho.grupoEmpresaId,
        empresaId: this.tipoHorarioTrabalho.empresaId,
        codigo: this.tipoHorarioTrabalho.codigo,
        sigla: this.tipoHorarioTrabalho.sigla,
        descricao: this.tipoHorarioTrabalho.descricao,
        excluido: this.tipoHorarioTrabalho.excluido
      });
    }

    reativarTipoHorarioTrabalho() {
      this.tipoHorarioTrabalhoService.reativarTipoHorarioTrabalho(this.tipoHorarioTrabalho)
        .subscribe(
        result => {
          if (result) {
            this.swal.showSwalSuccess('Tipo Horário Trabalho reativado com sucesso!');
          } else {
            this.swal.showSwalErro('Ocorreu um erro ao Reativar!');
          }        
          this.router.navigate(['tipohorariotrabalho/lista']);
        },
        error => {
          console.error(error)
        });
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
      this.router.navigate(['tipohorariotrabalho/editar/' + this.tipoHorarioTrabalhoId]);
    }

}
