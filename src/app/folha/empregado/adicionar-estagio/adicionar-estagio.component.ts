import { Component, OnInit, Input, Output, ViewChildren, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from '../../../../../node_modules/rxjs';


import { Empregado, Estagio, Nivel, CoordenadorDeEstagio, AgenteIntegrador, InstituicaoEnsino} from '../models/empregado';
import { EmpregadoService } from '../empregado.service';
import { EmpregadoComponent } from '../empregado.component';
import { ListaEstagioComponent } from '../lista-estagio/lista-estagio.component';

@Component({
  selector: 'app-adicionar-estagio',
  templateUrl: './adicionar-estagio.component.html',
  styleUrls: ['./adicionar-estagio.component.css']
})
export class AdicionarEstagioComponent implements OnInit, AfterViewInit {
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
  public estagio: Estagio;
  public estagios: Estagio[];
  public niveis: Nivel[];
  public coordenadoresDeEstagios: CoordenadorDeEstagio[];
  public agentesIntegradores: AgenteIntegrador[];
  public instituicoesDeEnsino: InstituicaoEnsino[]; 
  public empregadoId = 0;
  public estagioForm: FormGroup;


  constructor(
    private empregadoService: EmpregadoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private empregadoComponent: EmpregadoComponent,
    private listaEstagioComponent: ListaEstagioComponent) { 

      this.validationMessages = {
        natureza:{
            required: 'Natureza Requerida!'
          },
        nivel:{
            required: 'Nível requerido!'
          },
        instituicaoEnsinoId:{
            required: 'Instituição de Ensino requerido!'
          },
        dataTermino:{
            required: 'Data termino requerido!'
          }
      };

      this.genericValidator = new GenericValidator(this.validationMessages);
      this.empregado = new Empregado();
      this.estagios = new Array();
      this.estagio = new Estagio();
      this.swal = new SweetAlertAdviceService();

    }

  ngOnInit() {

    if (this.route.snapshot.params['id'] === undefined) {
      this.empregadoId = 0;
    } else {
      this.empregadoId = this.route.snapshot.params['id'];
    }
    this.estagioForm = this.fb.group({
      id: 0,
      natureza: ['', [Validators.required]],
      nivel: ['', [Validators.required]],
      areaAtuacao: '',
      coordenadorEstagioId: '',
      agenteIntegradorId: '',
      instituicaoEnsinoId: ['', [Validators.required]],
      numeroApolice: '',
      dataInicio: '',
      dataTermino: ['', [Validators.required]],
      excluido: 'N'
    });

    this.niveis = [
      {id: 1, descricao: 'Fundamental'},
      {id: 2, descricao: 'Médio'},
      {id: 3, descricao: 'Formação Profissional'},
      {id: 4, descricao: 'Superior'},
      {id: 8, descricao: 'Especial'},
      {id: 9, descricao: 'Mãe social'}
    ];

    this.empregadoService.obterTodosCoordenadorDeEstagio()
    .subscribe(result => { this.coordenadoresDeEstagios = result;});

    this.empregadoService.obterTodosAgenteIntegrador()
    .subscribe(result => { this.agentesIntegradores = result });

    this.empregadoService.ObterTodosInstituicaoEnsino()
    .subscribe(result => { this.instituicoesDeEnsino = result });

  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.estagioForm);
    });
  }

  adicionarEstagio() {
    
    this.estagios = this.empregadoComponent.empregado.estagio;

    if (this.estagioForm.dirty && this.estagioForm.valid) {
      let p = Object.assign({}, this.estagio, this.estagioForm.getRawValue());

      this.empregadoComponent.dirty = true;
      
      if (this.empregadoId > 0) {

        p.empregadoId = this.empregadoId;
        p.agenteIntegrador = null;
        p.coordenadorDeEstagio = null;
        p.instituicaoEnsino = null;
        p.empregado = null;

        this.empregadoService.adicionarEstagio(p)
          .subscribe(
            result => {

              if(this.empregadoComponent.empregado.estagio == null){
                this.empregadoComponent.empregado.estagio = new Array();
              }

              this.empregadoService.obterTodosEstagioPorEmpregadoId(this.empregadoId.toString())
              .subscribe(result => { this.estagios = result;

              if(this.estagios != null && this.estagios.length > 0){

                for(let i = 0; i < this.estagios.length; i++){

                    for(let y = 0; y < this.instituicoesDeEnsino.length; y++){

                        if(this.estagios[i].instituicaoEnsinoId == this.instituicoesDeEnsino[y].id){

                            this.estagios[i].instituicaoEnsino = this.instituicoesDeEnsino[y];

                        }

                    }

                }

              }

              this.empregadoComponent.empregado.estagio = this.estagios;
              
              });

              this.listaEstagioComponent.estagioGravado('Estágio adicionado com sucesso!');
              this.close();
            },
            error => {
              this.errors;
            });
      } else {
        
        p.id = 0;
        
        if(this.estagios != null){
          
          if (this.estagios.length > 0) {
            p.id = this.estagios.length + 1;
          }
        }

        for(let i = 0; i < this.instituicoesDeEnsino.length; i++){

          if(p.instituicaoEnsinoId == this.instituicoesDeEnsino[i].id){

              p.instituicaoEnsino = this.instituicoesDeEnsino[i];
          }

        }
        if(this.empregadoComponent.empregado.estagio == null){
          this.empregadoComponent.empregado.estagio = new Array();
        }
        
        this.empregadoComponent.empregado.estagio.push(p);
        this.listaEstagioComponent.estagioGravado('Estágio adicionado com sucesso!');
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
