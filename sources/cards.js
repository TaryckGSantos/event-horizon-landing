import { createGlowCard, initGlowPointer } from './components/ui/spotlight-card.js'

const CARDS = [
    {
        title:       'Gravidade',
        description: 'Experiências digitais que atraem atenção sem precisar gritar.'
    },
    {
        title:       'Profundidade',
        description: 'Interfaces visuais com presença, ritmo e atmosfera.'
    },
    {
        title:       'Horizonte',
        description: 'Cada detalhe conduz o usuário para o próximo passo.'
    }
]

function init()
{
    const overlay = document.getElementById('cards-overlay')
    const row     = overlay.querySelector('.cards-row')

    CARDS.forEach(data => {
        row.appendChild(createGlowCard(data))
    })

    initGlowPointer()

    // Visibilidade ligada ao índice de câmera: aparece apenas na posição 1
    document.addEventListener('cameraPositionChange', (e) => {
        const { index } = e.detail
        if(index === 1) {
            overlay.classList.add('is-visible')
        } else {
            overlay.classList.remove('is-visible')
        }
    })
}

init()
