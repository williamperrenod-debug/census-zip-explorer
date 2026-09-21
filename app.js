document.addEventListener('DOMContentLoaded', () => {

  const zipInput = document.getElementById('zipCode');
  const getBtn = document.getElementById('getData');
  const resultsDiv = document.getElementById('results');

  async function getCensusData() {

    const zipCode = zipInput.value.trim();

    // Validate ZIP code
    if (!/^\d{5}$/.test(zipCode)) {
      resultsDiv.innerHTML = `
        <p>Please enter a valid 5-digit ZIP code.</p>
      `;
      return;
    }

    resultsDiv.innerHTML = `
      <p>Loading Census data...</p>
    `;

    try {

      // Call the Netlify serverless function
      const response = await fetch(
        `/.netlify/functions/census?zip=${zipCode}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 'Unable to retrieve Census data.'
        );
      }

      // Census API returns:
      // data[0] = column names
      // data[1] = values
      const values = data[1];

      resultsDiv.innerHTML = `
        <h2>${values[0]}</h2>

        <div class="data-card">
          <strong>Population</strong>
          <span>${Number(values[1]).toLocaleString()}</span>
        </div>

        <div class="data-card">
          <strong>Median Age</strong>
          <span>${values[2]}</span>
        </div>

        <div class="data-card">
          <strong>Median Household Income</strong>
          <span>$${Number(values[3]).toLocaleString()}</span>
        </div>

        <div class="data-card">
          <strong>Per-Capita Income</strong>
          <span>$${Number(values[4]).toLocaleString()}</span>
        </div>

        <div class="data-card">
          <strong>Population Below Poverty Level</strong>
          <span>${Number(values[5]).toLocaleString()}</span>
        </div>

        <div class="data-card">
          <strong>Housing Units</strong>
          <span>${Number(values[6]).toLocaleString()}</span>
        </div>
      `;

    } catch (error) {

      console.error('Census API error:', error);

      resultsDiv.innerHTML = `
        <p>
          Unable to retrieve Census data.
          Please try again.
        </p>
      `;
    }
  }

  // Button click
  getBtn.addEventListener('click', getCensusData);

  // Automatically load default ZIP code (11361)
  getCensusData();

});
