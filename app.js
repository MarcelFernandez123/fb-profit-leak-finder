// State
let currentSection = 1;
const totalSections = 6;

// Section configuration with max points and names
// Total: 181 points across 6 sections (47 checkpoints)
const sections = {
    1: { name: 'Account Architecture', icon: '🏗️', maxPoints: 23 },
    2: { name: 'Audience Targeting', icon: '🎯', maxPoints: 46 },
    3: { name: 'Creative Performance', icon: '🎨', maxPoints: 28 },
    4: { name: 'Conversion Setup', icon: '🔄', maxPoints: 33 },
    5: { name: 'Bidding & Budget', icon: '💰', maxPoints: 28 },
    6: { name: 'Advanced Optimization', icon: '⚡', maxPoints: 23 }
};

// Priority fixes data - what to fix if not checked
const priorityFixes = {
    'q1_1': {
        section: 1,
        title: 'Increase Campaign Budget',
        description: 'Your daily budget is too low. Aim for at least $50/day to give Facebook enough data to optimize.',
        points: 3
    },
    'q1_2': {
        section: 1,
        title: 'Eliminate Audience Competition',
        description: 'Your campaigns are bidding against each other. Consolidate or exclude audiences to stop wasting money.',
        points: 3
    },
    'q2_1': {
        section: 2,
        title: 'Fix Audience Overlap',
        description: 'Your audiences overlap by more than 25%. This causes you to compete against yourself and inflate CPMs.',
        points: 5
    },
    'q2_4': {
        section: 2,
        title: 'Exclude Past Purchasers',
        description: 'You\'re spending money showing ads to people who already bought. Exclude them from prospecting campaigns.',
        points: 4
    },
    'q2_8': {
        section: 2,
        title: 'Use 1% Lookalikes',
        description: 'Using broader lookalikes (5-10%) dilutes quality. Start with 1% for highest-intent audiences.',
        points: 4
    },
    'q2_9': {
        section: 2,
        title: 'Base Lookalikes on Purchasers',
        description: 'Page visitors don\'t convert. Build lookalikes from actual purchasers for better targeting.',
        points: 4
    },
    'q2_11': {
        section: 2,
        title: 'Separate Warm Traffic Campaigns',
        description: 'Retargeting needs different messaging and budgets. Create dedicated campaigns for warm audiences.',
        points: 4
    },
    'q3_1': {
        section: 3,
        title: 'Use Video or Carousel for Cold Traffic',
        description: 'Static images underperform for cold audiences. Test video or carousel formats for better engagement.',
        points: 4
    },
    'q3_2': {
        section: 3,
        title: 'Test Different Hooks',
        description: 'The first 3 seconds determine if people watch. Test multiple hooks to find what captures attention.',
        points: 4
    },
    'q3_7': {
        section: 3,
        title: 'Let Winners Run Longer',
        description: 'You\'re killing ads too soon. Let winning ads run 14+ days before refreshing or replacing.',
        points: 4
    },
    'q3_8': {
        section: 3,
        title: 'Control Ad Frequency',
        description: 'Your frequency is too high (3.5+). Audiences are seeing ads too often, causing fatigue and wasted spend.',
        points: 4
    },
    'q4_1': {
        section: 4,
        title: 'Fix Your Pixel',
        description: 'Your Facebook Pixel isn\'t firing correctly. This breaks all tracking and optimization.',
        points: 5
    },
    'q4_2': {
        section: 4,
        title: 'Track Purchase Events',
        description: 'Optimizing for Add to Cart instead of Purchase brings low-quality traffic. Change your conversion event.',
        points: 5
    },
    'q4_3': {
        section: 4,
        title: 'Implement Conversions API',
        description: 'With iOS 14+ changes, pixel-only tracking misses data. Add Conversions API for accurate tracking.',
        points: 4
    },
    'q4_4': {
        section: 4,
        title: 'Get 50 Conversions/Week',
        description: 'Ad sets need 50 conversions/week to exit learning. Consolidate or increase budget.',
        points: 4
    },
    'q5_4': {
        section: 5,
        title: 'Stop Rapid Budget Changes',
        description: 'Increasing budget more than 20%/day resets learning phase. Make gradual changes.',
        points: 4
    },
    'q5_7': {
        section: 5,
        title: 'Don\'t Touch Learning Phase',
        description: 'Editing ad sets during learning resets the algorithm. Wait for 50 conversions first.',
        points: 4
    },
    'q5_8': {
        section: 5,
        title: 'Exit Learning Phase',
        description: 'Your ad sets aren\'t getting 50 conversions/week. Consolidate ad sets or increase budgets.',
        points: 4
    },
    'q6_1': {
        section: 6,
        title: 'Review Placement Performance',
        description: 'Some placements waste money. Review breakdowns monthly and cut underperformers.',
        points: 4
    },
    'q6_2': {
        section: 6,
        title: 'Remove Bad Placements',
        description: 'Placements with 2x+ your target CPA are losing money. Remove them immediately.',
        points: 4
    },
    'q6_4': {
        section: 6,
        title: 'Pause Zero-Conversion Ads',
        description: 'Ads with $50+ spend and 0 conversions won\'t suddenly start working. Pause and test new creatives.',
        points: 4
    },
    'q6_5': {
        section: 6,
        title: 'Refresh Creatives',
        description: 'Ads get stale after 4-6 weeks. Plan regular creative refreshes to maintain performance.',
        points: 4
    },
    'q6_6': {
        section: 6,
        title: 'Exclude Converted Users',
        description: 'You\'re retargeting people who already converted. Exclude them to stop wasting budget.',
        points: 4
    }
};

