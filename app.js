// ===================================
// Facebook Ads Profit Leak Finder
// Premium JavaScript v2.0
// ===================================

// State
let currentSection = 1;
const totalSections = 6;
const MAX_SCORE = 181;
let unsureItems = new Set();
let resultsData = null;

// Section configuration with max points and names
const sections = {
    1: { name: 'Account Architecture', icon: '🏗️', maxPoints: 23 },
    2: { name: 'Audience Targeting', icon: '🎯', maxPoints: 46 },
    3: { name: 'Creative Performance', icon: '🎨', maxPoints: 28 },
    4: { name: 'Conversion Setup', icon: '🔄', maxPoints: 33 },
    5: { name: 'Bidding & Budget', icon: '💰', maxPoints: 28 },
    6: { name: 'Advanced Optimization', icon: '⚡', maxPoints: 23 }
};

// Tooltip explanations for help buttons
const tooltips = {
    budget50: {
        title: 'Why $50/day minimum?',
        content: 'Facebook needs sufficient data to optimize your campaigns. With less than $50/day, the algorithm doesn\'t get enough conversion signals to learn who your ideal customers are.',
        tip: 'If you can\'t afford $50/day, consolidate into fewer campaigns to concentrate your budget.'
    },
    audienceCompete: {
        title: 'Audience Competition',
        content: 'When multiple campaigns target the same audience, you\'re essentially bidding against yourself in the auction. This inflates your CPMs and wastes budget.',
        tip: 'Use audience exclusions or consolidate campaigns with overlapping audiences.'
    },
    objectives: {
        title: 'Campaign Objectives',
        content: 'Using the wrong objective (like Traffic when you want purchases) tells Facebook to optimize for the wrong action. This brings low-intent visitors.',
        tip: 'Always use Conversions objective with Purchase as the conversion event for e-commerce.'
    },
    advantagePlus: {
        title: 'Advantage+ Separation',
        content: 'Advantage+ Shopping campaigns use different optimization logic than manual campaigns. Running both together makes it hard to attribute results and can cause overlap.',
        tip: 'Keep Advantage+ and manual campaigns in separate testing structures.'
    },
    adSetCount: {
        title: 'Ad Set Count',
        content: 'Too many ad sets spread your budget thin. Each ad set needs enough budget to exit learning phase (50 conversions/week).',
        tip: 'Start with 3-5 ad sets and only add more when existing ones are profitable.'
    },
    audienceSize: {
        title: 'Optimal Audience Size',
        content: 'Audiences under 500K can get saturated quickly and have higher CPMs. Audiences over 5M are often too broad for effective targeting.',
        tip: 'Aim for 500K-2M for interest targeting, 1M-5M for lookalikes.'
    },
    cbo: {
        title: 'Campaign Budget Optimization',
        content: 'CBO automatically distributes budget to top-performing ad sets. This helps avoid wasting money on underperforming ad sets.',
        tip: 'Use CBO for most campaigns, but set minimum spend limits if needed.'
    },
    adSetSpend: {
        title: '$100 Minimum Spend',
        content: 'Making decisions on ad sets that haven\'t spent enough is like judging a movie by the first 5 minutes. You need statistical significance.',
        tip: 'Wait for at least 3x your CPA target before making optimization decisions.'
    },
    adCount: {
        title: 'Ads Per Ad Set',
        content: 'Too many ads (10+) dilute impressions and make it impossible to identify winners. Too few (1-2) limit testing opportunities.',
        tip: 'Run 3-5 ads per ad set for optimal testing and budget distribution.'
    },
    adRunTime: {
        title: 'Testing Period',
        content: 'Performance fluctuates daily due to auction dynamics, day of week effects, and algorithm learning. Quick decisions lead to killing potential winners.',
        tip: 'Let ads run 5-7 days minimum before making changes.'
    },
    overlap: {
        title: 'Audience Overlap',
        content: 'High overlap (25%+) means you\'re competing against yourself in the auction, driving up costs. Use Facebook\'s Audience Overlap tool to check.',
        tip: 'Exclude overlapping interests or consolidate similar audiences.'
    },
    engagedShoppers: {
        title: 'Engaged Shoppers Stacking',
        content: 'Adding "Engaged Shoppers" on top of interest targeting doesn\'t help - it just narrows your already-targeted audience unnecessarily.',
        tip: 'Use Engaged Shoppers alone OR interest targeting, not both together.'
    },
    separateAudiences: {
        title: 'Separate Audience Types',
        content: 'Combining lookalikes with interests in one ad set makes it impossible to know which is performing. You lose optimization clarity.',
        tip: 'Test lookalikes and interests in separate ad sets to identify what works.'
    },
    excludePurchasers: {
        title: 'Exclude Purchasers',
        content: 'Showing prospecting ads to people who already bought is wasted spend. They don\'t need to be convinced - they already purchased.',
        tip: 'Create a "Purchased 180 days" custom audience and exclude from all prospecting.'
    },
    targetingExpansion: {
        title: 'Targeting Expansion',
        content: 'When enabled, Facebook can show ads outside your targeting. This can help scale, but initially dilutes your data and makes testing unclear.',
        tip: 'Turn off for initial testing, enable later when scaling proven audiences.'
    },
    lowIntentCountries: {
        title: 'Low-Intent Countries',
        content: 'Including cheap traffic countries (India, Philippines, etc.) might look good on CTR but rarely converts. This wastes budget on clicks that don\'t buy.',
        tip: 'Stick to your core markets and only test new countries in separate campaigns.'
    },
    website180: {
        title: '180-Day Window',
        content: 'Retargeting users beyond 30-60 days has diminishing returns. After 180 days, they\'ve likely forgotten you or bought elsewhere.',
        tip: 'Focus retargeting budget on 7-30 day audiences for best results.'
    },
    retargetPurchasers: {
        title: 'Retarget Past Buyers',
        content: 'Your past customers are 60-70% more likely to buy again. They know your brand, trust you, and need less convincing.',
        tip: 'Create specific campaigns for past buyers with relevant upsells or new products.'
    },
    lookalike1: {
        title: '1% Lookalikes',
        content: 'A 1% lookalike is the closest match to your source audience (top 1% similar users). Larger percentages dilute quality significantly.',
        tip: 'Start with 1% for best quality, then test 2-3% for scale.'
    },
    lookalikeSource: {
        title: 'Lookalike Source Quality',
        content: 'Lookalikes from page visitors include tire-kickers. Lookalikes from purchasers find people similar to your actual buyers.',
        tip: 'Use Purchase event or customer list as source for best quality lookalikes.'
    },
    valueBased: {
        title: 'Value-Based Lookalikes',
        content: 'Standard lookalikes find similar people. Value-based lookalikes find similar HIGH-VALUE people, optimizing for revenue not just conversions.',
        tip: 'Upload customer list with purchase values to create value-based lookalikes.'
    },
    warmCampaigns: {
        title: 'Separate Warm Traffic',
        content: 'Warm audiences (website visitors, engagers) convert at different rates and need different messaging than cold audiences.',
        tip: 'Create dedicated retargeting campaigns with higher CPAs acceptable and urgency messaging.'
    },
    videoCarousel: {
        title: 'Video/Carousel for Cold',
        content: 'Cold audiences don\'t know you. Static images give them one chance to connect. Video and carousels tell a story and build trust.',
        tip: 'Test UGC-style video content - it consistently outperforms polished ads.'
    },
    hooks: {
        title: 'Testing Hooks',
        content: 'The first 3 seconds determine if someone watches your video. Testing different hooks (openings) is the highest-impact creative optimization.',
        tip: 'Create 3-5 versions of same ad with different hooks to find winners.'
    },
    aspect: {
        title: 'Aspect Ratio Testing',
        content: 'Different placements favor different sizes. 9:16 for Stories/Reels, 1:1 for Feed, 16:9 for in-stream. Wrong sizing = poor performance.',
        tip: 'Create platform-native content or use dynamic creative for auto-optimization.'
    },
    ugc: {
        title: 'UGC Content',
        content: 'User-generated content (or UGC-style) feels authentic and native to social feeds. It outperforms polished ads for most brands.',
        tip: 'Work with creators or film testimonials that feel real, not produced.'
    },
    adVariations: {
        title: 'Testing Variations',
        content: 'Testing different angles (price vs. quality vs. problem/solution) reveals what messaging resonates with your audience.',
        tip: 'Test 3-5 completely different concepts, not just minor copy tweaks.'
    },
    pausing: {
        title: 'Pausing Losers',
        content: 'Letting losing ads continue wastes budget. But pausing too fast kills potential winners. Balance is key.',
        tip: 'Pause after 2-3x CPA target spend with no conversions.'
    },
    winners: {
        title: 'Let Winners Run',
        content: 'Refreshing winning ads too soon restarts learning and may not improve performance. If it\'s working, don\'t touch it.',
        tip: 'Let winners run until frequency hits 3.5+ or performance declines 20%+.'
    },
    frequency: {
        title: 'Ad Frequency',
        content: 'High frequency (3.5+) means your audience sees ads too often. This causes ad fatigue, negative feedback, and wasted spend.',
        tip: 'Monitor frequency at ad set level. Refresh creative or expand audience when it rises.'
    },
    pixel: {
        title: 'Pixel Health',
        content: 'If your pixel isn\'t firing correctly, Facebook can\'t track conversions. This breaks all optimization and you\'re flying blind.',
        tip: 'Use Facebook Pixel Helper extension and Events Manager to verify firing.'
    },
    purchaseEvent: {
        title: 'Optimize for Purchase',
        content: 'Optimizing for Add to Cart or View Content brings people who browse but don\'t buy. Purchase optimization finds buyers.',
        tip: 'Always use Purchase as conversion event for e-commerce campaigns.'
    },
    capi: {
        title: 'Conversions API',
        content: 'With iOS 14+ privacy changes, pixel-only tracking misses 30-40% of conversions. CAPI sends server-side data directly to Facebook.',
        tip: 'Implement CAPI through your platform (Shopify, WooCommerce have easy integrations).'
    },
    conversionsWeek: {
        title: '50 Conversions/Week',
        content: 'Facebook\'s algorithm needs 50 conversions per ad set per week to exit learning phase. Without this, optimization is unstable.',
        tip: 'If you can\'t hit 50, consolidate ad sets or optimize for an earlier event.'
    },
    utmParams: {
        title: 'UTM Parameters',
        content: 'Without UTM tracking, you can\'t verify Facebook\'s reported data in Google Analytics. This creates attribution blind spots.',
        tip: 'Use dynamic UTMs: utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}'
    },
    attribution: {
        title: 'Attribution Windows',
        content: 'Your attribution window affects how conversions are counted. Longer windows show more conversions but may overattribute to Facebook.',
        tip: 'Use 7-day click for most campaigns; compare with 1-day for accuracy check.'
    },
    dataQuality: {
        title: 'Event Match Quality',
        content: 'Low Event Match Quality (under 6.0) means Facebook can\'t match events to users. This hurts optimization significantly.',
        tip: 'Add more customer parameters (email, phone) to improve match quality.'
    },
    costCap: {
        title: 'Cost Cap Bidding',
        content: 'Cost cap tells Facebook not to exceed a certain CPA. This helps control costs but may limit reach if set too low.',
        tip: 'Set cost cap at 1.2x your target CPA to balance volume and efficiency.'
    },
    lowestCost: {
        title: 'Bid Strategy Testing',
        content: 'Different bid strategies work for different situations. Lowest cost maximizes volume; bid/cost cap controls efficiency.',
        tip: 'Start with lowest cost, then test cost cap once you have baseline data.'
    },
    roasTarget: {
        title: 'ROAS Targets',
        content: 'Minimum ROAS bid strategy tells Facebook to optimize for return. But set it too high and you\'ll get no delivery.',
        tip: 'Set ROAS target slightly below your current average to maintain delivery.'
    },
    budgetChanges: {
        title: 'Gradual Budget Changes',
        content: 'Increasing budget more than 20% resets learning phase. Facebook needs time to recalibrate to new budget levels.',
        tip: 'Increase by 20% max, wait 3-4 days, then increase again.'
    },
    cboMinSpend: {
        title: 'CBO Minimum Spends',
        content: 'Without minimums, CBO might starve promising ad sets. Minimums ensure each ad set gets fair testing budget.',
        tip: 'Set minimum to ensure each ad set can exit learning phase.'
    },
    decisionLatency: {
        title: 'Decision Making Speed',
        content: 'Making changes during learning phase resets the algorithm. Patience during the first 50 conversions is critical.',
        tip: 'Wait 7 days or 50 conversions before making any changes.'
    },
    learningEdits: {
        title: 'Learning Phase Edits',
        content: 'Editing targeting, budget (20%+), creative, or optimization during learning restarts the counter. This wastes budget.',
        tip: 'Plan ahead and launch with confidence. No tweaking during learning.'
    },
    learningExit: {
        title: 'Exiting Learning Phase',
        content: 'Ad sets stuck in "Learning Limited" won\'t optimize well. They\'re not getting enough conversions to learn.',
        tip: 'Consolidate ad sets, increase budget, or change to higher-volume event.'
    },
    placements: {
        title: 'Placement Analysis',
        content: 'Not all placements perform equally. Some waste money (Audience Network often), others are gold (Feed, Stories).',
        tip: 'Review placement breakdown monthly and exclude underperformers.'
    },
    badPlacements: {
        title: 'Remove Bad Placements',
        content: 'Placements with 2x+ your average CPA are losing money. The algorithm sometimes allocates there anyway.',
        tip: 'Manually exclude placements that consistently underperform.'
    },
    breakdowns: {
        title: 'Demographic Breakdowns',
        content: 'Analyzing age, gender, and device breakdowns reveals who actually converts. You might be wasting money on wrong segments.',
        tip: 'Check breakdowns monthly and adjust targeting or create segment-specific campaigns.'
    },
    zeroConversion: {
        title: 'Zero Conversion Ads',
        content: 'Ads with significant spend ($50+) and zero conversions rarely turn around. The algorithm has enough data to know they don\'t work.',
        tip: 'Pause and redirect budget to new creative tests.'
    },
    creativeRefresh: {
        title: 'Creative Refresh Cycle',
        content: 'Even winning ads fatigue over time (4-6 weeks typically). Planning refresh cycles prevents performance drops.',
        tip: 'Have new creative ready before current winners fatigue. Maintain 2-week pipeline.'
    },
    excludeConverted: {
        title: 'Exclude Converted Users',
        content: 'Retargeting people who already converted wastes budget. They\'ve already taken the action you wanted.',
        tip: 'Exclude Purchasers 7-14 days from retargeting campaigns.'
    }
};

