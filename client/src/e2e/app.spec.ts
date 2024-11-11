import { test, expect } from '@playwright/test';

test.describe('MAIN PAGE', () => {
  test('Home button', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.getByRole('banner').getByLabel('Go to about page').click();
    await page.getByRole('banner').getByLabel('Go to home page').click();
    await expect.soft(page.getByRole('heading', { name: 'News', exact:true })).toBeVisible();

    await page.getByRole('banner').getByLabel('Go to collection page').click();
    await page.getByRole('banner').getByLabel('Go to home page').click();
    await expect.soft(page.getByRole('heading', { name: 'News', exact:true })).toBeVisible();

    await page.getByRole('banner').getByLabel('Go to game page').click();
    await page.getByLabel('Close tutorial window').click();
    await page.getByRole('banner').getByLabel('Go to home page').click();
    await expect.soft(page.getByRole('heading', { name: 'News', exact:true })).toBeVisible();
  });

  test('Click on one news and access page', async ({ page }) => {
    await page.goto('http://localhost:5173/');
  })
})

test.describe('COLLECTION PAGE', () => {
  test('Go to Collection page', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('banner').getByLabel('Go to collection page').click();
    await expect(page.getByRole('button', { name: 'filter box' })).toBeVisible();
  });

  test('Filter by benefits: 0 cards displayed', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('banner').getByLabel('Go to collection page').click();
    await page.getByText('Original').click();
    await expect.soft(page.getByText('Original')).not.toBeChecked();
    await expect(page.locator('.card__picture')).toHaveCount(0);
  });

  test('Filter by member, remove first input: 27 cards displayed', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('banner').getByLabel('Go to collection page').click();
    await page.getByText('Nayeon', { exact: true }).click();
    await expect.soft(page.getByText('Nayeon', { exact: true })).not.toBeChecked();
    await expect(page.locator('.card__picture')).toHaveCount(27);
  });

  test('Change category to Japanese albums: album=#Twice', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('banner').getByLabel('Go to collection page').click();
    await page.locator('#select-category').selectOption('Japanese Albums');
    await expect.soft(page.getByText('Original', { exact: true })).toBeChecked();
    await expect.soft(page.getByText('Hi-Touch', { exact: true })).toBeChecked();
    await expect.soft(page.locator('#select-album')).toHaveValue('#TWICE');
    await expect(page.locator('.card__picture')).toHaveCount(28);
  });

  test('Change album to Fancy: 138 cards displayed', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('banner').getByLabel('Go to collection page').click();
    await page.locator('#select-album').selectOption('Fancy');
    await expect.soft(page.getByText('Original', { exact: true })).toBeChecked();
    await expect.soft(page.getByText('POB', { exact: true })).toBeChecked();
    await expect.soft(page.getByText('Monograph', { exact: true })).toBeChecked();
    await expect.soft(page.getByText('Broadcast', { exact: true })).toBeChecked();
    await expect(page.locator('.card__picture')).toHaveCount(138);
  });

  test('Click on image card: open card details modal and close it', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('banner').getByLabel('Go to collection page').click();
    await page.locator('.card__picture').first().click();
    await expect.soft(page.locator('.modal__content')).toBeVisible();
    await page.locator('.modal__close_button').click();
    await expect.soft(page.locator('.modal__content')).not.toBeVisible();
  });

  test('Click on image card: open card details modal and zoom on image', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('banner').getByLabel('Go to collection page').click();
    await page.locator('.card__picture').first().click();
    await page.getByLabel('Open preview window').click();
    await expect.soft(page.locator('.carousel-container__slides')).not.toBeVisible();
    await expect(page.locator('.card-modal')).toBeVisible();
  });

  test('Click on image card: open card details modal and click on next button', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('banner').getByLabel('Go to collection page').click();
    await page.locator('.card__picture').first().click();
    await page.getByLabel('Open preview window').click();
    await page.getByLabel('Next image', { exact: true }).click();
    await expect.soft(page.locator('p').first()).toHaveText('Jeongyeon_TSB_1');
    await expect.soft(page.locator('p').nth(1)).toHaveText('2/30');
    await expect.soft(page.locator('p').nth(2)).toHaveText('Jeongyeon');
    await expect.soft(page.locator('.card__badge')).toHaveText('2');
    await expect.soft(page.getByAltText('Jeongyeon_TSB_1', { exact: true })).toBeVisible();
  });

  test('Click on image card: open card details modal and click on previous button', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('banner').getByLabel('Go to collection page').click();
    await page.locator('.card__picture').first().click();
    await page.getByLabel('Open preview window').click();
    await page.getByLabel('Previous image', { exact: true }).click();
    await expect.soft(page.locator('p').first()).toHaveText('Group_TSB_3');
    await expect.soft(page.locator('p').nth(1)).toHaveText('30/30');
    await expect.soft(page.locator('p').nth(2)).toHaveText('Mina');
    await expect.soft(page.locator('p').nth(3)).toHaveText('Dahyun');
    await expect.soft(page.locator('p').nth(4)).toHaveText('Jeongyeon');
    await expect.soft(page.locator('.card__badge')).toHaveText('30');
    await expect.soft(page.getByAltText('Group_TSB_3', { exact: true })).toBeVisible();
  });


  test('Click on zoom: open card zoomed with carousel and close it', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('banner').getByLabel('Go to collection page').click();
    await page.getByLabel('Zoom on card').first().click();
    await expect.soft(page.locator('.card-modal')).toBeVisible();
    await expect.soft(page.locator('.carousel-container__slides')).toBeVisible();
    await page.locator('.modal__cross_close').click();
    await expect.soft(page.locator('.card-modal')).not.toBeVisible();
  });

  test('Zoom: next image button', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('banner').getByLabel('Go to collection page').click();
    await page.getByLabel('Zoom on card').first().click();
    await page.getByLabel('View Next Image').click();
    await expect(await page.getByAltText('card modal 1').screenshot()).not.toMatchSnapshot();
  });

  test('Zoom: previous image button', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('banner').getByLabel('Go to collection page').click();
    await page.getByLabel('Zoom on card').first().click();
    await page.getByLabel('View Previous Image').click();
    await expect(await page.getByAltText('card modal 1').screenshot()).not.toMatchSnapshot();
  });

  test('Zoom: click on an image in the carousel', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('banner').getByLabel('Go to collection page').click();
    await page.getByLabel('Zoom on card').first().click();
    await page.getByAltText('preview Tzuyu_TSB_1').click();
    await expect(await page.getByAltText('card modal 1').screenshot()).not.toMatchSnapshot();
  });

  test('Add a card to wishlist and display wished cards, then remove them', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    page.on('dialog', async dialog => {
      await dialog.accept();
    });
    await page.getByRole('banner').getByLabel('Go to collection page').click();
    await page.getByLabel('Add card Nayeon_TSB_1 to the wishlist').click();
    await page.getByLabel('Open Options').click();
    await expect.soft(page.getByRole('heading', { name: 'Options' })).toBeVisible();
    await page.getByLabel('Display wished cards').click();
    await expect.soft(page.locator('.card__picture')).toHaveCount(1);
    await page.getByLabel('Delete all displayed cards from the wishlist').click();
    await page.getByLabel('Display wished cards').click();
    await expect(page.locator('.cards__container-2')).toBeEmpty();
  });

  test('Add all displayed card to wishlist and display wished cards, then remove them', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    page.on('dialog', async dialog => {
      await dialog.accept();
    });
    await page.getByRole('banner').getByLabel('Go to collection page').click();
    await page.getByLabel('Open Options').click();

    await page.getByLabel('Add all displayed cards to the wishlist').click();
    await page.getByLabel('Display wished cards').click();
    await expect.soft(page.locator('.card__picture')).toHaveCount(30);

    await page.getByLabel('Delete all displayed cards from the wishlist').click();
    await page.getByLabel('Display wished cards').click();
    await expect(page.locator('.cards__container-2')).toBeEmpty();
  });

  test('Add a card to collection and display owned cards, then remove them. Should not be in the wishlist', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('banner').getByLabel('Go to collection page').click();
    await page.getByLabel('Add card Nayeon_TSB_1 to the wishlist').click();
    await page.getByLabel('Add card Nayeon_TSB_1 to the collection').click();
    await page.getByLabel('Open Options').click();
    await page.getByLabel('Display wished cards').click();
    await expect.soft(page.locator('.cards__container-2')).toBeEmpty();
    await page.getByLabel('Display owned cards').click();
    await expect(page.locator('.card__picture')).toHaveCount(1);
  });

  test('Add all cards to collection and display owned cards, then remove them. Should not be in the wishlist', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    page.on('dialog', async dialog => {
      await dialog.accept();
    });
    await page.getByRole('banner').getByLabel('Go to collection page').click();
    await page.getByLabel('Open Options').click();
    await page.getByLabel('Add all displayed cards to the collection').click();
    await page.getByLabel('Display wished cards').click();
    await expect.soft(page.locator('.cards__container-2')).toBeEmpty();
    await page.getByLabel('Display owned cards').click();
    await expect.soft(page.locator('.card__picture')).toHaveCount(30);
    await page.getByLabel('Delete all displayed cards from the collection').click();
    await page.getByLabel('Display owned cards').click();
    await expect(page.locator('.cards__container-2')).toBeEmpty();
  });

  test('Go to preferences, unselect first member and save: should only display 8 members', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('banner').getByLabel('Go to collection page').click();
    await expect.soft(page.locator('.card__picture')).toHaveCount(30);
    await page.getByLabel('Open Options').click();
    await page.getByLabel('Go to preferences page').click();
    await expect.soft(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await page.getByText('Nayeon', {exact:true}).click();
    await page.getByLabel('Save preferences and go back to collection page').click();
    await expect(page.locator('.card__picture')).toHaveCount(27);
  });
})

