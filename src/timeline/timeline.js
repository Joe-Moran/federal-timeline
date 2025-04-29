import { Timeline } from "vis-timeline/standalone";
import externalLink from "../external-link.svg";
import { DataSet } from "vis-data";
import { format } from "date-fns";

const timeline = (entries) => {
  const resetOtherProperties = (object, property) => {
    Object.entries(object).forEach(([key]) => {
      if (key !== property) {
        object[key] = "";
      }
    });
  };
  let items = new DataSet(entries);
  let filter = new Proxy(
    { tag: "", subject: "" },
    {
      set(object, property, newValue) {
        object[property] = newValue;
        resetOtherProperties(object, property);
        filterItem(object);
        return true;
      },
    }
  );
  var container = document.getElementById("app");

  const tagsUnique = new Set(
    items
      .get()
      .flatMap((item) => item.content.tags)
      .sort((a, b) => a.localeCompare(b))
  );

  const subjectsUnique = new Set(
    items
      .get()
      .flatMap((item) => item.content.properties.subject)
      .sort((a, b) => a.localeCompare(b))
  );

  subjectsUnique.forEach((subject) => {
    let subjectOptionElement = document.createElement("option");
    subjectOptionElement.value = subject;
    subjectOptionElement.innerText = subject;
    document.getElementById("filter-subject").appendChild(subjectOptionElement);
  });

  tagsUnique.forEach((tag) => {
    let tagOptionElement = document.createElement("option");
    tagOptionElement.value = tag;
    tagOptionElement.innerText = tag;

    document.getElementById("filter-tag").appendChild(tagOptionElement);
  });

  document.getElementById("filter-tag").addEventListener("change", (e) => {
    // filterItem({ tag: e.target.value });
    filter.tag = e.target.value;
  });

  document.getElementById("filter-subject").addEventListener("change", (e) => {
    // filterItem({ tag: "", subject: e.target.value });
    filter.subject = e.target.value;
  });

  const setupListeners = () => {
    Object.values(document.getElementsByClassName("timeline-tag")).forEach(
      (element) => {
        element.addEventListener("click", (e) => {
          //   filterItem({ tag: e.target.innerText });
          filter.tag = e.target.innerText;
        });
      }
    );
  };

  const buildCardTitle = (item) => {
    return `
  <h3 class="timeline-item-title">
      ${
        item.content.properties.link
          ? `<a target="_blank" href="${item.content.properties.link}">
        ${item.content.title}<img alt="" src="${externalLink}" class="external-link" />
        </a>`
          : item.content.title
      }

      </h3>`;
  };

  const buildListItem = (item) => {
    return `
  	  <li class="timeline-cluster-item">

      ${
        item.content.properties.link
          ? `<a target="_blank" href="${item.content.properties.link}">
        ${item.content.title}<img alt="" src="${externalLink}" class="external-link" />
        </a>`
          : item.content.title
      }

      </li>`;
  };

  const buildDetailsDrawer = (item) => {
    return item.content.text.length > 0
      ? `
<details>
  <summary class="details-drawer">Details</summary>
  <p class="item-text">${item.content.text}</p>
</details>`
      : "";
  };

  const buildTags = (item) => {
    let hasFiltered = !!item.content.tags.find((tag) => tag === filter.tag);
    const truncatedTags = new Set(item.content.tags.slice(0, 3));
    if (hasFiltered) {
      truncatedTags.add(filter.tag);
    }
    const tagButtons = Array.from(truncatedTags).map(
      (tag) =>
        `<button class="timeline-tag ${
          tag === filter.tag ? "selected" : ""
        }">${tag}</button>`
    );

    return `<div class="timeline-tags-container ${
      item.content.tags.length > 0 ? "" : "empty"
    }">
    ${tagButtons.join("")}
      </div>`;
  };

  const buildCardTemplate = (item) => {
    return `
  <div class='timeline-item ${item.content.tags.length > 0 ? "" : "no-tags"}'>
    <span class="date">${format(item.start, "MMM d, yyyy")}</span>
    ${buildCardTitle(item)}
    ${buildDetailsDrawer(item)}
    ${buildTags(item)}
  </div>`;
  };

  const selectTagOption = (tag) => {
    let selectElement = document.getElementById("filter-tag");
    selectElement.value = tag;
  };

  const selectSubjectOption = (subject) => {
    let selectElement = document.getElementById("filter-subject");
    selectElement.value = subject;
  };

  const buildClusterTemplate = (item) => {
    let clusterItems = item.items.map((item) => buildListItem(item));

    return item.items.length > 4
      ? item.content
      : `<div class='timeline-item>
          <span class="date">${format(item.start, "MMM d, yyyy")}</span>
          <ul>${clusterItems.join("")}</ul>
        </div>
        `;
  };

  var options = {
    min: "2016-01-01",
    start: "2025-01-01",
    editable: false,
    stack: true,
    zoomable: true,
    horizontalScroll: true,
    selectable: false,
    zoomKey: 'metaKey',
    orientation: 'top',
    verticalScroll: true,
    showCurrentTime: false,
    // groupOrder: "content",
    // groups: groups,
    align: "auto",
    cluster: { showStipes: true, maxItems: 2 },
    zoomMin: (1000 * 60 * 60 * 24 * 30) / 9, // 1 month
    zoomMax: 1000 * 60 * 60 * 24 * 30 * 12 * 3, // 3 year
    moveable: true,
    height: '100%',
    // maxHeight: 500,
    template: function (item, element) {
      element.innerHTML = item.isCluster ? buildClusterTemplate(item) : buildCardTemplate(item)
    },
    margin: {
      item: 30,
      axis: 50,
    },
    // timeAxis: { scale: "day", step: 1 },
    onInitialDrawComplete: setupListeners,
  };

  var timeline = new Timeline(container, items, options);
  timeline.on("changed", setupListeners);
  // timeline.setGroups(groups);
  // timeline.redraw();

  const filterItem = (options) => {
    // filter = options;
    selectTagOption(options.tag);
    selectSubjectOption(options.subject);
    let filteredItems = items.get({
      filter: function (item) {
        if (options.tag != "") {
          return item.content.tags.includes(options.tag);
        }

        if (options.subject != "") {
          return item.content.properties.subject === options.subject;
        }
        return true;
      },
    });
    timeline.setItems(filteredItems);
    timeline.fit();
  };
};

export default timeline;
