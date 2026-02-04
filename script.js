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
            { pseudo: 'JohnDoe', prize: 50, concept: '1V1 Viewers' },        // Montant en €
            { pseudo: 'Player123', prize: '200 FS', concept: 'Duel Szekxo' }, // Freespins
            { pseudo: 'LuckyGirl', prize: 20, concept: 'Stream' },
            { pseudo: 'GamerPro', prize: '100 FS', concept: '1V1 Viewers' },
            { pseudo: 'CryptoKing', prize: 10, concept: 'Stream' }
        ]
    },

    // ========== Slide 3 : Offre Free Spins ==========
    freeSpins: {
        heroTitle: "FREESPINS",                 // Titre affiché sur le hero banner
        backgroundImage: "images/FREESPINS_FOND.webp", // Image de fond du hero

        // Infos de l'offre
        gameTitle: "DORK UNIT",                 // Nom du jeu/slot
        offerTitle: "Crazy Thursday",           // Titre de l'offre
        casino: "CrazyBet",                     // Nom du casino
        link: "https://www.crazybet.com/fr?r=szekxo",                              // Lien vers l'offre

        // Paliers de bonus (dépôt => freespins)
        tiers: [
            { deposit: 50, spins: 40, value: 0.20 },
            { deposit: 200, spins: 250, value: 0.20 },
            { deposit: 350, spins: 350, value: 0.20 },
            { deposit: 500, spins: 500, value: 0.20 }
        ],

        // Limites et validité
        maxSpins: 500,                          // Maximum de freespins
        validityStart: "22-01 00h00",           // Début de validité
        validityEnd: "23h59 UTC",               // Fin de validité
        limitText: "1 fois/compte - 1 dépôt max" // Texte de limite
    },

    // ========== Section Compétitions ==========
    competitions: {
        oneVsOne: {
            title: '1V1 Viewers',
            titleSvg: 'images/LOGO_BATTLE_1VS1.png',
            winners: [
                { name: 'GamerPro123', prize: '50€', rank: '1er' },
                { name: 'Player456', prize: '200 FS', rank: '2ème' }
            ],
            videoThumbnail: 'images/1v1_thumbnail.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=7w_TKFjtMB8',
            participateUrl: 'https://discord.gg/ZbuXYqB2eM'
        },
        duelSzekxo: {
            title: 'Duel Szekxo',
            titleSvg: 'images/LOGO_BATTLE_DUEL.png',
            winners: [
                { name: 'LuckyPlayer99', prize: '50€', rank: '1er' }
            ],
            videoThumbnail: 'images/duel_thumbnail.jpg',
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

    // ========== Slide 3 : Offre Free Spins ==========
    const spins = CONFIG.freeSpins;

    // Hero Banner - Image de fond et titre
    const spinsHero = document.getElementById('spins-hero');
    if (spinsHero && spins.backgroundImage) {
        spinsHero.style.backgroundImage = `url('${spins.backgroundImage}')`;
        spinsHero.style.backgroundSize = 'cover';
        spinsHero.style.backgroundPosition = 'center center';
        spinsHero.style.backgroundRepeat = 'no-repeat';
    }
    const spinsHeroTitle = document.getElementById('spins-hero-title');
    if (spinsHeroTitle) spinsHeroTitle.textContent = spins.heroTitle;

    // Titre du jeu
    const offerGameTitle = document.getElementById('offer-game-title');
    if (offerGameTitle) offerGameTitle.textContent = spins.gameTitle;

    // Badge de l'offre
    const offerBadge = document.getElementById('offer-badge');
    if (offerBadge) offerBadge.textContent = spins.offerTitle;

    // Paliers de bonus
    const offerTiers = document.getElementById('offer-tiers');
    if (offerTiers && spins.tiers) {
        offerTiers.innerHTML = spins.tiers.map(tier => `
            <div class="tier-row">
                <span class="tier-deposit">Dépôt <strong>${tier.deposit}€</strong></span>
                <span class="tier-reward">
                    <span class="tier-spins">${tier.spins} FS</span>
                    <span class="tier-value">${tier.value.toFixed(2)}€</span>
                </span>
            </div>
        `).join('');
    }

    // Limite
    const offerLimit = document.getElementById('offer-limit');
    if (offerLimit) {
        offerLimit.innerHTML = `
            <span>Max ${spins.maxSpins} freespins</span>
            <span class="offer-validity">${spins.limitText}</span>
        `;
    }

    // CTA
    const offerCta = document.getElementById('offer-cta');
    if (offerCta && spins.link) {
        offerCta.href = spins.link;
    }

    // ========== Section Compétitions ==========
    const competitions = CONFIG.competitions;
    let activeComp = 'oneVsOne'; // Par défaut

    // Fonction pour afficher une compétition
    function showCompetition(compType) {
        const comp = competitions[compType];

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
