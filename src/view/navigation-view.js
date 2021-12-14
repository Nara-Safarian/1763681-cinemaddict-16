const createFilter = (name, count, isActive) => `
    <a href="#${name}" class="main-navigation__item ${isActive ? 'main-navigation__item--active' : ''}">
      ${name}
      <span class="main-navigation__item-count">${count}</span>
    </a>
  `;

export const createNavigationTemplate = (filters) => {
  const filtersHtml = filters.map(({name, count}) => createFilter(name, count));

  return (
    `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    ${filtersHtml.join('')}
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
  );
};
