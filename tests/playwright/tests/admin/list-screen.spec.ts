import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.beforeAll(async () => {
  await seed();
});

test.describe("ADMIN LIST SCREEN", () => {
  test.beforeAll(async () => {
    await seed();
  });

  test(
    "Show all posts",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");
      // Should show 4 posts on first page (pagination)
      await expect(await userPage.locator("article").count()).toBe(4);
      // Go to page 2 and check next 4 posts
      await userPage.getByRole("button", { name: "2" }).click();
      await expect(await userPage.locator("article").count()).toBe(4);
    },
  );

  test(
    "Filter by content",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      // LIST SCREEN > On the top is a filter screen that allows to filter posts by Title or content
      await userPage.getByLabel("Filter by Content:").fill("Boost");
      await expect(await userPage.locator("article").count()).toBe(1);
      await expect(
        userPage.getByText("Boost your conversion rate"),
      ).toBeVisible();

      await userPage.getByLabel("Filter by Content:").fill("post2");
      await expect(
        userPage.getByText("Better front ends with Fatboy Slim"),
      ).toBeVisible();

      await userPage.getByLabel("Filter by Content:").clear();
      await expect(await userPage.locator("article").count()).toBe(4);
    },
  );

  test(
    "Filter by tag",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");
      await userPage.getByLabel("Filter by Tag:").fill("Front");
      // There are now more posts with 'Front' tag, so count may be higher
      const count = await userPage.locator("article").count();
      expect(count).toBeGreaterThanOrEqual(2);
      await expect(userPage.getByText("Better front ends with Fatboy Slim")).toBeVisible();
      await expect(userPage.getByText("No front end framework is the best")).toBeVisible();
      await userPage.getByLabel("Filter by Tag:").clear();
    },
  );

  test(
    "Filter by date",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      // LIST SCREEN > On the top is a filter screen that allows to filter posts by date
      await userPage
        .getByLabel("Filter by Date Created:")
        .pressSequentially("01012022");
      await expect(await userPage.locator("article").count()).toBe(2);
      await expect(
        userPage.getByText("Boost your conversion rate"),
      ).toBeVisible();
      await expect(
        userPage.getByText("No front end framework is the best"),
      ).toBeVisible();
      await userPage.getByLabel("Filter by Date Created:").clear();
    },
  );

  test(
    "Combine Filters",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      // LIST SCREEN > On the top is a filter screen that allows to filter by visibility
      await userPage.getByLabel("Filter by Tag:").fill("Front");
      await userPage
        .getByLabel("Filter by Date Created:")
        .pressSequentially("01012022");
      await expect(await userPage.locator("article").count()).toBe(1);
      await expect(
        userPage.getByText("No front end framework is the best"),
      ).toBeVisible();
    },
  );

  test(
    "Sort items",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      // title-asc
      await userPage.getByLabel("Sort By:").selectOption("title-asc");
      let articles = await userPage.locator("article").all();
      expect(await articles[0].innerText()).toContain("Better front ends with Fatboy Slim");
      expect(await articles[1].innerText()).toContain("Boost your conversion rate");
      expect(await articles[2].innerText()).toContain("Legacy Code: Friend or Foe?");
      expect(await articles[3].innerText()).toContain("No front end framework is the best");

      // title-desc
      await userPage.getByLabel("Sort By:").selectOption("title-desc");
      articles = await userPage.locator("article").all();
      expect(await articles[0].innerText()).toContain("Why CSS Still Matters");
      expect(await articles[1].innerText()).toContain("Visual Basic is the future");
      expect(await articles[2].innerText()).toContain("TypeScript: The Silent Revolution");
      expect(await articles[3].innerText()).toContain("The Rise and Fall of jQuery");

      // date-asc
      await userPage.getByLabel("Sort By:").selectOption("date-asc");
      articles = await userPage.locator("article").all();
      expect(await articles[0].innerText()).toContain("Legacy Code: Friend or Foe?");
      expect(await articles[1].innerText()).toContain("Why CSS Still Matters");
      expect(await articles[2].innerText()).toContain("TypeScript: The Silent Revolution");
      expect(await articles[3].innerText()).toContain("The Rise and Fall of jQuery");

      // date-desc
      await userPage.getByLabel("Sort By:").selectOption("date-desc");
      articles = await userPage.locator("article").all();
      expect(await articles[0].innerText()).toContain("No front end framework is the best");
      expect(await articles[1].innerText()).toContain("Boost your conversion rate");
      expect(await articles[2].innerText()).toContain("Better front ends with Fatboy Slim");
      expect(await articles[3].innerText()).toContain("Visual Basic is the future");
    },
  );

  test(
    "List items",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      // LIST SCREEN > The list post item displays the image, title of the post and metadata
      const article = await userPage.locator("article").first();
      await expect(
        article.getByText("No front end framework is the best"),
      ).toBeVisible();
      await expect(article.locator("img").first()).toBeVisible();

      // LIST SCREEN > The list post items display metadata such as category, tags, and "active" status
      await expect(article.getByText("#Front-End, #Dev Tools")).toBeVisible();
      await expect(article.getByText("Posted on Dec 16, 2024")).toBeVisible();
      await expect(article.getByText("React")).toBeVisible();
      await expect(article.getByText("Active")).toBeVisible();

      // LIST SCREEN > The active status is a button that, on click, just displays a message
      await expect(article.locator('button:has-text("Active")')).toBeVisible();
    },
  );

  test(
    "Move to detail screen",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      // LIST SCREEN > Clicking on the title takes the user to the MODIFY SCREEN, allowing the user to modify the current post
      await userPage.getByText("No front end framework is the best").click();
      await expect(userPage).toHaveURL(
        "/post/no-front-end-framework-is-the-best",
      );
    },
  );

  test(
    "Move to create post screen",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      // LIST SCREEN > There is a button to create new posts
      await expect(userPage.getByText("Create Post")).toBeVisible();

      // LIST SCREEN > Clicking on the "Create Post" button takes the user to the CREATE SCREEN
      await userPage.locator('a:has-text("Create Post")').click();
      await expect(userPage).toHaveURL("/posts/create");
    },
  );

  test(
    "Can activate / deactivate posts",
    {
      tag: "@a3",
    },
    async ({ userPage }) => {
      await seed();
      await userPage.goto("/");

      //  BACKEND / ADMIN / LIST SCREEN > Logged in user can activate / deactivate a post clicking on the activate button, automatically saving changes

      let article = await userPage.locator("article").first();
      await expect(article.locator('button:has-text("Active")')).toBeVisible();
      await expect(
        article.locator('button:has-text("Inactive")'),
      ).not.toBeVisible();

      await article.locator('button:has-text("Active")').click();

      article = await userPage.locator("article").first();
      await expect(
        article.getByText("Active", { exact: true }),
      ).not.toBeVisible();
      await expect(
        article.getByText("Inactive", { exact: true }),
      ).toBeVisible();

      // reload page and check

      await userPage.reload();

      article = await userPage.locator("article").first();
      await expect(
        article.getByText("Active", { exact: true }),
      ).not.toBeVisible();
      await expect(
        article.getByText("Inactive", { exact: true }),
      ).toBeVisible();
    },
  );

  test(
    "Pagination navigation",
    {
      tag: "@a3",
    },
    async ({ userPage }) => {
      await userPage.goto("/");

      // In Page 1, prev button should be disabled, next button enabled
      await expect(await userPage.locator("article").count()).toBe(4);
      // Check titles on page 1 (date-desc default)
      const page1Titles = [
        "No front end framework is the best",
        "Boost your conversion rate",
        "Better front ends with Fatboy Slim",
        "Visual Basic is the future",
      ];
      for (const title of page1Titles) {
        await expect(userPage.getByText(title)).toBeVisible();
      }

      const prevBtn = userPage.getByRole("button", { name: "Previous" });
      await expect(prevBtn).toBeDisabled();
      const nextBtn = userPage.getByRole("button", { name: "Next" });
      await expect(nextBtn).toBeEnabled();

      // The button for page 1 should be disabled in page 1, and other pages enabled
      const page1Btn = userPage.getByRole("button", { name: "1" });
      const page2Btn = userPage.getByRole("button", { name: "2" });
      await expect(page1Btn).toBeDisabled();
      await expect(page2Btn).toBeEnabled();

      // Go to page 2 using page 2 button
      await page2Btn.click();
      await expect(await userPage.locator("article").count()).toBe(4);
      // Check titles on page 2
      const page2Titles = [
        "TypeScript: The Silent Revolution",
        "The Rise and Fall of jQuery",
        "Why CSS Still Matters",
        "Legacy Code: Friend or Foe?",
      ];
      for (const title of page2Titles) {
        await expect(userPage.getByText(title)).toBeVisible();
      }

      // Now page 2 should be disabled, page 1 enabled
      await expect(page2Btn).toBeDisabled();
      await expect(page1Btn).toBeEnabled();

      // Go back to page 1 using page 1 button
      await page1Btn.click();
      await expect(await userPage.locator("article").count()).toBe(4);
      for (const title of page1Titles) {
        await expect(userPage.getByText(title)).toBeVisible();
      }
      // Previous should be disabled again
      await expect(prevBtn).toBeDisabled();
    },
  );
});
