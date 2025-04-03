---
layout: default
---
<div class="header">
  <div class="container">
    <h1>D Compiler Size Metrics</h1>
    <p>Historical size tracking of DMD compiler executables across versions</p>
  </div>
</div>

<div class="container">
  {% include charts.html %}
  
  <div class="benchmarks-section">
    <div class="section-header">
      <h2>All Versions</h2>
    </div>
    <div class="benchmark-wrapper" id="benchmarks">
      <!-- Benchmark cards will be inserted here by JavaScript -->
      <div class="loading-spinner" id="benchmarksLoader">
        <div class="spinner"></div>
        <p>Loading version data...</p>
      </div>
    </div>
  </div>
</div>

<footer class="footer">
  <div class="container">
    <div class="footer-content">
      <div class="footer-links">
        <a href="https://dlang.org/" class="footer-link">D Language</a>
        <a href="https://github.com/dlang" class="footer-link">GitHub</a>
        <a href="https://forum.dlang.org/" class="footer-link">Forums</a>
        <a href="https://dlang.org/docs.html" class="footer-link">Documentation</a>
      </div>
      <div class="copyright">
        © 2025 D Language Foundation
      </div>
    </div>
  </div>
</footer>

<script src="{{ '/assets/js/data-loader.js' | relative_url }}"></script>
