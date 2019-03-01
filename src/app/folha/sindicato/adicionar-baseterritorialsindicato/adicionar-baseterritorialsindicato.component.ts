import { Component, OnInit, ViewChildren, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { BaseTerritorialSindicato, Localidade, Uf } from './../models/sindicato';
import { SindicatoService } from '../sindicato.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SindicatoComponent } from '../sindicato.component';
import { ListaBaseterritorialsindicatoComponent } from '../lista-baseterritorialsindicato/lista-baseterritorialsindicato.component';


@Component({
  selector: 'app-adicionar-baseterritorialsindicato',
  templateUrl: './adicionar-baseterritorialsindicato.component.html',
  styleUrls: ['./adicionar-baseterritorialsindicato.component.css']
})
export class AdicionarBaseterritorialsindicatoComponent implements OnInit {

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

  public baseTerritorialSindicato: BaseTerritorialSindicato;
  public basesTerritoriaisSindicato = [];
  public baseTerritorialSindicatoForm: FormGroup;
  public sindicatoId = 0;
  public localidades : Localidade[];
  public ufs : Uf[];
  public localidadesArray: Localidade[];


  constructor(
    private sindicatoService: SindicatoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private sindicatoComponent: SindicatoComponent,
    private listabaseTerritorialSindicatoComponent : ListaBaseterritorialsindicatoComponent
  ) {
    this.validationMessages = {
      ufId:
        {
          required: 'Uf Requerido.'
        },
      localidadeId:
        {
          required: 'Localidade Requerido.'
        },
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
    this.baseTerritorialSindicato = new BaseTerritorialSindicato();
    this.swal = new SweetAlertAdviceService();

  }

  ngOnInit() {
    if (this.route.snapshot.params['id'] === undefined) {
      this.sindicatoId = 0;
    } else {
      this.sindicatoId = this.route.snapshot.params['id'];
    }
    this.baseTerritorialSindicatoForm = this.fb.group({
      id: 0,
      sindicatoId: 0,
      ufId: ['', [Validators.required]],
      localidadeId : ['', [Validators.required]],
      excluido: 'N'
     }); // baseTerritorialSindicato

     this.sindicatoService.obterTodosUf().subscribe(
      ufs => {
         this.ufs = ufs;
      });
  }

  ConsultaLocalidade(ufId) {
    this.localidades = [];
    this.sindicatoService.obterTodosLocalidades(ufId)
      .subscribe(localidades => {
        this.localidades = localidades;
      },
        () => this.errors);
  }

  adicionarBaseTerritorialSindicato() {

    if (this.baseTerritorialSindicatoForm.dirty && this.baseTerritorialSindicatoForm.valid) {
      const p = Object.assign({}, this.baseTerritorialSindicato, this.baseTerritorialSindicatoForm.getRawValue());

      this.sindicatoComponent.dirty = true;
      if (this.sindicatoId > 0) {
        p.sindicatoId = this.sindicatoId;
        p.id = 0;
        this.sindicatoService.adicionarBaseTerritorialSindicato(p)
          .subscribe(
            result => {
              if (result) {

                if (this.sindicatoComponent.Sindicato.baseTerritorialSindicato == null) {
                  this.sindicatoComponent.Sindicato.baseTerritorialSindicato = new Array();
                }

                this.sindicatoService.obterTodosBaseTerritorialSindicatoPorSindicatoId(this.sindicatoId.toString())
                  .subscribe(result => { this.basesTerritoriaisSindicato = result
                    if(this.basesTerritoriaisSindicato != null){
                      
                      this.sindicatoService.obterTodosLocalidade()
                      .subscribe(localidades =>{ this.localidadesArray = localidades

                            for(let i = 0; i < this.basesTerritoriaisSindicato.length; i++){
                              
                                for(let y = 0; y < this.localidadesArray.length; y++){

                                    if(this.basesTerritoriaisSindicato[i].localidadeId == this.localidadesArray[y].id){

                                      this.basesTerritoriaisSindicato[i].localidade = this.localidadesArray[y];
                                    }
                                }

                            }

                            this.sindicatoComponent.sindicato.baseTerritorialSindicato = this.basesTerritoriaisSindicato;
                      });
                      
                    }

                });
                
                this.swal.showSwalSuccess('Base Territorial adicionado com sucesso!');
                this.close();
              } else {
                this.swal.showSwalErro('Ocorreu um erro ao gravar!');
              }
            },
            () => this.errors);
      } else {
        p.id = 0;
        if (this.sindicatoComponent.Sindicato.baseTerritorialSindicato.length > 0) {
          p.id = this.sindicatoComponent.Sindicato.baseTerritorialSindicato.length + 1;
        }
        for (let i = 0; this.localidades.length > i; i++) {
          if (p.localidadeId == this.localidades[i].id) {
            p.localidade = this.localidades[i];
          }
        }
        if (this.sindicatoComponent.Sindicato.baseTerritorialSindicato == null) {
          this.sindicatoComponent.Sindicato.baseTerritorialSindicato = new Array();
        }
        this.sindicatoComponent.Sindicato.baseTerritorialSindicato.push(p);
        this.close();
      }
    }

    //console.log(this.sindicatoComponent.Sindicato.baseTerritorialSindicato);
  }

  cancelar() {
    this.close();
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }


}
