import type { EvalSuite } from '@agentskit/eval'

/** Eval cases for the SOAP AgentHandle (`run(dictation) → jsonNoteResult`). */
export const suite: EvalSuite = {
  name: 'clinical-note-summariser',
  cases: [
    {
      input: 'Patient reports productive cough x3 days. Temp 38.1, lungs clear. Likely viral URI. Plan: rest, fluids, recheck if worse.',
      expected: (r: string) => /"assessment":/.test(r) && /"plan":/.test(r) && /"requiresClinicianSignoff":true/.test(r),
    },
    {
      input: 'Patient says knee hurts after running.',
      expected: (r: string) => /"missingFields":\[/.test(r),
    },
  ],
}
