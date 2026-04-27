# WhichForms.com — Full Build Spec
# Sovereign Ridge Partners LLC
# "The paperwork you need, explained."

## Stack
- Next.js 14 (App Router)
- PostgreSQL (Railway)
- Tailwind CSS
- next-intl (multilingual)
- next-sitemap
- No Stripe at launch — freemium gate added in v2

## Environment Variables (.env.example)
```
DATABASE_URL=postgresql://user:password@host:5432/whichforms
NEXT_PUBLIC_SITE_URL=https://whichforms.com
NEXT_PUBLIC_SITE_NAME=WhichForms
ADMIN_SECRET=change_this_to_a_long_random_string
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Affiliates
NEXT_PUBLIC_LEGALZOOM_URL=https://www.legalzoom.com
NEXT_PUBLIC_NORTHWEST_URL=https://www.northwestregisteredagent.com
NEXT_PUBLIC_TURBOTAX_URL=https://turbotax.intuit.com
NEXT_PUBLIC_HRBLOCK_URL=https://www.hrblock.com
NEXT_PUBLIC_ROCKETLAWYER_URL=https://www.rocketlawyer.com
NEXT_PUBLIC_BOUNDLESS_URL=https://www.boundless.com
```

## Site Structure

### Pages
- `/` — Homepage with search + category grid
- `/agency/[slug]` — Agency hub (IRS, DMV, USCIS, SSA, SBA)
- `/situation/[slug]` — Situation-based lookup
- `/state/[state]/[slug]` — State-specific forms
- `/form/[slug]` — Individual form detail page
- `/identity` — Identity & citizenship hub
- `/identity/[slug]` — Individual identity document page
- `/admin` — Admin panel (secret protected)
- `/sitemap.xml` — Auto-generated

### Database Schema

