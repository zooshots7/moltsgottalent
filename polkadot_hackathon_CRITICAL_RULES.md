# 🚨 CRITICAL RULES - POLKADOT SOLIDITY HACKATHON 2026

**READ THIS BEFORE YOU START BUILDING**

These are **DISQUALIFICATION TRIGGERS**. Even a great project can be rejected for missing these.

---

## ⚠️ BARE MINIMUM REQUIREMENTS (DO NOT SKIP)

### 1. ✅ OPEN SOURCE - MANDATORY

**Rule:**
> "All projects must be open-source."

**What This Means:**
- GitHub/GitLab/Bitbucket repo MUST be public
- No private repos (even temporarily)
- Code archived for common good (non-commercial use by organizers)

**Action:**
- [ ] Create public repo from day 1
- [ ] Add open-source license (MIT, Apache 2.0, or GPL recommended)
- [ ] Keep it public throughout hackathon

---

### 2. ❌ NO FORKS >70% SIMILARITY

**Rule:**
> "Projects that fork from established open-source repositories with more than 70% codebase similarity to the original will be immediately disqualified."

**What This Means:**
- You CAN build on existing code
- You CANNOT just fork a project and change 30%
- Judges will check code similarity

**Examples:**

❌ **DISQUALIFIED:**
- Fork Uniswap V2, change UI, add one feature (80% similar)
- Copy OpenZeppelin template, modify variables (90% similar)
- Clone existing Polkadot project, rebrand (75% similar)

✅ **ALLOWED:**
- Use OpenZeppelin libraries as dependencies (imports are fine)
- Fork a starter template and build 50%+ original code
- Reference existing architecture but write from scratch

**How They Check:**
- GitHub similarity detection tools
- Manual code review by judges
- Commit history analysis

**Safe Zone:**
- Write 70%+ original code
- Use libraries/packages as dependencies (not forks)
- Document what you built vs what you imported

**Action:**
- [ ] If using existing code, keep it under 30% of total codebase
- [ ] Clearly separate your code vs imported libraries in README
- [ ] Show originality in smart contracts, logic, and architecture

---

### 3. 📝 VALID COMMIT HISTORY - REQUIRED

**Rule:**
> "A valid commit history is required to showcase your team's contributions during the hackathon. The commit log must clearly reflect active contributions during the event timeline."

**What This Means:**
- Judges will look at Git commits
- All work must be done **Feb 28 - Mar 20**
- Regular commits showing progress

**Red Flags (Gets You Disqualified):**

❌ One massive commit on Mar 20 (looks like you built it before and uploaded at deadline)  
❌ No commits during hackathon dates  
❌ Commits dated before Feb 28 (pre-built projects)  
❌ Commits after Mar 20 deadline  

**What Judges Want to See:**

✅ Daily commits (or every 2-3 days)  
✅ Incremental progress (contracts → tests → UI → docs)  
✅ Meaningful commit messages ("Add staking contract" not "update")  
✅ Multiple team members committing (if team project)  

**Best Practices:**

```
Good Commit Timeline (Example):

Mar 1: Initial project setup, Hardhat config
Mar 2: Add TokenFactory contract
Mar 3: Implement staking logic
Mar 4: Write unit tests for staking
Mar 5: XCM integration for cross-chain
Mar 7: Frontend scaffold
Mar 8: Connect wallet to contracts
Mar 10: UI for staking dashboard
Mar 12: Add USDC support
Mar 15: Bug fixes, edge cases
Mar 17: UI polish, loading states
Mar 18: Documentation
Mar 19: Demo video recording
Mar 20 (10am): Final commit, submit
```

**Action:**
- [ ] Commit daily (or every 2-3 days minimum)
- [ ] Use descriptive commit messages
- [ ] Show incremental progress
- [ ] Don't wait until last day to push everything

---

### 4. 🎭 IDENTITY VERIFICATION - DISCORD REQUIRED

**Rule:**
> "All project team members must verify their identity through the Polkadot Official Discord channel."

**What This Means:**
- Join OpenGuild Discord: https://discord.gg/WWgzkDfPQF
- Verify your identity in designated channel
- EVERY team member must do this (if team project)

