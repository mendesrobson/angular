import { Component, OnInit } from '@angular/core';
import { Empregado, Estagio, Itinerario, EmpregadoDependente, EmpregadoOrgaoClasse, EmpregadoLotacao } from './models/empregado';
import { Endereco, Pessoa, PessoaContato } from '../../cadastros/pessoa/models/pessoa';

@Component({
  template: '<router-outlet></router-outlet>'
})
export class EmpregadoComponent {

    public empregado: Empregado;
    public endereco: Endereco;
    public contato: PessoaContato;
    public estagio: Estagio;
    public itinerario : Itinerario;
    public empregadoDependente: EmpregadoDependente;
    public empregadoOrgaoClasse: EmpregadoOrgaoClasse;
    public empregadoLotacao: EmpregadoLotacao;
    public dirty: boolean;


  public constructor() {

    this.endereco = new Endereco();
    this.contato = new PessoaContato();
    this.empregado = new Empregado();
    this.estagio = new Estagio();
    this.empregado.pessoa = new Pessoa;
    this.itinerario = new Itinerario();
    this.empregadoDependente = new EmpregadoDependente();
    this.empregadoOrgaoClasse = new EmpregadoOrgaoClasse();
    this.empregadoLotacao = new EmpregadoLotacao();

    this.empregado.pessoa.endereco = new Array();
    this.empregado.pessoa.pessoaContato = new Array();
    this.empregado.estagio = new Array();
    this.empregado.itinerario = new Array();
    this.empregado.empregadoDependente = new Array();
    this.empregado.empregadoOrgaoClasse = new Array();
    this.empregado.empregadoLotacao = new Array();
    
    this.empregado.pessoa.pessoaContato = new Array();

   }

    set Endereco(endereco: Endereco){
     this.endereco = endereco;
    }
    
    get Endereco(){
      return this.endereco;
    }

    set Contato(contato: PessoaContato){
      this.contato = contato;
     }

     get Contato(){
       return this.contato;
     }

     set Estagio(estagio: Estagio){
      this.estagio = estagio;
     }

     get Estagio(){
       return this.estagio;
     }

     set Itinerario(itinerario: Itinerario){
      this.itinerario = itinerario;
     }

     get Itinerario(){
       return this.itinerario;
     }

     set EmpregadoDependente(empregadoDependente: EmpregadoDependente){
      this.empregadoDependente = empregadoDependente;
     }

     get EmpregadoDependente(){
       return this.empregadoDependente;
     }
	 
	  set EmpregadoOrgaoClasse(empregadoOrgaoClasse: EmpregadoOrgaoClasse){
      this.empregadoOrgaoClasse = empregadoOrgaoClasse;
     }

     get EmpregadoOrgaoClasse(){
       return this.empregadoOrgaoClasse;
     }

     set EmpregadoLotacao(empregadoLotacao: EmpregadoLotacao){
      this.empregadoLotacao = empregadoLotacao;
     }
     
     get EmpregadoLotacao(){
       return this.empregadoLotacao;
     }

}
