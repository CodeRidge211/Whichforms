// IsPermitRequired — Permit Check API
// Sovereign Ridge Partners LLC

import { PERMIT_DATA } from '../../lib/data';

export default async function handler(req, res) {
  const { location, project } = req.query;

  if (!location || !project) {
    return res.status(400).json({ error: 'Location and project parameters required' });
  }

  try {
    // Try to use database (when available)
    // For now, use fallback data
    const key = `${location}+${project}`;
    const data = FALLBACK_DATA[key];

    if (data) {
      return res.json({
        ...data,
        location,
        project_type: project
      });
    }

    // Try to find partial match in PERMIT_DATA
    const match = PERMIT_DATA.find(p => 
      p.location.toLowerCase() === location.toLowerCase() &&
      p.project_type.toLowerCase() === project.toLowerCase()
    );

    if (match) {
      return res.json(match);
    }

    // No match found - return generic response
    return res.json({
      requires_permit: null,
      location,
      project_type: project,
      requirements: 'Contact your local building department for specific permit requirements for this project type.',
      exceptions: 'Requirements vary by city, county, and project specifications.',
      estimated_cost_range: 'Varies by jurisdiction',
      processing_time: 'Contact local authority',
      application_url: null,
      source: 'Local jurisdiction'
    });

  } catch (error) {
    console.error('Permit check error:', error);
    return res.status(500).json({ error: 'Failed to check permit requirements' });
  }
}