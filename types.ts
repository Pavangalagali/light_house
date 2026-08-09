@import "tailwindcss";

@layer base {
  :root {
    --bg-main: #0F172A;
    --text-primary: #F8FAFC;
    --text-secondary: #CBD5E1;
    --text-muted: #94A3B8;
    --panel-bg: #1E293B;
    --panel-border: #334155;
    --card-bg: #1E293B;
    --card-border: #334155;
    --card-hover-border: #F59E0B;
    --input-bg: #0F172A;
    --input-border: #334155;
    --button-sec-bg: #1E293B;
    --button-sec-border: #334155;
    --button-sec-text: #E2E8F0;
    --header-bg: rgba(15, 23, 42, 0.92);
    --header-border: #334155;
  }

  /* Dark Theme Explicit */
  [data-theme="dark-obsidian"] {
    --bg-main: #0B0F19;
    --text-primary: #F8FAFC;
    --text-secondary: #CBD5E1;
    --text-muted: #94A3B8;
    --panel-bg: #111827;
    --panel-border: #1F2937;
    --card-bg: #1E293B;
    --card-border: #334155;
    --card-hover-border: #F59E0B;
    --input-bg: #1F2937;
    --input-border: #374151;
    --button-sec-bg: #1F2937;
    --button-sec-border: #374151;
    --button-sec-text: #E2E8F0;
    --header-bg: rgba(15, 23, 42, 0.92);
    --header-border: #1E293B;
  }

  /* Light Theme Explicit */
  [data-theme="light-showroom"] {
    --bg-main: #F8FAFC;
    --text-primary: #0F172A;
    --text-secondary: #334155;
    --text-muted: #64748B;
    --panel-bg: #FFFFFF;
    --panel-border: #E2E8F0;
    --card-bg: #FFFFFF;
    --card-border: #E2E8F0;
    --card-hover-border: #D97706;
    --input-bg: #F1F5F9;
    --input-border: #CBD5E1;
    --button-sec-bg: #F1F5F9;
    --button-sec-border: #E2E8F0;
    --button-sec-text: #334155;
    --header-bg: rgba(255, 255, 255, 0.95);
    --header-border: #E2E8F0;
  }

  body {
    background-color: var(--bg-main);
    color: var(--text-primary);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    overflow-x: hidden;
    transition: background-color 0.25s ease, color 0.25s ease;
  }
}

/* Glassmorphism Design Utilities */
.glass-panel {
  background-color: var(--panel-bg);
  border: 1px solid var(--panel-border);
  color: var(--text-primary);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.08);
}

