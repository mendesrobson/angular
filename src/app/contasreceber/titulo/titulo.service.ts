import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Titulo, Cliente, TipoDocumento, Natureza, ContaCorrente, Origem, ConfiguracaoPagamento, Desconto, TituloDesconto, CentroCusto, CentroResultado, TituloCentro, HistoricoPadrao, Parcela, TituloParcela, ParcelaDesconto, ApropriacaoCentro, Fornecedor, HistoricoPadraoCentro, Faturamento, FornecedorModel } from './models/titulo';
import { GrupoEmpresa, Empresa } from '../../cadastros/empresa/models/empresa';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Pessoa } from '../../cadastros/pessoa/models/pessoa';


@Injectable()
export class TituloService {

  constructor(private httpClient: HttpClient) {  }

  obterTodosTituloReceberPorEmpresaId(idEmpresa: number): Observable<Titulo[]> {
    return this.httpClient.get<Titulo[]>(environment.url_contas_receber + "/Titulo/ObterTodosTituloReceberPorEmpresaId/" + idEmpresa);
  }

  obterTodosTituloPagarPorEmpresaId(idEmpresa: number): Observable<Titulo[]> {
    return this.httpClient.get<Titulo[]>(environment.url_contas_receber + "/Titulo/ObterTodosTituloPagarPorEmpresaId/" + idEmpresa);
  }

  AdicionarPessoa(pessoa: Pessoa): Observable<Pessoa> {
    return this.httpClient.post<Pessoa>(environment.url_contas_receber + "/Pessoa/AdicionarPessoa", pessoa);
  };

  AdicionarCliente(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.post<Cliente>(environment.url_contas_receber + "/Pessoa/AdicionarCliente", cliente);
  };

  obterTodosTitulo(): Observable<Titulo[]> {
    return this.httpClient.get<Titulo[]>(environment.url_contas_receber + "/Titulo/ObterTodosTitulo");
  }

  obterTodosTituloPorNaturezaId(id: number): Observable<Titulo[]> {
    return this.httpClient.get<Titulo[]>(environment.url_contas_receber + "/Titulo/ObterTodosTituloPorNaturezaId/" + id);
  };

  obterTodosGrupoEmpresa(): Observable<GrupoEmpresa[]> {
    return this.httpClient.get<GrupoEmpresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosGrupoEmpresa");
  }

