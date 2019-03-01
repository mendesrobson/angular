import { Component, OnInit, Input, Output, ViewChildren, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Empregado, EmpregadoOrgaoClasse, Uf } from '../models/empregado';
import { EmpregadoService } from '../empregado.service';
import { EmpregadoComponent } from '../empregado.component';
import { ListaEmpregadoorgaoclasseComponent } from '../lista-empregadoorgaoclasse/lista-empregadoorgaoclasse.component';

@Component({
  selector: 'app-adicionar-empregadoorgaoclasse',
  templateUrl: './adicionar-empregadoorgaoclasse.component.html',
  styleUrls: ['./adicionar-empregadoorgaoclasse.component.css']
})
export class AdicionarEmpregadoorgaoclasseComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;
  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

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
    private listaempregadoorgaoclasseComponent: ListaEmpregadoorgaoclasseComponent) {

    // this.validationMessages = {
    // };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.empregado = new Empregado();
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
  }

  ngAfterViewInit(): void {
    // const controlBlurs: Observable<any>[] = this.formInputElements
    //   .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    // Observable.merge(...controlBlurs).subscribe(() => {
    //   this.displayMessage = this.genericValidator.processMessages(this.empregadoOrgaoClasseForm);
    // });
  }

  adicionarEmpregadoorgaoclasse() {

    this.empregadoOrgaoClasses = this.empregadoComponent.empregado.empregadoOrgaoClasse;

    if (this.empregadoOrgaoClasseForm.dirty && this.empregadoOrgaoClasseForm.valid) {
      let p = Object.assign({}, this.empregadoOrgaoClasse, this.empregadoOrgaoClasseForm.getRawValue());

      this.empregadoComponent.dirty = true;

      if (this.empregadoId > 0) {

        p.empregadoId = this.empregadoId;
        p.empregado = null;
        this.uf = p.uf;
        p.uf = null;

        this.empregadoService.adicionarEmpregadoorgaoclasse(p)
          .subscribe(
            x => {

              if (this.empregadoComponent.empregado.empregadoOrgaoClasse == null) {
                this.empregadoComponent.empregado.empregadoOrgaoClasse = new Array();
              }

              this.empregadoService.obterTodosPorEmpregadoorgaoclasseId(this.empregadoId.toString())
                .subscribe(result => {
                  this.empregadoOrgaoClasses = result;

                  if (this.empregadoOrgaoClasses != null && this.empregadoOrgaoClasses.length > 0) {

                    for (let i = 0; i < this.empregadoOrgaoClasses.length; i++) {

                      for (let y = 0; y < this.uf.length; y++) {

                        if (this.empregadoOrgaoClasses[i].ufId.toString() == this.uf[y].id) {
                          this.empregadoOrgaoClasses[i].uf = this.uf[y];
                        }
                      }
                    }
                  }

                  this.empregadoComponent.empregado.empregadoOrgaoClasse = this.empregadoOrgaoClasses;

                });

              this.listaempregadoorgaoclasseComponent.empregadoOrgaoClasseGravado('Orgãos de Classes, adicionado com sucesso!');
              this.close();
            },
            error => {
              this.errors;
            });
      } else {

        p.id = 0;

        if (this.empregadoOrgaoClasses != null) {

          if (this.empregadoOrgaoClasses.length > 0) {
            p.id = this.empregadoOrgaoClasses.length + 1;
          }
        }

        for (let i = 0; i < this.uf.length; i++) {

          if (p.valorTransporteId == this.uf[i].id) {
            p.uf = this.uf[i];
          }

        }
        if (this.empregadoComponent.empregado.empregadoOrgaoClasse == null) {
          this.empregadoComponent.empregado.empregadoOrgaoClasse = new Array();
        }

        this.empregadoComponent.empregado.empregadoOrgaoClasse.push(p);
        this.listaempregadoorgaoclasseComponent.empregadoOrgaoClasseGravado('Orgãos de Classes, adicionado com sucesso!');
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