.glass-card {
  background-color: var(--card-bg);
  border: 1px solid var(--card-border);
  color: var(--text-primary);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.glass-card:hover {
  border-color: var(--card-hover-border);
  transform: translateY(-2px);
  box-shadow: 0 12px 28px -6px rgba(217, 119, 6, 0.15);
}

.glass-input {
  background-color: var(--input-bg);
  border: 1px solid var(--input-border);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.glass-input::placeholder {
  color: var(--text-muted);
}

.glass-input:focus {
  outline: none;
  border-color: #D97706;
  box-shadow: 0 0 12px rgba(217, 119, 6, 0.25);
}

.glass-button-primary {
  background: linear-gradient(135deg, #0F172A, #1E293B);
  color: #FFFFFF !important;
  font-weight: 700;
  border: 1px solid #334155;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.15);
  transition: all 0.2s ease;
}

.glass-button-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.25);
  background: linear-gradient(135deg, #1E293B, #334155);
}

.glass-button-secondary {
  background-color: var(--button-sec-bg);
  border: 1px solid var(--button-sec-border);
  color: var(--button-sec-text);
  transition: all 0.2s ease;
}

.glass-button-secondary:hover {
  filter: brightness(1.08);
}

/* Light Theme Overrides */
[data-theme="light-showroom"] {
  background-color: #F8FAFC !important;
  color: #0F172A !important;
}

[data-theme="light-showroom"] body {
  background-color: #F8FAFC !important;
  color: #0F172A !important;
}

[data-theme="light-showroom"] h1,
[data-theme="light-showroom"] h2,
[data-theme="light-showroom"] h3,
[data-theme="light-showroom"] h4,
[data-theme="light-showroom"] h5,
[data-theme="light-showroom"] h6 {
  color: #0F172A !important;
}

[data-theme="light-showroom"] p,
[data-theme="light-showroom"] label,
[data-theme="light-showroom"] select,
[data-theme="light-showroom"] option {
  color: #334155;
}

/* Specific text color adjustments in light mode */
[data-theme="light-showroom"] .text-white {
  color: #0F172A !important;
}

[data-theme="light-showroom"] .text-gray-100,
[data-theme="light-showroom"] .text-gray-200,
[data-theme="light-showroom"] .text-gray-300 {
  color: #1E293B !important;
}

[data-theme="light-showroom"] .text-gray-400,
[data-theme="light-showroom"] .text-gray-500 {
  color: #64748B !important;
}

/* High contrast elements in light mode */
[data-theme="light-showroom"] .glass-button-primary,
[data-theme="light-showroom"] .glass-button-primary *,
[data-theme="light-showroom"] .discount-tag,
[data-theme="light-showroom"] .discount-tag *,
[data-theme="light-showroom"] .bg-black,
[data-theme="light-showroom"] .bg-black *,
[data-theme="light-showroom"] .bg-amber-600,
[data-theme="light-showroom"] .bg-amber-600 *,
[data-theme="light-showroom"] .bg-blue-600,
[data-theme="light-showroom"] .bg-blue-600 *,
[data-theme="light-showroom"] .bg-emerald-600,
[data-theme="light-showroom"] .bg-emerald-600 * {
  color: #FFFFFF !important;
}

/* Dark Theme Overrides for Text & Panels */
[data-theme="dark-obsidian"] {
  background-color: #0B0F19 !important;
  color: #F8FAFC !important;
}

[data-theme="dark-obsidian"] body {
  background-color: #0B0F19 !important;
  color: #F8FAFC !important;
}

[data-theme="dark-obsidian"] .glass-panel {
  background-color: #111827 !important;
  border-color: #1F2937 !important;
  color: #F8FAFC !important;
}

[data-theme="dark-obsidian"] .glass-card {
  background-color: #1E293B !important;
  border-color: #334155 !important;
  color: #F8FAFC !important;
}

[data-theme="dark-obsidian"] .glass-input {
  background-color: #111827 !important;
  border-color: #374151 !important;
  color: #F8FAFC !important;
}

[data-theme="dark-obsidian"] select,
[data-theme="dark-obsidian"] option {
  background-color: #111827 !important;
  color: #F8FAFC !important;
}

/* Badges */
.glass-badge-gold {
  background: #FFFBEB;
  border: 1px solid #FDE68A;
  color: #B45309;
}

[data-theme="dark-obsidian"] .glass-badge-gold {
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #FBBF24;
}

.glass-badge-blue {
  background: #EFF6FF;
  border: 1px solid #BFDBFE;
  color: #1D4ED8;
}

[data-theme="dark-obsidian"] .glass-badge-blue {
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #60A5FA;
}

.glass-badge-green {
  background: #F0FDF4;
  border: 1px solid #BBF7D0;
  color: #15803D;
}

[data-theme="dark-obsidian"] .glass-badge-green {
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34D399;
}

/* DISCOUNT TAG (EMERALD GREEN SAVINGS ACCENT) */
.discount-tag {
  background-color: #059669 !important;
  color: #FFFFFF !important;
  font-weight: 800;
  border: 1px solid #10B981 !important;
}

/* Custom Minimal Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.2);
}
::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.4);
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 116, 139, 0.7);
}