test.describe('ABOUT PAGE', () => {
  test('Go to About page', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('banner').getByLabel('Go to about page').click();
    await expect(page.getByRole('heading', { name: 'About' })).toBeVisible();
  });
})


/* test.describe('MINIGAME PAGE', () => {
  test('Go to Minigame page,first visit', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('banner').getByLabel('Go to game page').click();
    await expect(page.getByRole('heading', { name: 'How To Play ?' })).toBeVisible();

  });

  test('Go to Minigame page, nth visit', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    const resetDay = new Date();
    const newDay = [resetDay.getDate(), resetDay.getMonth() + 1, resetDay.getFullYear()].join('/');
    const newImage = game[(resetDay.getFullYear() * resetDay.getDate() * (resetDay.getMonth() + 1)) % game.length]
    const todayStats = {
      id: newImage.id,
      solution: newImage.name,
      date: newDay,
      findAnswer: false,
      numberTries: 0,
      guessList: Array.from(Array(6), () => {
        return { answer: '', isSkipped: true, isCorrect: false };
      }),
      hasStarted: false,
      hasFinished: false,
    }
    const stats = [todayStats]
    await page.evaluate(data => localStorage.setItem('userStats', JSON.stringify(data)), stats)
    await page.getByRole('banner').getByLabel('Go to game page').click();
    await expect(page.getByLabel('Close tutorial window')).not.toBeVisible();
  });

  test('Open About page', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('banner').getByLabel('Go to game page').click();
    await page.getByLabel('Close tutorial window').click();
    await page.getByRole('img').first().click();
    await expect(page.getByRole('heading', { name: 'About' })).toBeVisible();
  });

  test('Open Score page', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('banner').getByLabel('Go to game page').click();
    await page.getByLabel('Close tutorial window').click();
    await page.getByRole('img').nth(1).click();
    await expect(page.getByRole('heading', { name: 'STATS' })).toBeVisible();
  });

  test('Open Tutorial page', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('banner').getByLabel('Go to game page').click();
    await page.getByLabel('Close tutorial window').click();
    await page.getByRole('img').nth(2).click();
    await expect(page.getByRole('heading', { name: 'How To Play ?' })).toBeVisible();
  });

  test('Check number of answer boxes', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('banner').getByLabel('Go to game page').click();
    await page.getByLabel('Close tutorial window').click();
    await expect(page.locator('.answers li')).toHaveCount(6);
  });

  test('Try to answer once', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('banner').getByLabel('Go to game page').click();
    await page.getByLabel('Close tutorial window').click();
    await page.getByRole('textbox').fill('ANSWER');
    await page.getByText('SUBMIT').click();
    await expect(page.locator('.answers li').first()).toHaveText('ANSWER');
  });

  test('Skip once', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('banner').getByLabel('Go to game page').click();
    await page.getByLabel('Close tutorial window').click();
    await page.getByText('SKIP').click();
    await expect(page.locator('.answers li').first()).toHaveText('SKIPPED');
  });

  test('Display result page when user lose', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('banner').getByLabel('Go to game page').click();
    await page.getByLabel('Close tutorial window').click();
    await page.getByText('SKIP', { exact: true }).click();
    await page.getByText('SKIP', { exact: true }).click();
    await page.getByText('SKIP', { exact: true }).click();
    await page.getByText('SKIP', { exact: true }).click();
    await page.getByText('SKIP', { exact: true }).click();
    await page.getByText('SKIP', { exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Remaining time before next round:' })).toBeVisible();
  });

  test('Display result page when user win', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    const resetDay = new Date();
    const newDay = [resetDay.getDate(), resetDay.getMonth() + 1, resetDay.getFullYear()].join('/');
    const newImage = game[(resetDay.getFullYear() * resetDay.getDate() * (resetDay.getMonth() + 1)) % game.length]
    const todayStats = {
      id: newImage.id,
      solution: newImage.name,
      date: newDay,
      findAnswer: false,
      numberTries: 0,
      guessList: Array.from(Array(6), () => {
        return { answer: '', isSkipped: true, isCorrect: false };
      }),
      hasStarted: false,
      hasFinished: false,
    }
    const stats = [todayStats]
    await page.evaluate(data => localStorage.setItem('userStats', JSON.stringify(data)), stats)
    await page.getByRole('banner').getByLabel('Go to game page').click();
    await page.getByRole('textbox').fill(newImage.name);
    await page.getByText('SUBMIT').click();
    await expect(page.getByRole('heading', { name: 'Remaining time before next round:' })).toBeVisible();
  });
}) */




