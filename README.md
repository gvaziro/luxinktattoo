# LUX INK Tattoo Studio — Batumi

Сайт тату-студии LUX INK (Батуми, Грузия). Next.js 16 (App Router, Turbopack), Tailwind CSS 4, Motion, Lenis.

## Запуск

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm run start
```

## Перед публикацией

1. Укажите домен в переменной окружения `NEXT_PUBLIC_SITE_URL` (см. `.env.example`). От неё строятся canonical, hreflang, `sitemap.xml`, `robots.txt`, RSS, Open Graph и schema.org. На Vercel без неё используется production-домен проекта.
2. Добавьте сайт в Google Search Console, Яндекс Вебмастер и Bing Webmaster Tools. Коды подтверждения из мета-тегов вставьте в `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_YANDEX_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION`, затем отправьте `/sitemap.xml`.
3. Заведите / обновите карточку в Google Business Profile с тем же адресом и телефоном (NAP должен совпадать с сайтом) и укажите сайт в ней и в шапке Instagram.
4. Грузинский перевод (`src/content/dictionaries/ka.ts`) желательно вычитать носителем языка.

## Языки и адреса

| Страница | English (по умолчанию) | Русский | ქართული |
| --- | --- | --- | --- |
| Главная | `/` | `/ru` | `/ka` |
| Журнал (блог) | `/blog` | `/ru/blog` | — |
| Статья | `/blog/<slug>` | `/ru/blog/<slug>` | — |
| RSS | `/blog/rss.xml` | `/ru/blog/rss.xml` | — |

`/en`, `/en/blog` и `/en/blog/<slug>` постоянно редиректят на адреса без `/en`. Весь текст интерфейса — в `src/content/dictionaries/*.ts`, контакты и ссылки — в `src/content/site.ts`.

## Блог

Статьи лежат в `src/content/blog/posts/<язык>/<slug>.ts`: метаданные + текст в Markdown.

Как добавить статью:

1. Скопируйте любую существующую статью, поменяйте `slug`, `title`, `seoTitle` (до 50 символов: к нему добавляется « | LUX INK»), `description` (до ~155), `keywords`, `category`, даты и `cover` (ключ фото из `src/content/media.ts`).
2. Заполните `keyTakeaway` (40–55 слов, самодостаточный ответ на главный запрос, без бренда) и `faq` (4–6 вопросов из реальных подзапросов).
3. В тексте: 6–8 внутренних ссылок (статьи, разделы главной `/#work`, `/#standards`, `/#process`…) и ровно одна ссылка на главную с ключевым анкором («tattoo studio in Batumi», «тату-салон в Батуми» — анкоры чередуйте между статьями). Головные запросы «тату Батуми» / «tattoo studio Batumi» принадлежат главной, не делайте их главным ключом статьи.
4. У переводов одной статьи должен совпадать `translationKey` — так связываются hreflang и переключатель языка.
5. Подключите файл в `src/content/blog/index.ts`.

Статья автоматически попадает в журнал, блок «Из журнала» на главной, `sitemap.xml`, RSS и `llms.txt`, получает оглавление, блок «Коротко», FAQ, «С чего начать», OG-картинку с заголовком и разметку `BlogPosting` + `FAQPage` + `BreadcrumbList`.

## Проверка SEO перед публикацией

```bash
npm run build && npm run start
npm run seo:audit -- http://localhost:3000
```

Скрипт обходит все страницы из `sitemap.xml` и проверяет: длину title и description, один H1, canonical, отсутствие длинных тире в английских текстах, 6+ внутренних ссылок и одну ключевую ссылку на главную в статьях, битые ссылки и self-links, совпадение FAQ на странице и в schema, длину и отсутствие бренда в Key Takeaway. При любой ошибке выходит с кодом 1.

Темы и ключевые запросы текущих статей:

| Тема | EN | RU |
| --- | --- | --- |
| Тату в отпуске в Батуми | tattoo Batumi, tattoo on holiday | тату Батуми, можно ли купаться после тату |
| Как выбрать тату-салон в Батуми | tattoo studio Batumi | тату салон Батуми, тату мастер Батуми |
| Уход за татуировкой | tattoo aftercare | уход за татуировкой, заживление тату |
| Стили татуировок | tattoo styles, fine line, realism | стили татуировок, файнлайн, реализм |
| Подготовка к сеансу | how to prepare for a tattoo | как подготовиться к тату |
| Больно ли делать тату | tattoo pain chart | больно ли делать тату |

## Фото

- Работы: `src/assets/work/`, интерьер: `src/assets/studio/`, порядок и подписи — `src/content/media.ts` и словари.
- Next.js сам оптимизирует изображения (AVIF/WebP, адаптивные размеры, blur-плейсхолдеры).

## Иконки

Фавикон и иконки приложения собираются из шрифта бренда:

```bash
node scripts/generate-icons.mjs
```

## SEO, что уже есть

- Статический пререндер всех страниц, `lang` у `<html>`, один `h1` на странице, хлебные крошки.
- Title / description / keywords на каждом языке, canonical, hreflang (+ `x-default`), Open Graph (`article` для статей), Twitter Card.
- OG-картинки 1200×630: брендовая для главной и журнала, с заголовком — для каждой статьи.
- JSON-LD: `WebSite`, `TattooParlor` (адрес, телефон, Instagram, карта), `WebPage`, `FAQPage`, `Blog`, `BlogPosting`, `BreadcrumbList`.
- `sitemap.xml` (главные, журнал, статьи, языковые альтернативы, картинки), `robots.txt`, RSS, `manifest.webmanifest`, `llms.txt` для AI-поисковиков.
- Перелинковка: статьи ссылаются друг на друга и на разделы главной, на главной — последние статьи, под статьёй — «Читайте также».
- Мета-теги верификации Google / Яндекс / Bing через переменные окружения.
- Alt-тексты всех фото, ответы FAQ всегда в HTML (видны поисковикам).