// Priority fixes data - what to fix if not checked
const priorityFixes = {
    'q1_1': { section: 1, title: 'Increase Campaign Budget', description: 'Your daily budget is too low. Aim for at least $50/day to give Facebook enough data to optimize.', points: 3 },
    'q1_2': { section: 1, title: 'Eliminate Audience Competition', description: 'Your campaigns are bidding against each other. Consolidate or exclude audiences to stop wasting money.', points: 3 },
    'q2_1': { section: 2, title: 'Fix Audience Overlap', description: 'Your audiences overlap by more than 25%. This causes you to compete against yourself and inflate CPMs.', points: 5 },
    'q2_4': { section: 2, title: 'Exclude Past Purchasers', description: 'You\'re spending money showing ads to people who already bought. Exclude them from prospecting campaigns.', points: 4 },
    'q2_8': { section: 2, title: 'Use 1% Lookalikes', description: 'Using broader lookalikes (5-10%) dilutes quality. Start with 1% for highest-intent audiences.', points: 4 },
    'q2_9': { section: 2, title: 'Base Lookalikes on Purchasers', description: 'Page visitors don\'t convert. Build lookalikes from actual purchasers for better targeting.', points: 4 },
    'q2_11': { section: 2, title: 'Separate Warm Traffic Campaigns', description: 'Retargeting needs different messaging and budgets. Create dedicated campaigns for warm audiences.', points: 4 },
    'q3_1': { section: 3, title: 'Use Video or Carousel for Cold Traffic', description: 'Static images underperform for cold audiences. Test video or carousel formats for better engagement.', points: 4 },
    'q3_2': { section: 3, title: 'Test Different Hooks', description: 'The first 3 seconds determine if people watch. Test multiple hooks to find what captures attention.', points: 4 },
    'q3_7': { section: 3, title: 'Let Winners Run Longer', description: 'You\'re killing ads too soon. Let winning ads run 14+ days before refreshing or replacing.', points: 4 },
    'q3_8': { section: 3, title: 'Control Ad Frequency', description: 'Your frequency is too high (3.5+). Audiences are seeing ads too often, causing fatigue and wasted spend.', points: 4 },
    'q4_1': { section: 4, title: 'Fix Your Pixel', description: 'Your Facebook Pixel isn\'t firing correctly. This breaks all tracking and optimization.', points: 5 },
    'q4_2': { section: 4, title: 'Track Purchase Events', description: 'Optimizing for Add to Cart instead of Purchase brings low-quality traffic. Change your conversion event.', points: 5 },
    'q4_3': { section: 4, title: 'Implement Conversions API', description: 'With iOS 14+ changes, pixel-only tracking misses data. Add Conversions API for accurate tracking.', points: 4 },
    'q4_4': { section: 4, title: 'Get 50 Conversions/Week', description: 'Ad sets need 50 conversions/week to exit learning. Consolidate or increase budget.', points: 4 },
    'q5_4': { section: 5, title: 'Stop Rapid Budget Changes', description: 'Increasing budget more than 20%/day resets learning phase. Make gradual changes.', points: 4 },
    'q5_7': { section: 5, title: 'Don\'t Touch Learning Phase', description: 'Editing ad sets during learning resets the algorithm. Wait for 50 conversions first.', points: 4 },
    'q5_8': { section: 5, title: 'Exit Learning Phase', description: 'Your ad sets aren\'t getting 50 conversions/week. Consolidate ad sets or increase budgets.', points: 4 },
    'q6_1': { section: 6, title: 'Review Placement Performance', description: 'Some placements waste money. Review breakdowns monthly and cut underperformers.', points: 4 },
    'q6_2': { section: 6, title: 'Remove Bad Placements', description: 'Placements with 2x+ your target CPA are losing money. Remove them immediately.', points: 4 },
    'q6_4': { section: 6, title: 'Pause Zero-Conversion Ads', description: 'Ads with $50+ spend and 0 conversions won\'t suddenly start working. Pause and test new creatives.', points: 4 },
    'q6_5': { section: 6, title: 'Refresh Creatives', description: 'Ads get stale after 4-6 weeks. Plan regular creative refreshes to maintain performance.', points: 4 },
    'q6_6': { section: 6, title: 'Exclude Converted Users', description: 'You\'re retargeting people who already converted. Exclude them to stop wasting budget.', points: 4 }
};

