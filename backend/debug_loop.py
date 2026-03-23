import json
from app.agents.core import TOOLS

# Mock response from Sarvam that triggered the error
# We suspect it might be formatting or argument related
mock_response_content = '{"tool": "get_latest_news", "args": {}}'

print(f"Testing manual tool loop with content: {mock_response_content}")

clean_content = mock_response_content.replace("```json", "").replace("```", "").strip()

if "{" in clean_content and "tool" in clean_content:
    try:
        # Extract JSON from potential wrapper text
        start_idx = clean_content.find("{")
        end_idx = clean_content.rfind("}") + 1
        json_str = clean_content[start_idx:end_idx]
        
        print(f"Extracted JSON: {json_str}")
        
        tool_call = json.loads(json_str)
        
        func_name = tool_call.get("tool")
        args = tool_call.get("args", {})

        if func_name in TOOLS:
            print(f"Executing Manual Tool: {func_name} args: {args}")
            func = TOOLS[func_name]
            if args:
                # We now support **kwargs in all tools, so this is safe
                result = func(**args)
            else:
                result = func()
            print(f"Result: {result}")
        else:
             print(f"Tool {func_name} not found in TOOLS")

    except Exception as e:
        print(f"Manual tool parsing failed: {e}")
