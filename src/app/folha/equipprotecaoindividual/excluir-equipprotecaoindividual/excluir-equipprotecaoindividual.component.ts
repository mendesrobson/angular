import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EquipProtecaoIndividual, GrupoEmpresa, Empresa } from '../models/equipprotecaoindividual';
import { Subscription, Observable } from 'rxjs';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { EquipprotecaoindividualService } from '../equipprotecaoindividual.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-excluir-equipprotecaoindividual',
  templateUrl: './excluir-equipprotecaoindividual.component.html',
  styleUrls: []
})
export class ExcluirEquipprotecaoindividualComponent implements OnInit {
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
    private fb: FormBuilder,private router: Router,
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
      () => this.errors);
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    const self = this;
    this.swal.showSwalConfirm('Exclusão', function (isConfirmed) {
      if (isConfirmed) {
        self.removerEquipprotecaoindividual();
      } else {
        self.cancelar();
      }
    });
  }

  ObterEquipprotecaoindividual(id: string) {
    this.equipprotecaoindividualService.obterEquipprotecaoindividualPorId(id)
      .subscribe(
        equipprotecaoindividual => this.preencherFormequipprotecaoindividual(equipprotecaoindividual),
        response => {
          if (response.status === 404) {
            this.router.navigate(['NotFound']);
          }
        });
  }

  preencherFormequipprotecaoindividual(equipprotecaoindividual: EquipProtecaoIndividual): void {
    this.equipprotecaoindividual = equipprotecaoindividual;

    this.reativarVisivel = this.equipprotecaoindividual.excluido === 'S';
    this.removerVisivel = this.equipprotecaoindividual.excluido === 'N';

    this.equipprotecaoindividualForm.patchValue({
      id: this.equipprotecaoindividual.id,
      guid: 1,
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

  removerEquipprotecaoindividual() {
    this.equipprotecaoindividualService.removerEquipprotecaoindividual(this.equipprotecaoindividual)
      .subscribe(
        result => {
          if (result) {
            this.swal.showSwalSuccess('EPI, removido com sucesso!');
          } else {
            this.swal.showSwalErro('Ocorreu um erro ao Remover!');
          }
          this.router.navigate(['equipprotecaoindividual/lista']);
        },
        () => {
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
