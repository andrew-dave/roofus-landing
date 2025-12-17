# Getting Started with Vercel Speed Insights

This guide will help you understand how Vercel Speed Insights is implemented in the Roofus landing page project, and how to configure and use it for monitoring performance metrics.

## Overview

Vercel Speed Insights is a performance monitoring tool that collects real-world performance data from your deployed application. It tracks Web Vitals metrics and provides insights into how your site performs for actual users.

## Implementation

The Roofus landing page uses Vercel Speed Insights for React through the `@vercel/speed-insights` package.

### Package Installation

The package has been installed in the project:

```bash
npm install @vercel/speed-insights
```

### Integration in the Application

The `SpeedInsights` component has been added to the main app file (`src/App.tsx`):

```tsx
import { SpeedInsights } from '@vercel/speed-insights/react'

function App() {
  return (
    <PerfModeProvider>
      <div className="relative">
        {/* ... rest of app content ... */}
        <SpeedInsights />
      </div>
    </PerfModeProvider>
  )
}

export default App
```

## How It Works

Once deployed to Vercel, the Speed Insights component:

1. Automatically collects Web Vitals metrics (LCP, FID, CLS, TTFB, INP)
2. Sends anonymized data to Vercel's analytics servers
3. Makes performance data available in the Vercel dashboard

The tracking script (`/_vercel/speed-insights/script.js`) is added automatically after deployment.

## Prerequisites

To use Speed Insights, you need:

- A Vercel account ([sign up for free](https://vercel.com/signup))
- A Vercel project (deploy this project to Vercel using [vercel.com/new](https://vercel.com/new))
- Enable Speed Insights in your Vercel project dashboard

## Enabling Speed Insights in Vercel

1. Go to your [Vercel dashboard](/dashboard)
2. Select your **roofus-landing** project
3. Navigate to the **Speed Insights** tab
4. Click **Enable** in the dialog
5. Re-deploy your application (Speed Insights will be activated on the next deployment)

> **Note:** Enabling Speed Insights will add new routes (scoped at `/_vercel/speed-insights/*`) after your next deployment.

## Deploying to Vercel

### Using Vercel CLI

```bash
npm i -g vercel
vercel deploy
```

### Using Git Integration

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Vercel will automatically deploy on every push to main

## Viewing Your Data

Once your app is deployed and users have visited your site:

1. Go to your [Vercel dashboard](/dashboard)
2. Select your **roofus-landing** project
3. Click the **Speed Insights** tab
4. After a few days of traffic, you'll see performance metrics

For more detailed analytics, explore:
- Real-world Web Vitals metrics
- Geographic performance data
- Device and browser breakdowns
- Performance trends over time

## Web Vitals Metrics

Speed Insights tracks the following metrics:

| Metric | Name | Description |
|--------|------|-------------|
| **LCP** | Largest Contentful Paint | Time for largest content element to render (Target: < 2.5s) |
| **FID** | First Input Delay | Time from user interaction to browser response (Target: < 100ms) |
| **CLS** | Cumulative Layout Shift | Visual stability of the page (Target: < 0.1) |
| **TTFB** | Time to First Byte | Time to receive first byte from server (Target: < 600ms) |
| **INP** | Interaction to Next Paint | Time for interaction response (Target: < 200ms) |

## Privacy & Compliance

Speed Insights respects user privacy:

- Data is anonymized and aggregated
- No personally identifiable information is collected
- Complies with GDPR, CCPA, and other privacy regulations
- Users can opt out if needed

For detailed privacy information, see [Speed Insights Privacy Policy](/docs/speed-insights/privacy-policy).

## Performance Considerations

Speed Insights has minimal impact on your site's performance:

- Tracking script is deferred and non-blocking
- Data is sent asynchronously
- No JavaScript execution is required on the main thread
- Total impact: < 1KB additional JavaScript

## Configuration

By default, Speed Insights works with no additional configuration. However, you can customize behavior by:

1. Using environment variables
2. Adding a `beforeSend` callback to filter data
3. Disabling Speed Insights in certain conditions

### Example: Disable in Development

You can wrap the SpeedInsights component conditionally:

```tsx
import { SpeedInsights } from '@vercel/speed-insights/react'

function App() {
  return (
    <>
      {/* ... app content ... */}
      {process.env.NODE_ENV === 'production' && <SpeedInsights />}
    </>
  )
}
```

## Troubleshooting

### Speed Insights script not loading
- Verify the project is deployed to Vercel
- Check that Speed Insights is enabled in your Vercel dashboard
- Wait a few minutes after enabling for the setting to take effect

### No data showing in dashboard
- Ensure users have visited your deployed site
- Wait 24-48 hours for initial data aggregation
- Check that the domain is accessible

### High audit warnings about speed-insights
- These are typically false positives
- The Speed Insights script is optimized for performance
- It will not negatively impact Core Web Vitals

## Next Steps

Now that Speed Insights is integrated:

1. **Deploy your app** to Vercel
2. **Enable Speed Insights** in your Vercel dashboard
3. **Monitor metrics** after users visit your site
4. **Optimize based on data** - use the dashboard to identify areas for improvement

## Additional Resources

- [Vercel Speed Insights Documentation](/docs/speed-insights/package)
- [Understanding Web Vitals](/docs/speed-insights/metrics)
- [Speed Insights Limits and Pricing](/docs/speed-insights/limits-and-pricing)
- [Privacy and Compliance](/docs/speed-insights/privacy-policy)
- [Troubleshooting Guide](/docs/speed-insights/troubleshooting)

---

For questions or issues, check the [official Speed Insights documentation](https://vercel.com/docs/speed-insights) or reach out to Vercel support.
