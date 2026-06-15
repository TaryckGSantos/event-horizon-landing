// ─── News Portal — Tela 4 (DARK_STEP) ────────────────────────────
// Ativado quando #fade-overlay recebe opacity >= 0.7 (DARK_STEP ativo).
// Usa MutationObserver para detectar mudanças sem tocar em CameraScroll.js.

// ─── Mapeamento nav → tag de filtro ──────────────────────────────
// null   → exibe TODAS as notícias, ordenadas da mais recente à mais antiga
// string → filtra NEWS pelo campo `tag` com esse valor exato
// Sem correspondência no array → exibe estado vazio discreto
const NAV_FILTER_MAP = {
    'Início':        null,            // home — exibe tudo, ordenado por data
    'Últimas':       'Últimas',
    'Galáxias':      'Galáxias',
    'Sistema Solar': 'Sistema Solar',
    'Exoplanetas':   'Exoplanetas',
    'Missões':       'Missões',
    'Fenômenos':     'Fenômenos',
    'Sobre':         'Sobre',         // sem notícias com essa tag → estado vazio
}

// ─── Parser de data em português ─────────────────────────────────
// Formato esperado: "14 Jun 2026"
const MONTHS_PT = {
    'Jan': 0, 'Fev': 1, 'Mar': 2, 'Abr': 3, 'Mai': 4, 'Jun': 5,
    'Jul': 6, 'Ago': 7, 'Set': 8, 'Out': 9, 'Nov': 10, 'Dez': 11
}

function parsePTDate(dateStr) {
    try {
        const parts = dateStr.split(' ')
        const ts = new Date(parseInt(parts[2]), MONTHS_PT[parts[1]] ?? 0, parseInt(parts[0])).getTime()
        return isNaN(ts) ? 0 : ts
    } catch (_) {
        return 0
    }
}

