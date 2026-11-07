import { useState } from 'react'
import MenuSuspenso from './MenuSuspenso.jsx'

// formulário usado pra adicionar e também pra editar um lugar
// se vier "lugarInicial" nas props, é edição, então os campos já começam preenchidos
function FormLugar({ categorias, categoriasComCardapio, lugarInicial, aoSalvar, aoErro, aoCancelar }) {
  const editando = lugarInicial !== undefined

  const [nome, setNome] = useState(editando ? lugarInicial.nome : '')
  const [local, setLocal] = useState(editando ? lugarInicial.local : '')
  const [categoria, setCategoria] = useState(editando ? lugarInicial.categoria : categorias[0])
  const [foto, setFoto] = useState(editando ? lugarInicial.foto : null)
  // o cardápio pode ser um arquivo (imagem/PDF) ou um link (site, Instagram...)
  // se o que já estava salvo começa com "http", é link, então vai pro campo de link
  const cardapioSalvo = editando ? lugarInicial.cardapio : null
  const salvoEhLink = cardapioSalvo !== null && cardapioSalvo.startsWith('http')
  const [cardapio, setCardapio] = useState(salvoEhLink ? null : cardapioSalvo)
  const [linkCardapio, setLinkCardapio] = useState(salvoEhLink ? cardapioSalvo : '')
  const [nomeCardapio, setNomeCardapio] = useState('')

  // praia, passeio e viagem não têm cardápio, então o campo some
  const temCardapio = categoriasComCardapio.includes(categoria)

  // createObjectURL gera um link temporário pro arquivo escolhido
  // dá pra usar no <img> e também abrir o PDF/imagem em outra aba
  function escolherFoto(evento) {
    const arquivo = evento.target.files[0]
    if (arquivo) setFoto(URL.createObjectURL(arquivo))
  }

  function escolherCardapio(evento) {
    const arquivo = evento.target.files[0]
    if (arquivo) {
      setCardapio(URL.createObjectURL(arquivo))
      setNomeCardapio(arquivo.name)
    }
  }

  function salvar(evento) {
    evento.preventDefault() // sem isso a página recarrega quando envia o form

    if (nome.trim() === '') {
      aoErro('Preencha o nome do lugar.')
      return
    }

    // se colaram um link, ele vale. senão usa o arquivo (se tiver)
    let cardapioFinal = null
    if (temCardapio) {
      let link = linkCardapio.trim()
      if (link !== '' && !link.startsWith('http')) {
        link = 'https://' + link // ex.: "instagram.com/lugar" vira um link que abre
      }
      cardapioFinal = link !== '' ? link : cardapio
    }

    aoSalvar({
      nome,
      local,
      categoria,
      foto,
      cardapio: cardapioFinal,
    })

    // limpa os campos depois de adicionar (na edição a janela fecha, então não precisa)
    if (!editando) {
      setNome('')
      setLocal('')
      setFoto(null)
      setCardapio(null)
      setLinkCardapio('')
      setNomeCardapio('')
      evento.target.reset()
    }
  }

  return (
    <form className="formulario" onSubmit={salvar}>
      <label>
        Nome do lugar
        <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Sorveteria da Ribeira" />
      </label>

      <label>
        Localização
        <input value={local} onChange={(e) => setLocal(e.target.value)} placeholder="Ex.: Ribeira, Salvador" />
      </label>

      <div className="campo">
        <span>Categoria</span>
        <MenuSuspenso texto={categoria} opcoes={categorias} aoSelecionar={setCategoria} />
      </div>

      <label>
        {editando ? 'Trocar foto' : 'Foto do lugar'}
        <input type="file" accept="image/*" onChange={escolherFoto} />
      </label>

      {foto && <img className="previa" src={foto} alt="Prévia da foto" />}

      {temCardapio && (
        <label>
          {editando && cardapio ? 'Trocar cardápio (imagem ou PDF)' : 'Cardápio (imagem ou PDF)'}
          <input type="file" accept="image/*,application/pdf" onChange={escolherCardapio} />
        </label>
      )}

      {temCardapio && (
        <label>
          Ou cole o link do cardápio
          <input
            type="text"
            value={linkCardapio}
            onChange={(e) => setLinkCardapio(e.target.value)}
            placeholder="Ex.: https://instagram.com/..."
          />
        </label>
      )}

      {temCardapio && nomeCardapio && <p className="arquivo">📄 {nomeCardapio}</p>}
      {temCardapio && editando && cardapio && !nomeCardapio && <p className="arquivo">📄 Já tem um cardápio salvo</p>}

      <div className="botoes-form">
        <button type="submit" className="botao">
          {editando ? 'Salvar alterações' : 'Salvar lugar'}
        </button>
        {/* o cancelar só aparece na edição */}
        {aoCancelar && (
          <button type="button" className="botao botao-claro" onClick={aoCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

export default FormLugar