
import os
import re

directory = r'c:\Users\Ghanshyam\furnishing-dashboard\components\stages'

for filename in os.listdir(directory):
    if filename.endswith(".tsx"):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replacement for Pending Items
        # Pattern matches the entire conditional block for pending items
        # We look for {pendingItems.length === 0 ? ... : ... }
        # Note: The original code uses a specific structure.
        
        pending_pattern = r'\{pendingItems\.length === 0 \? \(\s*<div className="text-center py-12">\s*<p className="text-muted-foreground">No pending items<\/p>\s*<\/div>\s*\) : \(\s*(<div className="overflow-x-auto -mx-6 md:mx-0">[\s\S]*?<\/div>)\s*\)\}'
        
        def pending_replacement(match):
            table_div = match.group(1)
            # Insert the empty state row logic into tbody
            # First, find where tbody starts
            tbody_start = table_div.find('<tbody>') + 7
            tbody_end = table_div.rfind('</tbody>')
            
            headers_part = table_div[:tbody_start]
            rows_part = table_div[tbody_start:tbody_end]
            footer_part = table_div[tbody_end:]
            
            # The rows_part contains {pendingItems.map(...)}
            # We want to wrap that in a condition
            
            new_tbody_content = """
                    {pendingItems.length === 0 ? (
                      <tr>
                        <td colSpan={config.pendingColumns.length + 1} className="text-center py-12 text-muted-foreground">
                          No pending items
                        </td>
                      </tr>
                    ) : (
                      """ + rows_part.strip() + """
                    )}"""
            
            return headers_part + new_tbody_content + footer_part

        new_content = re.sub(pending_pattern, pending_replacement, content)
        
        # Replacement for History Items
        history_pattern = r'\{historyItems\.length === 0 \? \(\s*<div className="text-center py-12">\s*<p className="text-muted-foreground">No history items<\/p>\s*<\/div>\s*\) : \(\s*(<div className="overflow-x-auto -mx-6 md:mx-0">[\s\S]*?<\/div>)\s*\)\}'
        
        def history_replacement(match):
            table_div = match.group(1)
            tbody_start = table_div.find('<tbody>') + 7
            tbody_end = table_div.rfind('</tbody>')
            
            headers_part = table_div[:tbody_start]
            rows_part = table_div[tbody_start:tbody_end]
            footer_part = table_div[tbody_end:]
            
            new_tbody_content = """
                    {historyItems.length === 0 ? (
                      <tr>
                        <td colSpan={config.historyColumns.length + 1} className="text-center py-12 text-muted-foreground">
                          No history items
                        </td>
                      </tr>
                    ) : (
                      """ + rows_part.strip() + """
                    )}"""
            
            return headers_part + new_tbody_content + footer_part

        new_content = re.sub(history_pattern, history_replacement, new_content)

        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filename}")
        else:
            print(f"No changes match for {filename}")

