import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { TipoHorarioTrabalho } from '../models/tipohorariotrabalho';
import { GrupoEmpresa, Empresa } from '../../../contasreceber/alterarvencimentolote/models/parcela';
import { TipoHorarioTrabalhoService } from '../tipohorariotrabalho.service';

@Component({
  selector: 'app-adicionar-tipohorariotrabalho',
  templateUrl: './adicionar-tipohorariotrabalho.component.html',
  styleUrls: []
})
export class AdicionarTipohorariotrabalhoComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public tipoHorarioTrabalho: TipoHorarioTrabalho;
  public tipoHorarioTrabalhoForm: FormGroup;
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private tipoHorarioTrabalhoService: TipoHorarioTrabalhoService,
    private fb: FormBuilder,
    private router: Router) {

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

      this.tipoHorarioTrabalhoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      },
        error => this.errors);
    
    }

    ngAfterViewInit(): void {
      const controlBlurs: Observable<any>[] = this.formInputElements
        .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
      Observable.merge(...controlBlurs).subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.tipoHorarioTrabalhoForm);
      });
    }

    adicionarTipoHorarioTrabalho() {
      if (this.tipoHorarioTrabalhoForm.dirty && this.tipoHorarioTrabalhoForm.valid) {
        const p = Object.assign({}, this.tipoHorarioTrabalho, this.tipoHorarioTrabalhoForm.value);
  
        this.tipoHorarioTrabalhoService.adicionarTipoHorarioTrabalho(p)
          .subscribe(
            result => {
              if (result) {
                  this.swal.showSwalSuccess('Tipo Horário Trabalho adicionado com sucesso!');
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

    onError(error) {
      this.errors = JSON.parse(error._body).errors;
    }
  
    cancelar() {
      this.router.navigate(['tipohorariotrabalho/lista']);
    }
  
    ConsultaEmpresa(idGrupo) {
      this.empresas = [];
      this.tipoHorarioTrabalhoService.obterTodosEmpresa(idGrupo)
        .subscribe(empresas => {
          this.empresas = empresas
        },
          () => this.errors);
    }

}
