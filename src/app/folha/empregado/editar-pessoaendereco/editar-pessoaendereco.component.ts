import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { FormControlName, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SweetAlertAdviceService } from '../../../services/sweetalert.advice.service';
import { GenericValidator } from '../../../validation/generic-form-validator';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from '../../../../../node_modules/rxjs';
import { MaskService } from '../../../services/mask.service';
import { UtilService } from '../../../services/util.service';

import { ListaPessoaenderecoComponent } from '../lista-pessoaendereco/lista-pessoaendereco.component';
import { EmpregadoComponent } from '../empregado.component';
import { EmpregadoService } from '../empregado.service';
import { TipoLogradouro, Endereco, Uf, Pais, Localidade } from '../../../cadastros/pessoa/models/pessoa'

@Component({
  selector: 'app-editar-pessoaendereco',
  templateUrl: './editar-pessoaendereco.component.html',
  styleUrls: ['./editar-pessoaendereco.component.css']
})
export class EditarPessoaenderecoComponent implements OnInit {
  [x: string]: any;
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
  public diasTrabalhados: boolean = false;

  constructor(
    private empregadoService: EmpregadoService,
    private fb: FormBuilder, 
    private route: ActivatedRoute,
    private utilService: UtilService,
    private httpClient: HttpClient,
    private empregadoComponent: EmpregadoComponent,
    private listaPessoaenderecoComponent: ListaPessoaenderecoComponent,
    private _maskService: MaskService) { 

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

  this.preencherPessoaEndereco(this.empregadoComponent.endereco);
  }

  preencherPessoaEndereco(endereco: Endereco) : void {

    this.endereco = endereco;

    this.pessoaEnderecoForm.patchValue({
      cep: this.endereco.cep,
      tipoLogradouroId: this.endereco.tipoLogradouroId ,
      logradouro: this.endereco.logradouro,
      numero: this.endereco.numero,
      complemento: this.endereco.complemento,
      bairro: this.endereco.bairro,
      codigoMunicipio: this.endereco.codigoMunicipio,
      localidadeId: this.endereco.localidadeId,
      ufId: this.endereco.ufId,
      paisId: this.endereco.paisId,
      enderecoPrincipal: this.endereco.enderecoPrincipal,
      enderecoCobranca: this.endereco.enderecoCobranca,
      enderecoEntragaDocumento: this.endereco.enderecoEntragaDocumento,
      enderecoFaturamento: this.endereco.enderecoFaturamento
      
    });
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

 editarPessoaEndereco() {
  this.enderecos = this.empregadoComponent.empregado.pessoa.endereco;

  if (this.pessoaEnderecoForm.dirty && this.pessoaEnderecoForm.valid) {
    let p = Object.assign({}, this.endereco, this.pessoaEnderecoForm.getRawValue());

    p.id = this.empregadoComponent.endereco.id;

    if(this.enderecos != null){

      if (p.enderecoPrincipal == "S") {
        for (var i = 0; i < this.enderecos.length; i++) {
          if (this.enderecos[i].enderecoPrincipal == "S") {
            this.enderecos[i].enderecoPrincipal = "N";

            if (this.pessoaId > 0) {
              
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

    this.empregadoComponent.dirty = true;

    if (this.pessoaId > 0) {
      p.pessoaId = this.pessoaId;
      this.empregadoService.atualizarEndereco(p)
        .subscribe(
          result => {
            if (result) {
              for (let i = 0; this.empregadoComponent.empregado.pessoa.endereco.length > i; i++) {
                  if (p.id === this.empregadoComponent.empregado.pessoa.endereco[i].id) {
                    this.empregadoComponent.empregado.pessoa.endereco[i] = p;
                   }
              }
              this.swal.showSwalSuccess('Endereço editado com Sucesso!');
              this.close();
            } else {
              this.swal.showSwalErro('Ocorreu um erro ao gravar!');
            }

          },
          (erro) => {
            this.errors = erro;
          });

    } else {

      this.endereco = p;

      for (let i = 0; this.empregadoComponent.empregado.pessoa.endereco.length > i; i++) {
        if (this.endereco.id === this.empregadoComponent.empregado.pessoa.endereco[i].id) {
          this.empregadoComponent.empregado.pessoa.endereco[i] = this.endereco;
        }
      }
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
