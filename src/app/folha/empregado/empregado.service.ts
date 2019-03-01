import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { Convencao, TipoConvencao } from './models/convencao';
import { environment } from '../../../environments/environment';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { HttpClient } from '@angular/common/http';
import { TipoDeAdmissao } from '../tipodeadmissao/models/tipodeadmissao';
import { Sexo, Localidade, Uf, EstadoCivil, Profissao, Cor, Pais, TipoLogradouro, Endereco, Departamento, Cargo, PessoaContato, TipoContato } from '../../cadastros/pessoa/models/pessoa';
import { GrauInstrucao } from '../grauinstrucao/models/grauinstrucao';
import { TipoDeficiencia } from '../tipodeficiencia/models/tipodeficiencia';
import { Empregado, Banco, CoordenadorDeEstagio, Estagio, AgenteIntegrador, InstituicaoEnsino, Itinerario, ValorTransporte, TipoTransporte, EmpregadoDependente, Parentesco, EmpregadoOrgaoClasse, EmpregadoLotacao } from './models/empregado';
import { Nacionalidade } from '../../cadastros/nacionalidade/models/nacionalidade';

@Injectable()
export class EmpregadoService {
  constructor(private httpClient: HttpClient) { }


  adicionarEmpregado(empregado: Empregado): Observable<Empregado> {
    return this.httpClient.post<Empregado>(environment.url_folha + "/Empregado/", empregado);
  }

  atualizarEmpregado(empregado: Empregado): Observable<Empregado> {
    return this.httpClient.put<Empregado>(environment.url_folha + "/Empregado/", empregado);
  }

  obterEmpregado(id: string): Observable<Empregado> {
    return this.httpClient.get<Empregado>(environment.url_folha + "/Empregado/" + id);
  }

  obterTodosEnderecoPorPessoaId(id: string): Observable<Endereco[]> {
    return this.httpClient.get<Endereco[]>(environment.url_folha + "/PessoaEndereco/ObterTodosPorPessoaId/" + id);
  }

  adicionarEndereco(endereco: Endereco): Observable<Endereco> {
    return this.httpClient.post<Endereco>(environment.url_folha + "/PessoaEndereco/", endereco);
  }

  atualizarEndereco(endereco: Endereco): Observable<Endereco> {
    return this.httpClient.put<Endereco>(environment.url_folha + "/PessoaEndereco/", endereco);
  }

  excluirEndereco(id: string): Observable<Endereco> {
    return this.httpClient.delete<Endereco>(environment.url_folha + "/PessoaEndereco/" + id);
  }

  obterTodosTipoAdmissao(): Observable<TipoDeAdmissao[]> {
    return this.httpClient.get<TipoDeAdmissao[]>(environment.url_folha + "/TipoDeAdmissao/");
  }

  obterTodosGrauInstrucao(): Observable<GrauInstrucao[]> {
    return this.httpClient.get<GrauInstrucao[]>(environment.url_folha + "/GrauInstrucao/");
  }

  obterTodosTipoDeficiencia(): Observable<TipoDeficiencia[]> {
    return this.httpClient.get<TipoDeficiencia[]>(environment.url_folha + "/TipoDeficiencia/");
  }

  obterTodosSexo() {
    return this.httpClient.get<Sexo[]>(environment.url_contas_receber + "/Pessoa/ObterTodosSexo");
  }

  obterLocalidade(): Observable<Localidade[]> {
    return this.httpClient.get<Localidade[]>(environment.url_contas_receber + "/Localidade/ObterTodosLocalidade");
  }

  obterLocalidadePorUf(id: string): Observable<Localidade[]> {
    return this.httpClient.get<Localidade[]>(environment.url_contas_receber + "/Localidade/ObterLocalidadesPorId/" + id);
  }

  obterTodosUf(): Observable<Uf[]> {
    return this.httpClient.get<Uf[]>(environment.url_contas_receber + "/Uf/ObterTodosUf");
  }

  obterTodosEstadoCivil() {
    return this.httpClient.get<EstadoCivil[]>(environment.url_contas_receber + "/EstadoCivil/ObterTodosEstadoCivil");
  }

