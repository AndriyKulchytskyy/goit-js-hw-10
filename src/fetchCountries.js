export default function fetchCountries(countryName) {
  return fetch(
    `https://restcountries.com/v3.1/name/${countryName}?fields=name,capital,population,flags,languages`
  )
    .then(responce => {
      if (!responce.ok) {
        throw new Error(error);
      }
      return responce.json();
    })
    .catch(reject => error);
}
