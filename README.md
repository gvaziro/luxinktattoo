# LUX INK Tattoo Studio — Batumi

Сайт тату-студии LUX INK (Батуми, Грузия). Next.js 16 (App Router, Turbopack), Tailwind CSS 4, Motion, Lenis.

## Запуск

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm run start
```

## Перед публикацией

1. Укажите домен в переменной окружения `NEXT_PUBLIC_SITE_URL` (см. `.env.example`). От неё строятся canonical, hreflang, `sitemap.xml`, `robots.txt`, Open Graph и schema.org. На Vercel без неё используется production-домен проекта.
2. Подключите домен в Google Search Console и Яндекс Вебмастере, отправьте `/sitemap.xml`.
3. Заведите / обновите карточку в Google Business Profile с тем же адресом и телефоном (NAP должен совпадать с сайтом).
4. Грузинский перевод (`src/content/dictionaries/ka.ts`) желательно вычитать носителем языка.

## Языки и адреса

| Язык | URL |
| --- | --- |
| English (по умолчанию) | `/` |
| Русский | `/ru` |
| ქართული | `/ka` |

`/en` постоянно редиректит на `/`. Весь текст — в `src/content/dictionaries/*.ts`, контакты и ссылки — в `src/content/site.ts`.

## Фото

- Работы: `src/assets/work/`, интерьер: `src/assets/studio/`, порядок и подписи — `src/content/media.ts` и словари.
- Next.js сам оптимизирует изображения (AVIF/WebP, адаптивные размеры, blur-плейсхолдеры).

## Иконки

Фавикон и иконки приложения собираются из шрифта бренда:

```bash
node scripts/generate-icons.mjs
```

## SEO, что уже есть

- Статический пререндер всех языков, `lang` у `<html>`, один `h1` на странице.
- Title / description / keywords на каждом языке, canonical, hreflang (+ `x-default`), Open Graph, Twitter Card.
- Динамическая OG-картинка 1200×630 (`src/app/[lang]/opengraph-image.tsx`).
- JSON-LD: `WebSite`, `TattooParlor` (адрес, телефон, Instagram, карта), `WebPage`, `FAQPage`.
- `sitemap.xml` с языковыми альтернативами и картинками работ, `robots.txt`, `manifest.webmanifest`.
- Alt-тексты всех фото на трёх языках, ответы FAQ всегда в HTML (видны поисковикам).
