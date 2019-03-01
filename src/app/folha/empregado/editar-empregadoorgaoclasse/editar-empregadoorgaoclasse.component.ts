import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { FormControlName, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

import { UtilService } from '../../../services/util.service';
import { Empregado, EmpregadoOrgaoClasse, Uf } from '../models/empregado';
import { EmpregadoService } from '../empregado.service';
import { EmpregadoComponent } from '../empregado.component';
import { ListaEmpregadoorgaoclasseComponent } from '../lista-empregadoorgaoclasse/lista-empregadoorgaoclasse.component';

@Component({
  selector: 'app-editar-empregadoorgaoclasse',
  templateUrl: './editar-empregadoorgaoclasse.component.html',
  styleUrls: ['./editar-empregadoorgaoclasse.component.css']
})
export class EditarEmpregadoorgaoclasseComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;
  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  swal: SweetAlertAdviceService;

  public errors: any[] = [];

  public empregado: Empregado;
  public empregadoOrgaoClasse: EmpregadoOrgaoClasse;
  public empregadoOrgaoClasses: EmpregadoOrgaoClasse[];
  public uf: Uf[];
  public empregadoId = 0;
  public empregadoOrgaoClasseForm: FormGroup;

  constructor(
    private empregadoService: EmpregadoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private empregadoComponent: EmpregadoComponent,
    private listaempregadoOrgaoClasseComponent: ListaEmpregadoorgaoclasseComponent,
    private _utilService: UtilService) {

    // this.validationMessages = {
    // };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.empregadoOrgaoClasses = new Array();
    this.empregadoOrgaoClasse = new EmpregadoOrgaoClasse();
    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit() {

    if (this.route.snapshot.params['id'] === undefined) {
      this.empregadoId = 0;
    } else {
      this.empregadoId = this.route.snapshot.params['id'];
    }
    this.empregadoOrgaoClasseForm = this.fb.group({
      id: 0,
      numeroInscricao: [''],
      orgaoEmissor: [''],
      ufId: 0,
      dataExpedicao: [''],
      dataValidade: [''],
      excluido: 'N'
    });
    this.empregadoService.obterTodosUf()
    .subscribe(uf => {
      this.uf = uf
    },
      () => {});

    this.preencherEmpregadoOrgaoClasse(this.empregadoComponent.empregadoOrgaoClasse);
  }

  preencherEmpregadoOrgaoClasse(empregadoOrgaoClasse: EmpregadoOrgaoClasse): void {

    this.empregadoOrgaoClasse = empregadoOrgaoClasse;

    console.log(this.empregadoOrgaoClasse);

    this.empregadoOrgaoClasseForm.patchValue({
      numeroInscricao: this.empregadoOrgaoClasse.numeroInscricao,
      orgaoEmissor: this.empregadoOrgaoClasse.orgaoEmissor,
      ufId: this.empregadoOrgaoClasse.ufId,
      dataExpedicao: this._utilService.ToDate(this.empregadoOrgaoClasse.dataExpedicao),
      dataValidade: this._utilService.ToDate(this.empregadoOrgaoClasse.dataValidade)
    });
  }

  ngAfterViewInit(): void {
    // const controlBlurs: Observable<any>[] = this.formInputElements
    //   .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    // Observable.merge(...controlBlurs).subscribe(() => {
    //   this.displayMessage = this.genericValidator.processMessages(this.empregadoOrgaoClasseForm);
    // });
  }

  editarEmpregadoOrgaoClasse() {

    if (this.empregadoOrgaoClasseForm.dirty && this.empregadoOrgaoClasseForm.valid) {
      let p = Object.assign({}, this.empregadoOrgaoClasse, this.empregadoOrgaoClasseForm.getRawValue());

      p.id = this.empregadoComponent.empregadoOrgaoClasse.id;

      this.empregadoComponent.dirty = true;

      if (this.empregadoId > 0) {

        p.empregadoId = this.empregadoId;

        this.empregadoService.atualizarEmpregadoorgaoclasse(p)
          .subscribe(
            result => {
              if (result) {

                for (let i = 0; i < this.uf.length; i++) {

                  if (p.ufId == this.uf[i].id) {

                    p.uf = this.uf[i];
                  }

                }

                for (let i = 0; this.empregadoComponent.empregado.empregadoOrgaoClasse.length > i; i++) {
                  if (p.id === this.empregadoComponent.empregado.empregadoOrgaoClasse[i].id) {
                    this.empregadoComponent.empregado.empregadoOrgaoClasse[i] = p;
                  }
                }
                this.swal.showSwalSuccess('Órgãos de Classe, editado com sucesso!');
                this.close();
              } else {
                this.swal.showSwalErro('Ocorreu um erro ao gravar!');
              }

            },
            (erro) => {
              this.errors = erro;
            });

      } else {

        this.empregadoOrgaoClasse = p;

        for (let i = 0; i < this.uf.length; i++) {

          if (p.ufId == this.uf[i].id) {

            p.uf = this.uf[i];
          }

        }

        for (let i = 0; this.empregadoComponent.empregado.empregadoOrgaoClasse.length > i; i++) {
          if (this.empregadoOrgaoClasse.id === this.empregadoComponent.empregado.empregadoOrgaoClasse[i].id) {
            this.empregadoComponent.empregado.empregadoOrgaoClasse[i] = this.empregadoOrgaoClasse;
          }
        }
        this.swal.showSwalSuccess('Órgãos de Classe, editado com sucesso!');
        this.close();
      }
    }
  }

  cancelar() {
    this.close();
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