const NEWS = [
    {
        tag: 'Galáxias',
        title: 'James Webb detecta atmosfera em exoplaneta a 120 anos-luz',
        date: '14 Jun 2026',
        icon: 'rings',
        readTime: 4,
        body: [
            'O Telescópio Espacial James Webb confirmou pela primeira vez a presença de uma atmosfera densa e rica em nitrogênio em um exoplaneta situado a aproximadamente 120 anos-luz da Terra, na constelação de Leão. A descoberta, publicada na revista Nature, representa um marco histórico na busca por mundos habitáveis fora do Sistema Solar.',
            'A equipe internacional liderada pela ESA utilizou espectroscopia de transmissão durante três trânsitos consecutivos, identificando assinaturas de vapor d\'água e dióxido de carbono. Segundo os pesquisadores, a composição atmosférica sugere um planeta rochoso com possível atividade vulcânica, abrindo novas questões sobre a origem da vida em sistemas planetários distintos.'
        ]
    },
    {
        tag: 'Fenômenos',
        title: 'Buraco negro supermassivo em colisão observado em tempo real',
        date: '13 Jun 2026',
        icon: 'radiate',
        readTime: 5,
        body: [
            'Astrônomos do Observatório Europeu do Sul (ESO) registraram pela primeira vez uma colisão entre dois buracos negros supermassivos em tempo real, a aproximadamente 900 milhões de anos-luz de distância. O evento, detectado pela rede de radiotelescópios VLBI, emite ondas gravitacionais detectáveis na faixa de nanohertz.',
            'A fusão em andamento produz jatos de plasma relativístico com energias sem precedente nos registros astronômicos. Os dados confirmam previsões do modelo de relatividade geral para sistemas binários compactos e fornecem uma janela única para entender a formação de buracos negros com massas bilhões de vezes superiores à do Sol.'
        ]
    },
    {
        tag: 'Missões',
        title: 'NASA confirma missão tripulada a Europa para 2031',
        date: '12 Jun 2026',
        icon: 'orbit',
        readTime: 3,
        body: [
            'A NASA anunciou oficialmente a aprovação da missão Europa Pathfinder, que enviará uma tripulação de quatro astronautas à lua de Júpiter em 2031. A nave utilizará propulsão nuclear de pulso de baixa frequência para reduzir o tempo de viagem para 14 meses, contra os seis anos de uma missão química convencional.',
            'O objetivo central é perfurar a crosta de gelo de Europa e amostrar o oceano subsuperficial, onde condições propícias à vida microbiana foram inferidas por sondas anteriores. A missão inclui dois rovers autônomos com capacidade de mergulho a até 400 metros de profundidade sob o gelo.'
        ]
    },
    {
        tag: 'Cosmologia',
        title: 'Astrônomos mapeiam filamento cósmico de 1,4 bilhão de anos-luz',
        date: '11 Jun 2026',
        icon: 'rings',
        readTime: 6,
        body: [
            'Um consórcio de 23 observatórios internacionais publicou o mapeamento completo do filamento cósmico denominado Saraswati II, estendendo-se por 1,4 bilhão de anos-luz — a maior estrutura já cartografada no universo observável. O trabalho envolveu dados de mais de 180.000 galáxias coletados ao longo de sete anos.',
            'A estrutura revela padrões de distribuição de matéria escura consistentes com simulações do modelo ΛCDM, porém com uma densidade central 40% maior do que o esperado. Esse excesso, denominado pelos autores de anomalia de Saraswati, pode requerer ajustes na constante cosmológica ou indicar a presença de partículas de matéria escura ainda não catalogadas.'
        ]
    },
    {
        tag: 'Fenômenos',
        title: 'Pulsar mais rápido já registrado desafia modelos teóricos',
        date: '10 Jun 2026',
        icon: 'radiate',
        readTime: 4,
        body: [
            'O radiotelescópio FAST, na China, identificou um pulsar girando a 1.122 rotações por segundo — 18% acima do recorde anterior e próximo ao limite teórico de ruptura para uma estrela de nêutrons convencional. O objeto, catalogado como PSR J0437-4715B, situa-se a 3.200 anos-luz na direção da constelação de Pícis.',
            'A frequência de rotação extrema sugere que o objeto pode ser uma anã branca ultracompacta em vez de uma estrela de nêutrons, o que contradiria décadas de modelagem de pulsares milissegundos. A equipe propõe observações de raios-X para determinar o raio e a massa do objeto com precisão suficiente para distinguir entre as duas hipóteses.'
        ]
    },
    {
        tag: 'Sistema Solar',
        title: 'Cassini revela novos dados sobre o interior de Saturno',
        date: '09 Jun 2026',
        icon: 'orbit',
        readTime: 3,
        body: [
            'Análises recentes dos dados finais coletados pela sonda Cassini durante sua manobra de mergulho em 2017 revelam que Saturno possui um núcleo difuso de rocha e gelo com cerca de 55 massas terrestres, distribuído ao longo de 60% do raio do planeta. O resultado, obtido via sismologia planetária, contradiz modelos que previam um núcleo sólido compacto.',
            'As oscilações detectadas nos anéis de Saturno funcionaram como um sismógrafo de alta precisão, permitindo inferir a estrutura interna sem acesso direto. A descoberta implica que a diferenciação entre núcleo e manto nos gigantes gasosos é um processo muito mais gradual do que assumido pelos modelos de formação planetária clássicos.'
        ]
    },
    {
        tag: 'Exoplanetas',
        title: 'Telescópio chileno encontra planeta com água líquida confirmada',
        date: '08 Jun 2026',
        icon: 'rings',
        readTime: 5,
        body: [
            'O Observatório La Silla, no Chile, confirmou a presença de água líquida estável na superfície de Kepler-442c, um exoplaneta rochoso de 1,3 massas terrestres orbitando uma estrela K a 1.200 anos-luz de distância. A confirmação veio por meio de análise espectroscópica combinada com simulações climáticas de alta resolução.',
            'O planeta orbita na zona habitável conservadora de sua estrela e possui uma atmosfera com pressão superficial estimada em 1,2 atm, composta majoritariamente por nitrogênio e oxigênio molecular. Essa composição é a mais próxima da terrestre já detectada em um exoplaneta, elevando Kepler-442c ao topo da lista de candidatos prioritários para observação pelo ELT.'
        ]
    },
    {
        tag: 'Últimas',
        title: 'Novo mapa revela brilho oculto no centro da Via Láctea',
        date: '07 Jun 2026',
        icon: 'rings',
        readTime: 4,
        body: [
            'Uma combinação de dados infravermelhos e rádio revelou regiões de emissão antes encobertas pela poeira interestelar no centro da Via Láctea. O levantamento mostra filamentos aquecidos por campos magnéticos intensos próximos ao buraco negro Sagitário A*.',
            'Os pesquisadores afirmam que o mapa ajudará a separar estrelas jovens, nuvens moleculares e estruturas ionizadas, oferecendo uma visão mais precisa da dinâmica no núcleo galáctico.'
        ]
    },
    {
        tag: 'Últimas',
        title: 'Observatório detecta planeta jovem envolto por poeira quente',
        date: '06 Jun 2026',
        icon: 'orbit',
        readTime: 3,
        body: [
            'Astrônomos identificaram um planeta recém-formado ainda imerso no disco de material que circunda sua estrela. A assinatura térmica indica grãos de silicato aquecidos por colisões frequentes.',
            'A descoberta permite acompanhar a etapa em que mundos rochosos acumulam massa e limpam suas órbitas, um processo essencial para compreender a formação de sistemas planetários estáveis.'
        ]
    },
    {
        tag: 'Últimas',
        title: 'Telescópios registram eco de luz em nebulosa distante',
        date: '05 Jun 2026',
        icon: 'radiate',
        readTime: 4,
        body: [
            'Uma explosão estelar ocorrida há séculos produziu um eco luminoso agora captado em diferentes comprimentos de onda. A luz refletida pela poeira ao redor da nebulosa criou anéis tênues em expansão.',
            'Ao medir o atraso entre os sinais, a equipe conseguiu reconstruir a geometria do material disperso e estimar a energia liberada no evento original.'
        ]
    },
    {
        tag: 'Últimas',
        title: 'Buraco negro intermediário surge em aglomerado compacto',
        date: '04 Jun 2026',
        icon: 'radiate',
        readTime: 5,
        body: [
            'Movimentos incomuns de estrelas em um aglomerado globular apontam para a presença de um buraco negro com massa intermediária. O objeto teria milhares de massas solares e estaria oculto em uma região extremamente densa.',
            'A confirmação ajudaria a preencher a lacuna entre buracos negros estelares e supermassivos, uma das questões centrais sobre a evolução das galáxias.'
        ]
    },
    {
        tag: 'Últimas',
        title: 'Rede global acompanha cometa recém-chegado ao Sistema Solar',
        date: '03 Jun 2026',
        icon: 'orbit',
        readTime: 3,
        body: [
            'Observatórios no hemisfério sul iniciaram uma campanha coordenada para monitorar um cometa de órbita extremamente alongada. As primeiras imagens mostram uma coma rica em moléculas de carbono.',
            'O objeto deve atingir maior brilho nos próximos meses, permitindo estudar material preservado desde os estágios iniciais da formação solar.'
        ]
    },
    {
        tag: 'Últimas',
        title: 'Sinal de rádio repetitivo ganha nova fonte candidata',
        date: '02 Jun 2026',
        icon: 'radiate',
        readTime: 4,
        body: [
            'Uma rajada rápida de rádio com padrão recorrente foi associada a uma galáxia anã de baixa metalicidade. A localização precisa indica uma região de intensa formação estelar.',
            'O cenário favorece a hipótese de uma magnetar jovem como origem do sinal, embora modelos envolvendo objetos compactos binários ainda não tenham sido descartados.'
        ]
    },
    {
        tag: 'Últimas',
        title: 'Imagem profunda revela arco gravitacional quase completo',
        date: '01 Jun 2026',
        icon: 'rings',
        readTime: 5,
        body: [
            'Uma exposição de longa duração revelou um arco de luz produzido pela distorção gravitacional de uma galáxia distante. A lente principal é um aglomerado massivo situado entre a Terra e a fonte.',
            'O alinhamento raro amplia detalhes de uma galáxia jovem, permitindo observar regiões de formação estelar que seriam invisíveis sem o efeito de lente.'
        ]
    },
    {
        tag: 'Últimas',
        title: 'Astrônomos medem vento extremo em estrela moribunda',
        date: '31 Mai 2026',
        icon: 'radiate',
        readTime: 3,
        body: [
            'Espectros recentes mostram uma estrela gigante perdendo massa em velocidades acima do previsto. O vento estelar transporta elementos pesados para o meio interestelar.',
            'Esses dados refinam os modelos de evolução tardia de estrelas massivas e ajudam a prever quais objetos podem explodir como supernovas nos próximos milhares de anos.'
        ]
    },
    {
        tag: 'Galáxias',
        title: 'Galáxias em colisão formam ponte de estrelas azuis',
        date: '30 Mai 2026',
        icon: 'rings',
        readTime: 4,
        body: [
            'Imagens profundas revelaram uma ponte luminosa ligando duas galáxias espirais em interação. A estrutura contém aglomerados jovens, formados quando o gás foi comprimido pela aproximação gravitacional.',
            'A análise mostra que a colisão ainda está em fase inicial, oferecendo uma oportunidade rara para estudar como encontros galácticos redistribuem gás e iniciam surtos de formação estelar.'
        ]
    },
    {
        tag: 'Galáxias',
        title: 'Galáxia antiga preserva disco desde o universo jovem',
        date: '29 Mai 2026',
        icon: 'rings',
        readTime: 5,
        body: [
            'Uma galáxia observada quando o universo tinha menos de dois bilhões de anos apresenta um disco surpreendentemente organizado. A rotação regular contrasta com simulações que previam sistemas mais turbulentos nessa época.',
            'O achado sugere que alguns discos galácticos se estabilizaram rapidamente, talvez alimentados por fluxos frios de gás ao longo da teia cósmica.'
        ]
    },
    {
        tag: 'Galáxias',
        title: 'Via Láctea mostra cicatriz de antiga fusão estelar',
        date: '28 Mai 2026',
        icon: 'rings',
        readTime: 4,
        body: [
            'Um levantamento de posições e velocidades identificou uma faixa de estrelas com composição química distinta no halo da Via Láctea. O padrão indica a absorção de uma galáxia menor há bilhões de anos.',
            'Essa assinatura ajuda a reconstruir a história de crescimento da nossa galáxia e mostra como fusões antigas ainda moldam sua estrutura atual.'
        ]
    },
    {
        tag: 'Galáxias',
        title: 'Aglomerado distante revela berçário de galáxias vermelhas',
        date: '27 Mai 2026',
        icon: 'rings',
        readTime: 5,
        body: [
            'Astrônomos localizaram um aglomerado primitivo contendo galáxias já enriquecidas por gerações anteriores de estrelas. A luz avermelhada indica populações estelares maduras em um período remoto.',
            'O sistema pode representar uma etapa inicial da formação dos grandes aglomerados vistos no universo próximo, com galáxias crescendo rapidamente em ambientes densos.'
        ]
    },
    {
        tag: 'Galáxias',
        title: 'Jatos de buraco negro esculpem cavidades em galáxia elíptica',
        date: '26 Mai 2026',
        icon: 'radiate',
        readTime: 4,
        body: [
            'Observações em raios-X mostram cavidades gigantes no gás quente de uma galáxia elíptica. Elas foram abertas por jatos emitidos pelo buraco negro supermassivo central.',
            'Esse mecanismo injeta energia no ambiente e pode impedir o resfriamento do gás, regulando a formação de novas estrelas em galáxias massivas.'
        ]
    },
    {
        tag: 'Galáxias',
        title: 'Galáxia fantasma surge em campo profundo do hemisfério sul',
        date: '25 Mai 2026',
        icon: 'rings',
        readTime: 3,
        body: [
            'Uma galáxia ultradifusa foi identificada em imagens extremamente sensíveis, quase invisível contra o brilho do céu. Apesar de seu tamanho, ela contém poucas estrelas e grande quantidade de matéria escura.',
            'O objeto reforça a diversidade das galáxias de baixa luminosidade e pode ajudar a testar modelos de formação em halos pouco massivos.'
        ]
    },
    {
        tag: 'Galáxias',
        title: 'Nuvem de hidrogênio alimenta nascimento de estrelas em espiral',
        date: '24 Mai 2026',
        icon: 'rings',
        readTime: 4,
        body: [
            'Radiotelescópios detectaram uma corrente de hidrogênio neutro caindo sobre uma galáxia espiral próxima. A entrada de gás coincide com regiões brilhantes de formação estelar nos braços externos.',
            'O fluxo pode explicar como galáxias mantêm a produção de estrelas por bilhões de anos, mesmo após consumir parte significativa de seu material interno.'
        ]
    },
    {
        tag: 'Galáxias',
        title: 'Estrutura cósmica conecta três aglomerados gigantes',
        date: '23 Mai 2026',
        icon: 'rings',
        readTime: 5,
        body: [
            'Mapas de lentes gravitacionais fracas revelaram uma ponte de matéria escura ligando três aglomerados de galáxias. A estrutura se estende por dezenas de milhões de anos-luz.',
            'A distribuição medida combina com previsões da teia cósmica e oferece uma nova forma de rastrear matéria invisível em escalas muito grandes.'
        ]
    },
    {
        tag: 'Sistema Solar',
        title: 'Manchas solares crescem antes de tempestade geomagnética',
        date: '22 Mai 2026',
        icon: 'radiate',
        readTime: 3,
        body: [
            'Uma região ativa no Sol apresentou crescimento rápido e campos magnéticos complexos. Observatórios solares registraram erupções moderadas e ejeções de plasma associadas.',
            'Modelos de clima espacial indicam possibilidade de auroras em latitudes mais baixas, além de pequenas perturbações em comunicações de alta frequência.'
        ]
    },
    {
        tag: 'Sistema Solar',
        title: 'Lua revela depósitos de gelo em crateras menores',
        date: '21 Mai 2026',
        icon: 'orbit',
        readTime: 4,
        body: [
            'Novas medições orbitais identificaram sinais de gelo em crateras permanentemente sombreadas próximas aos polos lunares. Alguns depósitos aparecem em cavidades menores do que as consideradas prioritárias.',
            'A descoberta amplia o mapa de recursos lunares e pode influenciar o planejamento de missões robóticas e bases científicas de longa duração.'
        ]
    },
    {
        tag: 'Sistema Solar',
        title: 'Marte exibe antigos canais sob dunas avermelhadas',
        date: '20 Mai 2026',
        icon: 'orbit',
        readTime: 4,
        body: [
            'Radar orbital revelou canais enterrados sob campos de dunas em uma bacia marciana. As formas sugerem drenagem líquida em períodos mais úmidos da história do planeta.',
            'Ao comparar camadas sedimentares, pesquisadores esperam reconstruir mudanças climáticas que transformaram Marte de um mundo úmido para o deserto frio atual.'
        ]
    },
    {
        tag: 'Sistema Solar',
        title: 'Júpiter apresenta nova oval branca em faixa turbulenta',
        date: '19 Mai 2026',
        icon: 'orbit',
        readTime: 3,
        body: [
            'Astrônomos amadores e profissionais confirmaram o surgimento de uma nova tempestade oval em Júpiter. A formação aparece em uma latitude marcada por ventos alternados e nuvens de amônia.',
            'O monitoramento contínuo ajudará a medir a velocidade dos jatos atmosféricos e a duração de tempestades menores no gigante gasoso.'
        ]
    },
    {
        tag: 'Sistema Solar',
        title: 'Anéis de Saturno mostram ondas causadas por pequena lua',
        date: '18 Mai 2026',
        icon: 'orbit',
        readTime: 4,
        body: [
            'Reanálises de imagens dos anéis de Saturno revelaram ondas finas associadas à gravidade de uma lua ainda pouco estudada. O padrão permite estimar sua massa com maior precisão.',
            'Essas perturbações funcionam como rastros gravitacionais e mostram como pequenos satélites mantêm a arquitetura complexa dos anéis.'
        ]
    },
    {
        tag: 'Sistema Solar',
        title: 'Asteroide metálico reflete sinais de antiga diferenciação',
        date: '17 Mai 2026',
        icon: 'orbit',
        readTime: 3,
        body: [
            'Espectros obtidos por uma sonda em sobrevoo indicam que um asteroide rico em metais pode ser fragmento do núcleo de um protoplaneta destruído. A superfície contém ferro, níquel e minerais escuros.',
            'O objeto preserva pistas sobre colisões violentas no início do Sistema Solar, quando corpos maiores ainda estavam se formando.'
        ]
    },
    {
        tag: 'Sistema Solar',
        title: 'Cometa libera jatos de vapor antes de cruzar Marte',
        date: '16 Mai 2026',
        icon: 'orbit',
        readTime: 3,
        body: [
            'Um cometa de curto período apresentou jatos assimétricos de vapor de água e poeira durante a aproximação ao Sol. A atividade foi observada semanas antes de sua passagem próxima à órbita de Marte.',
            'A geometria dos jatos sugere áreas ativas localizadas, possivelmente abertas por fraturas recentes na crosta congelada.'
        ]
    },
    {
        tag: 'Sistema Solar',
        title: 'Lua gelada de Urano ganha mapa térmico preliminar',
        date: '15 Mai 2026',
        icon: 'orbit',
        readTime: 5,
        body: [
            'Observações infravermelhas produziram um mapa térmico preliminar de uma lua gelada de Urano. Diferenças sutis de temperatura indicam variações de textura e composição na superfície.',
            'Embora distante e pouco iluminada, a lua pode preservar sinais de processos internos antigos, incluindo fraturas e possível renovação de gelo.'
        ]
    },
    {
        tag: 'Exoplanetas',
        title: 'Super-Terra rochosa exibe atmosfera compacta',
        date: '14 Mai 2026',
        icon: 'rings',
        readTime: 4,
        body: [
            'Dados de trânsito revelaram uma super-Terra com atmosfera fina e compacta ao redor de uma estrela anã laranja. A densidade estimada indica composição predominantemente rochosa.',
            'A atmosfera parece resistente à radiação estelar, tornando o planeta um alvo importante para estudos de evolução atmosférica em mundos próximos à zona habitável.'
        ]
    },
    {
        tag: 'Exoplanetas',
        title: 'Mundo oceânico candidato mostra vapor em espectro infravermelho',
        date: '13 Mai 2026',
        icon: 'rings',
        readTime: 5,
        body: [
            'Um exoplaneta de baixa densidade apresentou uma assinatura compatível com vapor de água em sua atmosfera superior. O sinal foi observado durante múltiplos trânsitos para reduzir ruídos da estrela hospedeira.',
            'Modelos indicam que o planeta pode ter uma camada profunda de água sob uma atmosfera rica em hidrogênio, embora novas medições sejam necessárias para confirmar sua natureza oceânica.'
        ]
    },
    {
        tag: 'Exoplanetas',
        title: 'Planeta em zona habitável orbita estrela tranquila',
        date: '12 Mai 2026',
        icon: 'orbit',
        readTime: 4,
        body: [
            'Uma equipe internacional anunciou um planeta rochoso na zona habitável de uma estrela com baixa atividade magnética. A estabilidade da estrela favorece a retenção de atmosfera por longos períodos.',
            'O sistema está relativamente próximo e deve ser incluído em campanhas futuras de espectroscopia, que buscarão gases associados a processos geológicos ou biológicos.'
        ]
    },
    {
        tag: 'Exoplanetas',
        title: 'Gigante quente apresenta metais evaporando na alta atmosfera',
        date: '11 Mai 2026',
        icon: 'rings',
        readTime: 3,
        body: [
            'Observações em ultravioleta detectaram átomos metálicos escapando da atmosfera de um gigante gasoso muito próximo de sua estrela. A radiação intensa aquece as camadas externas e arrasta material para o espaço.',
            'Esse tipo de perda atmosférica ajuda a explicar por que alguns planetas próximos terminam como núcleos rochosos expostos.'
        ]
    },
    {
        tag: 'Exoplanetas',
        title: 'Sistema compacto revela cinco planetas em ressonância',
        date: '10 Mai 2026',
        icon: 'orbit',
        readTime: 5,
        body: [
            'Variações nos tempos de trânsito confirmaram cinco planetas orbitando uma mesma estrela em ressonância quase perfeita. As órbitas mantêm relações regulares, como notas em uma sequência gravitacional.',
            'A configuração sugere migração suave dentro do disco protoplanetário, preservando um arranjo delicado por bilhões de anos.'
        ]
    },
    {
        tag: 'Exoplanetas',
        title: 'Planeta escuro reflete menos luz que carvão cósmico',
        date: '09 Mai 2026',
        icon: 'rings',
        readTime: 3,
        body: [
            'Medições fotométricas indicam que um exoplaneta próximo absorve quase toda a luz recebida de sua estrela. A baixa refletividade pode ser causada por nuvens escuras e moléculas complexas na atmosfera.',
            'O mundo completa uma órbita em poucos dias e apresenta temperaturas extremas, oferecendo um laboratório natural para química atmosférica sob radiação intensa.'
        ]
    },
    {
        tag: 'Exoplanetas',
        title: 'Telescópio mede ventos em planeta travado por marés',
        date: '08 Mai 2026',
        icon: 'rings',
        readTime: 4,
        body: [
            'Mapas térmicos de fase revelaram ventos fortes transportando calor do lado diurno para o lado noturno de um exoplaneta travado por marés. A diferença de temperatura é menor do que modelos simples previam.',
            'A circulação atmosférica eficiente pode ampliar as condições estáveis em mundos que mantêm sempre a mesma face voltada para sua estrela.'
        ]
    },
    {
        tag: 'Exoplanetas',
        title: 'Pequeno planeta rochoso surge em torno de anã vermelha próxima',
        date: '07 Mai 2026',
        icon: 'orbit',
        readTime: 3,
        body: [
            'Um planeta ligeiramente maior que Marte foi encontrado ao redor de uma anã vermelha próxima. Sua órbita curta facilita observações repetidas e medições precisas de massa.',
            'Embora quente demais para água líquida na superfície, o objeto ajuda a completar o inventário de pequenos mundos em torno das estrelas mais comuns da galáxia.'
        ]
    },
    {
        tag: 'Missões',
        title: 'Sonda lunar testa pouso autônomo em terreno irregular',
        date: '06 Mai 2026',
        icon: 'orbit',
        readTime: 4,
        body: [
            'Uma sonda robótica completou testes de navegação visual para pousar perto de crateras e rochas sem intervenção direta da Terra. O sistema compara imagens em tempo real com mapas orbitais.',
            'A tecnologia será essencial para missões em polos lunares, onde áreas iluminadas e sombreadas se alternam em relevo complexo.'
        ]
    },
    {
        tag: 'Missões',
        title: 'Telescópio espacial abre campanha contra poeira zodiacal',
        date: '05 Mai 2026',
        icon: 'rings',
        readTime: 3,
        body: [
            'Um telescópio em órbita iniciou uma campanha dedicada a medir a luz espalhada pela poeira zodiacal no Sistema Solar interno. O brilho fraco interfere em imagens profundas do universo distante.',
            'Com mapas mais precisos, astrônomos poderão remover melhor esse primeiro plano e melhorar estudos de galáxias jovens e matéria difusa.'
        ]
    },
    {
        tag: 'Missões',
        title: 'Rover marciano perfura camada rica em argilas claras',
        date: '04 Mai 2026',
        icon: 'orbit',
        readTime: 4,
        body: [
            'Um rover em Marte coletou amostras de uma camada clara contendo minerais de argila. Esses minerais costumam se formar em ambientes com água líquida persistente.',
            'A amostra será analisada por instrumentos internos e comparada a depósitos próximos para entender a duração dos antigos lagos marcianos.'
        ]
    },
    {
        tag: 'Missões',
        title: 'Missão a asteroide inicia retorno com cápsula selada',
        date: '03 Mai 2026',
        icon: 'orbit',
        readTime: 4,
        body: [
            'Uma nave de coleta de amostras acionou seus motores para iniciar a trajetória de retorno à Terra. A cápsula contém partículas retiradas de uma região preservada de um asteroide carbonáceo.',
            'O material poderá revelar moléculas orgânicas e minerais hidratados presentes antes da formação dos planetas rochosos.'
        ]
    },
    {
        tag: 'Missões',
        title: 'Novo lançador pesado completa ensaio de abastecimento',
        date: '02 Mai 2026',
        icon: 'radiate',
        readTime: 3,
        body: [
            'Engenheiros concluíram um ensaio de abastecimento criogênico em um lançador pesado projetado para cargas interplanetárias. O teste avaliou válvulas, pressurização e comportamento térmico dos tanques.',
            'O resultado prepara o veículo para uma queima estática completa antes do primeiro voo operacional.'
        ]
    },
    {
        tag: 'Missões',
        title: 'Satélite climático solar entra em órbita de monitoramento',
        date: '01 Mai 2026',
        icon: 'radiate',
        readTime: 3,
        body: [
            'Um satélite dedicado ao clima espacial alcançou sua órbita de monitoramento e iniciou calibração dos instrumentos. Ele observará vento solar, partículas energéticas e campos magnéticos.',
            'Os dados devem melhorar alertas para tempestades solares capazes de afetar redes elétricas, satélites e sistemas de navegação.'
        ]
    },
    {
        tag: 'Missões',
        title: 'Módulo orbital prepara sobrevoo rasante de lua gelada',
        date: '30 Abr 2026',
        icon: 'orbit',
        readTime: 5,
        body: [
            'Uma missão no sistema de Júpiter ajustou sua trajetória para realizar um sobrevoo rasante de uma lua gelada. A manobra permitirá medir campos magnéticos e composição de partículas ejetadas.',
            'Os instrumentos buscarão sinais indiretos de um oceano subsuperficial e possíveis trocas químicas entre gelo, rocha e água líquida.'
        ]
    },
    {
        tag: 'Missões',
        title: 'Cargueiro espacial entrega laboratório compacto à órbita baixa',
        date: '29 Abr 2026',
        icon: 'orbit',
        readTime: 3,
        body: [
            'Um cargueiro automático acoplou com sucesso a uma estação orbital levando um laboratório compacto de biologia e materiais. Os experimentos estudarão crescimento celular e ligas metálicas em microgravidade.',
            'Os resultados podem apoiar missões de longa duração e processos industriais que dependem de ambientes sem convecção significativa.'
        ]
    },
    {
        tag: 'Fenômenos',
        title: 'Onda gravitacional indica fusão desigual de buracos negros',
        date: '28 Abr 2026',
        icon: 'radiate',
        readTime: 5,
        body: [
            'Detectores registraram uma onda gravitacional produzida por dois buracos negros com massas muito diferentes. O sinal contém harmônicos que ajudam a testar a relatividade em campos extremos.',
            'A assimetria da fusão pode ter lançado o buraco negro final em alta velocidade, um efeito previsto por simulações de recuo gravitacional.'
        ]
    },
    {
        tag: 'Fenômenos',
        title: 'Supernova jovem acende casca de gás ao redor da estrela',
        date: '27 Abr 2026',
        icon: 'radiate',
        readTime: 4,
        body: [
            'Uma supernova recém-detectada apresentou brilho extra ao colidir com uma casca de gás expelida antes da explosão. A interação gerou linhas espectrais estreitas e emissão intensa em raios-X.',
            'O evento sugere que a estrela progenitora passou por episódios violentos de perda de massa nos anos finais de sua vida.'
        ]
    },
    {
        tag: 'Fenômenos',
        title: 'Lente gravitacional multiplica quasar em quatro imagens',
        date: '26 Abr 2026',
        icon: 'rings',
        readTime: 4,
        body: [
            'Um quasar distante apareceu dividido em quatro pontos ao redor de uma galáxia massiva no primeiro plano. A gravidade da galáxia curva a luz e cria imagens múltiplas da mesma fonte.',
            'Variações de brilho entre as imagens permitirão estimar a distribuição de matéria escura e medir atrasos de tempo úteis para cosmologia.'
        ]
    },
    {
        tag: 'Fenômenos',
        title: 'Magnetar libera pulso de raios gama em galáxia vizinha',
        date: '25 Abr 2026',
        icon: 'radiate',
        readTime: 3,
        body: [
            'Satélites de alta energia detectaram um pulso curto e intenso compatível com uma magnetar em uma galáxia próxima. O evento durou frações de segundo, mas liberou energia comparável à emissão solar de muitos anos.',
            'Essas explosões ajudam a investigar campos magnéticos trilhões de vezes mais fortes que os produzidos em laboratórios terrestres.'
        ]
    },
    {
        tag: 'Fenômenos',
        title: 'Tempestade solar comprime magnetosfera terrestre',
        date: '24 Abr 2026',
        icon: 'radiate',
        readTime: 3,
        body: [
            'Uma ejeção de massa coronal atingiu a Terra e comprimiu temporariamente a magnetosfera. Satélites registraram aumento de partículas energéticas e correntes elétricas no ambiente espacial.',
            'O evento produziu auroras intensas e forneceu dados valiosos para modelos de previsão do clima espacial.'
        ]
    },
    {
        tag: 'Fenômenos',
        title: 'Pulsar binário confirma arrasto do espaço-tempo',
        date: '23 Abr 2026',
        icon: 'radiate',
        readTime: 5,
        body: [
            'Medições de tempo extremamente precisas em um pulsar binário revelaram mudanças orbitais compatíveis com o arrasto do espaço-tempo. O efeito ocorre quando objetos compactos giram e deformam a geometria ao redor.',
            'A observação amplia testes da relatividade geral em sistemas onde gravidade, rotação e densidade extrema atuam simultaneamente.'
        ]
    },
    {
        tag: 'Fenômenos',
        title: 'Quasar distante ilumina gás frio da teia cósmica',
        date: '22 Abr 2026',
        icon: 'rings',
        readTime: 4,
        body: [
            'A luz de um quasar muito distante atravessou filamentos de gás frio antes de chegar à Terra. Linhas de absorção revelam hidrogênio e metais espalhados entre galáxias jovens.',
            'O fenômeno funciona como uma lanterna natural para mapear a matéria difusa que alimenta a formação de galáxias ao longo do tempo cósmico.'
        ]
    },
    {
        tag: 'Fenômenos',
        title: 'Evento de maré despedaça estrela perto de buraco negro',
        date: '21 Abr 2026',
        icon: 'radiate',
        readTime: 5,
        body: [
            'Telescópios detectaram o brilho crescente de uma estrela sendo fragmentada pela gravidade de um buraco negro. Parte do material formou um disco quente, emitindo radiação ultravioleta e raios-X.',
            'O acompanhamento do evento permite medir como buracos negros adormecidos se alimentam quando uma estrela passa perto demais de seu horizonte de eventos.'
        ]
    }
]

