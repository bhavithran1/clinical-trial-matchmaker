import { useState } from 'react';
import { Wand2, ChevronDown, ChevronUp } from 'lucide-react';

// Heuristic parser that converts raw eligibility criteria text to bullet points
function parseEligibility(text) {
  if (!text) return { inclusion: [], exclusion: [] };

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 10);
  const inclusion = [];
  const exclusion = [];
  let mode = 'inclusion';

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (/exclusion criteria|excluded|must not|cannot have/i.test(lower)) { mode = 'exclusion'; continue; }
    if (/inclusion criteria|included|must have|eligible if|required/i.test(lower)) { mode = 'inclusion'; continue; }

    // Strip leading bullets/numbers
    const clean = line.replace(/^[\-\*\•\d\.]+\s*/, '').trim();
    if (clean.length < 10) continue;

    // Simplify jargon
    const simplified = simplifyTerm(clean);
    if (mode === 'inclusion') inclusion.push(simplified);
    else exclusion.push(simplified);
  }

  return { inclusion: inclusion.slice(0, 8), exclusion: exclusion.slice(0, 8) };
}

const SIMPLIFICATIONS = [
  [/ECOG performance status/gi, 'Activity level (ECOG)'],
  [/histologically confirmed/gi, 'confirmed by biopsy'],
  [/adequate renal function/gi, 'healthy kidneys'],
  [/adequate hepatic function/gi, 'healthy liver'],
  [/creatinine clearance/gi, 'kidney function test'],
  [/informed consent/gi, 'signed consent form'],
  [/metastatic/gi, 'cancer that has spread'],
  [/prior lines of therapy/gi, 'previous treatments'],
  [/\bQTc\b/g, 'heart rhythm interval (QTc)'],
  [/platelet count/gi, 'blood platelet count'],
  [/ANC/g, 'white blood cell count (ANC)'],
  [/absolute neutrophil count/gi, 'white blood cell count'],
  [/serum creatinine/gi, 'kidney waste marker (creatinine)'],
  [/bilirubin/gi, 'liver bile marker (bilirubin)'],
  [/LVEF/g, 'heart pumping strength (LVEF)'],
  [/immunocompromised/gi, 'weakened immune system'],
  [/HIV/g, 'HIV infection'],
  [/CNS/g, 'brain/spinal cord'],
  [/malignancy/gi, 'cancer'],
];

function simplifyTerm(text) {
  let result = text;
  for (const [pattern, replacement] of SIMPLIFICATIONS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

export default function EligibilitySimplifier({ eligibilityCriteria }) {
  const [show, setShow] = useState(false);
  if (!eligibilityCriteria) return null;

  const parsed = parseEligibility(eligibilityCriteria);
  const hasContent = parsed.inclusion.length > 0 || parsed.exclusion.length > 0;

  return (
    <div className="mt-3">
      <button
        onClick={() => setShow(s => !s)}
        className="flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 hover:underline"
      >
        <Wand2 className="w-3 h-3" />
        {show ? 'Hide' : 'Show'} simplified eligibility
        {show ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {show && (
        <div className="mt-2 space-y-3">
          {parsed.inclusion.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">Who may qualify (simplified):</p>
              <ul className="space-y-1">
                {parsed.inclusion.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700 dark:text-gray-300">
                    <span className="shrink-0 text-green-500 mt-0.5">✓</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {parsed.exclusion.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">Who may not qualify (simplified):</p>
              <ul className="space-y-1">
                {parsed.exclusion.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700 dark:text-gray-300">
                    <span className="shrink-0 text-red-400 mt-0.5">✗</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!hasContent && (
            <p className="text-xs text-gray-400">Could not parse eligibility criteria automatically.</p>
          )}
          <p className="text-xs text-gray-400 italic">This is a simplified, automated summary. Always read the full criteria and consult your doctor.</p>
        </div>
      )}
    </div>
  );
}
