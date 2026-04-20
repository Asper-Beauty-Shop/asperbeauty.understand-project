---
description: my-workflow
---
```mermaid
flowchart TD
    start_node_default([Start])
    end_node_default([End])
    subagentflow_1773457978797[["subagentflow-1773457978797"]]

```

## Workflow Execution Guide

Follow the Mermaid flowchart above to execute the workflow. Each node type has specific execution methods as described below.

### Execution Methods by Node Type

- **Rectangle nodes (Sub-Agent: ...)**: Execute Sub-Agents
- **Diamond nodes (AskUserQuestion:...)**: Use the AskUserQuestion tool to prompt the user and branch based on their response
- **Diamond nodes (Branch/Switch:...)**: Automatically branch based on the results of previous processing (see details section)
- **Rectangle nodes (Prompt nodes)**: Execute the prompts described in the details section below

## Sub-Agent Flow Nodes

#### subagentflow_1773457978797(subagentflow-1)

@Sub-Agent: my-workflow_subagentflow-1
