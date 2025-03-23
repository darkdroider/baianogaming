// ==UserScript==
// @name         Baiano Gaming
// @namespace    https://github.com/darkdroider
// @version      5.2
// @description  Facilitar os bagulho
// @author       Baiano Gaming
// @match        https://giveaway.su/*
// @match        https://steamcommunity.com/openid/login*
// @match        https://giveaway.su/giveaway/view/*
// @match        https://discord.com/oauth2/authorize*
// @match        https://discord.com/invite/*
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

    function clickRefreshButtons() {
        let rows = document.querySelectorAll('#actions tbody tr');
        let maxClicks = 12;
        let index = 0;

        function clickNextButton() {
            if (index < maxClicks && index < rows.length) {
                let button = rows[index].querySelector('button.btn.btn-xs.btn-default');
                let icon = button ? button.querySelector('i.glyphicon.glyphicon-refresh') : null;

                if (button && icon && button.closest('tr[data-action-id]')) {
                    console.log(`Clicando no botão de refresh na linha ${index}`);
                    button.click();
                } else {
                    console.log(`Ignorando elemento não relacionado na linha ${index}`);
                }

                index++;
                setTimeout(clickNextButton, Math.random() * (550 - 300) + 300);
            } else {
                console.log("Todos os botões de refresh foram clicados ou atingimos o limite de 12.");
            }
        }

        clickNextButton();
    }

    // Automação para autorizar no Discord
    if (window.location.hostname === "discord.com" && window.location.pathname.includes("/oauth2/authorize")) {
        function authorizeDiscord() {
            let clickCount = 0;
            function clickButton() {
                let authorizeButton = document.querySelector('button.button__201d5.lookFilled__201d5.colorBrand__201d5.sizeMedium__201d5.grow__201d5');
                if (authorizeButton) {
                    console.log(`Clicando no botão Autorizar no Discord (${clickCount + 1})`);
                    authorizeButton.click();
                    clickCount++;
                    if (clickCount < 5) { // Clica 5 vezes no total
                        setTimeout(clickButton, 1000);
                    }
                } else {
                    console.log("Botão Autorizar não encontrado. Recarregando...");
                    setTimeout(() => {
                        location.reload();
                    }, 7000);
                }
            }
            setTimeout(clickButton, 5000);
        }

        authorizeDiscord();
    }

    // Automação para aceitar convites do Discord
    if (window.location.hostname === "discord.com" && window.location.pathname.includes("/invite/")) {
        function acceptInvite() {
            setTimeout(() => {
                let acceptButton = document.querySelector('button.marginTop40_fd297e.button__921c5.button__201d5.lookFilled__201d5.colorBrand__201d5.sizeLarge__201d5.fullWidth__201d5.grow__201d5');
                if (acceptButton) {
                    console.log("Clicando no botão Aceitar convite");
                    acceptButton.click();
                    setTimeout(() => {
                        if (document.contains(acceptButton)) {
                            console.log("Botão ainda presente. Recarregando em 7s...");
                            setTimeout(() => {
                                location.reload();
                            }, 7000);
                        } else {
                            console.log("Convite aceito. Função encerrada.");
                        }
                    }, 3000);
                }
            }, 2000);
        }

        acceptInvite();
    }
})();
