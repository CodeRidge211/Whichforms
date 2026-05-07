// IsPermitRequired — Default Permit Data (for demo/fallback)
// Sovereign Ridge Partners LLC

const PERMIT_DATA = [
  // Roofing Projects
  { location: 'California', location_type: 'state', project_type: 'roofing', requires_permit: true, requirements: 'Standard permit required for roof replacement. Tear-off requires additional debris handling documentation.', exceptions: 'Shingle-over permitted in some counties if existing roof is in good condition and structural capacity allows.', estimated_cost_range: '$500-$2,000', processing_time: '3-14 days', application_url: 'https://www.bsa.ca.gov/', source: 'California State Licensing Board' },
  { location: 'New York', location_type: 'state', project_type: 'roofing', requires_permit: true, requirements: 'NYC requires work permit for any roof replacement. FDNY coordination required for buildings over 75 feet.', exceptions: 'Minor repairs under 10 squares may not require permit in some boroughs.', estimated_cost_range: '$800-$3,000', processing_time: '5-21 days', application_url: 'https://www1.nyc.gov/site/buildings/index.page', source: 'NYC Department of Buildings' },
  { location: 'Texas', location_type: 'state', project_type: 'roofing', requires_permit: false, requirements: 'No state-level permit required. Most counties and cities handle independently.', exceptions: 'HOA restrictions may apply in deed-restricted communities.', estimated_cost_range: '$0-$500', processing_time: 'Varies by locality', application_url: 'https://www.tdlr.texas.gov/', source: 'Texas Department of Licensing & Regulation' },
  { location: 'Florida', location_type: 'state', project_type: 'roofing', requires_permit: true, requirements: 'Required for all re-roofing projects. Must submit wind mitigation form.', exceptions: 'Reroofing over existing roof prohibited in high-velocity hurricane zones.', estimated_cost_range: '$400-$1,500', processing_time: '3-10 days', application_url: 'https://www.myflorlicense.com/', source: 'Florida Department of Business & Professional Regulation' },
  
  // Deck Construction
  { location: 'California', location_type: 'state', project_type: 'deck', requires_permit: true, requirements: 'Building permit required for decks over 30 inches from grade. Structural calculations required for elevated decks.', exceptions: 'Ground-level decks under 200 sq ft may be exempt in some jurisdictions.', estimated_cost_range: '$500-$1,500', processing_time: '10-30 days', application_url: 'https://www.bsa.ca.gov/', source: 'California Building Standards Commission' },
  { location: 'Virginia', location_type: 'state', project_type: 'deck', requires_permit: true, requirements: 'Permit required for any deck over 200 sq ft or 30 inches above grade. Engineered plans may be required.', exceptions: 'Detached structures under 256 sq ft may qualify for simplified permit.', estimated_cost_range: '$300-$800', processing_time: '5-15 days', application_url: 'https://www.dpor.virginia.gov/', source: 'Virginia Department of Professional & Occupational Regulation' },
  { location: 'Washington', location_type: 'state', project_type: 'deck', requires_permit: true, requirements: 'Building permit required. Structural engineer stamp required for decks over 30 inches.', exceptions: 'Free-standing decks under 200 sq ft have simplified requirements.', estimated_cost_range: '$400-$1,200', processing_time: '10-25 days', application_url: 'https://lni.wa.gov/', source: 'Washington State Department of Labor & Industries' },
  
  // Solar Panel Installation
  { location: 'California', location_type: 'state', project_type: 'solar', requires_permit: true, requirements: 'Standard electrical and building permits. Utility interconnection application required.', exceptions: 'Certain low-capacity systems in wildfire risk areas may have expedited review.', estimated_cost_range: '$500-$2,500', processing_time: '7-30 days', application_url: 'https://www.cpuc.ca.gov/', source: 'California Public Utilities Commission' },
  { location: 'Arizona', location_type: 'state', project_type: 'solar', requires_permit: true, requirements: 'Electrical permit required. Most jurisdictions have expedited solar permit processes.', exceptions: 'Some municipalities have blanket solar permits for residential under 10kW.', estimated_cost_range: '$200-$800', processing_time: '3-14 days', application_url: 'https://az.gov/', source: 'Arizona state government' },
  { location: 'New Jersey', location_type: 'state', project_type: 'solar', requires_permit: true, requirements: 'Electrical and construction permits required. Utility approval required for grid connection.', exceptions: 'Sunshine Energy program provides streamlined process for approved contractors.', estimated_cost_range: '$300-$1,000', processing_time: '14-45 days', application_url: 'https://www.njcleanenergy.com/', source: 'New Jersey Board of Public Utilities' },
  
  // ADU (Accessory Dwelling Unit)
  { location: 'California', location_type: 'state', project_type: 'adu', requires_permit: true, requirements: 'Pre-approved ADU plans available in many jurisdictions. Must comply with local zoning and building codes.', exceptions: 'Junior ADUs (JADU) have streamlined requirements in most California cities.', estimated_cost_range: '$2,000-$10,000', processing_time: '60-180 days', application_url: 'https://hcd.ca.gov/', source: 'California Housing and Community Development' },
  { location: 'Washington', location_type: 'state', project_type: 'adu', requires_permit: true, requirements: 'Building and electrical permits required. ADU must meet all residential building codes.', exceptions: 'Detached ADUs under 40 sq ft in some counties may have exemptions.', estimated_cost_range: '$1,500-$5,000', processing_time: '45-120 days', application_url: 'https://www.commerce.wa.gov/', source: 'Washington State Commerce' },
  
  // Fence Installation
  { location: 'California', location_type: 'state', project_type: 'fence', requires_permit: false, requirements: 'No state permit required. Height limits vary: front 42 inches, side/rear 6 feet.', exceptions: 'Historic districts and certain communities have additional requirements.', estimated_cost_range: '$0-$200', processing_time: 'Varies by locality', application_url: 'https://www.bsa.ca.gov/', source: 'California Building Standards Commission' },
  { location: 'New York', location_type: 'state', project_type: 'fence', requires_permit: false, requirements: 'No permit for fences under 6 feet. Side yard and rear yard fences have no height limit in most zones.', exceptions: 'Pool barriers and certain commercial properties have different requirements.', estimated_cost_range: '$0-$100', processing_time: 'N/A', application_url: 'https://www1.nyc.gov/site/buildings/index.page', source: 'NYC Department of Buildings' },
  { location: 'Texas', location_type: 'state', project_type: 'fence', requires_permit: false, requirements: 'No state permit. Most cities require fence permit with location-specific setbacks.', exceptions: 'Some HOA communities have stricter requirements than local codes.', estimated_cost_range: '$0-$300', processing_time: '7-21 days', application_url: 'https://www.tdlr.texas.gov/', source: 'Texas Department of Licensing & Regulation' },
  
  // Pool Installation
  { location: 'California', location_type: 'state', project_type: 'pool', requires_permit: true, requirements: 'Building, electrical, and plumbing permits required. Enclosure/barrier requirements mandatory.', exceptions: 'Above-ground pools under 24 inches may be exempt in some jurisdictions.', estimated_cost_range: '$1,000-$5,000', processing_time: '30-90 days', application_url: 'https://www.cpuc.ca.gov/', source: 'California Department of Health' },
  { location: 'Florida', location_type: 'state', project_type: 'pool', requires_permit: true, requirements: 'Pool permit required with contractor registration. Enclosure requirements strict due to drowning prevention.', exceptions: 'Portable/collapsible pools under 24 inches have exemptions.', estimated_cost_range: '$800-$3,000', processing_time: '14-60 days', application_url: 'https://www.myflorlicense.com/', source: 'Florida DBPR' },
  
  // General Renovation
  { location: 'California', location_type: 'state', project_type: 'renovation', requires_permit: true, requirements: 'Building permit required for structural changes, electrical, plumbing, and HVAC work.', exceptions: 'Cosmetic work (paint, flooring, cabinetry) typically exempt.', estimated_cost_range: '$500-$5,000', processing_time: '14-60 days', application_url: 'https://www.bsa.ca.gov/', source: 'California Building Standards Commission' },
  { location: 'New York', location_type: 'state', project_type: 'renovation', requires_permit: true, requirements: 'Work permit required for most renovations. DOB filing required for structural changes.', exceptions: 'Minor cosmetic work under $25,000 may qualify for simplified filing.', estimated_cost_range: '$300-$10,000', processing_time: '21-90 days', application_url: 'https://www1.nyc.gov/site/buildings/index.page', source: 'NYC Department of Buildings' },
  { location: 'Texas', location_type: 'state', project_type: 'renovation', requires_permit: true, requirements: 'Permit required for structural, electrical, and plumbing work.', exceptions: 'Interior cosmetic renovations exempt in most jurisdictions.', estimated_cost_range: '$200-$3,000', processing_time: '7-30 days', application_url: 'https://www.tdlr.texas.gov/', source: 'Texas Department of Licensing & Regulation' },
  
  // Commercial
  { location: 'California', location_type: 'state', project_type: 'commercial', requires_permit: true, requirements: 'Plan check required for all commercial projects. Fire, accessibility, and structural reviews mandatory.', exceptions: 'Minor tenant improvements may have expedited review process.', estimated_cost_range: '$2,000-$50,000', processing_time: '60-180 days', application_url: 'https://www.bsa.ca.gov/', source: 'California Building Standards Commission' },
];

const LOCATIONS = [
  'California', 'New York', 'Texas', 'Florida', 'Washington', 
  'Arizona', 'New Jersey', 'Virginia', 'Colorado', 'Oregon',
  'Georgia', 'North Carolina', 'Michigan', 'Ohio', 'Pennsylvania'
];

const PROJECT_TYPES = [
  { slug: 'roofing', name: 'Roofing', icon: '🏠' },
  { slug: 'deck', name: 'Deck Construction', icon: '🔨' },
  { slug: 'solar', name: 'Solar Installation', icon: '☀️' },
  { slug: 'adu', name: 'ADU (Accessory Dwelling)', icon: '🏢' },
  { slug: 'fence', name: 'Fence Installation', icon: '🪵' },
  { slug: 'pool', name: 'Pool Installation', icon: '🏊' },
  { slug: 'renovation', name: 'Home Renovation', icon: '🔧' },
  { slug: 'commercial', name: 'Commercial Project', icon: '🏢' },
  { slug: 'electrical', name: 'Electrical Work', icon: '⚡' },
  { slug: 'plumbing', name: 'Plumbing Work', icon: '🚿' },
];

module.exports = { PERMIT_DATA, LOCATIONS, PROJECT_TYPES };