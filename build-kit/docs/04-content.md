# 04: Content (single source of truth)

Everything on the site comes from this file, from the MDX in `content/`, or from Padraig in the chat. If a fact is not here, do not write it: add `TODO(Padraig): …` and flag it.

Writing rules from `CLAUDE.md` apply: British English, no em dashes, sentence case, plain and specific.

---

## Site metadata

- **Site title:** Padraig Middleton
- **Default description:** Essays on economics and markets, and the projects I build to test them. Economics and Finance at Queen Mary University of London.
- **Domain:** `TODO(Padraig)`: suggested `padraigmiddleton.com`
- **Author:** Padraig Middleton (spelled Padraig, never Pádraic)

## Contact (public)

- Email: padraigmiddleton@gmail.com
- LinkedIn: https://www.linkedin.com/in/padraig-middleton
- GitHub: https://github.com/poggey
- CV: `/cv.pdf` (supplied 2 November 2026; Padraig is happy for it to include his phone number)

Never publish his phone number or home address.

---

## Homepage

### Hero

**Headline** (choose one with Padraig in Phase 4; default is option A):
- A: I write about economics and markets, and build the tools to test what I write.
- B: Economics and markets, argued in writing and tested in code.
- C: I write opinionated essays on economics and finance, and build things to check I'm right.

**Subline:** Second-year Economics and Finance student at Queen Mary University of London. Looking for Summer 2027 internships. `TODO(Padraig)`: optionally name the areas (banking, markets, asset management).

**Buttons:** "Read the latest essay" (primary, to the newest essay) and "See the projects" (secondary, scrolls to the projects band).

**Curve caption:** UK government bond yield curves over the last 60 trading days. Today's in gold. Source: Bank of England.
(Adjust the wording to match exactly what the data shows once the data script exists. Never claim more than the data shows.)

**Floating cards:**
1. Key figure card (glass): "£15bn" / "added to this year's UK debt interest before a single Budget measure was counted" / "From No. 1: The bill Britain keeps signing". Links to the essay. Includes a tiny four-bar chart of debt interest (£39bn 2019–20, £109bn 2025–26, £124bn 2026–27, £160bn forecast 2031–32).
2. Prediction card (night): "On the record" / "Linkers will make up less than 9.3% of planned gilt sales in the 2027–28 remit." / "Open. Checked 30 April 2027." Links to the Ledger.
3. ~~Small fact card (glass): "650+" / "UK councils use a website template I designed".~~ Removed 1 November 2026 (stat card). Replacement decided in Phase 5; the council template fact stays in the Zaltek role.

When a newer essay is published, card 1 switches to that essay's first key figure and card 2 to its prediction automatically.

### Proof strip (removed 1 November 2026)

No longer shown as a strip. These facts stay true and appear in their own sections instead:
1. First Class Year 1 average (85%) in Economics and Finance at Queen Mary.
2. 650+ UK councils use a website template I designed at Zaltek Digital.
3. Seven independent projects, all open on GitHub.
4. Built a Shariah-compliant model portfolio during a wealth management placement at Raymond James.

### Writing section

- Heading: Writing
- Intro line: Opinionated, sourced, and every essay ends with a dated prediction that I track on the Ledger.
- Empty-slot copy (while there is only one essay): "Next essay in progress." Nothing else. No fake titles.

### Projects section

- Heading: Projects
- Intro line: Questions I wanted answered, so I built something to answer them.
- Filters: All, Markets, Data, Systems
- Button at the end: "View all projects"

### Ledger section

- Heading: The Ledger
- Copy: Every essay ends with a dated, checkable prediction. When the date arrives, it gets marked right or wrong here. Nothing is edited and nothing is deleted.
- Empty resolved state: "Nothing resolved yet. The first prediction is checked on 30 April 2027."

### Experience section

- Heading: Experience
- Button: "Download CV"

### Contact panel

- Heading: Get in touch
- Line: I'm looking for Summer 2027 internships, and I'm always happy to talk about anything I've written.
- Email as a large link, then buttons: LinkedIn ↗, GitHub ↗, Download CV

---

## About

