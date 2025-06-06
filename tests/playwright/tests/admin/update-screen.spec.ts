import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.beforeEach(async () => {
  await seed();
});

test.describe("ADMIN UPDATE SCREEN", () => {
  test(
    "Authorisation",
    {
      tag: "@a2",
    },
    async ({ page }) => {
      await page.goto("/post/no-front-end-framework-is-the-best");

      // UPDATE SCREEN > Shows login screen if not logged
      await expect(
        page.getByText("Sign in to your account", { exact: true }),
      ).toBeVisible();
    },
  );

  test(
    "Update post form",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/post/no-front-end-framework-is-the-best");

      const saveButton = await userPage.getByText("Save");

      // UPDATE SCREEN > There must be the following fields which must be validated for errors:

      // UPDATE SCREEN > Title

      await userPage.getByLabel("Title").clear();
      await saveButton.click();

      await expect(userPage.getByText("Title is required")).toBeVisible();
      await userPage.getByLabel("Title").fill("New title");
      await saveButton.click();
      await expect(userPage.getByText("Title is required")).not.toBeVisible();

      // UPDATE SCREEN > Description

      await userPage.getByLabel("Description").clear();
      await saveButton.click();

      await expect(userPage.getByText("Description is required")).toBeVisible();
      await userPage.getByLabel("Description").fill("New Description");
      await saveButton.click();
      await expect(
        userPage.getByText("Description is required"),
      ).not.toBeVisible();

      // cannot be longer than 200
      await userPage.getByLabel("Description").fill("a".repeat(201));
      await saveButton.click();
      await expect(
        userPage.getByText(
          "Description is too long. Maximum is 200 characters",
        ),
      ).toBeVisible();

      await userPage.getByLabel("Description").fill("a".repeat(200));
      await saveButton.click();
      await expect(
        userPage.getByText(
          "Description is too long. Maximum is 200 characters",
        ),
      ).not.toBeVisible();

      // UPDATE SCREEN > Content

      await userPage.getByLabel("Content").clear();
      await saveButton.click();

      await expect(userPage.getByText("Content is required")).toBeVisible();
      await userPage.getByLabel("Content").fill("New Description");
      await saveButton.click();
      await expect(userPage.getByText("Content is required")).not.toBeVisible();

      // UPDATE SCREEN > Image

      await userPage.getByLabel("Image URL").clear();
      await saveButton.click();

      // required
      await expect(userPage.getByText("Image URL is required")).toBeVisible();

      // invalid
      await userPage.getByLabel("Image URL").fill("some url");
      await saveButton.click();
      await expect(userPage.getByText("This is not a valid URL")).toBeVisible();

      await userPage
        .getByLabel("Image URL")
        .fill("http://example.com/image.jpg");
      await saveButton.click();
      await expect(
        userPage.getByText("Image URL is required"),
      ).not.toBeVisible();

      // UPDATE SCREEN > Tag Lists

      await userPage.getByLabel("Tags").clear();
      await saveButton.click();

      await expect(
        userPage.getByText("At least one tag is required"),
      ).toBeVisible();
      await userPage.getByLabel("Tags").fill("Tag");
      await saveButton.click();
      await expect(
        userPage.getByText("At least one tag is required"),
      ).not.toBeVisible();
    },
  );

  test(
    "Save post form",
    {
      tag: "@a3",
    },
    async ({ userPage }) => {
      await seed();
      await userPage.goto("/post/no-front-end-framework-is-the-best");

      // BACKEND / ADMIN / UPDATE SCREEN > Logged in user can save changes to database, if the form is validated

      await userPage.getByLabel("Title").fill("New title");
      await userPage.getByLabel("Description").fill("New Description");
      await userPage.getByLabel("Content").fill("New Content");
      await userPage
        .getByLabel("Image URL")
        .fill("http://example.com/image.jpg");
      await userPage.getByLabel("Tags").fill("Tag");
      await userPage.getByText("Save").click();

      await expect(
        userPage.getByText("Post updated successfully"),
      ).toBeVisible();

      // check if the changes are there
      await userPage.goto("/");

      const article = await userPage.locator("article").first();
      await expect(article.getByText("New title")).toBeVisible();
      await expect(article.getByText("Tag")).toBeVisible();
      await expect(article.locator("img")).toHaveAttribute(
        "src",
        "http://example.com/image.jpg",
      );
    },
  );

  test(
    "Create post form",
    {
      tag: "@a3",
    },
    async ({ userPage }) => {
      await seed();
      await userPage.goto("/posts/create");

      // BACKEND / ADMIN / UPDATE SCREEN > Logged in user can create a new post to the database, if the form is validated

      await userPage.getByLabel("Title").fill("New title");
      await userPage.getByLabel("Category").fill("React");
      await userPage.getByLabel("Description").fill("New Description");
      await userPage.getByLabel("Content").fill("New Content");
      await userPage
        .getByLabel("Image URL")
        .fill("http://example.com/image.jpg");
      await userPage.getByLabel("Tags").fill("Tag");
      await userPage.getByText("Save").click();

      await expect(
        userPage.getByText("Post updated successfully"),
      ).toBeVisible();

      // check if the changes are there
      await userPage.goto("/");

      const article = await userPage.locator("article").first();
      await expect(article.getByText("New title")).toBeVisible();
      await expect(article.locator('a:has-text("New title")')).toHaveAttribute(
        "href",
        "/post/new-title",
      );
      await expect(article.getByText("Tag")).toBeVisible();
      await expect(article.locator("img")).toHaveAttribute(
        "src",
        "http://example.com/image.jpg",
      );
    },
  );

  test(
    "Show preview",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/post/no-front-end-framework-is-the-best");

      // UPDATE SCREEN > Under the Description is a "Preview" button that replaces the text area with a rendered markdown string and changes the title to "Close Preview".
      await userPage.getByText("Preview").focus();
      await userPage.getByText("Preview").click();
      await expect(userPage.getByTestId("content-preview")).toBeVisible();
      await expect(
        await userPage.getByTestId("content-preview").innerHTML(),
      ).toContain("<strong>sint voluptas</strong>");
      await expect(userPage.getByText("Close Preview")).toBeVisible();
    },
  );

  test(
    "Restore preview",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/post/no-front-end-framework-is-the-best");

      // UPDATE SCREEN > When the preview is closed, the cursor must be in the same position as before opening the preview.

      let textBox = await userPage.getByLabel("Content");
      await textBox.evaluate((element: HTMLTextAreaElement) => {
        element.focus();
        element.setSelectionRange(20, 20);
        element.focus();
      });

      await userPage.getByText("Preview").click();
      await userPage.getByText("Close Preview").click();

      textBox = await userPage.getByLabel("Content");
      const { selectionStart, selectionEnd } = await textBox.evaluate(
        (textarea: HTMLTextAreaElement) => {
          return {
            selectionStart: textarea.selectionStart,
            selectionEnd: textarea.selectionEnd,
          };
        },
      );

      expect(selectionStart).toBe(20);
      expect(selectionEnd).toBe(20);
    },
  );

  test(
    "Image Preview",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/post/no-front-end-framework-is-the-best");

      // UPDATE SCREEN > Under the image input is an image preview;

      await expect(userPage.getByTestId("image-preview")).toBeVisible();
      await expect(
        await userPage.getByTestId("image-preview").getAttribute("src"),
      ).toBe(
        "https://plus.unsplash.com/premium_photo-1661517706036-a48d5fc8f2f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      );
    },
  );

  test(
    "Save Button",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto("/post/no-front-end-framework-is-the-best");

      // UPDATE SCREEN > User can click on the "Save" button that displays an error ui if one of the fields is not specified or valid.

      await expect(
        userPage.getByText("Please fix the errors before saving"),
      ).not.toBeVisible();

      await userPage.getByLabel("Title").clear();
      await userPage.getByText("Save").click();
      await expect(
        userPage.getByText("Please fix the errors before saving"),
      ).toBeVisible();
    },
  );

  test(
    "Quill Rich Text Editor integration",
    {
      tag: "@a3",
    },
    async ({ userPage }) => {
      await seed();
      await userPage.goto("/posts/create");

      // Fill out required fields
      await userPage.getByLabel("Title").fill("Quill Test Post");
      await userPage.getByLabel("Category").fill("React");
      await userPage.getByLabel("Description").fill("Testing Quill");
      await userPage.getByLabel("Image URL").fill("http://example.com/quill.jpg");
      await userPage.getByLabel("Tags").fill("Quill");

      // Interact with Quill editor (assume .ql-editor is the contenteditable area)
      const quillEditor = userPage.locator(".ql-editor");
      await quillEditor.click();
      await quillEditor.type("This is ");
      // Bold
      await userPage.locator('.ql-bold').click();
      await quillEditor.type("bold");
      await userPage.locator('.ql-bold').click();
      await quillEditor.type(", ");
      // Italic
      await userPage.locator('.ql-italic').click();
      await quillEditor.type("italic");
      await userPage.locator('.ql-italic').click();
      await quillEditor.type(", ");
      // Underline
      await userPage.locator('.ql-underline').click();
      await quillEditor.type("underline");
      await userPage.locator('.ql-underline').click();
      await quillEditor.type(", ");

      // Save the post
      await userPage.getByText("Save").click();
      await expect(userPage.getByText("Post updated successfully")).toBeVisible();

      // Go to update form for the new post
      await userPage.goto("/post/quill-test-post");
      // Wait for the Quill editor to be visible
      const updateQuillEditor = userPage.locator(".ql-editor");
      await expect(updateQuillEditor).toBeVisible();
      // Check that the editor contains the expected formatted content
      const editorHtml = await updateQuillEditor.innerHTML();
      expect(editorHtml).toContain("<strong>bold</strong>");
      expect(editorHtml).toContain("<em>italic</em>");
      expect(editorHtml).toContain("<u>underline</u>");
    },
  );

  test(
    "Cloudinary image upload",
    {
      tag: "@a3",
    },
    async ({ userPage }) => {
      // Intercept actual Cloudinary upload endpoint BEFORE navigation (single backslash in regex)
      await userPage.route(/cloudinary\.com\/v1_1\/.*\/image\/upload/, async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            url: "https://res.cloudinary.com/ddjxeqzmi/image/upload/v1749215278/blog-images/xlycamx0xwtwnoqn39h6.png"
          }),
        });
      });

      await userPage.goto("/posts/create");

      // Simulate file selection
      const fileInput = userPage.locator('input[type="file"]');
      await fileInput.setInputFiles('tests/fixtures/sample.jpg');

      // Assert preview is visible and Image URL is a Cloudinary URL with correct structure
      await expect(userPage.getByTestId("image-preview")).toBeVisible();
      const imageUrl = await userPage.getByLabel("Image URL").inputValue();
      expect(imageUrl).toContain("res.cloudinary.com/ddjxeqzmi/image/upload/");
      expect(imageUrl).toContain("/blog-images/");
      expect(imageUrl).toMatch(/\.png$/);
    }
  );
});
