# Clinical Trial Matchmaker

A friendlier search interface over ClinicalTrials.gov — designed for patients, families, and caregivers navigating complex conditions like oncology.

## Problem It Solves

ClinicalTrials.gov's native interface is built for researchers. Patients and families face:
- Overwhelming jargon in eligibility criteria
- Difficulty filtering by what matters to them (age, location, phase)
- No way to save and compare trials

## Features

- Plain-language search by condition, keywords, phase, status, age
- Readable trial cards with contact info surfaced front-and-center
- Save/bookmark trials to discuss with healthcare providers
- Detailed modal view with eligibility, interventions, and all site locations
- Pagination through large result sets
- Quick-start examples for common oncology conditions

## Data Source

All data comes from the **ClinicalTrials.gov v2 REST API** (free, no API key):
https://clinicaltrials.gov/api/v2/studies

## Tech Stack

- React 19 + Vite
- Tailwind CSS v4
- Lucide React icons

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```
src/
  components/
    SearchForm.jsx    - Condition/keyword/phase/age filters
    TrialCard.jsx     - Summary card with save button
    TrialDetail.jsx   - Full detail modal overlay
  utils/
    api.js            - ClinicalTrials.gov API helpers
  App.jsx             - Main layout, state, pagination
```

## Disclaimer

This tool surfaces publicly available clinical trial data. It is not medical advice. Always consult your healthcare provider before contacting or enrolling in any clinical trial.

## Planned Improvements

- Map view of trial locations
- Eligibility plain-language translator (using AI)
- Email/PDF export of saved trials
- Nearby trials based on zip code geolocation
- Trial comparison side-by-side view
- Push notifications when saved trials change status
