# Design system

This is the visual language for the barbershop product. The layout reference is the “Fresh Fades” dashboard: a light application shell, white cards, and one blue accent. The color palette is Modern SaaS: navy, cool page gray, and a saturated blue.

Navy (`#172033`) is text and the preview frame. It is not a filled page background.

## Principles

- The page is quiet. Color is reserved for the selected nav item, charts, and status.
- Information sits on white cards with a light page behind them.
- Numbers are larger than their labels. Labels stay small and gray.
- Status is a tinted pill, not a solid button. Green means positive or paid. Red means negative or pending.
- Corners are rounded. Shadows are soft and short.

## Color

| Token | Hex | Use |
| --- | --- | --- |
| `canvas` | `#172033` | Optional frame behind a preview. Same navy as text. Not a page background. |
| `page` | `#F5F7FB` | Main content background. A cool off-white. |
| `surface` | `#FFFFFF` | Sidebar, top bar, cards, table. |
| `surface-muted` | `#EEF2F8` | Pressed row, subtle fill inside a card. |
| `border` | `#DCE5F5` | Card edges, table rules, input borders. Same family as `primary-soft`. |
| `text` | `#172033` | Titles, numbers, table values. |
| `text-secondary` | `#5C6B86` | Labels, subtitles, inactive nav, placeholders. |
| `text-muted` | `#8B97AD` | Section labels such as “MAIN MENU”. |
| `primary` | `#4778F5` | Selected nav, logo, primary chart series, links, primary buttons. |
| `primary-strong` | `#3464DC` | Hover on primary fills. |
| `primary-soft` | `#DCE5F5` | Chart track, secondary bar series, selected-row tint, icon tiles. |
| `success` | `#3E9B62` | Positive trend text, “Paid” text. |
| `success-soft` | `#E4F6EA` | Positive trend pill, “Paid” pill. |
| `danger` | `#E25B6A` | Negative trend text, “Pending” text. |
| `danger-soft` | `#FDECEA` | Negative trend pill, “Pending” pill. |
| `warning` | `#F89870` | Donut “Regulars” series. |
| `warning-soft` | `#F8D0C0` | Donut “New clients” series. |
| `info-dot` | `#F04452` | Unread badge on the bell. |
| `online` | `#3DDC84` | Presence dot on the message icon. |

Do not introduce a second brand color. Blue is the only accent. Orange exists only inside the stratification chart.

## Typography

Use **Plus Jakarta Sans**. Fall back to Inter, then the system sans-serif.

| Role | Size | Weight | Line height | Color |
| --- | --- | --- | --- | --- |
| Page title | 20px | 600 | 28px | `text` |
| Card title | 16px | 600 | 24px | `text` |
| Stat value | 28px | 700 | 34px | `text` |
| Body | 14px | 500 | 20px | `text` |
| Label | 13px | 500 | 18px | `text-secondary` |
| Caption | 12px | 500 | 16px | `text-secondary` |
| Overline | 11px | 600 | 16px | `text-muted`, uppercase, +0.06em tracking |

The logo wordmark is 18px, weight 700, color `primary`.

## Space, radius, elevation

Spacing uses a 4px step: 4, 8, 12, 16, 20, 24, 32.

| Token | Value | Use |
| --- | --- | --- |
| `radius-sm` | 8px | Inputs, small buttons, table status pills that are not fully round |
| `radius-md` | 12px | Nav item, search field, dropdown |
| `radius-lg` | 16px | Cards |
| `radius-xl` | 20px | The application window in a framed preview |
| `radius-pill` | 999px | Trend pills, status pills, avatar |

| Token | Value | Use |
| --- | --- | --- |
| `shadow-card` | `0 8px 24px rgba(31, 36, 48, 0.04)` | Stat cards, chart cards, table card |
| `shadow-pop` | `0 12px 32px rgba(31, 36, 48, 0.08)` | Dropdowns, tooltips |

Cards do not use a heavy border. A 1px `border` is enough when the card sits on `page`. On `surface`, separate regions with `border` only.

## Layout

The app is a fixed sidebar plus a scrolling content column.

| Region | Size |
| --- | --- |
| Sidebar | 248px, full height, `surface` |
| Sidebar padding | 20px horizontal, 24px top |
| Top bar | 72px, `surface`, content aligned with the page padding |
| Content padding | 24px |
| Card gap | 16px |
| Content max width | none; cards stretch to the column |

Sidebar structure, top to bottom:

1. Logo: 28px blue mark, then the shop or product name.
2. Overline “Main menu”.
3. Primary navigation.
4. Overline “Others”.
5. Secondary navigation.
6. Logout, pinned to the bottom, with 24px of space above it.

Primary navigation, in order:

- Dashboard
- Services
- Appointment
- Invoice
- Clients
- Reports

Secondary navigation:

- Feedback
- Setting
- Help

A nav item is 44px tall, full width of the sidebar padding, `radius-md`, 14px text, a 20px outline icon, and 12px between icon and label. Items with children show a chevron on the right.

| State | Background | Text | Icon |
| --- | --- | --- | --- |
| Default | transparent | `text-secondary` | `text-secondary` |
| Hover | `surface-muted` | `text` | `text` |
| Selected | `primary` | white | white |

Only one item is selected. The reference selected item is Dashboard.

## Top bar

Left: search. Right: notification, messages, avatar. 16px between the icon buttons.

