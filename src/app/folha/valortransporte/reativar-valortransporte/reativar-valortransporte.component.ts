import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValorTransporte, GrupoEmpresa, Empresa, TipoTransporte } from '../models/valortransporte';
import { Router, ActivatedRoute } from '@angular/router';
import { ValortransporteService } from '../valortransporte.service';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-reativar-valortransporte',
  templateUrl: './reativar-valortransporte.component.html',
  styleUrls: []
})
export class ReativarValortransporteComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public reativarVisivel = false;
  public removerVisivel = false;

  public valorTransporte: ValorTransporte;
  public valorTransporteForm: FormGroup;
  public valorTransporteId: "";
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];
  public tipotransportes: TipoTransporte[];

  constructor(
    private valorTransporteService: ValortransporteService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {

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
      }, () => { });

  }

  ngOnInit() {
    this.valorTransporteForm = this.fb.group({
      id: 0,
      guid: 1,
      grupoEmpresaId: [''],
      empresaId: [''],
      codigo: [''],
      sigla: [''],
      descricao: [''],
      tipotransporte: [''],
      empresaTransportadora: [''],
      trajeto: [''],
      valorUnitario: [''],
      excluido: 'N'
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.valorTransporteId = params['id'];
        this.ObterValortransporte(this.valorTransporteId);
      });

    this.valorTransporteService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas;
      },
        error => this.errors);
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    const self = this;
    this.swal.showSwalConfirm('Reativação', function (isConfirmed) {
      if (isConfirmed) {
        self.reativarValortransporte();
      } else {
        self.cancelar();
      }
    });
  }

  ObterValortransporte(id: string) {
    this.valorTransporteService.obterValortransportePorId(id)
      .subscribe(
        valorTransporte => this.preencherFormValortransporte(valorTransporte),
        response => {
          if (response.status === 404) {
            this.router.navigate(['NotFound']);
          }
        });
  }

  preencherFormValortransporte(valorTransporte: ValorTransporte): void {
    this.valorTransporte = valorTransporte;

    this.reativarVisivel = this.valorTransporte.excluido === 'S';
    this.removerVisivel = this.valorTransporte.excluido === 'N';

    this.valorTransporteForm.patchValue({
      id: this.valorTransporte.id,
      grupoEmpresaId: this.valorTransporte.grupoEmpresaId,
      empresaId: this.valorTransporte.empresaId,
      codigo: this.valorTransporte.codigo,
      sigla: this.valorTransporte.sigla,
      descricao: this.valorTransporte.descricao,
      tipotransporte:this.valorTransporte.tipoTransporte,
      empresaTransportadora:this.valorTransporte.empresaTransportadora,
      trajeto:this.valorTransporte.trajeto,
      valorUnitario:this.valorTransporte.valorUnitario,
      excluido: this.valorTransporte.excluido
    });
  }

  reativarValortransporte() {
    this.valorTransporteService.reativarValortransporte(this.valorTransporte)
      .subscribe(
        result => {
          if (result) {
            this.swal.showSwalSuccess('Valores dos Transportes, reativado com sucesso!');
          } else {
            this.swal.showSwalErro('Ocorreu um erro ao Reativar!');
          }
          this.router.navigate(['valortransporte/lista']);
        },
        error => {
          console.error(error);
        });
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.valorTransporteService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas;
      },
        () => this.errors);
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['valortransporte/editar/' + this.valorTransporteId]);
  }
}


