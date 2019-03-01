import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { FormControlName, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from '../../../../../node_modules/rxjs';

import { UtilService } from '../../../services/util.service';
import { Empregado, EmpregadoLotacao, Cargo, Departamento, TiposSalarios} from '../models/empregado';
import { EmpregadoService } from '../empregado.service';
import { EmpregadoComponent } from '../empregado.component';

@Component({
  selector: 'app-editar-empregadolotacao',
  templateUrl: './editar-empregadolotacao.component.html',
  styleUrls: ['./editar-empregadolotacao.component.css']
})
export class EditarEmpregadolotacaoComponent implements OnInit, AfterViewInit {
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
  refazerFiltro: boolean;
  public minDate: Date;

  public empregadoLotacao: EmpregadoLotacao;
  public empregadoLotacoes: EmpregadoLotacao[];
  public cargos: Cargo[];
  public departamentos: Departamento[];
  public tiposSalarios: TiposSalarios[];
  public empregadoId = 0;
  public empregadoLotacaoForm: FormGroup;

  constructor(
    private empregadoService: EmpregadoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private empregadoComponent: EmpregadoComponent,
    private _utilService: UtilService) { 

      this.validationMessages = {
        cargoId:{
          required:'Cargo requerido!'
        },
        departamentoId:{
          required: 'Departamento requerido!'
        },
        tipoSalario:{
          required: 'Tipo de Salário requerido!'
        },
        dataInicio:{
          required:'Data Início requerida!'
        }
      };

      this.genericValidator = new GenericValidator(this.validationMessages);
      this.empregadoLotacao = new EmpregadoLotacao();
      this.empregadoLotacoes = new Array();
      this.tiposSalarios = new Array();
      this.swal = new SweetAlertAdviceService();

    }

  async ngOnInit(): Promise<void> {

    if (this.route.snapshot.params['id'] === undefined) {
      this.empregadoId = 0;
    } else {
      this.empregadoId = this.route.snapshot.params['id'];
    }

    this.empregadoLotacaoForm = this.fb.group({
      id: 0,
      cargoId: [null, [Validators.required]],
      departamentoId: [null, [Validators.required]],
      tipoSalario: ['', [Validators.required]],
      valorRemuneracao: null,
      dataInicio: ['', [Validators.required]],
      dataFim: '',
      excluido: 'N'
    });

    this.tiposSalarios = [
      {id: '1', descricao: 'Mensalista'},
      {id: '2', descricao: 'Aulista'},
      {id: '3', descricao: 'Horista'},
      {id: '4', descricao: 'Tarefeiro'}
    ];

    await this.empregadoService.obterTodosCargo()
    .subscribe(result => { this.cargos = result });
    
    await this.empregadoService.obterTodosDepartamento()
    .subscribe(result => { this.departamentos = result });

    await this.preencherEmpregadoLotacao(this.empregadoComponent.empregadoLotacao);

  }

  preencherEmpregadoLotacao(empregadoLotacao: EmpregadoLotacao) : void {

    this.empregadoLotacao = empregadoLotacao;

    this.empregadoLotacaoForm.patchValue({
      cargoId: this.empregadoLotacao.cargoId,
      departamentoId: this.empregadoLotacao.departamentoId,
      tipoSalario: this.empregadoLotacao.tipoSalario,
      valorRemuneracao: this.empregadoLotacao.valorRemuneracao,
      dataInicio: this.empregadoLotacao.dataInicio != null && this.empregadoLotacao.dataInicio != '' ? this.empregadoLotacao.dataInicio : '',
      dataFim: this.empregadoLotacao.dataFim != null && this.empregadoLotacao.dataFim != '' ? this.empregadoLotacao.dataFim : ''
    });
 }

 ngAfterViewInit(): void {
  const controlBlurs: Observable<any>[] = this.formInputElements
    .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
  Observable.merge(...controlBlurs).subscribe(() => {
    this.displayMessage = this.genericValidator.processMessages(this.empregadoLotacaoForm);
  });
}

editarEmpregadoLotacao() {

  if (this.empregadoLotacaoForm.valueChanges) {
    this.refazerFiltro = false;
  }

  if (this.empregadoLotacaoForm.dirty && this.empregadoLotacaoForm.valid) {
    let p = Object.assign({}, this.empregadoLotacao, this.empregadoLotacaoForm.getRawValue());

    p.id = this.empregadoComponent.empregadoLotacao.id;

    this.empregadoComponent.dirty = true;

    if (this.empregadoId > 0) {

      p.empregadoId = this.empregadoId;
      p.cargo = null;
      p.departamento = null;
      p.tiposSalarios = null;

      this.empregadoService.atualizarEmpregadoLotacao(p)
        .subscribe(
          result => {
            if (result) {

              for(let i = 0; i < this.cargos.length; i++){

                  if(p.cargoId == this.cargos[i].id){

                        p.cargo = this.cargos[i];
                        break;
                  }

              }

              for(let i = 0; i < this.departamentos.length; i++){

                  if(p.departamentoId == this.departamentos[i].id){

                        p.departamento = this.departamentos[i];
                        break;
                  }

              }

              for(let i = 0; i < this.tiposSalarios.length; i++){

                  if(p.tipoSalario == this.tiposSalarios[i].id){

                        p.tiposSalarios = this.tiposSalarios[i];
                        break;
                  }

              }

              for (let i = 0; this.empregadoComponent.empregado.empregadoLotacao.length > i; i++) {
                  if (p.id === this.empregadoComponent.empregado.empregadoLotacao[i].id) {
                    this.empregadoComponent.empregado.empregadoLotacao[i] = p;
                  }
              } 
              
              this.swal.showSwalSuccess('Lotação editada com sucesso!');
              this.close();
            } else {
              this.swal.showSwalErro('Ocorreu um erro ao gravar!');
            }

          },
          (erro) => {
            this.errors = erro;
          });

    } else {

      for(let i = 0; i < this.cargos.length; i++){

            if(p.cargoId == this.cargos[i].id){

                  p.cargo = this.cargos[i];
                  break;
            }

      }

      for(let i = 0; i < this.departamentos.length; i++){

            if(p.departamentoId == this.departamentos[i].id){

                  p.departamento = this.departamentos[i];
                  break;
            }

      }

      for(let i = 0; i < this.tiposSalarios.length; i++){

            if(p.tipoSalario == this.tiposSalarios[i].id){

                  p.tiposSalarios = this.tiposSalarios[i];
                  break;
            }

      }

      for (let i = 0; this.empregadoComponent.empregado.empregadoLotacao.length > i; i++) {
          if (p.id === this.empregadoComponent.empregado.empregadoLotacao[i].id) {
            this.empregadoComponent.empregado.empregadoLotacao[i] = p;
          }
      } 
      
      this.swal.showSwalSuccess('Lotação editada com sucesso!');
      this.close();
    }
  }

  this.refazerFiltro = true;

}

cancelar() {
  this.close();
}

close() {
  this.visible = false;
  this.visibleChange.emit(this.visible);
}

definirValor(event) {
  this.minDate = event.value;
}

}
