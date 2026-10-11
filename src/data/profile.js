// Single source of truth for all portfolio content.
// Every fact below comes from Sagar Bhunya's CV. Edit here to update the site.

// Public files are resolved against the deploy base so the site works under a sub-path (GitHub Pages).
const asset = (file) => `${import.meta.env.BASE_URL}${file}`;

export const profile = {
  name: 'Sagar Bhunya',
  title: 'Diploma Mechanical Engineer | Quality Engineer Trainee',
  tagline: 'Hands-on training in quality inspection, manufacturing processes, and mechanical workshop practices.',
  location: 'Jhargram, West Bengal, India',

  contact: {
    email: 'sagarbhunya30@gmail.com',
    emailSubject: 'Mechanical / Quality Engineering Opportunity',
    phoneDisplay: '+91 8167048501',
    phoneHref: '+918167048501',
  },

  cv: {
    href: asset('Sagar_Bhunya_CV.pdf'),
    fileName: 'Sagar_Bhunya_CV.pdf',
  },

  photo: {
    webp: { 480: asset('sagar-bhunya-480.webp'), 800: asset('sagar-bhunya-800.webp') },
    jpg: { 480: asset('sagar-bhunya-480.jpg'), 800: asset('sagar-bhunya-800.jpg') },
    width: 800,
    height: 1067,
    alt: 'Portrait of Sagar Bhunya in a navy suit and tie',
  },

  summary: [
    { label: 'Diploma', value: 'Mechanical Engineering, 2025' },
    { label: 'CGPA', value: '8.45' },
    { label: 'Training', value: '1 year — Quality Engineer Trainee, Graphite India Limited' },
    { label: 'Training', value: '3 months — Industrial Trainee, CSIR–CMERI, Durgapur' },
    { label: 'Exposure', value: 'Dimensional inspection, manufacturing process monitoring, quality compliance' },
    { label: 'Projects', value: '2 technical projects' },
  ],

  about: {
    intro:
      'Sagar Bhunya is a Diploma Mechanical Engineering graduate with hands-on training in quality engineering, dimensional inspection, manufacturing process monitoring, and precision workshop practices. His background includes training at Graphite India Limited and CSIR–CMERI, Durgapur, alongside projects involving pneumatic material handling and automated waste segregation.',
    careerFocus:
      'Entry-level mechanical engineering, quality inspection, production, and manufacturing opportunities.',
    languages: [
      { name: 'Bengali', level: 'Native' },
      { name: 'Hindi', level: 'Fluent' },
      { name: 'English', level: 'Working proficiency' },
    ],
  },

  experience: [
    {
      id: 'graphite',
      role: 'Quality Engineer Trainee',
      organisation: 'Graphite India Limited',
      type: 'Training',
      duration: '1 year',
      points: [
        'Hands-on exposure to quality engineering and assurance.',
        'Dimensional inspection.',
        'Manufacturing process monitoring.',
        'Material testing verification.',
        'Quality compliance checks in accordance with industrial standards.',
      ],
    },
    {
      id: 'cmeri',
      role: 'Vocational / Industrial Trainee',
      organisation: 'CSIR – Central Mechanical Engineering Research Institute (CMERI), Durgapur',
      shortOrganisation: 'CSIR–CMERI, Durgapur',
      type: 'Training',
      duration: '3 months',
      points: [
        'Exposure to mechanical fabrication.',
        'Precision workshop practices.',
        'Engineering research methodologies.',
      ],
    },
  ],

  skills: [
    {
      id: 'design',
      group: 'Design and software',
      icon: 'drawing',
      items: ['AutoCAD', 'SAP', 'MS Office', 'Basic computer skills'],
    },
    {
      id: 'workshop',
      group: 'Workshop operations',
      icon: 'lathe',
      items: ['Lathe operation', 'Drilling machine operation'],
    },
    {
      id: 'quality',
      group: 'Quality',
      icon: 'gauge',
      items: [
        'Quality inspection',
        'Dimensional inspection',
        'Manufacturing process monitoring',
        'Material testing verification',
        'Quality compliance checks',
      ],
    },
  ],

  projects: [
    {
      id: 'conveyor',
      drawingNo: 'DWG-01',
      title: 'Contactless Conveyor System Using Air Pressure',
      summary:
        'Conceptualized and constructed a pneumatic material handling system that uses pressurized airflow to transport delicate objects without direct mechanical contact, reducing friction and wear.',
      objective:
        'Move delicate objects along a conveying path without belts, rollers, or other parts touching them, so that friction and wear from direct mechanical contact are avoided.',
      principle:
        'Pressurized air is directed against the conveying surface so the object is supported and carried along by airflow rather than by a moving mechanical surface in contact with it.',
      contribution: 'Conceptualized and constructed the contactless pneumatic material handling system.',
      concepts: ['Pneumatics', 'Air pressure and airflow', 'Friction and wear reduction', 'Material handling'],
    },
    {
      id: 'waste',
      drawingNo: 'DWG-02',
      title: 'Automated Waste Segregation Device',
      summary:
        'Designed and built an automated sorting prototype that classifies and segregates waste into wet, dry, and metallic categories using sensory detection.',
      objective:
        'Classify municipal waste into wet, dry, and metallic categories automatically to support eco-friendly waste management.',
      principle:
        'Sensory detection identifies the category of an incoming item, and the sorting mechanism directs it to the matching bin.',
      contribution: 'Designed and built the automated sorting prototype.',
      concepts: ['Sensor-based detection', 'Automation', 'Sorting mechanism design', 'Sustainable waste management'],
    },
  ],

  education: [
    {
      id: 'diploma',
      qualification: 'Diploma in Mechanical Engineering',
      institute: 'Durgapur Institute of Polytechnic',
      board: 'WBSCTVESD',
      years: '2022–2025',
      resultLabel: 'CGPA',
      result: '8.45',
    },
    {
      id: 'matric',
      qualification: 'Matriculation (Class 10)',
      institute: 'Babu Dumro High School',
      board: 'WBBSE',
      years: '2022',
      resultLabel: 'Result',
      result: 'Passed',
    },
  ],
};

export const navItems = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];

export const mailtoHref = `mailto:${profile.contact.email}?subject=${encodeURIComponent(profile.contact.emailSubject)}`;
export const telHref = `tel:${profile.contact.phoneHref}`;
