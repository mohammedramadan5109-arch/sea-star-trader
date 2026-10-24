/**
 * Page content for the four service detail pages (/services/[slug]).
 * Real copy for a heavy-equipment audience — no invented prices; anything
 * monetary is "quote on request". Forms live in src/components/services/,
 * backend in service_requests (shipping/inspection/refurbishing) and
 * valuation_requests (appraisal).
 */

export interface ServiceFaqItem {
  question: string;
  answer: string;
}

export interface ServicePageContent {
  slug: 'shipping' | 'inspection' | 'appraisal' | 'refurbishing';
  /** Uppercased hero title, e.g. "Shipping". */
  keyword: string;
  tagline: string;
  heroCta: string;
  intro: string;
  subject: string;
  steps: { title: string; body: string }[];
  infoCards: { title: string; body: string }[];
  /** Optional highlighted block, e.g. shipping methods or report checklist. */
  infoNote?: { title: string; items: string[] };
  faq: ServiceFaqItem[];
}

export const SERVICE_PAGES: Record<ServicePageContent['slug'], ServicePageContent> = {
  shipping: {
    slug: 'shipping',
    keyword: 'Shipping',
    tagline: 'Door-to-door or port-to-port transport for excavators, loaders, cranes and every heavy machine between.',
    heroCta: 'Get a shipping quote',
    intro:
      'A 20-ton excavator is not a parcel. It needs the right vessel slot, the right lifting gear and paperwork that clears customs the first time. We arrange container, flat-rack, roll-on/roll-off and breakbulk shipments worldwide, and quote on request once we know the machine, the route and your deadline.',
    subject: 'a shipping quote',
    steps: [
      { title: 'Send us the route', body: 'Machine type or listing, pickup country and city, destination and your ready date.' },
      { title: 'We quote the method', body: 'Container, flat rack, RoRo or breakbulk — we recommend the cheapest safe option. Quotes on request after reviewing your route.' },
      { title: 'We ship and handle paperwork', body: 'Export declarations, certificates of origin and customs clearance prepared by our documentation team.' },
      { title: 'Delivered and offloaded', body: 'Tracking from yard to door; we coordinate offloading and handover at the destination port.' },
    ],
    infoCards: [
      { title: 'Pick the right method', body: 'Container for compact machines, flat rack for wide or tall equipment, RoRo for self-propelled machinery, breakbulk for out-of-gauge units.' },
      { title: 'What affects your quote', body: 'Dimensions and weight, the route and sailing season, port fees and handling at both ends. indicative only — exact costs come with your quote.' },
      { title: 'Paperwork included', body: 'Bill of lading, export declaration, certificate of origin and destination customs brokerage, all prepared for you.' },
      { title: 'Turnaround', body: 'Ocean transit varies by route — we confirm the timeline before you commit to anything.' },
    ],
    infoNote: {
      title: 'Shipping methods at a glance',
      items: [
        'Container — folded excavators, skid steers and attachments up to container dimensions.',
        'Flat rack — wheeled loaders, dozers and graders that exceed container width or height.',
        'RoRo — self-propelled machines driven on and off the vessel; cheapest for runners.',
        'Breakbulk — cranes and out-of-gauge lifts handled piece by piece.',
      ],
    },
    faq: [
      { question: 'Can you ship a machine that does not run?', answer: 'Yes. Non-runners ship on flat rack or breakbulk with crane loading at both ends. Tell us in the notes and we quote the loading accordingly.' },
      { question: 'RoRo or container — which is cheaper?', answer: 'For a running machine that can drive onto the vessel, RoRo is usually the most economical. Once dimensions exceed container size, flat rack or RoRo are the realistic options. We compare them for your route before quoting.' },
      { question: 'What documents do I need to provide?', answer: 'As the shipper: proof of ownership or sales invoice and a photo ID for export declaration. Everything else — bill of lading, certificate of origin, customs paperwork — we prepare.' },
      { question: 'Is cargo insurance included?', answer: 'Marine cargo insurance is optional and quoted with the shipment. We recommend insuring machinery transit especially for high-value units and can arrange the policy for you.' },
      { question: 'How is the quote calculated?', answer: 'On machine dimensions and weight, the lane between ports, the method chosen and seasonal demand. Charges at both origin and destination ports are itemised — no surprises at arrival.' },
      { question: 'How long does international shipping take?', answer: 'It depends entirely on the route and whether your machine is near a RoRo port. We give you a realistic window with the quote and track every milestone from pickup.' },
    ],
  },

  inspection: {
    slug: 'inspection',
    keyword: 'Inspection',
    tagline: 'A certified third-party inspection of any machine before you commit to buying it.',
    heroCta: 'Book an inspection',
    intro:
      'Buying an excavator you have never stood next to is the biggest single risk in cross-border equipment trade. Our certified inspectors put eyes, gauges and cameras on the machine wherever it stands, and turn what they find into a scored condition report you can negotiate with — the same standard behind the inspection score on every SeaStarTrader listing.',
    subject: 'an equipment inspection',
    steps: [
      { title: 'Book the inspection', body: 'Link the listing or describe the machine and tell us where it stands and when you need it checked.' },
      { title: 'Inspector on site', body: 'A certified inspector in the machine’s country runs the agreed inspection level and photographs everything.' },
      { title: 'Scored report back to you', body: 'You receive the written condition report, photo set and inspection score — typically within a couple of business days of the site visit.' },
      { title: 'Negotiate or walk away', body: 'Use the findings to renegotiate the price, plan repairs after shipping, or move on to the next machine with confidence.' },
    ],
    infoCards: [
      { title: 'Visual walk-around', body: 'Structural condition, obvious leaks and faults, photo documentation, hours and serial checks. Fast and affordable for straightforward deals.' },
      { title: 'Full mechanical & hydraulic', body: 'Engine start-up, operating cycles, hydraulic pressures, drivetrain and undercarriage measurements on tracked machines.' },
      { title: 'Full with fluid analysis', body: 'Lab analysis of engine oil, hydraulic oil and coolant for wear metals and contamination — the strongest evidence in fleet-grade transactions.' },
      { title: 'Pricing and turnaround', body: 'Quote on request, priced by level and location. Site to report turnaround is measured in days, not weeks.' },
    ],
    infoNote: {
      title: 'What an example inspection report covers',
      items: [
        'Engine — start-up behaviour, oil condition, blow-by, recorded hours and serial verification.',
        'Hydraulics — pump and valve condition, cycle times, pressure readings and cylinder drift.',
        'Undercarriage — track wear percentage, rollers, idlers and sprockets on tracked machines.',
        'Structure — boom, stick, bucket or frame welds, cracks and repair history.',
        'Cab and electrics — controls, displays, safety devices and instrumentation.',
        'Photo & video evidence — full walk-around capture attached to the scored report.',
      ],
    },
    faq: [
      { question: 'Where do the inspections happen?', answer: 'Wherever the machine stands — a seller’s yard, a port, a dealer or an auction site. We dispatch certified inspectors in most equipment-exporting countries; tell us the location and we confirm coverage.' },
      { question: 'Can I order an inspection before bidding in an auction?', answer: 'Yes, that is one of the most common requests. Book with the auction location and dates so the report is in your hands before the hammer falls.' },
      { question: 'Does the inspection tie into the score on listings?', answer: 'It uses the same 120-point standard that produces the inspection score displayed on listings, so a report on any machine reads the same way whether you saw it on SeaStarTrader or not.' },
      { question: 'What if the seller refuses access?', answer: 'We notify you after attempts to coordinate a visit are refused or stall — which is itself useful buying information. The inspection only runs with site access agreed.' },
      { question: 'Do you check documents and ownership?', answer: 'Serial verification is part of every level. For higher-value deals we also verify paperwork pieces you provide, like the ownership or export documents, alongside the physical check.' },
      { question: 'How far in advance should I book?', answer: 'Book as soon as you shortlist a machine. Give us a date range rather than a fixed day — the inspector can be scheduled as soon as the seller confirms site access.' },
    ],
  },

  appraisal: {
    slug: 'appraisal',
    keyword: 'Appraisal',
    tagline: 'A formal market-value appraisal of the equipment you own — selling, insuring or financing.',
    heroCta: 'Request an appraisal',
    intro:
      'Every price you put on a machine has to answer to somebody — a buyer, an insurance adjuster or a lender. Our appraisal desk values your equipment against live market comparables and recent auction results for the same make, model, year and hours, and delivers a report you can act on.',
    subject: 'an equipment appraisal',
    steps: [
      { title: 'Submit the machine', body: 'Type, make, model, year, hours, condition and photos — the more you provide, the sharper the valuation.' },
      { title: 'Comparables analysis', body: 'We analyse live listings, recent transactions and auction results for your exact machine.' },
      { title: 'Certified report back to you', body: 'You receive a written appraisal with the values, the evidence and the method behind them.' },
      { title: 'Act on the number', body: 'Price it right for a sale, satisfy your insurer, or hand the report to your lender with confidence.' },
    ],
    infoCards: [
      { title: 'Market-based valuations', body: 'Built from live comparables — asking and sold prices — for your machine’s make, model, year and meter reading.' },
      { title: 'Bank-accepted format', body: 'The written report is structured for lenders and insurers to review, with the comparables list attached.' },
      { title: 'Auction estimate included', body: 'If you plan to sell with us, the appraisal includes a realistic reserve and expected hammer range for the auction channel.' },
      { title: 'Pricing', body: 'Quote on request, depending on machine type and the report format you need.' },
    ],
    faq: [
      { question: 'What is my excavator actually worth today?', answer: 'Whatever similar machines have actually sold for, adjusted for hours, region and condition. That is exactly what the appraisal reports — current market value, not a decade-old list price.' },
      { question: 'Which purposes does the report cover?', answer: 'Selling, insurance, financing or collateral, and general record-keeping. Choose the purpose in the form; the report is structured around it.' },
      { question: 'How long does an appraisal take?', answer: 'Most single-machine appraisals return within a few business days of receiving complete machine details and photos.' },
      { question: 'Do I need photos?', answer: 'Photos are optional but strongly recommended — machines with full photo documentation get tighter valuation ranges because there is less to estimate.' },
      { question: 'Do you appraise fleets?', answer: 'Yes. Fleet and multi-unit appraisals are common for financing rounds — submit each unit, or contact us and we send a dedicated quote for the batch.' },
      { question: 'Is the valuation a guarantee of sale price?', answer: 'No. It is a professional opinion of market value backed by comparables. What it guarantees is that your asking price starts from evidence, not from a hunch.' },
    ],
  },

  refurbishing: {
    slug: 'refurbishing',
    keyword: 'Refurbishing',
    tagline: 'Repaint, rebuild and recondition heavy equipment before it goes back on the market.',
    heroCta: 'Start refurbishing',
    intro:
      'A tired machine sells slow and sells cheap. Our refurbishing assessment looks at your excavator, loader or crane and tells you exactly which works — mechanical service, hydraulic repairs, repaint, undercarriage or a full rebuild — will convert into a better sale price, before you spend anything on the workshop.',
    subject: 'a refurbishing assessment',
    steps: [
      { title: 'Assessment', body: 'Send the machine details, current condition and photos — we review what buyers will notice and what they will pay for.' },
      { title: 'Scope and quote', body: 'You receive an itemised scope of work with timeline; budget range is agreed up front, nothing starts without your sign-off.' },
      { title: 'The works', body: 'Workshop execution with progress photos — mechanical, hydraulic, structural and cosmetic as agreed.' },
      { title: 'Sold looking its best', body: 'The refreshed machine goes back to market photographed freshly, presenting like its price tag.' },
    ],
    infoCards: [
      { title: 'Mechanical scope', body: 'Engine service or overhaul, hydraulic pumps and cylinders, drivetrain and undercarriage replacement as the assessment calls for.' },
      { title: 'Cosmetic scope', body: 'Sanding, primer and repaint in manufacturer colours, panel repairs, decals and a full cab detail.' },
      { title: 'Parts sourcing', body: 'Genuine OEM or quality aftermarket parts, chosen by machine age and your budget — we present both options in the quote.' },
      { title: 'Timeline and budget', body: 'Agreed in writing before work starts. Simple cosmetic refreshes are a matter of weeks; full rebuilds take longer and cost accordingly.' },
    ],
    faq: [
      { question: 'Is refurbishing worth it before a sale?', answer: 'Frequently for presentation-critical items like paint, decals and glass, and for mechanical items a buyer will test on inspection. cosmetic works on an otherwise strong machine usually return their cost — the assessment will tell you honestly if yours will not.' },
      { question: 'Can I submit only some of the work?', answer: 'Absolutely. Many owners take one or two items — a repaint and hydraulic service, for example — and handle the rest themselves. The scope is entirely yours.' },
      { question: 'OEM or aftermarket parts?', answer: 'Newer machines and items a buyer will scrutinise generally justify OEM; older machines on a tighter budget often suit quality aftermarket. We quote both where the choice exists.' },
      { question: 'How is the budget controlled?', answer: 'The scope is itemised and signed off before work starts. Anything discovered mid-teardown that changes the plan is quoted and approved before it proceeds — never silently.' },
      { question: 'Do you document the work?', answer: 'Yes — before, during and after photos plus an itemised completion report. It becomes part of your listing and helps buyers pay the better price with confidence.' },
      { question: 'Can the machine stay registered and working between jobs?', answer: 'For many scopes, yes — machines run and work between workshop stages. Full rebuilds and undercarriage overhauls mean the machine stays with us until complete.' },
    ],
  },
};
