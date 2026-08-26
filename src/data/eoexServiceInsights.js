export const EOEX_SERVICE_INSIGHTS = {
  "creative": [
    "* Simplicity & Elegance: A clean, uncluttered design with a focus on high-quality visuals and typography.",
    "* Mobile-First: The design must prioritize the mobile experience, ensuring all content is easily accessible and readable on smaller screens.",
    "The design system aims for a Royal, Majestic, and Professional aesthetic that aligns with the EOEX brand.",
    "* Video Carousel: A full-width, autoplaying, and muted carousel to create an immediate, immersive brand experience without being intrusive.",
    "heroVideos: ['video/creative-director-1.mp4', 'video/creative-director-2.mp4'],",
    "{ id: 'challenge-1', title: 'Creative Burnout', image: 'img/challenges/burnout.jpg', content: '...' },",
    "const pageName = path.replace('/', '') || 'creative-director'; // Default",
    "This plan provides the complete architectural and implementation blueprint for the EOEX Job Profile Landing Pages. It synthesizes the provided research, creates a robust, mobile-first, and elegant design system, and outlines a clear technical path forward.",
    "6. Test, Refine, and Deploy: Test thoroughly on all devices and browsers, refine the design and interactions, and then set up the GitHub Pages deployment."
  ],
  "content": [
    "* Vanilla JavaScript (ES6+): For DOM manipulation, event handling, API calls (for translations), and the video carousel logic.",
    "* Content Management: All content will be stored in JavaScript objects, allowing for easy updates and serving as the basis for the multi-language functionality.",
    "* Masterclass & Educational Platforms: Platforms like MasterClass and Skillshare use strong, clear value propositions, high-production video, and compelling CTAs. Their approach to presenting expert-led courses and subject matter is informative.",
    "* Mobile-First: The design must prioritize the mobile experience, ensuring all content is easily accessible and readable on smaller screens.",
    "* Secondary Backgrounds: Off-white (#F8F6F3) for cards and content sections to add depth.",
    "* Collapsible Drawers: Clean, well-labeled accordions to present detailed content in a user-friendly and space-saving manner.",
    "* Video Carousel: A full-width, autoplaying, and muted carousel to create an immediate, immersive brand experience without being intrusive.",
    "* A full-width, full-height viewport section featuring the video carousel.",
    "* The carousel will play videos in a loop, on mute, with no controls.",
    "* The section will overlay the video with elegant text, such as the job title and a brief tagline, ensuring readability.",
    "* Card Content: An elegant, small image representing the challenge.",
    "* The content for these services will be derived from the \"EOEX Value Propositions & Pitch Messages\" in the PDF.",
    "* Left Side: A media carousel showcasing images and short video clips from past masterclasses or relevant content.",
    "* Collapsible Drawers: Clicking on a drawer's header will expand/contract its content, providing an efficient way to display detailed information without overwhelming the user."
  ],
  "talent": [],
  "operations": [
    "2. Deployment: The main branch of the GitHub repository will be configured to deploy to GitHub Pages. A .github/workflows directory with a deploy.yml file will be included to automate the build and deployment process, ensuring changes are reflected live.",
    "* Product/Profile Landing Pages: Companies like Apple and Tesla use simple, narrative-driven layouts with bold typography and high-quality visuals to showcase products. This storytelling approach is powerful for connecting with an audience.",
    "* Simplicity & Elegance: A clean, uncluttered design with a focus on high-quality visuals and typography.",
    "* Primary Accent (Gold): #D4AF37 for highlights, CTAs, and decorative elements to signify value and quality."
  ],
  "marketing": [
    "The result will be a comprehensive, fully documented HTML website project structure, ready for implementation.",
    "EOEX JOB PROFILE LANDING PAGES: COMPREHENSIVE IMPLEMENTATION PLAN",
    "* CSS3: CSS Grid, Flexbox, and Custom Properties (CSS Variables) for layout and theming.",
    "* /data/ (JSON or JS files containing all job profile data and translations)",
    "* /pages/ (HTML templates for each job profile, populated with data)",
    "2. Deployment: The main branch of the GitHub repository will be configured to deploy to GitHub Pages. A .github/workflows directory with a deploy.yml file will be included to automate the build and deployment process, ensuring changes are reflected live.",
    "* Masterclass & Educational Platforms: Platforms like MasterClass and Skillshare use strong, clear value propositions, high-production video, and compelling CTAs. Their approach to presenting expert-led courses and subject matter is informative.",
    "* Product/Profile Landing Pages: Companies like Apple and Tesla use simple, narrative-driven layouts with bold typography and high-quality visuals to showcase products. This storytelling approach is powerful for connecting with an audience.",
    "* Mobile-First: The design must prioritize the mobile experience, ensuring all content is easily accessible and readable on smaller screens.",
    "* Storytelling: The landing page should not just list problems and solutions, but tell a story of the professional's journey, the challenges they face, and how EOEX can guide them to success.",
    "The design system aims for a Royal, Majestic, and Professional aesthetic that aligns with the EOEX brand.",
    "* Primary Background: Creamy Beige (#F5F2EB) to create a warm, premium, and inviting canvas.",
    "* Primary Accent (Gold): #D4AF37 for highlights, CTAs, and decorative elements to signify value and quality.",
    "* Secondary Accent (Black): #1A1A1A (Subtle Black) for primary text, headings, and to provide strong contrast."
  ],
  "digital": [
    "* Architecture Pattern: Component-Based Architecture. This allows for reusable and maintainable code, perfect for building 60+ similar landing pages from a set of core components. Each page will be a composition of these components.",
    "* /data/ (JSON or JS files containing all job profile data and translations)",
    "* /pages/ (HTML templates for each job profile, populated with data)",
    "2. Deployment: The main branch of the GitHub repository will be configured to deploy to GitHub Pages. A .github/workflows directory with a deploy.yml file will be included to automate the build and deployment process, ensuring changes are reflected live.",
    "* Masterclass & Educational Platforms: Platforms like MasterClass and Skillshare use strong, clear value propositions, high-production video, and compelling CTAs. Their approach to presenting expert-led courses and subject matter is informative.",
    "The design system aims for a Royal, Majestic, and Professional aesthetic that aligns with the EOEX brand.",
    "* Headings: A serif font like Playfair Display or Lora for a classic, elegant, and authoritative feel.",
    "* Font Pairing: A combination of a serif for headings and a sans-serif for body text creates a sophisticated and balanced typographic hierarchy.",
    "* Collapsible Drawers: Clean, well-labeled accordions to present detailed content in a user-friendly and space-saving manner.",
    "* Card Drawer: A collapsable details/summary element containing the full description of the pain point, root causes, and revenue-losing activities derived directly from the PDF context.",
    "* Each row is a single card describing one of EOEX's services (e.g., \"Register for the Masterclass\", \"Explore our Coaching Services\", \"Access our AI Resources\").",
    "* Collapsible Drawers: Clicking on a drawer's header will expand/contract its content, providing an efficient way to display detailed information without overwhelming the user.",
    "<link href=\"https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&family=Playfair+Display:wght@400;600;700&display=swap\" rel=\"stylesheet\">",
    "* app.js: The main application file. Initializes the router, handles language switching, and manages global state."
  ]
};
