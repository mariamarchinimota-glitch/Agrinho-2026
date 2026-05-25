// Variáveis de estado do jogo
let produtividade = 100;
let sustentabilidade = 100;
let cenarioAtual = 0;

// Lista de cenários, opções e impactos no jogo
const cenarios = [
    {
        titulo: "Cenário 1: Preparo do Solo",
        descricao: "Chegou a época de preparar a terra para o plantio da nova safra. Qual técnica você vai utilizar?",
        opcoes: [
            {
                texto: "Arado pesado convencional (revira profundamente o solo)",
                modProd: 20,
                modSust: -20,
                feedback: "O arado pesado trouxe rapidez, mas expôs o solo à erosão e liberou carbono na atmosfera. A sustentabilidade caiu."
            },
            {
                texto: "Sistema de Plantio Direto (mantém a palhada da safra anterior)",
                modProd: 10,
                modSust: 20,
                feedback: "Excelente! A palhada protegeu o solo contra a chuva, manteve a umidade e a biologia da terra viva. Ganho em sustentabilidade!"
            }
        ]
    },
    {
        titulo: "Cenário 2: Controle de Pragas",
        descricao: "Insetos atacaram as folhas das plantas jovens! A lavoura corre perigo. Como agir?",
        opcoes: [
            {
                texto: "Pulverizar defensivos químicos comuns em alta quantidade",
                modProd: 15,
                modSust: -25,
                feedback: "As pragas morreram rápido, mas você também eliminou polinizadores (como abelhas) e correu risco de contaminar o lençol freático."
            },
            {
                texto: "Adotar o Manejo Integrado de Pragas (MIP) e Controle Biológico",
                modProd: 10,
                modSust: 25,
                feedback: "Incrível! Utilizando inimigos naturais das pragas e monitoramento constante, você protegeu a lavoura sem agredir o ecossistema."
            }
        ]
    },
    {
        titulo: "Cenário 3: Sistema de Irrigação",
        descricao: "O clima mudou e entramos em um período de seca severa. Como você vai garantir água para a plantação?",
        opcoes: [
            {
                texto: "Irrigação por inundação ou canhões de água comuns",
                modProd: 15,
                modSust: -20,
                feedback: "As plantas receberam água, mas houve muito desperdício por evaporação e compactação do solo pelo impacto da água."
            },
            {
                texto: "Instalar Irrigação por Gotejamento Automatizado",
                modProd: 15,
                modSust: 15,
                feedback: "Perfeito! A água vai direto na raiz na quantidade exata que a planta precisa, economizando energia e recursos hídricos."
            }
        ]
    }
];

// Função que inicia ou atualiza a tela com o cenário atual
function carregarCenario() {
    if (cenarioAtual < cenarios.length) {
        const dadosCenario = cenarios[cenarioAtual];
        
        // Atualiza os textos na tela
        document.getElementById('tituloCenario').innerText = dadosCenario.titulo;
        document.getElementById('descricaoCenario').innerText = dadosCenario.descricao;
        
        // Atualiza os botões com as opções
        document.getElementById('btnOpcaoA').innerText = dadosCenario.opcoes[0].texto;
        document.getElementById('btnOpcaoB').innerText = dadosCenario.opcoes[1].texto;
    } else {
        // Se acabarem os cenários, mostra a tela final
        mostrarResultadoFinal();
    }
}