  obterTodosCor() {
    return this.httpClient.get<Cor[]>(environment.url_contas_receber + "/CorRaca/ObterTodosCorRaca");
  }

  obterTodosNacionalidade() {
    return this.httpClient.get<Nacionalidade[]>(environment.url_folha + "/Nacionalidade");
  }

  obterTodosPais() {
    return this.httpClient.get<Pais[]>(environment.url_contas_receber + "/Pais/ObterTodosPais");
  }

  obterTodosEmpregados(): Observable<Empregado[]> {
    return this.httpClient.get<Empregado[]>(environment.url_folha + "/Empregado");
  }

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

  obterTodosDepartamento(): Observable<Departamento[]> {
    return this.httpClient.get<Departamento[]>(environment.url_contas_receber + "/Pessoa/ObterTodosDepartamento/");
  };

  obterTodosCargo(): Observable<Cargo[]> {
    return this.httpClient.get<Cargo[]>(environment.url_folha + "/Cargo/");
  };

  obterTodosTipoContato(): Observable<TipoContato[]> {
    return this.httpClient.get<TipoContato[]>(environment.url_contas_receber + "/Pessoa/ObterTodosTipoContato/");
  };

  async adicionarContato(contato: PessoaContato): Promise<PessoaContato> {
    return this.httpClient.post<PessoaContato>(environment.url_folha + "/PessoaContato/", contato).toPromise();
  }

  obterTodosContatoPorPessoaId(id: string): Observable<PessoaContato[]> {
    return this.httpClient.get<PessoaContato[]>(environment.url_folha + "/PessoaContato/ObterTodosPorPessoaId/" + id);
  }

  excluirContato(id: string): Observable<PessoaContato> {
    return this.httpClient.delete<PessoaContato>(environment.url_folha + "/PessoaContato/" + id);
  }

  atualizarContato(pessoaContato: PessoaContato): Observable<PessoaContato> {
    return this.httpClient.put<PessoaContato>(environment.url_folha + "/PessoaContato/", pessoaContato);
  }

  obterTodosBanco(): Observable<Banco[]> {
    return this.httpClient.get<Banco[]>(environment.url_contas_receber + "/Conta/ObterTodosBanco");
  }

  obterTodosCoordenadorDeEstagio(): Observable<CoordenadorDeEstagio[]> {
    return this.httpClient.get<CoordenadorDeEstagio[]>(environment.url_folha + "/CoordenadorDeEstagio/");
  }

  obterTodosAgenteIntegrador(): Observable<AgenteIntegrador[]> {
    return this.httpClient.get<AgenteIntegrador[]>(environment.url_folha + "/AgenteIntegrador/");
  }

  ObterTodosInstituicaoEnsino(): Observable<InstituicaoEnsino[]> {
    return this.httpClient.get<InstituicaoEnsino[]>(environment.url_folha + "/InstituicaoEnsino/");
  }

  excluirEstagio(id: string): Observable<Estagio> {
    return this.httpClient.delete<Estagio>(environment.url_folha + "/Estagio/" + id);
  }

  adicionarEstagio(estagio: Estagio): Observable<Estagio> {
    return this.httpClient.post<Estagio>(environment.url_folha + "/Estagio/", estagio);
  }

  obterTodosEstagioPorEmpregadoId(id: string): Observable<Estagio[]> {
    return this.httpClient.get<Estagio[]>(environment.url_folha + "/Estagio/ObterTodosPorEmpregadoId/" + id);
  }

  atualizarEstagio(estagio: Estagio): Observable<Estagio> {
    return this.httpClient.put<Estagio>(environment.url_folha + "/Estagio/", estagio);
  }

  excluirItinerario(id: string): Observable<Itinerario> {
    return this.httpClient.delete<Itinerario>(environment.url_folha + "/Itinerario/" + id);
  }

  adicionarItinerario(estagio: Estagio): Observable<Itinerario> {
    return this.httpClient.post<Itinerario>(environment.url_folha + "/Itinerario/", estagio);
  }

  obterTodosPorItinerarioId(id: string): Observable<Itinerario[]> {
    return this.httpClient.get<Itinerario[]>(environment.url_folha + "/Itinerario/ObterTodosPorItinerarioId/" + id);
  }