// Score tiers
const tiers = [
    { min: 168, name: 'Elite', class: 'elite', description: 'Top 5% of advertisers! Your account is highly optimized.', waste: null, wasteClass: 'good', percentile: 95 },
    { min: 129, name: 'Strong', class: 'strong', description: 'Good foundation with minor optimizations needed.', waste: 'Minor inefficiencies', wasteClass: 'good', percentile: 75 },
    { min: 90, name: 'Average', class: 'average', description: 'Several profit leaks identified.', waste: 'Estimated waste: $500-1,500/month', wasteClass: 'warning', percentile: 50 },
    { min: 52, name: 'Struggling', class: 'struggling', description: 'Significant optimization opportunities exist.', waste: 'Estimated waste: $1,500-3,500/month', wasteClass: 'danger', percentile: 25 },
    { min: 0, name: 'Crisis', class: 'crisis', description: 'Critical issues requiring immediate attention.', waste: 'Estimated waste: $3,000-6,000+/month', wasteClass: 'danger', percentile: 5 }
];

// ===================================
// SPLASH SCREEN & INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Check for saved progress
    const savedProgress = localStorage.getItem('profitLeakProgress');

    // Splash screen timing
    setTimeout(() => {
        document.getElementById('splash').classList.remove('active');
        document.getElementById('hero').classList.add('active');

        // If there's saved progress, show restore option
        if (savedProgress) {
            showToast('You have saved progress. Click Save button to restore.', 'success');
        }
    }, 3000);

    // Initialize checkbox listeners
    initCheckboxListeners();
});

