# AI Clinic CRM - Design System PRD

## Original Problem Statement
Create centralized design system in global.css with primary, secondary and theme color - ERPNext style with black primary, blue secondary, and greyish color for forms/cards background.

## Architecture
- **Framework**: Vite + React + TypeScript
- **Styling**: Tailwind CSS with CSS Variables (HSL format)
- **Design System Location**: `/app/src/index.css`

## What's Been Implemented (Feb 12, 2026)

### Centralized Design System
Created comprehensive CSS variable-based design system with:

#### Color Tokens
| Token | HSL Value | Usage |
|-------|-----------|-------|
| `--primary` | 0 0% 9% | Black - Main actions, headers (ERPNext style) |
| `--secondary` | 217 91% 60% | Blue - Secondary actions, links |
| `--accent` | 217 91% 60% | Blue - Highlights, active states |
| `--card` | 210 20% 98% | Light grey - Card backgrounds |
| `--muted` | 210 20% 96% | Light grey - Subtle backgrounds |
| `--form-bg` | 210 20% 98% | Grey - Form backgrounds |

#### Status Colors
- `--destructive`: Red for errors/delete
- `--success`: Green for success states  
- `--warning`: Amber for warnings
- `--info`: Sky blue for informational

#### Tailwind Integration
Extended tailwind.config.js with:
- `bg-primary`, `text-primary`, `bg-secondary`, etc.
- `bg-card`, `bg-form-bg` for greyish form backgrounds
- `bg-success`, `bg-warning`, `bg-info`, `bg-destructive` for status

### Files Modified
1. `/app/src/index.css` - CSS variables definition
2. `/app/tailwind.config.js` - Tailwind color mapping

## Usage Examples
```jsx
// Primary black button
<button className="bg-primary text-primary-foreground">Submit</button>

// Secondary blue button  
<button className="bg-secondary text-secondary-foreground">Cancel</button>

// Card with grey background
<div className="bg-card border border-border rounded-lg">Card content</div>

// Form with grey background
<form className="bg-form-bg p-4 rounded-lg">Form fields</form>
```

## Test Results
- ✅ CSS variables properly defined
- ✅ Tailwind config updated
- ✅ Frontend compiles without errors
- ✅ Design system colors applied correctly

## Backlog / Future Enhancements
- P1: Add dark mode toggle UI component
- P2: Add typography scale variables (font-size, line-height)
- P2: Add spacing scale variables
- P3: Create component library documentation
