# Facebook Ads Profit Leak Finder

A 47-point interactive diagnostic tool that helps advertisers identify profit leaks in their Facebook Ads accounts.

## Features

- **47-Point Audit** across 6 key areas:
  1. Account Architecture
  2. Audience Targeting
  3. Creative Performance
  4. Conversion Setup
  5. Bidding & Budget
  6. Advanced Optimization

- **Scoring System** (181 total points):
  - Elite (168+): Top 5% of advertisers
  - Strong (129-167): Minor optimizations needed
  - Average (90-128): Leaking $500-1,500/month
  - Struggling (52-89): Leaking $1,500-3,500/month
  - Crisis (0-51): Leaking $3,000-6,000+/month

- **Lead Capture**: Email collection before showing results
- **Personalized Results**: Section breakdown with visual indicators
- **Priority Fixes**: Top 3 actionable recommendations

## Deployment to GitHub Pages

1. Create a new GitHub repository
2. Push these files to the repository
3. Go to Settings > Pages
4. Select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Save and wait for deployment

Your site will be live at: `https://[username].github.io/[repo-name]/`

## Local Development

Simply open `index.html` in a browser. No build process required.

## Customization

- Update Calendly link in `index.html` (search for "calendly.com")
- Modify branding colors in `styles.css` (CSS variables at top)
- Adjust tier thresholds in `app.js` (tiers array)
- Email submissions are stored in localStorage (key: `profitLeakSubmissions`)

## Tech Stack

- Vanilla HTML/CSS/JavaScript
- No dependencies or build tools
- Mobile responsive
- Dark theme with gold accents

## Author

Marcel - Performance Marketing Specialist
