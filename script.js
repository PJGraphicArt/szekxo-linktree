/* ============================================
   SZEKXO - JavaScript Navigation
   ============================================ */

/* ============================================
   CONFIGURATION - Modifier les valeurs ici
   ============================================ */

const CONFIG = {
    // ========== Paramètres du Carousel (en haut pour accès rapide) ==========
    carousel: {
        autoplayDelay: 3,                     // Délai entre slides en secondes
        swipeThreshold: 50                      // Distance min pour swipe en px
    },

    // ========== Slide 1 : Wager Race ==========
    wagerRace: {
        heroTitle: "WAGER RACE",                  // Titre affiché sur le hero banner
        backgroundImage: "images/WAGER_RACE_FOND_V2.webp", // Image de fond du hero
        totalPrizePool: 1000,                   // Cagnotte totale en €


        // Deadline de la course (jour et mois)
        endDay: 28,                             // Jour de fin
        endMonth: 2,                            // Mois de fin (1 = janvier)

        // Classement TOP 3
        players: {
            first: "Alex***",                   // Pseudo 1ère place
            second: "Max***",                   // Pseudo 2ème place
            third: "Tom***"                     // Pseudo 3ème place
        },
        prizes: {
            first: 2500,                        // Gain 1ère place en €
            second: 1500,                       // Gain 2ème place en €
            third: 1000                         // Gain 3ème place en €
        },
        wagers: {
            first: 15420,                       // Montant misé 1ère place en €
            second: 12890,                      // Montant misé 2ème place en €
            third: 9650                         // Montant misé 3ème place en €
        },
        link: "https://www.crazybet.com/fr?r=szekxo"                               // Lien vers la page de participation
    },

    // ========== Slide 2 : Tirage Hebdomadaire ==========
    weeklyDraw: {
        heroTitle: "GIVEAWAYS",         // Titre affiché sur le hero banner
        backgroundImage: "images/GIVEAWAY_FOND.webp", // Image de fond du hero (placeholder gradient si absent)
        prize: 200,                             // Gain à remporter en €
        drawDay: 5,                             // Jour du tirage (5 = vendredi)
        drawHour: 20,                            // Heure du tirage (20h00)

        // Derniers gagnants
        winnersToShow: 3,                       // Nombre de gagnants à afficher
        recentWinners: [
            { pseudo: 'PJ Graphic Art', prize: 50, concept: '1V1 Viewers' },        // Montant en €
            { pseudo: 'Ryzoww', prize: '200 FS', concept: '1V1 Viewers' }, // Freespins
            { pseudo: 'Nestyym', prize: '200 FS', concept: 'Stream' },
            { pseudo: 'Pseudo 4', prize: '100 FS', concept: '1V1 Viewers' },
            { pseudo: 'Pseudo 5', prize: 10, concept: 'Stream' }
        ]
    },

    // ========== Section Compétitions ==========
    competitions: {
        oneVsOne: {
            title: '1V1 Viewers',
            titleSvg: 'images/LOGO_BATTLE_1VS1.png',
            winners: [
                { name: 'PJ Graphic Art', prize: '50€', rank: '1er' },
                { name: 'Ryzoww', prize: '200 FS', rank: '2ème' }
            ],
            videoThumbnail: 'images/Minia_1VS1-VIEWERS_15-02-26.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=d4ook55NqkE',
            participateUrl: 'https://discord.gg/ZbuXYqB2eM'
        },
        duelSzekxo: {
            title: 'Duel Szekxo',
            titleSvg: 'images/LOGO_BATTLE_DUEL.png',
            winners: [
                { name: 'Pseudo', prize: '50€', rank: '1er' }
            ],
            videoThumbnail: '',
            videoUrl: 'https://youtube.com/watch?v=yyyyy',
            participateUrl: 'https://discord.gg/ZbuXYqB2eM'
        }
    },

    // ========== Section VPN ==========
    vpn: {
        // VPN Gratuit Mobile
        freeMobile: {
            badge: 'GRATUIT',
            badgeColor: '#00ff88',
            title: 'VPN Mobile Gratuit',
            service: 'VPN Super',
            logo: 'images/vpn super-logo.png',
            description: 'Données illimitées • Sécurisé',
            platforms: 'iOS & Android',
            features: [],
            links: {
                ios: 'https://apps.apple.com/fr/app/vpn-super-unlimited-proxy/id1370293473',
                android: 'https://play.google.com/store/apps/details?id=com.free.vpn.super.hotspot.open&pcampaignid=web_share'
            }
        },

        // VPN Gratuit Desktop
        freeDesktop: {
            badge: 'GRATUIT',
            badgeColor: '#00ff88',
            title: 'VPN Gratuit PC',
            service: 'Urban VPN',
            logo: 'images/urban-vpn-logo.png',
            description: 'Extension Chrome • Activation en 1 clic • Illimité',
            platforms: 'Chrome / Edge / Brave',
            features: [
                'Installation en 1 clic',
                'Activation instantanée',
                'Utilisation illimitée'
            ],
            link: 'https://chromewebstore.google.com/detail/urban-vpn-proxy/eppiocemhmnlbhjplcgkofciiegomcon'
        },

        // VPN Premium
        premium: {
            badge: 'RECOMMANDÉ',
            badgeColor: '#ffa500',
            title: 'VPN Premium',
            service: 'NordVPN',
            logo: 'images/nordvpn.jpg',
            description: 'Plan Basique • Le meilleur VPN • Ultra rapide',
            platforms: 'Tous appareils',
            features: [
                'VPN sécurisé et ultra rapide',
                'Protection Anti-menaces',
                '10 appareils protégés simultanément',
                'Surveillance Dark Web™ : surveillez jusqu\'à 5 e-mails pour détecter d\'éventuelles fuites de données'
            ],
            price: '3,39€/mois',
            discount: '-70%',
            link: 'https://refer-nordvpn.com/tauDbDWDXTT'
        }
    },

    // ========== YouTube ==========
    youtube: {
        channelHandle: '@Szekxo_v2',                // Handle de la chaîne
        channelId: 'UCJbL17o_uOGA-8smFScYamw',     // ID de la chaîne (nécessaire pour RSS)
        videosToShow: 6                             // Nombre de vidéos à afficher
    }
};

