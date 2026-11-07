import { useState } from 'react'
import './App.css'
import Abas from './components/Abas.jsx'
import Acordeao from './components/Acordeao.jsx'
import BarraProgresso from './components/BarraProgresso.jsx'
import MenuSuspenso from './components/MenuSuspenso.jsx'
import Paginacao from './components/Paginacao.jsx'
import Toast from './components/Toast.jsx'
import FormLugar from './components/FormLugar.jsx'

const categorias = ['Restaurante', 'Café', 'Bar', 'Praia', 'Passeio', 'Viagem']

// só essas categorias têm a opção de mandar cardápio
const categoriasComCardapio = ['Restaurante', 'Café', 'Bar']

// quando o lugar não tem foto, aparece o emoji da categoria
const emojis = {
  Restaurante: '🍝', Café: '☕', Bar: '🍹', Praia: '🏖️', Passeio: '📍', Viagem: '✈️',
}

// lugares que já começam na lista (sem foto e sem cardápio, isso vem do formulário)
const lugaresIniciais = [
  { id: 1, nome: 'Purgatório', local: 'Rua Alexandre Herculano, Pituba, Salvador', categoria: 'Bar', visitado: false, foto: null, cardapio: null },
  { id: 2, nome: 'Lafayette', local: 'Bahia Marina, Comércio, Salvador', categoria: 'Restaurante', visitado: true, foto: null, cardapio: null },
  { id: 3, nome: 'Arabesque', local: 'Rua das Dálias, Pituba, Salvador', categoria: 'Restaurante', visitado: false, foto: null, cardapio: null },
  { id: 4, nome: 'A Cubana Sorvetes', local: 'Centro Histórico, Salvador', categoria: 'Café', visitado: true, foto: null, cardapio: null },
  { id: 5, nome: 'Ilha dos Frades', local: 'Baía de Todos os Santos, Salvador', categoria: 'Praia', visitado: true, foto: null, cardapio: null },
  { id: 6, nome: 'Chapada Diamantina', local: 'Lençóis, Bahia', categoria: 'Viagem', visitado: false, foto: null, cardapio: null },
]

const LUGARES_POR_PAGINA = 4

