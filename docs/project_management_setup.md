# Clearbook Project Management Setup

This document outlines the project management structure and workflow for the Clearbook Personal Health Records application development.

## Project Management Tool

We recommend using **GitHub Projects** for managing the Clearbook development process. This provides:

- Integration with our code repository
- Task tracking with status updates
- Sprint planning capabilities
- Automated workflow through GitHub Actions

## Project Board Structure

When setting up GitHub Projects, use the following structure:

### Columns

1. **Backlog**
   - Tasks that are identified but not planned for the current sprint
   - Prioritized from top to bottom

2. **Sprint Planning**
   - Tasks selected for the current sprint but not started
   - Estimated and ready for development

3. **In Progress**
   - Tasks currently being worked on
   - Limited to 1-2 tasks per developer to avoid context switching

4. **Testing/Review**
   - Tasks completed but waiting for testing or code review
   - Includes PR reviews and QA

5. **Done**
   - Fully completed tasks that have been deployed to the target environment

### Labels

Apply the following labels to issues to help with organization:

- `sprint-0`, `sprint-1`, etc. - Indicating which sprint the task belongs to
- `frontend`, `backend`, `database` - Component of the system
- `feature`, `bug`, `documentation`, `refactor` - Type of task
- `high`, `medium`, `low` - Priority levels
- `testing` - Requires specific testing focus

## Issue Template

When creating new issues, use the following template:

```markdown
## Description
Brief description of the task

## Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

## Technical Notes
Any technical considerations or implementation details

## Testing Requirements
Specific testing needed for this feature

## Related Tasks
Links to related issues or dependencies
```

## Sprint Workflow

1. **Sprint Planning**
   - Review and prioritize backlog items
   - Estimate complexity/effort
   - Move selected items to Sprint Planning column

2. **Daily Standup**
   - Brief meeting to discuss:
     - What was done yesterday
     - What will be done today
     - Any blockers

3. **Development**
   - Pick tasks from Sprint Planning
   - Move to In Progress
   - Create feature branch following naming convention: `feature/[issue-number]-short-description`
   - Submit PR when complete

4. **Code Review**
   - All code changes require at least one review
   - Move task to Testing/Review column
   - Address feedback and update PR

5. **Testing**
   - Perform unit and integration tests
   - Document test results in the issue

6. **Completion**
   - Merge PR to main branch
   - Move task to Done
   - Update documentation if necessary

## Mapping from Task Document

The tasks in `clearbook_project_tasks.md` should be transferred to the project management tool as individual issues. Each sprint section in the document corresponds to a milestone in the project management system.

## Reporting

Generate weekly progress reports including:
- Completed tasks
- Tasks in progress
- Blockers or issues
- Burndown chart for the sprint

## Communication Channels

- **Daily Communication**: Slack/Discord channel
- **Code Reviews**: GitHub PR comments
- **Documentation**: Project wiki
- **Meetings**: Video calls for planning and retrospectives

## Getting Started

1. Create a new GitHub Project board for Clearbook
2. Set up the columns as described above
3. Create a milestone for Sprint 0
4. Transfer initial tasks from `clearbook_project_tasks.md` to GitHub issues
5. Assign initial tasks to team members
6. Schedule the first sprint planning meeting