```sql
-- Forms table
CREATE TABLE forms (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  form_number VARCHAR(100),
  name VARCHAR(500) NOT NULL,
  agency VARCHAR(100) NOT NULL,
  agency_slug VARCHAR(100) NOT NULL,
  description TEXT,
  plain_english TEXT,
  who_needs_it TEXT,
  deadline TEXT,
  processing_time TEXT,
  official_url VARCHAR(500),
  instructions_url VARCHAR(500),
  difficulty_level VARCHAR(50),
  cost VARCHAR(100),
  situations TEXT[],
  states TEXT[],
  affiliate_type VARCHAR(100),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Situations table
CREATE TABLE situations (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  plain_english TEXT,
  form_ids INTEGER[],
  category VARCHAR(100),
  search_volume_estimate VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Identity documents table
CREATE TABLE identity_docs (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(500) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  plain_english TEXT,
  who_needs_it TEXT,
  required_documents TEXT[],
  processing_time TEXT,
  cost VARCHAR(100),
  renewal_period TEXT,
  official_url VARCHAR(500),
  state_specific BOOLEAN DEFAULT false,
  states TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- FAQ table (for schema markup)
CREATE TABLE faqs (
  id SERIAL PRIMARY KEY,
  page_type VARCHAR(100),
  page_slug VARCHAR(255),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## SEO Strategy

### On-Page SEO (implement in every page)
1. Dynamic meta titles: "[Form Name] — What It Is, Who Needs It | WhichForms"
2. Meta descriptions: Plain English 155-char summary
3. FAQ schema markup on every form page (3-5 FAQs each)
4. HowTo schema on situation pages
5. BreadcrumbList schema site-wide
6. Open Graph tags for social sharing
7. Canonical URLs on all pages
8. next-sitemap for auto XML sitemap

### Content SEO (long-tail keyword targeting)
Each form page targets these keyword patterns:
- "what is [form number]"
- "who needs to file [form name]"
- "how to fill out [form number]"
- "[form number] deadline [year]"
- "do I need [form name]"

Each situation page targets:
- "what forms do I need to [situation]"
- "paperwork required to [situation]"
- "documents needed for [situation] in [state]"

### Language Plugin (next-intl)
Install: `npm install next-intl`

Supported languages at launch:
- English (default)
- Spanish (es) — massive US search volume
- Russian (ru) — fits Lily's language goals 😄
- Chinese Simplified (zh)
- Portuguese (pt)

Implementation:
```javascript
// middleware.js
import createMiddleware from 'next-intl/middleware';
export default createMiddleware({
  locales: ['en', 'es', 'ru', 'zh', 'pt'],
  defaultLocale: 'en'
});
```

URL structure: whichforms.com/es/situation/registrar-negocio
Each translated page gets its own sitemap entry = 5x more indexed pages

### Traffic Scraping Strategy

#### 1. Reddit Scraping (organic engagement)
Target subreddits where people ask form questions:
- r/legaladvice — "what form do I need for X"
- r/personalfinance — tax forms
- r/immigration — USCIS forms
- r/smallbusiness — business formation
- r/DMV — state DMV forms
- r/USCIS — immigration paperwork

Method: Monitor these subreddits for questions, post helpful answers with WhichForms link. Not spam — genuine answers. One link per thread max.

Tools: Reddit API (free tier), or manually monitor once/day

#### 2. Google Search Console — Search Appearance Tracking
Once live, monitor:
- Which queries are triggering impressions
- CTR below 5% = rewrite meta description
- Position 11-20 = beef up content, add FAQs
- Any question-format queries = add FAQ schema

#### 3. Internal Link Juice Distribution
Every page in the Sovereign Ridge network links to WhichForms contextually:
- IsPermitRequired: "Need the permit application form? Find it on WhichForms"
- LeaseDecoder: "Need to file a complaint? Find the right form on WhichForms"
- Boring Search: "Found a business record? Here's how to file against them"
- NoticeDecoder: "Got this notice? Here's the response form"
- TowTrack: "Need to dispute a tow? Find the right form"

This creates internal link authority from day one without waiting for backlinks.

#### 4. Answer Engine Optimization (AEO)
Format every form page to answer in the first 2 sentences — targeting AI overviews and featured snippets:

Structure:
```
[Form Name] is [plain English description]. You need it when [situation]. 
It takes [time] and costs [amount]. Download it here: [official link].
```

Google pulls this format for featured snippets constantly on form-related queries.

#### 5. Pinterest SEO
"Which form do I need for X" infographic pins perform surprisingly well.
Create simple text-based pins for top 20 situations.
Free traffic, indexes separately from Google.

#### 6. Programmatic SEO
Generate pages automatically from the database:
- 50 agencies × 10 forms each = 500 form pages
- 100 situations = 100 situation pages  
- 50 states × 20 common forms = 1,000 state pages
- 30 identity documents = 30 identity pages

Total: ~1,630 indexable pages at launch
Each page = potential Google ranking
Each ranking = passive affiliate traffic

## Affiliate Placement Strategy

### IRS Form Pages
Primary: TurboTax — "Let a pro handle this filing"
Secondary: H&R Block — "Get expert tax help"
Placement: After plain English explanation, before official download link

### Business Formation Pages
Primary: LegalZoom — "File your LLC in minutes"
Secondary: Northwest Registered Agent — "Wyoming LLC specialists"
Placement: Top of page and after form explanation

### USCIS Pages
Primary: Boundless — "Get immigration help from experts"
Secondary: RocketLawyer — "Have an immigration attorney review this"
Placement: Prominent — immigration forms are high anxiety, high conversion

### DMV Pages
Primary: State-specific notary services
Secondary: AAA — "Get help with your DMV paperwork"
Placement: After form explanation

### Identity Document Pages
Primary: Varies by document type
- Passport → travel insurance, CLEAR
- Real ID → TSA PreCheck
- Name change → LegalZoom, RocketLawyer
Placement: Contextual per page

### Global CTAs (every page)
Footer: "Need legal help with your paperwork? → RocketLawyer"
Sidebar: "Not sure which form? Ask an expert → LegalZoom"

## Admin Panel Routes
- GET /admin?secret=XXX — dashboard
- POST /admin/forms/add — add new form
- POST /admin/situations/add — add new situation
- POST /admin/identity/add — add new identity doc
- POST /admin/faqs/add — add FAQ to any page

## Launch Checklist
- [ ] Deploy to Railway
- [ ] Connect PostgreSQL
- [ ] Run db:migrate
- [ ] Run db:seed (50 forms, 20 situations, 15 identity docs)
- [ ] Add domain whichforms.com in Railway
- [ ] Update DNS in DomainSecure (CNAME www → Railway URL)
- [ ] Add GA4 ID to env vars
- [ ] Submit sitemap to Google Search Console
- [ ] Apply for affiliates: TurboTax, H&R Block, LegalZoom, Northwest, Boundless
- [ ] Add cross-links from all existing portfolio sites
- [ ] Submit to Bing Webmaster Tools (often overlooked, easy traffic)

## Revenue Projections
Conservative estimate at 6 months:
- 500 monthly visitors
- 2% affiliate conversion rate
- Average commission $15-25
= $150-250/month

At 12 months with full SEO compounding:
- 3,000 monthly visitors  
- 2% conversion
= $900-1,500/month

This becomes one of your highest earners because immigration and tax form queries have extremely high commercial intent.
