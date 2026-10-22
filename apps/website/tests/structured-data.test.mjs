import test from "node:test";
import assert from "node:assert/strict";
import { serializeStructuredData, blogPostStructuredData, breadcrumbStructuredData, websiteStructuredData } from "../lib/structured-data.ts";
import { journalPosts } from "../content/journal.ts";

test("JSON-LD safely preserves untrusted text without closing the script element", () => {
  const content = { headline: '</script><script>alert("x")</script> & <b>Text</b>' };
  const json = serializeStructuredData(content);
  assert.ok(!json.includes("<"));
  assert.deepEqual(JSON.parse(json), content);
});

test("structured data uses canonical URLs and only authored article facts", () => {
  const website = websiteStructuredData["@graph"].find((item) => item["@type"] === "WebSite");
  assert.equal(website.url, "https://pimolu.com/");
  assert.equal(website.name, "Pimolu UI");
  for (const post of journalPosts) {
    const article = blogPostStructuredData(post);
    assert.equal(article.headline, post.title);
    assert.equal(article.datePublished, post.date);
    assert.equal(article.mainEntityOfPage["@id"], `https://pimolu.com/blog/${post.slug}`);
    assert.equal(article.author.name, "Pimolu editorial");
    assert.ok(!("dateModified" in article));
  }
  const crumbs = breadcrumbStructuredData([{ name: "Home", path: "/" }, { name: "Components", path: "/components" }]);
  assert.equal(crumbs.itemListElement[1].item, "https://pimolu.com/components");
  assert.deepEqual(crumbs.itemListElement.map((item) => item.position), [1, 2]);
});
