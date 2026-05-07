// WhichForms — Launch Seed Data
// Sovereign Ridge Partners LLC

const irsForms = [
  {
    slug: "irs-1040",
    form_number: "1040",
    name: "U.S. Individual Income Tax Return",
    agency: "IRS",
    agency_slug: "irs",
    plain_english: "This is the main tax return most Americans file every year. If you earned income in the US, you almost certainly need this form.",
    who_needs_it: "Anyone who earned income in the US during the tax year — employees, freelancers, self-employed, retirees with income.",
    deadline: "April 15 each year (or October 15 with extension)",
    processing_time: "3 weeks (e-file) to 6 weeks (paper)",
    official_url: "https://www.irs.gov/forms-pubs/about-form-1040",
    difficulty_level: "moderate",
    cost: "Free (government form) — filing software varies",
    affiliate_type: "turbotax",
    is_featured: true,
    situations: ["filing-taxes", "first-time-filer", "freelance-income"],
    faqs: [
      { q: "Do I have to file a 1040?", a: "If your income exceeds the filing threshold ($13,850 for single filers in 2023), yes. Some people with lower income still benefit from filing to claim refunds." },
      { q: "What's the difference between 1040 and 1040-SR?", a: "1040-SR is for taxpayers 65 and older. It's identical to the 1040 but with larger print." },
      { q: "Can I file a 1040 for free?", a: "Yes — IRS Free File is available for incomes under $79,000. TurboTax, H&R Block, and others also offer free tiers for simple returns." }
    ]
  },
  {
    slug: "irs-w9",
    form_number: "W-9",
    name: "Request for Taxpayer Identification Number and Certification",
    agency: "IRS",
    agency_slug: "irs",
    plain_english: "This is the form you fill out when a company hires you as a contractor or freelancer. It tells them your tax ID so they can report what they paid you.",
    who_needs_it: "Freelancers, independent contractors, anyone receiving payments from a business that isn't an employer.",
    deadline: "Whenever requested by the paying company",
    processing_time: "Immediate — you fill it out and return it",
    official_url: "https://www.irs.gov/forms-pubs/about-form-w-9",
    difficulty_level: "easy",
    cost: "Free",
    affiliate_type: "turbotax",
    is_featured: true,
    situations: ["freelance-income", "starting-business", "contractor-work"]
  },
  {
    slug: "irs-w4",
    form_number: "W-4",
    name: "Employee's Withholding Certificate",
    agency: "IRS",
    agency_slug: "irs",
    plain_english: "This is the form you fill out when you start a new job. It tells your employer how much tax to withhold from your paycheck.",
    who_needs_it: "Anyone starting a new job or wanting to update their withholding.",
    deadline: "First day of new job, or whenever you want to update",
    processing_time: "Immediate",
    official_url: "https://www.irs.gov/forms-pubs/about-form-w-4",
    difficulty_level: "easy",
    cost: "Free",
    affiliate_type: "turbotax",
    situations: ["new-job", "filing-taxes"]
  },
  {
    slug: "irs-ss4",
    form_number: "SS-4",
    name: "Application for Employer Identification Number (EIN)",
    agency: "IRS",
    agency_slug: "irs",
    plain_english: "This is how you get an EIN (tax ID number) for your business. You need it to open a business bank account, hire employees, or file business taxes.",
    who_needs_it: "Anyone starting a business, forming an LLC, or hiring employees.",
    deadline: "Before opening a business bank account or hiring",
    processing_time: "Immediate online, 4 weeks by mail",
    official_url: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
    difficulty_level: "easy",
    cost: "Free",
    affiliate_type: "legalzoom",
    is_featured: true,
    situations: ["starting-business", "forming-llc", "hiring-employees"]
  },
  {
    slug: "irs-schedule-c",
    form_number: "Schedule C",
    name: "Profit or Loss From Business",
    agency: "IRS",
    agency_slug: "irs",
    plain_english: "This is the form self-employed people and freelancers attach to their 1040 to report business income and expenses.",
    who_needs_it: "Freelancers, self-employed people, sole proprietors, single-member LLCs.",
    deadline: "Filed with your 1040 — April 15",
    processing_time: "N/A — filed with main return",
    official_url: "https://www.irs.gov/forms-pubs/about-schedule-c-form-1040",
    difficulty_level: "moderate",
    cost: "Free",
    affiliate_type: "turbotax",
    situations: ["freelance-income", "self-employed", "starting-business"]
  }
];

