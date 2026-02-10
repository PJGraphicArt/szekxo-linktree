(function () {
    /**
     * Parse les pseudos entrés dans la zone de texte.
     * Sépare par retour à la ligne, virgule ou point-virgule.
     */
    function parseParticipants(rawValue) {
        return rawValue
            .split(/[\n,;]+/)
            .map(name => name.trim())
            .filter(name => name.length > 0);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const textarea = document.getElementById('participants-input');
        const excludeToggle = document.getElementById('exclude-winners-toggle');
        const resetWinnersBtn = document.getElementById('reset-winners-btn');
        const drawBtn = document.getElementById('draw-btn');
        const sliderWindow = document.getElementById('slider-window');
        const sliderTrack = document.getElementById('slider-track');
        const currentWinnerNameEl = document.getElementById('current-winner-name');
        const winnersListEl = document.getElementById('winners-list');
        const winnersCountEl = document.getElementById('winners-count');

        if (!textarea || !excludeToggle || !resetWinnersBtn || !drawBtn || !sliderWindow || !sliderTrack) {
            return;
        }

        let previousWinners = [];
        let isAnimating = false;

        function updateWinnersUI() {
            winnersListEl.innerHTML = '';

            if (previousWinners.length === 0) {
                const p = document.createElement('p');
                p.className = 'winners-placeholder';
                p.textContent = 'Aucun gagnant pour le moment.';
                winnersListEl.appendChild(p);
            } else {
                previousWinners.forEach(name => {
                    const chip = document.createElement('span');
                    chip.className = 'winner-chip';
                    chip.textContent = name;
                    winnersListEl.appendChild(chip);
                });
            }

            winnersCountEl.textContent = previousWinners.length.toString();
        }

        function buildDisplayList(candidates, winner) {
            const list = [];
            const cycles = 24;

            for (let i = 0; i < cycles; i++) {
                const randomName = candidates[Math.floor(Math.random() * candidates.length)];
                list.push(randomName);
            }

            // Ajouter le gagnant, puis un pseudo supplémentaire juste après
            // pour donner l'impression qu'il reste encore du monde.
            list.push(winner);

            const trailingPool = candidates.length > 1
                ? candidates.filter(name => name !== winner)
                : candidates;
            const trailingName = trailingPool[Math.floor(Math.random() * trailingPool.length)];
            list.push(trailingName);

            return list;
        }

        function animateSlider(candidates, winner) {
            const displayList = buildDisplayList(candidates, winner);

            sliderTrack.innerHTML = '';
            displayList.forEach(name => {
                const item = document.createElement('div');
                item.className = 'slider-item';
                item.textContent = name;
                sliderTrack.appendChild(item);
            });

            const items = sliderTrack.querySelectorAll('.slider-item');
            if (!items.length) return;

            sliderTrack.style.transition = 'none';
            sliderTrack.style.transform = 'translateY(0px)';

            requestAnimationFrame(() => {
                const itemHeight = items[0].getBoundingClientRect().height || 40;
                const windowHeight = sliderWindow.getBoundingClientRect().height || 120;
                const centerOffset = (windowHeight - itemHeight) / 2;
                // Le gagnant est l'avant-dernier élément (le dernier est "le pseudo d'après")
                const winnerIndex = displayList.length - 2;
                const target = -(winnerIndex * itemHeight - centerOffset);

                sliderTrack.style.transition = 'transform 2.6s cubic-bezier(0.16, 1, 0.3, 1)';
                sliderTrack.style.transform = `translateY(${target}px)`;
            });
        }

        function pickRandomWinner() {
            if (isAnimating) return;

            const allParticipants = parseParticipants(textarea.value);
            if (allParticipants.length === 0) {
                alert('Ajoute au moins un pseudo avant de lancer le tirage.');
                return;
            }

            let available = allParticipants;
            if (excludeToggle.checked) {
                available = allParticipants.filter(name => !previousWinners.includes(name));
            }

            if (available.length === 0) {
                alert('Tous les pseudos ont déjà gagné avec l’option d’exclusion activée.');
                return;
            }

            const winner = available[Math.floor(Math.random() * available.length)];

            isAnimating = true;
            drawBtn.disabled = true;

            animateSlider(available, winner);

            setTimeout(() => {
                currentWinnerNameEl.textContent = winner;

                if (excludeToggle.checked && !previousWinners.includes(winner)) {
                    previousWinners.push(winner);
                    updateWinnersUI();
                }

                isAnimating = false;
                drawBtn.disabled = false;
            }, 2700);
        }

        function resetWinners() {
            previousWinners = [];
            updateWinnersUI();
        }

        updateWinnersUI();

        drawBtn.addEventListener('click', pickRandomWinner);
        resetWinnersBtn.addEventListener('click', resetWinners);
    });
})();

