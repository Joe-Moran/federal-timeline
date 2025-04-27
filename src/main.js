import "vis-timeline/styles/vis-timeline-graph2d.min.css";
import "./style.css";
import { max, parse } from "date-fns";
import { parseToJson } from "./org";
import { DataSet } from "vis-data";

import { split } from "change-case";
import timeline from "./timeline/timeline.js";

(async () => {
  const orgFile = (await import(`../current-events.org?raw`)).default;
  const groupsRaw = [
    { id: 1, content: "Judicial" },
    { id: 2, content: "Legislative" },
    { id: 3, content: "Executive" },
  ];
  const groups = new DataSet(groupsRaw);

  const toTimelineItems = (json) =>
    json.flatMap((item, index) =>
      item.posts.map((post, postIndex) => ({
        id: `${index}-${postIndex}`,
        content: {
          ...post,
          tags: post.tags.map((tag) => split(tag).join(" ")),
        },
        // content: post.title,
        start: parse(item.day, "yyyy-MM-dd EEEE", new Date()),
        type: "box",
        // group: groupsRaw.find((group) => group.content === post.properties.branch)
        //   ?.id,
        style:
          "max-width: 300px; white-space: normal; overflow: hidden; text-overflow: ellipsis;",
      }))
    );

  let entriesFormatted = toTimelineItems(parseToJson(orgFile));

  timeline(entriesFormatted);
})();
