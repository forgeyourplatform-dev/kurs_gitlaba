# Angular Hello World Application

This is a simple Angular "Hello World" application with integrated CI/CD pipeline using GitLab CI.

## Project Structure

```
.
├── src/                          # Application source code
│   ├── app/                      # Angular application
│   │   ├── app.component.ts      # Main component
│   │   ├── app.component.html    # Component template
│   │   ├── app.component.css     # Component styles
│   │   ├── app.component.spec.ts # Component unit tests
│   │   └── app.module.ts         # Application module
│   ├── main.ts                   # Application entry point
│   ├── index.html                # HTML template
│   └── styles.css                # Global styles
├── k8s/                          # Kubernetes deployment configuration
├── angular.json                  # Angular CLI configuration
├── tsconfig.json                 # TypeScript configuration
├── karma.conf.js                 # Karma test runner configuration
├── .gitlab-ci.yml               # GitLab CI/CD pipeline configuration
└── package.json                  # Project dependencies and scripts

```

## Prerequisites

- Node.js 20 or higher
- npm or yarn

## Installation

```bash
npm install
```

## Development Server

Run the development server:

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Running Unit Tests

Run unit tests via Karma:

```bash
npm test
```

This will run the tests in headless Chrome mode with code coverage enabled.

To run tests in watch mode:

```bash
npm run test:watch
```

## CI/CD Pipeline

The project includes a complete GitLab CI/CD pipeline defined in `.gitlab-ci.yml` with the following stages:

### 1. Build Stage (`build:app`)
- **Image**: node:20-alpine
- **Actions**: 
  - Installs dependencies using `npm ci`
  - Builds the application for staging and production environments
  - Generates parallel builds for each environment
- **Output**: Build artifacts stored in `dist/` directory

### 2. Test Stage
#### a. Unit Tests (`test:unit`)
- **Image**: node:20-alpine
- **Actions**:
  - Installs dependencies
  - Runs Angular unit tests with Karma using ChromeHeadless
  - Generates JUnit XML report for GitLab integration
  - Collects code coverage metrics
- **Output**: 
  - Test reports: `test-results/junit.xml`
  - Coverage reports: `coverage/` directory
  - Results visible in Merge Request and Pipeline pages

#### b. Integration Tests (`test:integration`)
- **Image**: python:3.11
- **Actions**:
  - Runs Python integration tests with pytest
  - Uses PostgreSQL database service
  - Generates code coverage report
- **Output**: JUnit XML report integrated with GitLab

### 3. Deploy Stage (`deploy:production`)
- **Image**: bitnami/kubectl:latest
- **Actions**:
  - Applies Kubernetes configuration
  - Deploys to production environment
- **Trigger**: Manual approval required on main branch
- **Requires**: Successful completion of test stage

## Configuration Details

### Angular CLI Configuration
- **Output path**: `dist/angular-hello-world`
- **Build modes**: production, staging, development
- **TypeScript target**: ES2022
- **Strict mode**: Enabled

### Test Configuration
- **Test runner**: Karma
- **Testing framework**: Jasmine
- **Browser**: Chrome (headless in CI)
- **Coverage reporter**: lcov and html formats
- **CI-specific launcher**: ChromeHeadlessCI with `--no-sandbox` and `--disable-gpu` flags

### Caching
- NPM cache is stored based on `package-lock.json`
- Cache is shared across pipeline runs for faster builds

## Environment Variables

The pipeline uses the following variables:
- `NPM_CONFIG_CACHE`: Configures npm cache location
- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`: Database credentials for integration tests
- `DB_HOST`: Database service hostname

## Artifacts and Reports

### Build Artifacts
- Stored for 1 week
- Contains compiled Angular application in `dist/` directory

### Test Reports
- JUnit XML reports integrated into GitLab Merge Requests
- Code coverage metrics displayed in pipeline
- HTML coverage reports available for download

## Running Tests Locally

The current CI/CD configuration supports running tests through the `test:unit` job. To verify locally before committing:

```bash
npm install
npm test
```

This will run all tests in headless Chrome mode with code coverage, mimicking the CI environment.

## Kubernetes Deployment

The `k8s/deployment.yaml` file contains:
- Deployment configuration for the Angular application
- Service configuration with LoadBalancer type
- Resource limits and requests

## Configuration Compatibility

✅ **Does the current CI/CD configuration allow running Angular unit tests?**

Yes! The pipeline now includes a `test:unit` job that:
- Runs in the same `node:20-alpine` environment as the build stage
- Uses `npm test` command which runs Karma with ChromeHeadlessCI configuration
- Generates JUnit XML reports that are integrated into GitLab's UI
- Collects code coverage metrics automatically
- Fails the pipeline if any tests fail (unless `allow_failure` is set to true)

The test results will be visible in:
- Pipeline execution page
- Merge Request detail page (for MR pipelines)
- GitLab Test Reports section

## Troubleshooting

### Tests Fail in CI but Pass Locally
- Ensure you're using Node 20
- Check that `package-lock.json` matches your dependencies
- Verify ChromeHeadless is compatible with your test environment

### Build Fails with Memory Issues
- The CI runner has memory constraints; check the runner configuration
- Consider optimizing bundle size with Angular CLI flags

### Pipeline Not Running
- Check that `.gitlab-ci.yml` is in the root directory
- Verify that your GitLab Runner is properly configured with Docker executor
