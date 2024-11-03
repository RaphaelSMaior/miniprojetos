document.addEventListener('DOMContentLoaded', function () {
  const button = document.getElementById('fetchVideos');
  const resultDiv = document.getElementById('result');

  if (button) {
      button.addEventListener('click', () => {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_VIDEOS' }, (response) => {
                  resultDiv.innerHTML = ''; // Limpar resultados anteriores

                  if (response && response.organizedVideos) {
                      for (let channel in response.organizedVideos) {
                          const channelDiv = document.createElement('div');
                          channelDiv.className = 'channel';
                          channelDiv.textContent = `Canal: ${channel}`;
                          resultDiv.appendChild(channelDiv);

                          response.organizedVideos[channel].forEach(video => {
                              const videoDiv = document.createElement('div');
                              videoDiv.className = 'video';
                              videoDiv.textContent = video;
                              videoDiv.setAttribute('draggable', 'true');

                              // Adicione os eventos de drag-and-drop
                              videoDiv.addEventListener('dragstart', dragStart);
                              videoDiv.addEventListener('dragover', dragOver);
                              videoDiv.addEventListener('drop', drop);
                              videoDiv.addEventListener('dragenter', dragEnter);
                              videoDiv.addEventListener('dragleave', dragLeave);

                              resultDiv.appendChild(videoDiv);
                          });
                      }
                  } else {
                      resultDiv.textContent = 'Nenhum vídeo encontrado.';
                  }
              });
          });
      });
  }

  let dragged;

  function dragStart(e) {
      dragged = this; // O elemento que está sendo arrastado
      e.dataTransfer.effectAllowed = 'move';
  }

  function dragOver(e) {
      e.preventDefault(); // Necessário para permitir o drop
  }

  function drop(e) {
      e.stopPropagation(); // Para evitar que o evento continue
      if (dragged !== this) {
          // Troca de posição
          const parent = this.parentNode;
          parent.insertBefore(dragged, this.nextSibling || this);
      }
  }

  function dragEnter(e) {
      this.classList.add('over');
  }

  function dragLeave(e) {
      this.classList.remove('over');
  }
});
