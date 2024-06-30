document.addEventListener('DOMContentLoaded', function() {
    const cursor = document.querySelector('.cursor');
    const delay = 15; // Delay em milissegundos
    const fadeSpeed = 0.02; // Velocidade de desaparecimento do cursor

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let isMoving = false;
    let opacity = 1;
    let fadeOutTimer;

    function moveCursor(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;
        cursor.style.opacity = 1;

        // Limpar o temporizador de desaparecimento do cursor quando o cursor se move
        clearTimeout(fadeOutTimer);
    }

    document.addEventListener('mousemove', moveCursor);

    setInterval(function() {
        if (!isMoving) {
            opacity -= fadeSpeed;
            if (opacity < 0) opacity = 0;
            cursor.style.opacity = opacity;
        } else {
            opacity = 1;
            isMoving = false;
        }

        const dx = mouseX - currentX;
        const dy = mouseY - currentY;

        currentX += dx / 10;
        currentY += dy / 10;

        cursor.style.left = currentX + 'px';
        cursor.style.top = currentY + 'px';
    }, delay);

    // Configurar um temporizador para desaparecer o cursor após um período de inatividade
    function startFadeOutTimer() {
        fadeOutTimer = setTimeout(function() {
            isMoving = false;
        }, 1000); // Tempo de inatividade após o qual o cursor começa a desaparecer (1000ms = 1 segundo)
    }

    // Iniciar temporizador de desaparecimento do cursor quando a página é carregada
    startFadeOutTimer();

    // Reiniciar temporizador de desaparecimento do cursor sempre que o cursor se mover
    document.addEventListener('mousemove', startFadeOutTimer);
});


// Função para buscar informações do usuário do Discord
async function fetchDiscordUserData(token) {
    const response = await fetch('https://discord.com/api/users/@me', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Erro ao buscar informações do usuário');
    }

    return await response.json();
}

// Função para buscar informações do usuário do Discord pelo ID de usuário
async function fetchDiscordUserData(userId) {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);

    if (!response.ok) {
        throw new Error('Erro ao buscar informações do usuário');
    }

    return await response.json();
}



// Função para atualizar os dados do perfil de usuário na página
function updateProfile(userId, avatarId, displayNameId, usernameId, statusImgId) {
    fetchDiscordUserData(userId)
        .then((data) => {
            const userData = data.data.discord_user;
            const avatarImg = document.getElementById(avatarId);
            const displayNameElem = document.getElementById(displayNameId);
            const usernameElem = document.getElementById(usernameId);
            const statusImg = document.getElementById(statusImgId);
            const status = data.data.discord_status;

            avatarImg.src = userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : 'https://cdn.discordapp.com/embed/avatars/1.png';
            
            if (userData.global_name) {
                displayNameElem.textContent = userData.global_name;
            } else {
                displayNameElem.textContent = ' '; // Espaço em branco
                displayNameElem.style.visibility = 'hidden';
            }
            
            usernameElem.textContent = userData.username;

            switch (status) {
                case 'idle':
                    statusImg.src = '/images/ausente.png';
                    break;
                case 'dnd':
                    statusImg.src = '/images/naopertube.png';
                    break;
                case 'online':
                    statusImg.src = '/images/online.png';
                    break;
                case 'offline':
                    statusImg.src = '/images/offline.png';
                    break;
                default:
                    statusImg.src = 'caminho_para_a_imagem_default.png';
            }   
        })
        .catch((error) => {
            console.error('Erro ao buscar informações do usuário:', error);
        });
}

window.onload = function() {
    const profiles = [
        {
            userId: '936445919166103562',
            avatarId: 'avatar',
            displayNameId: 'display-name',
            usernameId: 'username',
            statusImgId: 'status-img'
        }
    ];

    profiles.forEach(profile => {
        updateProfile(profile.userId, profile.avatarId, profile.displayNameId, profile.usernameId, profile.statusImgId);
    });
};