**Bio (factual paragraph, Claude may use as is):**
I'm a second-year Economics and Finance student at Queen Mary University of London, originally from Newcastle. Alongside my degree I work part-time as a Junior Associate at Zaltek Digital, where I've worked since 2022. I write about economics and markets here, and I build data and finance projects in Python and TypeScript, all of which are open on GitHub.

**In his own words:** `TODO(Padraig)`: two or three sentences on what you're curious about, why you write, and what you want to do next. Claude must not write this.

**Headshot:** `TODO(Padraig)`: optional.

---

## Experience

Dates and bullets match the CV. Do not add, embellish or merge.

### Zaltek Digital, Junior Associate (part-time)
Newcastle. June 2022 to present.
- Designed a council website template in Figma, now used by 650+ UK local councils, and led the migration of content onto it, including training colleagues and answering their questions.
- Managed the company accounts and produced monthly profit-by-project reports for the founders from time-tracking data.
- Designed a digital tool for an NHS supply chain service in Figma, applying the UK Government Design Principles.
- Built automated email marketing workflows in n8n that generate qualified sales contacts.

(Note: he has worked directly with clients on only one or two projects. Do not describe the role as client-facing.)

### Raymond James, Wealth Management (work experience)
Newcastle. August 2026, one week, self-arranged.
- Built a Shariah-compliant model portfolio, matched to an existing mandate on risk first and then on exposure, using sukuk in place of conventional bonds.
- Compared holdings in client portfolios against a fund pitched by its manager, and wrote a recommendation.
- Used BlackRock Portfolio 360 to analyse the portfolios I built.

(Confidential: no client details, no model names, no Portfolio 360 results or basis-point figures.)

### Parkdean Resorts, Customer Sales Support Advisor
Newcastle. June to September 2026.
- Consistently ranked in the top three of around 25 advisors on the daily revenue leaderboard. (Confirmed around 25 by Padraig, 2 November 2026.)
- Beat all eight other summer hires on conversion rate and total sales value.

### ICD Energy, Internship
Newcastle. September 2024, two weeks.
- Compiled 1,000+ records from several sources into a single Excel workbook for the team.

### UK Parliament, House of Lords, Work experience
London. July 2023.
- Researched UK productivity for peers.
- Co-wrote and fact-checked a speech delivered by a Labour peer, to a tight deadline.

---

## Education

### Queen Mary University of London
BSc (Econ) Economics and Finance, September 2025 to June 2028.
- Year 1 average 85% (First Class).
- Mathematical Methods 94%, Microeconomics 91%, Statistical Methods 88%.
- Current modules: Econometrics, Financial Statements and Analysis, Games and Strategies, Asset Pricing.
- Finance Trading Programme, including Bloomberg terminal training.

### St Mary's Catholic School, Newcastle
2018 to 2025.
- A-levels: Mathematics A*, Further Mathematics A, Economics A, English Language B.
- GCSEs: seven grade 9s and three grade 8s, including 9s in Maths and English.

## Skills

- Programming: Python (pandas, NumPy, SciPy, scikit-learn, statsmodels, Streamlit, Plotly), R, TypeScript and JavaScript (Next.js), SQL
- Methods: regression, Monte Carlo simulation, portfolio optimisation, risk metrics, bootstrapping
- Tools: Excel, BlackRock Portfolio 360, Bloomberg, Figma, n8n, Git and GitHub
- ~~Particular interest: Islamic finance~~ Removed 2 November 2026: Padraig says this is not true. Never use it.

## Beyond work

- Raised over £2,000 across a year for a project in Zambia, then built houses and taught on site.
- Black belt in martial arts. Competed, and led and taught classes.
- ~~Languages: English (native), Spanish (basic).~~ Left off the site at Padraig's request (2 November 2026).

---

## Projects

Display order (homepage and `/projects`) and card sizes are given for each. "Graphic" refers to specs in `05-signature-moments.md`.

