import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { ValorTransporte, GrupoEmpresa, Empresa, TipoTransporte } from '../models/valortransporte';
import { FormControlName, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Subscription } from 'rxjs/Subscription';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { ValortransporteService } from '../valortransporte.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-editar-valortransporte',
  templateUrl: './editar-valortransporte.component.html',
  styleUrls: []
})
export class EditarValortransporteComponent implements OnInit {

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
    private fb: FormBuilder, private router: Router,
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
    },() => {});
  }

  ngOnInit() {

    this.valorTransporteForm = this.fb.group({
      id: 0,
      guid: 1,
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
    this.sub = this.route.params.subscribe(
      params => {
        this.valorTransporteId = params['id'];
        this.ObterTipoDeAdmissao(this.valorTransporteId);
      });

    this.valorTransporteService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas;
      },
        () => this.errors);
  }
  
  ObterTipoDeAdmissao(id: string) {
    this.valorTransporteService.obterValortransportePorId(id)
      .subscribe(
        resultado => this.preencherFormvalorTransporte(resultado),
        response => {
          if (response.status === 404) {
            this.router.navigate(['NotFound']);
          }
        });
  }

  preencherFormvalorTransporte(valorTransporte: ValorTransporte): void {
    this.valorTransporte = valorTransporte;

    this.reativarVisivel = this.valorTransporte.excluido === 'S';
    this.removerVisivel = this.valorTransporte.excluido === 'N';
    !this.removerVisivel ? this.valorTransporteForm.disable() : this.valorTransporteForm.enable();

    this.valorTransporteForm.patchValue({
      id: this.valorTransporte.id,
      guid: 1,
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

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.valorTransporteForm);
    });
  }

  editarValortransporte() {
    if (this.valorTransporteForm.dirty && this.valorTransporteForm.valid) {
      const p = Object.assign({}, this.valorTransporte, this.valorTransporteForm.value);

      this.valorTransporteService.atualizarValortransporte(p)
        .subscribe(
          result => {
            if (result) {
              this.swal.showSwalSuccess('Valores dos Transportes, atualizado com sucesso!');
              this.router.navigate(['valortransporte/lista']);
            } else {
              this.swal.showSwalErro('Ocorreu um erro ao gravar!');
            }
          },
          () => { })
    }
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
    this.router.navigate(['valortransporte/lista']);
  }

  remover(id) {
    this.router.navigate(['valortransporte/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['valortransporte/reativar/' + id]);
  }

}