import { Decorator } from '../decorator';


describe('className Regex Tests', () => {
  const regex = Decorator.prototype.regEx;

  test('Matches simple class assignment with double quotes', () => {
    const input = '<button class="btn btn-primary">Logout</button>';
    expect(input.match(regex)).not.toBeNull();
  });

  test('Matches simple class assignment with single quotes', () => {
    const input = "<button class='btn btn-primary'>Logout</button>";
    expect(input.match(regex)).not.toBeNull();
  });

  test('Matches simple class assignment with backticks', () => {
    const input = "<button class=`btn btn-primary`>Logout</button>";
    expect(input.match(regex)).not.toBeNull();
  });

  test('Matches a link_to helper', () => {
    const input = "<%= link_to 'Logout', logout_path, class: 'btn btn-primary' %>";
    expect(input.match(regex)).not.toBeNull();
  });

  test('Matches a button_tag helper', () => {
    const input = "<%= button_tag 'Logout', class: 'btn btn-primary' %>";
    expect(input.match(regex)).not.toBeNull();
  });

  test('Matches a content_tag helper with single quotes', () => {
    const input = "<%= content_tag :button, 'Logout', class: 'btn btn-primary' %>";
    expect(input.match(regex)).not.toBeNull();
  });

  test('Matches a content_tag helper with double quotes', () => {
    const input = '<button class="btn btn-primary">Logout</button>';
    expect(input.match(regex)).not.toBeNull();
  });

  test('Matches a tag with class on a new line', () => {
    const input = "<button\n  class='btn btn-primary'>Logout</button>";
    expect(input.match(regex)).not.toBeNull();
  });

  test('Matches a tag with a space between class and equals', () => {
    const input = "<button class = 'btn btn-primary'>Logout</button>";
    expect(input.match(regex)).not.toBeNull();
  });

  test('Matches a tag with a className', () => {
    const input = "<button className='btn btn-primary'>Logout</button>";
    expect(input.match(regex)).not.toBeNull();
  });

  test('Matches multiple classes in different orders', () => {
    const input = "<button class='primary btn'>Logout</button>";
    expect(input.match(regex)).not.toBeNull();
  });

  test('Matches classes with dashes and special characters', () => {
    const input = "<button class='btn-primary--large btn_special'>Logout</button>";
    expect(input.match(regex)).not.toBeNull();
  });
  
  test('Matches with extra whitespace around attribute', () => {
    const input = "<button class  =  'btn btn-primary' >Logout</button>";
    expect(input.match(regex)).not.toBeNull();
  });
  
  test('Matches tag with empty class attribute', () => {
    const input = "<button class=''>Logout</button>";
    expect(input.match(regex)).not.toBeNull();
  });

    // Example for Vue.js
  test('Matches class binding in Vue', () => {
    const input = "<button :class='{ \"btn-primary\": true, \"btn\": true }'>Logout</button>";
    expect(input.match(regex)).not.toBeNull();
  });

  // Example for React (already covered with className, but consider conditional classes)
  test('Matches conditional class names in React', () => {
    const input = "<button className={isLoggedIn ? 'btn-primary' : 'btn-secondary'}>Logout</button>";
    expect(input.match(regex)).not.toBeNull();
  });

  test('Matches class names with HTML entities', () => {
    const input = "<button class='btn&ndash;primary'>Logout</button>";
    expect(input.match(regex)).not.toBeNull();
  });

  test('Matches class in self-closing tags', () => {
    const input = "<img src='logout.png' class='icon icon-logout'/>";
    expect(input.match(regex)).not.toBeNull();
  });

  test('Matches dynamic classes in template literals', () => {
    const buttonType = 'primary';
    const input = `<button class='btn btn-${buttonType}'>Logout</button>`;
    expect(input.match(regex)).not.toBeNull();
  });

});
