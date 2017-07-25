import { ErpclientPage } from './app.po';

describe('erpclient App', () => {
  let page: ErpclientPage;

  beforeEach(() => {
    page = new ErpclientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