Search is 280px wide and 40px tall. Placeholder is “Search”. A 16px search icon sits inside the left padding. Background `surface`, border `border`, radius `radius-md`. Focus border becomes `primary`.

Notification and message buttons are 36px circles, no border, icon in `text-secondary`. A 8px dot sits at the top-right of the icon: `info-dot` for notifications, `online` for messages.

The avatar is 36px, circular, with a 2px white ring if it overlaps a dot.

## Components

### Stat card

Four cards in one row. Each card is `surface`, `radius-lg`, `shadow-card`, padding 20px.

- Top row: a 32px rounded icon tile on the left (`primary-soft` background, `primary` icon) and a 16px info icon on the right (`text-muted`).
- Label: 14px, weight 600, `text`.
- Caption: 12px, `text-secondary`. Examples: “unique clients served”, “this month”, “this shop”.
- Value: stat value style.
- Trend: a pill under the value. 11px, weight 600, padding 2px 8px. Positive uses `success` on `success-soft`. Negative uses `danger` on `danger-soft`. Prefix the value with `+` or `-`.

Reference stats: Total clients 260 (+10%), New clients 45 (+15%), Total employee 20 (+20%), Appointment 43 (−20%).

### Chart card

Same surface, radius, and shadow as a stat card. Padding 20px. Title on the left, a small dropdown on the right.

**Clients growth.** Title “Clients growth”. Dropdown default “Weekly”. A caption “Total 100” sits under the title. Legend: a `primary` square for “New clients”, a `primary-soft` square for “Returning clients”. Bars are grouped by day, Saturday through Friday. The new-client bar is `primary`. The returning-client bar is `primary-soft`. Axis labels are captions in `text-secondary`. The y-axis runs 0% to 120% in 30% steps. Hover shows a white tooltip, `shadow-pop`, with both values. Example: “New clients 60 / Returning 40”.

**Customer stratification.** Title “Customer stratification”. Dropdown default “All time”. A donut with a 100% label in the hole, 20px weight 700. Ring thickness is about 18px. Segments, clockwise from the top:

| Segment | Color | Share |
| --- | --- | --- |
| VIP clients | `primary` | 50% |
| Regulars | `warning` | 30% |
| New clients | `warning-soft` | 20% |

The legend sits under the donut: color square, name, then the percent aligned right.

On a wide layout the growth chart takes about two thirds of the row and the donut takes the rest. Below 1100px, stack them.

### Appointment table

One card. Title “Service appointment list” on the left. A “See all” dropdown on the right.

Columns, left to right:

| Column | Align |
| --- | --- |
| Start time | left |
| Services | left |
| Time expected | left |
| Client | left |
| Employee | left |
| Status | left |
| Action | right |

Header row: 12px, weight 600, `text-secondary`, bottom border `border`. Body row: 14px, `text`, 56px tall, hairline divider `border`. No zebra striping.

Status is a pill:

| Status | Text | Background |
| --- | --- | --- |
| Paid | `success` | `success-soft` |
| Pending | `danger` | `danger-soft` |

The action is a quiet “…” button, `text-secondary`, with a menu on click. Do not use a filled button in the row.

Reference rows:

| Start | Service | Expected | Client | Employee | Status |
| --- | --- | --- | --- | --- | --- |
| 09:00 AM | Haircut | 09:30 AM | Alice Brown | John Doe | Paid |
| 10:00 AM | Beard trim | 10:15 AM | Bob White | Jane Smith | Pending |
| 11:00 AM | Hair color | 12:00 PM | Charlie Black | Mike Johnson | Paid |

### Dropdown

36px tall, padding 8px 12px, `surface`, 1px `border`, `radius-md`, 13px `text`. A chevron on the right. The menu uses `surface`, `radius-md`, `shadow-pop`, and 8px of padding.

### Buttons

| Kind | Fill | Text | When |
| --- | --- | --- | --- |
| Primary | `primary` | white | One main action on a page |
| Quiet | transparent | `text-secondary` | Row actions, icon buttons |
| Logout | transparent | `text-secondary` | Sidebar footer only |

Primary buttons are 40px tall, horizontal padding 16px, `radius-md`, weight 600. Hover uses `primary-strong`. There is no second filled color.

### Icons

Outline icons, 1.5px stroke, 20px in navigation, 16px inside fields and cards. Match the reference set: grid, scissors, calendar, document, people, chart, chat, gear, help, logout, search, bell. Do not mix filled and outline icons in the same row.

## Dashboard composition

From top to bottom, inside the content column:

1. Four stat cards in a single row. Below 1100px, two columns. Below 720px, one column.
2. Clients growth and customer stratification side by side.
3. Service appointment list.

Empty states stay inside the same card. One sentence in `text-secondary`, no illustration.

## Motion

Hover and press transitions are 150ms, ease-out, on background and color only. Charts do not animate on first paint. Dropdowns fade and move 4px.

## Writing

- Sentence case for navigation, buttons, and table headers. “Service appointment list”, not “SERVICE APPOINTMENT LIST”.
- Section labels in the sidebar are the only uppercase text.
- Times use a 12-hour clock with AM/PM in the table, matching the reference.
- Percents in trend pills include the sign. Chart percents do not.
- Shop data replaces the sample names. “Fresh Fades”, Alice Brown, and the sample counts are reference content, not product copy.
