import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("http://localhost:3000/game?start=JPN&goal=FRA")
        await page.wait_for_selector("svg.w-full.h-full")
        await asyncio.sleep(2) # Wait for animations
        await page.screenshot(path="screenshot.png")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
