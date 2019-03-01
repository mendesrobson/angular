import { Component, OnInit, ViewChildren, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormControlName, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MaskService } from '../../../services/mask.service';

import { ListaPessoaenderecoComponent } from '../lista-pessoaendereco/lista-pessoaendereco.component';
import { EmpregadoComponent } from '../empregado.component';
import { EmpregadoService } from '../empregado.service';
import { TipoLogradouro, Endereco, Uf, Pais, Localidade } from '../../../cadastros/pessoa/models/pessoa'

@Component({
  selector: 'app-adicionar-pessoaendereco',
  templateUrl: './adicionar-pessoaendereco.component.html',
  styleUrls: ['./adicionar-pessoaendereco.component.css']
})
export class AdicionarPessoaenderecoComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  showModal = false;
  @Input() visible: boolean;
  @Input() closable = true;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  swal: SweetAlertAdviceService;
  cepMask = this._maskService.Cep();
  displayMessage: { [key: string]: string } = {};

  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public errors: any[] = [];

  public endereco: Endereco;
  public enderecos = [];
  public pessoaEnderecoForm: FormGroup;
  public pessoaId = 0;
  public tipoLogradouros: TipoLogradouro[];
  public ufEnderecos: Uf[];
  public paisEnderecos: Pais[];
  public localidadeEnderecos: Localidade[];

  constructor(
    private empregadoService: EmpregadoService,
    private _maskService: MaskService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private empregadoComponent: EmpregadoComponent,
    private listaPessoaenderecoComponent: ListaPessoaenderecoComponent) { 

      this.validationMessages = {
        cep:
          {
            required: 'Cep requerido!'
          },
        numero:
          {
            required: 'Número requerido!'
          }
      };

      this.genericValidator = new GenericValidator(this.validationMessages);
      this.endereco = new Endereco();
      this.swal = new SweetAlertAdviceService();

    }

  ngOnInit() {
    if (this.route.snapshot.params['id'] == undefined)
      this.pessoaId = 0
    else
      this.pessoaId = this.empregadoComponent.empregado.pessoaId;

    this.pessoaEnderecoForm = this.fb.group({
      cep: ['', [Validators.required]],
      tipoLogradouroId: [],
      logradouro: [],
      numero: ['', [Validators.required]],
      complemento: [],
      bairro: [],
      codigoMunicipio: [],
      localidadeId: [],
      ufId: [],
      paisId: [],
      enderecoPrincipal: 'N',
      enderecoCobranca: 'N',
      enderecoEntragaDocumento: 'N',
      enderecoFaturamento: 'N'
    });

    this.pessoaEnderecoForm.controls['logradouro'].disable();
    this.pessoaEnderecoForm.controls['bairro'].disable();
    this.pessoaEnderecoForm.controls['codigoMunicipio'].disable();
    this.pessoaEnderecoForm.controls['localidadeId'].disable();
    this.pessoaEnderecoForm.controls['ufId'].disable();
    this.pessoaEnderecoForm.controls['paisId'].disable();

    this.empregadoService.obterTodosTipoLogradouro()
      .subscribe(tipoLogradouros => {
        this.tipoLogradouros = tipoLogradouros
      },
        error => this.errors);

      this.empregadoService.obterTodosLocalidadeEndereco()
      .subscribe(localidadeEnderecos => {
        this.localidadeEnderecos = localidadeEnderecos
      },
        error => this.errors);

    this.empregadoService.obterTodosUfEndereco()
      .subscribe(ufEnderecos => {
        this.ufEnderecos = ufEnderecos
      },
        error => this.errors);

    this.empregadoService.obterTodosPaisEndereco()
      .subscribe(paisEnderecos => {
        this.paisEnderecos = paisEnderecos
      },
        error => this.errors);

  }

  ConsultaCEP(cep) {
    cep = cep.replace(/\D/g, '');
    if (cep != "") {
      var validacep = /^[0-9]{8}$/;
      if (validacep.test(cep)) {
        this.httpClient.get("//cepapi.delivoro.com.br/" + cep)
          .map(dados => dados)
          .subscribe(dados => this.popularForm(dados));
      }
    }
  }

  popularForm(dados) {
    this.obterLocalidadeId(dados.cidade);
    this.obterUfId(dados.cidade);
    this.obterTipoLogradouroId(dados.tipoLogradouro);
    this.obterPaisId('Brasil');
    this.consultaCepCodMunicipio(dados.cep);

    this.pessoaEnderecoForm.patchValue({
      logradouro: dados.logradouro,
      bairro: dados.bairro
    });
  }

  obterLocalidadeId(desc: string) {
    this.empregadoService.obterLocalidadeId(desc)
      .subscribe(
        result => {
          this.pessoaEnderecoForm.controls['localidadeId'].patchValue(result[0].id);
        },
        error => {
          this.errors;
        })
  }

  obterUfId(desc: string) {
    this.empregadoService.obterUfId(desc)
      .subscribe(
        result => {
          this.pessoaEnderecoForm.controls['ufId'].patchValue(result[0].id);
        },
        error => {
          this.errors;
        })
  }

  obterTipoLogradouroId(desc: string) {
    this.empregadoService.obterTipoLogradouroId(desc)
      .subscribe(
        result => {
          this.pessoaEnderecoForm.controls['tipoLogradouroId'].patchValue(result[0].id);
        },
        error => {
          this.errors;
        })
  }

  obterPaisId(desc: string) {
    this.empregadoService.obterPaisId(desc)
      .subscribe(
        result => {
          this.pessoaEnderecoForm.controls['paisId'].patchValue(result[0].id);
        },
        error => {
          this.errors;
        })
  }

  consultaCepCodMunicipio(cep) {
    cep = cep.replace(/\D/g, '');
    if (cep != "") {
      var validacep = /^[0-9]{8}$/;
      if (validacep.test(cep)) {
        this.httpClient.get<any>("//viacep.com.br/ws/" + cep + "/json/")
          .map(result => result)
          .subscribe(result => this.pessoaEnderecoForm.controls['codigoMunicipio'].patchValue(result.ibge));
      }
    }
  }

  adicionarPessoaEndereco() {
    
    this.enderecos = this.empregadoComponent.empregado.pessoa.endereco;

    if (this.pessoaEnderecoForm.dirty && this.pessoaEnderecoForm.valid) {
      let p = Object.assign({}, this.endereco, this.pessoaEnderecoForm.getRawValue());

      this.empregadoComponent.dirty = true;
      
      if (this.enderecos != null) {
        if (p.enderecoPrincipal == "S") {
          for (var i = 0; i < this.enderecos.length; i++) {
            if (this.enderecos[i].enderecoPrincipal == "S") {
              this.enderecos[i].enderecoPrincipal = "N";

              if (this.pessoaId > 0) {
                p.pessoaId = this.pessoaId;
                this.empregadoService.atualizarEndereco(this.enderecos[i])
                  .subscribe(
                    result => {
                    },
                    error => {
                      this.errors;
                    });
              }
            }
          }
        }
      }

      if (this.pessoaId > 0) {
        p.pessoaId = this.pessoaId;
        this.empregadoService.adicionarEndereco(p)
          .subscribe(
            result => {

              if(this.empregadoComponent.empregado.pessoa.endereco == null){
                this.empregadoComponent.empregado.pessoa.endereco = new Array();
              }

              this.empregadoService.obterTodosEnderecoPorPessoaId(this.pessoaId.toString())
              .subscribe(result => { this.enderecos = result;

                if(this.enderecos != null){

                  this.empregadoComponent.empregado.pessoa.endereco = this.enderecos;
                  
                }

              });

              this.listaPessoaenderecoComponent.pessoaEnderecoGravado('Endereço adicionado com sucesso!');
              this.close();
            },
            error => {
              this.errors;
            });
      } else {
        p.id = 0;
        if(this.enderecos != null){
          
          if (this.empregadoComponent.empregado.pessoa.endereco.length > 0) {
            p.id = this.empregadoComponent.empregado.pessoa.endereco.length + 1;
          }
        }
        else{
          
          this.empregadoComponent.empregado.pessoa.endereco = new Array();
        }
        
        this.empregadoComponent.empregado.pessoa.endereco.push(p);
        this.listaPessoaenderecoComponent.pessoaEnderecoGravado('Endereço adicionado com sucesso!');
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
