
# MySafePass

Frontend React/Vite de MySafePass, avec landing page, modale d’authentification, coffre local chiffré côté navigateur, générateur de mots de passe, tableau de bord, détails d’entrée et assistant conversationnel.

## Running the code

Run `pnpm install` or `npm install` to install dependencies.

Run `pnpm dev` or `npm run dev` to start the development server.

## Project structure

```text
.
├── ATTRIBUTIONS.md
├── README.md
├── default_shadcn_theme.css
├── guidelines
│   └── Guidelines.md
├── index.html
├── package.json
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── src
│   ├── app
│   │   ├── App.tsx
│   │   ├── components
│   │   │   ├── AuthModal.tsx
│   │   │   ├── figma
│   │   │   └── ui
│   │   ├── context
│   │   │   └── VaultContext.tsx
│   │   ├── lib
│   │   │   ├── chat-assistant.ts
│   │   │   ├── password-tools.ts
│   │   │   ├── phishing.ts
│   │   │   └── vault.ts
│   │   ├── pages
│   │   │   ├── Assistant.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── EntryDetail.tsx
│   │   │   ├── GeneratePassword.tsx
│   │   │   └── Login.tsx
│   │   └── routes.tsx
│   ├── imports
│   │   ├── image-1.png
│   │   ├── image-2.png
│   │   └── image.png
│   ├── main.tsx
│   └── styles
│       ├── fonts.css
│       ├── index.css
│       ├── tailwind.css
│       └── theme.css
└── vite.config.ts
```

## Main features

- Landing page with auth modal and password strength progress bar
- Local encrypted vault state managed from a shared React context
- Password generator with strength analysis and save flow
- Dashboard with search, filters, audit trail and security summary
- Entry detail page with reveal, copy, edit, rotation and deletion flow
- Local assistant page for vault-oriented natural language prompts
  
