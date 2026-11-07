import { useEffect } from 'react'

// avisinho que aparece embaixo. o tipo (sucesso, erro ou info) muda a cor
function Toast({ tipo, mensagem, fechar }) {
  // some sozinho depois de 3 segundos
  useEffect(() => {
    const timer = setTimeout(fechar, 3000)
    return () => clearTimeout(timer) // se fechar antes no X, cancela o timer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // [] = roda só uma vez, quando o aviso aparece

  return (
    <div className={'toast ' + tipo} role="alert">
      <p>{mensagem}</p>
      <button onClick={fechar} aria-label="Fechar aviso">×</button>
    </div>
  )
}

export default Toast
