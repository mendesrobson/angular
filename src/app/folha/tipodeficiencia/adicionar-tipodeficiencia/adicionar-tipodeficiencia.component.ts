import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GrupoEmpresa, Empresa } from '../../../contasreceber/alterarvencimentolote/models/parcela';
import { TipoDeficienciaService } from '../tipodeficiencia.service';
import { TipoDeficiencia } from '../models/tipodeficiencia';

@Component({
  selector: 'app-adicionar-tipodeficiencia',
  templateUrl: './adicionar-tipodeficiencia.component.html',
  styleUrls: []
})
export class AdicionarTipodeficienciaComponent implements OnInit , AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public tipoDeficiencia: TipoDeficiencia;
  public tipoDeficienciaForm: FormGroup;
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private tipoDeficienciaService: TipoDeficienciaService,
    private fb: FormBuilder,
    private router: Router) {

    this.validationMessages = {
     codigo: {
        required: 'Código requerido!',
        maxlength: 'O código deve ter no Máximo 5 caracteres!'
      },
      descricao: {
        required: 'Descrição requerida!',
        minlength: 'A Descrição deve ter no mínimo 3 caracteres!',
        maxlength: 'A Descrição deve ter no máximo 100 caracteres!'
      },
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.tipoDeficiencia = new TipoDeficiencia();
    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit() {

    this.tipoDeficienciaForm = this.fb.group({
      id: 0,
      guid: 1,
      grupoEmpresaId: 0,
      empresaId: 0,
      codigo: ['', [Validators.required]],
      sigla: [''],
      descricao: ['', [Validators.required]],
      codigoRais: [''],
      codigoESocial: [''],
      codigoCaged: [''],
      excluido: 'N'
    });

    this.tipoDeficienciaService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas;
      },
        error => this.errors);
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.tipoDeficienciaForm);
    });
  }

  adicionarTipoDeficiencia() {
    if (this.tipoDeficienciaForm.dirty && this.tipoDeficienciaForm.valid) {
      const p = Object.assign({}, this.tipoDeficiencia, this.tipoDeficienciaForm.value);

      this.tipoDeficienciaService.adicionarTipoDeficiencia(p)
        .subscribe(
          result => {
            if (result) {
                this.swal.showSwalSuccess('Tipo de Deficiência adicionado com sucesso!');
                this.router.navigate(['tipodeficiencia/lista']);
            } else {
                this.swal.showSwalErro('Ocorreu um erro ao gravar!');
            }

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
    this.router.navigate(['tipodeficiencia/lista']);
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.tipoDeficienciaService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas;
      },
        () => this.errors);
  }

}