const ICONS = {
    rings: `<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="26" cy="26" r="8" stroke="rgba(124,58,237,0.8)" stroke-width="1.5"/>
        <ellipse cx="26" cy="26" rx="18" ry="7" stroke="rgba(124,58,237,0.5)" stroke-width="1"/>
        <ellipse cx="26" cy="26" rx="24" ry="10" stroke="rgba(124,58,237,0.3)" stroke-width="1"/>
    </svg>`,
    radiate: `<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="26" cy="26" r="5" fill="rgba(124,58,237,0.8)"/>
        <line x1="26" y1="4"  x2="26" y2="14" stroke="rgba(124,58,237,0.6)" stroke-width="1.5"/>
        <line x1="26" y1="38" x2="26" y2="48" stroke="rgba(124,58,237,0.6)" stroke-width="1.5"/>
        <line x1="4"  y1="26" x2="14" y2="26" stroke="rgba(124,58,237,0.6)" stroke-width="1.5"/>
        <line x1="38" y1="26" x2="48" y2="26" stroke="rgba(124,58,237,0.6)" stroke-width="1.5"/>
        <line x1="10" y1="10" x2="17" y2="17" stroke="rgba(124,58,237,0.4)" stroke-width="1.5"/>
        <line x1="35" y1="35" x2="42" y2="42" stroke="rgba(124,58,237,0.4)" stroke-width="1.5"/>
        <line x1="42" y1="10" x2="35" y2="17" stroke="rgba(124,58,237,0.4)" stroke-width="1.5"/>
        <line x1="17" y1="35" x2="10" y2="42" stroke="rgba(124,58,237,0.4)" stroke-width="1.5"/>
    </svg>`,
    orbit: `<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="26" cy="26" r="4" fill="rgba(124,58,237,0.9)"/>
        <circle cx="26" cy="26" r="16" stroke="rgba(124,58,237,0.4)" stroke-width="1" stroke-dasharray="3 4"/>
        <circle cx="42" cy="26" r="3" fill="rgba(200,170,255,0.7)"/>
    </svg>`
}