### 1. Portfolio Risk Dashboard
- Slug: `risk-dashboard`. Group: markets. Size: feature. Status: live. Year: 2026.
- Kind: Risk analytics
- One line: Measures and stress-tests the risk of any portfolio: VaR, CVaR, Sharpe, Sortino, beta and drawdowns.
- Links: live https://risk-dashboard-padraig.streamlit.app, repo https://github.com/poggey/risk-dashboard
- Stack: Python, Streamlit, Plotly
- Graphic: cumulative return line with the maximum drawdown shaded and the 95% VaR marked, from a real run of the dashboard.
- Case study:
  - The question: once you've built a portfolio, how do you measure its risk, and how do you test it against a crisis?
  - What it does: three tabs. A risk dashboard (annualised return and volatility, Sharpe, Sortino, maximum drawdown, 95% VaR and CVaR, beta, rolling Sharpe, correlation heatmap). A "Sleep Test" that scores a portfolio against how much loss the investor says they can tolerate. A stress test that shocks factor exposures (market, rates, volatility) rather than single assets, with V, U and L-shaped crisis paths modelled on 2020, 2008 and Japan in the 1990s.
  - Why factor shocks: "what if this stock falls 40%" ignores how assets move together. Shocking the underlying factors gives a more honest picture of a portfolio in a crisis.
  - Limitations: historical data only, volatility used as a proxy for duration, linear recovery paths, no correlation spikes in crises, no transaction costs.

### 2. Stirling
- Slug: `stirling`. Group: systems. Size: standard. Status: live (updated daily). Year: 2026.
- Kind: Automated system
- One line: A daily economic briefing that decides what mattered, writes it up and files one numbered edition a day, for £0 a month.
- Links: live https://stirling-report.vercel.app, repo https://github.com/poggey/stirling-report
- Stack: Next.js, TypeScript, Vercel, GitHub Actions, free public APIs (Bank of England, FRED, ECB, Frankfurter)
- Graphic: a stack of the last few real editions, the front one showing that day's Story of the Day headline (fetched from Stirling's open data at build time).
- Case study:
  - The idea: replicate a junior analyst's daily routine. Pull market and macro data, rank what mattered, and publish one permanent edition per day.
  - How it works: every evening a scheduled job fetches all sources, computes how unusual each move was, picks the Story of the Day with a transparent scoring rule, and writes an immutable edition. A second job mirrors each edition into the repo as an open dataset.
  - Principle: the code decides what mattered; the AI only words it. If the AI step fails, a template takes over.
  - Features worth naming: a yield curve observatory, a central bank decision countdown, a Time Machine to replay any past edition, and an interview-prep mode.
  - Quality: 46 fixture-backed tests, no live calls in tests.

### 3. The Slate
- Slug: `the-slate`. Group: data. Size: feature. Status: in progress. Year: 2026.
- Kind: Data essay
- One line: A24's films analysed as if they were an investment portfolio.
- Links: repo https://github.com/poggey/the-slate
- Stack: Python, pandas, statsmodels, TMDB and OMDb APIs
- Key result: "+60%": roughly the boost to a film's revenue multiple from ten extra Metascore points.
- Graphic: the distribution of returns across the core sample of films: a long right tail, with the few films that made most of the profit highlighted in gold.
- Case study:
  - The question: is a film studio's slate more like a balanced portfolio or a venture fund?
  - Data: 118 films tracked, a core sample of 58, collected from public APIs and cleaned by hand.
  - Finding 1, returns are extremely skewed: $1.62bn deployed for a net loss of about $37m. The mean return was +191% but the median was −10%, only 43% of films were profitable, and five films made about 65% of all the profit. It behaves like a venture fund.
  - Finding 2, acclaim pays: ten Metascore points are associated with roughly a 60% higher revenue multiple (p = 0.008), and the result held across all 13 sensitivity runs.
  - Limitations: costs for marketing and distribution are modelled, not reported; the sample is one studio.
  - Note: Padraig is not an expert on the individual films. Keep the write-up about the numbers.

