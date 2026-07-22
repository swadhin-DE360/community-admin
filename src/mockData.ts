export interface Complaint {
  id: string;
  title: string;
  category: string;
  dateFiled: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  residentName: string;
  residentPhone: string;
  residentAddress: string;
  photoUrl: string;
  description: string;
  engineer: string;
  closureComment?: string;
}

export interface MegaphoneAlert {
  id: string;
  title: string;
  message: string;
  severity: 'Critical' | 'Warning' | 'Info';
  datePublished: string;
}

export interface Campaign {
  id: string;
  title: string;
  type: 'Cleanliness' | 'Health Screening' | 'Awareness' | 'Other';
  date: string;
  time: string;
  venue: string;
  organizer: string;
  description: string;
  interestedCitizensCount?: number;
}

export interface CitizenScheme {
  id: string;
  name: string;
  category: string;
  keyBenefits: string[];
  eligibility: string[];
  requiredDocuments: string[];
  applyUrl: string;
  overview: string;
  pdfUrl?: string;
  pdfName?: string;
}

export interface DirectoryContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  type?: string;
}

export const initialComplaints: Complaint[] = [
  {
    id: "COMP-2026-001",
    title: "Burst Water Pipeline on 4th Cross Road",
    category: "Water Supply",
    dateFiled: "2026-07-16 10:15 AM",
    status: "Pending",
    residentName: "Ramesh Kumar",
    residentPhone: "+91 98450 12345",
    residentAddress: "No. 42, 4th Cross Road, Ward 18, Bangalore",
    photoUrl: "https://images.unsplash.com/photo-1542060748-10c28b629f6f?auto=format&fit=crop&q=80&w=400",
    description: "Main supply pipeline has burst, causing heavy water logging on the street and leading to drinking water waste for the last 5 hours. Please fix immediately.",
    engineer: "Unassigned",
  },
  {
    id: "COMP-2026-002",
    title: "Streetlight Not Working near Sector 3 Park",
    category: "Electricity",
    dateFiled: "2026-07-15 03:30 PM",
    status: "In Progress",
    residentName: "Priyanka Sen",
    residentPhone: "+91 97654 32109",
    residentAddress: "Apt 304, Green Meadows, Sector 3, Ward 18",
    photoUrl: "https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?auto=format&fit=crop&q=80&w=400",
    description: "Three consecutive streetlights are broken since Monday. The park perimeter is extremely dark and unsafe for walkers in the evening.",
    engineer: "Er. Vignesh Prasad",
  },
  {
    id: "COMP-2026-003",
    title: "Pothole Congestion at Main Market Intersection",
    category: "Roads & Traffic",
    dateFiled: "2026-07-14 11:00 AM",
    status: "Resolved",
    residentName: "Anwar Sheikh",
    residentPhone: "+91 99001 88776",
    residentAddress: "Shop No. 12, Ward 18 Market Complex Square",
    photoUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=400",
    description: "A huge pothole has formed right at the turn of the busy market road, causing heavy traffic snarls and multiple minor bike slips.",
    engineer: "Er. Vignesh Prasad",
    closureComment: "Pothole filled with cold asphalt mix. Road levelled and traffic flow restored.",
  },
  {
    id: "COMP-2026-004",
    title: "Garbage Pileup Near Government School Gate",
    category: "Waste Management",
    dateFiled: "2026-07-13 09:45 AM",
    status: "Pending",
    residentName: "Meenakshi Iyer",
    residentPhone: "+91 94480 55443",
    residentAddress: "Opp. Ward 18 Govt Primary School, Link Road",
    photoUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=400",
    description: "Large heap of domestic waste dumped right next to the school gate. Stray dogs are scattering it and it smells terrible. Children are exposed to health risks.",
    engineer: "Unassigned",
  },
  {
    id: "COMP-2026-005",
    title: "Stray Dog Menace in Sector 1 Block C",
    category: "Public Safety",
    dateFiled: "2026-07-12 04:20 PM",
    status: "Resolved",
    residentName: "Vikram Malhotra",
    residentPhone: "+91 98860 11223",
    residentAddress: "House 102, Block C, Sector 1, Ward 18",
    photoUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400",
    description: "Pack of 8-10 aggressive stray dogs nesting in the local children's park. They chase children and two delivery personnel were bitten last week.",
    engineer: "Er. Amit Shah",
    closureComment: "Liaised with Animal Welfare Board. Dogs caught, vaccinated, sterilized, and returned safely as per guidelines.",
  }
];

export const initialAlerts: MegaphoneAlert[] = [
  {
    id: "ALERT-001",
    title: "Scheduled Power Outage: Sector 2 & 3",
    message: "Maintenance work on the Sector 2 substation will cause a complete power outage on July 19th from 10:00 AM to 2:00 PM. Please plan accordingly.",
    severity: "Warning",
    datePublished: "2026-07-16 09:30 AM",
  },
  {
    id: "ALERT-002",
    title: "Heavy Rainfall Advisory: Water Logging Alert",
    message: "Meteorological Department predicts heavy downpour over next 48 hours. Drainage teams are on alert. Contact emergency ward helpline for support.",
    severity: "Critical",
    datePublished: "2026-07-17 11:15 AM",
  },
  {
    id: "ALERT-003",
    title: "Dengue Awareness Pamphlet Distribution",
    message: "Health workers will visit door-to-door starting tomorrow to distribute mosquito repellent info and check for stagnant water.",
    severity: "Info",
    datePublished: "2026-07-15 04:00 PM",
  }
];