function initCheckboxListeners() {
    document.querySelectorAll('.checkbox-item input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', function() {
            const item = this.closest('.checkbox-item');
            if (this.checked) {
                item.classList.add('checked');
                item.classList.remove('unsure');
                unsureItems.delete(this.name);
            } else {
                item.classList.remove('checked');
            }
            updateSectionScore(this);
        });
    });
}

// ===================================
// NAVIGATION FUNCTIONS
// ===================================

function startAudit() {
    showScreen('audit-form');
    updateProgress();
}

function goToHero() {
    showScreen('hero');
}

function goBack() {
    if (currentSection > 1) {
        prevSection();
    } else {
        showScreen('hero');
    }
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
    } else {
        showEmailCapture();
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
    document.getElementById('progress-text').textContent = `Section ${currentSection} of ${totalSections}`;
    document.getElementById('progress-percent').textContent = `${Math.round(progressPercent)}%`;
}

function updateSectionScore(checkbox) {
    const section = checkbox.closest('.form-section');
    const sectionNum = parseInt(section.dataset.section);
    let score = 0;

    section.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
        const points = parseInt(cb.closest('.checkbox-item').dataset.points);
        score += points;
    });

    const scoreEl = section.querySelector('.current-score');
    if (scoreEl) {
        scoreEl.textContent = score;
    }
}

