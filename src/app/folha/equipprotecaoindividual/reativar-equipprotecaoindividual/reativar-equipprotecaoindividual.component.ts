import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EquipProtecaoIndividual, GrupoEmpresa, Empresa } from '../models/equipprotecaoindividual';
import { Router, ActivatedRoute } from '@angular/router';
import { EquipprotecaoindividualService } from '../equipprotecaoindividual.service';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-reativar-equipprotecaoindividual',
  templateUrl: './reativar-equipprotecaoindividual.component.html',
  styleUrls: []
})
export class ReativarEquipprotecaoindividualComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public reativarVisivel = false;
  public removerVisivel = false;

  public equipprotecaoindividual: EquipProtecaoIndividual;
  public equipprotecaoindividualForm: FormGroup;
  public equipprotecaoindividualId: "";
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  public sub: Subscription;
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private equipprotecaoindividualService: EquipprotecaoindividualService,
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
      this.equipprotecaoindividual = new EquipProtecaoIndividual();
      this.swal = new SweetAlertAdviceService();

     }

  ngOnInit() {
    this.equipprotecaoindividualForm = this.fb.group({
      id: 0,
      guid: 1,
      grupoEmpresaId: [''],
      empresaId: [''],
      codigo: [''],
      sigla: [''],
      descricao: [''],
      especificacao:[''],
      certificadoAprovacao:[''],
      excluido: 'N'
    });

    this.sub = this.route.params.subscribe(
      params => {
        this.equipprotecaoindividualId = params['id'];
        this.ObterEquipprotecaoindividual(this.equipprotecaoindividualId);
      });

    this.equipprotecaoindividualService.obterTodosGrupoEmpresa()
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
        self.reativarEquipprotecaoindividual();
      } else {
        self.cancelar();
      }
    });
  }

  ObterEquipprotecaoindividual(id: string) {
    this.equipprotecaoindividualService.obterEquipprotecaoindividualPorId(id)
      .subscribe(
        Equipprotecaoindividual => this.preencherFormEquipprotecaoindividual(Equipprotecaoindividual),
        response => {
          if (response.status === 404) {
            this.router.navigate(['NotFound']);
          }
        });
  }

  preencherFormEquipprotecaoindividual(Equipprotecaoindividual: EquipProtecaoIndividual): void {
    this.equipprotecaoindividual = Equipprotecaoindividual;

    this.reativarVisivel = this.equipprotecaoindividual.excluido === 'S';
    this.removerVisivel = this.equipprotecaoindividual.excluido === 'N';

    this.equipprotecaoindividualForm.patchValue({
      id: this.equipprotecaoindividual.id,
      grupoEmpresaId: this.equipprotecaoindividual.grupoEmpresaId,
      empresaId: this.equipprotecaoindividual.empresaId,
      codigo: this.equipprotecaoindividual.codigo,
      sigla: this.equipprotecaoindividual.sigla,
      descricao: this.equipprotecaoindividual.descricao,
      certificadoAprovacao: this.equipprotecaoindividual.certificadoAprovacao,
      especificacao: this.equipprotecaoindividual.especificacao,
      excluido: this.equipprotecaoindividual.excluido
    });
  }

  reativarEquipprotecaoindividual() {
    this.equipprotecaoindividualService.reativarEquipprotecaoindividual(this.equipprotecaoindividual)
      .subscribe(
      result => {
        if (result) {
          this.swal.showSwalSuccess('EPI, reativado com sucesso!');
        } else {
          this.swal.showSwalErro('Ocorreu um erro ao Reativar!');
        }
        this.router.navigate(['equipprotecaoindividual/lista']);
      },
      error => {
        console.error(error);
      });
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.equipprotecaoindividualService.obterTodosEmpresa(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas;
      },
        () => this.errors);
  }

  onError(error) {
    this.errors = JSON.parse(error._body).errors;
  }

  cancelar() {
    this.router.navigate(['equipprotecaoindividual/editar/' + this.equipprotecaoindividualId]);
  }
}


