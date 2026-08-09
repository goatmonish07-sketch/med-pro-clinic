# MediBill Pro — Medical Bill Website

A medical store billing & pharmacy management website built from the Figma design
**"MediBill Pro — Indian Pharmacy Management Software (UI/UX)"**.

It reproduces the core screens of the design as a static, framework-free site
(plain HTML + CSS + a little vanilla JS), so it runs anywhere — just open the
files in a browser or serve the folder.

## Pages

| File | Screen |
|------|--------|
| `index.html` | Sign in (brand panel + login form) |
| `dashboard.html` | Dashboard — KPIs, sales/purchase chart, top sellers, low-stock & expiry alerts |
| `billing.html` | Billing / POS — counter sale with batch search, cart, GST split & payment |
| `invoice.html` | GST **Tax Invoice** (A4) — printable / Save-as-PDF |
| `inventory.html` | Medicine Inventory — batch-wise stock table |
| `customers.html` | Customers directory — credit / retail / institution |
| `reports.html` | Reports & Analytics — sales vs purchases, payment mix, stock health |
| `iptv-legacy.html` | Unrelated file that previously lived at `index.html`, preserved untouched |

## Design system

Extracted from the Figma file (no design variables were defined, so tokens are
raw values) and centralised in `assets/css/app.css`:

- **Font:** Inter (400/500/600/700)
- **Shell:** black sidebar, white cards on a light `#f7f8fa` canvas
- **Accents:** sage-teal (`#5c817b` / `#9fd3c9` / `#17423c`)
- **Text:** Google-gray scale (`#0f1113` → `#8a8f98`)
- **Status:** green `#15803d`, red `#b91c1c`, amber `#b45309`
- Indian pharmacy context throughout — ₹ INR, GST (CGST/SGST), HSN codes,
  batch/expiry, Schedule H, drug licence, UPI.

Icons are inline SVG; charts and progress bars are pure CSS (no external libraries).

## Running

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

Sign in navigates to the dashboard (no backend — it's a UI reproduction of the
Figma prototype). From **Billing / POS**, *Complete Sale* / *Print Invoice*
opens the A4 tax invoice, which supports the browser's Print → Save as PDF.

## Notes

- The site is a faithful front-end reproduction of the Figma screens; all data
  shown is the sample data from the design.
- Responsive: the sidebar collapses on narrow viewports and tables scroll
  horizontally.
