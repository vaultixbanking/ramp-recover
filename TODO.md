# Ramp Recover: work list

`[ ]` to do · `[x]` done · `[-]` skipped · 🔒 = needs info from the client first

## ⚠️ Don't forget

- [x] **31. Backend connected.** Done (October 17, 2026): `backend/.env` is complete. A real test case (RR-EUAYH4) went from the website form to Supabase with 2 files, and both emails arrived: the team notification to admin@getfinora.org and the confirmation to recover@getfinora.org (checked in the inbox). The test case and its files were then deleted, so Supabase starts empty.
  - [x] Supabase done (October 17, 2026): the database tables `intake_cases` and `intake_attachments` are created with RLS on, and the private `case-evidence` bucket is created (10 MB, images and PDF only). A test case went from the website form into Supabase with both files, then was deleted.
- [ ] **32. Deployment settings.** 🔒 When deploying (steps in `README.md` → Deploying):
  - **Vercel (website):** `NEXT_PUBLIC_API_URL` = the backend's public URL, and `NEXT_PUBLIC_SMARTSUPP_KEY` = the same key as in `.env.local`. Without the key, the live site has no chat.
  - **Render/Railway (backend):** everything from `backend/.env`, plus `CORS_ORIGINS=https://ramp-recover.getfinora.org` and `SITE_URL=https://ramp-recover.getfinora.org`.

### Details received (October 17, 2026)
- [x] **Phone and WhatsApp:** +1 (207) 250-6231. Used in the footer, the header's "24/7 Response" link and the WhatsApp button (`src/app/config/contact.ts`).
- [x] **Contact email:** recover@getfinora.org. Used in the Email button, the footer and the legal pages.
- [x] **Smartsupp key:** in `.env.local` as `NEXT_PUBLIC_SMARTSUPP_KEY`. The old blocked key is gone.
- [x] **Company:** Ramp Recover Inc, San Francisco, California, United States. The Terms are governed by California law, and case records are kept for 5 years (`src/app/config/legal.ts`).
- [x] **Emails:** new cases go to admin@getfinora.org, the main mailbox. Emails are sent from recover@getfinora.org, on the Resend-verified domain getfinora.org.

## A. Intake form (highest priority)

- [x] **1. Real form submission.** Done: Node/TypeScript backend in `backend/` saves cases to Supabase, stores evidence files, and emails the team and the client via Resend. The form has real sending / sent / failed states. It goes live once `backend/.env` is filled in (item 31).
- [x] **2. Fix the receiving email.** Done: the Gmail address is gone; new cases go to `TEAM_INBOX` = admin@getfinora.org.
- [x] **3. Scroll to top of form on step change.** Done.
- [x] **4. Block future incident dates.** Done (browser and server).
- [x] **5. Form accessibility.** Done: errors linked to fields, `aria-pressed` on options, focus moves to the first problem.

## B. Styling and navigation fixes

- [x] **6. Add missing colours.** Done: `primary-200`, `-300`, `-400`, `-800` and `-900` added to `globals.css`, so the hover/border styles work.
- [x] **7. Fix "Case Results" links.** Done: the menu and the hero button now go to the testimonials.
- [x] **8. Fix "Services" vs "Scam Types".** Done: new "What we do" Services section with 6 cards; "Scam Types" goes to the fraud categories.
- [x] **9. Header covers section titles.** Done: sections land just below the header, with smooth scrolling (off for people who choose reduced motion).
- [x] **10. 24h vs 48h contradiction.** Done: the hero stat now says "24h / Follow-up on every new case".

## C. Contact details and live chat

- [x] **11. Real phone, WhatsApp and email.** Done (see "Details received" above).
- [x] **12. Clickable phone and email.** Done: footer email and phone are `mailto:` / `tel:` links, and the header's "24/7 Response" calls the phone number.
- [x] **25. New Smartsupp account.** Done: the new key is in `.env.local`, and the chat loads on every page.
- [x] **26. Floating contact buttons.** Done: Email, WhatsApp and Smartsupp's Chat button form one evenly spaced column at the bottom right of every page, on desktop and phone. WhatsApp opens a chat with a ready-made "I need help with a scam case" message.
- [x] **13. "Open live chat" links.** Done: "use live chat" in the contact section and the form, the "Start live chat" and "Open live chat" buttons in the urgent-help boxes, and the footer's live chat line all open the chat window. If the Smartsupp key is ever removed, these buttons hide themselves.

