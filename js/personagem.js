const api = axios.create({
    baseURL: 'https://rickandmortyapi.com/api'
});

const espacoCardsRow = document.getElementById('espaco-cards')

document.addEventListener('DOMContentLoaded', async () => {
    const personagemId = localStorage.getItem('personagemId')
    console.log({ personagemId })

    const dadosRetornados = await pegarDadosPersonagem(personagemId)


    montarColunasCards(dadosRetornados)

})

// AQUI MONTAMOS O CARD DO PERSONAGEM ESPECÍFICO
async function montarColunasCards(personagem) {
    espacoCardsRow.innerHTML = ""

    // CRIA COLUNA
    const divCol = document.createElement('div')
    divCol.setAttribute('class', 'col-8 col-md-6 col-lg-4')

    // CRIA CARD
    const divCard = document.createElement('div')
    divCard.setAttribute('class', 'card w-100')

    // CRIA IMAGEM
    const imgCard = document.createElement('img')
    imgCard.setAttribute('src', `${personagem.image}`)
    imgCard.setAttribute('class', 'card-img-top')
    imgCard.setAttribute('alt', `${personagem.name}`)

    // CRIA CARD BODY
    const divCardBody = document.createElement('div')
    divCardBody.setAttribute('class', 'card-body px-4')

    // CRIA TITULO CARD
    const tituloCard = document.createElement('h5')
    tituloCard.setAttribute('class', 'card-title')
    tituloCard.innerText = personagem.name

    // CRIA DESCRIÇÃO
    const descricaoPersonagem = document.createElement('p')
    descricaoPersonagem.setAttribute('class', 'card-text')

    // CRIA PARAGRAFO
    switch (personagem.status) {
        case 'Alive':
            descricaoPersonagem.innerHTML = `
                    <span class="text-success">
                        <i class="bi bi-caret-right-fill"></i>
                    </span>
                    Vivo - ${personagem.species}
                `
            break;

        case 'Dead':
            descricaoPersonagem.innerHTML = `
                    <span class="text-danger">
                        <i class="bi bi-caret-right-fill"></i>
                    </span>
                    Morto - ${personagem.species}
                `
            break;

        default:
            descricaoPersonagem.innerHTML = `
                    <span class="text-secondary">
                        <i class="bi bi-caret-right-fill"></i>
                    </span>
                    Desconhecido - ${personagem.species}
                `
    }

    // CRIA DL
    const dadosEpisodio = await buscarDadosEpisodio(personagem.episode[personagem.episode.length - 1])
    const detalhamentoPersonagem = document.createElement('dl');
    detalhamentoPersonagem.innerHTML = `
            <dt>Última localização conhecida:</dt>
            <dd>${personagem.location.name}</dd>

            <dt>Visto a última vez em:</dt>
            <dd>${dadosEpisodio.nomeEpisodio}</dd>
            
            <dt>Foi ao ar em:</dt>
            <dd>${dadosEpisodio.dataLancamento}</dd>
            
        `
    // APPENDS - criar os filhos dentros dos respectivos elementos pais
    divCardBody.appendChild(tituloCard)
    divCardBody.appendChild(descricaoPersonagem)
    divCardBody.appendChild(detalhamentoPersonagem)

    divCard.appendChild(imgCard)
    divCard.appendChild(divCardBody)

    divCol.appendChild(divCard)

    espacoCardsRow.appendChild(divCol)
}

async function pegarDadosPersonagem(personagemId) {
    try {
        const resposta = await api.get(`/character/${personagemId}`);

        return resposta.data

    } catch (erro) {
        console.log(erro)
    }
}

async function buscarDadosEpisodio(url) {
    try {
        const resposta = await axios.get(url)

        return {
            id: resposta.data.id,
            nomeEpisodio: resposta.data.name,
            dataLancamento: resposta.data.air_date,

        }

    } catch {
        alert("Deu algo errado na busca do episódio")
    }
}

async function buscarLocalizacoes() {
    try {
        const resposta = await api.get('/location')

        return {

            count: resposta.data.info.count,
            proximaPagina: resposta.data.info.next,
            paginaAnterior: resposta.data.info.prev
        }

    } catch (erro) {
        console.log(erro) // debug (erros de requisicao e erros de sintaxe - 400, 401, 500 ...
        alert('Erro ao buscar a quantidade de localizações.')
        // aqui é momento de mostrar uma mensagem se der erro na requisicao
    }
}