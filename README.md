# Cybersecurity Bot UI

An interactive cybersecurity dashboard and chatbot interface designed to explore global cyber threat trends, understand common attack patterns, and provide cybersecurity-related information through a conversational interface.

## Overview

The Cybersecurity Bot UI combines data visualization with chatbot functionality to make cybersecurity information easier to explore and understand. The dashboard focuses on global cybersecurity threats recorded between 2015 and 2024, while the chatbot allows users to ask questions about cyberattacks, affected industries, vulnerabilities, and threat sources.

The project aims to present cybersecurity data in a user-friendly format and support cybersecurity awareness through interactive visualizations and conversational assistance.

## Features

- **Interactive Dashboard:** Explore global cybersecurity threat information through a visual interface.
- **Cybersecurity Chatbot:** Ask questions related to cybersecurity threats and attack patterns.
- **Threat Analysis:** Explore different attack types, target industries, and attack sources.
- **Country-Based Filtering:** Filter threat information by country and explore geographical trends.
- **Vulnerability Analysis:** Review information about reported vulnerabilities and corresponding defense measures.
- **Data Visualization:** Present threat statistics using charts and other visual representations.
- **Heatmap Visualization:** Explore patterns and variations in cybersecurity threats.
- **Responsive Interface:** Designed to provide a convenient user experience across supported screen sizes.

## Dataset

The project uses the Global Cybersecurity Threats dataset covering the period from 2015 to 2024.

The dataset contains information about:

- Country
- Year
- Attack Type
- Target Industry
- Financial Loss
- Affected Users
- Attack Source
- Vulnerability
- Defense
- Resolution Time

These attributes help explore cybersecurity trends, compare attack patterns, and understand the impact of cyber threats across different industries and countries.

## Technology Stack

- **Frontend:** HTML, CSS, JavaScript, and dashboard UI components
- **Chatbot:** Dialogflow ES
- **Chatbot Integration:** Dialogflow fulfillment or a compatible backend service
- **Data Visualization:** Interactive charts and heatmaps
- **Deployment:** Vercel for the frontend
- **Dataset:** Global Cybersecurity Threats (2015–2024)

*Update this section if your implementation uses additional frameworks or visualization libraries.*

## Chatbot Capabilities

The chatbot is designed to handle questions related to the following topics:

| Intent | Purpose |
|---|---|
| Country | Explore cybersecurity threats by country |
| Attack Type | Learn about different categories of cyberattacks |
| Target Industry | Explore industries affected by cyber threats |
| Attack Source | Understand reported sources of attacks |
| Vulnerability | Explore vulnerabilities and related defense information |

The chatbot's responses depend on the intents, training phrases, fulfillment logic, and data sources configured in the application.

## Project Structure

The following is a suggested structure for the UI repository. Adjust it to match the actual files in your project.

```text
cybersecuritybot-UI/
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── images/
│   └── icons/
├── README.md
└── .gitignore
```

A separate backend or chatbot fulfillment service may be maintained in another repository.

## Getting Started

### Prerequisites

- Git
- A modern web browser
- A code editor such as Visual Studio Code
- Access to the configured chatbot service, if required

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/shrutikamarpelli2006-art/cybersecuritybot-UI.git
   ```

2. Navigate to the project directory:

   ```bash
   cd cybersecuritybot-UI
   ```

3. Open the project in Visual Studio Code:

   ```bash
   code .
   ```

4. Run the frontend using the development server or local preview method appropriate for the project's framework.

5. Open the application in your browser and verify that the dashboard and chatbot interface load correctly.

## Chatbot Configuration

If the chatbot communicates with a separate backend service:

1. Configure the chatbot integration in the frontend.
2. Set the correct backend endpoint for the deployed service.
3. Verify that the fulfillment service is running and accessible.
4. Test the supported intents and confirm that responses appear correctly in the UI.

**Security note:** Do not commit API keys, access tokens, private credentials, or other secrets to the repository. Use appropriate environment variables and server-side configuration.

## Deployment

The frontend can be deployed to Vercel if the repository is compatible with its deployment workflow.

1. Sign in to Vercel using your GitHub account.
2. Import the `cybersecuritybot-UI` repository.
3. Configure the appropriate framework preset, build command, and output directory.
4. Add any required environment variables.
5. Deploy the project and test the published URL.

If the chatbot backend is hosted separately, deploy it independently and configure the frontend to communicate with its public endpoint.

## Future Enhancements

- Integrate live cybersecurity threat intelligence feeds.
- Add more advanced filtering and comparison features.
- Improve chatbot responses with richer threat information.
- Introduce additional interactive visualizations.
- Enhance accessibility and mobile responsiveness.
- Add automated testing and improved error handling.

## Limitations

- Dashboard insights depend on the availability and quality of the underlying dataset.
- Chatbot responses depend on its configured intents and backend integration.
- Historical data does not necessarily represent current cybersecurity conditions.
- The application is intended for informational and educational purposes and should not be treated as a replacement for professional security analysis.

## Author

**Shrutika Marpelli**

GitHub: [shrutikamarpelli2006-art](https://github.com/shrutikamarpelli2006-art)

## License

No license has been specified in this README. Add a license file if you intend to define the terms under which others may use, modify, or distribute the project.
