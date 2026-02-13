import FrequencySlider from "../components/FrequencySlider.tsx";

export default function WhatIsANote() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">What is a Note?</h2>

      <div className="text-gray-600 space-y-4 leading-relaxed">
        <p>
          A <strong>note</strong> is a single musical sound with a specific
          pitch. When something vibrates at a steady rate — a guitar string, a
          column of air, a speaker cone — it creates pressure waves that our
          ears interpret as pitch.
        </p>
        <p>
          The speed of that vibration is measured in{" "}
          <strong>hertz (Hz)</strong>, or cycles per second. A faster vibration
          means a higher pitch. For example, the note A above middle C vibrates
          at 440 times per second (440 Hz).
        </p>
        <p>
          Try the slider below to hear different frequencies. Notice how lower
          numbers sound deep and rumbly, while higher numbers sound bright and
          piercing.
        </p>
      </div>

      <FrequencySlider id="note-explorer" initialFrequency={440} />

      <div className="text-gray-500 text-sm space-y-2">
        <p>
          <strong className="text-gray-700">Fun fact:</strong> The note A above
          middle C is tuned to 440 Hz by international convention. Every other
          note's frequency is derived from this reference point.
        </p>
        <p>
          <strong className="text-gray-700">Octaves:</strong> When you double a
          frequency, you get the same note one octave higher.
          A4&nbsp;=&nbsp;440&nbsp;Hz, so A5&nbsp;=&nbsp;880&nbsp;Hz and
          A3&nbsp;=&nbsp;220&nbsp;Hz.
        </p>
      </div>
    </div>
  );
}
