import AxeBuilder from "@axe-core/playwright";
import {expect, test, type Page} from "@playwright/test";

async function tabUntil(page: Page, selector: string, maxTabs = 40) {
  for (let index = 0; index < maxTabs; index += 1) {
    await page.keyboard.press("Tab");

    const matched = await page.evaluate((target) => {
      const active = document.activeElement;
      return active instanceof Element && active.matches(target);
    }, selector);

    if (matched) {
      return;
    }
  }

  throw new Error(`Keyboard focus never reached ${selector}`);
}

test.beforeEach(async ({page}) => {
  await page.route("**/api/early-access", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ok: true, leadId: "qa-lead"})
    });
  });
});

test("landing has no document-level horizontal overflow", async ({page}) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const dimensions = await page.evaluate(() => {
    const clientWidth = document.documentElement.clientWidth;
    const offenders = [...document.querySelectorAll<HTMLElement>("body *")]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          id: element.id,
          className: element.className,
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width)
        };
      })
      .filter(
        (element) =>
          element.width > 0 &&
          (element.right > clientWidth + 1 || element.left < -1)
      )
      .sort(
        (a, b) =>
          Math.max(b.right - clientWidth, Math.abs(b.left)) -
          Math.max(a.right - clientWidth, Math.abs(a.left))
      )
      .slice(0, 12);

    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth,
      offenders
    };
  });

  expect(
    dimensions.scrollWidth,
    `document width ${dimensions.scrollWidth}px exceeds viewport ${dimensions.clientWidth}px; offenders: ${JSON.stringify(dimensions.offenders)}`
  ).toBeLessThanOrEqual(dimensions.clientWidth + 1);

  await expect(page.getByRole("link", {name: "Try it on my release"}).first()).toBeVisible();
  await expect(page.locator("#showcase")).toBeVisible();
  await expect(page.locator("#templates")).toBeVisible();
});


test("mobile template tabs scroll inside their own container", async ({page}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium-mobile-320");

  await page.goto("/#templates");

  const geometry = await page.locator(".template-tabs").evaluate((element) => {
    const rect = element.getBoundingClientRect();

    return {
      left: Math.round(rect.left),
      right: Math.round(rect.right),
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      viewportWidth: document.documentElement.clientWidth
    };
  });

  expect(geometry.left).toBeGreaterThanOrEqual(0);
  expect(geometry.right).toBeLessThanOrEqual(geometry.viewportWidth + 1);
  expect(geometry.scrollWidth).toBeGreaterThan(geometry.clientWidth);
});

test("primary CTA and early-access form are keyboard usable", async ({page}) => {
  await page.goto("/");

  await tabUntil(page, 'a[href="#contact"].button-primary');
  await expect(page.locator('a[href="#contact"].button-primary').first()).toBeFocused();
  await page.keyboard.press("Enter");

  await tabUntil(page, 'input[name="email"]');
  await page.keyboard.type("creator@example.com");
  await page.keyboard.press("Tab");

  await expect(page.locator('input[name="repositoryUrl"]')).toBeFocused();
  await page.keyboard.type("https://github.com/example/product");
  await page.keyboard.press("Tab");

  await expect(page.locator('select[name="releaseFrequency"]')).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");

  await expect(page.getByRole("button", {name: "Try it on my release"})).toBeFocused();
  await page.keyboard.press("Enter");

  await expect(page.getByRole("status")).toContainText("Got it.");
});

test("template explorer supports keyboard tab navigation", async ({page}) => {
  await page.goto("/#templates");

  const kinetic = page.getByRole("tab", {name: /Kinetic/});
  await kinetic.focus();
  await expect(kinetic).toHaveAttribute("aria-selected", "true");

  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", {name: /Minimal/})).toHaveAttribute(
    "aria-selected",
    "true"
  );

  await page.keyboard.press("End");
  await expect(page.getByRole("tab", {name: /Technical/})).toHaveAttribute(
    "aria-selected",
    "true"
  );
});

test("critical and serious axe violations stay at zero", async ({page}) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const results = await new AxeBuilder({page})
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const blocking = results.violations.filter(
    (violation) => violation.impact === "critical" || violation.impact === "serious"
  );

  expect(
    blocking.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      nodes: violation.nodes.map((node) => node.target)
    }))
  ).toEqual([]);
});

test("reduced-motion removes decorative animation", async ({page}) => {
  await page.emulateMedia({reducedMotion: "reduce"});
  await page.goto("/");

  const motion = await page.locator(".release-source-card").evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      animationName: style.animationName,
      animationDuration: style.animationDuration
    };
  });

  expect(motion.animationName).toBe("none");
  expect(["0s", "0.001s"]).toContain(motion.animationDuration);

  const reveal = await page.locator(".motion-reveal").first().evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      opacity: style.opacity,
      transform: style.transform
    };
  });

  expect(reveal.opacity).toBe("1");
  expect(reveal.transform).toBe("none");
});

test("showcase media is lazy and does not introduce major CLS", async ({page}) => {
  await page.addInitScript(() => {
    (window as Window & {__qaCls?: number}).__qaCls = 0;

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & {
          value: number;
          hadRecentInput: boolean;
        };

        if (!shift.hadRecentInput) {
          (window as Window & {__qaCls?: number}).__qaCls =
            ((window as Window & {__qaCls?: number}).__qaCls ?? 0) + shift.value;
        }
      }
    }).observe({type: "layout-shift", buffered: true});
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const images = page.locator(".showcase-media img");
  await expect(images).toHaveCount(3);

  for (let index = 0; index < 3; index += 1) {
    await expect(images.nth(index)).toHaveAttribute("loading", "lazy");
  }

  const cls = await page.evaluate(
    () => (window as Window & {__qaCls?: number}).__qaCls ?? 0
  );

  expect(cls).toBeLessThanOrEqual(0.1);
});
