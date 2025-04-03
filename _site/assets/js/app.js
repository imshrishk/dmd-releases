document.addEventListener("DOMContentLoaded", function () {
  // Initialize chart elements and loaders
  const helloChartEl = document.getElementById("helloChart");
  const dmdChartEl = document.getElementById("dmdChart");
  const benchmarksEl = document.getElementById("benchmarks");
  const helloChartLoader = document.getElementById("helloChartLoader");
  const dmdChartLoader = document.getElementById("dmdChartLoader");
  const rangeButtons = document.querySelectorAll(".range-btn");
  
  // Chart instances and data storage
  let allData = [];
  let helloChart, dmdChart;
  let currentRange = 5;

  // Main initialization
  async function init() {
      try {
          await loadData();
          setupEventListeners();
      } catch (error) {
          handleError(error);
      }
  }

  // Data loading
  async function loadData() {
      try {
          showLoaders();
          const dataPath = `${window.BASE_URL}/assets/data/dmd_metrics.json`;
          const response = await fetch(dataPath);
          
          if (!response.ok) throw new Error(`Failed to load data: ${response.status}`);
          
          allData = await response.json();
          if (!Array.isArray(allData)) throw new Error("Data is not an array");
          
          // Sort by timestamp ascending
          allData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          
          // Destroy existing charts if they exist
          if (helloChart) helloChart.destroy();
          if (dmdChart) dmdChart.destroy();
          
          createCharts();
          updateBenchmarkList();
          hideLoaders();
      } catch (error) {
          hideLoaders();
          handleError(error);
      }
  }

  // Chart creation
  function createCharts() {
      helloChart = new Chart(helloChartEl, {
          type: "line",
          data: getChartData('hello_exe_size', '#ef4444'),
          options: getChartOptions('Hello Executable Size (KB)')
      });

      dmdChart = new Chart(dmdChartEl, {
          type: "line",
          data: getChartData('dmd_exe_size', '#0ea5e9'),
          options: getChartOptions('DMD Compiler Size (KB)')
      });
  }

  // Data formatting for charts
  function getChartData(metric, color) {
      const data = getFilteredData();
      return {
          datasets: [{
              label: metric.replace(/_/g, ' ').toUpperCase(),
              data: data.map(d => ({
                  x: d.dmd.version,
                  y: d.metrics[metric] / 1024,
                  timestamp: d.timestamp,
                  version: d.dmd.version
              })),
              borderColor: color,
              backgroundColor: `${color}33`,
              borderWidth: 2,
              fill: true
          }]
      };
  }

  // Chart configuration
  function getChartOptions(title) {
      return {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
              tooltip: {
                  callbacks: {
                      title: (tooltipItems) => `Version ${tooltipItems[0].raw.version}`,
                      label: (context) => `${title}: ${context.raw.y.toFixed(1)} KB`
                  }
              },
              legend: { display: false }
          },
          scales: {
              x: {
                  title: { 
                      display: true, 
                      text: 'DMD Version'
                  },
                  grid: { color: "#e2e8f0" }
              },
              y: {
                  title: { 
                      display: true, 
                      text: title
                  },
                  grid: { color: "#e2e8f0" }
              }
          }
      };
  }

  // Update benchmark cards
  function updateBenchmarkList() {
      if (!benchmarksEl) return;
      
      benchmarksEl.innerHTML = allData
          .slice()
          .reverse()
          .map(d => `
              <div class="benchmark-card">
                  <div class="benchmark-header">
                      <span class="version-number">DMD ${d.dmd.version}</span>
                      <span class="timestamp">
                          ${new Date(d.timestamp).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                          })}
                      </span>
                  </div>
                  <div class="metric">
                      <span class="metric-name">Hello.exe</span>
                      <span class="badge">
                          ${(d.metrics.hello_exe_size / 1024).toFixed(1)} KB
                      </span>
                  </div>
                  <div class="metric">
                      <span class="metric-name">DMD.exe</span>
                      <span class="badge">
                          ${(d.metrics.dmd_exe_size / 1024).toFixed(1)} KB
                      </span>
                  </div>
              </div>
          `).join("");
  }

  // Filter data based on selected range
  function getFilteredData() {
      if (!currentRange || currentRange === "all") return allData;
      return allData.slice(-currentRange);
  }

  // Event listeners for range buttons
  function setupEventListeners() {
      rangeButtons.forEach(btn => {
          btn.addEventListener("click", () => {
              rangeButtons.forEach(b => b.classList.remove("active"));
              btn.classList.add("active");
              currentRange = btn.dataset.range === "all" ? null : parseInt(btn.dataset.range);
              updateCharts();
          });
      });
  }

  // Update charts with filtered data
  function updateCharts() {
      helloChart.data = getChartData('hello_exe_size', '#ef4444');
      dmdChart.data = getChartData('dmd_exe_size', '#0ea5e9');
      helloChart.update();
      dmdChart.update();
  }

  // Loader visibility
  function showLoaders() {
      if (helloChartLoader) helloChartLoader.style.display = "flex";
      if (dmdChartLoader) dmdChartLoader.style.display = "flex";
  }

  function hideLoaders() {
      if (helloChartLoader) helloChartLoader.style.display = "none";
      if (dmdChartLoader) dmdChartLoader.style.display = "none";
  }

  // Error handling
  function handleError(error) {
      console.error("Error:", error);
      const errorHTML = `
          <div class="error-message">
              <p>Failed to load data: ${error.message}</p>
              <small>Check console for details</small>
          </div>
      `;
      
      const chartErrorElem = document.getElementById("chartError");
      if (chartErrorElem) {
          chartErrorElem.innerHTML = errorHTML;
          chartErrorElem.style.display = "block";
      }

      if (helloChartLoader) {
          helloChartLoader.innerHTML = `<p>Failed to load: ${error.message}</p>`;
          helloChartLoader.classList.add("failed");
      }

      if (dmdChartLoader) {
          dmdChartLoader.innerHTML = `<p>Failed to load: ${error.message}</p>`;
          dmdChartLoader.classList.add("failed");
      }

      if (benchmarksEl) {
          benchmarksEl.innerHTML = `
              <div class="empty-state">
                  <h3>Data Load Failed</h3>
                  <p>${error.message}</p>
                  <button onclick="window.location.reload()">Refresh Page</button>
              </div>
          `;
      }
  }

  init();
});