**When to Do This:**
- ASAP (don't wait until submission)
- Ideally during pre-registration (Feb 16-27)

**How to Verify:**
- Join Discord server
- Look for #verification or #hackathon-registration channel
- Follow instructions (likely link Discord to DoraHacks account)

**Red Flag:**
- Submitting project without verified Discord = disqualified

**Action:**
- [ ] Join OpenGuild Discord NOW
- [ ] Complete identity verification
- [ ] If team: ensure ALL members verify

---

## 🏆 WINNING PROJECT REQUIREMENTS (TO PLACE)

These won't disqualify you, but you WON'T WIN without them.

### 5. 🪪 POLKADOT ON-CHAIN IDENTITY (Winners Only)

**Rule:**
> "The winning team must set up a Polkadot wallet with an on-chain identity enabled for identity verification."

**What This Means:**
- If you win, you need Polkadot wallet + on-chain identity
- Used for prize distribution
- Not needed for submission, but needed to RECEIVE prize

**How to Set Up:**
- Guide: https://openguild.wtf/blog/polkadot/polkadot-opengov-introduction
- Create Polkadot wallet (Polkadot.js, Talisman, SubWallet)
- Set on-chain identity (costs small amount of DOT)

**When to Do This:**
- Ideally BEFORE submitting (shows commitment)
- MUST do if you win (before prize payout)

**Action:**
- [ ] Create Polkadot wallet
- [ ] Set up on-chain identity (optional but recommended)
- [ ] Keep seed phrase SAFE

---

### 6. 📖 QUALITY DOCUMENTATION - MANDATORY

**Rule:**
> "Submissions must include a well-structured project description."

**Acceptable Formats:**
- ✅ GitHub README file (most common)
- ✅ Notion page
- ✅ Website or GitBook
- ✅ Docx / PDF file

**What Judges Want to See:**

**Minimum README Structure:**
```markdown
# Project Name

## Problem Statement
What problem does this solve?

## Solution
How does your dApp solve it?

## Features
- Feature 1: Staking with auto-compounding
- Feature 2: XCM cross-chain transfers
- Feature 3: AI-powered yield optimization

## Tech Stack
- Smart Contracts: Solidity (Polkadot Hub EVM)
- Frontend: React + Wagmi
- Deployment: Vercel
- XCM: Polkadot native messaging

## Polkadot Hub Features Used
- Native USDC integration
- XCM for cross-parachain communication
- Polkadot precompiles for identity

## Installation
1. Clone repo
2. Install dependencies: npm install
3. Deploy contracts: npm run deploy
4. Start frontend: npm run dev

## Demo
- Live demo: https://myproject.vercel.app
- Demo video: https://youtube.com/...
- Screenshots: [see below]

## Team
- Alice: Smart contracts
- Bob: Frontend
- Charlie: Design

## Future Roadmap
- Q2 2026: Add more parachains
- Q3 2026: Mobile app
- Q4 2026: Apply for W3F grant
```

**Bad Documentation (Will Hurt Your Score):**

❌ One-line README: "This is a DeFi app"  
❌ No installation instructions  
❌ No explanation of Polkadot features used  
❌ Broken links  
❌ No demo or screenshots  

**Action:**
- [ ] Write comprehensive README (minimum 500 words)
- [ ] Include installation instructions
- [ ] Explain what Polkadot features you used
- [ ] Add screenshots or demo link

---

### 7. 🎨 UI/UX EXPERIENCE - SCORED

**Rule:**
> "A good user interface and smooth user experience will be taken into account alongside the technical functionalities."

**What This Means:**
- Backend-only projects CAN win, but UI helps A LOT
- Even simple UI > no UI
- Polish matters (loading states, error handling, responsive design)

**Minimum UI Checklist:**

- [ ] Wallet connection (MetaMask or similar)
- [ ] Display user balance / holdings
- [ ] Form for interacting with contracts (stake, swap, etc.)
- [ ] Transaction feedback (loading, success, error states)
- [ ] Mobile responsive (or at least desktop-friendly)

**What "Good UI/UX" Means:**

✅ Clean, modern design (doesn't need to be fancy, just not broken)  
✅ Clear call-to-actions ("Stake DOT", "Claim Rewards")  
✅ Error messages that make sense ("Insufficient balance" not "Error 0x123")  
✅ Loading states (spinners, skeletons)  
✅ Success confirmations ("Transaction successful!")  

**Design Resources (If You're Not a Designer):**

- Chakra UI (React component library)
- Tailwind CSS (utility-first CSS)
- DaisyUI (Tailwind components)
- ShadCN (modern React components)

**Action:**
- [ ] Build at least basic UI
- [ ] Add loading/success/error states
- [ ] Test on mobile (or make it responsive)
- [ ] Get someone to test it who ISN'T on your team

---

### 8. 🎥 DEMONSTRATION - MANDATORY

**Rule:**
> "Every submission must include a demo video or screenshots. Judges should be able to test your features with either a hosted deployment OR a local installation guide."

**Two Options (Pick One or Both):**

**Option A: Hosted Deployment** (RECOMMENDED)
- Deploy to Vercel, Netlify, Render, etc.
- Judges can click and test immediately
- WAY better than asking them to run locally

**Option B: Local Installation Guide**
- Step-by-step instructions in README
- Must actually work (judges will test)
- Include troubleshooting section

**Demo Video Requirements:**

**Minimum:**
- 2-3 minutes
- Screen recording showing app in action
- Voice-over explaining features (or text overlays)

**What to Show:**
1. Problem statement (15 seconds)
2. Solution overview (30 seconds)
3. Live demo walkthrough (90 seconds)
   - Connect wallet
   - Interact with contract
   - Show transaction success
4. Polkadot features used (30 seconds)
5. Next steps / roadmap (15 seconds)

**Where to Upload:**
- YouTube (unlisted is fine)
- Loom
- Vimeo
- Google Drive (public link)

**Tools for Demo Videos:**
- Loom (easiest, free)
- OBS Studio (free, professional)
- QuickTime (Mac screen recording)
- Windows Game Bar (Windows screen recording)

**Screenshots (If No Video):**
- Minimum 5 screenshots showing key features
- Include in README or separate folder
- Annotate with explanations

**Action:**
- [ ] Deploy to live URL (Vercel/Netlify) OR write detailed local setup
- [ ] Record 2-5 minute demo video
- [ ] Upload to YouTube/Loom
- [ ] Add link to README

---

### 9. 🔮 VISION & COMMITMENT - BONUS POINTS

**Rule:**
> "Projects that show a clear roadmap, innovative idea, and proof of future commitment will receive extra points during evaluation."

**What Judges Want to See:**

**Future Roadmap (Add to README):**
```markdown
## Roadmap

### Phase 1 (Completed - Hackathon)
- ✅ Core staking contracts
- ✅ XCM integration
- ✅ Basic UI

### Phase 2 (Q2 2026)
- Add more parachains support
- Governance token launch
- Mobile wallet integration

### Phase 3 (Q3 2026)
- Apply for Web3 Foundation grant
- Partnership with DeFi protocols
- Security audit

### Long-term Vision
- Become default staking aggregator for Polkadot ecosystem
- 10,000+ users
- $10M+ TVL
```

**Proof of Commitment:**
- Mention grant applications (W3F, ecosystem grants)
- Active Discord/Telegram participation
- Team bios showing relevant experience
- Already building in Polkadot ecosystem

**Innovation:**
- Novel use of XCM
- Unique AI integration
- Solving real problem (not just "another DEX clone")

**Action:**
- [ ] Write 3-phase roadmap
- [ ] Mention post-hackathon plans (grants, users, partnerships)
- [ ] Show why your team is committed

---

### 10. ✅ TRACK RELEVANCE - MUST MATCH

**Rule:**
> "The solution must be valid for the track you are applying to (EVM, PolkaVM, Cross-chain, Tooling, etc.)."

**Track 1: EVM Smart Contract**

**MUST HAVE:**
- Solidity contracts deployed on Polkadot Hub
- EVM-compatible (works with MetaMask)

**Categories (Pick One or Both):**
1. **DeFi / Stablecoin-enabled dapps**
   - Use USDC/USDT on Polkadot Hub
   - Lending, borrowing, staking, swapping
   - Stablecoin-related features

2. **AI-powered dapps**
   - AI model integration (GPT, Claude, local models)
   - On-chain AI (prediction markets, risk scoring)
   - AI-assisted UX (chatbots, recommendations)

**MUST ALSO HAVE (to win):**
- At least ONE Polkadot-specific feature:
  - XCM cross-chain messaging
  - Polkadot native assets
  - Precompiles (identity, governance, etc.)
  - Bridge to other ecosystems

**Track 2: PVM Smart Contracts (Advanced)**

**MUST HAVE:**
- Use PolkaVM (RISC-V)
- Demonstrate performance advantage

**Categories:**
1. Call Rust/C++ from Solidity
2. Use Polkadot native assets
3. Use precompiles

**Which Track Should YOU Pick?**

Pick **Track 1 (EVM)** if:
- ✅ You know Solidity
- ✅ You want higher win odds (more familiar)
- ✅ You're building DeFi or AI dApp

Pick **Track 2 (PVM)** if:
- ✅ You know Rust
- ✅ You want cutting-edge tech
- ✅ You're building performance-heavy app

**Action:**
- [ ] Choose track based on your skills
- [ ] Make sure project fits category (DeFi/Stablecoin OR AI)
- [ ] Include at least ONE Polkadot feature (XCM, native assets, or precompiles)

---

## ⏰ CRITICAL TIMELINE

| Date | Event | What You MUST Do |
|------|-------|------------------|
| **Feb 16-27** | Pre-registration | Join Discord, verify identity |
| **Feb 28** | Submission portal opens | Create public repo, first commit |
| **Mar 1-7** | Build core MVP | Daily commits, core contracts |
| **Mar 8-14** | Add Polkadot features | XCM integration, polish |
| **Mar 15-19** | Final polish | UI, demo video, README |
| **Mar 20, 12:00** | HARD DEADLINE | Submit on DoraHacks, all done |

---

## 📋 PRE-SUBMISSION CHECKLIST

**48 Hours Before Deadline (Mar 18):**

- [ ] Public GitHub repo with valid commits
- [ ] <70% code similarity to any existing project
- [ ] Discord identity verified (all team members)
- [ ] Comprehensive README (500+ words)
- [ ] Demo video (2-5 min) uploaded
- [ ] Live deployment OR local setup instructions
- [ ] Clear explanation of Polkadot features used
- [ ] Future roadmap written
- [ ] Track relevance confirmed (EVM DeFi/AI OR PVM)
- [ ] Screenshots/demo working
- [ ] All links tested (YouTube, deployment, repo)

**If ANY of these are missing, fix IMMEDIATELY.**

---

## 🚫 COMMON DISQUALIFICATION MISTAKES

### Mistake #1: "I'll commit everything on the last day"
**Why it fails:** Judges see one commit on Mar 20, assume you built it before and just uploaded.  
**Fix:** Commit every 1-2 days showing progress.

### Mistake #2: "I forked Uniswap and changed the UI"
**Why it fails:** 85% code similarity = disqualified.  
**Fix:** Use libraries as dependencies, write your own logic.

### Mistake #3: "I forgot to verify Discord"
**Why it fails:** Rule clearly states identity verification required.  
**Fix:** Do it NOW. Don't wait until submission.

### Mistake #4: "My README just says 'Install and run'"
**Why it fails:** Judges need to understand your project quickly.  
**Fix:** Write comprehensive docs with problem, solution, features.

### Mistake #5: "I didn't use any Polkadot features, just deployed Solidity"
**Why it fails:** Pure Ethereum clone won't win. Judges want Polkadot-specific innovation.  
**Fix:** Add XCM, native assets, or precompiles.

### Mistake #6: "I submitted at 12:01 PM on Mar 20"
**Why it fails:** Portal locks at 12:00 PM sharp, no extensions.  
**Fix:** Submit by 10:00 AM on Mar 20 (2-hour buffer).

---

## 🎯 TL;DR - THE ABSOLUTE ESSENTIALS

**To NOT get disqualified:**
1. ✅ Public repo
2. ✅ <70% code similarity to existing projects
3. ✅ Valid commit history (Feb 28 - Mar 20)
4. ✅ Discord verification done

**To WIN:**
5. ✅ Good README
6. ✅ Demo video + live deployment
7. ✅ At least basic UI
8. ✅ Use ONE Polkadot feature (XCM, native assets, precompiles)
9. ✅ Future roadmap
10. ✅ Submit by Mar 20, 10:00 AM (2hr buffer)

---

## 🆘 IF YOU'RE STUCK

**Join Support Channels:**
- OpenGuild Discord: https://discord.gg/WWgzkDfPQF
- Telegram: https://t.me/substratedevs

**Ask Questions EARLY:**
- Don't wait until Mar 19 to ask "How do I deploy?"
- Judges and mentors are active in Discord
- Other hackers are helpful (it's collaborative, not cutthroat)

---

**You've got this. Follow the rules, build something cool, and you've got a real shot at winning.**

**Now go read the main research doc: `polkadot_solidity_hackathon_deep_research.md`**

---

**Document Version:** 1.0  
**Last Updated:** Feb 22, 2026  
**Source:** DoraHacks Official Rules + Track Details
