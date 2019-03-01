import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { FormControlName, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from '../../../../../node_modules/rxjs';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

import { UtilService } from '../../../services/util.service';
import { Empregado, Itinerario, ValorTransporte, TipoTransporte } from '../models/empregado';
import { EmpregadoService } from '../empregado.service';
import { EmpregadoComponent } from '../empregado.component';
import { ListaItinerarioComponent } from '../lista-itinerario/lista-itinerario.component';
import { GrupoEmpresa, Empresa } from '../../valortransporte/models/valortransporte';

@Component({
  selector: 'app-editar-itinerario',
  templateUrl: './editar-itinerario.component.html',
  styleUrls: ['./editar-itinerario.component.css']
})
export class EditarItinerarioComponent implements OnInit, AfterViewInit {
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
    private listaitinerarioComponent: ListaItinerarioComponent,
    private _utilService: UtilService) {

    // this.validationMessages = {
    // };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.itinerarios = new Array();
    this.itinerario = new Itinerario();
    this.swal = new SweetAlertAdviceService();

    this.empregadoService.obterTodosGrupoEmpresa()
      .subscribe(grupoEmpresas => {
        this.grupoEmpresas = grupoEmpresas
      }, () => { });


    this.empregadoService.obterTodosValortransporte()
      .subscribe(valorTransporte => {
        this.valorTransporte = valorTransporte
      }, () => { });


    // this.empregadoService.getTipotransporte()
    //   .subscribe(resultado => {
    //     this.tipotransportes = resultado;
    //   }, () => { });

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
      empregadoId: [''],
      grupoEmpresaId: [''],
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

    this.preencheritinerario(this.empregadoComponent.itinerario);
  }

  preencheritinerario(itinerario: Itinerario): void {

    this.itinerario = itinerario;

    console.log(this.itinerario);

    this.itinerarioForm.patchValue({
      codigo: this.itinerario.codigo,
      sigla: this.itinerario.sigla,
      descricao: this.itinerario.descricao,
      destino: this.itinerario.destino,
      empregadoId: this.itinerario.empregadoId,
      grupoEmpresaId: this.itinerario.grupoEmpresaId,
      origem: this.itinerario.origem,
      tipo: this.itinerario.tipo,
      valorTransporteId: this.itinerario.valorTransporteId,
      dataInicio: this._utilService.ToDate(this.itinerario.dataInicio),
      dataTermino: this._utilService.ToDate(this.itinerario.dataTermino)
    });
  }

  ngAfterViewInit(): void {
    // const controlBlurs: Observable<any>[] = this.formInputElements
    //   .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    // Observable.merge(...controlBlurs).subscribe(() => {
    //   this.displayMessage = this.genericValidator.processMessages(this.itinerarioForm);
    // });
  }

  editaritinerario() {

    if (this.itinerarioForm.dirty && this.itinerarioForm.valid) {
      let p = Object.assign({}, this.itinerario, this.itinerarioForm.getRawValue());

      p.id = this.empregadoComponent.itinerario.id;

      this.empregadoComponent.dirty = true;

      if (this.empregadoId > 0) {

        p.empregadoId = this.empregadoId;

        this.empregadoService.atualizarItinerario(p)
          .subscribe(
            result => {
              if (result) {

                for (let i = 0; i < this.valorTransporte.length; i++) {

                  if (p.valorTransporteId == this.valorTransporte[i].id) {

                    p.valorTransporte = this.valorTransporte[i];
                  }

                }

                for (let i = 0; this.empregadoComponent.empregado.itinerario.length > i; i++) {
                  if (p.id === this.empregadoComponent.empregado.itinerario[i].id) {
                    this.empregadoComponent.empregado.itinerario[i] = p;
                  }
                }
                this.swal.showSwalSuccess('Itinerários editado com sucesso!');
                this.close();
              } else {
                this.swal.showSwalErro('Ocorreu um erro ao gravar!');
              }

            },
            (erro) => {
              this.errors = erro;
            });

      } else {

        this.itinerario = p;

        for (let i = 0; i < this.valorTransporte.length; i++) {

          if (p.valorTransporteId == this.valorTransporte[i].id) {

            p.valorTransporte = this.valorTransporte[i];
          }

        }

        for (let i = 0; this.empregadoComponent.empregado.itinerario.length > i; i++) {
          if (this.itinerario.id === this.empregadoComponent.empregado.itinerario[i].id) {
            this.empregadoComponent.empregado.itinerario[i] = this.itinerario;
          }
        }
        this.swal.showSwalSuccess('Itinerários editado com sucesso!');
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
