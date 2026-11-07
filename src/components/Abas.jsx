import { useState } from 'react'

// recebe uma lista de abas (titulo + conteudo) e guarda qual está aberta
function Abas({ abas }) {
  const [abaAtiva, setAbaAtiva] = useState(0) // começa na primeira

  return (
    <div className="abas">
      <div className="abas-titulos" role="tablist">
        {abas.map((aba, indice) => (
          <button
            key={indice}
            role="tab"
            aria-selected={abaAtiva === indice}
            className={abaAtiva === indice ? 'ativa' : ''}
            onClick={() => setAbaAtiva(indice)}
          >
            {aba.titulo}
          </button>
        ))}
      </div>

      {/* mostra só o conteúdo da aba que foi clicada */}
      <div className="abas-conteudo" role="tabpanel">
        {abas[abaAtiva].conteudo}
      </div>
    </div>
  )
}

export default Abas
