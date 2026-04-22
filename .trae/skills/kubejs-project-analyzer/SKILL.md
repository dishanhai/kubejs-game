---
name: "kubejs-project-analyzer"
description: "Analyzes KubeJS projects, generates optimized scripts, and performs automatic code checks for Rhino JavaScript compliance. Invoke when detecting KubeJS script patterns (.js files in kubejs directories), during Minecraft modding development phases, or when KubeJS-specific code issues are identified."
---

# KubeJS Project Analyzer

This skill provides specialized analysis, script generation, and code checking for KubeJS (Rhino JavaScript) projects in Minecraft modding environments.

## Functionality

### 1. Project Analysis
- **Structure Analysis**: Examines KubeJS directory structure (`startup_scripts`, `server_scripts`, `client_scripts`)
- **Dependency Detection**: Identifies used mods, APIs, and global variables
- **Pattern Recognition**: Detects common KubeJS patterns (event handlers, recipe scripts, item registrations)
- **Performance Assessment**: Analyzes script efficiency and potential bottlenecks

### 2. Script Generation
- **Template-Based Generation**: Creates KubeJS scripts from templates for common tasks
- **API Wrappers**: Generates wrapper functions for frequently used APIs
- **Event Handlers**: Creates boilerplate for common events (`recipes`, `item.right_click`, `entity.death`)
- **Configuration Files**: Generates proper configuration structures

### 3. Automatic Code Checking
- **Rhino Compliance**: Ensures code follows KubeJS Rhino JavaScript syntax rules
- **Best Practices**: Checks against project-specific rules (e.g., `kubejsjiaobenguiz.md`)
- **Error Prevention**: Identifies potential runtime errors before execution
- **Style Consistency**: Enforces coding conventions across the project

## When to Invoke

### Trigger Conditions
1. **File Type Detection**: When working with `.js` files in KubeJS directories
2. **Pattern Detection**: When KubeJS-specific patterns are identified (e.g., `onEvent`, `Item.of`, `event.shaped`)
3. **Project Phase**: During specific development phases:
   - Initial KubeJS project setup
   - Adding new script functionality
   - Debugging KubeJS scripts
   - Optimizing existing scripts
4. **User Request**: When user explicitly asks for KubeJS code analysis or generation

### Automatic Triggers
- Opening or editing files in `kubejs/scripts/` directories
- Detecting KubeJS event handler patterns in code
- Identifying Rhino JavaScript syntax issues
- When user mentions "KubeJS", "recipe", "event handler", or related terms

## Usage Examples

### Example 1: Analyzing Existing Code
```javascript
// When user provides a KubeJS script snippet
onEvent('recipes', event => {
    event.shaped('minecraft:diamond', ['AAA','ABA','AAA'], {
        A: 'minecraft:iron_ingot',
        B: 'minecraft:gold_ingot'
    });
});
```

**Skill should:**
- Verify syntax compatibility with Rhino engine
- Check for common errors (missing parentheses, incorrect event names)
- Suggest optimizations (use `Item.of` for item references)
- Ensure proper formatting according to project rules

### Example 2: Generating New Script
**User request**: "Create a KubeJS script for a custom item with right-click functionality"

**Skill should generate:**
```javascript
// priority: 1000
onEvent('item.registry', event => {
    event.create('mymod:custom_item')
        .displayName('Custom Item')
        .texture('mymod:item/custom_item')
        .maxStackSize(64);
});

onEvent('item.right_click', event => {
    const { item, player, hand } = event;
    
    if (item.id === 'mymod:custom_item') {
        player.tell('You used the custom item!');
        
        if (!player.isCreative()) {
            item.count--;
        }
        event.cancel();
    }
});
```

### Example 3: Code Review
**Skill should check:**
- Uses `let/const` instead of `var` (Rhino supports ES5+)
- Proper event handler structure
- Item ID formatting (namespace:path)
- Error handling for edge cases
- Performance considerations (avoiding expensive operations in frequently called events)

## Integration with Project Rules

This skill respects and enforces project-specific rules defined in:
- `kubejsjiaobenguiz.md` - KubeJS Rhino JavaScript syntax rules
- `projectlist.md` - Project file structure and conventions
- `git-commit-message.md` - Commit message standards

**Key compliance checks:**
- No ES6+ features unsupported by Rhino (classes, async/await, import/export)
- Proper use of IIFE wrappers for new files
- Correct variable scoping (avoid global pollution)
- Following existing code patterns in the project

## Common KubeJS Patterns to Detect

### Event Handlers
```javascript
onEvent('event.name', event => { ... })
ServerEvents.recipes(event => { ... })
ItemEvents.tooltip(event => { ... })
```

### Item/Block Operations
```javascript
Item.of('mod:id', count, nbt)
Block.of('mod:id')
event.create('mod:id')
```

### Recipe Systems
```javascript
event.shaped(output, pattern, keys)
event.shapeless(output, ingredients)
event.smelting(output, input)
event.stonecutting(output, input)
```

### Entity/Player Interactions
```javascript
event.player.tell(message)
event.entity.type
event.server.runCommand(command)
```

## Limitations and Notes

### Rhino Engine Limitations
- **No ES6 Modules**: Use global variables or script dependencies
- **No Async/Await**: Use callbacks or synchronous patterns
- **No Classes**: Use object literals or constructor functions
- **Limited Standard Library**: Some browser/Node.js APIs unavailable

### Performance Considerations
- Avoid expensive operations in frequently triggered events
- Cache frequently used values (item references, configuration)
- Use appropriate data structures for performance-critical code

### Debugging Tips
- Use `console.log()` for debugging (not `console.warn()` with multiple parameters)
- Check KubeJS logs (`logs/kubejs/` directory)
- Test scripts in isolation before integration

## Skill Output Format

When invoked, the skill should provide:
1. **Analysis Report**: Summary of findings and recommendations
2. **Generated Code**: Properly formatted KubeJS scripts
3. **Error List**: Specific issues with suggested fixes
4. **Best Practice Suggestions**: Optimization and improvement ideas

## Testing the Skill

To verify the skill works correctly:
1. Create a test KubeJS script with intentional errors
2. Invoke the skill to analyze the script
3. Check that it identifies the errors and suggests fixes
4. Verify generated code follows project conventions

---
*This skill is specifically designed for the KubeJS Rhino JavaScript environment in Minecraft 1.20.1 with KubeJS Forge 2001.6.5-build.14.*