// Função que processa a escolha do jogador
function fazerEscolha(indiceOpcao) {
    const opcaoSelecionada = cenarios[cenarioAtual].opcoes[indiceOpcao];

    // Aplica as mudanças de pontos
    produtividade += opcaoSelecionada.modProd;
    sustentabilidade += opcaoSelecionada.modSust;

    // Garante que os pontos fiquem sempre entre 0 e 100
    produtividade = Math.max(0, Math.min(100, produtividade));
    sustentabilidade = Math.max(0, Math.min(100, sustentabilidade));
// Variáveis de estado do jogo
let produtividade = 100;
let sustentabilidade = 100;
let cenarioAtual = 0;

// Lista de cenários, opções e impactos no jogo
const cenarios = [
    {
        titulo: "Cenário 1: Preparo do Solo",
        descricao: "Chegou a época de preparar a terra para o plantio da nova safra. Qual técnica você vai utilizar?",
        opcoes: [
            {
                texto: "Arado pesado convencional (revira profundamente o solo)",
                modProd: 20,
                modSust: -20,
                feedback: "O arado pesado trouxe rapidez, mas expôs o solo à erosão e liberou carbono na atmosfera. A sustentabilidade caiu."
            },
            {
                texto: "Sistema de Plantio Direto (mantém a palhada da safra anterior)",
                modProd: 10,
                modSust: 20,
                feedback: "Excelente! A palhada protegeu o solo contra a chuva, manteve a umidade e a biologia da terra viva. Ganho em sustentabilidade!"
            }
        ]
    },
    {
        titulo: "Cenário 2: Controle de Pragas",
        descricao: "Insetos atacaram as folhas das plantas jovens! A lavoura corre perigo. Como agir?",
        opcoes: [
            {
                texto: "Pulverizar defensivos químicos comuns em alta quantidade",
                modProd: 15,
                modSust: -25,
                feedback: "As pragas morreram rápido, mas você também eliminou polinizadores (como abelhas) e correu risco de contaminar o lençol freático."
            },
            {
                texto: "Adotar o Manejo Integrado de Pragas (MIP) e Controle Biológico",
                modProd: 10,
                modSust: 25,
                feedback: "Incrível! Utilizando inimigos naturais das pragas e monitoramento constante, você protegeu a lavoura sem agredir o ecossistema."
            }
        ]
    },
    {
        titulo: "Cenário 3: Sistema de Irrigação",
        descricao: "O clima mudou e entramos em um período de seca severa. Como você vai garantir água para a plantação?",
        opcoes: [
            {
                texto: "Irrigação por inundação ou canhões de água comuns",
                modProd: 15,
                modSust: -20,
                feedback: "As plantas receberam água, mas houve muito desperdício por evaporação e compactação do solo pelo impacto da água."
            },
            {
                texto: "Instalar Irrigação por Gotejamento Automatizado",
                modProd: 15,
                modSust: 15,
                feedback: "Perfeito! A água vai direto na raiz na quantidade exata que a planta precisa, economizando energia e recursos hídricos."
            }
        ]
    }
];

// Função que inicia ou atualiza a tela com o cenário atual
function carregarCenario() {
    if (cenarioAtual < cenarios.length) {
        const dadosCenario = cenarios[cenarioAtual];
        
        // Atualiza os textos na tela
        document.getElementById('tituloCenario').innerText = dadosCenario.titulo;
        document.getElementById('descricaoCenario').innerText = dadosCenario.descricao;
        
        // Atualiza os botões com as opções
        document.getElementById('btnOpcaoA').innerText = dadosCenario.opcoes[0].texto;
        document.getElementById('btnOpcaoB').innerText = dadosCenario.opcoes[1].texto;
    } else {
        // Se acabarem os cenários, mostra a tela final
        mostrarResultadoFinal();
    }
}

// Função que processa a escolha do jogador
function fazerEscolha(indiceOpcao) {
    const opcaoSelecionada = cenarios[cenarioAtual].opcoes[indiceOpcao];

    // Aplica as mudanças de pontos
    produtividade += opcaoSelecionada.modProd;
    sustentabilidade += opcaoSelecionada.modSust;

    // Garante que os pontos fiquem sempre entre 0 e 100
    produtividade = Math.max(0, Math.min(100, produtividade));
    sustentabilidade = Math.max(0, Math.min(100, sustentabilidade));

    // Atualiza o painel de pontos no HTML
    document.getElementById('prodDisplay').innerText = `Produtividade: ${produtividade}%`;
    document.getElementById('sustDisplay').innerText = `Sustentabilidade: ${sustentabilidade}%`;

    // Exibe o feedback da escolha para o aluno aprender o porquê da consequência
    document.getElementById('resultadoText').innerText = opcaoSelecionada.feedback;

    // Avança para o próximo cenário
    cenarioAtual++;
    
    // Pequeno atraso para o jogador conseguir ler o feedback antes de mudar a pergunta
    setTimeout(carregarCenario, 4000); 
}

// Função que analisa o desempenho no final do jogo
function mostrarResultadoFinal() {
    let mensagemFinal = "";
    
    // Lógica do Equilíbrio (Tema do Agrinho)
    if (produtividade >= 110 && sustentabilidade >= 110) {
        mensagemFinal = "🏆 **Parabéns! Produtor do Futuro Sustentável!** Você provou que é possível produzir muito mantendo a natureza totalmente protegida. Esse é o verdadeiro equilíbrio!";
    } else if (sustentabilidade < 80 && produtividade >= 100) {
        mensagemFinal = "🚜 **Alerta de Esgotamento!** Sua colheita foi alta hoje, mas o solo e a água ficaram esgotados. Nos próximos anos, sua fazenda não conseguirá produzir mais nada. Falta equilíbrio.";
    } else if (produtividade < 80 && sustentabilidade >= 100) {
        mensagemFinal = "🌿 **Foco em Conservação!** Você protegeu muito bem o meio ambiente, mas a quantidade de alimento produzida foi baixa para sustentar o mercado. Tente balancear um pouco mais.";
    } else {
        mensagemFinal = "👍 **Bom trabalho!** Você teve um desempenho mediano, mas consegue melhorar adotando mais tecnologias sustentáveis na sua rotina!";
    }

    // Esconde os botões e mostra o veredito final
    document.getElementById('cenario').innerHTML = `<h3>Fim da Colheita!</h3><p>${mensagemFinal}</p>`;
    document.getElementById('resultadoText').innerText = "";
}

// Inicializa o jogo assim que a página carrega
window.onload = carregarCenario;
    // Atualiza o painel de pontos no HTML
    document.getElementById('prodDisplay').innerText = `Produtividade: ${produtividade}%`;
    document.getElementById('sustDisplay').innerText = `Sustentabilidade: ${sustentabilidade}%`;

    // Exibe o feedback da escolha para o aluno aprender o porquê da consequência
    document.getElementById('resultadoText').innerText = opcaoSelecionada.feedback;

    // Avança para o próximo cenário
    cenarioAtual++;
    
    // Pequeno atraso para o jogador conseguir ler o feedback antes de mudar a pergunta
    setTimeout(carregarCenario, 4000); 
}

