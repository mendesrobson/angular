import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MaskService } from '../../../services/mask.service';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { CoordenadorDeEstagio } from '../models/coordenadordeestagio';
import { GrupoEmpresa, Empresa } from '../../../contasreceber/alterarvencimentolote/models/parcela';
import { CoordenadorDeEstagioService } from '../coordenadordeestagio.service';

@Component({
  selector: 'app-adicionar-coordenadordeestagio',
  templateUrl: './adicionar-coordenadordeestagio.component.html',
  styleUrls: []
})
export class AdicionarCoordenadorDeEstagioComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public coordenadorDeEstagio: CoordenadorDeEstagio;
  public coordenadorDeEstagioForm: FormGroup;
  displayMessage: { [key: string]: string } = {};

  cpfMask = this._maskService.Cpf();

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private coordenadorDeEstagioService: CoordenadorDeEstagioService,
    private fb: FormBuilder,
    private router: Router,
    private _maskService: MaskService) { 

      this.validationMessages = {

        grupoEmpresaId:
        {
          required: 'Grupo requerido!'
        },
        empresaId: {
          required: 'Empresa requerida!'
        },
        cpf:{
          required: 'Cpf requerido!'
        },
        nome: {
          required: 'Nome requerido!',
          maxlength: 'O Nome deve ter no máximo 100 caracteres!'
        },
      };
  
      this.genericValidator = new GenericValidator(this.validationMessages);
      this.coordenadorDeEstagio = new CoordenadorDeEstagio();
      this.swal = new SweetAlertAdviceService();
    }

    ngOnInit() {

      this.coordenadorDeEstagioForm = this.fb.group({
        id: 0,
        guid: 1,
        grupoEmpresaId: ['', [Validators.required]],
        empresaId: ['', [Validators.required]],
        codigo: [''],
        sigla: [''],
        cpf: ['', [Validators.required]],
        nome: ['', [Validators.required]],
        excluido: 'N'
      });
  
      this.coordenadorDeEstagioService.obterTodosGrupoEmpresa()
        .subscribe(grupoEmpresas => {
          this.grupoEmpresas = grupoEmpresas
        },
          error => this.errors);
    }

    ngAfterViewInit(): void {
      const controlBlurs: Observable<any>[] = this.formInputElements
        .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
      Observable.merge(...controlBlurs).subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.coordenadorDeEstagioForm);
      });
    }

    adicionarCoordenadorDeEstagio() {
      if (this.coordenadorDeEstagioForm.dirty && this.coordenadorDeEstagioForm.valid) {
        const p = Object.assign({}, this.coordenadorDeEstagio, this.coordenadorDeEstagioForm.value);
  
        this.coordenadorDeEstagioService.adicionarCoordenadorDeEstagio(p)
          .subscribe(
            result => {
              if (result) {
                  this.swal.showSwalSuccess('Coordenador de Estágio adicionado com sucesso!');
                  this.router.navigate(['coordenadordeestagio/lista']);
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
      this.router.navigate(['coordenadordeestagio/lista']);
    }
  
    ConsultaEmpresa(idGrupo) {
      this.empresas = [];
      this.coordenadorDeEstagioService.obterTodosEmpresa(idGrupo)
        .subscribe(empresas => {
          this.empresas = empresas
        },
          () => this.errors);
    }

}