/* ============================================
   INITIALISATION
   ============================================ */

/**
 * Initialise les icônes Lucide et configure la navigation
 */
document.addEventListener('DOMContentLoaded', () => {
    // Forcer la lecture de la vidéo de fond (iOS/Safari fix)
    const bgVideo = document.querySelector('.video-background video');
    if (bgVideo) {
        bgVideo.play().catch(() => {
            // En cas d'échec, réessayer au premier geste de l'utilisateur
            document.addEventListener('touchstart', () => {
                bgVideo.play().catch(() => {});
            }, { once: true });
        });
    }

    // Injecter les données du carousel depuis CONFIG
    injectCarouselData();

    // Injecter les données VPN
    injectVPNData();

    // Initialiser les icônes Lucide
    lucide.createIcons();

    // Initialiser la navigation par onglets
    initTabNavigation();

    // Initialiser le carousel
    initCarousel();

    // Mettre à jour l'année du footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

/* ============================================
   INJECTION DES DONNÉES - Carousel
   ============================================ */

/**
 * Formate un nombre avec des espaces comme séparateurs de milliers
 * @param {number} num - Le nombre à formater
 * @returns {string} Le nombre formaté
 */
function formatNumber(num) {
    return num.toLocaleString('fr-FR');
}

/**
 * Injecte les données de CONFIG dans les éléments du carousel
 */
function injectCarouselData() {
    // ========== Slide 1 : Wager Race ==========
    const wager = CONFIG.wagerRace;

    // Hero Banner - Image de fond et titre
    const wagerHero = document.getElementById('wager-hero');
    if (wagerHero) {
        wagerHero.style.setProperty('--wager-bg-image', `url('${wager.backgroundImage}')`);
    }
    const wagerHeroTitle = document.getElementById('wager-hero-title');
    if (wagerHeroTitle) wagerHeroTitle.textContent = wager.heroTitle;

    // Cagnotte sous le titre (h3)
    const wagerPrize = document.getElementById('wager-prize');
    if (wagerPrize) {
        wagerPrize.innerHTML = `<span class="prize-amount">${formatNumber(wager.totalPrizePool)}€</span> à gagner`;
    }

    // Deadline au-dessus du classement
    const wagerDeadline = document.getElementById('wager-deadline');
    if (wagerDeadline) {
        const monthNames = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin',
                           'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        const monthName = monthNames[wager.endMonth - 1];
        wagerDeadline.textContent = `Jusqu'au ${wager.endDay} ${monthName}`;
    }

    // Leaderboard TOP 3
    const leaderboard = document.getElementById('wager-leaderboard');
    if (leaderboard) {
        leaderboard.innerHTML = `
            <div class="leaderboard-item gold">
                <span class="rank">1</span>
                <span class="player">${wager.players.first}</span>
                <span class="wager-amount">${formatNumber(wager.wagers.first)}€</span>
                <span class="amount">${formatNumber(wager.prizes.first)}€</span>
            </div>
            <div class="leaderboard-item silver">
                <span class="rank">2</span>
                <span class="player">${wager.players.second}</span>
                <span class="wager-amount">${formatNumber(wager.wagers.second)}€</span>
                <span class="amount">${formatNumber(wager.prizes.second)}€</span>
            </div>
            <div class="leaderboard-item bronze">
                <span class="rank">3</span>
                <span class="player">${wager.players.third}</span>
                <span class="wager-amount">${formatNumber(wager.wagers.third)}€</span>
                <span class="amount">${formatNumber(wager.prizes.third)}€</span>
            </div>
        `;
    }

    // Bouton Participer
    const wagerCta = document.getElementById('wager-cta');
    if (wagerCta && wager.link) {
        wagerCta.href = wager.link;
    }

    // ========== Slide 2 : Tirage Hebdomadaire ==========
    const draw = CONFIG.weeklyDraw;

    // Hero Banner - Image de fond et titre
    const drawHero = document.getElementById('draw-hero');
    if (drawHero && draw.backgroundImage) {
        drawHero.style.backgroundImage = `url('${draw.backgroundImage}')`;
        drawHero.style.backgroundSize = 'cover';
        drawHero.style.backgroundPosition = 'center center';
        drawHero.style.backgroundRepeat = 'no-repeat';
    }
    const drawHeroTitle = document.getElementById('draw-hero-title');
    if (drawHeroTitle) drawHeroTitle.textContent = draw.heroTitle;

    // Montant total à gagner (mis en avant)
    const giveawayAmount = document.getElementById('giveaway-amount-value');
    if (giveawayAmount) {
        giveawayAmount.textContent = `${formatNumber(draw.prize)}€`;
    }

    // Description des giveaways
    const giveawayDescription = document.getElementById('giveaway-description');
    if (giveawayDescription) {
        giveawayDescription.innerHTML = `Répartis dans plusieurs concepts vidéos et pendant les streams !`;
    }

    // Derniers gagnants
    const winnersContainer = document.getElementById('recent-winners-list');
    if (winnersContainer && draw.recentWinners) {
        const winnersToDisplay = draw.recentWinners.slice(0, draw.winnersToShow || 3);
        winnersContainer.innerHTML = winnersToDisplay.map(winner => {
            // Formater le prix : si c'est un nombre, ajouter €, sinon afficher tel quel (ex: "200 FS")
            const prizeDisplay = typeof winner.prize === 'number' ? `${winner.prize}€` : winner.prize;
            return `
                <div class="winner-item">
                    <span class="winner-pseudo">${winner.pseudo}</span>
                    <span class="winner-amount">${prizeDisplay}</span>
                    <span class="winner-concept">${winner.concept}</span>
                </div>
            `;
        }).join('');
    }

    // ========== Section Compétitions ==========
    const competitions = CONFIG.competitions;
    let activeComp = 'oneVsOne'; // Par défaut

    // Fonction pour afficher une compétition
    function showCompetition(compType) {
        // Cas spécial pour "Autres" (vidéos YouTube)
        if (compType === 'autres') {
            showYouTubeVideos();
            return;
        }

        const comp = competitions[compType];
        const contentDiv = document.querySelector('.competition-content');

        // Restaurer la structure HTML si elle a été remplacée (retour depuis YouTube)
        if (!document.getElementById('comp-title-svg')) {
            contentDiv.innerHTML = `
                <!-- Titre SVG -->
                <img id="comp-title-svg" src="" alt="" class="comp-title-svg">

                <!-- Liste des gagnants (dynamique) -->
                <div id="comp-winners-list" class="winners-list">
                    <!-- Injecté par JavaScript -->
                </div>

                <!-- Miniature vidéo cliquable -->
                <a id="comp-video-link" href="#" target="_blank" class="video-thumbnail">
                    <img id="comp-video-thumb" src="" alt="Vidéo">
                </a>

                <!-- Bouton participer -->
                <a id="comp-participate" href="#" class="btn-participate">
                    <span>PARTICIPER</span>
                    <i data-lucide="arrow-right"></i>
                </a>
            `;

            // Réinitialiser les icônes Lucide
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }

        // Titre SVG
        const titleSvg = document.getElementById('comp-title-svg');
        if (titleSvg) {
            titleSvg.src = comp.titleSvg;
            titleSvg.alt = comp.title;
            // Ajouter classe spécifique pour Duel Szekxo
            if (compType === 'duelSzekxo') {
                titleSvg.classList.add('comp-title-duel');
            } else {
                titleSvg.classList.remove('comp-title-duel');
            }
        }

        // Liste des gagnants
        const winnersList = document.getElementById('comp-winners-list');
        if (winnersList && comp.winners) {
            winnersList.innerHTML = comp.winners.map(winner => {
                const prizeClass = winner.prize.includes('€') ? 'winner-prize-euro' : 'winner-prize-fs';
                const trophy = winner.rank === '1er' ? '🏆 ' : '';
                return `
                    <div class="winner-item">
                        <div class="winner-info">
                            <span class="winner-rank">${trophy}${winner.rank}</span>
                            <span class="winner-name">${winner.name}</span>
                        </div>
                        <span class="winner-prize ${prizeClass}">${winner.prize}</span>
                    </div>
                `;
            }).join('');
        }

        // Miniature vidéo
        const videoThumb = document.getElementById('comp-video-thumb');
        if (videoThumb) {
            videoThumb.src = comp.videoThumbnail;
            videoThumb.alt = `Vidéo ${comp.title}`;
        }

        // Lien vidéo
        const videoLink = document.getElementById('comp-video-link');
        if (videoLink) videoLink.href = comp.videoUrl;

        // Bouton participer
        const participateBtn = document.getElementById('comp-participate');
        if (participateBtn) participateBtn.href = comp.participateUrl;

        activeComp = compType;
    }

    // Fonction pour afficher les vidéos YouTube
    async function showYouTubeVideos() {
        const contentDiv = document.querySelector('.competition-content');
        if (!contentDiv) return;

        // Afficher un loader pendant le chargement
        contentDiv.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <p style="color: var(--text-secondary);">Chargement des vidéos...</p>
            </div>
        `;

        try {
            // Récupérer les vidéos via RSS2JSON
            const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CONFIG.youtube.channelId}`;
            const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.status === 'ok' && data.items) {
                // Filtrer les Shorts (ne garder que les vidéos normales)
                const normalVideos = data.items.filter(item => !item.link.includes('/shorts/'));
                const videos = normalVideos.slice(0, CONFIG.youtube.videosToShow);

                // Créer le HTML pour les vidéos
                contentDiv.innerHTML = `
                    <div class="youtube-videos-grid">
                        ${videos.map(video => {
                            // Extraire l'ID de la vidéo depuis le lien (nettoyer les paramètres)
                            const videoId = video.link.split('v=')[1]?.split('&')[0];
                            const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

                            // Formater la date
                            const publishDate = new Date(video.pubDate);
                            const formattedDate = publishDate.toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            });

                            return `
                                <a href="${video.link}" target="_blank" rel="noopener noreferrer" class="youtube-video-card">
                                    <div class="youtube-thumbnail">
                                        <img src="${thumbnail}" alt="${video.title}">
                                        <div class="youtube-play-overlay">
                                            <i data-lucide="play-circle"></i>
                                        </div>
                                    </div>
                                    <div class="youtube-video-info">
                                        <h3 class="youtube-video-title">${video.title}</h3>
                                        <p class="youtube-video-date">${formattedDate}</p>
                                    </div>
                                </a>
                            `;
                        }).join('')}
                    </div>
                `;

                // Réinitialiser les icônes Lucide
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            } else {
                throw new Error('Erreur lors de la récupération des vidéos');
            }
        } catch (error) {
            console.error('Erreur YouTube:', error);
            contentDiv.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <p style="color: var(--text-secondary);">Impossible de charger les vidéos pour le moment.</p>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 8px;">
                        <a href="https://www.youtube.com/${CONFIG.youtube.channelHandle}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-purple);">
                            Visitez la chaîne YouTube
                        </a>
                    </p>
                </div>
            `;
        }
    }

    // Initialiser avec 1V1
    showCompetition('oneVsOne');

    // Gestion des onglets
    const compTabs = document.querySelectorAll('.comp-tab');
    compTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const compType = tab.getAttribute('data-comp');

            // Changer onglet actif
            compTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Afficher contenu
            showCompetition(compType);

            // Réinitialiser icônes
            lucide.createIcons();
        });
    });
}

/**
 * Injecte les données VPN depuis CONFIG
 */
function injectVPNData() {
    const vpnSection = CONFIG.vpn;
    const container = document.querySelector('#tab-vpn .cards-container');

    if (!container) return;

    // Générer les 3 cartes
    const cards = [
        generateVPNCard(vpnSection.freeMobile, 'mobile'),
        generateVPNCard(vpnSection.freeDesktop, 'desktop'),
        generateVPNCard(vpnSection.premium, 'premium')
    ];

    container.innerHTML = cards.join('');

    // Réinitialiser les icônes Lucide
    lucide.createIcons();
}

/**
 * Génère le HTML d'une carte VPN
 */
function generateVPNCard(vpn, type) {
    const isFree = type === 'mobile' || type === 'desktop';
    const isMobile = type === 'mobile';
    const isPremium = type === 'premium';

    // Badge HTML
    const badgeHTML = `<div class="vpn-badge ${isFree ? 'free' : 'premium'}" style="background: ${vpn.badgeColor}">${vpn.badge}</div>`;

    // Features list (générer seulement si features non vides)
    const featuresHTML = vpn.features && vpn.features.length > 0 ? `
        <div class="vpn-features">
            ${vpn.features.map(f => `<span><i data-lucide="check" class="vpn-feature-icon"></i> ${f}</span>`).join('')}
        </div>
    ` : '';

    // CTA Buttons
    let ctaHTML = '';
    if (isMobile) {
        // Double boutons pour iOS et Android
        ctaHTML = `
            <div class="vpn-cta-dual">
                <a href="${vpn.links.ios}" class="vpn-btn" target="_blank" rel="noopener noreferrer">
                    <i data-lucide="smartphone"></i>
                    <span>iOS</span>
                </a>
                <a href="${vpn.links.android}" class="vpn-btn" target="_blank" rel="noopener noreferrer">
                    <i data-lucide="smartphone"></i>
                    <span>Android</span>
                </a>
            </div>
        `;
    } else {
        // Bouton simple
        const btnText = type === 'desktop' ? 'AJOUTER À CHROME' : 'PROFITER DE L\'OFFRE';
        ctaHTML = `
            <div class="vpn-cta ${isPremium ? 'vpn-cta-premium' : ''}">
                <span>${btnText}</span>
                <i data-lucide="${isPremium ? 'external-link' : 'download'}"></i>
            </div>
        `;
    }

    // Price/Discount pour premium
    const priceHTML = isPremium ? `
        <div class="vpn-price-container">
            <span class="vpn-discount">Économisez ${vpn.discount}</span>
            <span class="vpn-price">${vpn.price}</span>
        </div>
        ${vpn.priceDetails ? `<p class="vpn-price-details">${vpn.priceDetails}</p>` : ''}
        ${vpn.taxNote ? `<p class="vpn-tax-note">${vpn.taxNote}</p>` : ''}
    ` : '';

    // Classes de visibilité responsive
    let visibilityClass = '';
    if (type === 'mobile') {
        visibilityClass = 'vpn-mobile-only'; // Visible seulement sur mobile
    } else if (type === 'desktop') {
        visibilityClass = 'vpn-desktop-only'; // Visible seulement sur desktop
    }
    // Premium est toujours visible (pas de classe)

    // Pour mobile : utiliser div car contient déjà 2 liens (iOS/Android)
    // Pour desktop et premium : utiliser a car toute la carte est cliquable
    const cardTag = isMobile ? 'div' : 'a';
    const cardAttrs = isMobile ? '' : `href="${vpn.link}" target="_blank" rel="noopener noreferrer"`;

    return `
        <${cardTag} ${cardAttrs} class="vpn-card ${isFree ? 'vpn-free' : 'vpn-premium'} ${visibilityClass}">
            ${badgeHTML}
            ${isPremium ? '<div class="vpn-glow"></div>' : ''}
            <div class="vpn-logo">
                <img src="${vpn.logo}" alt="${vpn.service}">
            </div>
            <div class="vpn-content">
                <h3>${vpn.title}</h3>
                <p class="vpn-service">${vpn.service}</p>
                <p class="vpn-description">${vpn.description}</p>
                ${featuresHTML}
                ${priceHTML}
            </div>
            ${ctaHTML}
        </${cardTag}>
    `;
}

/**
 * Gestion de la navigation par onglets
 * - Écoute les clics sur les boutons de navigation
 * - Change l'onglet actif et le contenu visible
 * - Gère les styles de l'onglet actif
 */
function initTabNavigation() {
    // Sélectionner tous les boutons d'onglet
    const tabButtons = document.querySelectorAll('.tab-btn');

    // Ajouter un écouteur de clic à chaque bouton
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Récupérer l'identifiant de l'onglet cible
            const targetTab = button.getAttribute('data-tab');

            // Changer l'onglet actif
            switchTab(targetTab);
        });
    });
}

/**
 * Change l'onglet actif
 * @param {string} tabId - L'identifiant de l'onglet à activer
 */
function switchTab(tabId) {
    // ===== Gestion des boutons de navigation =====
    const tabButtons = document.querySelectorAll('.tab-btn');

    // Retirer la classe 'active' de tous les boutons
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Ajouter la classe 'active' au bouton correspondant
    const activeButton = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // ===== Gestion du contenu des onglets =====
    const tabContents = document.querySelectorAll('.tab-content');

    // Masquer tous les contenus
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // Afficher le contenu de l'onglet sélectionné
    const activeContent = document.getElementById(`tab-${tabId}`);
    if (activeContent) {
        activeContent.classList.add('active');
    }

    // Réinitialiser les icônes Lucide pour le nouveau contenu
    lucide.createIcons();
}

/**
 * Fonction utilitaire pour changer d'onglet programmatiquement
 * Peut être utilisée depuis la console ou d'autres scripts
 * @param {string} tabName - Nom de l'onglet ('reseaux', 'casino', 'vpn')
 */
function goToTab(tabName) {
    const validTabs = ['reseaux', 'casino', 'vpn'];

    if (validTabs.includes(tabName)) {
        switchTab(tabName);
    } else {
        console.warn(`Onglet invalide: ${tabName}. Utilisez: ${validTabs.join(', ')}`);
    }
}

// Exposer la fonction goToTab globalement pour un usage externe
window.goToTab = goToTab;

/* ============================================
   CONNEXION DISCORD — État de connexion
   ============================================ */

async function checkLoginState() {
    try {
        const res = await fetch('/api/user/me');
        const btn = document.getElementById('nav-user-btn');
        if (!btn) return;
        if (res.ok) {
            const data = await res.json();
            const avatarUrl = data.user.avatar
                ? `https://cdn.discordapp.com/avatars/${data.user.discordId}/${data.user.avatar}.png?size=64`
                : 'https://cdn.discordapp.com/embed/avatars/0.png';
            btn.innerHTML = `<a href="/dashboard.html" class="nav-user-logged">
                <img src="${avatarUrl}" alt="avatar" class="nav-avatar">
                <span>${data.user.username}</span>
            </a>`;
        } else {
            btn.innerHTML = `<a href="/api/auth/discord/login" class="btn-discord-login">
                <svg class="discord-logo-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 655.42 476.91" fill="#fff"><path fill-rule="evenodd" d="M646.48,302.66c-2.53-15.35-5.07-30.7-7.6-46.05-11.13-44.57-21.65-86.88-37.55-125.62-8.17-19.89-16.11-38.81-26.38-56.33-2.98-5.22-5.96-10.43-8.94-15.65-7.9-5.07-15.79-10.13-23.69-15.2C513.7,25.99,462.14-.07,417.58,0c-2.53,4.62-5.07,9.24-7.6,13.86l18.78,5.36c12.37,4.32,24.74,8.64,37.11,12.96,31.77,13.09,63.05,33.32,84.94,56.78-26.52-13.23-53.3-26-82.26-37.11-57.97-22.24-154.47-30.24-226.66-14.75-53.21,11.41-94.26,31.63-137.25,51.86,24.2-27.19,70.73-53.35,109.98-65.72,9.3-2.93,19.62-7.45,30.4-8.49L238.31,0h-3.58c-4.32.59-8.64,1.19-12.96,1.79-9.54,2.09-19.08,4.17-28.61,6.26-34.53,10.58-80.29,29.46-103.72,50.97-2.98,5.22-5.96,10.43-8.94,15.65-10.28,17.52-18.18,36.44-26.38,56.33-16.68,40.47-28.42,85.13-38.89,132.33-2.98,19.52-5.96,39.05-8.94,58.57C2.53,341.75-.28,365.23.02,387.16c29.22,42.09,120.65,91.08,194.03,89.41,7.9-10.73,15.8-21.46,23.69-32.19-5.07-1.94-10.14-3.88-15.2-5.81-10.43-4.92-20.86-9.84-31.29-14.75-30.2-17.61-60.61-38.64-81.37-65.72,17.21,9.97,33.58,22.32,51.41,32.64,34.78,20.13,77.44,29.14,123.84,37.55,14.55,2.64,29.02.78,44.71,3.13,18.19,2.72,47.26,1.46,64.38-1.34,24.09-3.95,47.36-5.73,68.85-12.07,33.17-9.79,63.45-21.88,90.31-38,10.73-7.3,21.46-14.61,32.19-21.91-23.64,31.81-84,74.81-127.86,85.84,7.9,10.58,15.8,21.16,23.69,31.74,2.85,2.55,12.89.43,16.99,0,14.44-1.51,29.08-4.34,41.58-8.05,42.02-12.46,74.74-27.25,105.06-50.52,11.27-8.65,19.59-20.6,30.4-29.51-.06-29.05-3.8-58.99-8.94-84.94ZM234.73,327.7c-37.38,6.08-64.73-41.3-53.65-78.24,5.32-17.7,17.3-32.09,33.98-38.45l14.75-2.68c69.16,3.77,69.97,108.79,4.92,119.37ZM428.31,327.7c-37.11,6.04-64.45-41.31-53.65-77.79,5.17-17.46,16.83-32.06,33.08-38.45,5.22-1.04,10.43-2.09,15.65-3.13,69.34,3.78,70.2,108.75,4.92,119.37Z"/></svg>
                <span>Connexion avec Discord</span>
            </a>`;
        }
    } catch {}
}
checkLoginState();

