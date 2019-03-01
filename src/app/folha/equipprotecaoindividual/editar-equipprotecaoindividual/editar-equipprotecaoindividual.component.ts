import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { EquipProtecaoIndividual, GrupoEmpresa, Empresa } from '../models/equipprotecaoindividual';
import { FormControlName, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Subscription } from 'rxjs/Subscription';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { EquipprotecaoindividualService } from '../equipprotecaoindividual.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-editar-equipprotecaoindividual',
  templateUrl: './editar-equipprotecaoindividual.component.html',
  styleUrls: []
})
export class EditarEquipprotecaoindividualComponent implements OnInit {

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
      descricao: ['', [Validators.required]],
      especificacao:[''],
      certificadoAprovacao:[''],
      excluido: 'N'
    });
    this.sub = this.route.params.subscribe(
      params => {
        this.equipprotecaoindividualId = params['id'];
        this.ObterTipoDeAdmissao(this.equipprotecaoindividualId);
      });

    this.equipprotecaoindividualService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas;
      },
        () => this.errors);
  }
  
  ObterTipoDeAdmissao(id: string) {
    this.equipprotecaoindividualService.obterEquipprotecaoindividualPorId(id)
      .subscribe(
        resultado => this.preencherFormequipprotecaoindividual(resultado),
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
    !this.removerVisivel ? this.equipprotecaoindividualForm.disable() : this.equipprotecaoindividualForm.enable();

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

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.equipprotecaoindividualForm);
    });
  }

  editarEquipprotecaoindividual() {
    if (this.equipprotecaoindividualForm.dirty && this.equipprotecaoindividualForm.valid) {
      const p = Object.assign({}, this.equipprotecaoindividual, this.equipprotecaoindividualForm.value);

      this.equipprotecaoindividualService.atualizarEquipprotecaoindividual(p)
        .subscribe(
          result => {
            if (result) {
              this.swal.showSwalSuccess('EPI, atualizado com sucesso!');
              this.router.navigate(['equipprotecaoindividual/lista']);
            } else {
              this.swal.showSwalErro('Ocorreu um erro ao gravar!');
            }
          },
          () => { })
    }
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
    this.router.navigate(['equipprotecaoindividual/lista']);
  }

  remover(id) {
    this.router.navigate(['equipprotecaoindividual/excluir/' + id]);
  }

  reativar(id) {
    this.router.navigate(['equipprotecaoindividual/reativar/' + id]);
  }

}