// Fallback astronômico genérico para valores de `icon` não mapeados em ICONS
const ICON_FALLBACK = `<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="26" cy="26" r="6" stroke="rgba(124,58,237,0.75)" stroke-width="1.5"/>
    <circle cx="26" cy="26" r="16" stroke="rgba(124,58,237,0.35)" stroke-width="1" stroke-dasharray="2 4"/>
    <circle cx="26" cy="26" r="24" stroke="rgba(124,58,237,0.15)" stroke-width="1"/>
</svg>`

// Retorna SVG do ícone redimensionado. Usa ICON_FALLBACK se iconName não constar em ICONS.
function getIconSvg(iconName, size) {
    const base = ICONS[iconName] || ICON_FALLBACK
    return base
        .replace(/width="\d+"/, `width="${size}"`)
        .replace(/height="\d+"/, `height="${size}"`)
}

// Saturno stroke-only, 20×20px, cor #7C3AED. IDs únicos por item evitam conflito global de máscara.
function saturnSvg(i) {
    const mid = `np-sm-${i}`
    return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">` +
        `<defs><mask id="${mid}">` +
        `<rect width="20" height="20" fill="white"/>` +
        `<circle cx="10" cy="10" r="4.8" fill="black"/>` +
        `</mask></defs>` +
        `<ellipse cx="10" cy="10" rx="9" ry="3" stroke="rgba(124,58,237,0.45)" stroke-width="1.2" mask="url(#${mid})"/>` +
        `<circle cx="10" cy="10" r="4.5" stroke="rgba(124,58,237,0.85)" stroke-width="1.2"/>` +
        `<path d="M 1 11.8 Q 10 14.5 19 11.8" stroke="rgba(124,58,237,0.85)" stroke-width="1.2" fill="none" stroke-linecap="round"/>` +
        `</svg>`
}

