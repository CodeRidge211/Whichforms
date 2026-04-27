# WhichForms — SEO & Traffic Strategy
# Sovereign Ridge Partners LLC

## THE CORE SEO PRINCIPLE
Every page answers ONE specific question that someone is actively searching for.
Not "IRS forms" — but "what form do I need to hire my first employee"
Not "USCIS" — but "what forms do I need to apply for a green card from inside the US"

## KEYWORD ARCHITECTURE

### Tier 1 — High Volume, High Intent (target first)
These are searched thousands of times per day:

| Keyword | Monthly Volume | Page Target |
|---------|---------------|-------------|
| what form do I need to file taxes | 50k+ | /situation/filing-taxes |
| how to get an EIN number | 40k+ | /form/irs-ss4 |
| what is a W-9 form | 90k+ | /form/irs-w9 |
| how to apply for a green card | 100k+ | /situation/green-card |
| Real ID requirements [state] | 30k+ per state | /identity/real-id |
| how to replace Social Security card | 25k+ | /identity/social-security-card |
| what documents do I need to open a bank account | 20k+ | /situation/open-bank-account |
| how to change your name legally | 30k+ | /situation/name-change-process |
| how to form an LLC | 80k+ | /situation/forming-llc |
| what is Schedule C | 40k+ | /form/irs-schedule-c |

### Tier 2 — Long-tail, High Conversion
These have lower volume but higher conversion because the person knows exactly what they need:

- "I-485 filing fee 2026" → /form/uscis-i-485
- "W-9 form independent contractor" → /form/irs-w9
- "articles of organization Wyoming" → /state/wyoming/articles-of-organization
- "how long does passport renewal take 2026" → /identity/us-passport
- "Real ID star on license" → /identity/real-id
- "SS-4 form online application" → /form/irs-ss4
- "N-400 eligibility requirements" → /form/uscis-n-400

### Tier 3 — State-specific (programmatic SEO goldmine)
Generate these automatically for all 50 states:
- "how to get Real ID in [state]"
- "LLC formation cost [state]"
- "name change process [state]"
- "replace driver's license [state]"
- "birth certificate request [state]"

50 states × 10 document types = 500 pages, each rankable

## ON-PAGE SEO IMPLEMENTATION

### Title Tag Formula
```
[Form Name or Document] — What It Is, Who Needs It, How to Get It | WhichForms
```
Examples:
- "IRS Form W-9 — What It Is, Who Needs It, How to Fill It Out | WhichForms"
- "Real ID Requirements — What You Need to Apply in 2026 | WhichForms"
- "How to Form an LLC — Every Form You'll Need | WhichForms"

### Meta Description Formula (155 chars max)
```
[Plain English answer to the main question]. [Who needs it]. [Key detail like cost or time].
```
Examples:
- "The W-9 is the form you fill out when hired as a freelancer or contractor. Companies use it to report what they paid you. Simple to complete — here's how."
- "Real ID is the upgraded driver's license required for domestic flights since May 2025. Here's exactly what documents you need to apply at your DMV."

### FAQ Schema (add to every page)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Who needs to fill out a W-9?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Anyone who works as a freelancer, independent contractor, or receives payments from a business that isn't their employer needs to fill out a W-9."
      }
    }
  ]
}
```

Add 3-5 FAQs per page. Google pulls these for rich results = higher CTR.

### HowTo Schema (situation pages)
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Form an LLC",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Choose your state",
      "text": "Decide which state to form your LLC in. Wyoming and Delaware are popular for their favorable laws."
    }
  ]
}
```

## MULTILINGUAL SEO STRATEGY

### Why this matters for WhichForms specifically:
- 41 million Spanish speakers in the US search in Spanish
- Immigration forms are searched heavily in Spanish, Russian, Chinese
- Google ranks translated pages separately — 5x more indexable pages
- Almost zero English-only sites bother to translate form content

### Implementation with next-intl:

Languages to launch with:
1. English (default) — all pages
2. Spanish (es) — all pages (highest priority, largest audience)
3. Russian (ru) — immigration and identity pages
4. Chinese Simplified (zh) — immigration pages
5. Portuguese (pt) — immigration pages

URL structure:
- whichforms.com/ (English)
- whichforms.com/es/ (Spanish)
- whichforms.com/ru/ (Russian)

Each URL is indexed separately by Google = multiplied organic reach

Spanish keyword examples:
- "qué formulario necesito para" (what form do I need for)
- "cómo obtener número EIN" (how to get EIN number)
- "solicitud de residencia permanente" (permanent residence application)

