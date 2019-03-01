import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import {
  Pessoa, Fornecedor, Cliente, TipoPessoa, Sexo, Localidade, Uf, EstadoCivil, Profissao,
  Religiao, Cor, Cnpj, Cnae, PessoaCnae, Endereco, PessoaContato, TipoLogradouro, Pais, Cep,
  Departamento, Cargo, TipoContato, EmpresaContaCorrente, IContaCorrente, ContaCorrente, PessoaRegimeTributario,
  RegimeTributario, Servico, FornecedorContaCorrente, ClienteContaCorrente
} from './models/pessoa';
import { GrupoEmpresa, Empresa } from '../empresa/models/empresa';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Banco } from '../banco/models/banco';
import { ClienteSindicato, SindicatoConvencao, Convencao, Sindicato } from '../cliente/models/cliente';


@Injectable()
export class PessoaService {

  constructor(private httpClient: HttpClient) { }

  RemoverPessoa(pessoa: Pessoa): Observable<Pessoa> {
    return this.httpClient.post<Pessoa>(environment.url_contas_receber + "/Pessoa/RemoverPessoa", pessoa);
  }

  RemoverCliente(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.post<Cliente>(environment.url_contas_receber + "/Pessoa/RemoverCliente", cliente);
  }

  RemoverEmpresa(empresa: Empresa): Observable<Empresa> {
    return this.httpClient.post<Empresa>(environment.url_contas_receber + "/Empresa/RemoverEmpresa", empresa);
  }



  ReativarPessoa(pessoa: Pessoa): Observable<Pessoa> {
    return this.httpClient.post<Pessoa>(environment.url_contas_receber + "/Pessoa/ReativarPessoa", pessoa);
  }

  ReativarCliente(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.post<Cliente>(environment.url_contas_receber + "Pessoa/ReativarCliente", cliente);
  }



  ReativarEmpresa(empresa: Empresa): Observable<Empresa> {
    return this.httpClient.post<Empresa>(environment.url_contas_receber + "/Empresa/ReativarEmpresa", empresa);
  }

  obterPessoa(id: string): Observable<Pessoa> {
    return this.httpClient.get<Pessoa>(environment.url_contas_receber + "/Pessoa/ObterPessoaPorId/" + id);
  };