const NAV_ITEMS = ['Início', 'Últimas', 'Galáxias', 'Sistema Solar', 'Exoplanetas', 'Missões', 'Fenômenos', 'Sobre']

// ─── Estado ──────────────────────────────────────────────────────

let isPortalVisible = false
let showTimer = null
let hideTimer = null
let currentFilterTag = null   // null = exibe tudo; string = filtra por tag
let newsListWheelHandler = null

// Timers das sequências de animação do modal (para cancelamento)
let openModalTimers = []

// ─── Filtragem e ordenação ────────────────────────────────────────

// Retorna array de {item, idx} filtrado e ordenado do mais recente ao mais antigo.
// filterTag === null inclui todas as notícias.
// idx é o índice original em NEWS, preservado para que o modal continue funcionando
// mesmo após filtragem (attachNewsEvents usa NEWS[data-index]).
function getFilteredNews(filterTag) {
    let items = NEWS.map((n, i) => ({ item: n, idx: i }))
    if (filterTag !== null) {
        items = items.filter(({ item }) => item.tag === filterTag)
    }
    items.sort((a, b) => parsePTDate(b.item.date) - parsePTDate(a.item.date))
    return items
}

// ─── DOM ─────────────────────────────────────────────────────────

function buildPortal() {
    const portal = document.createElement('div')
    portal.id = 'news-portal'
    portal.setAttribute('aria-hidden', 'true')

    portal.innerHTML = `
        ${buildNav()}
        ${buildHamburger()}
        ${buildDrawer()}
        ${buildWidgets()}
        ${buildNewsList()}
        ${buildModal()}
    `

    document.body.appendChild(portal)

    attachNavEvents()
    attachWidgetCounters()
    attachNewsEvents()
    attachModalEvents()
    attachHamburgerEvents()
    attachDrawerEvents()
}

