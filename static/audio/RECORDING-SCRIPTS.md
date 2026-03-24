# Recording Scripts for Workshop 201 — Active Listening Scenarios

Record these scripts as natural, conversational candidate answers. They should sound like someone telling a real story in an interview — not reading from a script. Include natural pauses, filler words ("um," "so"), and the slight tangents that real answers have.

---

## Scenario 1: scenario-1-priya.mp3

**Character:** Priya, senior software engineer, 6 years experience, confident but not rehearsed.

**Script:**

So about a year ago, I noticed that our payments service was having these intermittent failures — like, transactions would fail but nobody would know until a customer complained. The monitoring was really basic, just uptime checks. This wasn't my team's responsibility at all — the SRE team owned monitoring — but they were stretched thin working on a migration.

I spent a couple evenings looking at our error logs and realized we had about 12 different failure modes that weren't being tracked. I put together a proposal for an alerting system that would catch these — categorized by severity, with different response playbooks for each one.

I got buy-in from the SRE lead by showing them the data — we'd had 47 silent failures in the previous month that only got caught through customer complaints. They gave me access to their monitoring stack and I built out the alerts over about two weeks, working on it between my regular sprint work.

The result was pretty immediate — our mean time to detection dropped from about 45 minutes to under 5 minutes for critical payment failures. And the SRE team actually adopted the pattern I built for three other services after that.

**Duration target:** ~90 seconds

---

## Scenario 2: scenario-2-marcus.mp3

**Character:** Marcus, product manager, 4 years experience, articulate and structured but natural.

**Script:**

This was about eight months ago. I wanted to build a recommendation engine for our investment products, but it required coordination across three teams — engineering for the backend, data science for the models, and design for the UX.

The challenge was that none of these teams reported to me, and they all had their own roadmap priorities. The data science team in particular was skeptical — they'd been burned before by PM-driven projects that oversimplified the ML complexity.

What I did was, instead of coming in with a finished spec, I set up individual working sessions with each team lead first. I asked them what they thought the biggest opportunity was and what constraints they were working with. With engineering, the concern was latency — they didn't want anything that would slow down page loads. With data science, it was about model accuracy and having enough training data. With design, it was about not making the product feel pushy.

I synthesized all of their input into a phased approach. Phase one was a simple rules-based system that engineering could ship quickly, while data science built the ML model in parallel. This way we could validate the UX and gather training data at the same time.

I presented the phased plan back to each team individually before the joint meeting, so nobody was surprised. When we did the group session, most of the concerns had already been addressed. The data science lead actually said it was the first PM-driven project where she felt her team's constraints were taken seriously.

We launched phase one in six weeks and the ML-powered version two months later. Conversion on recommended products went up 23%.

**Duration target:** ~2 minutes

---

## Recording Tips

- Use a quiet room with no echo
- Speak at a natural interview pace (not too fast, not too slow)
- It's okay to add natural filler: "um," "like," "so" — real candidates do this
- Slight pauses when transitioning between STAR sections sound natural
- Don't sound like you're reading — tell the story like you're talking to someone
- MP3 format, reasonable quality (128kbps+ is fine)
