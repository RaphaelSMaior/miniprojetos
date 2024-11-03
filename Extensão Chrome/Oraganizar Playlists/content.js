console.log("content.js carregado!");

// Função para extrair as informações dos vídeos diretamente da página da playlist
function getPlaylistVideos() {
    const videos = [];

    // Selecionar os elementos da lista de vídeos na página da playlist
    const videoElements = document.querySelectorAll('ytd-playlist-video-renderer');

    videoElements.forEach((videoElement) => {
        const videoTitle = videoElement.querySelector('#video-title').textContent.trim();
        const channelName = videoElement.querySelector('.ytd-channel-name a').textContent.trim();

        videos.push({ title: videoTitle, channel: channelName });
    });

    return videos;
}

// Organizar vídeos por nome de canal
function organizeByChannel(videos) {
    const organized = {};
    videos.forEach(video => {
        if (!organized[video.channel]) {
            organized[video.channel] = [];
        }
        organized[video.channel].push(video.title);
    });
    return organized;
}

// Escuta a mensagem do popup.js para enviar os dados da playlist
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_VIDEOS') {
        const videos = getPlaylistVideos();
        const organizedVideos = organizeByChannel(videos);
        sendResponse({ organizedVideos });
    } else {
        sendResponse({ organizedVideos: null }); // Resposta padrão em caso de mensagem inesperada
    }
});
