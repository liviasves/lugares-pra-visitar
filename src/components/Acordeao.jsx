import { useState } from 'react'

// lista de itens que abrem e fecham. os itens (titulo + conteudo) vêm por props
function Acordeao({ itens }) {
  const [aberto, setAberto] = useState(null) // null = tudo fechado

  function clicar(indice) {
    // clicou no que já tava aberto? fecha. senão abre esse (e o outro fecha sozinho)
    if (aberto === indice) {
      setAberto(null)
    } else {
      setAberto(indice)
    }
  }

  return (
    <div className="acordeao">
      {itens.map((item, indice) => (
        <div key={indice} className="acordeao-item">
          <button
            className="acordeao-titulo"
            onClick={() => clicar(indice)}
            aria-expanded={aberto === indice}
          >
            {item.titulo}
            <span>{aberto === indice ? '−' : '+'}</span>
          </button>

          {/* a animação de abrir é feita no CSS com max-height */}
          <div className={aberto === indice ? 'acordeao-conteudo aberto' : 'acordeao-conteudo'}>
            {item.conteudo}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Acordeao