// --item-index alimenta animation-delay escalonado via CSS calc()
function buildNav() {
    const items = NAV_ITEMS.map((name, i) =>
        `<li class="${i === 0 ? 'active' : ''}" style="--item-index: ${i}"><a href="#" data-nav="${name}">${name}</a></li>`
    ).join('')
    return `<nav id="np-nav"><ul>${items}</ul></nav>`
}

function buildHamburger() {
    return `<button id="np-hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
    </button>`
}

function buildDrawer() {
    const items = NAV_ITEMS.map((name, i) =>
        `<li class="${i === 0 ? 'active' : ''}"><a href="#" data-nav-drawer="${name}">${name}</a></li>`
    ).join('')
    return `<div id="np-drawer">
        <div id="np-drawer-bg"></div>
        <div id="np-drawer-panel"><ul>${items}</ul></div>
    </div>`
}

function buildWidgets() {
    return `<div id="np-widgets">
        <div class="np-widget">
            <span class="np-widget-label">Objetos Catalogados</span>
            <span class="np-widget-value" id="np-w-objects">2.847.000</span>
        </div>
        <div class="np-widget">
            <span class="np-widget-label">Missões Ativas</span>
            <span class="np-widget-value">47</span>
        </div>
        <div class="np-widget">
            <span class="np-widget-label">Próximo Evento</span>
            <span class="np-widget-value" id="np-w-countdown">--</span>
            <span class="np-widget-sub">Eclipse Solar</span>
        </div>
        <div class="np-widget">
            <span class="np-widget-label">Temperatura Média</span>
            <span class="np-widget-value">-270.45 C</span>
        </div>
    </div>`
}