function showEmailCapture() {
    showScreen('email-capture');
}

// ===================================
// TOOLTIP SYSTEM
// ===================================

function showTooltip(event, tooltipKey) {
    event.preventDefault();
    event.stopPropagation();

    const tooltip = tooltips[tooltipKey];
    if (!tooltip) return;

    const overlay = document.getElementById('tooltip-overlay');
    const titleEl = document.getElementById('tooltip-title');
    const bodyEl = document.getElementById('tooltip-body');

    titleEl.textContent = tooltip.title;

    let bodyHTML = `<p>${tooltip.content}</p>`;
    if (tooltip.tip) {
        bodyHTML += `
            <div class="tooltip-tip">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                <p><strong>Pro Tip:</strong> ${tooltip.tip}</p>
            </div>
        `;
    }
    bodyEl.innerHTML = bodyHTML;

    overlay.classList.add('active');
}

function closeTooltip() {
    document.getElementById('tooltip-overlay').classList.remove('active');
}

// ===================================
// UNSURE / NOT SURE SYSTEM
// ===================================

function markUnsure(questionName) {
    const checkbox = document.querySelector(`input[name="${questionName}"]`);
    const item = checkbox.closest('.checkbox-item');

    if (item.classList.contains('unsure')) {
        // Remove unsure status
        item.classList.remove('unsure');
        unsureItems.delete(questionName);
    } else {
        // Add unsure status
        item.classList.add('unsure');
        item.classList.remove('checked');
        checkbox.checked = false;
        unsureItems.add(questionName);
    }

    updateSectionScore(checkbox);
}

