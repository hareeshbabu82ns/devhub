import { DevhubPage } from './app.po';

describe('devhub App', () => {
  let page: DevhubPage;

  beforeEach(() => {
    page = new DevhubPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
