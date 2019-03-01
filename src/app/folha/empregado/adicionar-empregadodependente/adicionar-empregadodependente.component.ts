import { Component, OnInit, Input, Output, ViewChildren, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
import { FormControlName, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from '../../../../../node_modules/rxjs';
import { MaskService } from '../../../services/mask.service';

import { Empregado, EmpregadoDependente, Parentesco, Nacionalidade, Uf, Localidade} from '../models/empregado';
import { EmpregadoService } from '../empregado.service';
import { EmpregadoComponent } from '../empregado.component';

@Component({
  selector: 'app-adicionar-empregadodependente',
  templateUrl: './adicionar-empregadodependente.component.html',
  styleUrls: ['./adicionar-empregadodependente.component.css']
})
export class AdicionarEmpregadodependenteComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  now = Date.now();
  
  showModal = false;
  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  cpfMask = this._maskService.Cpf();
  swal: SweetAlertAdviceService;
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public errors: any[] = [];

  public empregadoDependente: EmpregadoDependente;
  public empregadoDependentes: EmpregadoDependente[];
  public parentescos: Parentesco[];
  public nacionalidades: Nacionalidade[];
  public ufs: Uf[];
  public localidades: Localidade[];
  public empregadoId = 0;
  public empregadoDependenteForm: FormGroup;

  constructor(
    private empregadoService: EmpregadoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private empregadoComponent: EmpregadoComponent,
    private _maskService: MaskService) { 

      this.validationMessages = {
        cpf:{
          required: 'Cpf requerido!'
        },
        nomeDependente:{
          required: 'Nome do dependente requerido!'
        },
        parentescoId:{
          required: 'Parentesco requerido!'
        },
        dataNascimento:{
          required: 'Data de nascimento requerido!'
        }
      };

      this.genericValidator = new GenericValidator(this.validationMessages);
      this.empregadoDependente = new EmpregadoDependente();
      this.empregadoDependentes = new Array();
      this.swal = new SweetAlertAdviceService();

    }

  ngOnInit() {

    if (this.route.snapshot.params['id'] === undefined) {
      this.empregadoId = 0;
    } else {
      this.empregadoId = this.route.snapshot.params['id'];
    }

    this.empregadoDependenteForm = this.fb.group({
      id: 0,
      cpf: ['', [Validators.required]],
      nomeDependente: ['', [Validators.required]],
      parentescoId: ['', [Validators.required]],
      dataNascimento: ['', [Validators.required]],
      invalido: 'N',
      dependenteIrrf: 'N',
      dependenteSalarioFamilia: 'N',
      nacionalidadeId: null,
      ufNascimentoId: null,
      localidadeId: null,
      certidaoNascimento: '',
      livro: '',
      folha: '',
      dataEntrega: '',
      cartorio: '',
      excluido: 'N'
    });

    this.empregadoService.obterTodosParentescos()
    .subscribe(result => { this.parentescos = result;});

    this.empregadoService.obterTodosNacionalidade()
    .subscribe(result => { this.nacionalidades = result;});

    this.empregadoService.obterTodosUf()
    .subscribe(result => { this.ufs = result });
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));
    Observable.merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.empregadoDependenteForm);
    });
  }

  ConsultaLocalidades(id){

    this.empregadoService.obterLocalidadePorUf(id)
    .subscribe(result => { this.localidades = result });

    this.empregadoService.obterUfId
    
  }

  adicionarEmpregadoDependente() {

    if (this.empregadoDependenteForm.dirty && this.empregadoDependenteForm.valid) {
     
     const p = Object.assign({}, this.empregadoDependente, this.empregadoDependenteForm.getRawValue());
     
     this.empregadoComponent.dirty = true;

     if (this.empregadoId > 0) {

       p.empregadoId = this.empregadoId;
       p.parentesco = null;
       
       this.empregadoService.adicionarEmpregadoDependente(p)
         .subscribe(
           result => {
             if (result) {
              
               this.empregadoService.obterTodosEmpregadoDependentesPorEmpregadoId(this.empregadoId.toString())
               .subscribe(result => { this.empregadoDependentes = result;
                
                for(let i = 0; i < this.empregadoDependentes.length; i++){

                    for(let y = 0; y < this.parentescos.length; y++){

                        if(this.empregadoDependentes[i].parentescoId == this.parentescos[y].id){

                            this.empregadoDependentes[i].parentesco = this.parentescos[y];
                        }

                    }  

                }
              
                this.empregadoComponent.empregado.empregadoDependente = this.empregadoDependentes;

              });
               
               
               this.swal.showSwalSuccess('Dependente adicionado com sucesso!'); 
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

        if(this.empregadoComponent.empregado.empregadoDependente != null){
          if (this.empregadoComponent.empregado.empregadoDependente.length > 0) {
            p.id = this.empregadoComponent.empregado.empregadoDependente.length + 1;
          }
        }

        if(p.parentescoId > 0){

            for(let i = 0; i < this.parentescos.length; i++){

                  if(p.parentescoId == this.parentescos[i].id){

                      p.parentesco = this.parentescos[i];
                  }

            }

        }  
       
       
       if (this.empregadoComponent.empregado.empregadoDependente == null) {
         this.empregadoComponent.empregado.empregadoDependente = new Array();
       }
       this.empregadoComponent.empregado.empregadoDependente.push(p);
       this.swal.showSwalSuccess('Dependente adicionado com sucesso!');
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
