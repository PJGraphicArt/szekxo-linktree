/* ============================================
   SZEKXO - JavaScript Navigation
   ============================================ */

/**
 * Initialise les icônes Lucide et configure la navigation
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les icônes Lucide
    lucide.createIcons();

    // Initialiser la navigation par onglets
    initTabNavigation();

    // Initialiser le fond animé avec particules
    initParticles();
});

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
   ANIMATION PARTICULES - Fond animé discret
   ============================================ */

/**
 * Initialise l'animation des particules sur le canvas
 */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    // Configuration des particules
    const config = {
        particleCount: 35,          // Nombre de particules (léger)
        minSize: 1,                 // Taille minimum
        maxSize: 3,                 // Taille maximum
        minSpeed: 0.2,              // Vitesse minimum
        maxSpeed: 0.6,              // Vitesse maximum
        color: 'rgba(139, 92, 246', // Couleur violette (accent)
        minOpacity: 0.1,            // Opacité minimum
        maxOpacity: 0.4,            // Opacité maximum
        linkDistance: 120,          // Distance pour les lignes de connexion
        linkOpacity: 0.08           // Opacité des lignes
    };

    // Redimensionner le canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Créer une particule
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * (config.maxSize - config.minSize) + config.minSize,
            speedX: (Math.random() - 0.5) * config.maxSpeed,
            speedY: (Math.random() - 0.5) * config.maxSpeed,
            opacity: Math.random() * (config.maxOpacity - config.minOpacity) + config.minOpacity
        };
    }

    // Initialiser les particules
    function initParticlesArray() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(createParticle());
        }
    }

    // Dessiner une particule
    function drawParticle(particle) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${config.color}, ${particle.opacity})`;
        ctx.fill();
    }

    // Dessiner les connexions entre particules proches
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.linkDistance) {
                    const opacity = (1 - distance / config.linkDistance) * config.linkOpacity;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `${config.color}, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    // Mettre à jour la position des particules
    function updateParticles() {
        particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Rebondir sur les bords
            if (particle.x < 0 || particle.x > canvas.width) {
                particle.speedX *= -1;
            }
            if (particle.y < 0 || particle.y > canvas.height) {
                particle.speedY *= -1;
            }

            // S'assurer que la particule reste dans les limites
            particle.x = Math.max(0, Math.min(canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        });
    }

    // Boucle d'animation
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawConnections();
        particles.forEach(drawParticle);
        updateParticles();

        animationId = requestAnimationFrame(animate);
    }

    // Initialisation
    resizeCanvas();
    initParticlesArray();
    animate();

    // Redimensionner le canvas quand la fenêtre change de taille
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticlesArray();
    });

    // Réduire les animations quand la page n'est pas visible (économie de ressources)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}
