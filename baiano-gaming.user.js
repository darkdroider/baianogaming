// ==UserScript==
// @name         Baiano Gaming
// @namespace    https://github.com/darkdroider
// @version      2.3
// @description  Facilitar os bagulho
// @author       Baiano Gaming
// @match        https://giveaway.su/*
// @match        https://steamcommunity.com/openid/login*
// @match        https://giveaway.su/giveaway/view/*
// @match        https://discord.com/oauth2/authorize*
// @grant        none
// @downloadURL  https://github.com/darkdroider/baianogaming/raw/main/baiano-gaming.user.js
// @updateURL    https://github.com/darkdroider/baianogaming/raw/main/baiano-gaming.user.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Baiano Gaming Script Iniciado");

    // Aguarda 3 segundos para garantir o carregamento da página
    setTimeout(() => {
        if (window.location.hostname === "giveaway.su") {
            let logoutButton = document.querySelector('a[href="/user/logout"]');

            // Se não estiver logado, clica para fazer login via Steam
            if (!logoutButton) {
                let steamLoginButton = document.querySelector('a[href="/steam/redirect"].steam-login');
                if (steamLoginButton) {
                    console.log("Clicando no botão de login via Steam");
                    steamLoginButton.click();
                }
            } else {
                console.log("Usuário já está logado");
                return; // Se já estiver logado, encerra o script
            }
        }
    }, 3000);

    // Aguarda 2 segundos na página de login da Steam e clica no botão de login
    if (window.location.hostname === "steamcommunity.com" && window.location.pathname.includes("/openid/login")) {
        setTimeout(() => {
            let steamLoginButton = document.querySelector('input#imageLogin.btn_green_white_innerfade');
            if (steamLoginButton) {
                console.log("Clicando no botão de login da Steam");
                steamLoginButton.click();
            }
        }, 2000);
    }

    // Automação para a página de giveaway
    if (window.location.pathname.includes("/giveaway/view/")) {
        setTimeout(() => {
            checkDiscordText();
            clickRefreshButtons();
        }, 2000);
    }

    // Função para verificar o texto "Please link Discord account" e atualizar a página se necessário
    function checkDiscordText() {
        let pageText = document.body.innerText || document.body.textContent;
        if (pageText.includes("Please link Discord account")) {
            console.log("Texto encontrado! Atualizando a página em 1s...");
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            console.log("Texto não encontrado. Parando as atualizações.");
        }
    }

    // Função para clicar apenas nos botões de refresh dentro dos action IDs
    function clickRefreshButtons() {
        let rows = document.querySelectorAll('#actions tbody tr'); // Seleciona todas as linhas da tabela de ações
        let maxClicks = 12;
        let index = 0;

        function clickNextButton() {
            if (index < maxClicks && index < rows.length) {
                let button = rows[index].querySelector('button.btn.btn-xs.btn-default'); // Seleciona o botão dentro da linha
                let icon = button ? button.querySelector('i.glyphicon.glyphicon-refresh') : null;

                if (button && icon && button.closest('tr[data-action-id]')) { // Garante que está dentro da tabela correta
                    console.log(`Clicando no botão de refresh na linha ${index}`);
                    button.click();
                } else {
                    console.log(`Ignorando elemento não relacionado na linha ${index}`);
                }

                index++;
                setTimeout(clickNextButton, Math.random() * (550 - 300) + 300); // Tempo aleatório entre 0.3s e 0.55s
            } else {
                console.log("Todos os botões de refresh foram clicados ou atingimos o limite de 12.");
            }
        }

        clickNextButton();
    }

    // Automação para autorizar no Discord
    if (window.location.hostname === "discord.com" && window.location.pathname.includes("/oauth2/authorize")) {
        function authorizeDiscord() {
            setTimeout(() => {
                let authorizeButton = document.querySelector('button.button__201d5.lookFilled__201d5.colorBrand__201d5.sizeMedium__201d5.grow__201d5');
                if (authorizeButton) {
                    console.log("Clicando no botão Autorizar no Discord");
                    authorizeButton.click();
                } else {
                    console.log("Botão Autorizar não encontrado. Recarregando...");
                    setTimeout(() => {
                        location.reload();
                    }, 5000); // Recarrega a cada 5s até encontrar o botão
                }
            }, 2000);
        }

        authorizeDiscord();
    }
})();
