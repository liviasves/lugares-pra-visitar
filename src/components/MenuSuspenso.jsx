import { useState, useEffect, useRef } from 'react'

// botão que abre uma lista de opções. uso ele no filtro e no formulário
function MenuSuspenso({ texto, opcoes, aoSelecionar }) {
  const [aberto, setAberto] = useState(false)
  const menuRef = useRef(null) // serve pra saber se o clique foi dentro ou fora do menu

  // fecha o menu quando clica em qualquer lugar fora dele
  useEffect(() => {
    function clicouFora(evento) {
      if (menuRef.current && !menuRef.current.contains(evento.target)) {
        setAberto(false)
      }
    }
    document.addEventListener('click', clicouFora)
    // tira o evento quando o componente some da tela
    return () => document.removeEventListener('click', clicouFora)
  }, [])

  function escolher(opcao) {
    aoSelecionar(opcao) // avisa o componente pai qual foi escolhida
    setAberto(false)
  }

  // os botões são type="button" pra não enviar o formulário sem querer
  return (
    <div className="menu" ref={menuRef}>
      <button type="button" className="menu-botao" onClick={() => setAberto(!aberto)} aria-expanded={aberto}>
        {texto} ▾
      </button>

      {aberto && (
        <ul className="menu-lista">
          {opcoes.map((opcao) => (
            <li key={opcao}>
              <button type="button" onClick={() => escolher(opcao)}>{opcao}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MenuSuspenso
