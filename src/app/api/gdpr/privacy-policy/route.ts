import { NextRequest, NextResponse } from 'next/server';

// Privacy Policy content compliant with DfE requirements
const PRIVACY_POLICY = {
  version: '1.0',
  lastUpdated: '2025-01-14',
  sections: {
    introduction: {
      title: 'Privacy Policy - EdPsych AI Platform',
      content: `This privacy policy explains how we collect, use, and protect your personal data in compliance with UK GDPR and DfE requirements. As an educational platform serving schools, teachers, students, and parents, we are committed to protecting the privacy and safety of all users, especially children.`,
    },
    dataController: {
      title: 'Data Controller',
      content: `EdPsych AI Platform is the data controller responsible for your personal data. Schools using our platform may also act as joint data controllers for their students' data.`,
    },
    dataCollection: {
      title: 'What Data We Collect',
      categories: [
        {
          name: 'Account Information',
          data: ['Name', 'Email address', 'Date of birth (for age verification)', 'School affiliation', 'Role (student, teacher, parent, etc.)'],
        },
        {
          name: 'Educational Data',
          data: ['Learning progress', 'Assessment results', 'Course enrollments', 'Learning preferences', 'SEN/disability information (optional)'],
        },
        {
          name: 'Usage Data',
          data: ['Login times and frequency', 'Features used', 'Content accessed', 'Device and browser information'],
        },
        {
          name: 'Safety Data',
          data: ['Safeguarding alerts', 'Content moderation flags', 'Communication logs (for safety monitoring)'],
        },
      ],
    },
    legalBasis: {
      title: 'Legal Basis for Processing',
      bases: [
        {
          type: 'Legitimate Interests',
          description: 'To provide educational services and ensure platform safety',
        },
        {
          type: 'Legal Obligation',
          description: 'To comply with safeguarding requirements and DfE regulations',
        },
        {
          type: 'Consent',
          description: 'For optional features, marketing communications, and data sharing',
        },
        {
          type: 'Vital Interests',
          description: 'In safeguarding emergencies to protect children',
        },
      ],
    },
    dataUse: {
      title: 'How We Use Your Data',
      purposes: [
        'Provide personalized learning experiences',
        'Track educational progress and generate reports',
        'Ensure child safety through content moderation',
        'Communicate with users about their account',
        'Improve our services through anonymized analytics',
        'Comply with legal and regulatory requirements',
      ],
    },
    dataSharing: {
      title: 'Who We Share Data With',
      recipients: [
        {
          recipient: 'Schools',
          data: 'Student progress, attendance, safeguarding concerns',
          basis: 'Educational necessity and safeguarding',
        },
        {
          recipient: 'Parents/Guardians',
          data: 'Child\'s learning progress and safety alerts',
          basis: 'Parental rights and child welfare',
        },
        {
          recipient: 'Safeguarding Authorities',
          data: 'Serious safeguarding concerns only',
          basis: 'Legal obligation and vital interests',
        },
        {
          recipient: 'Service Providers',
          data: 'Limited data for hosting, security, and support',
          basis: 'Data processing agreements in place',
        },
      ],
    },
    retention: {
      title: 'Data Retention',
      periods: [
        {
          dataType: 'Active account data',
          period: 'Duration of account plus 1 year',
        },
        {
          dataType: 'Educational records',
          period: '7 years after last activity (DfE requirement)',
        },
        {
          dataType: 'Safeguarding records',
          period: '25 years or until age 25 (whichever is longer)',
        },
        {
          dataType: 'Technical logs',
          period: '90 days',
        },
      ],
    },
    rights: {
      title: 'Your Rights',
      rights: [
        'Access your personal data',
        'Correct inaccurate data',
        'Request deletion (subject to retention requirements)',
        'Restrict processing',
        'Data portability',
        'Object to processing',
        'Withdraw consent',
      ],
    },
    children: {
      title: 'Children\'s Privacy',
      content: `We take special care to protect children's data:
        - Students under 16 require parental consent
        - Enhanced content moderation for child safety
        - Age-appropriate privacy controls
        - No marketing to children
        - Restricted data sharing
        - Regular safety reviews`,
    },
    security: {
      title: 'Data Security',
      measures: [
        'Encryption in transit and at rest',
        'Multi-factor authentication available',
        'Regular security audits',
        'Staff training on data protection',
        'Incident response procedures',
        'Access controls and monitoring',
      ],
    },
    contact: {
      title: 'Contact Us',
      details: {
        dpo: 'Data Protection Officer: dpo@edpsych-ai.edu',
        general: 'General inquiries: privacy@edpsych-ai.edu',
        complaints: 'You have the right to complain to the ICO',
      },
    },
  },
};

