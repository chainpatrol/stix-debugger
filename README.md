# STIX Studio

This is a web-based tool for creating and editing STIX 2.1 objects. Authoring STIX objects can be a complex and error-prone process, so this tool aims to make it easier by providing a Notion-like interface for writing incident reports in plain English, and then converting them to STIX objects.

![STIX Studio Screenshot](https://github.com/chainpatrol/stix-studio/assets/8302959/dcd4f8ed-e724-472b-bc56-5c4d903517a7)

## Development

To run the STIX Studio locally, you will need to have Node.js installed. Then, you can run the following commands to get started:

```bash
corepack enable
yarn install
```

To start the development server, run:

```bash
yarn dev
```

Other commands:

```bash
yarn build   # Build the production version
yarn preview # Preview the built code
yarn test    # Run the tests
yarn lint    # Lint the code
```
