import React from "react";
import { Field } from "../ui";

export default function StoryTab({ day, set }) {
  return (
    <div className="space-y-3">
      <div className="grid md:grid-cols-3 gap-3">
        {[0, 1, 2].map(i => (
          <Field key={i} label={`Story ${i + 1}`} textarea rows={3} value={day.stories[i]} onChange={v => set(`stories.${i}`, v)} />
        ))}
      </div>
      <hr style={{ borderColor: "var(--line)" }} />
      <Field label="Post / Carousel matni" textarea rows={3} value={day.post.carousel} onChange={v => set("post.carousel", v)} />
      <Field label="Caption" textarea rows={4} value={day.post.caption} onChange={v => set("post.caption", v)} />
      <Field label="Hashtag" textarea rows={2} value={day.post.hashtag} onChange={v => set("post.hashtag", v)} />
    </div>
  );
}