// Score tiers (scaled for 181 max points)
// Elite: 93%+, Strong: 71-92%, Average: 50-70%, Struggling: 29-49%, Crisis: 0-28%
const tiers = [
    { min: 168, name: 'Elite', class: 'elite', description: 'Top 5% of advertisers! Your account is highly optimized.', waste: null, wasteClass: 'good' },
    { min: 129, name: 'Strong', class: 'strong', description: 'Good foundation with minor optimizations needed.', waste: 'Minor inefficiencies', wasteClass: 'good' },
    { min: 90, name: 'Average', class: 'average', description: 'Several profit leaks identified.', waste: 'Estimated waste: $500-1,500/month', wasteClass: 'warning' },
    { min: 52, name: 'Struggling', class: 'struggling', description: 'Significant optimization opportunities exist.', waste: 'Estimated waste: $1,500-3,500/month', wasteClass: 'danger' },
    { min: 0, name: 'Crisis', class: 'crisis', description: 'Critical issues requiring immediate attention.', waste: 'Estimated waste: $3,000-6,000+/month', wasteClass: 'danger' }
];

const MAX_SCORE = 181;

// Navigation functions
function startAudit() {
    showScreen('audit-form');
    updateProgress();
}

function goToHero() {
    showScreen('hero');
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextSection() {
    if (currentSection < totalSections) {
        document.querySelector(`.form-section[data-section="${currentSection}"]`).classList.remove('active');
        currentSection++;
        document.querySelector(`.form-section[data-section="${currentSection}"]`).classList.add('active');
        updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function prevSection() {
    if (currentSection > 1) {
        document.querySelector(`.form-section[data-section="${currentSection}"]`).classList.remove('active');
        currentSection--;
        document.querySelector(`.form-section[data-section="${currentSection}"]`).classList.add('active');
        updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updateProgress() {
    const progressPercent = (currentSection / totalSections) * 100;
    document.getElementById('progress-fill').style.width = `${progressPercent}%`;
    document.getElementById('progress-text').textContent = `Section ${currentSection} of ${totalSections}: ${sections[currentSection].name}`;
}

function showEmailCapture() {
    showScreen('email-capture');
}

// Email submission
function submitEmail(e) {
    e.preventDefault();

    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;

    // Store in localStorage
    const submission = {
        name,
        email,
        timestamp: new Date().toISOString(),
        answers: collectAnswers()
    };

    // Get existing submissions or create new array
    const submissions = JSON.parse(localStorage.getItem('profitLeakSubmissions') || '[]');
    submissions.push(submission);
    localStorage.setItem('profitLeakSubmissions', JSON.stringify(submissions));

    // Show results
    showResults(name);
}

// Collect all checkbox answers
function collectAnswers() {
    const answers = {};
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        answers[cb.name] = cb.checked;
    });
    return answers;
}

// Calculate scores
function calculateScores() {
    const sectionScores = {};
    let totalScore = 0;

    // Initialize section scores
    for (let i = 1; i <= 6; i++) {
        sectionScores[i] = 0;
    }

    // Calculate scores from checkboxes
    document.querySelectorAll('.form-section').forEach(section => {
        const sectionNum = parseInt(section.dataset.section);
        section.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
            const points = parseInt(cb.closest('.checkbox-item').dataset.points);
            sectionScores[sectionNum] += points;
            totalScore += points;
        });
    });

    return { sectionScores, totalScore };
}

// Get unchecked high-value items for priority fixes
function getTopFixes() {
    const unchecked = [];

    document.querySelectorAll('input[type="checkbox"]:not(:checked)').forEach(cb => {
        const name = cb.name;
        if (priorityFixes[name]) {
            unchecked.push({
                ...priorityFixes[name],
                name
            });
        }
    });

    // Sort by points (highest first) and return top 3
    unchecked.sort((a, b) => b.points - a.points);
    return unchecked.slice(0, 3);
}

// Get tier based on score
function getTier(score) {
    return tiers.find(t => score >= t.min);
}

// Show results
function showResults(userName) {
    const { sectionScores, totalScore } = calculateScores();
    const tier = getTier(totalScore);
    const topFixes = getTopFixes();

    showScreen('results');

    // Set user name
    document.getElementById('results-name').textContent = `Results for ${userName}`;

    // Animate score
    const scoreNumber = document.getElementById('score-number');
    const scoreRing = document.getElementById('score-ring');

    // Calculate ring progress (circumference = 2 * PI * 54 = ~339.292)
    const circumference = 339.292;
    const progress = (totalScore / MAX_SCORE) * circumference;

    // Set ring color based on tier
    let ringColor = '#22c55e'; // green
    if (tier.class === 'average') ringColor = '#f59e0b'; // yellow
    if (tier.class === 'struggling') ringColor = '#f97316'; // orange
    if (tier.class === 'crisis') ringColor = '#ef4444'; // red

    scoreRing.style.stroke = ringColor;

    // Animate score number
    let current = 0;
    const duration = 1500;
    const increment = totalScore / (duration / 16);

    const animateScore = () => {
        current += increment;
        if (current < totalScore) {
            scoreNumber.textContent = Math.round(current);
            requestAnimationFrame(animateScore);
        } else {
            scoreNumber.textContent = totalScore;
        }
    };

    // Animate ring
    setTimeout(() => {
        scoreRing.style.strokeDashoffset = circumference - progress;
    }, 100);

    requestAnimationFrame(animateScore);

    // Set tier badge
    const tierBadge = document.getElementById('tier-badge');
    tierBadge.textContent = tier.name;
    tierBadge.className = `tier-badge ${tier.class}`;

    // Set tier description
    document.getElementById('tier-description').textContent = tier.description;

    // Set waste estimate
    const wasteEl = document.getElementById('waste-estimate');
    if (tier.waste) {
        wasteEl.textContent = tier.waste;
        wasteEl.className = `waste-estimate ${tier.wasteClass}`;
    } else {
        wasteEl.textContent = 'Minimal waste detected';
        wasteEl.className = 'waste-estimate good';
    }

    // Render section breakdown
    const breakdownList = document.getElementById('breakdown-list');
    breakdownList.innerHTML = '';

    for (let i = 1; i <= 6; i++) {
        const section = sections[i];
        const score = sectionScores[i];
        const percentage = (score / section.maxPoints) * 100;

        let fillClass = 'good';
        if (percentage < 70) fillClass = 'warning';
        if (percentage < 50) fillClass = 'danger';

        const item = document.createElement('div');
        item.className = 'breakdown-item';
        item.innerHTML = `
            <span class="breakdown-icon">${section.icon}</span>
            <div class="breakdown-info">
                <div class="breakdown-name">${section.name}</div>
                <div class="breakdown-bar">
                    <div class="breakdown-fill ${fillClass}" style="width: 0%"></div>
                </div>
            </div>
            <span class="breakdown-score">${score}/${section.maxPoints}</span>
        `;
        breakdownList.appendChild(item);

        // Animate bar fill
        setTimeout(() => {
            item.querySelector('.breakdown-fill').style.width = `${percentage}%`;
        }, 200 + (i * 100));
    }

    // Render priority fixes
    const fixesList = document.getElementById('fixes-list');
    fixesList.innerHTML = '';

    if (topFixes.length === 0) {
        fixesList.innerHTML = `
            <div class="fix-item" style="background: var(--success-bg); border-color: rgba(34, 197, 94, 0.3);">
                <div class="fix-number" style="background: var(--success);">✓</div>
                <div class="fix-content">
                    <h4>Amazing! No Critical Issues Found</h4>
                    <p>Your account is well-optimized. Focus on scaling what's working.</p>
                </div>
            </div>
        `;
    } else {
        topFixes.forEach((fix, index) => {
            const item = document.createElement('div');
            item.className = 'fix-item';
            item.innerHTML = `
                <div class="fix-number">${index + 1}</div>
                <div class="fix-content">
                    <h4>${fix.title}</h4>
                    <p>${fix.description}</p>
                </div>
            `;
            fixesList.appendChild(item);
        });
    }
}

// Restart audit
function restartAudit() {
    // Reset all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });

    // Reset form fields
    document.getElementById('user-name').value = '';
    document.getElementById('user-email').value = '';

    // Reset section
    document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
    document.querySelector('.form-section[data-section="1"]').classList.add('active');
    currentSection = 1;

    // Go to hero
    showScreen('hero');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add click effect to checkboxes
    document.querySelectorAll('.checkbox-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT') {
                const checkbox = item.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
            }
        });
    });
});