  obterTodosEmpresaPorId(idGrupo: string): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
}

  obterTodosEmpresaPorGrupo(idGrupo: string): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(environment.url_contas_receber + "/Empresa/ObterTodosEmpresaGrupo/" + idGrupo);
  }

  // obterTodosCliente(): Observable<Cliente[]> {
  //   return this.httpClient.get<Cliente[]>(environment.url_contas_receber + "/Titulo/ObterTodosCliente");
  // }

  obterTodosClientePorEmpresa(idEmpresa: string): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(environment.url_contas_receber + "/Cliente/ObterTodosClientePorEmpresa/" + idEmpresa);
  }

  // obterTodosFornecedor(): Observable<Fornecedor[]> {
  //   return this.httpClient.get<Fornecedor[]>(environment.url_contas_receber + "/Titulo/ObterTodosFornecedor");
  // }

  obterTodosFornecedorPorEmpresa(idEmpresa: string): Observable<Fornecedor[]> {
    return this.httpClient.get<Fornecedor[]>(environment.url_contas_receber + "/Titulo/ObterTodosFornecedorPorEmpresa/" + idEmpresa);
  }

  obterTodosTipoDocumento(): Observable<TipoDocumento[]> {
    return this.httpClient.get<TipoDocumento[]>(environment.url_contas_receber + "/Titulo/ObterTodosTipoDocumento");
  }

  obterTodosNatureza(): Observable<Natureza[]> {
    return this.httpClient.get<Natureza[]>(environment.url_contas_receber + "/Titulo/ObterTodosNatureza");
  }

  // obterTodosContaCorrente(): Observable<ContaCorrente[]> {
  //   return this.httpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Titulo/ObterTodosContaCorrente");
  // }

  obterTodosContaCorrentePorEmpresa(idEmpresa: string): Observable<ContaCorrente[]> {
    return this.httpClient.get<ContaCorrente[]>(environment.url_contas_receber + "/Titulo/ObterTodosContaCorrentePorEmpresaId/" + idEmpresa);
  }

  obterTodosOrigem(): Observable<Origem[]> {
    return this.httpClient.get<Origem[]>(environment.url_contas_receber + "/Titulo/ObterTodosOrigem");
  }

  // obterTodosHistoricoPadrao(): Observable<HistoricoPadrao[]> {
  //   return this.httpClient.get<HistoricoPadrao[]>(environment.url_contas_receber + "/Titulo/ObterTodosHistoricoPadrao");
  // }

  obterTodosHistoricoPadraoPorEmpresa(idEmpresa: string): Observable<HistoricoPadrao[]> {
    return this.httpClient.get<HistoricoPadrao[]>(environment.url_contas_receber + "/Titulo/ObterTodosHistoricoPadraoPorEmpresa/" + idEmpresa);
  }

  // obterTodosConfiguracaoPagamento(): Observable<ConfiguracaoPagamento[]> {
  //   return this.httpClient.get<ConfiguracaoPagamento[]>(environment.url_contas_receber + "/Titulo/ObterTodosConfiguracaoPagamento");
  // }

  obterTodosConfiguracaoPagamentoPorEmpresa(idEmpresa: string): Observable<ConfiguracaoPagamento[]> {
    return this.httpClient.get<ConfiguracaoPagamento[]>(environment.url_contas_receber + "/Titulo/ObterTodosConfiguracaoPagamentoPorEmpresa/" + idEmpresa);
  }

  obterConfiguracaoPagamentoId(id: string): Observable<ConfiguracaoPagamento> {
    return this.httpClient.get<ConfiguracaoPagamento>(environment.url_contas_receber + "/Titulo/ObterConfiguracaoPagamentoPorId/" + id);
  };

  obterTitulo(id: string): Observable<Titulo> {
    return this.httpClient.get<Titulo>(environment.url_contas_receber + "/Titulo/ObterTituloPorId/" + id);
  };

  obterTituloPorId(id: number): Observable<Titulo> {
    return this.httpClient.get<Titulo>(environment.url_contas_receber + "/Titulo/ObterTituloPorId/" + id);
  };

  obterDescontoPorId(id: string): Observable<Desconto> {
    return this.httpClient.get<Desconto>(environment.url_contas_receber + "/Titulo/ObterDescontoPorId/" + id);
  };

  obterTodosCentroCusto(): Observable<CentroCusto[]> {
    return this.httpClient.get<CentroCusto[]>(environment.url_contas_receber + "/Titulo/ObterTodosCentroCusto");
  }

  obterTodosCentroResultado(): Observable<CentroResultado[]> {
    return this.httpClient.get<CentroResultado[]>(environment.url_contas_receber + "/Titulo/ObterTodosCentroResultado");
  }

  AdicionarTitulo(titulo: Titulo): Observable<Titulo> {
    return  this.httpClient.post<Titulo>(environment.url_contas_receber + "/Titulo/AdicionarTitulo", titulo);
  };
  
  GerarParcela(titulo: Titulo): Observable<Titulo> {
    return this.httpClient.post<Titulo>(environment.url_contas_receber + "/Titulo/GerarParcela", titulo);
  };

  GerarParcelaDescontosAngular(parcelaDesconto: ParcelaDesconto): Observable<ParcelaDesconto> {
    return this.httpClient.post<ParcelaDesconto>(environment.url_contas_receber + "/Titulo/GerarParcelaDescontosAngular", parcelaDesconto);
  };

  AdicionarTituloDesconto(tituloDesconto: TituloDesconto): Observable<TituloDesconto> {
    return  this.httpClient.post<TituloDesconto>(environment.url_contas_receber + "/Titulo/AdicionarTituloDesconto", tituloDesconto);
  };

  AdicionarParcela(parcela: Parcela): Observable<Parcela> {
    return  this.httpClient.post<Parcela>(environment.url_contas_receber + "/Titulo/AdicionarParcela", parcela);
  };

  AtualizarParcela(parcela: Parcela): Observable<Parcela> {
    return  this.httpClient.post<Parcela>(environment.url_contas_receber + "/Titulo/AtualizarParcela", parcela);
  };

  AtualizarParcelaDesconto(parcelaDesconto: ParcelaDesconto): Observable<ParcelaDesconto> {
    return this.httpClient.post<ParcelaDesconto>(environment.url_contas_receber + "/Titulo/AtualizarParcelaDesconto", parcelaDesconto);
  };

  AtualizarTituloDesconto(tituloDesconto: TituloDesconto): Observable<TituloDesconto> {
    return  this.httpClient.post<TituloDesconto>(environment.url_contas_receber + "/Titulo/AtualizarTituloDesconto", tituloDesconto);
  };

  AdicionarTituloCentro(tituloCentro: TituloCentro): Observable<TituloCentro> {
    return this.httpClient.post<TituloCentro>(environment.url_contas_receber + "/Titulo/AdicionarTituloCentro", tituloCentro);
  };

  async AdicionarTituloCentroAsync(tituloCentro: TituloCentro): Promise<TituloCentro> {
    return this.httpClient.post<TituloCentro>(environment.url_contas_receber + "/Titulo/AdicionarTituloCentro", tituloCentro).toPromise();
  };

  AdicionarParcelaDesconto(parcelaDesconto: ParcelaDesconto): Observable<ParcelaDesconto> {
    return this.httpClient.post<ParcelaDesconto>(environment.url_contas_receber + "/Titulo/AdicionarParcelaDesconto", parcelaDesconto);
  };

  removerParcelaDesconto(parcelaDesconto : ParcelaDesconto): Observable<ParcelaDesconto> {
    return  this.httpClient.post<ParcelaDesconto>(environment.url_contas_receber + "/Titulo/ExcluirParcelaDesconto", parcelaDesconto);       
  }
  
  AtualizarTitulo(titulo: Titulo): Observable<Titulo> {
    return  this.httpClient.post<Titulo>(environment.url_contas_receber + "/Titulo/AtualizarTitulo", titulo);
  };

  AtualizarTituloCentro(tituloCentro: TituloCentro): Observable<TituloCentro> {
    return  this.httpClient.post<TituloCentro>(environment.url_contas_receber + "/Titulo/AtualizarTituloCentro", tituloCentro);
  };

  RemoverTitulo(titulo: Titulo): Observable<Titulo> {
    return  this.httpClient.post<Titulo>(environment.url_contas_receber + "/Titulo/RemoverTitulo", titulo);
  };

  async RemoverTituloCentro(tituloCentro : TituloCentro): Promise<TituloCentro> {
    return  this.httpClient.post<TituloCentro>(environment.url_contas_receber + "/Titulo/RemoverTituloCentro", tituloCentro).toPromise();       
  };

  ReativarTitulo(titulo: Titulo): Observable<Titulo> {
    return  this.httpClient.post<Titulo>(environment.url_contas_receber + "/Titulo/ReativarTitulo", titulo);
  };

  obterTodosDescontoPorEmpresa(idEmpresa: string): Observable<Desconto[]> {
    return this.httpClient.get<Desconto[]>(environment.url_contas_receber + "/Titulo/ObterTodosDescontoPorEmpresa/" + idEmpresa);
  }

  obterTituloDescontoPorTituloId(id: string): Observable<TituloDesconto[]> {
    return this.httpClient.get<TituloDesconto[]>(environment.url_contas_receber + "/Titulo/ObterTituloDescontoPorTituloId/" + id);    
  }

  obterHistoricoPadraoCentroPorId(id: string): Observable<HistoricoPadraoCentro[]> {
    return this.httpClient.get<HistoricoPadraoCentro[]>(environment.url_contas_receber + "/Titulo/ObterHistoricoPadraoCentroPorId/" + id);    
  }

  async obterHistoricoPadraoCentroPorIdAsync(id: string): Promise<HistoricoPadraoCentro[]> {
    return this.httpClient.get<HistoricoPadraoCentro[]>(environment.url_contas_receber + "/Titulo/ObterHistoricoPadraoCentroPorId/" + id).toPromise();    
  }

  obterParcelasPorTituloId(id: string): Observable<Parcela[]> {
    return this.httpClient.get<Parcela[]>(environment.url_contas_receber + "/Titulo/ObterParcelasPorTituloId/" + id);   
  }

  obterTituloCentroPorTituloId(id: string): Observable<TituloCentro[]> {
    return this.httpClient.get<TituloCentro[]>(environment.url_contas_receber + "/Titulo/ObterTituloCentroPorTituloId/" + id);
  }

  removerTituloDesconto(tituloDesconto : TituloDesconto): Observable<TituloDesconto> {
    return  this.httpClient.post<TituloDesconto>(environment.url_contas_receber + "/Titulo/RemoverTituloDesconto", tituloDesconto);     
  }

  validarPercentual(tituloCentro : TituloCentro[]) : boolean {
    var valorSomaPercentual = 0;
    for(var i =0; i <tituloCentro.length; i++) {

      console.log('valor do percentual '+ tituloCentro[i].percentual);

      valorSomaPercentual = valorSomaPercentual.valueOf() + tituloCentro[i].percentual.valueOf();

    }

    return valorSomaPercentual > 100 ? false : true;
  }

  excluirTituloCentro(id : string): Observable<TituloCentro> {
    return this.httpClient.get<TituloCentro>(environment.url_contas_receber + "/Titulo/ExcluirTituloCentroId/" + id);  
  }

  gerarApropriacaoCentroAngular(titulo : Titulo): Observable<ApropriacaoCentro[]> {
    return  this.httpClient.post<ApropriacaoCentro[]>(environment.url_contas_receber + "/Titulo/GerarApropriacaoCentroAngular", titulo);      
  }  

  async excluirTituloCentroAsync(tituloCentro: TituloCentro): Promise<TituloCentro> {
    return this.httpClient.post<TituloCentro>(environment.url_contas_receber + "/Titulo/ExcluirTituloCentro/", tituloCentro).toPromise();      
  }

  async excluirParcelaDescontoAsync(parcelaDesconto: ParcelaDesconto): Promise<ParcelaDesconto> {
    return this.httpClient.post<ParcelaDesconto>(environment.url_contas_receber + "/Titulo/ExcluirParcelaDesconto/", parcelaDesconto).toPromise();  
  }

  async excluirApropriacaoCentroAsync(apropriacaoCentro: ApropriacaoCentro): Promise<ApropriacaoCentro> {
    return this.httpClient.post<ApropriacaoCentro>(environment.url_contas_receber + "/Titulo/ExcluirApropriacaoCentro/", apropriacaoCentro).toPromise();  
  }

  async excluirParcelaAsync(parcela: Parcela): Promise<Parcela> {
    return this.httpClient.post<Parcela>(environment.url_contas_receber + "/Titulo/ExcluirParcela/", parcela).toPromise();  
  }

  obterFaturamentoId(id : string): Observable<Faturamento> {
    return this.httpClient.get<Faturamento>(environment.url_faturamento + "/Faturamento/ObterFaturamentoPorId/" + id);  
  }

  obterTodosFornecedorPorGrupo(idGrupo: string): Observable<Fornecedor[]> {
    return this.httpClient.get<Fornecedor[]>(environment.url_contas_receber + "/Fornecedor/ObterTodosFornecedorPorGrupoId/" + idGrupo);
  }

  obterTodosFornecedorPorEmpresaId(idGrupo: string): Observable<Fornecedor[]> {
    return this.httpClient.get<Fornecedor[]>(environment.url_contas_receber + "/Fornecedor/ObterTodosFornecedorPorEmpresa/" + idGrupo);
  }
  
  obterTodosFornecedorPorGrupoEmpresa(ifornecedor: FornecedorModel): Observable<Fornecedor[]> {
    return this.httpClient.post<Fornecedor[]>(environment.url_contas_receber + "/Fornecedor/ObterTodosFornecedorPorGrupoEmpresa", ifornecedor);
  }
}