// GET - Retrieve privacy policy
export async function GET(req: NextRequest) {
  const format = req.nextUrl.searchParams.get('format');
  
  if (format === 'html') {
    // Return HTML formatted privacy policy
    const html = generateHTMLPolicy(PRIVACY_POLICY);
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
  
  // Return JSON by default
  return NextResponse.json(PRIVACY_POLICY);
}

function generateHTMLPolicy(policy: typeof PRIVACY_POLICY): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy - EdPsych AI Platform</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      line-height: 1.6; 
      max-width: 800px; 
      margin: 0 auto; 
      padding: 20px;
      color: #333;
    }
    h1, h2 { color: #2c3e50; }
    h1 { border-bottom: 2px solid #3498db; padding-bottom: 10px; }
    h2 { margin-top: 30px; }
    ul { margin-left: 20px; }
    .section { margin-bottom: 30px; }
    .last-updated { color: #666; font-style: italic; }
  </style>
</head>
<body>
  <h1>Privacy Policy - EdPsych AI Platform</h1>
  <p class="last-updated">Last updated: ${policy.lastUpdated} | Version: ${policy.version}</p>
  
  ${Object.entries(policy.sections).map(([key, section]) => {
    if ('content' in section) {
      return `
        <div class="section">
          <h2>${section.title}</h2>
          <p>${section.content}</p>
        </div>
      `;
    } else if ('categories' in section) {
      return `
        <div class="section">
          <h2>${section.title}</h2>
          ${section.categories.map(cat => `
            <h3>${cat.name}</h3>
            <ul>
              ${cat.data.map(item => `<li>${item}</li>`).join('')}
            </ul>
          `).join('')}
        </div>
      `;
    } else if ('purposes' in section || 'rights' in section || 'measures' in section) {
      let items: string[] = [];
      if ('purposes' in section) items = section.purposes;
      else if ('rights' in section) items = section.rights;
      else if ('measures' in section) items = section.measures;
      
      return `
        <div class="section">
          <h2>${section.title}</h2>
          <ul>
            ${items.map((item: string) => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      `;
    } else if ('periods' in section) {
      return `
        <div class="section">
          <h2>${section.title}</h2>
          <ul>
            ${section.periods.map(p => `<li><strong>${p.dataType}:</strong> ${p.period}</li>`).join('')}
          </ul>
        </div>
      `;
    } else if ('bases' in section) {
      return `
        <div class="section">
          <h2>${section.title}</h2>
          <ul>
            ${section.bases.map(b => `<li><strong>${b.type}:</strong> ${b.description}</li>`).join('')}
          </ul>
        </div>
      `;
    } else if ('recipients' in section) {
      return `
        <div class="section">
          <h2>${section.title}</h2>
          ${section.recipients.map(r => `
            <h3>${r.recipient}</h3>
            <p><strong>Data shared:</strong> ${r.data}</p>
            <p><strong>Basis:</strong> ${r.basis}</p>
          `).join('')}
        </div>
      `;
    } else if ('details' in section) {
      return `
        <div class="section">
          <h2>${section.title}</h2>
          <ul>
            ${Object.entries(section.details).map(([k, v]) => `<li>${v}</li>`).join('')}
          </ul>
        </div>
      `;
    }
    return '';
  }).join('')}
</body>
</html>
  `;
}