### 4. Portfolio Optimiser
- Slug: `portfolio-optimiser`. Group: markets. Size: standard. Status: complete. Year: 2026.
- Kind: Quant finance
- One line: Markowitz optimisation on eight London-listed ETFs, and why the "best" portfolio is not to be trusted.
- Links: repo https://github.com/poggey/portfolio-optimiser
- Stack: Python, pandas, NumPy, SciPy, yfinance
- Key result: "0.76": maximum Sharpe ratio, against −0.31 for an equal-weight portfolio (2020–2025, 4% risk-free rate).
- Graphic: the cloud of 10,000 random portfolios, the efficient frontier traced over it, and the maximum-Sharpe portfolio marked in gold. From the notebook's real output.
- Case study:
  - The question: how far does textbook portfolio theory get you with real data?
  - Data: five years of daily prices for eight ETFs across five asset classes (UK and global equity, gilts, US Treasuries, index-linked gilts, gold, UK corporate bonds, UK property).
  - Result: the maximum-Sharpe portfolio was 56% gold and 44% global equity, a Sharpe ratio of 0.76.
  - What broke: the optimiser concentrated into two assets because it exploits noise in the estimated returns. Fixes would be weight caps and shrinkage estimators such as Ledoit-Wolf. The sample includes Covid, the 2022 rate rises and the gilt crisis.
  - Note: this was Padraig's first ever coding project.

### 5. Escape Velocity
- Slug: `escape-velocity`. Group: markets. Size: standard. Status: in progress. Year: 2026.
- Kind: Equity capital markets analysis
- One line: The June 2026 SpaceX IPO: how it was priced, where it broke with convention, and what happened after listing.
- Links: repo https://github.com/poggey/escape-velocity
- Stack: Python, Vite, JavaScript, GSAP, WebGL
- Graphic: share price from listing, with the IPO price marked as a dashed line.
- `TODO(Padraig)`: the repo currently uses stub price data. Do not show any price, valuation or return figure on the site until the notebook has run on live data and the figures are verified. Until then, the card shows the graphic as a labelled illustration or a simple title card.

### 6. APEX
- Slug: `apex`. Group: data. Size: standard. Status: live. Year: 2026.
- Kind: Statistical model
- One line: Great driver or great car? A model that separates the two across 12,270 Formula 1 qualifying laps.
- Links: live https://f1-pace-analyser.vercel.app, repo https://github.com/poggey/f1-pace-analyser
- Stack: Python, pandas, NumPy, networkx, FastF1, Next.js, D3
- Graphic: the teammate network (drivers as nodes, shared cars as links) that makes the separation possible.
- Case study:
  - Method: each lap's gap to the session best is modelled as circuit plus car-season plus driver plus noise, fitted with ridge-penalised least squares. Uncertainty from a 300-refit bootstrap, so every rating has a confidence interval.
  - The insight: driver and car can only be separated because drivers change teams. The 2021–2023 seasons alone break into disconnected islands, so the data window goes back to 2018.

### 7. Marginalia
- Slug: `marginalia`. Group: systems. Size: standard. Status: complete. Year: 2026.
- Kind: Recommender
- One line: A book recommender that shows its maths, and an honest write-up of why it didn't work.
- Links: repo https://github.com/poggey/marginalia-app
- Stack: Next.js, TypeScript, IndexedDB
- Graphic: a small similarity map: rated books as points, a predicted book with its uncertainty band.
- Case study: the maths worked, the inputs didn't. Only 20 books had hand-made profiles, automated classification produced flat or absurd ones, and every fix made the pool safer but smaller. The real fix is many users correcting profiles. Also, similarity captures what a book is about, not how it is paced.

### Coming next
- FFT option pricing: added as the project "Fourier Option Pricing" (2 November 2026), from Padraig's CV and the repo README.

### Do not show
- Forked repositories (`Pandas-Data-Science-Tasks`, `Regression-Example`).
- Private work (the Shariah research workbook, Greenline HSE client site) unless Padraig says so.

---

## Writing

### Published
| No. | Title | Date | File |
|---|---|---|---|
| 1 | The bill Britain keeps signing | 3 November 2026 | `content/posts/the-bill-britain-keeps-signing.mdx` |

### Predictions
See `content/predictions.json`. Prediction 001 is open, checked 30 April 2027.

---

## Repo housekeeping (do before launch, Padraig's job, Claude can help)

- `risk-dashboard` README still says "first-year student". Update it.
- `the-slate` has no README. Add one before linking to it prominently.
- `escape-velocity` README has a placeholder reflective note and stub data. Finish before featuring figures.
- Pin repos on GitHub in the same order as the site.
