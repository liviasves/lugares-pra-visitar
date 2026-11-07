// recebe um número de 0 a 100 e usa como a largura da parte rosa
function BarraProgresso({ valor }) {
  return (
    <div className="barra">
      <div
        className="barra-fundo"
        role="progressbar"
        aria-valuenow={valor}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div className="barra-preenchida" style={{ width: valor + '%' }}></div>
      </div>
      <span>{valor}%</span>
    </div>
  )
}

export default BarraProgresso