export const initialCampaigns: Campaign[] = [
  {
    id: "CAMP-001",
    title: "Plastic-Free Ward 18 Mega Cleanliness Drive",
    type: "Cleanliness",
    date: "2026-07-20",
    time: "07:30 AM - 11:00 AM",
    venue: "Starting from Ward Office to Main Market",
    organizer: "Ward 18 Youth Association & Citizen Forum",
    description: "Volunteers gathering to collect single-use plastics and raise shopkeeper awareness. Cloth bags will be distributed free of cost.",
    interestedCitizensCount: 142
  },
  {
    id: "CAMP-002",
    title: "Free Monsoon Health Screening & Vaccine Camp",
    type: "Health Screening",
    date: "2026-07-26",
    time: "09:00 AM - 04:00 PM",
    venue: "Community Hall, Sector 2",
    organizer: "Ward 18 Health Department & Apollo Clinic",
    description: "General body checkup, blood sugar, dengue testing, and flu shots. Pediatric consultation available. Free medicines for minor ailments.",
    interestedCitizensCount: 98
  },
  {
    id: "CAMP-003",
    title: "Rainwater Harvesting Awareness Seminar",
    type: "Awareness",
    date: "2026-08-02",
    time: "11:00 AM - 01:00 PM",
    venue: "Ward 18 Library Conference Hall",
    organizer: "Water Board Engineers Guild",
    description: "Expert talk on simple retrofitting techniques for households to harvest rainwater. Guidance on getting govt subsidies for setups.",
    interestedCitizensCount: 65
  }
];

export const initialSchemes: CitizenScheme[] = [
  {
    id: "SCHEME-001",
    name: "Gruha Jyothi Electricity Subsidy Scheme",
    category: "Utilities",
    keyBenefits: [
      "Zero electricity bills for domestic usage under 200 units per month.",
      "Applies automatically upon registration verification."
    ],
    eligibility: [
      "All domestic households consuming less than 200 units of electricity per month.",
      "Must possess a valid active domestic consumer ID."
    ],
    requiredDocuments: [
      "Aadhaar Card",
      "Electricity Bill (recent)",
      "Rental Agreement (if tenant)"
    ],
    applyUrl: "https://sevasindhu.karnataka.gov.in",
    overview: "Government subsidy offering free electricity up to 200 units for residents of the state to ease cost-of-living burdens."
  },
  {
    id: "SCHEME-002",
    name: "Senior Citizen Medical Benefit Card",
    category: "Healthcare",
    keyBenefits: [
      "Cashless health insurance card with coverage up to INR 1.5 Lakhs annually.",
      "Applicable in all empaneled public & private hospitals."
    ],
    eligibility: [
      "Residents aged 60+ years.",
      "Annual family income must be less than INR 3 Lakhs."
    ],
    requiredDocuments: [
      "Aadhaar Card",
      "Income Certificate",
      "Age Proof (Passport/PAN/Birth Certificate)"
    ],
    applyUrl: "https://health.karnataka.gov.in",
    overview: "Provides cashless hospitalization cover up to INR 1.5 Lakhs per year in empaneled hospitals."
  },
  {
    id: "SCHEME-003",
    name: "Ward 18 Green Terrace Subsidy",
    category: "Environment",
    keyBenefits: [
      "50% subsidy on purchase of kitchen gardening kits and organic seeds.",
      "Composters and solar installation panels at highly subsidized rates.",
      "Free rooftop solar feasibility report by ward experts."
    ],
    eligibility: [
      "Independent house residents in Ward 18.",
      "Setup space for solar panels or kitchen gardening must exceed 500 sq ft."
    ],
    requiredDocuments: [
      "Address Proof",
      "Property Tax Receipt",
      "Rooftop Photos"
    ],
    applyUrl: "https://bbmp.gov.in/green-terrace",
    overview: "A local ward initiative providing 50% discount on seeds, planters, composters, and technical solar installation support."
  }
];

export const initialDirectory: DirectoryContact[] = [
  {
    id: "DIR-001",
    name: "Ambulance Service",
    role: "Emergency medical transport and trauma response team",
    phone: "108",
    email: "N/A",
    type: "Emergency Helpline"
  },
  {
    id: "DIR-002",
    name: "Sanitation Helpline",
    role: "Ward 18 garbage collection and sewage complaint desk",
    phone: "+91 80222 55555",
    email: "sanitation.help@bbmp.gov.in",
    type: "Municipal Corporation"
  },
  {
    id: "DIR-003",
    name: "Electricity Helpline",
    role: "Power outage and grid breakdown helpline",
    phone: "1912",
    email: "helpline@bescom.co.in",
    type: "Emergency Helpline"
  },
  {
    id: "DIR-004",
    name: "Smt. Arundhati Gowda",
    role: "Ward Corporator / Counselor Representative",
    phone: "+91 98450 99887",
    email: "arundhati.gowda@bbmp.gov.in",
    type: "Ward Representative"
  }
];

export const engineersList = [
  "Er. Vignesh Prasad",
  "Er. Amit Shah",
  "Er. Sandeep Patil",
  "Er. K. R. Rao"
];
