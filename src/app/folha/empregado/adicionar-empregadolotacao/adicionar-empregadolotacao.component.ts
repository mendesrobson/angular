import { Component, OnInit, Input, Output, ViewChildren, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from '../../../../../node_modules/rxjs';
import { MaskService } from '../../../services/mask.service';

import { Empregado, EmpregadoLotacao, Cargo, Departamento, TiposSalarios} from '../models/empregado';
import { EmpregadoService } from '../empregado.service';
import { EmpregadoComponent } from '../empregado.component';
import { DatePipe } from '../../../../../node_modules/@angular/common';

@Component({
  selector: 'app-adicionar-empregadolotacao',
  templateUrl: './adicionar-empregadolotacao.component.html',
  styleUrls: ['./adicionar-empregadolotacao.component.css']
})
export class AdicionarEmpregadolotacaoComponent implements OnInit, AfterViewInit {
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
  public datePipe: DatePipe;
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
    private empregadoComponent: EmpregadoComponent) { 

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
      this.datePipe = new DatePipe("en-US");

    }

  ngOnInit() {

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

    this.empregadoService.obterTodosCargo()
    .subscribe(result => { this.cargos = result });
    
    this.empregadoService.obterTodosDepartamento()
    .subscribe(result => { this.departamentos = result });
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.empregadoLotacaoForm);
    });
  }

  adicionarEmpregadoLotacao() {

    if (this.empregadoLotacaoForm.valueChanges) {
      this.refazerFiltro = false;
    }
    
    if (this.empregadoLotacaoForm.dirty && this.empregadoLotacaoForm.valid) {
     
     const p = Object.assign({}, this.empregadoLotacao, this.empregadoLotacaoForm.getRawValue());
     
     p.dataInicio = this.datePipe.transform(p.dataInicio, 'yyyy/MM/dd');
     p.dataFim = this.datePipe.transform(p.dataFim, 'yyyy/MM/dd');

     this.empregadoComponent.dirty = true;

     if (this.empregadoId > 0) {

       p.empregadoId = this.empregadoId;
       p.cargo = null;
       p.departamento = null;
       p.tiposSalarios = null;
       
       this.empregadoService.adicionarEmpregadoLotacao(p)
         .subscribe(
           result => {
             if (result) {
              
               this.empregadoService.obterTodosEmpregadoLotacaoPorEmpregadoId(this.empregadoId.toString())
               .subscribe(result => { this.empregadoLotacoes = result;
                
                    for(let i = 0; i < this.empregadoLotacoes.length; i++){

                        for(let y = 0; y < this.cargos.length; y++){

                            if(this.empregadoLotacoes[i].cargoId == this.cargos[y].id){

                                this.empregadoLotacoes[i].cargo = this.cargos[y];
                                break;
                                
                            }
                        }

                        for(let y = 0; y < this.departamentos.length; y++){

                            if(this.empregadoLotacoes[i].departamentoId == this.departamentos[y].id){

                              this.empregadoLotacoes[i].departamento = this.departamentos[y];
                              break;

                            }

                        }

                        for(let y = 0; y < this.tiposSalarios.length; y++){

                          if(this.empregadoLotacoes[i].tipoSalario == this.tiposSalarios[y].id.toString()){

                            this.empregadoLotacoes[i].tiposSalarios = this.tiposSalarios[y];
                            break;

                          }

                      }


                    }
                    
                    this.empregadoComponent.empregado.empregadoLotacao = this.empregadoLotacoes;

              });
               
               
               this.swal.showSwalSuccess('Lotação adicionada com sucesso!'); 
               this.close();
             } else {
               this.swal.showSwalErro('Ocorreu um erro ao gravar!');
             }
           },
           error => {              
             this.errors;
           });
     } else {
      
        p.id = 0;

        if(this.empregadoComponent.empregado.empregadoLotacao != null){
          if (this.empregadoComponent.empregado.empregadoLotacao.length > 0) {
            p.id = this.empregadoComponent.empregado.empregadoLotacao.length + 1;
          }
        }

        for(let y = 0; y < this.cargos.length; y++){

          if(p.cargoId == this.cargos[y].id){

              p.cargo = this.cargos[y];
              break;
          }
      }

      for(let y = 0; y < this.departamentos.length; y++){

          if(p.departamentoId == this.departamentos[y].id){

            p.departamento = this.departamentos[y];
            break;

          }

      }

      for(let y = 0; y < this.tiposSalarios.length; y++){

          if(p.tipoSalario == this.tiposSalarios[y].id){

              p.tiposSalarios = this.tiposSalarios[y];
              break;
          }

      }
       
       
       if (this.empregadoComponent.empregado.empregadoLotacao == null) {
         this.empregadoComponent.empregado.empregadoLotacao = new Array();
       }

       this.empregadoComponent.empregado.empregadoLotacao.push(p);
       this.swal.showSwalSuccess('Dependente adicionado com sucesso!');
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