## D. Legal pages

- [x] **14. Header and footer on legal pages.** Done: the legal pages have the site header, footer and floating buttons, a "Back to home" link and an "Other legal pages" row. The footer is now one shared component (`SiteFooter.tsx`).
- [x] **15. Contact details in the Privacy Policy.** Done: the Privacy Policy was rewritten (13 sections: company, data collected incl. files/chat/WhatsApp, legal bases, providers, transfers, retention, security, rights, children, cookies, contact).
- [x] **16. Use Next.js `Link` for internal footer links.** Done (footer and menu links also work from the legal pages now).
- [x] **27. Company details in the legal pages.** Done: Ramp Recover Inc, San Francisco, California law, 5-year retention. No `[placeholders]` remain.
- [x] **28. Legal text gaps.** Done:
  - Terms of Service rewritten (13 sections), including **Fees**: free case review; paid work only after a written quote is agreed; never crypto or gift card payments or "release" fees.
  - Disclaimer: added "No affiliation" and "Testimonials" sections.
  - Risk Notice: added "Recovery scams: how to protect yourself".
  - The safety promises also appear in an "Our promises to you" box next to the form and in the confirmation email.
  - The form's consent box now links to the Terms and Privacy Policy.
- [ ] **29. Lawyer review before launch.** Have a lawyer check the 4 legal pages, especially:
  - **Fees:** the FTC Telemarketing Sales Rule (16 CFR 310.4(a)(3)) bans recovery services that sell by phone from taking payment until 7 business days after the money is recovered.
  - **Privacy:** the policy covers US visitors and international (UK/EU-style) rights; confirm it for California (CCPA/CPRA) and the countries where clients are.

## E. Cleanup (remove)

- [x] **17. Delete `tailwind.config.ts`.** Done. The rebuilt site is unchanged apart from one unused class (`.ease-in-out`) that only existed because Tailwind read the old file.
- [x] **18. Delete unused `public/` files.** Done: removed `file.svg`, `vercel.svg`, `next.svg`, `globe.svg`, `window.svg` and `grid.svg`. `public/` now holds only `brand/`.
- [x] **19. Brand favicon.** Done with the Ramp Recover logo (`icon.svg`, `favicon.ico`, `apple-icon.png`; more files in `public/brand/`).
- [x] **20. Rewrite README.** Done: the root `README.md` covers the project layout, running the site and backend locally, environment variables, scripts, where to make common changes, and deploying. Backend details stay in `backend/README.md`.

## F. New additions

- [x] **21. SEO and sharing.** Done:
  - **Address:** https://ramp-recover.getfinora.org, set as `SITE_URL` in `src/app/config/site.ts`. DNS set up and live (October 18, 2026). The vercel.app address is no longer used. Every page's canonical link points to this address.
  - **Link previews:** every page has its own title, description and preview tags for WhatsApp, Facebook and X, using the share image (`public/brand/ramp-recover-social.png`).
  - **Search engines:** `/robots.txt` allows indexing and points to `/sitemap.xml`, which lists all 5 pages.
- [x] **22. Custom 404 page.** Done: branded "We couldn't find that page" page with the header, footer, "Go to home page" and "Start a recovery case" buttons, and helpful links. It returns a real 404 status and tells search engines not to index it.
- [ ] **30. After launch: Google Search Console.** Add https://ramp-recover.getfinora.org to Google Search Console and submit `https://ramp-recover.getfinora.org/sitemap.xml`, so Google finds the site sooner.

## G. Content to confirm with the client before launch

- [ ] **23. Testimonials.** 🔒 Labelled "Verified" and "Every account below is from a real client". Must be real with client consent, or removed / relabelled. `page.tsx`
- [ ] **24. Stats.** 🔒 "$18.2M traced" and "3,400+ victims" need real figures behind them. `page.tsx`

---

### Still needed from the client
- Supabase and Resend keys in `backend/.env` (item 31)
- A lawyer's review of the legal pages and fee model (item 29)
- Confirmation on testimonials and stats (items 23, 24)
