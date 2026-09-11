import { test, expect } from './fixtures';
import AxeBuilder from '@axe-core/playwright';
test('approved creative collection, references and mobile artwork presentation',async({page})=>{
 await page.goto('/collections/creative-transformations');
 await expect(page.locator('h1')).toContainText('Creative transformations');
 await expect(page.locator('.prompt-card')).toHaveCount(12);
 await page.getByRole('heading',{name:'One Day, Four Possible Worlds',exact:true}).getByRole('link').click();
 await expect(page.locator('.prompt-text')).toContainText('intentional depictions');
 await expect(page.locator('.prompt-text')).toContainText('REFERENCE PRESENT:');
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 for(const width of [320,375,430,768,1024,1440]){
  await page.setViewportSize({width,height:900});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 }
 await page.goto('/ai-prompts/couple/barefoot-at-blue-hour');
 await expect(page.locator('.prompt-text')).not.toContainText('African couple');
 await expect(page.locator('.prompt-text')).toContainText('REFERENCE PRESENT:');
});
test('home creative cards are unique and video sources are not eagerly attached',async({page})=>{
 await page.goto('/');
 const hrefs=await page.locator('.prompt-card h3 a').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
 expect(new Set(hrefs).size).toBe(hrefs.length);
 expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 await page.goto('/reel-prompts');
 await expect(page.locator('h1')).toBeVisible();
 await expect(page.locator('video[preload="auto"]')).toHaveCount(0);
});
