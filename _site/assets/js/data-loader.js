(function () {
  window.loadBenchmarkData = async function () {
  try {
  const dataPath = `${window.BASE_URL}/assets/data/dmd_metrics.json`;
  const response = await fetch(dataPath);
  if (!response.ok) {
  throw new Error(`Failed to load data: ${response.status}`);
  }
  return await response.json();
  } catch (error) {
  console.error('Error loading data:', error);
  throw error;
  }
  };
  })();