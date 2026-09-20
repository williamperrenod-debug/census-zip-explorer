document.addEventListener('DOMContentLoaded', () => {
  const zipInput = document.getElementById('zipCode');
  const getBtn = document.getElementById('getData');
  const resultsDiv = document.getElementById('results');

  // Trigger default fetch on initial page load using ZIP 11361
  fetchCensusData(zipInput.value.trim());

  // Listen for button clicks
  getBtn.addEventListener('click', () => {
    const zip = zipInput.value.trim();
    if (/^\d{5}$/.test(zip)) {
      fetchCensusData(zip);
    } else {
      resultsDiv.innerHTML = '<p class="error">Please enter a valid 5-digit ZIP code.</p>';
    }
  });

  async function fetchCensusData(zip) {
    resultsDiv.innerHTML = '<p class="loading">Loading Census data...</p>';

    try {
      // Call your Netlify serverless function endpoint
      const response = await fetch(`/.netlify/functions/census?zip=${zip}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Parse Census API 2D array response
      if (Array.isArray(data) && data.length > 1) {
        const headers = data[0];
        const values = data[1];

        // Map column variable names to indices
        const popIndex = headers.indexOf('B01003_001E');   // Total Population
        const incomeIndex = headers.indexOf('B19013_001E'); // Median Household Income

        const population = popIndex !== -1 ? Number(values[popIndex]) : null;
        const income = incomeIndex !== -1 ? Number(values[incomeIndex]) : null;

        renderResults(zip, population, income);
      } else {
        resultsDiv.innerHTML = `<p class="error">No Census data found for ZIP ${zip}.</p>`;
      }
    } catch (err) {
      console.error('Fetch error:', err);
      resultsDiv.innerHTML = '<p class="error">Failed to fetch Census data. Please try again.</p>';
    }
  }

  function renderResults(zip, population, income) {
    // Format values (fallback to N/A for missing or suppressed negative Census values)
    const formattedPop = population && population > 0 
      ? population.toLocaleString() 
      : 'N/A';

    const formattedIncome = income && income > 0 
      ? `$${income.toLocaleString()}` 
      : 'N/A';

    resultsDiv.innerHTML = `
      <h2>Results for ZIP ${zip}</h2>
      <ul>
        <li><strong>Total Population:</strong> ${formattedPop}</li>
        <li><strong>Median Household Income:</strong> ${formattedIncome}</li>
      </ul>
    `;
  }
});