// ===================================
// PROGRESS SAVING
// ===================================

function saveProgress() {
    const answers = collectAnswers();
    const progress = {
        currentSection,
        answers,
        unsureItems: Array.from(unsureItems),
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('profitLeakProgress', JSON.stringify(progress));
    showToast('Progress saved! You can continue later.', 'success');
}

function restoreProgress() {
    const saved = localStorage.getItem('profitLeakProgress');
    if (!saved) {
        showToast('No saved progress found.', 'error');
        return;
    }

    const progress = JSON.parse(saved);

    // Restore answers
    Object.entries(progress.answers).forEach(([name, checked]) => {
        const checkbox = document.querySelector(`input[name="${name}"]`);
        if (checkbox) {
            checkbox.checked = checked;
            if (checked) {
                checkbox.closest('.checkbox-item').classList.add('checked');
            }
        }
    });

    // Restore unsure items
    progress.unsureItems.forEach(name => {
        const checkbox = document.querySelector(`input[name="${name}"]`);
        if (checkbox) {
            checkbox.closest('.checkbox-item').classList.add('unsure');
            unsureItems.add(name);
        }
    });

    // Restore section
    document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
    currentSection = progress.currentSection;
    document.querySelector(`.form-section[data-section="${currentSection}"]`).classList.add('active');
    updateProgress();

    // Update all section scores
    document.querySelectorAll('.form-section').forEach(section => {
        const firstCb = section.querySelector('input[type="checkbox"]');
        if (firstCb) updateSectionScore(firstCb);
    });

    showToast('Progress restored!', 'success');
}

// ===================================
// EMAIL & SUBMISSION
// ===================================

function submitEmail(e) {
    e.preventDefault();

    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const adSpend = document.getElementById('ad-spend').value;

    // Store submission
    const submission = {
        name,
        email,
        adSpend,
        timestamp: new Date().toISOString(),
        answers: collectAnswers(),
        unsureItems: Array.from(unsureItems)
    };

    const submissions = JSON.parse(localStorage.getItem('profitLeakSubmissions') || '[]');
    submissions.push(submission);
    localStorage.setItem('profitLeakSubmissions', JSON.stringify(submissions));

    // Clear saved progress
    localStorage.removeItem('profitLeakProgress');

    // Show results
    showResults(name);
}

function collectAnswers() {
    const answers = {};
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        answers[cb.name] = cb.checked;
    });
    return answers;
}

// ===================================
// SCORING & RESULTS
// ===================================