// Gera os <li> a partir de um array filtrado de {item, idx}.
// --news-index usa a posição no array filtrado para que o stagger comece sempre de 0.
// data-index usa idx (posição original em NEWS) para que openModal(NEWS[idx]) funcione.
function buildNewsItems(filtered) {
    if (filtered.length === 0) {
        return '<li class="np-news-empty">Nenhuma notícia nesta categoria ainda.</li>'
    }
    return filtered.map(({ item: n, idx }, i) => {
        try {
            const readTimeStr = n.readTime != null ? ' · ' + n.readTime + ' min de leitura' : ''
            return '<li class="np-news-item" data-index="' + idx + '" style="--news-index: ' + i + '">' +
                '<span class="np-news-glow" aria-hidden="true"></span>' +
                '<span class="np-news-border" aria-hidden="true"></span>' +
                '<div class="np-news-item-body">' +
                    '<span class="np-news-tag">' + (n.tag || '') + '</span>' +
                    '<p class="np-news-title">' + (n.title || '') + '</p>' +
                    '<span class="np-news-date">' + (n.date || '') + readTimeStr + '</span>' +
                '</div>' +
                '<span class="np-news-arrow" aria-hidden="true">' + saturnSvg(idx) + '</span>' +
                '</li>'
        } catch (_) {
            return ''
        }
    }).join('')
}

// --news-index alimenta animation-delay escalonado via CSS calc()
function buildNewsList() {
    const items = buildNewsItems(getFilteredNews(null))
    return `<section id="np-news"><ul class="np-news-list">${items}</ul></section>`
}

// Modal de artigo — estrutura estática; conteúdo preenchido por openModal().
// #np-modal-scroll é o alvo de wheel/touchmove stopPropagation em attachModalEvents.
function buildModal() {
    return `<div id="np-modal" role="dialog" aria-modal="true" aria-hidden="true">
        <div id="np-modal-card">
            <button id="np-modal-close" aria-label="Fechar">&#x2715;</button>
            <div id="np-modal-scroll">
                <div id="np-modal-img"></div>
                <span id="np-modal-tag"></span>
                <hr id="np-modal-sep">
                <h2 id="np-modal-title"></h2>
                <p id="np-modal-meta"></p>
                <div id="np-modal-body"></div>
            </div>
        </div>
    </div>`
}

// Atualiza a lista central com transição de saída (fade + translateY) seguida
// de entrada escalonada dos novos itens via animação CSS newsItemIn.
function renderNewsList(filterTag) {
    const list = document.querySelector('.np-news-list')
    if (!list) return

    let rendered = false

    function doRender() {
        if (rendered) return
        rendered = true

        const filtered = getFilteredNews(filterTag)
        list.innerHTML = buildNewsItems(filtered)

        // Snap de volta sem transição — itens animam individualmente pelo CSS
        list.style.transition = 'none'
        list.style.removeProperty('opacity')
        list.style.removeProperty('transform')
        list.style.removeProperty('pointer-events')

        // Força re-trigger de newsItemIn nos novos elementos
        list.querySelectorAll('.np-news-item').forEach(el => {
            el.style.animationName = 'none'
            void el.offsetWidth
            el.style.animationName = ''
        })

        // Restaura transition após o browser confirmar o snap
        requestAnimationFrame(() => requestAnimationFrame(() => {
            list.style.removeProperty('transition')
        }))
    }

    // Saída: transição suave de ~150ms
    list.style.transition = 'opacity 150ms ease-out, transform 150ms ease-out'
    list.style.pointerEvents = 'none'
    void list.getBoundingClientRect() // força reflow para garantir que a transition está ativa
    list.style.opacity = '0'
    list.style.transform = 'translateY(6px)'

    list.addEventListener('transitionend', doRender, { once: true })
    setTimeout(doRender, 220) // fallback caso transitionend não dispare
}

// ─── Animação 4: navegação com flash e indicador animado ──────────

function attachNavEvents() {
    document.querySelectorAll('#np-nav a').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault()
            const li = a.closest('li')
            const navName = a.dataset.nav

            // Flash de fundo no item clicado
            li.classList.remove('nav-flash')
            void li.offsetWidth
            li.classList.add('nav-flash')
            li.addEventListener('animationend', () => li.classList.remove('nav-flash'), { once: true })

            // Troca o item ativo (o ::before faz scaleY com transition)
            document.querySelectorAll('#np-nav li').forEach(el => el.classList.remove('active'))
            li.classList.add('active')

            // Aplica filtro se mudou
            const filterTag = Object.prototype.hasOwnProperty.call(NAV_FILTER_MAP, navName)
                ? NAV_FILTER_MAP[navName]
                : null
            if (filterTag !== currentFilterTag) {
                currentFilterTag = filterTag
                renderNewsList(currentFilterTag)
            }
        })
    })
}

// ─── Hamburguer e drawer mobile ──────────────────────────────────

function attachHamburgerEvents() {
    document.getElementById('np-hamburger').addEventListener('click', () => {
        document.getElementById('np-drawer').classList.add('open')
    })
}

function attachDrawerEvents() {
    document.getElementById('np-drawer-bg').addEventListener('click', () => {
        document.getElementById('np-drawer').classList.remove('open')
    })

    document.querySelectorAll('#np-drawer-panel a').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault()
            const navName = a.dataset.navDrawer

            // Ativo no drawer
            document.querySelectorAll('#np-drawer-panel li').forEach(li => li.classList.remove('active'))
            a.closest('li').classList.add('active')

            // Sincroniza estado ativo no nav desktop
            document.querySelectorAll('#np-nav a').forEach(navA => {
                if (navA.dataset.nav === navName) {
                    document.querySelectorAll('#np-nav li').forEach(li => li.classList.remove('active'))
                    navA.closest('li').classList.add('active')
                }
            })

            document.getElementById('np-drawer').classList.remove('open')

            // Aplica filtro se mudou
            const filterTag = Object.prototype.hasOwnProperty.call(NAV_FILTER_MAP, navName)
                ? NAV_FILTER_MAP[navName]
                : null
            if (filterTag !== currentFilterTag) {
                currentFilterTag = filterTag
                renderNewsList(currentFilterTag)
            }
        })
    })
}

// ─── Widget: contador de objetos ──────────────────────────────────

