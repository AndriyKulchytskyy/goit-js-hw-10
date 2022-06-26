import './css/styles.css';
import debouns from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('[id="search-box"]'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debouns(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  fetchCountries(event.target.value.trim())
    .then(countries => {
      const numberOfCountries = countries.length;

      if (numberOfCountries > 10) {
        deleteInfo();

        Notiflix.Notify.success(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (numberOfCountries >= 2 && numberOfCountries <= 10) {
        deleteInfo();

        const markup = countries
          .map(country => {
            const flag = country.flags.svg;
            const name = country.name.official;
            return buildMarkupList({ flag, name });
          })
          .join('');
        refs.list.innerHTML = markup;
      } else if (numberOfCountries === 1) {
        deleteInfo();

        const flag = countries[0].flags.svg;
        const name = countries[0].name.common;
        const capital = countries[0].capital[0];
        const population = countries[0].population;
        const languages = Object.values(countries[0].languages).join(', ');
        refs.info.innerHTML = buildMarkupOne({
          name,
          capital,
          population,
          flag,
          languages,
        });
      }
    })
    .catch(error => {
      deleteInfo();
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function deleteInfo() {
  refs.list.innerHTML = '';
  refs.info.innerHTML = '';
}

function buildMarkupList({ flag, name }) {
  return ` <li class="country-item">
  <img class="country-item__flag" src = ${flag} alt="Country flag"/>
  <span class="country-item__name">${name}</span>
</li>`;
}

function buildMarkupOne({ flag, name, capital, population, languages }) {
  return ` <div class="country-info">
  <img class="country-info__flag" src = ${flag} alt="Country flag"/>
  <span class="country-info__name">${name}</span><br />
  <b>Capital:  </b><span>${capital}</span><br />
  <b>Population:  </b><span>${population}</span><br />
  <b>Languages:  </b><span>${languages}</span><br />
</div>`;
}