These are high volume, low competition because almost nobody builds multilingual form directories.

## TRAFFIC SCRAPING STRATEGY

### 1. Reddit Organic Outreach
These subreddits have constant questions about forms and paperwork:

High priority:
- r/legaladvice — 2.5M members, constant form questions
- r/immigration — 400k members, USCIS form questions daily
- r/personalfinance — 18M members, tax form questions
- r/smallbusiness — 1.2M members, business formation questions
- r/Entrepreneur — 2.5M members, LLC and business forms

Playbook:
1. Search subreddit for "what form" or "which form" or "do I need to"
2. Find unanswered or partially answered questions
3. Post a genuinely helpful answer (don't just drop a link)
4. Include WhichForms link ONLY if directly relevant
5. Do this for 10-15 threads per week across all subreddits

Expected results: 50-200 clicks per week at scale, plus upvotes = social proof

### 2. Quora Answers
Quora ranks extremely well on Google for "what form do I need" queries.
Writing thorough answers with WhichForms links = Google traffic through Quora.

Target questions:
- "What forms do I need to start an LLC?"
- "What's a W-9 form and when do I need one?"
- "How do I apply for a green card?"
- "What documents do I need to get a passport?"

### 3. Answer Engine Optimization (AEO)
Google AI Overviews and ChatGPT pull structured content.
Format every form page with a direct answer in the first 2 sentences:

```
[Form Name] is [one sentence plain English description]. 
You need it when [situation]. It takes [time] and costs [amount].
```

This format gets pulled into:
- Google AI Overview (featured at top of results)
- Google Featured Snippet (box result)
- ChatGPT and Perplexity citations

= Traffic without ranking on page 1

### 4. Google Search Console Feedback Loop
Week 1-4: Submit sitemap, monitor for impressions
Week 4-8: Find queries with impressions but low CTR
Fix: Rewrite title tag and meta description to match query intent
Result: CTR improvement = more traffic from same rankings

Queries to watch for:
- Question-format queries → add FAQ schema
- State-specific queries → add state-specific content
- Year-specific queries (e.g. "2026 passport fee") → update content annually

### 5. Pinterest
Underrated for form-related content.
People pin "what documents do I need for X" infographics.

Create simple text-based pins:
- "5 documents you need to start an LLC"
- "Real ID checklist — what to bring to the DMV"
- "New job paperwork checklist"

Each pin links to the relevant WhichForms page.
Pinterest indexes separately from Google = bonus traffic.

### 6. Internal Network Links (most important)
Every existing Sovereign Ridge site should link to WhichForms:

IsPermitRequired.com:
→ "Need the permit application form? Find it on WhichForms"
→ Link on every city × project type page

LeaseDecoder.com:
→ "Need to file a complaint against your landlord? Find the right form"

Boring Search:
→ "Found a business record? Here's how to file against them"
→ "Searching court records? Here's how to file your own case"

TowTrack:
→ "Disputing an impound? Find the right DMV form"

FaultDeck:
→ "Filing an insurance claim? Find the right form"

OBD Vault:
→ "Disputing a dealer charge? Here's the consumer complaint form"

This gives WhichForms authority from day 1 without waiting for external backlinks.

## CONTENT CALENDAR (first 90 days)

### Month 1 — Foundation
- Launch with 50 forms, 20 situations, 15 identity docs
- Submit sitemap
- Set up Google Search Console
- Add cross-links from all existing sites

### Month 2 — Expand
- Add Spanish translations for top 20 pages
- Add 50 more forms (DMV focus)
- Start Reddit outreach (10 posts/week)
- Add FAQ schema to all pages

### Month 3 — State Pages
- Generate state-specific pages for top 10 states by traffic
- Add Russian and Chinese translations for immigration pages
- Start Pinterest presence
- Review GSC data and optimize low-CTR pages

## AFFILIATE REVENUE PROJECTIONS

At 90 days (conservative):
- 300 monthly visitors
- Top affiliates: LegalZoom, TurboTax, Boundless
- Average commission: $20-50
- Conversion rate: 2%
= $120-300/month

At 12 months (with SEO compounding):
- 5,000 monthly visitors (realistic for this niche)
- Conversion rate: 2-3%
= $2,000-7,500/month

Immigration affiliates (Boundless) pay $50-150 per lead.
Tax software (TurboTax) pays $15-25 per signup.
Business formation (LegalZoom/Northwest) pays $25-75 per signup.

WhichForms has the potential to be your highest-earning affiliate site
because every single page has a clear, high-intent affiliate match.
