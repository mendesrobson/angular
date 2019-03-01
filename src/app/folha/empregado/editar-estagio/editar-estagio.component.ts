import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { FormControlName, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from '../../../../../node_modules/rxjs';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';

import { UtilService } from '../../../services/util.service';
import { Empregado, Estagio, Nivel, CoordenadorDeEstagio, AgenteIntegrador, InstituicaoEnsino} from '../models/empregado';
import { EmpregadoService } from '../empregado.service';
import { EmpregadoComponent } from '../empregado.component';
import { ListaEstagioComponent } from '../lista-estagio/lista-estagio.component';

@Component({
  selector: 'app-editar-estagio',
  templateUrl: './editar-estagio.component.html',
  styleUrls: ['./editar-estagio.component.css']
})
export class EditarEstagioComponent implements OnInit, AfterViewInit {
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
    private listaEstagioComponent: ListaEstagioComponent,
    private _utilService: UtilService) { 

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

    this.preencherEstagio(this.empregadoComponent.estagio);
  }

  preencherEstagio(estagio: Estagio) : void {

    this.estagio = estagio;

    this.estagioForm.patchValue({
      natureza: this.estagio.natureza,
      nivel: parseInt(this.estagio.nivel),
      areaAtuacao: this.estagio.areaAtuacao,
      coordenadorEstagioId: this.estagio.coordenadorEstagioId,
      agenteIntegradorId: this.estagio.agenteIntegradorId,
      instituicaoEnsinoId: this.estagio.instituicaoEnsinoId,
      numeroApolice: this.estagio.numeroApolice,
      dataInicio: this._utilService.ToDate(this.estagio.dataInicio),
      dataTermino: this._utilService.ToDate(this.estagio.dataTermino)
    });
 }

 ngAfterViewInit(): void {
  const controlBlurs: Observable<any>[] = this.formInputElements
    .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
  Observable.merge(...controlBlurs).subscribe(() => {
    this.displayMessage = this.genericValidator.processMessages(this.estagioForm);
  });
}

editarEstagio() {

  if (this.estagioForm.dirty && this.estagioForm.valid) {
    let p = Object.assign({}, this.estagio, this.estagioForm.getRawValue());

    p.id = this.empregadoComponent.estagio.id;

    this.empregadoComponent.dirty = true;

    if (this.empregadoId > 0) {

      p.empregadoId = this.empregadoId;

      this.empregadoService.atualizarEstagio(p)
        .subscribe(
          result => {
            if (result) {

              for(let i = 0; i < this.instituicoesDeEnsino.length; i++){
                
                  if(p.instituicaoEnsinoId == this.instituicoesDeEnsino[i].id){

                      p.instituicaoEnsino = this.instituicoesDeEnsino[i];
                  }

              }

              for (let i = 0; this.empregadoComponent.empregado.estagio.length > i; i++) {
                  if (p.id === this.empregadoComponent.empregado.estagio[i].id) {
                    this.empregadoComponent.empregado.estagio[i] = p;
                   }
              }
              this.swal.showSwalSuccess('Estágio editado com sucesso!');
              this.close();
            } else {
              this.swal.showSwalErro('Ocorreu um erro ao gravar!');
            }

          },
          (erro) => {
            this.errors = erro;
          });

    } else {

      this.estagio = p;

      for(let i = 0;  i < this.instituicoesDeEnsino.length; i++){

          if(this.instituicoesDeEnsino[i].id == this.estagio.instituicaoEnsinoId){

              this.estagio.instituicaoEnsino = this.instituicoesDeEnsino[i];
          }

      }

      for (let i = 0; this.empregadoComponent.empregado.estagio.length > i; i++) {
        if (this.estagio.id === this.empregadoComponent.empregado.estagio[i].id) {
          this.empregadoComponent.empregado.estagio[i] = this.estagio;
        }
      }
      this.swal.showSwalSuccess('Estágio editado com sucesso!');
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
