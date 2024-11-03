// Função para rolar a página até que a última data visível não seja mais de outubro
async function rolarAteDataDeOutubro() {
    let continuaRolando = true;

    while (continuaRolando) {
        // Rola a página para baixo
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1 segundo para carregar o conteúdo

        // Seleciona todos os registros de histórico
        let registros = document.querySelectorAll('.MfcbPl');

        // Verifica a última data nos registros
        if (registros.length > 0) {
            let ultimaData = registros[registros.length - 1].querySelector('.A0xKoZ')?.innerText || '';

            // Verifica se a última data é de outubro (formato 'MM' como '10' para outubro)
            if (!ultimaData.includes("/10/")) {
                continuaRolando = false; // Para de rolar se a data não for de outubro
            }
        } else {
            continuaRolando = false; // Para de rolar se não houver registros
        }
    }
    console.log("Rolagem concluída.");
}

// Função principal para coletar os dados após a rolagem
async function coletarDados() {
    await rolarAteDataDeOutubro(); // Rola até que não seja mais outubro

    // Array para armazenar os dados
    let historicoMoedas = [];

    // Seleciona os registros de histórico
    let registros = document.querySelectorAll('.MfcbPl');

    // Itera sobre cada registro e extrai os dados
    registros.forEach(registro => {
        let descricao = registro.querySelector('.zs5dk4') ? registro.querySelector('.zs5dk4').innerText : 'N/A';
        let data = registro.querySelector('.A0xKoZ') ? registro.querySelector('.A0xKoZ').innerText : 'N/A';
        let quantidade = registro.querySelector('.V4NzHd') ? registro.querySelector('.V4NzHd').innerText : 'N/A';

        // Armazena os dados em um objeto
        historicoMoedas.push({ data, descricao, quantidade });
    });

    // Exibe os dados no console
    console.log(historicoMoedas);

    // Cria um arquivo de texto com os dados
    let textoParaSalvar = historicoMoedas.map(item => `${item.data};${item.descricao};${item.quantidade}`).join('\n');

    // Função para salvar dados em um arquivo
    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        document.body.appendChild(element); // Necessário para funcionar no Firefox
        element.click();
        document.body.removeChild(element); // Limpa o elemento
    }

    // Baixa o arquivo
    download('historico_moedas.txt', textoParaSalvar);
}

// Executa a função principal ao carregar a página
coletarDados();