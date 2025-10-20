# Market Movers Documentation

Welcome to the Market Movers documentation system. This directory contains comprehensive documentation for all stages of development, organized for efficient collaboration with Claude and team members.

## Documentation Structure

### 📁 [setup/](./setup/)
All setup-related documentation — installation, configuration, environment variables, dependencies, and initial project setup.

**Key Files:**
- `01_project_setup.md` - Initial Next.js project setup
- `02_environment_variables.md` - API keys and environment configuration
- `03_api_connection_test.md` - FinancialModelingPrep API connection verification

### 📁 [features/](./features/)
Documentation for each major feature or module — includes design notes, data flow, implementation details, and testing outcomes.

**Examples:**
- Dashboard module
- Real-time scanner
- Alert system
- User settings panel

### 📁 [agents/](./agents/)
Documentation for each Claude or MCP agent — includes purpose, endpoints, message flow, dependencies, and integration notes.

**Examples:**
- Momentum scanner agent
- News sentiment agent
- Pattern recognition agent

### 📁 [reports/](./reports/)
Progress summaries, version updates, retrospective notes, and milestone logs.

**Examples:**
- Weekly progress reports
- Milestone summaries
- Release notes

## Quick Start

### For New Features
1. Use the template in `templates/feature_doc_template.md`
2. Create a new file in `features/` directory
3. Document design, implementation, and testing
4. Update this README with a link

### For New MCP Agents
1. Use the template in `templates/agent_doc_template.md`
2. Create a new file in `agents/` directory
3. Document capabilities, API design, and integration
4. Update this README with a link

### For Setup Steps
1. Use the template in `templates/setup_doc_template.md`
2. Create a numbered file in `setup/` directory
3. Document configuration and verification steps

## Templates

All documentation templates are available in the `templates/` directory:
- `setup_doc_template.md` - For setup and configuration documentation
- `feature_doc_template.md` - For feature implementation documentation
- `agent_doc_template.md` - For MCP/Claude agent documentation
- `report_doc_template.md` - For progress reports and milestones

## Project Links

- **GitHub Repository:** [To be added]
- **API Documentation:** [FinancialModelingPrep](https://site.financialmodelingprep.com/developer/docs)
- **Design Inspiration:**
  - [Trade Ideas](https://www.trade-ideas.com/)
  - [DayTradeDash](https://www.warriortrading.com/day-trade-dash/)

## Contributing

When adding documentation:
1. Choose the appropriate directory based on content type
2. Use the corresponding template
3. Include clear examples and code snippets
4. Update this README with links to new documents
5. Commit documentation alongside related code changes

## Version History

- **v0.1** - Initial project setup and documentation structure