/* ============================================
   CAROUSEL - Promotions automatique
   ============================================ */

/**
 * Initialise le carousel avec autoplay et swipe
 */
function initCarousel() {
    const carousel = document.querySelector('.promo-carousel');
    if (!carousel) return;

    const slidesContainer = carousel.querySelector('.carousel-slides');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicators = carousel.querySelectorAll('.indicator');

    // Cloner le premier slide et l'ajouter à la fin pour l'effet infini
    const firstSlideClone = slides[0].cloneNode(true);
    slidesContainer.appendChild(firstSlideClone);

    let currentSlide = 0;
    let autoplayInterval;
    let touchStartX = 0;
    let touchEndX = 0;
    const totalRealSlides = slides.length;

    // Utiliser les paramètres de CONFIG
    const carouselConfig = CONFIG.carousel;

    // Fonction pour changer de slide
    function goToSlide(index, instant = false) {
        currentSlide = index;

        // Appliquer ou retirer la transition
        if (instant) {
            slidesContainer.style.transition = 'none';
        } else {
            slidesContainer.style.transition = 'transform 0.5s ease-in-out';
        }

        // Déplacer le container des slides
        slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

        // Mettre à jour les classes active (seulement pour les vraies slides)
        const realIndex = currentSlide % totalRealSlides;
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === realIndex);
        });

        // Mettre à jour les indicateurs
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === realIndex);
        });

        // Si on est sur le clone, revenir au vrai premier slide instantanément
        if (currentSlide === totalRealSlides) {
            setTimeout(() => {
                goToSlide(0, true);
            }, 500); // Attendre la fin de la transition
        }
    }

    // Slide suivant
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    // Slide précédent
    function prevSlide() {
        if (currentSlide <= 0) {
            goToSlide(totalRealSlides - 1);
        } else {
            goToSlide(currentSlide - 1);
        }
    }

    // Démarrer l'autoplay
    function startAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(nextSlide, carouselConfig.autoplayDelay * 1000);
    }

    // Arrêter l'autoplay
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }

    // Événements pour les indicateurs
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            startAutoplay(); // Redémarrer l'autoplay après clic
        });
    });

    // Boutons de navigation (flèches)
    const prevButton = document.getElementById('carousel-prev');
    const nextButton = document.getElementById('carousel-next');

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            prevSlide();
            startAutoplay(); // Redémarrer l'autoplay après clic
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            nextSlide();
            startAutoplay(); // Redémarrer l'autoplay après clic
        });
    }

    // Événements touch pour swipe
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoplay();
    }, { passive: true });

    // Gérer le swipe
    function handleSwipe() {
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > carouselConfig.swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe vers la gauche -> slide suivant
            } else {
                prevSlide(); // Swipe vers la droite -> slide précédent
            }
        }
    }

    // Pause autoplay au survol (desktop)
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // Pause autoplay quand la page n'est pas visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });

    // Démarrer l'autoplay
    startAutoplay();
}