const uscisForms = [
  {
    slug: "uscis-i-485",
    form_number: "I-485",
    name: "Application to Register Permanent Residence or Adjust Status",
    agency: "USCIS",
    agency_slug: "uscis",
    plain_english: "This is the green card application for people already in the US. If you're eligible to become a permanent resident without leaving the country, this is your form.",
    who_needs_it: "People in the US who are eligible to apply for a green card without leaving.",
    deadline: "Varies by visa category — check USCIS Visa Bulletin",
    processing_time: "8-48 months depending on category and country",
    official_url: "https://www.uscis.gov/i-485",
    difficulty_level: "complex",
    cost: "$1,440 (includes biometrics)",
    affiliate_type: "boundless",
    is_featured: true,
    situations: ["green-card", "permanent-residence"]
  },
  {
    slug: "uscis-i-765",
    form_number: "I-765",
    name: "Application for Employment Authorization",
    agency: "USCIS",
    agency_slug: "uscis",
    plain_english: "This is the work permit application. If you're in the US on a visa that doesn't automatically allow you to work, you need this form.",
    who_needs_it: "People on certain visas who want to work legally in the US.",
    deadline: "File as early as possible — processing takes months",
    processing_time: "3-7 months (regular), 30 days (premium in some cases)",
    official_url: "https://www.uscis.gov/i-765",
    difficulty_level: "moderate",
    cost: "$410",
    affiliate_type: "boundless",
    situations: ["work-permit", "employment-authorization"]
  },
  {
    slug: "uscis-n-400",
    form_number: "N-400",
    name: "Application for Naturalization",
    agency: "USCIS",
    agency_slug: "uscis",
    plain_english: "This is the citizenship application. If you've been a green card holder for at least 5 years (or 3 years if married to a US citizen), this is how you become a US citizen.",
    who_needs_it: "Permanent residents (green card holders) who meet the eligibility requirements for citizenship.",
    deadline: "No deadline — apply when eligible",
    processing_time: "8-24 months",
    official_url: "https://www.uscis.gov/n-400",
    difficulty_level: "moderate",
    cost: "$725 (includes biometrics)",
    affiliate_type: "boundless",
    is_featured: true,
    situations: ["us-citizenship", "naturalization"]
  }
];

const ssaForms = [
  {
    slug: "ssa-ss5",
    form_number: "SS-5",
    name: "Application for a Social Security Card",
    agency: "SSA",
    agency_slug: "ssa",
    plain_english: "This is how you get or replace a Social Security card. Everyone born in the US gets one automatically, but you need this form to replace a lost card or get one for the first time.",
    who_needs_it: "Anyone who needs a new, replacement, or corrected Social Security card.",
    deadline: "No deadline",
    processing_time: "2-4 weeks",
    official_url: "https://www.ssa.gov/forms/ss-5.pdf",
    difficulty_level: "easy",
    cost: "Free",
    affiliate_type: null,
    situations: ["lost-social-security-card", "name-change", "new-to-us"]
  }
];

const businessForms = [
  {
    slug: "state-articles-of-organization",
    form_number: "Articles of Organization",
    name: "Articles of Organization — LLC Formation",
    agency: "State Secretary of State",
    agency_slug: "state-sos",
    plain_english: "This is the document that officially creates your LLC. You file it with your state government and pay a fee, and your business legally exists.",
    who_needs_it: "Anyone forming an LLC.",
    deadline: "File before starting business operations",
    processing_time: "1-10 business days (varies by state)",
    official_url: "https://www.sba.gov/business-guide/launch-your-business/register-your-business",
    difficulty_level: "easy",
    cost: "$50-500 depending on state",
    affiliate_type: "northwest",
    is_featured: true,
    situations: ["forming-llc", "starting-business"]
  }
];

