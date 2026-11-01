# 01: The brief

## Who this is for

Padraig Middleton: second-year BSc Economics and Finance student at Queen Mary University of London (graduating June 2028), from Newcastle, based in East London during term. First Class Year 1 average (85%). Part-time Junior Associate at Zaltek Digital since 2022, where he designed a council website template now used by 650+ UK councils. Targeting Summer 2027 internships across investment banking, quantitative finance, wealth management and asset management. Writes opinionated essays on economics and finance. Builds independent data and finance projects in Python and TypeScript, all public on GitHub (github.com/poggey).

He currently has no website. His work lives on GitHub and LinkedIn.

## What the site must do

1. **Make a strong first impression in five seconds.** A recruiter clicking through from LinkedIn should immediately see: who he is, that he thinks clearly about economics and markets, and that he builds real things. The site itself is evidence of taste and craft.
2. **Be the home for his writing.** Opinionated, sourced essays on economics and finance, each ending with a dated, checkable prediction. Each new essay is promoted on LinkedIn and links back here, so the essay page is often the first page a visitor sees, not the homepage.
3. **Show the projects properly.** Each project presented as a short case study: the question, the method, what it found, what broke. With real graphics from the project's own data.
4. **Keep a public record.** The Ledger tracks every prediction, right or wrong. Nothing is deleted. This is the site's most distinctive idea after the design itself.
5. **Make contact easy.** Email, LinkedIn, GitHub, and a CV download, never more than one click away.
6. **Be easy to keep alive.** Publishing an essay means adding one MDX file and pushing. If publishing is a chore, the site dies.

## The audiences, in priority order

1. **Recruiters and interviewers** at banks, asset managers, quant and trading firms. Short on time, skimming on a laptop or phone. They need: name, course, university, what he is looking for, best evidence, CV, contact. They will judge the polish.
2. **LinkedIn connections** arriving on a specific essay. They need: a great reading experience, a reason to read another essay, and a way to see who he is.
3. **Curious readers and peers** who find an essay or project. They need depth: the method, the data, the sources.

## What "impressive" means here (in Padraig's words, paraphrased)

The site must look like a properly designed website, not a well-designed document. Elements should interact with each other. Text should be beautiful. Design should be subtle in each part, but all of it together should add up. Cards have their own style, there are layers, and there are small levels of interactivity. It should look very professional but excellently designed.

Two rounds of static mockups were rejected for looking like documents. The fix is not more decoration. It is depth, motion that responds to the visitor, real graphics, and obsessive finish.

## References, and what to take from each

Do not copy any of these. Take the principle, not the look.

**Stripe (stripe.com)**
- Layered composition: cards that sit on, overlap and cast light onto each other.
- Bento cards that contain *live miniature interfaces* (a billing meter, a usage chart) rather than icons or screenshots. For Padraig: project cards contain miniature, real versions of the project's own output.
- A signature animated graphic in the hero that is unmistakably theirs. For Padraig: the gilt-curve field.
- Calm, precise typography. Big numbers used sparingly and with real meaning.

**Apple (apple.com)**
- Frosted glass used with restraint: the navigation bar and a few floating surfaces, never everything.
- Generous space. Each section has one idea.
- Classic, not trendy. It will still look good in three years.

**Supabase (supabase.com)**
- Simpler, less colour, but the graphics carry the page. Each product tile has its own bespoke small graphic (a globe, database rows, a vector graph).
- Small, satisfying interactions: tabs that switch a preview, hover states that reveal a little more.

**Raycast (raycast.com)**
- Useful as an upper limit. Padraig finds it a bit too much: too dark, too glossy, too many effects. Borrow at most one idea (for example a ⌘K command menu as a hidden delight), never the overall feel.

## Anti-references (what to avoid)

- Anything that looks like a generic template or "AI-generated" site. See the list of tells in `02-design-system.md`. The previous static drafts fell into several of them (italic accent word in the headline, monospace all-caps labels, arrows on every link, identical rounded cards).
- A dark terminal or Bloomberg-pastiche look. Padraig rejected this for his Stirling project because it looked AI-generated.
- Newspaper or broadsheet pastiche (hairline rules everywhere, dense columns). Also rejected before.
- Scroll-jacking, long intro animations, cursor trails, anything that delays reading.

## Tone of the site

Confident but not loud. Clear, plain, specific. The voice of someone who has done the work and is happy to show it, including where it went wrong. Never salesy, never "passionate about", never a list of soft skills.

## Success looks like

- A recruiter can find course, university, internship target, CV and email in under ten seconds on a phone.
- Someone arriving on an essay from LinkedIn reads to the end, sees the prediction, and clicks into either the Ledger or another essay.
- An experienced designer or developer looking at the site would believe it was made with care, and would not guess it was AI-assisted.
- Lighthouse 95+ across the board, and it feels instant on a mid-range phone.
- Padraig can publish a new essay in under ten minutes.
