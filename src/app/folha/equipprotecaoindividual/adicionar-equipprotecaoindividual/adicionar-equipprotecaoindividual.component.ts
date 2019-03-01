import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { Validators, FormControlName, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router } from '@angular/router';
import { EquipprotecaoindividualService } from '../equipprotecaoindividual.service';
import { EquipProtecaoIndividual, GrupoEmpresa, Empresa } from '../models/equipprotecaoindividual';

@Component({
  selector: 'app-adicionar-equipprotecaoindividual',
  templateUrl: './adicionar-equipprotecaoindividual.component.html',
  styleUrls: []
})
export class AdicionarEquipprotecaoindividualComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  public equipprotecaoindividual: EquipProtecaoIndividual;
  public equipprotecaoindividualForm: FormGroup;
  displayMessage: { [key: string]: string } = {};

  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  swal: SweetAlertAdviceService;
  public errors: any[] = [];

  constructor(
    private equipprotecaoindividualService: EquipprotecaoindividualService,
    private fb: FormBuilder, private router: Router) {

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
      grupoEmpresaId: [''],
      empresaId: [''],
      codigo: [''],
      sigla: [''],
      descricao: ['', [Validators.required]],
      especificacao:[''],
      certificadoAprovacao:[''],
      excluido: 'N'
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
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.equipprotecaoindividualForm);
    });
  }

  adicionarEquipprotecaoindividual() {
    if (this.equipprotecaoindividualForm.dirty && this.equipprotecaoindividualForm.valid) {
      let p = Object.assign({}, this.equipprotecaoindividual, this.equipprotecaoindividualForm.value);
      this.equipprotecaoindividualService.adicionarEquipprotecaoindividual(p)
        .subscribe(
          result => {
            if (result) {
              this.swal.showSwalSuccess('EPI, adicionado com sucesso!');
              this.router.navigate(['equipprotecaoindividual/lista']);
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
    this.router.navigate(['equipprotecaoindividual/lista']);
  }

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.equipprotecaoindividualService.obterTodosEmpresa(idGrupo)
      .subscribe(resultado => {
        this.empresas = resultado;
      },
        () => this.errors);
  }
}