/* ============================================
   COUNTDOWN - Tirage hebdomadaire
   ============================================ */

/**
 * Initialise le countdown vers le prochain tirage
 * Utilise CONFIG.weeklyDraw pour le jour et l'heure
 */
function initCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;

    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');

    // Récupérer la config du tirage
    const drawConfig = CONFIG.weeklyDraw;

    // Calculer le prochain jour de tirage
    function getNextDrawDate() {
        const now = new Date();
        const target = new Date();

        // Définir le jour cible depuis CONFIG
        const currentDay = now.getDay();
        let daysUntilDraw = (drawConfig.drawDay - currentDay + 7) % 7;

        // Si on est le jour du tirage et que l'heure est passée, aller à la semaine suivante
        if (daysUntilDraw === 0 && now.getHours() >= drawConfig.drawHour) {
            daysUntilDraw = 7;
        }

        target.setDate(now.getDate() + daysUntilDraw);
        target.setHours(drawConfig.drawHour, 0, 0, 0);

        return target;
    }

    let targetDate = getNextDrawDate();

    // Mettre à jour le countdown
    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;

        // Si le countdown est terminé, calculer le prochain tirage
        if (diff <= 0) {
            targetDate = getNextDrawDate();
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Mettre à jour l'affichage
        daysEl.textContent = days;
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
    }

    // Mettre à jour immédiatement puis toutes les secondes
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/* ============================================
   MENU HAMBURGER
   ============================================ */

/**
 * Initialise le menu hamburger avec ouverture/fermeture
 */
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav-link');

    // Ouvrir le menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.add('active');
            hamburger.classList.add('active');
            document.body.style.overflow = 'hidden'; // Empêcher le scroll
        });
    }

    // Fermer le menu avec le bouton close
    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = ''; // Réactiver le scroll
        });
    }

    // Fermer le menu au clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Fermer le menu en cliquant en dehors du contenu
    navMenu.addEventListener('click', (e) => {
        if (e.target === navMenu) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Fermer le menu avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});