function App() {
  const [lugares, setLugares] = useState(lugaresIniciais)
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState('Todos')
  const [pagina, setPagina] = useState(1)
  const [toast, setToast] = useState(null) // null quando não tem aviso
  const [lugarEditando, setLugarEditando] = useState(null) // null quando não está editando nada

  // filtra pelo que foi digitado (nome ou bairro) e pela categoria escolhida
  const textoBusca = busca.toLowerCase()
  const lugaresFiltrados = lugares.filter((lugar) => {
    const passaNaBusca =
      lugar.nome.toLowerCase().includes(textoBusca) ||
      lugar.local.toLowerCase().includes(textoBusca)
    const passaNoFiltro = filtro === 'Todos' || lugar.categoria === filtro
    return passaNaBusca && passaNoFiltro
  })

  // paginação: corta a lista e pega só os 4 da página atual
  const totalPaginas = Math.max(1, Math.ceil(lugaresFiltrados.length / LUGARES_POR_PAGINA))
  const inicio = (pagina - 1) * LUGARES_POR_PAGINA
  const lugaresDaPagina = lugaresFiltrados.slice(inicio, inicio + LUGARES_POR_PAGINA)

  // conta quantos já foram visitados pra mandar a % pra barra
  const visitados = lugares.filter((lugar) => lugar.visitado).length
  const progresso = Math.round((visitados / lugares.length) * 100)

  // o id aumenta a cada aviso, assim o toast reinicia o tempo mesmo se a mensagem for igual
  function mostrarToast(tipo, mensagem) {
    setToast((anterior) => ({ id: anterior ? anterior.id + 1 : 1, tipo, mensagem }))
  }

  function pesquisar(evento) {
    setBusca(evento.target.value)
    setPagina(1) // se não voltar pra página 1, pode cair numa página vazia
  }

  function escolherFiltro(categoria) {
    setFiltro(categoria)
    setPagina(1)
  }

  function alternarVisitado(lugarClicado) {
    setLugares(
      lugares.map((lugar) =>
        lugar.id === lugarClicado.id ? { ...lugar, visitado: !lugar.visitado } : lugar
      )
    )
    if (lugarClicado.visitado) {
      mostrarToast('info', lugarClicado.nome + ' voltou para "Quero ir".')
    } else {
      mostrarToast('sucesso', 'Oba! ' + lugarClicado.nome + ' marcado como visitado.')
    }
  }

  function adicionarLugar(novoLugar) {
    // o id novo é o maior id que já existe + 1, pra nunca repetir
    const novoId = Math.max(...lugares.map((lugar) => lugar.id)) + 1
    // coloca o novo no começo da lista pra ele aparecer primeiro
    setLugares([{ ...novoLugar, id: novoId, visitado: false }, ...lugares])
    setBusca('')
    setFiltro('Todos')
    setPagina(1)
    mostrarToast('sucesso', novoLugar.nome + ' foi salvo! Veja na aba Lugares.')
  }

  function salvarEdicao(dadosNovos) {
    // troca só o lugar que está sendo editado, o resto continua igual
    setLugares(
      lugares.map((lugar) =>
        lugar.id === lugarEditando.id ? { ...lugar, ...dadosNovos } : lugar
      )
    )
    setLugarEditando(null) // fecha a janela
    mostrarToast('sucesso', 'Alterações em ' + dadosNovos.nome + ' salvas!')
  }

  // monta os itens do acordeão: cada categoria vira um item com os lugares dela
  const itensPorCategoria = categorias.map((categoria) => {
    const daCategoria = lugares.filter((lugar) => lugar.categoria === categoria)
    return {
      titulo: emojis[categoria] + ' ' + categoria + ' (' + daCategoria.length + ')',
      conteudo:
        daCategoria.length > 0 ? (
          <ul className="lista-categoria">
            {daCategoria.map((lugar) => (
              <li key={lugar.id}>
                {lugar.nome} {lugar.visitado ? '✅' : ''}
                <small>{lugar.local}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p className="aviso">Nenhum lugar nesta categoria ainda.</p>
        ),
    }
  })

  // o conteúdo de cada aba vai por props pro componente Abas
  const abas = [
    {
      titulo: 'Lugares',
      conteudo: (
        <>
          <div className="topo">
            <input
              type="search"
              className="busca"
              placeholder="🔍 Pesquisar por nome ou bairro..."
              value={busca}
              onChange={pesquisar}
              aria-label="Pesquisar lugares"
            />
            <MenuSuspenso
              texto={'Categoria: ' + filtro}
              opcoes={['Todos', ...categorias]}
              aoSelecionar={escolherFiltro}
            />
          </div>

          <p className="contador">{lugaresFiltrados.length} lugar(es) encontrado(s)</p>

          {lugaresFiltrados.length === 0 && <p className="aviso">Nenhum lugar encontrado.</p>}

          <ul className="grade">
            {lugaresDaPagina.map((lugar) => (
              <li key={lugar.id}>
                <article className="cartao">
                  {lugar.foto ? (
                    <img src={lugar.foto} alt={'Foto de ' + lugar.nome} />
                  ) : (
                    <div className="sem-foto" aria-hidden="true">{emojis[lugar.categoria]}</div>
                  )}

                  <div className="cartao-texto">
                    <span className="etiqueta">{lugar.categoria}</span>
                    {lugar.visitado && <span className="etiqueta visitado">Já fomos ✓</span>}
                    <h3>{lugar.nome}</h3>
                    <p>📍 {lugar.local || 'Sem localização'}</p>

                    {/* o link só aparece se mandaram o arquivo do cardápio */}
                    {lugar.cardapio && (
                      <a className="link-cardapio" href={lugar.cardapio} target="_blank" rel="noreferrer">
                        🍽️ Ver cardápio
                      </a>
                    )}

                    <div className="botoes-cartao">
                      <button className="botao" onClick={() => alternarVisitado(lugar)}>
                        {lugar.visitado ? 'Desmarcar' : 'Marcar como visitado'}
                      </button>
                      <button className="botao botao-claro" onClick={() => setLugarEditando(lugar)}>
                        ✏️ Editar
                      </button>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>

          <Paginacao totalPaginas={totalPaginas} paginaAtual={pagina} mudarPagina={setPagina} />
        </>
      ),
    },
    {
      titulo: 'Adicionar lugar',
      conteudo: (
        <FormLugar
          categorias={categorias}
          categoriasComCardapio={categoriasComCardapio}
          aoSalvar={adicionarLugar}
          aoErro={(mensagem) => mostrarToast('erro', mensagem)}
        />
      ),
    },
    {
      titulo: 'Por categoria',
      conteudo: <Acordeao itens={itensPorCategoria} />,
    },
  ]

  return (
    <>
      <header className="cabecalho">
        <h1>Lugares pra Visitar 💗</h1>
        <p>Nossa lista de restaurantes, praias e passeios</p>
      </header>

      <main className="conteudo">
        {/* a barra atualiza sozinha porque é calculada a partir do state */}
        <section className="progresso" aria-label="Lugares visitados">
          <p>Já visitamos <strong>{visitados} de {lugares.length}</strong> lugares</p>
          <BarraProgresso valor={progresso} />
        </section>

        <Abas abas={abas} />
      </main>

      <footer className="rodape">Atividade ReactJs · UCSal</footer>

      {/* janela de edição: reaproveita o mesmo formulário de adicionar, já preenchido */}
      {lugarEditando && (
        <div className="fundo-modal">
          <div className="modal" role="dialog" aria-modal="true" aria-label={'Editar ' + lugarEditando.nome}>
            <h2>Editar lugar</h2>
            <FormLugar
              key={lugarEditando.id}
              lugarInicial={lugarEditando}
              categorias={categorias}
              categoriasComCardapio={categoriasComCardapio}
              aoSalvar={salvarEdicao}
              aoErro={(mensagem) => mostrarToast('erro', mensagem)}
              aoCancelar={() => setLugarEditando(null)}
            />
          </div>
        </div>
      )}

      {toast && (
        <Toast key={toast.id} tipo={toast.tipo} mensagem={toast.mensagem} fechar={() => setToast(null)} />
      )}
    </>
  )
}

export default App