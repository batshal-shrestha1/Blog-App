import { expect, test } from "./fixtures";

test.describe("TAG SCREEN", () => {
  test(
    "Existing Tag with one post",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/tags/dev-tools");

      // TAG SCREEN > Displays posts with the tag url (e.g. /tags/dev-tools)

      const articles = await page.locator('[data-test-id^="blog-post-"]');
      await expect(articles).toHaveCount(1);

      await expect(page.getByTestId("blog-post-3")).toBeVisible();
      await expect(
        page.getByText("No front end framework is the best"),
      ).toBeVisible();
    },
  );

  test(
    "Existing Tag with multiple posts and pagination",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/tags/front-end");

      // There are 5 posts with the 'Front-End' tag, paginated 4 per page
      const page1Titles = [
        "Better front ends with Fatboy Slim",
        "No front end framework is the best",
        "TypeScript: The Silent Revolution",
        "The Rise and Fall of jQuery",
      ];
      const articles = await page.locator('[data-test-id^="blog-post-"]');
      await expect(articles).toHaveCount(4);
      for (const title of page1Titles) {
        await expect(page.getByText(title)).toBeVisible();
      }

      // Go to page 2 and check for the last post
      const paginationNav = page.getByRole("navigation", { name: /pagination/i });
      const page2Link = paginationNav.getByRole("link", { name: "2" });
      await page2Link.click();
      await expect(page.getByText("Why CSS Still Matters")).toBeVisible();
      const articles2 = await page.locator('[data-test-id^="blog-post-"]');
      await expect(articles2).toHaveCount(1);
    },
  );

  test(
    "Invalid Tag",
    {
      tag: "@a1",
    },
    async ({ page }) => {
      await page.goto("/category/abc");

      // TAG SCREEN > Displays "0 Posts" when search does no posts have that tag

      const articles = await page.locator('[data-test-id^="blog-post-"]');
      await expect(articles).toHaveCount(0);

      await expect(page.getByText("0 Posts")).toBeVisible();
    },
  );
});
