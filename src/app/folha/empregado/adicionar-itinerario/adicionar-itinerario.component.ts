import { Component, OnInit, Input, Output, ViewChildren, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Empregado, Itinerario, ValorTransporte, TipoTransporte } from '../models/empregado';
import { EmpregadoService } from '../empregado.service';
import { EmpregadoComponent } from '../empregado.component';
import { ListaItinerarioComponent } from '../lista-itinerario/lista-itinerario.component';
import { Empresa, GrupoEmpresa } from '../../valortransporte/models/valortransporte';

@Component({
  selector: 'app-adicionar-itinerario',
  templateUrl: './adicionar-itinerario.component.html',
  styleUrls: ['./adicionar-itinerario.component.css']
})
export class AdicionarItinerarioComponent implements OnInit, AfterViewInit {
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
  public itinerario: Itinerario;
  public itinerarios: Itinerario[];
  public grupoEmpresas: GrupoEmpresa[];
  public empresas: Empresa[];
  public valorTransporte: ValorTransporte[];
  public tipotransportes: TipoTransporte[];
  public empregadoId = 0;
  public itinerarioForm: FormGroup;


  constructor(
    private empregadoService: EmpregadoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private empregadoComponent: EmpregadoComponent,
    private listaitinerarioComponent: ListaItinerarioComponent) {

    // this.validationMessages = {
    // };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.empregado = new Empregado();
    this.itinerarios = new Array();
    this.itinerario = new Itinerario();
    this.swal = new SweetAlertAdviceService();

    this.empregadoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      }, () => { });


    this.empregadoService.obterTodosValortransporte()
      .subscribe(valorTransporte => {
        this.valorTransporte = valorTransporte;
      }, () => { });
  }

  ngOnInit() {

    if (this.route.snapshot.params['id'] === undefined) {
      this.empregadoId = 0;
    } else {
      this.empregadoId = this.route.snapshot.params['id'];
    }
    this.itinerarioForm = this.fb.group({
      id: 0,
      codigo: [''],
      sigla: [''],
      descricao: [''],
      destino: [''],
      grupoEmpresaId: [''],
      empresaId: [''],
      grupoEmpresa: [''],
      tipotransporte: [''],
      origem: [''],
      tipo: [''],
      valorTransporteId: [''],
      dataInicio: [''],
      dataTermino: [''],
      excluido: 'N'
    });

    this.tipotransportes = [
      { id: "", descricao: "" },
      { id: "BUS", descricao: "Ônibus" },
      { id: "METRO", descricao: "Metro" },
      { id: "INTEG", descricao: "Integração" },
      { id: "CARRO", descricao: "Carro" },
      { id: "TREM", descricao: "Trem" },
      { id: "OUTRO", descricao: "Outros" }];
  }

  ngAfterViewInit(): void {
    // const controlBlurs: Observable<any>[] = this.formInputElements
    //   .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    // Observable.merge(...controlBlurs).subscribe(() => {
    //   this.displayMessage = this.genericValidator.processMessages(this.itinerarioForm);
    // });
  }

  adicionaritinerario() {

    this.itinerarios = this.empregadoComponent.empregado.itinerario;

    if (this.itinerarioForm.dirty && this.itinerarioForm.valid) {
      let p = Object.assign({}, this.itinerario, this.itinerarioForm.getRawValue());

      this.empregadoComponent.dirty = true;

      if (this.empregadoId > 0) {

        p.empregadoId = this.empregadoId;
        p.empregado = null;

        if (this.tipotransportes != null) {
          this.tipotransportes.forEach(tt => {
            if (p.tipotransporte == tt.descricao) {
              p.tipo = tt.id;
            }
          });
        }

        p.valorTransporte = null;

        this.empregadoService.adicionarItinerario(p)
          .subscribe(
            result => {

              if (this.empregadoComponent.empregado.itinerario == null) {
                this.empregadoComponent.empregado.itinerario = new Array();
              }

              this.empregadoService.obterTodosPorItinerarioId(this.empregadoId.toString())
                .subscribe(result => {
                  this.itinerarios = result;

                  if (this.itinerarios != null && this.itinerarios.length > 0) {

                    for (let i = 0; i < this.itinerarios.length; i++) {

                      for (let y = 0; y < this.valorTransporte.length; y++) {

                        if (this.itinerarios[i].valorTransporteId == this.valorTransporte[y].id) {
                          this.itinerarios[i].tipo = this.tipotransportes[y].id;
                          this.itinerarios[i].valorTransporte = this.valorTransporte[y];

                        }
                      }
                    }
                  }

                  this.empregadoComponent.empregado.itinerario = this.itinerarios;

                });

              this.listaitinerarioComponent.itinerarioGravado('Itinerários adicionado com sucesso!');
              this.close();
            },
            error => {
              this.errors;
            });
      } else {

        p.id = 0;

        if (this.itinerarios != null) {

          if (this.itinerarios.length > 0) {
            p.id = this.itinerarios.length + 1;
          }
        }

        for (let i = 0; i < this.valorTransporte.length; i++) {

          if (p.valorTransporteId == this.valorTransporte[i].id) {
            p.tipo = this.valorTransporte[i].tipoTransporte;
            p.valorTransporte = this.valorTransporte[i];
            console.log(p.tipo);
          }

        }
        if (this.empregadoComponent.empregado.itinerario == null) {
          this.empregadoComponent.empregado.itinerario = new Array();
        }

        this.empregadoComponent.empregado.itinerario.push(p);
        this.listaitinerarioComponent.itinerarioGravado('Itinerários adicionado com sucesso!');
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

  ConsultaEmpresa(idGrupo) {
    this.empresas = [];
    this.empregadoService.obterTodosEmpresaPorId(idGrupo)
      .subscribe(empresas => {
        this.empresas = empresas
      },
        () => { });
  }

  ConsultaTipoTransporte(id) {
    if (this.valorTransporte != null) {
      this.valorTransporte.forEach(e => {
        if (e.id == id) {
          this.tipotransportes.forEach(tt => {
            if (e.tipoTransporte == tt.id) {
              this.itinerarioForm.controls['tipotransporte'].patchValue(tt.descricao);
            }
          })
        }
      });
    }
  }
}