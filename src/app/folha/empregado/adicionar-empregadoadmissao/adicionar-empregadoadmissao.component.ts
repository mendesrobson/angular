import { Component, OnInit, Input, Output, ViewChildren, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from '../../../../../node_modules/rxjs';

import { TipoContato } from '../../../cadastros/pessoa/models/pessoa';
import { Empregado } from '../models/empregado';
import { EmpregadoService } from '../empregado.service';
import { EmpregadoComponent } from '../empregado.component';

@Component({
  selector: 'app-adicionar-empregadoadmissao',
  templateUrl: './adicionar-empregadoadmissao.component.html',
  styleUrls: ['./adicionar-empregadoadmissao.component.css']
})
export class AdicionarEmpregadoadmissaoComponent implements OnInit, AfterViewInit {
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
  public empregadoId = 0;
  public empregadoAdmissaoForm: FormGroup;
  public tipoContatos: TipoContato[];

  constructor(
    private empregadoService: EmpregadoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private empregadoComponent: EmpregadoComponent) { 

      this.validationMessages = {
        dataAdmissao:{
            required: 'Data de Admissão Requerida!'
          }
      };

      this.genericValidator = new GenericValidator(this.validationMessages);
      this.empregado = new Empregado();
      this.swal = new SweetAlertAdviceService();
    }

  ngOnInit() {

    if (this.route.snapshot.params['id'] === undefined) {
      this.empregadoId = 0;
    } else {
      this.empregadoId = this.route.snapshot.params['id'];
    }
    this.empregadoAdmissaoForm = this.fb.group({
      dataAdmissao: ['', [Validators.required]],
      dataExameMedico: '',
      recebeSalarioHabitacao: 'N',
      recebeSeguroDesemprego: 'N',
      recebeAdiantamento: 'N',
      percentual: ''
    });

  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.empregadoAdmissaoForm);
    });
  }

  adicionarAdmissao(){

    if (this.empregadoAdmissaoForm.dirty && this.empregadoAdmissaoForm.valid) {
      const p = Object.assign({}, this.empregado, this.empregadoAdmissaoForm.getRawValue());

        this.empregadoComponent.empregado.dataAdmissao = p.dataAdmissao;
        this.empregadoComponent.empregado.dataExameMedico = p.dataExameMedico;
        this.empregadoComponent.empregado.recebeSalarioHabitacao = p.recebeSalarioHabitacao;
        this.empregadoComponent.empregado.recebeSeguroDesemprego = p.recebeSeguroDesemprego;
        this.empregadoComponent.empregado.recebeAdiantamento = p.recebeAdiantamento;
        this.empregadoComponent.empregado.percentual = p.percentual;

      if(this.empregadoId > 0){
        
          this.empregado = this.empregadoComponent.empregado;

          if(this.empregado.pessoa.pessoaContato != null){
            for(let i = 0; i < this.empregado.pessoa.pessoaContato.length; i++){
              this.empregado.pessoa.pessoaContato[i].tipoContato = null;
            }
          }
          
          this.empregadoService.atualizarEmpregado(this.empregado)
          .subscribe(result => {}, error => this.errors);
      }

      if(this.empregadoComponent.empregado.pessoa.pessoaContato != null){

        this.empregadoService.obterTodosTipoContato()
        .subscribe(tipoContatos => {
          this.tipoContatos = tipoContatos;

          for(let i = 0; i < this.empregadoComponent.empregado.pessoa.pessoaContato.length; i++){
          
            for(let y = 0; y < this.tipoContatos.length; y++){

              if(this.empregadoComponent.empregado.pessoa.pessoaContato[i].tipoContatoId == this.tipoContatos[y].id){

                this.empregadoComponent.empregado.pessoa.pessoaContato[i].tipoContato = this.tipoContatos[y];
              }

            }
          }
        },
        error => this.errors);
    }
    
    }

    

    this.close();

  }

  cancelar() {
    this.close();
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

}