  ObterPessoaPorCodigo(codigo: string): Observable<Pessoa>{
    return this.httpClient.get<Pessoa>(environment.url_contas_receber + "/Pessoa/ObterPessoaPorCodigo/" + codigo)
  }

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
  }

  obterTodosEmpresaGrupo(id: string): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Pessoa/obterTodosEmpresaGrupo/" + id);
  }

  obterTodosEmpresa(): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresa");
  }

  obterTodosRegimeTributario(): Observable<RegimeTributario[]> {
    return this.httpClient.get<RegimeTributario[]>(environment.url_contas_receber + "/Pessoa/ObterTodosRegimeTributario");
  }

  obterTodosTipoPessoa() {
    return this.httpClient.get<TipoPessoa[]>(environment.url_contas_receber + "/Pessoa/ObterTodosTipoPessoa");
  }

  obterTodosSexo() {
    return this.httpClient.get<Sexo[]>(environment.url_contas_receber + "/Pessoa/ObterTodosSexo");
  }

  obterLocalidade(): Observable<Localidade[]> {
    return this.httpClient.get<Localidade[]>(environment.url_contas_receber + "/Localidade/ObterTodosLocalidade");
  }

  obterUf(): Observable<Uf[]> {
    return this.httpClient.get<Uf[]>(environment.url_contas_receber + "/Uf/ObterTodosUf");
  }

  obterTodosEstadoCivil() {
    return this.httpClient.get<EstadoCivil[]>(environment.url_contas_receber + "/EstadoCivil/ObterTodosEstadoCivil");
  }

  obterProfissao(): Observable<Profissao[]> {
    return this.httpClient.get<Profissao[]>(environment.url_contas_receber + "/Pessoa/ObterTodosProfissao");
  }

  obterReligiao(): Observable<Religiao[]> {
    return this.httpClient.get<Religiao[]>(environment.url_contas_receber + "/Pessoa/ObterTodosReligiao");
  }

  obterTodosCor() {
    return this.httpClient.get<Cor[]>(environment.url_contas_receber + "/CorRaca/ObterTodosCorRaca");
  }

  obterTodosServico(): Observable<Servico[]> {
    return this.httpClient.get<Servico[]>(environment.url_contas_receber + "/Empresa/ObterTodosServico");
  };

  obterTodosBanco(): Observable<Banco[]> {
    return this.httpClient.get<Banco[]>(environment.url_contas_receber + "/Conta/ObterTodosBanco");
  }

  obterTodosContaCorrente(): Observable<IContaCorrente[]> {
    return this.httpClient.get<IContaCorrente[]>(environment.url_contas_receber + "/Titulo/ObterTodosContaCorrente");
  }

  obterContasCorrentesContemAgencia(): Observable<IContaCorrente[]>{
    return this.httpClient.get<IContaCorrente[]>(environment.url_contas_receber + "/Titulo/ObterContasCorrentesContemAgencia")
  }

  BuscarDadosCnpj(id: string): Observable<Cnpj> {
    return this.httpClient.get<Cnpj>(environment.url_contas_receber + "/Pessoa/BuscarDadosCnpj/" + id);
  };

  BuscarDadosCnae(id: string): Observable<Cnae> {
    return this.httpClient.get<Cnae>(environment.url_contas_receber + "/Pessoa/BuscarDadosCnae/" + id);
  };

  AdicionarPessoa(pessoa: Pessoa): Observable<Pessoa> {
    return this.httpClient.post<Pessoa>(environment.url_contas_receber + "/Pessoa/AdicionarPessoa", pessoa);
  };

  AtualizarPessoa(pessoa: Pessoa): Observable<Pessoa> {
    return this.httpClient.post<Pessoa>(environment.url_contas_receber + "/Pessoa/AtualizarPessoa", pessoa);
  };

  AdicionarCliente(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.post<Cliente>(environment.url_contas_receber + "/Pessoa/AdicionarCliente", cliente);
  };

  AtualizarCliente(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.post<Cliente>(environment.url_contas_receber + "/Pessoa/AtualizarCliente", cliente);
  };


  AdicionarEmpresa(empresa: Empresa): Observable<Empresa> {
    return this.httpClient.post<Empresa>(environment.url_contas_receber + "/Empresa/AdicionarEmpresa", empresa);
  };

  AtualizarEmpresa(empresa: Empresa): Observable<Empresa> {
    return this.httpClient.post<Empresa>(environment.url_contas_receber + "/Empresa/AtualizarEmpresa", empresa);
  };

  AdicionarPessoaEndereco(endereco: Endereco): Observable<Endereco> {
    return this.httpClient.post<Endereco>(environment.url_contas_receber + "/Pessoa/AdicionarPessoaEndereco", endereco);
  };

  AtualizarPessoaEndereco(endereco: Endereco): Observable<Endereco> {
    return this.httpClient.post<Endereco>(environment.url_contas_receber + "/Pessoa/AtualizarPessoaEndereco", endereco);
  };

  RemoverPessoaEndereco(endereco: Endereco): Observable<Endereco> {
    return this.httpClient.post<Endereco>(environment.url_contas_receber + "/Pessoa/RemoverPessoaEndereco", endereco);
  };

  AdicionarPessoaContato(pessoaContato: PessoaContato): Observable<PessoaContato> {
    return this.httpClient.post<PessoaContato>(environment.url_contas_receber + "/Pessoa/AdicionarPessoaContato", pessoaContato);
  };

  AtualizarPessoaContato(pessoaContato: PessoaContato): Observable<PessoaContato> {
    return this.httpClient.post<PessoaContato>(environment.url_contas_receber + "/Pessoa/AtualizarPessoaContato", pessoaContato);
  };

  RemoverPessoaContato(contato: PessoaContato): Observable<PessoaContato> {
    return this.httpClient.post<PessoaContato>(environment.url_contas_receber + "/Pessoa/RemoverPessoaContato", contato);
  };


  AdicionarPessoaCnae(pessoaCnae: PessoaCnae): Observable<PessoaCnae> {
    return this.httpClient.post<PessoaCnae>(environment.url_contas_receber + "/Pessoa/AdicionarPessoaCnae", pessoaCnae);
  };

  AdicionarEmpresaContaCorrente(empresaContaCorrente: EmpresaContaCorrente): Observable<EmpresaContaCorrente> {
    return this.httpClient.post<EmpresaContaCorrente>(environment.url_contas_receber + "/Pessoa/AdicionarEmpresaContaCorrente", empresaContaCorrente);
  };

  AtualizarPessoaCnae(pessoaCnae: PessoaCnae): Observable<PessoaCnae> {

    return this.httpClient.post<PessoaCnae>(environment.url_contas_receber + "/Pessoa/AtualizarPessoaCnae", pessoaCnae);
  };


  AtualizarEmpresaContaCorrente(empresaContaCorrente: EmpresaContaCorrente): Observable<EmpresaContaCorrente> {
    return this.httpClient.post<EmpresaContaCorrente>(environment.url_contas_receber + "/Pessoa/AtualizarEmpresaContaCorrente", empresaContaCorrente);
  };


  RemoverPessoaCnae(pessoaCnae: PessoaCnae): Observable<PessoaCnae> {
    return this.httpClient.post<PessoaCnae>(environment.url_contas_receber + "/Pessoa/RemoverPessoaCnae", pessoaCnae);
  };

  RemoverEmpresaContaCorrente(empresaContaCorrente: EmpresaContaCorrente): Observable<EmpresaContaCorrente> {
    return this.httpClient.post<EmpresaContaCorrente>(environment.url_contas_receber + "/Pessoa/RemoverEmpresaContaCorrente", empresaContaCorrente);
  };

  obterTodosTipoLogradouro(): Observable<TipoLogradouro[]> {
    return this.httpClient.get<TipoLogradouro[]>(environment.url_contas_receber + "/TipoLogradouro/ObterTodosTipoLogradouro");
  }

  obterTodosLocalidadeEndereco(): Observable<Localidade[]> {
    return this.httpClient.get<Localidade[]>(environment.url_contas_receber + "/Localidade/ObterTodosLocalidade");
  }

  obterTodosUfEndereco(): Observable<Uf[]> {
    return this.httpClient.get<Uf[]>(environment.url_contas_receber + "/Uf/ObterTodosUf");
  }

  obterTodosPaisEndereco(): Observable<Pais[]> {
    return this.httpClient.get<Pais[]>(environment.url_contas_receber + "/Pais/ObterTodosPais");
  }

  obterDadosCep(cep): Observable<Cep[]> {
    return this.httpClient.get<Cep[]>(environment.url_contas_receber + '//cepapi.delivoro.com.br/${cep}');
  }


  obterLocalidadeId(desc: string): Observable<Localidade> {
    return this.httpClient.get<Localidade>(environment.url_contas_receber + "/Localidade/ObterLocalidadePorDesc/" + desc);
  };

  obterUfId(desc: string): Observable<Uf> {
    return this.httpClient.get<Uf>(environment.url_contas_receber + "/Uf/ObterUfPorDesc/" + desc);
  };

  obterTipoLogradouroId(desc: string): Observable<TipoLogradouro> {
    return this.httpClient.get<TipoLogradouro>(environment.url_contas_receber + "/TipoLogradouro/ObterTipoLogradouroPorDesc/" + desc);
  };

  obterPaisId(desc: string): Observable<Pais> {
    return this.httpClient.get<Pais>(environment.url_contas_receber + "/Pais/ObterPaisPorDesc/" + desc);
  };

  obterTodosCargo(): Observable<Cargo[]> {
    return this.httpClient.get<Cargo[]>(environment.url_folha + "/Cargo/");
  };

  obterTodosDepartamento(): Observable<Departamento[]> {
    return this.httpClient.get<Departamento[]>(environment.url_contas_receber + "/Pessoa/ObterTodosDepartamento/");
  };

  obterTodosTipoContato(): Observable<TipoContato[]> {
    return this.httpClient.get<TipoContato[]>(environment.url_contas_receber + "/Pessoa/ObterTodosTipoContato/");
  };

  AdicionarPessoaRegimeTributario(pessoaRegimeTributario: PessoaRegimeTributario): Observable<PessoaRegimeTributario> {
    return this.httpClient.post<PessoaRegimeTributario>(environment.url_contas_receber + "/Pessoa/AdicionarPessoaRegimeTributario", pessoaRegimeTributario);
  };

  AtualizarPessoaRegimeTributario(pessoaRegimeTributario: PessoaRegimeTributario): Observable<PessoaRegimeTributario> {
    return this.httpClient.post<PessoaRegimeTributario>(environment.url_contas_receber + "/Pessoa/AtualizarPessoaRegimeTributario", pessoaRegimeTributario);
  };

  RemoverPessoaRegimeTributario(pessoaRegimeTributario: PessoaRegimeTributario): Observable<PessoaRegimeTributario> {
    return this.httpClient.post<PessoaRegimeTributario>(environment.url_contas_receber + "/Pessoa/RemoverPessoaRegimeTributario", pessoaRegimeTributario);
  };

  obterClientePorPessoaId(id: string): Observable<Cliente> {
    return this.httpClient.get<Cliente>(environment.url_contas_receber + "/Pessoa/ObterClientePorPessoaId/" + id);
  };


  obterClientePorId(id: string): Observable<Cliente> {
    return this.httpClient.get<Cliente>(environment.url_contas_receber + "/Pessoa/ObterClientePorId/" + id);
  };

  obterEmpresaPorPessoaId(id: string): Observable<Empresa> {
    return this.httpClient.get<Empresa>(environment.url_contas_receber + "/Pessoa/ObterEmpresaPorPessoaId/" + id);
  };


  removerClienteSindicato(fornecedor: ClienteSindicato): Observable<ClienteSindicato> {
    return this.httpClient.post<ClienteSindicato>(environment.url_contas_receber + "/ClienteSindicato/RemoverClienteSindicato", fornecedor);
  }

  reativarClienteSindicato(pessoa: ClienteSindicato): Observable<ClienteSindicato> {
    return this.httpClient.post<ClienteSindicato>(environment.url_contas_receber + "ClienteSindicato/ReativarClienteSindicato", pessoa);
  }

  obterClienteSindicatoPorId(id: string): Observable<ClienteSindicato> {
    return this.httpClient.get<ClienteSindicato>(environment.url_contas_receber + "/ClienteSindicato/ObterClienteSindicatoId/" + id);
  };

  AdicionarClienteSindicato(cliente: ClienteSindicato): Observable<ClienteSindicato> {
    return this.httpClient.post<ClienteSindicato>(environment.url_contas_receber + "/ClienteSindicato/AdicionarClienteSindicato/", cliente);
  };

  AtualizarClienteSindicato(clienteSindicato: ClienteSindicato): Observable<ClienteSindicato> {
    return this.httpClient.post<ClienteSindicato>(environment.url_contas_receber + "/ClienteSindicato/AtualizarClienteSindicato/", clienteSindicato);
  };

  // obterClienteSindicatoPorDesc(desc: string): Observable<ClienteSindicato> {
  //   return this.httpClient.get<ClienteSindicato>(environment.url_contas_receber + "/Pais/ObterPaisPorDesc/" + desc);
  // };

  obterTodosClienteSindicato(): Observable<ClienteSindicato[]> {
    return this.httpClient.get<ClienteSindicato[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
  }

  obterTodosSindicato(): Observable<Sindicato[]> {
    return this.httpClient.get<Sindicato[]>(environment.url_folha + "/Sindicato/")
  }

  obterSindicatoConvencao(id: string): Observable<SindicatoConvencao> {
    return this.httpClient.get<SindicatoConvencao>(environment.url_folha + "/SindicatoConvencao/" + id);
  };

  obterTodosSindicatoConvencao(): Observable<SindicatoConvencao[]> {
    return this.httpClient.get<SindicatoConvencao[]>(environment.url_folha + "/SindicatoConvencao/");
  };

  // AtualizarClienteSindicato(clienteSindicato: ClienteSindicato): Observable<ClienteSindicato> {
  //   return this.httpClient.post<ClienteSindicato>(environment.url_contas_receber + "/Pessoa/AtualizarPessoa", clienteSindicato);
  // };

  obterTodosConvencao(): Observable<Convencao[]> {
    return this.httpClient.get<Convencao[]>(environment.url_folha + "/Convencao/");
  }

  obterTodosEmpresaPorId(idGrupo: string): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
  };

  //############################ Fornecedor #########################################################


  obterFornecedorPorPessoaId(id: string): Observable<Fornecedor> {
    return this.httpClient.get<Fornecedor>(environment.url_contas_receber + "/Pessoa/ObterFornecedorPorPessoaId/" + id);
  };

  obterFornecedorPorId(id: string): Observable<Fornecedor> {
    return this.httpClient.get<Fornecedor>(environment.url_contas_receber + "/Pessoa/ObterFornecedorPorId/" + id);
  }

  obterTodosFornecedorContaCorrente() {
    return this.httpClient.get<FornecedorContaCorrente[]>(environment.url_contas_receber + "/Pessoa/ObterTodosFornecedorContaCorrente");
  }

  obterTodosFornecedorContaCorrenteId(id: string): Observable<FornecedorContaCorrente[]> {
    return this.httpClient.get<FornecedorContaCorrente[]>(environment.url_folha + "/Pessoa/ObterTodosFornecedorContaCorrenteId/" + id);
  }

  obterFornecedorContaCorrentePorFornecedorId(id: string): Observable<FornecedorContaCorrente> {
    return this.httpClient.get<FornecedorContaCorrente>(environment.url_contas_receber + "/Pessoa/ObterFornecedorContaCorrentePessoaId/" + id);
  };

  obterFornecedorContaCorrentePorId(id: string): Observable<FornecedorContaCorrente> {
    return this.httpClient.get<FornecedorContaCorrente>(environment.url_contas_receber + "/Pessoa/obterFornecedorContaCorrentePorId/" + id);
  };

  AdicionarFornecedorContaCorrente(fornecedorContaCorrente: FornecedorContaCorrente): Observable<FornecedorContaCorrente> {
    return this.httpClient.post<FornecedorContaCorrente>(environment.url_contas_receber + "/Pessoa/AdicionarFornecedorContaCorrente", fornecedorContaCorrente);
  };

  AtualizarFornecedorContacorrente(pessoaRegimeTributario: FornecedorContaCorrente): Observable<FornecedorContaCorrente> {
    return this.httpClient.post<FornecedorContaCorrente>(environment.url_contas_receber + "/Pessoa/AtualizarFornecedorContaCorrente", pessoaRegimeTributario);
  };

  AdicionarFornecedor(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.httpClient.post<Fornecedor>(environment.url_contas_receber + "/Pessoa/AdicionarFornecedor", fornecedor);
  };

  AtualizarFornecedor(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.httpClient.post<Fornecedor>(environment.url_contas_receber + "/Pessoa/AtualizarFornecedor", fornecedor);
  };
  ReativarFornecedor(forncedor: Fornecedor): Observable<Fornecedor> {
    return this.httpClient.post<Fornecedor>(environment.url_contas_receber + "/Pessoa/ReativarFornecedor", forncedor);
  }
  RemoverFornecedor(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.httpClient.post<Fornecedor>(environment.url_contas_receber + "/Pessoa/RemoverFornecedor", fornecedor);
  }

  RemoverFornecedorContaCorrente(fornecedorContaCorrente: FornecedorContaCorrente): Observable<FornecedorContaCorrente> {
    return this.httpClient.post<FornecedorContaCorrente>(environment.url_contas_receber + "/Pessoa/RemoverFornecedorContaCorrente", fornecedorContaCorrente);
  }

  obterConvencaoPorId(id: string): Observable<Convencao> {
    return this.httpClient.get<Convencao>(environment.url_folha + "/Convencao/" + id);
  }
  obterTodosPorConvencaoId(id: string): Observable<Convencao[]> {
    return this.httpClient.get<Convencao[]>(environment.url_folha + "/Convencao/ObterTodosPorConvencaoId/" + id);
  }

  adicionarContaCorrente(contaCorrente: ContaCorrente): Observable<ContaCorrente>{
    return this.httpClient.post<ContaCorrente>(environment.url_contas_receber + "/Conta/AdicionarContaCorrente", contaCorrente);
  }

  atualizarContaCorrente(contaCorrente: ContaCorrente): Observable<ContaCorrente>{
    return this.httpClient.post<ContaCorrente>(environment.url_contas_receber + "/Conta/AtualizarContaCorrente", contaCorrente);
  }

  excluirContaCorrente(contaCorrente: ContaCorrente): Observable<ContaCorrente>{
    return this.httpClient.post<ContaCorrente>(environment.url_contas_receber + "/Conta/ExcluirContaCorrente", contaCorrente);
  }

  adicionarClienteContaCorrente(clienteContaCorrente: ClienteContaCorrente): Observable<ClienteContaCorrente>{
    return this.httpClient.post<ClienteContaCorrente>(environment.url_contas_receber + "/ClienteContaCorrente/AdicionarClienteContaCorrente", clienteContaCorrente);
  }

  excluirClienteContaCorrente(clienteContaCorrente: ClienteContaCorrente): Observable<ClienteContaCorrente>{
    return this.httpClient.post<ClienteContaCorrente>(environment.url_contas_receber + "/ClienteContaCorrente/ExcluirClienteContaCorrente", clienteContaCorrente);
  }

}