function calculateScores() {
    const sectionScores = {};
    let totalScore = 0;

    for (let i = 1; i <= 6; i++) {
        sectionScores[i] = 0;
    }

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

function getTopFixes() {
    const unchecked = [];

    document.querySelectorAll('input[type="checkbox"]:not(:checked)').forEach(cb => {
        const name = cb.name;
        if (priorityFixes[name] && !unsureItems.has(name)) {
            unchecked.push({ ...priorityFixes[name], name });
        }
    });

    unchecked.sort((a, b) => b.points - a.points);
    return unchecked.slice(0, 3);
}

function getTier(score) {
    return tiers.find(t => score >= t.min);
}

function getPercentile(score) {
    const percentage = (score / MAX_SCORE) * 100;
    if (percentage >= 93) return 95;
    if (percentage >= 71) return 75;
    if (percentage >= 50) return 50;
    if (percentage >= 29) return 25;
    return 5;
}

function showResults(userName) {
    const { sectionScores, totalScore } = calculateScores();
    const tier = getTier(totalScore);
    const topFixes = getTopFixes();
    const percentile = getPercentile(totalScore);

    // Store for PDF/sharing
    resultsData = { userName, sectionScores, totalScore, tier, topFixes, percentile };

    showScreen('results');

    // Trigger confetti for good scores
    if (tier.class === 'elite' || tier.class === 'strong') {
        setTimeout(triggerConfetti, 500);
    }

    // Set user name
    document.getElementById('results-name').textContent = `Results for ${userName}`;

    // Animate score
    const scoreNumber = document.getElementById('score-number');
    const scoreRing = document.getElementById('score-ring');
    const circumference = 339.292;
    const progress = (totalScore / MAX_SCORE) * circumference;

    // Set ring color based on tier
    let ringColor = '#22c55e';
    if (tier.class === 'average') ringColor = '#f59e0b';
    if (tier.class === 'struggling') ringColor = '#f97316';
    if (tier.class === 'crisis') ringColor = '#ef4444';

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

    // Benchmark bar
    const benchmarkMarker = document.getElementById('benchmark-marker');
    const benchmarkPercentile = document.getElementById('benchmark-percentile');

    setTimeout(() => {
        benchmarkMarker.style.left = `${(totalScore / MAX_SCORE) * 100}%`;
    }, 300);

    benchmarkPercentile.innerHTML = `You're in the top <strong>${100 - percentile}%</strong> of Facebook advertisers`;

    // Render section breakdown
    renderBreakdown(sectionScores);

    // Render priority fixes
    renderFixes(topFixes);

    // Render unsure items if any
    renderUnsureItems();
}

function renderBreakdown(sectionScores) {
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

        setTimeout(() => {
            item.querySelector('.breakdown-fill').style.width = `${percentage}%`;
        }, 200 + (i * 100));
    }
}

