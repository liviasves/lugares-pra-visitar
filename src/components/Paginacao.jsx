// recebe quantas páginas tem, qual é a atual e a função que troca de página
function Paginacao({ totalPaginas, paginaAtual, mudarPagina }) {
  // monta [1, 2, 3...] pra criar um botão pra cada página
  const paginas = []
  for (let i = 1; i <= totalPaginas; i++) {
    paginas.push(i)
  }

  return (
    <nav className="paginacao" aria-label="Paginação">
      {/* desabilita quando já está na primeira */}
      <button onClick={() => mudarPagina(paginaAtual - 1)} disabled={paginaAtual === 1}>
        Anterior
      </button>

      {paginas.map((numero) => (
        <button
          key={numero}
          onClick={() => mudarPagina(numero)}
          className={numero === paginaAtual ? 'ativa' : ''}
          aria-current={numero === paginaAtual ? 'page' : undefined}
        >
          {numero}
        </button>
      ))}

      {/* e aqui quando já está na última */}
      <button onClick={() => mudarPagina(paginaAtual + 1)} disabled={paginaAtual === totalPaginas}>
        Próxima
      </button>
    </nav>
  )
}

export default Paginacao