  atualizarItinerario(estagio: Itinerario): Observable<Itinerario> {
    return this.httpClient.put<Itinerario>(environment.url_folha + "/Itinerario/", estagio);
  }

  obterTodosEmpresaPorId(idGrupo: string): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
  };

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
  }

  obterTodosValortransporte(): Observable<ValorTransporte[]> {
    return this.httpClient.get<ValorTransporte[]>(environment.url_folha + "/ValorTransporte/");
  }
  
  // getTipotransporte() {
  //   return this.httpClient.get<TipoTransporte[]>('assets/dados/tipotransporte.json');
  // };

  excluirEmpregadoDependente(id: string): Observable<EmpregadoDependente> {
    return this.httpClient.delete<EmpregadoDependente>(environment.url_folha + "/EmpregadoDependente/" + id);
  }

  obterTodosParentescos(): Observable<Parentesco[]>{
    return this.httpClient.get<Parentesco[]>(environment.url_folha + "/Parentesco/");
  }
  
  adicionarEmpregadoDependente(empregadoDependente: EmpregadoDependente): Observable<EmpregadoDependente> {
    return this.httpClient.post<EmpregadoDependente>(environment.url_folha + "/EmpregadoDependente/", empregadoDependente);
  }

  atualizarEmpregadoDependente(empregadoDependente: EmpregadoDependente): Observable<EmpregadoDependente> {
    return this.httpClient.put<EmpregadoDependente>(environment.url_folha + "/EmpregadoDependente/", empregadoDependente);
  }

  obterTodosEmpregadoDependentesPorEmpregadoId(id: string): Observable<EmpregadoDependente[]>{
    return this.httpClient.get<EmpregadoDependente[]>(environment.url_folha + "/EmpregadoDependente/ObterTodosPorEmpregadoId/" + id);
  }


  excluirEmpregadoorgaoclasse(id: string): Observable<EmpregadoOrgaoClasse> {
    return this.httpClient.delete<EmpregadoOrgaoClasse>(environment.url_folha + "/EmpregadoOrgaoClasse/" + id);
  }

  adicionarEmpregadoorgaoclasse(estagio: Estagio): Observable<EmpregadoOrgaoClasse> {
    return this.httpClient.post<EmpregadoOrgaoClasse>(environment.url_folha + "/EmpregadoOrgaoClasse/", estagio);
  }

  obterTodosPorEmpregadoorgaoclasseId(id: string): Observable<EmpregadoOrgaoClasse[]> {
    return this.httpClient.get<EmpregadoOrgaoClasse[]>(environment.url_folha + "/EmpregadoOrgaoClasse/ObterTodosPorEmpregadoOrgaoClasseId/" + id);
  }

  atualizarEmpregadoorgaoclasse(estagio: EmpregadoOrgaoClasse): Observable<EmpregadoOrgaoClasse> {
    return this.httpClient.put<EmpregadoOrgaoClasse>(environment.url_folha + "/EmpregadoOrgaoClasse/", estagio);
  }

  excluirEmpregadoLotacao(id: string): Observable<EmpregadoLotacao> {
    return this.httpClient.delete<EmpregadoLotacao>(environment.url_folha + "/EmpregadoLotacao/" + id);
  }

  adicionarEmpregadoLotacao(empregadoLotacao: EmpregadoLotacao): Observable<EmpregadoLotacao> {
    return this.httpClient.post<EmpregadoLotacao>(environment.url_folha + "/EmpregadoLotacao/", empregadoLotacao);
  }

  obterTodosEmpregadoLotacaoPorEmpregadoId(id: string): Observable<EmpregadoLotacao[]>{
    return this.httpClient.get<EmpregadoLotacao[]>(environment.url_folha + "/EmpregadoLotacao/ObterTodosPorEmpregadoId/" + id);
  }

  atualizarEmpregadoLotacao(empregadoLotacao: EmpregadoLotacao): Observable<EmpregadoLotacao> {
    return this.httpClient.put<EmpregadoLotacao>(environment.url_folha + "/EmpregadoLotacao/", empregadoLotacao);
  }

}