function renderFixes(topFixes) {
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

function renderUnsureItems() {
    const unsureContainer = document.getElementById('unsure-container');
    if (!unsureContainer) return;

    if (unsureItems.size === 0) {
        unsureContainer.style.display = 'none';
        return;
    }

    unsureContainer.style.display = 'block';
    const unsureList = document.getElementById('unsure-list');
    unsureList.innerHTML = '';

    unsureItems.forEach(name => {
        const checkbox = document.querySelector(`input[name="${name}"]`);
        if (checkbox) {
            const text = checkbox.closest('.checkbox-item').querySelector('.checkbox-text').textContent;
            const item = document.createElement('div');
            item.className = 'unsure-item';
            item.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/>
                </svg>
                <span>${text}</span>
            `;
            unsureList.appendChild(item);
        }
    });
}

// ===================================
// CONFETTI
// ===================================

function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#f5a623', '#ffc857', '#22c55e', '#3b82f6', '#8b5cf6'];

    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 2 - 1,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5
        });
    }

    let animationId;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let activeParticles = 0;
        particles.forEach(p => {
            if (p.y < canvas.height + 50) {
                activeParticles++;
                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += p.rotationSpeed;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            }
        });

        if (activeParticles > 0) {
            animationId = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(animationId);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animate();
}

// ===================================
// SHARING
// ===================================

function openShareModal() {
    document.getElementById('share-overlay').classList.add('active');
}

function closeShareModal() {
    document.getElementById('share-overlay').classList.remove('active');
}

function shareTwitter() {
    const text = `I just audited my Facebook Ads account and scored ${resultsData.totalScore}/${MAX_SCORE} (${resultsData.tier.name})! 🎯\n\nFind your profit leaks with this free 47-point diagnostic tool:`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    closeShareModal();
}

function shareLinkedIn() {
    const url = window.location.href;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    closeShareModal();
}

function copyShareLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Link copied to clipboard!', 'success');
        closeShareModal();
    });
}

// ===================================
// PDF DOWNLOAD
// ===================================

async function downloadPDF() {
    showToast('Generating PDF...', 'success');

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');

        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let y = 20;

        // Header
        doc.setFontSize(24);
        doc.setTextColor(245, 166, 35);
        doc.text('Facebook Ads Audit Report', margin, y);

        y += 15;
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Prepared for: ${resultsData.userName}`, margin, y);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - margin - 40, y);

        // Score section
        y += 20;
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 0);
        doc.text('Overall Score', margin, y);

        y += 10;
        doc.setFontSize(48);
        doc.setTextColor(245, 166, 35);
        doc.text(`${resultsData.totalScore}`, margin, y);
        doc.setFontSize(18);
        doc.setTextColor(150, 150, 150);
        doc.text(`/ ${MAX_SCORE}`, margin + 35, y);

        y += 10;
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`Status: ${resultsData.tier.name}`, margin, y);

        y += 8;
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(resultsData.tier.description, margin, y);

        // Section breakdown
        y += 20;
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Section Breakdown', margin, y);

        y += 10;
        doc.setFontSize(10);
        for (let i = 1; i <= 6; i++) {
            const section = sections[i];
            const score = resultsData.sectionScores[i];
            const percentage = Math.round((score / section.maxPoints) * 100);

            doc.setTextColor(0, 0, 0);
            doc.text(`${section.icon} ${section.name}`, margin, y);
            doc.text(`${score}/${section.maxPoints} (${percentage}%)`, pageWidth - margin - 30, y);
            y += 6;
        }

        // Priority fixes
        if (resultsData.topFixes.length > 0) {
            y += 10;
            doc.setFontSize(14);
            doc.setTextColor(239, 68, 68);
            doc.text('Priority Fixes', margin, y);

            y += 10;
            doc.setFontSize(10);
            resultsData.topFixes.forEach((fix, index) => {
                doc.setTextColor(0, 0, 0);
                doc.text(`${index + 1}. ${fix.title}`, margin, y);
                y += 5;
                doc.setTextColor(100, 100, 100);
                const lines = doc.splitTextToSize(fix.description, pageWidth - margin * 2);
                doc.text(lines, margin + 5, y);
                y += lines.length * 5 + 3;
            });
        }

        // Footer
        y = doc.internal.pageSize.getHeight() - 20;
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('Generated by Facebook Ads Profit Leak Finder', margin, y);
        doc.text(window.location.href, pageWidth - margin - 60, y);

        doc.save(`fb-ads-audit-${resultsData.userName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
        showToast('PDF downloaded!', 'success');
    } catch (error) {
        console.error('PDF generation error:', error);
        showToast('Failed to generate PDF. Please try again.', 'error');
    }
}

// ===================================
// TOAST NOTIFICATIONS
// ===================================

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = toast.querySelector('.toast-icon');
    const messageEl = toast.querySelector('.toast-message');

    messageEl.textContent = message;
    toast.className = `toast ${type}`;

    if (type === 'success') {
        icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
            <path d="M22 4L12 14.01l-3-3"/>
        </svg>`;
    } else {
        icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M15 9l-6 6M9 9l6 6"/>
        </svg>`;
    }

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===================================
// RESTART
// ===================================

function restartAudit() {
    // Reset all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
        cb.closest('.checkbox-item').classList.remove('checked', 'unsure');
    });

    // Reset form fields
    document.getElementById('user-name').value = '';
    document.getElementById('user-email').value = '';
    document.getElementById('ad-spend').selectedIndex = 0;

    // Reset section scores
    document.querySelectorAll('.current-score').forEach(el => {
        el.textContent = '0';
    });

    // Reset section
    document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
    document.querySelector('.form-section[data-section="1"]').classList.add('active');
    currentSection = 1;

    // Reset state
    unsureItems.clear();
    resultsData = null;

    // Clear saved progress
    localStorage.removeItem('profitLeakProgress');

    showScreen('hero');
}

// ===================================
// UTILITY: Close modals on outside click
// ===================================

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('tooltip-overlay')) {
        closeTooltip();
    }
    if (e.target.classList.contains('share-overlay')) {
        closeShareModal();
    }
});

// Close on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeTooltip();
        closeShareModal();
    }
});
