import { Component } from '@angular/core';
import { Pessoa, Endereco, PessoaContato, PessoaCnae, EmpresaContaCorrente, PessoaRegimeTributario,
        FornecedorContaCorrente, Fornecedor, Cliente, ClienteContaCorrente } from '../pessoa/models/pessoa';
import { Empresa } from '../empresa/models/empresa';
import { ClienteSindicato } from '../cliente/models/cliente';

@Component({
  template: `
    <router-outlet></router-outlet>
  `
})
export class PessoaComponent {

  public pessoa: Pessoa;
  public fornecedor: Fornecedor;
  public cliente : Cliente;
  public pessoaEndereco: Endereco;
  public pessoaContato: PessoaContato;
  public pessoaCnae: PessoaCnae;
  public empresaContaCorrente: EmpresaContaCorrente;
  public fornecedorContaCorrente: FornecedorContaCorrente;
  public pessoaRegimeTributario: PessoaRegimeTributario;
  public clienteSindicato: ClienteSindicato;
  public clienteContaCorrente: ClienteContaCorrente;
  public empresa: Empresa[];
  public dirty: boolean;

  constructor() {
    this.pessoa = new Pessoa();
    this.fornecedor = new Fornecedor();
    this.cliente = new  Cliente();

    this.pessoaEndereco = new Endereco();
    this.pessoaContato = new PessoaContato();
    this.empresaContaCorrente = new EmpresaContaCorrente();
    this.clienteSindicato = new ClienteSindicato();
    this.fornecedorContaCorrente = new FornecedorContaCorrente();
    this.clienteContaCorrente = new ClienteContaCorrente();
   

    this.pessoa.endereco = new Array();
    this.pessoa.pessoaContato = new Array(); 
    this.pessoa.pessoaCnae = new Array();    
    this.pessoa.empresaContaCorrente = new Array();   
    this.pessoa.pessoaRegimeTributario = new Array(); 
    this.empresa = new Array();
    this.fornecedor.fornecedorContaCorrente = new Array();
    this.fornecedor.pessoa = new Pessoa();
    this.cliente.clienteSindicato = new Array();
    this.cliente.clienteContaCorrente = new Array();
  }

  set Pessoa(pessoa: Pessoa) {
    this.pessoa = pessoa;
  }

  get Pessoa(): Pessoa {
    return this.pessoa;
  }

  set PessoaEndereco(pessoaEndereco: Endereco) {
    this.pessoaEndereco = pessoaEndereco;
  }

  get PessoaEndereco(): Endereco {
    return this.pessoaEndereco;
  }

  set PessoaContato(pessoaContato: PessoaContato) {
    this.pessoaContato = pessoaContato;
  }

  get PessoaContato(): PessoaContato {
    return this.pessoaContato;
  }


  set PessoaCnae(pessoaCnae: PessoaCnae) {
    this.pessoaCnae = pessoaCnae;
  }

  get PessoaCnae(): PessoaCnae {
    return this.pessoaCnae;
  }
  
  set EmpresaContaCorrente(empresaContaCorrente: EmpresaContaCorrente) {
    this.empresaContaCorrente = empresaContaCorrente;
  }

  get EmpresaContaCorrente(): EmpresaContaCorrente {
    return this.empresaContaCorrente;
  }

  set PessoaRegimeTributario(pessoaRegimeTributario: PessoaRegimeTributario) {
    this.pessoaRegimeTributario = pessoaRegimeTributario;
  }

  get PessoaRegimeTributario(): PessoaRegimeTributario {
    return this.pessoaRegimeTributario;
  }

  set ClienteSindicato(clienteSindicato: ClienteSindicato) {
    this.clienteSindicato = clienteSindicato;
  }

  get ClienteSindicato(): ClienteSindicato {
    return this.clienteSindicato;
  }

  set FornecedorContaCorrente(fornecedorContaCorrente: FornecedorContaCorrente) {
    this.fornecedorContaCorrente = fornecedorContaCorrente;
  }

  get FornecedorContaCorrente(): FornecedorContaCorrente {
    return this.fornecedorContaCorrente;
  }

  set Fornecedor(fornecedor: Fornecedor) {
    this.fornecedor = fornecedor;
  }

  get Fornecedor(): Fornecedor {
    return this.fornecedor;
  }

  get Cliente(): Cliente{
    return this.cliente;
  }

  set Cliente(cliente: Cliente) {
    this.cliente = cliente;
  }
}
