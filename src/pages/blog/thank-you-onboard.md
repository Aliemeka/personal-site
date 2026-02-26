---
layout: ../../layouts/BlogPost.astro
title: "Thank you Onboard!"
pubDate: 2026-01-30
description: "Helping democratize financial access has been the most eye-opening education I could have asked for."
author: "Emeka Allison"
image:
  url: "https://res.cloudinary.com/emekadinary/image/upload/q_63/v1769783737/emeka's%20blog/Thank_you_Onboard_lsfurf.webp"
  alt: "Thank you Onboard!"
tags: ["web3", "work", "personal", "growth"]
---

### _If you're reading this..._

I'm no longer at Onboard. That's the **TL;DR**.

> But if you're here for the story — the growth, the chaos, the friendships, and that one time a regex brought down production on Safari — settle in. This one's worth it.

## So Let's Start at the Beginning

I joined Onboard with a very honest relationship with blockchain: I knew it existed, I knew people were making money from it, and I knew I didn't fully understand it. That was it.

I'd heard the words. _Decentralised. On-chain. Gas fees. Wallet._ But they existed in my head as a collection of vibes rather than a coherent mental model. I could nod in a conversation and sound like I knew what was going on. Spoiler: I did not.

What changed that was simple — I just started building. When the thing you're working on _is_ the blockchain, the abstraction collapses fast. You stop thinking about it as a concept and start thinking about it as plumbing. And once it's plumbing, you can fix leaks.

## What Onboard Actually Does

![Onboard Global](https://res.cloudinary.com/emekadinary/image/upload/q_60/v1772081303/Projects%20Screenshot/onboard_h7h9sv.webp)

[Onboard Global](https://www.onboard.xyz/) exists to solve a problem that a lot of people don't realise is a problem until it's their problem: **access to finance, regardless of where you are or what passport you hold.**

If you earn in dollars, spend in euros, and save in naira — which is the reality for millions of people — the traditional banking system is not your friend. It was built for a different era, a different person, and a different world.

Onboard is the alternative. It gives people USD accounts, virtual cards for global spending, and crypto tools for managing digital assets — all in one place, with no hidden fees and none of the paperwork that makes traditional banking feel like a punishment.

I worked on three products during my time there:

**Onboard Exchange** — A P2P crypto exchange that lets users convert between digital assets and local currencies. This was the one I spent the most time on, and the one that taught me the most about financial systems and the edge cases they generate (more on that shortly).

**Direct Accounts** — Skips the P2P middleman entirely. You convert your crypto directly to your desired fiat and it lands straight in your bank account. No waiting for a counterparty, no negotiating rates — just a clean, direct conversion.

**Onboard Pay** — Lets people fund USD and Euro accounts using crypto. For anyone who holds digital assets and needs to operate in traditional financial systems, this closes a gap that used to require a lot of workarounds.

## What I Learned

### Idempotency is not optional

Financial applications are unforgiving. When a user taps "Send" and something goes wrong — a network hiccup, a server restart, a browser refresh at the wrong moment — you do not want that transaction firing twice. I learned this the hard way and then the right way.

Idempotency in the UI means being deliberate about when state updates happen and ensuring that duplicate requests don't produce duplicate outcomes. In React, that translates to careful management of loading states, debouncing user actions, and structuring API calls defensively. Once you internalise it, you can't unsee it — you start noticing every form and button that doesn't have it.

### Caching requires intention

Working with financial data that changes frequently taught me to be precise about what gets cached, for how long, and under what conditions the cache should be invalidated. Too aggressive and you're showing users stale balances. Too lenient and you're hammering APIs unnecessarily. The sweet spot requires actually understanding your data access patterns, which is the part nobody warns you about.

### Never trust floating point with money

If you take one thing from this post: **never do arithmetic on currency with floating point numbers.** `0.1 + 0.2` is not `0.3` in JavaScript. It is `0.30000000000000004`, which is not a number you want appearing anywhere near a user's balance.

The correct approach is integer arithmetic — work in the smallest unit (kobo, cents, satoshis), perform all calculations there, and only format for display at the very end. Simple in principle, surprisingly easy to get wrong when moving fast.

## Challenges

### The Safari Regex Incident

I'll preface this by saying it went to production. We found out the worst way.

We had a currency input field that formatted values with commas as the user typed — `1000` becomes `1,000`, `10000` -> `10,000`, and so on. Clean, readable, handled by a straightforward regex. It worked on Chrome, Firefox, and every browser used by everyone on the team.

Then a user opened it on Safari.

The app went white. Not a graceful error message, not a helpful stack trace — just a blank screen. Two hours of debugging later, staring at code that looked perfectly reasonable, I finally traced it back to the regex. Safari couldn't process it. The whole component had silently thrown and taken the page with it.

The fix was replacing it with a regex that was actually compatible across browsers — a humbling reminder that "it works on my machine" is only as good as the browsers you bothered to test on. I became considerably more thorough with cross-browser testing after that.

Browsers can embarrass you. Safari especially. It will do so without warning and without apology.

## The People

The technical stuff is the easy part to talk about. The people are what made it.

I'm genuinely grateful to have worked somewhere led by **[Yele Bademosi](https://x.com/YeleBademosi)** — CEO and founder of Onboard. There's something about watching someone build with that level of conviction that recalibrates your own standards for what's possible.

**[Joseph Taiwo Orilogbon](https://www.linkedin.com/in/tlogbon/)** led with clarity and purpose. The kind of leadership that makes you want to do your best work, not because you have to, but because the bar is set somewhere worth reaching.

My team lead **Nonami** — look, this person made me a better engineer. Full stop. Patient, sharp, and never let me get away with "it works" when "it works _well_" was achievable.

And the rest of the team — every single one of them. You know who you are.

## The Daily Scrums We Actually Looked Forward To

![The Onboard team on a daily scrum call](/onboard.jpeg)

<center><small>This screenshot is from one of our daily scrums.</small></center> <br>

Look at these people. This is what a team that actually likes each other looks like. I'm the one in the glasses trying to look composed.

_Tom, Tori, Bobby, Paul, CJ, Ernest, Nonami, Chinonso_ — it was a privilege, genuinely.

## What's Next

I'm currently open to new roles and opportunities. If you're building something meaningful and need a fullstack engineer who has wrangled financial data, wrestled with Safari bugs, and learned to think carefully about the systems he builds — let's talk. I'm also open to working with anyone building agentic models and software, a niche I have been exploring for a while. You can reach me at [emekaallison4@gmail.com](mailto:emekaallison4@gmail.com) or [LinkedIn](https://www.linkedin.com/in/chukwuemeka-allison/). You can also check my [GitHub](https://github.com/Aliemeka).

In the meantime, I'm still building **[Dome Academy](https://domeinitiative.com)** — a community-driven learning platform for builders and developers. That work continues regardless of what else I'm doing. It's the kind of project you build because you believe in it, not because it's convenient.

To everyone at Onboard: thank you for the growth, the challenges, and the scrums. It was real, it was good, and I'm better for it.

_Onward._ 🚀
