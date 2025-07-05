const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 20
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})
const modal = document.getElementById('pokemonModal')
const modalInfo = document.getElementById('modalInfo')
const closeModal = document.getElementById('closeModal')

closeModal.addEventListener('click', () => {
  modal.classList.add('hidden')
})
pokemonList.addEventListener('click', async (event) => {
  const card = event.target.closest('.pokemon')
  if (!card) return

  const pokeName = card.querySelector('.name').textContent
   const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName.toLowerCase()}`)
  const data = await response.json()

  const abilities = data.abilities.map(a => a.ability.name).join(', ')
  const types = data.types.map(t => t.type.name).join(', ')

   modalInfo.innerHTML = `
    <h2>${data.name.charAt(0).toUpperCase() + data.name.slice(1)} #${data.id}</h2>
    <img src="${data.sprites.other['official-artwork'].front_default}" alt="${data.name}">
    <p><strong>Altura:</strong> ${(data.height / 10).toFixed(1)} m</p>
    <p><strong>Peso:</strong> ${(data.weight / 10).toFixed(1)} kg</p>
    <p><strong>Tipos:</strong> ${types}</p>
    <p><strong>Habilidades:</strong> ${abilities}</p>
  `

  modal.classList.remove('hidden')
})