const identityDocs = [
  {
    slug: "us-passport",
    name: "US Passport",
    category: "travel-identity",
    plain_english: "Your passport is your most powerful identity document. Required for international travel and accepted as ID everywhere in the US. Processing times have gotten much longer — apply early.",
    who_needs_it: "Anyone who travels internationally or wants a strong government-issued ID.",
    required_documents: [
      "DS-11 application form (new passport) or DS-82 (renewal)",
      "Proof of US citizenship (birth certificate or previous passport)",
      "Government-issued photo ID",
      "Passport photo",
      "Application fee"
    ],
    processing_time: "6-8 weeks routine, 2-3 weeks expedited",
    cost: "$130 (renewal) or $165 (new) + $35 execution fee for new",
    renewal_period: "Every 10 years (adults), every 5 years (under 16)",
    official_url: "https://travel.state.gov/content/travel/en/passports.html",
    is_featured: true,
  },
  {
    slug: "real-id",
    name: "Real ID",
    category: "domestic-identity",
    plain_english: "Real ID is an upgraded driver's license that meets federal security standards. As of May 2025, you need one (or a passport) to board domestic flights and enter federal buildings.",
    who_needs_it: "Anyone who flies domestically or needs access to federal facilities. If your license says 'Not for Federal Purposes' you need to upgrade.",
    required_documents: [
      "Proof of identity (birth certificate or passport)",
      "Proof of Social Security number",
      "Two proofs of state residency",
      "Current driver's license"
    ],
    processing_time: "Same day at DMV",
    cost: "Varies by state — typically $20-40 upgrade fee",
    renewal_period: "Same as your driver's license",
    official_url: "https://www.dhs.gov/real-id",
    state_specific: true,
    is_featured: true,
  },
  {
    slug: "birth-certificate",
    name: "Birth Certificate",
    category: "vital-records",
    plain_english: "Your birth certificate is the foundation document for almost every other identity document. You need it to get a passport, Real ID, Social Security card, and more.",
    who_needs_it: "Everyone — especially when applying for other identity documents.",
    required_documents: [
      "Government-issued ID",
      "Proof of relationship if requesting for someone else",
      "Application form (varies by state)",
      "Fee"
    ],
    processing_time: "2-6 weeks by mail, same day in person",
    cost: "$15-30 depending on state",
    renewal_period: "No expiration — but certified copy needed for official purposes",
    official_url: "https://www.cdc.gov/nchs/w2w/index.htm",
    state_specific: true,
    is_featured: true
  }
];

const situations = [
  {
    slug: "starting-business",
    title: "Starting a Business",
    description: "Forms and documents needed to legally start a business in the US",
    plain_english: "Starting a business involves more paperwork than most people expect. Here's exactly what you need and in what order.",
    category: "business",
    search_volume_estimate: "high"
  },
  {
    slug: "filing-taxes",
    title: "Filing Taxes for the First Time",
    description: "Tax forms needed for first-time filers",
    plain_english: "First time filing taxes? Here's every form you might need based on your situation.",
    category: "tax",
    search_volume_estimate: "very-high"
  },
  {
    slug: "freelance-income",
    title: "I Have Freelance or Gig Income",
    description: "Tax forms for freelancers, contractors, and gig workers",
    plain_english: "Freelancers and gig workers have different tax obligations than employees. Here's what you need.",
    category: "tax",
    search_volume_estimate: "very-high"
  },
  {
    slug: "new-job",
    title: "Starting a New Job",
    description: "Forms your employer will ask you to fill out",
    plain_english: "First day at a new job? You'll need to fill out these forms before your first paycheck.",
    category: "employment",
    search_volume_estimate: "high"
  },
  {
    slug: "forming-llc",
    title: "Forming an LLC",
    description: "Everything needed to legally form a limited liability company",
    plain_english: "Forming an LLC protects your personal assets and makes your business official. Here's every form involved.",
    category: "business",
    search_volume_estimate: "very-high"
  },
  {
    slug: "green-card",
    title: "Applying for a Green Card",
    description: "Forms required for permanent residence application",
    plain_english: "The green card process involves multiple forms. Here's what you need based on how you're applying.",
    category: "immigration",
    search_volume_estimate: "very-high"
  }
];

window.irsForms = irsForms;
window.uscisForms = uscisForms;
window.ssaForms = ssaForms;
window.businessForms = businessForms;
window.identityDocs = identityDocs;
window.situations = situations;
