import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { Validators, FormControlName, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router } from '@angular/router';
import { ValortransporteService } from '../valortransporte.service';
import { ValorTransporte, GrupoEmpresa, Empresa, TipoTransporte } from '../models/valortransporte';
import { MaskService } from '../../../services/mask.service';

@Component({
  selector: 'app-adicionar-valortransporte',
  templateUrl: './adicionar-valortransporte.component.html',
  providers: [MaskService],
  styleUrls: []
})
export class AdicionarValortransporteComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public valorTransporte: ValorTransporte;
  public valorTransporteForm: FormGroup;
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public tipotransportes: TipoTransporte[];

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private valorTransporteService: ValortransporteService,
    private fb: FormBuilder, private router: Router) {

    this.validationMessages = {
      descricao: {
        required: 'Descrição requerida!',
        minlength: 'A Descrição deve ter no mínimo 3 caracteres!',
        maxlength: 'A Descrição deve ter no máximo 100 caracteres!'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.valorTransporte = new ValorTransporte();
    this.swal = new SweetAlertAdviceService();

    this.valorTransporteService.getTipotransporte()
    .subscribe(resultado => {
      this.tipotransportes = resultado;
    },() => {});
  }

  ngOnInit() {
    this.valorTransporteForm = this.fb.group({
      id: 0,
      grupoEmpresaId: [''],
      empresaId: [''],
      codigo: [''],
      sigla: [''],
      descricao: ['', [Validators.required]],
      tipotransporte:[''],
      empresaTransportadora:[''],
      trajeto:[''],
      valorUnitario:[''],
      excluido: 'N'
    });

    this.valorTransporteService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas;
      },
        () => this.errors);

    }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.valorTransporteForm);
    });
  }

  adicionarValortransporte() {
    if (this.valorTransporteForm.dirty && this.valorTransporteForm.valid) {
      let p = Object.assign({}, this.valorTransporte, this.valorTransporteForm.value);
      this.valorTransporteService.adicionarValortransporte(p)
        .subscribe(
          result => {
            if (result) {
              this.swal.showSwalSuccess('Valores dos Transportes, adicionado com sucesso!');
              this.router.navigate(['valortransporte/lista']);
            } else {
              this.swal.showSwalErro('Ocorreu um erro ao gravar!');
            }
          },
          () => { });
    }
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['valortransporte/lista']);
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.valorTransporteService.obterTodosEmpresa(idGrupo)
      .subscribe(resultado => {
        this.empresas = resultado;
      },
        () => this.errors);
  }
}

