import React from "react";
import { Field } from "../ui";

const FIELDS = [
  ["Transition", "transition"], ["Audio", "audio"], ["Subtitle", "subtitle"],
  ["Text overlay", "overlay"], ["Video davomiyligi", "duration"], ["Format", "format"],
  ["Color grading", "grading"], ["Speed ramp", "speedramp"], ["Effects", "effects"]
];

export default function EditTab({ day, set }) {
  const en = day.editNotes;
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {FIELDS.map(([label, key]) => (
        <Field key={key} label={label} value={en[key]} onChange={v => set(`editNotes.${key}`, v)} />
      ))}
    </div>
  );
}