function attachWidgetCounters() {
    const el = document.getElementById('np-w-objects')
    if (!el) return

    const start = 2847000
    const end   = 2847391
    const dur   = 8000
    let startTime = null

    function tick(ts) {
        if (!startTime) startTime = ts
        const p = Math.min((ts - startTime) / dur, 1)
        const val = Math.floor(start + (end - start) * p)
        el.textContent = val.toLocaleString('pt-BR')
        if (p < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
    startCountdown()
}

// ─── Widget: countdown Eclipse Solar ─────────────────────────────

function startCountdown() {
    const el = document.getElementById('np-w-countdown')
    if (!el) return

    const target = new Date('2026-08-12T17:00:00Z')

    function updateCountdown() {
        const diff = target - Date.now()
        if (diff <= 0) { el.textContent = 'Agora'; return }
        const d = Math.floor(diff / 86400000)
        const h = Math.floor((diff % 86400000) / 3600000)
        const m = Math.floor((diff % 3600000) / 60000)
        el.textContent = `${String(d).padStart(2,'0')}d ${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m`
    }

    updateCountdown()
    setInterval(updateCountdown, 60000)
}

// ─── Notícias: click → modal ──────────────────────────────────────
// Usa delegação de evento em #np-news para funcionar após substituição de innerHTML.
// data-index aponta para o índice original em NEWS, não para a posição na lista filtrada.

function attachNewsEvents() {
    document.getElementById('np-news').addEventListener('click', e => {
        const item = e.target.closest('.np-news-item')
        if (!item) return
        const idx = parseInt(item.dataset.index, 10)
        openModal(NEWS[idx])
    })
}

// ─── Animações 2 e 3: abertura e fechamento do modal ─────────────

function openModal(news) {
    const modal = document.getElementById('np-modal')
    const card  = document.getElementById('np-modal-card')
    const img   = document.getElementById('np-modal-img')
    const body  = document.getElementById('np-modal-body')

    // Cancela timers de abertura pendentes (re-abertura rápida)
    openModalTimers.forEach(clearTimeout)
    openModalTimers = []

    // Reseta estado do card para a próxima abertura
    card.classList.remove('np-card-entering', 'np-card-exiting')
    img.classList.remove('np-img-entering')

    // Preenche conteúdo
    document.getElementById('np-modal-tag').textContent   = news.tag
    document.getElementById('np-modal-title').textContent = news.title
    document.getElementById('np-modal-meta').textContent  = `${news.date}  -  ${news.readTime} min de leitura`
    img.style.background = 'linear-gradient(135deg, #1a0533 0%, #0d1f4a 100%)'
    img.innerHTML = ICONS[news.icon] || ICON_FALLBACK

    // Parágrafos com delay escalonado via CSS custom property
    body.innerHTML = news.body.map((p, i) =>
        `<p style="--para-delay: ${280 + i * 60}ms">${p}</p>`
    ).join('')

    // t=0: abre backdrop (fade 220ms via CSS transition)
    modal.classList.add('open')
    modal.setAttribute('aria-hidden', 'false')
    document.body.style.overflow = 'hidden'

    // t=60ms: card entra (380ms, easing spring)
    openModalTimers.push(setTimeout(() => {
        card.classList.add('np-card-entering')
    }, 60))

    // t=240ms: imagem faz fade in (200ms)
    openModalTimers.push(setTimeout(() => {
        img.classList.add('np-img-entering')
    }, 240))
}

function closeModal() {
    const modal = document.getElementById('np-modal')
    const card  = document.getElementById('np-modal-card')

    if (!modal.classList.contains('open')) return

    // Cancela timers de abertura pendentes
    openModalTimers.forEach(clearTimeout)
    openModalTimers = []

    // Bloqueia interação imediatamente
    modal.style.pointerEvents = 'none'

    // t=0: card faz exit animation (220ms ease-in)
    card.classList.remove('np-card-entering')
    card.classList.add('np-card-exiting')

    // t=220ms: remove .open — backdrop faz fade out via CSS transition (220ms)
    setTimeout(() => {
        modal.classList.remove('open')
        modal.setAttribute('aria-hidden', 'true')
        document.body.style.overflow = ''
        modal.style.pointerEvents = ''

        // t=220+250ms: limpa estado do card para próxima abertura
        setTimeout(() => {
            card.classList.remove('np-card-exiting')
            card.classList.remove('np-card-entering')
        }, 250)
    }, 220)
}

function attachModalEvents() {
    const modal = document.getElementById('np-modal')
    const card  = document.getElementById('np-modal-card')

    document.getElementById('np-modal-close').addEventListener('click', closeModal)

    modal.addEventListener('click', e => {
        if (e.target === modal) closeModal()
    })

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeModal()
    })

    // Impede que scroll dentro do card propague para o container pai
    const scroll = document.getElementById('np-modal-scroll')
    scroll.addEventListener('wheel', (e) => e.stopPropagation(), { passive: false })
    scroll.addEventListener('touchmove', (e) => e.stopPropagation(), { passive: false })
}

// ─── Mostrar / ocultar portal ─────────────────────────────────────

function resetAnimation(el) {
    el.style.animationName = 'none'
    void el.offsetWidth
    el.style.animationName = ''
}

function showPortal() {
    const portal = document.getElementById('news-portal')
    if (!portal) return
    isPortalVisible = true

    // Reseta filtro para "Início" (exibe tudo) sempre que o portal é exibido
    currentFilterTag = null
    document.querySelectorAll('#np-nav li').forEach((li, i) => {
        li.classList.toggle('active', i === 0)
    })
    document.querySelectorAll('#np-drawer-panel li').forEach((li, i) => {
        li.classList.toggle('active', i === 0)
    })

    // Reconstrói lista com todos os itens (pode estar filtrada de visita anterior)
    const list = document.querySelector('.np-news-list')
    if (list) list.innerHTML = buildNewsItems(getFilteredNews(null))

    // Reinicia animação dos widgets
    document.querySelectorAll('.np-widget').forEach(resetAnimation)

    portal.classList.add('is-visible')

    // Re-aciona animação de entrada nos itens inseridos antes de is-visible existir
    requestAnimationFrame(() => {
        document.querySelectorAll('.np-news-item').forEach(resetAnimation)
    })

    portal.setAttribute('aria-hidden', 'false')

    const listEl = document.querySelector('.np-news-list')
    if (listEl) {
        newsListWheelHandler = e => {
            e.stopPropagation()
            e.preventDefault()
            listEl.scrollTop += e.deltaY
        }
        listEl.addEventListener('wheel', newsListWheelHandler, { passive: false })
    }
}

function hidePortal() {
    const portal = document.getElementById('news-portal')
    if (!portal) return
    isPortalVisible = false
    closeModal()
    portal.classList.remove('is-visible')
    portal.setAttribute('aria-hidden', 'true')

    const listEl = document.querySelector('.np-news-list')
    if (listEl && newsListWheelHandler) {
        listEl.removeEventListener('wheel', newsListWheelHandler)
        newsListWheelHandler = null
    }
}

// ─── MutationObserver no #fade-overlay ────────────────────────────

function watchFadeOverlay() {
    const overlay = document.getElementById('fade-overlay')
    if (!overlay) return

    const observer = new MutationObserver(() => {
        const opacity = parseFloat(overlay.style.opacity) || 0

        if (opacity >= 0.7) {
            // Tela 4 ativa — aguarda o fade terminar (~550ms)
            if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
            if (!isPortalVisible && !showTimer) {
                showTimer = setTimeout(() => {
                    showTimer = null
                    const currentOpacity = parseFloat(document.getElementById('fade-overlay').style.opacity) || 0
                    if (currentOpacity >= 0.7) showPortal()
                }, 550)
            }
        } else {
            // Saiu da Tela 4 — cancela timer pendente e esconde
            if (showTimer) { clearTimeout(showTimer); showTimer = null }
            if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
            if (isPortalVisible) hidePortal()
        }
    })

    observer.observe(overlay, { attributes: true, attributeFilter: ['style'] })
}

// ─── Init ─────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    buildPortal()
    watchFadeOverlay()
})
