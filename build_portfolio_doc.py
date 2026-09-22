from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

OUT = 'Dave_Oyangorin_Portfolio_Final.docx'
NAVY, TEAL, SLATE, PALE = '102A43', '008C95', '486581', 'F1F5F8'

projects = [
('D3 Digital Marketing','Built a clean, conversion-focused website for the WAVES Growth Operating System.','Website development, SEO, Google Ads, and GoHighLevel work.','WordPress, Divi, Beaver Builder, WP Bakery, CSS, SEO, Google Ads, GoHighLevel, Canva','Support a clear, conversion-focused digital presence.','https://www.d3digitalmedia.com/'),
('LinkedXL','A website for a business operating-system consultancy.','Web development and digital marketing support.','WordPress, Elementor, AI Automation, Social Media Management, SEO, Digital Marketing, CSS, Figma','Communicate a custom operating-system offer to prospective organizations.','https://linkedxl.com/'),
('TX Concrete Leveling','A responsive B2B lead-generation site for a structural thermal-break manufacturer.','Built and supported product, solution, service, resource, FAQ, and blog pages.','WordPress, Divi, SEO, JavaScript, CSS, HTML','Help technical buyers explore products and services.','https://www.txconcreteleveling.com/'),
('VAMEPLEASE','A consulting-agency website with strategic services, process messaging, and calls to action.','Website development, SEO, digital marketing, and Google Ads support.','WordPress, Elementor, HTML, CSS, Figma, SEO, Digital Marketing, Google Ads','Attract and convert business owners looking to scale.','https://vameplease.com/'),
('Total Home Interiors','A website for local soundproofing and window-treatment searches.','Designed and built the site; provide maintenance, technical SEO, and on-page SEO.','WordPress, Elementor, HTML, CSS, SEO, Digital Marketing, Google Ads','Support local search visibility in New Jersey and the New York Metro area.','https://totalhomeinteriors.tech/'),
('SMCDATA','A website for supply-chain and ERP solutions.','Manage and maintain the site; deliver technical and on-page SEO optimization.','Custom platform, HTML, CSS, SEO, Digital Marketing','Improve visibility for manufacturing and distribution searches.','https://smcdata.com/'),
('Axpara Inc','Clean, responsive, visually engaging web pages.','Built front-end pages and integrated interfaces with backend systems and APIs.','Vue.js, JavaScript, HTML, CSS, Bootstrap, PostgreSQL, SEO','Present company information through responsive web interfaces.','https://axpara.com/talent/v2/about-us'),
('Advanced Foot Nurse','A clinic website maintained through Thinkific.','Performed site updates, technical and on-page SEO, and social media scheduling and posting.','Thinkific, CSS, SEO, Publer, Digital Marketing, Google Ads','Keep the site current, searchable, and supported by consistent social activity.','https://www.advancedfootnurse.com/'),
('AFCN Shop','An e-commerce storefront for therapeutic footwear and foot-care products.','Maintain catalog and collection pages, checkout and payment options, gift cards, and on-page SEO.','Shopify, Liquid, E-commerce, CSS, SEO, Social Media Management, Digital Marketing','Support online product discovery and purchase.','https://shop.advancedfootnurse.com/'),
('Estate Doc Prep','A conversion-focused estate-planning website.','Built offer pages, webinar and seminar funnels, lead capture, and technical/on-page SEO.','WordPress, Elementor, HTML, CSS, Landing Pages, SEO, Digital Marketing, Google Ads','Help visitors understand and pursue an online estate-planning service.','https://estatedocprep.com/'),
('Mandy’s Laundry','A local-service website for a Van Nuys laundromat.','Structured service and local-SEO pages covering core services and service areas.','WordPress, Elementor, HTML, CSS, Local SEO, Digital Marketing, Google Ads','Help local customers discover laundry services.','https://mandyslaundry.com/'),
('Heavenly Silk','A website for Heavenly Silk Flowers.','Manage client-requested content, gallery, and form updates.','Duda, GoHighLevel, WordPress, HTML, CSS, SEO','Keep the site accurate and aligned with changing business needs.','https://www.heavenlysilkflowers.com/'),
('Hidden Roots LLC','A GoHighLevel site for a mental-health provider.','Structured location, referral, career, and testimonial pages; connected referral and contact forms to CRM pipelines.','GoHighLevel, Landing Pages, CRM, Automation, HTML, CSS, SEO','Route intake to the appropriate state team.','https://hiddenrootsllc.com/'),
('Estate Doc Prep — Ambassador Funnel','A GoHighLevel referral-partner recruitment funnel.','Built the application journey and connected qualifying forms to the CRM pipeline.','GoHighLevel, Funnel Building, Landing Pages, CRM, Automation, Copywriting','Qualify prospective ambassador partners.','https://sites.leadconnectorhq.com/preview/XPrpzn9TR3ZhU0mLTrsG'),
('Estate Doc Prep — White Label Funnel','A B2B funnel for a white-label program.','Presented the partner process, intake workflow, pipeline stages, and training; built a multi-step application.','GoHighLevel, Funnel Building, Landing Pages, CRM, Automation, Copywriting','Qualify prospective business partners.','https://sites.leadconnectorhq.com/preview/0Tw8EXQGHloyrm9Hm25j'),
('Defense Attorney Case Review Funnel','A funnel for an initial criminal-defense case review and strategy call.','Built the offer page and implemented appointment scheduling and CRM follow-up automation.','GoHighLevel, Funnel Building, Landing Pages, Appointment Booking, CRM, Copywriting','Turn interested visitors into booked case-review appointments.','https://sites.leadconnectorhq.com/preview/Twba3dvzJVqOLx0jx0wr'),
('Soundproof NJ','A GoHighLevel site for commercial acoustic and infrastructure services.','Organized industry pages and connected a consultation call to action to the CRM.','GoHighLevel, Funnel Building, Landing Pages, CRM, Local SEO, Digital Marketing','Generate consultation inquiries across New Jersey and the NY Metro area.','https://soundproofnj.com/home-page-page'),
('Best Kept Secret — Visibility Page','A registration funnel for a five-day live workshop.','Built the long-form sales page, pricing, bonus, guarantee, CTA, checkout, and enrollment automation.','GoHighLevel, Funnel Building, Landing Pages, CRM, Automation, Copywriting, Digital Marketing','Drive workshop registrations and manage enrollment.','https://bestkeptsecret.ai/bks---visibility-page'),
]

