# D SECURE — Prompt d'intégration du catalogue dans Google AI Studio

Le dossier contient :
- `products.json` : catalogue structuré de départ.
- `products.csv` : version tabulaire.
- `images/` : images extraites des classeurs Excel.
- `a_verifier.csv` : éléments à contrôler avant publication.

## Instructions à donner à Google AI Studio

Build the D SECURE website using the provided `products.json` and the `images/` directory as the source of truth.

Brand:
- Name: D SECURE
- Tagline: Votre sécurité, notre priorité.
- Email: camhtech.mg@gmail.com
- WhatsApp: +261337556584
- WhatsApp link: https://wa.me/261337556584
- Visual style: follow the supplied references: white/black layout, strong security red accents, professional product photography, compact product cards, premium CCTV/security-company appearance.
- Language: French.
- Responsive: mobile, tablet, desktop.
- Hosting target: free Vercel subdomain.

Catalog rules:
1. Import every valid product record from `products.json`.
2. Preserve exact reference, category, source description and technical fields.
3. Use only the image paths provided in each record's `images` array. Do not guess image matches.
4. Display `selling_price_ar` as the public price. It is already calculated as twice the numeric Excel source price.
5. Never multiply `selling_price_ar` again.
6. If `selling_price_ar` is null, display `Prix sur demande`.
7. Do not invent missing prices, references, descriptions, images, stock or warranty claims.
8. Keep `original_price_ar` hidden from public visitors; use it only for internal checks.
9. Keep products separated by category. At minimum provide separate top-level sections for cameras/surveillance and alarm systems, plus accessories, recorders, networking and kits.
10. Product search must search name, reference and description.

Order flow:
- Customers can add several products to a cart and adjust quantities.
- Checkout asks for full name, phone, delivery address and optional note.
- Before redirecting, show a clear order summary.
- Build a French WhatsApp message with product name, reference, quantity, displayed unit price, line totals and grand total.
- Open `https://wa.me/261337556584?text=...` using URL encoding.
- The customer must press Send in WhatsApp; do not claim the order was automatically sent.
- Include a direct WhatsApp contact button across the site.

Important data QA:
- `a_verifier.csv` lists records needing review.
- Do not publish uncertain image associations as confirmed. If a record has no safe image, use a neutral placeholder.
- Alarm wired prices come from a source column labeled `Sub-D Price 2023 Q2`; flag for owner confirmation before public launch.
- Some products have no source price. Keep them as `Prix sur demande`.
- Build an internal data-validation summary showing missing references, prices and images.

Technical:
- Use React + TypeScript + Tailwind CSS.
- Build reusable components and keep product data separate from UI.
- Use a maintainable asset path strategy.
- Optimize images without losing product identity.
- Ensure all navigation, filters, cart actions, forms and WhatsApp links work.
- Provide clear setup and deployment instructions for GitHub + Vercel free tier.

First inspect the actual data schema and report any issues. Then implement the site. Do not create mock product data to fill gaps.