// Função que analisa o desempenho no final do jogo
function mostrarResultadoFinal() {
    let mensagemFinal = "";
    
    // Lógica do Equilíbrio (Tema do Agrinho)
    if (produtividade >= 110 && sustentabilidade >= 110) {
        mensagemFinal = "🏆 **Parabéns! Produtor do Futuro Sustentável!** Você provou que é possível produzir muito mantendo a natureza totalmente protegida. Esse é o verdadeiro equilíbrio!";
    } else if (sustentabilidade < 80 && produtividade >= 100) {
        mensagemFinal = "🚜 **Alerta de Esgotamento!** Sua colheita foi alta hoje, mas o solo e a água ficaram esgotados. Nos próximos anos, sua fazenda não conseguirá produzir mais nada. Falta equilíbrio.";
    } else if (produtividade < 80 && sustentabilidade >= 100) {
        mensagemFinal = "🌿 **Foco em Conservação!** Você protegeu muito bem o meio ambiente, mas a quantidade de alimento produzida foi baixa para sustentar o mercado. Tente balancear um pouco mais.";
    } else {
        mensagemFinal = "👍 **Bom trabalho!** Você teve um desempenho mediano, mas consegue melhorar adotando mais tecnologias sustentáveis na sua rotina!";
    }

    // Esconde os botões e mostra o veredito final
    document.getElementById('cenario').innerHTML = `<h3>Fim da Colheita!</h3><p>${mensagemFinal}</p>`;
    document.getElementById('resultadoText').innerText = "";
}

// Inicializa o jogo assim que a página carrega
window.onload = carregarCenario;