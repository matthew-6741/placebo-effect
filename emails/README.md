# Marketing emails

Four ready-to-send HTML emails (table layouts, inline styles, web-safe fonts, tested down to 300px):

| File | When to send |
| --- | --- |
| `welcome.html` | Right after someone signs up |
| `promo-flash-sale.html` | A "sale" where everything is already $0 |
| `cuisine-passport.html` | When someone collects new cuisine stamps |
| `winback.html` | Someone hasn't ghosted an order in a while |

The logo is embedded as a base64 data URI rather than a hosted link. If you add it somewhere new,
copy the existing URI (`grep -o 'data:image/png;base64,[^"]*' welcome.html`) instead of regenerating it.

## Before you send: fill in the merge tags

Each footer contains three placeholders that **your email provider must replace**. Sending with them
unfilled means a broken unsubscribe link, which is illegal in the US under CAN-SPAM and will get you
blocked by Gmail and Yahoo.

| Placeholder | What it needs | Mailchimp | SendGrid |
| --- | --- | --- | --- |
| `{{unsubscribe_url}}` | One-click unsubscribe link | `*\|UNSUB\|*` | `<%asm_group_unsubscribe_raw_url%>` |
| `{{preferences_url}}` | Manage-preferences page | `*\|UPDATE_PROFILE\|*` | `<%asm_preferences_raw_url%>` |
| `{{sender_postal_address}}` | A real postal address for the sender | `*\|LIST:ADDRESSLINE\|*` | `<%asm_group_unsubscribe_raw_url%>` is not this — set the address in Sender Identity |

Most providers substitute their own tag syntax, so replace the `{{...}}` text with the tag from the
column that matches your provider before uploading the template.

## What the law asks for

- **A working unsubscribe** that keeps working for at least 30 days after sending, honoured within 10
  business days (CAN-SPAM).
- **A valid physical postal address** for the sender in every commercial email. A PO box or a registered
  commercial mail-receiving agency counts. Don't invent one — if you don't have an address you're willing
  to publish, don't send marketing email.
- **One-click unsubscribe** (`List-Unsubscribe` and `List-Unsubscribe-Post` headers) for bulk senders.
  Every major provider adds these headers for you when you use its unsubscribe merge tag.
- **No misleading subject lines or from-addresses.** The novelty framing is fine; the sender identity
  has to be real.

Everything above is handled by your email provider *only if* you use its merge tags. Sending these files
by hand from a personal inbox skips all of it.
