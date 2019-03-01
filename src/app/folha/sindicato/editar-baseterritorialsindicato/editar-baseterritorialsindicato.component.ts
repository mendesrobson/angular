import { Component, OnInit, ViewChildren, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { BaseTerritorialSindicato, Localidade, Uf } from '../models/sindicato';
import { SindicatoService } from '../sindicato.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SindicatoComponent } from '../sindicato.component';
import { ListaBaseterritorialsindicatoComponent } from '../lista-baseterritorialsindicato/lista-baseterritorialsindicato.component';


@Component({
  selector: 'app-editar-baseterritorialsindicato',
  templateUrl: './editar-baseterritorialsindicato.component.html',
  styleUrls: ['./editar-baseterritorialsindicato.component.css']
})
export class EditarBaseterritorialsindicatoComponent implements OnInit {
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
  public localidades: Localidade[];
  public ufs : Uf[];

  constructor(
    private sindicatoService: SindicatoService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private sindicatoComponent: SindicatoComponent,
    private listbaseTerritorialSindicato: ListaBaseterritorialsindicatoComponent
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

    this.preencherBaseTerritorialSindicato(this.sindicatoComponent.BaseTerritorialSindicato);
  }

  ConsultaLocalidade(ufId) {
    this.localidades = [];
    this.sindicatoService.obterTodosLocalidades(ufId)
      .subscribe(localidades => {
        this.localidades = localidades;
      },
        () => this.errors);
  }

  preencherBaseTerritorialSindicato(baseTerritorialSindicato: BaseTerritorialSindicato) {
    this.baseTerritorialSindicatoForm.patchValue({
      id: baseTerritorialSindicato.id,
      sindicatoId: baseTerritorialSindicato.sindicatoId,
      localidadeId: baseTerritorialSindicato.localidadeId,
      ufId: baseTerritorialSindicato.ufId
    });
  }

  editarBaseTerritorialSindicato() {
    this.basesTerritoriaisSindicato = this.sindicatoComponent.Sindicato.baseTerritorialSindicato;
    if (this.baseTerritorialSindicatoForm.dirty && this.baseTerritorialSindicatoForm.valid) {
      const p = Object.assign({}, this.baseTerritorialSindicato, this.baseTerritorialSindicatoForm.getRawValue());

      this.sindicatoComponent.dirty = true;

      if (this.sindicatoId > 0) {
        p.cargoId = this.sindicatoId;
        p.cbo = null;
        this.sindicatoService.atualizarBaseTerritorialSindicato(p)
          .subscribe(
            result => {
              if (result) {
                for (let i = 0; this.localidades.length > i; i++) {
                  if (p.localidadeId === this.localidades[i].id) {
                    p.localidade = this.localidades[i];
                  }
                }
                for (let i = 0; this.ufs.length > i; i++) {
                  if (p.ufId === this.ufs[i].id) {
                    p.uf = this.ufs[i];
                  }
                }
                for (let i = 0; this.sindicatoComponent.Sindicato.baseTerritorialSindicato.length > i; i++) {
                    if (p.id === this.sindicatoComponent.Sindicato.baseTerritorialSindicato[i].id) {
                      this.sindicatoComponent.Sindicato.baseTerritorialSindicato[i] = p;
                     }
                }
                this.swal.showSwalSuccess('Base Territorial, Editado com Sucesso!');
                this.close();
              } else {
                this.swal.showSwalErro('Ocorreu um erro ao gravar!');
              }

            },
            () =>  this.errors
        );

      } else {

        this.baseTerritorialSindicato = p;
        for (let i = 0; this.localidades.length > i; i++) {
          if (this.baseTerritorialSindicato.localidadeId === this.localidades[i].id) {
            this.baseTerritorialSindicato.localidade = this.localidades[i];
          }
        }
        for (let i = 0; this.ufs.length > i; i++) {
          if (this.baseTerritorialSindicato.ufId === this.ufs[i].id) {
            this.baseTerritorialSindicato.uf = this.ufs[i];
          }
        }
        for (let i = 0; this.sindicatoComponent.Sindicato.baseTerritorialSindicato.length > i; i++) {
          if (this.baseTerritorialSindicato.id === this.sindicatoComponent.Sindicato.baseTerritorialSindicato[i].id) {
            this.sindicatoComponent.Sindicato.baseTerritorialSindicato[i] = this.baseTerritorialSindicato;
          }
        }

        this.listbaseTerritorialSindicato.baseTerritorialSindicatoGravado('Base Territorial editado com sucesso!');
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