def shade(cell, fill):
    tcPr = cell._tc.get_or_add_tcPr(); shd = OxmlElement('w:shd'); shd.set(qn('w:fill'), fill); tcPr.append(shd)
def border_bottom(p, color=TEAL):
    pPr = p._p.get_or_add_pPr(); pbdr = OxmlElement('w:pBdr'); b = OxmlElement('w:bottom'); b.set(qn('w:val'),'single'); b.set(qn('w:sz'),'12'); b.set(qn('w:space'),'6'); b.set(qn('w:color'),color); pbdr.append(b); pPr.append(pbdr)
def hyperlink(p, text, url):
    h = OxmlElement('w:hyperlink'); rel = p.part.relate_to(url, 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink', is_external=True); h.set(qn('r:id'),rel)
    r = OxmlElement('w:r'); rp = OxmlElement('w:rPr'); c = OxmlElement('w:color'); c.set(qn('w:val'),TEAL); rp.append(c); u = OxmlElement('w:u'); u.set(qn('w:val'),'single'); rp.append(u); r.append(rp); t = OxmlElement('w:t'); t.text=text; r.append(t); h.append(r); p._p.append(h)
def heading(d, text, level=1):
    p=d.add_paragraph(style=f'Heading {level}'); r=p.add_run(text); r.font.name='Aptos Display'; r.font.color.rgb=RGBColor.from_string(NAVY); border_bottom(p); return p
def label(d, label, value):
    p=d.add_paragraph(); a=p.add_run(label+'  '); a.bold=True; a.font.color.rgb=RGBColor.from_string(NAVY); p.add_run(value); return p
def bullets(d, items):
    for x in items: d.add_paragraph(x, style='List Bullet')

d=Document(); sec=d.sections[0]; sec.top_margin=Inches(.7); sec.bottom_margin=Inches(.7); sec.left_margin=Inches(.8); sec.right_margin=Inches(.8)
styles=d.styles; styles['Normal'].font.name='Aptos'; styles['Normal'].font.size=Pt(10); styles['Normal'].font.color.rgb=RGBColor.from_string('243B53'); styles['Normal']._element.rPr.rFonts.set(qn('w:eastAsia'),'Aptos')
for s in ['Heading 1','Heading 2','Heading 3']: styles[s].font.name='Aptos Display'; styles[s].font.color.rgb=RGBColor.from_string(NAVY)
styles['Heading 1'].font.size=Pt(21); styles['Heading 2'].font.size=Pt(14); styles['Heading 3'].font.size=Pt(11)
footer=sec.footer.paragraphs[0]; footer.alignment=WD_ALIGN_PARAGRAPH.CENTER; footer.add_run('Dave Oyangorin  |  Portfolio  |  '); fld=OxmlElement('w:fldSimple'); fld.set(qn('w:instr'),'PAGE'); footer._p.append(fld)

# Cover
d.add_paragraph('\n\n\n'); p=d.add_paragraph(); p.alignment=WD_ALIGN_PARAGRAPH.CENTER; r=p.add_run('DAVE\nOYANGORIN'); r.bold=True; r.font.name='Aptos Display'; r.font.size=Pt(36); r.font.color.rgb=RGBColor.from_string(NAVY)
p=d.add_paragraph(); p.alignment=WD_ALIGN_PARAGRAPH.CENTER; r=p.add_run('Web Developer | Digital Marketing Specialist | AI & Automation'); r.font.size=Pt(15); r.font.color.rgb=RGBColor.from_string(TEAL)
d.add_paragraph('\n'); p=d.add_paragraph(); p.alignment=WD_ALIGN_PARAGRAPH.CENTER; r=p.add_run('Building websites, marketing systems, and automation that help businesses attract, convert, and manage leads.'); r.italic=True; r.font.size=Pt(14)
d.add_paragraph('\n\n'); p=d.add_paragraph(); p.alignment=WD_ALIGN_PARAGRAPH.CENTER; hyperlink(p,'LinkedIn','https://www.linkedin.com/in/dave-oyangorin-5727712b0/'); p.add_run('   |   '); hyperlink(p,'GitHub','https://github.com/DaveOyangorin'); p.add_run('   |   '); hyperlink(p,'Book a call','https://calendly.com/dave-oyangorin18/30min?hide_gdpr_banner=1')
d.add_page_break()

heading(d,'About Me'); d.add_paragraph("I started in web development, building responsive, SEO-friendly websites with HTML, CSS, JavaScript, WordPress, and visual builders such as Elementor. That foundation taught me that a website has to do more than look polished: it has to be useful, easy to navigate, fast to load, and ready to support a real business goal.")
d.add_paragraph("From there, I expanded into digital marketing—SEO, Google Ads, landing pages, lead generation, conversion optimization, analytics, and content marketing. I learned to think beyond the page itself: how people find it, what persuades them to act, and how performance can be measured and improved.")
d.add_paragraph("My work then grew into CRM and marketing automation, including GoHighLevel, workflows, email automation, funnels, webhooks, APIs, and lead follow-up systems. More recently, I have been applying AI-assisted workflows, prompt engineering, n8n, and business-process automation. I don’t just build websites. I understand what happens after someone lands on the website—and how the website, marketing, CRM, and automation can work together.")

heading(d,'My Professional Journey'); stages=[('Web Development','Built a foundation in HTML, CSS, JavaScript, responsive design, and websites that are practical for real users.'),('WordPress & Website Management','Worked with WordPress and page builders to create, update, and maintain business websites.'),('SEO & Technical SEO','Developed experience with search visibility, on-page improvements, technical SEO, and performance awareness.'),('Digital Marketing','Expanded into Google Ads, analytics, content, and conversion-focused digital marketing support.'),('Lead Generation & Funnels','Designed landing pages and funnel experiences intended to turn visits into meaningful inquiries or actions.'),('CRM & Marketing Automation','Connected forms, pipelines, email, webhooks, APIs, and follow-up workflows through CRM platforms.'),('AI & Automation','Applied AI-assisted workflows, prompt engineering, n8n, and process automation to reduce repetitive work.')]
t=d.add_table(rows=0, cols=2); t.alignment=WD_TABLE_ALIGNMENT.CENTER; t.style='Light Shading Accent 1'
for i,(a,b) in enumerate(stages):
    c=t.add_row().cells; c[0].text=f'{i+1:02d}  {a}'; c[1].text=b; shade(c[0],NAVY); [setattr(run.font.color,'rgb',RGBColor(255,255,255)) for run in c[0].paragraphs[0].runs]

heading(d,'Core Skills'); skills={'Web Development':'WordPress • HTML • CSS • JavaScript • Vue.js • Astro • Elementor • WooCommerce • Responsive Web Design','Digital Marketing':'SEO • Technical SEO • Keyword Research • On-Page SEO • Google Ads • Conversion Tracking • Landing Page Optimization • CRO • Lead Generation','CRM & Automation':'GoHighLevel • n8n • CRM Workflows • Email Automation • Funnels • Webhooks • API Integrations • Lead Follow-Up','AI & Automation':'AI-assisted workflows • Prompt Engineering • AI Automation • n8n • Business Process Automation','Analytics & Marketing Tools':'Google Analytics 4 • Google Search Console • Google Tag Manager • Microsoft Clarity • SEMrush • PageSpeed Insights • Yoast SEO'}
t=d.add_table(rows=0, cols=2); t.style='Light Shading Accent 1'; t.alignment=WD_TABLE_ALIGNMENT.CENTER
for k,v in skills.items(): c=t.add_row().cells; c[0].text=k; c[1].text=v; shade(c[0],PALE)

heading(d,'Professional Experience'); exp=[('D3 Digital Marketing | Web Developer / AI Automation / Digital Marketing / Social Media Manager','Jan 2025 – Mar 2026',['Managed SEO for 12 client websites.','Implemented website updates across multiple page builders.','Executed and monitored Google Ads campaigns.']),('becomedistinct | Web Developer / SEO / Maintenance','Mar 2024 – Jan 2025',['Managed and maintained client websites using Duda.','Handled ongoing updates and client-requested site revamps.']),('VAMEPLEASE | Web Developer / Social Media Manager','Jan 2024 – Jun 2024',['Maintained client websites and delivered custom implementations.','Managed social media presence alongside development work.']),('Axpara Inc | Front-End Developer','Mar 2021 – Apr 2023',['Built clean, responsive pages with HTML, CSS, and JavaScript.','Integrated front-end interfaces with backend systems and APIs.'])]
for title,period,items in exp: heading(d,title,2); p=d.add_paragraph(period); p.runs[0].italic=True; bullets(d,items)

heading(d,'Selected Projects'); d.add_paragraph('The projects below describe my documented contributions. Results are intentionally left as placeholders unless verified results are provided.')
for name,overview,role,tools_,purpose,url in projects:
    heading(d,name,2); label(d,'Overview:',overview); label(d,'My Role:',role); label(d,'Tools & Technologies:',tools_); label(d,'What I Did:','[See My Role above; add detail where needed.]'); label(d,'Business Purpose:',purpose); label(d,'Results:','[Add project results]'); p=d.add_paragraph(); p.add_run('Project Link: ').bold=True; hyperlink(p,url,url)

heading(d,'How I Help Businesses'); helps=[('Website Development','I build responsive, SEO-friendly websites designed around usability and conversions.'),('Lead Generation','I create landing pages, lead-generation systems, tracking, and follow-up workflows.'),('Digital Marketing','I support SEO, Google Ads, analytics, conversion optimization, and content marketing.'),('CRM & Automation','I connect forms, CRM systems, email, webhooks, APIs, and automation workflows.'),('AI & Process Automation','I use AI and automation tools to reduce repetitive work and improve business processes.')]
for a,b in helps: heading(d,a,2); d.add_paragraph(b)

heading(d,'My Workflow'); flow=[('Discovery','I clarify the business goal, audience, offer, and existing process before deciding what to build.'),('Strategy','I translate findings into a practical page, funnel, SEO, tracking, or automation approach.'),('Build','I create or improve the website, landing pages, content structure, and supporting integrations.'),('Track','I set up or review the measurement points that show how visitors and leads move through the system.'),('Optimize','I refine pages, messaging, SEO, and workflows based on priorities and available evidence.'),('Automate','I connect repeatable tasks through CRM, webhooks, APIs, n8n, and AI-assisted workflows where appropriate.')]
p=d.add_paragraph(); p.alignment=WD_ALIGN_PARAGRAPH.CENTER; r=p.add_run('Discovery → Strategy → Build → Track → Optimize → Automate'); r.bold=True; r.font.color.rgb=RGBColor.from_string(TEAL)
for a,b in flow: label(d,a+':',b)

heading(d,'Tools & Platforms'); rows=[('Web Development','WordPress, HTML, CSS, JavaScript, Vue.js, Astro, Elementor'),('SEO','SEMrush, Yoast SEO, Google Search Console, PageSpeed Insights'),('Advertising','Google Ads'),('Analytics','GA4, Google Tag Manager, Microsoft Clarity'),('CRM','GoHighLevel'),('Automation','n8n, Webhooks, APIs'),('Content','Canva, YouTube, Descript')]; t=d.add_table(rows=1, cols=2); t.style='Light Shading Accent 1'; t.alignment=WD_TABLE_ALIGNMENT.CENTER
for cell,txt in zip(t.rows[0].cells,['Category','Tools']): cell.text=txt; shade(cell,NAVY); [setattr(r.font.color,'rgb',RGBColor(255,255,255)) for r in cell.paragraphs[0].runs]
for a,b in rows: c=t.add_row().cells; c[0].text=a; c[1].text=b

heading(d,'Professional Strengths'); bullets(d,['Technical understanding paired with a practical marketing mindset.','Ability to work across websites, SEO, lead generation, CRM, and automation.','Problem solving grounded in user experience, performance, and business process.','Attention to website performance, search visibility, and lead-follow-up systems.','Clear communication that keeps technical work connected to practical outcomes.','A continuous-learning approach to evolving web, AI, and automation tools.'])

heading(d,"Let’s Build Something That Works."); d.add_paragraph('I help businesses connect their websites, marketing, lead generation, CRM, and automation into practical systems that support the customer journey after the first click.')
label(d,'Email:','[Add email address]'); p=d.add_paragraph(); p.add_run('LinkedIn: ').bold=True; hyperlink(p,'linkedin.com/in/dave-oyangorin-5727712b0','https://www.linkedin.com/in/dave-oyangorin-5727712b0/')
p=d.add_paragraph(); p.add_run('GitHub: ').bold=True; hyperlink(p,'github.com/DaveOyangorin','https://github.com/DaveOyangorin')
p=d.add_paragraph(); p.add_run('Portfolio: ').bold=True; hyperlink(p,'dave-portfolio-phi.vercel.app','https://dave-portfolio-phi.vercel.app/')
p=d.add_paragraph(); p.add_run('Calendly: ').bold=True; hyperlink(p,'Book a 30-minute call','https://calendly.com/dave-oyangorin18/30min?hide_gdpr_banner=1')
d.save(OUT)
print(OUT)
